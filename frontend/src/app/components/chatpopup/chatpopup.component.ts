import { Component, Input, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { ChatMessage, MessageService } from 'src/app/services/message-service.service';
import { HttpClient } from '@angular/common/http';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css']
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
      }
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
      timestamp: new Date() // For immediate display
    };

    this.wsService.publish('/app/chat', message);
    this.messages.push(message as ChatMessage);
    this.newMessage = '';
  }

  loadMessages(senderId: string, recipientId: string): void {
    this.messageService.getMessages(senderId, recipientId).subscribe({
      next: (data) => {
        this.messages = data.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp) // Normalize timestamps
        }));
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
