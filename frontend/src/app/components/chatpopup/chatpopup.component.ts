import { Component, Input, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import {
  ChatMessage,
  MessageService,
} from 'src/app/services/message.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, UserService } from 'src/app/services/user.service';
import { Observable, throwError, catchError } from 'rxjs';

@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css'],
})
export class ChatpopupComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUser = '';
  recipientId = '';
  user!: User;
  UserName = '';
  lastMessages: { [userId: string]: ChatMessage } = {};
  visible = false;
  isRecording = false;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioMessages: ChatMessage[] = []; // Add this for tracking audio messages
  snackBar: any;

  constructor(
    private wsService: WebService,
    private messageService: MessageService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  @Input() set SelectedUserInput(user: User | undefined) {
    if (user) {
      this.selectedUser = user;
      this.recipientId = String(user.id);
      if (this.currentUser) {
        this.loadMessages(this.currentUser, this.recipientId);
      }
    }
  }

  ngOnInit(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = String(user.id);
        this.UserName = user.nom;

        if (this.selectedUser) {
          this.recipientId = this.selectedUser.id;
          this.loadMessages(this.currentUser, this.recipientId);
        }

        this.wsService.connect(this.currentUser);
        this.listenForMessages();
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      },
    });
  }

  listenForMessages(): void {
    this.wsService.onMessage().subscribe((msg) => {
      console.log('Received message:', msg);

      // Normalize timestamp
      const sender = String(msg.senderId);
      const recipient = String(msg.recipientId);
      const selected = String(this.selectedUser?.id);
      const current = String(this.currentUser);

      const isCurrentChat =
        (sender === selected && recipient === current) ||
        (sender === current && recipient === selected);

      if (isCurrentChat) {
        this.messages.push(msg);
        setTimeout(() => {
          const chatArea = document.querySelector('.chat-area');
          if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
        }, 50);
      } else if (recipient === current) {
        // Someone sent me a message from another conversation
        const userEl = document.getElementById(sender);
        if (userEl && sender !== selected) {
          const dot = userEl.querySelector('.nbr-msg') as HTMLElement;
          if (dot) {
            dot.classList.remove('hidden');
            dot.textContent = '!'; // Optional: show number of new messages
          }
        }
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message = {
      senderId: this.currentUser,
      recipientId: this.selectedUser.id,
      content: this.newMessage.trim(),
      timestamp: new Date(), // For immediate display
    };

    this.wsService.publish('/app/chat', message);
    this.messages.push(message as ChatMessage);
    this.newMessage = '';
  }

  loadMessages(senderId: string, recipientId: string): void {
    this.messageService.getMessages(senderId, recipientId).subscribe({
      next: (data) => {
        this.messages = data.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Normalize timestamps
        }));
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      },
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  sendAudioMessage(audioUrl: string): void {
    const message = {
      senderId: this.currentUser,
      recipientId: this.selectedUser.id,
      content: '',
      messageType: 'AUDIO',
      audioUrl: audioUrl, // Use the audioUrl from the backend response
      timestamp: new Date(),
    };

    // Publish audio message to WebSocket destination
    this.wsService.publish('/app/chat', message);

    // Add the message to the UI manually (for immediate display)
    this.messages.push({ ...message } as ChatMessage);
  }
  uploadAudio(audioBlob: Blob) {
    if (!this.selectedUser) {
      console.error('No user selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('senderId', this.currentUser);
    formData.append('recipientId', this.selectedUser.id);

    this.http
      .post('http://localhost:8088/internhub/upload-audio', formData)
      .subscribe({
        next: (response: any) => {
          console.log('Audio uploaded successfully:', response);
          if (response.audioUrl) {
            this.sendAudioMessage(response.audioUrl);
          }
        },
        error: (err) => {
          console.error('Error uploading audio:', err);
        },
      });
  }
  // Update your recording methods like this:
  audioContext: AudioContext | null = null;
  monitorNode: MediaStreamAudioSourceNode | null = null;
  async startRecording() {
    if (this.isRecording) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const preferredMic = devices.find(
        (device) =>
          device.kind === 'audioinput' &&
          device.label.includes(
            'your microphone name or a unique part of its ID'
          )
      );

      const constraints: MediaStreamConstraints = {
        audio: preferredMic ? { deviceId: preferredMic.deviceId } : true,
        video: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Recording with constraints:', constraints);
      console.log('Audio Tracks:', stream.getAudioTracks());
      stream.getAudioTracks().forEach((track) => {
        console.log('Track ID:', track.id);
        console.log('Track Kind:', track.kind);
        console.log('Track Label:', track.label);
        console.log('Track Enabled:', track.enabled);
        console.log('Track Muted:', track.muted);
        console.log('Track Settings:', track.getSettings());
      });

      if (stream.getAudioTracks().length === 0) {
        throw new Error('No audio tracks available after explicit constraints');
      }

      // **COMMENT OUT OR REMOVE THIS LINE TO PREVENT LIVE MONITORING:**
      // this.setupAudioMonitoring(stream);

      this.setupMediaRecorder(stream);
      this.isRecording = true;
    } catch (error) {
      console.error('Recording failed:', error);
      this.snackBar.open(
        'Microphone access denied or issue with device',
        'Dismiss',
        { duration: 3000 }
      );
    }
  }
  private setupAudioMonitoring(stream: MediaStream) {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.monitorNode = this.audioContext.createMediaStreamSource(stream);
      this.monitorNode.connect(this.audioContext.destination); // This line causes the feedback
    } catch (e) {
      console.warn('Audio monitoring not available', e);
    }
  }

  private setupMediaRecorder(stream: MediaStream) {
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        console.log('Audio chunk received:', event.data.size); // Log the size of each chunk
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      console.log(
        'Recording stopped, total chunks:',
        this.audioChunks.length,
        'Blob size:',
        audioBlob.size
      );

      stream.getTracks().forEach((track) => track.stop());
      if (this.monitorNode) {
        this.monitorNode.disconnect();
      }
      if (this.audioContext) {
        this.audioContext.close();
      }

      if (this.selectedUser && audioBlob.size > 0) {
        // Only upload if there's data
        this.uploadAudio(audioBlob);
      } else if (this.selectedUser && audioBlob.size === 0) {
        this.snackBar.open('No audio data recorded', 'Dismiss', {
          duration: 3000,
        });
      }
    };

    this.mediaRecorder.start(100);
  }
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
  fetchAudioMessages(senderId: string, recipientId: string): void {
    this.messageService.getMessages(senderId, recipientId).subscribe({
      next: (messages: ChatMessage[]) => {
        // Process audio messages
        this.audioMessages = messages.filter((msg) => msg.audioUrl);

        // Merge with existing messages, removing duplicates
        this.messages = this.mergeMessages(this.messages, messages);

        console.log('Audio messages loaded:', this.audioMessages);
      },
      error: (err) => {
        console.error('Error fetching audio messages:', err);
      },
    });
  }

  private mergeMessages(
    existing: ChatMessage[],
    newMessages: ChatMessage[]
  ): ChatMessage[] {
    const merged = [...existing, ...newMessages];
    return merged.filter(
      (msg, index, self) =>
        index ===
        self.findIndex(
          (m) =>
            m.id === msg.id ||
            (m.timestamp?.getTime() === msg.timestamp?.getTime() &&
              m.senderId === msg.senderId)
        )
    );
  }
  // If you need to fetch a single audio
  filefetchAudioFile(audioUrl: string): Observable<Blob> {
    if (!audioUrl) {
      return throwError(() => new Error('Audio URL is empty'));
    }

    const fullUrl = this.getFullAudioUrl(audioUrl);

    return this.http
      .get(fullUrl, {
        responseType: 'blob',
        headers: {
          Accept: 'audio/webm, audio/ogg, audio/mpeg',
        },
      })
      .pipe(
        catchError((err) => {
          console.error('Error fetching audio file:', err);
          if (this.snackBar) {
            this.snackBar.open('Failed to load audio', 'Dismiss', {
              duration: 3000,
            });
          }
          return throwError(() => err);
        })
      );
  }

  private getFullAudioUrl(audioUrl: string): string {
    // If URL is already absolute, return as-is
    if (audioUrl.startsWith('http')) return audioUrl;

    // Construct full URL
    return `http://localhost:8088/internhub/audio/${encodeURIComponent(
      audioUrl
    )}`;
  }
  // Example usage:
  playAudioMessage(message: ChatMessage): void {
    if (!message.audioUrl) return;
    console.log('Playing audio message:', message.audioUrl);
    this.filefetchAudioFile(message.audioUrl).subscribe({
      next: (blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        audio.play().catch((e) => {
          console.error('Audio playback error:', e);
          this.snackBar.open('Failed to play audio', 'Dismiss', {
            duration: 3000,
          });
        });

        audio.onended = () => URL.revokeObjectURL(audioUrl);
      },
      error: (err) => {
        console.error('Error fetching audio file:', err);
        this.snackBar.open('Failed to fetch audio', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  private handleAudioError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Failed to load audio';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    this.snackBar.open(errorMessage, 'Dismiss', { duration: 5000 });
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Dismiss', { duration: 3000 });
  }
  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }
  isEmojiPickerVisible = false;
  emojis = [
    '😀',
    '😁',
    '😂',
    '🤣',
    '😃',
    '😄',
    '😅',
    '😆',
    '😉',
    '😊',
    '😋',
    '😎',
    '😍',
    '😘',
    '😜',
    '🤔',
    '🤩',
    '🥺',
  ];

  addEmoji(emoji: string) {
    this.newMessage += emoji; // Assuming newMessage is your message input model
    this.isEmojiPickerVisible = false; // Hide picker after emoji is selected
  }
}
