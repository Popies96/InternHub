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
      }
    });

    // Fetch the list of users to display in the UI




  }

  // Listen for incoming messages via WebSocket (the service is responsible for keeping the connection alive)
  listenForMessages(): void {
    this.wsService.onMessage().subscribe((msg) => {
      console.log('Received message:ddddddddddddddddddd', msg);
  
      msg.timestamp = new Date(msg.timestamp);

      const sender = String(msg.senderId);
      const recipient = String(msg.recipientId);
      const selected = String(this.selectedUser?.id);
      const current = String(this.currentUser);
  

        this.messages.push(msg)
     
      
    });
  }
  
  
  selectUser(user: any): void {
    this.selectedUser = user;
    this.recipientId = user.id;

    console.log(`Selecting user ${user.id}, current user is ${this.currentUser}`);

    this.loadMessages(this.currentUser, this.recipientId);
    console.log("type of this current user", typeof this.currentUser);
     
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
      timestamp: new Date()
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
      }
    });
  }
  
  loadUsersAndLastMessages(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter(u => u.id !== +this.currentUser); // Exclude self
  
        // Load last messages
        this.messageService.getLastMessages(this.currentUser).subscribe({
          next: (lastMsgsMap) => {
            this.lastMessages = lastMsgsMap;
  
            // 🔥 Loop through users and check seen status
            this.users.forEach(user => {
              this.messageService.getSeenStatus(user.id, this.currentUser).subscribe({
                next: (seen) => {
                  this.unseenMessages[user.id] = !seen; // true = unseen
                  console.log(`User ${user.id} => unseen:`, seen);
                },
                error: (err) => {
                  console.error(`Error checking seen for user ${user.id}:`, err);
                }
              });
            });
          },
          error: (err) => {
            console.error('Error fetching last messages:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }


}