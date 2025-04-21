import { Component, Input } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { ChatMessage, MessageService } from 'src/app/services/message-service.service';
import { HttpClient } from '@angular/common/http';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css']
})
export class ChatpopupComponent {

  users: any[] = [];
  selectedUser: any = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUser = ''; // Replace with actual logged-in user ID
  recipientId = '';
  user!: User;
  UserName = '';
  lastMessages: { [userId: string]: ChatMessage } = {};


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
      this.loadMessages(this.currentUser, this.recipientId);
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
    },
    error: (err) => {
      console.error('Error fetching user from localStorage:', err);
    }
  });
  this.wsService.connect(this.currentUser); // OK to call multiple times, internally it should avoid reconnecting


  }

  // Listen for incoming messages via WebSocket (the service is responsible for keeping the connection alive)
  listenForMessages(): void {
    this.wsService.onMessage().subscribe((msg) => {
      console.log('Received message:', msg);
  
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
        // 💡 This means someone sent ME a message but I'm not chatting with them
        const userEl = document.getElementById(sender);
        if (userEl && sender !== selected) {
          const dot = userEl.querySelector('.nbr-msg') as HTMLElement;
          if (dot) {
            dot.classList.remove('hidden');
            dot.textContent = '!'; // You can also put a number here
          }
        }
      }
    });
  }
  
  

  

  // Send a message to the selected user
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message = {
      senderId: this.currentUser,
      recipientId: this.selectedUser.id,
      content: this.newMessage.trim()
    };

    // Publish message to WebSocket destination
    this.wsService.publish('/app/chat', message);

    // Add the message to the UI manually (for immediate display)
    this.messages.push({ ...message, timestamp: new Date() } as ChatMessage);
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
      }
    });
  }


  
  visible = false;
  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

}
