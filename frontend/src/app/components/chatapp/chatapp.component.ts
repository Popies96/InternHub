import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import {
  ChatMessage,
  MessageService,
} from 'src/app/services/message.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, UserService } from 'src/app/services/user.service';
import { catchError, Observable, throwError } from 'rxjs';
import { VoiceRecordingService } from 'src/app/services/voice-recording.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.css'],
})
export class ChatappComponent implements OnInit {
  unseenMessages: { [userId: number]: boolean } = {};
  users: any[] = [];
  selectedUser: any = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUser = ''; // Replace with actual logged-in user ID
  recipientId = '';
  user!: User;
  UserName = '';
  lastMessages: { [userId: string]: ChatMessage } = {};

  isRecording = false;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioMessages: ChatMessage[] = []; // Add this for tracking audio messages
  snackBar: any;

  constructor(
    private wsService: WebService,
    private messageService: MessageService,
    private http: HttpClient,
    private userService: UserService,
    private voiceRecordingService: VoiceRecordingService
  ) {}

  ngOnInit(): void {
    // Fetch user from localStorage and establish WebSocket connection
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id; // Assuming the user object has an 'id' property
        this.UserName = user.nom; // Assuming you need the username as well
        console.log('UserName:', this.UserName);

        this.wsService.connect(String(this.currentUser)); // OK to call multiple times, internally it should avoid reconnecting
        this.loadUsersAndLastMessages();

        this.listenForMessages();
        // ✅ Connect WebSocket only after user is loaded
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      },
    });

    // Fetch the list of users to display in the UI
  }

  // Listen for incoming messages via WebSocket (the service is responsible for keeping the connection alive)
  listenForMessages(): void {
    this.wsService.onMessage().subscribe((msg) => {
      console.log('Received message:', msg);

      msg.timestamp = new Date(msg.timestamp);

      const sender = String(msg.senderId);
      const recipient = String(msg.recipientId);
      const selected = String(this.selectedUser?.id);
      const current = String(this.currentUser);

      this.messages.push(msg);
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.recipientId = user.id;

    console.log(
      `Selecting user ${user.id}, current user is ${this.currentUser}`
    );

    this.loadMessages(this.currentUser, this.recipientId);
    console.log('Type of current user:', typeof this.currentUser);

    this.unseenMessages[user.id] = true;
    if (this.unseenMessages[user.id]) {
      delete this.unseenMessages[user.id];
    }
  }

  // Send a message to the selected user
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message = {
      senderId: this.currentUser,
      recipientId: this.selectedUser.id,
      content: this.newMessage.trim(),
      timestamp: new Date(),
    };

    // Publish message to WebSocket destination
    this.wsService.publish('/app/chat', message);

    // Add the message to the UI manually (for immediate display)
    this.messages.push({ ...message } as ChatMessage);
    this.newMessage = ''; // Reset input field
  }

  // Load previous messages between the sender and recipient
  loadMessages(senderId: string, recipientId: string): void {
    this.messageService.getMessages(senderId, recipientId).subscribe({
      next: (data) => {
        console.log('Fetched messages:', data);
        this.messages = data;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      },
    });
  }

  loadUsersAndLastMessages(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((u) => u.id !== +this.currentUser); // Exclude self

        // Load last messages
        this.messageService.getLastMessages(this.currentUser).subscribe({
          next: (lastMsgsMap) => {
            this.lastMessages = lastMsgsMap;

            // 🔥 Loop through users and check seen status
            this.users.forEach((user) => {
              this.messageService
                .getSeenStatus(user.id, this.currentUser)
                .subscribe({
                  next: (seen) => {
                    this.unseenMessages[user.id] = !seen; // true = unseen
                    console.log(`User ${user.id} => unseen:`, seen);
                  },
                  error: (err) => {
                    console.error(
                      `Error checking seen for user ${user.id}:`,
                      err
                    );
                  },
                });
            });
          },
          error: (err) => {
            console.error('Error fetching last messages:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  // Update your recording methods like this:
  audioContext: AudioContext | null = null;
  monitorNode: MediaStreamAudioSourceNode | null = null;
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
}
