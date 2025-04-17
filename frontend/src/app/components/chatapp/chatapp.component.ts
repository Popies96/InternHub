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
        this.UserName = user[0].username; // Assuming you need the username as well
        console.log('UserName:', this.UserName);

        // ✅ Connect WebSocket only after user is loaded
  
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      }
    });

    // Fetch the list of users to display in the UI
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Fetched users:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // Listen for incoming messages via WebSocket (the service is responsible for keeping the connection alive)
  listenForMessages(): void {
    this.wsService.onMessage().subscribe((msg) => {
      console.log('Received message:', msg);
      // Only add the message if it is for the selected user
      if (
        msg.senderId === this.selectedUser?.id ||
        msg.recipientId === this.selectedUser?.id
      ) {
        this.messages.push(msg);
      }
    });
  }

  // Select a user for messaging
  selectUser(user: any): void {
    this.selectedUser = user;
    this.recipientId = user.id;
    console.log('Recipient ID:', this.recipientId);
    this.wsService.connect(this.recipientId); 

    this.loadMessages(this.currentUser, this.recipientId);
    this.listenForMessages();

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