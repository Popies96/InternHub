import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { ChatMessage, MessageService } from 'src/app/services/message-service.service';
import { HttpClient } from '@angular/common/http';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.css']
})
export class ChatappComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUser = ''; // Replace with actual logged-in user ID
  recipientId = '';
  user!: User;
  UserName = '';

  constructor(
    private wsService: WebService,
    private messageService: MessageService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Fetch user from localStorage and establish WebSocket connection
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user[0].id; // Assuming the user object has an 'id' property
        this.UserName = user[0].nom; // Assuming you need the username as well
        console.log('UserName:', this.UserName);

        // ✅ Connect WebSocket only after user is loaded
  
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      }
    });
    this.listenForMessages();

    // Fetch the list of users to display in the UI
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Convert currentUser to number before comparing
        this.users = users.filter(user => user.id !== +this.currentUser);
        console.log('Fetched users:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
    
  }

  // Listen for incoming messages via WebSocket (the service is responsible for keeping the connection alive)
  listenForMessages(): void {
    console.log('Setting up message listener...');
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
      } else {
        console.log('Message is not for current chat. Ignoring.');
      }
    });
  }
  
  selectUser(user: any): void {
    this.selectedUser = user;
    this.recipientId = user.id;
    console.log(`Selecting user ${user.id}, current user is ${this.currentUser}`);
  
    this.wsService.connect(this.currentUser); // OK to call multiple times, internally it should avoid reconnecting
  
    this.loadMessages(this.currentUser, this.recipientId);
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
}