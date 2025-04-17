import { Injectable } from '@angular/core';
import { Client as StompClient, IMessage } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebService {

  private stompClient: StompClient;
  private messageSubject = new Subject<any>();

  constructor() {
    const token = localStorage.getItem('token'); // Assuming JWT token stored in local storage

    this.stompClient = new StompClient({
      brokerURL: 'ws://localhost:8088/internhub/ws', // WebSocket broker URL
      connectHeaders: {
        Authorization: `Bearer ${token}` // Send JWT in headers for authentication
      },
      reconnectDelay: 1000,  // Retry connection after 1 second if connection is lost
      debug: (msg) => console.log(msg), // Log WebSocket messages for debugging
    });

    // Handle WebSocket error
    this.stompClient.onStompError = (frame) => {
      console.error('Broker error:', frame.headers['message'], frame.body);
    };
  }

  // Connect to the WebSocket broker
  connect(username: string): void {
    this.stompClient.onConnect = () => {
      console.log('WebSocket connected');
      // Subscribe to user-specific message queue
      this.stompClient.subscribe(`/internhub/user/queue/messages`, (message: IMessage) => {
        const parsed = JSON.parse(message.body);  // Parse incoming message
        console.log('📩 Received message from server:', parsed); // ADD THIS
        this.messageSubject.next(parsed);  // Emit message to subscribers
      });
    };

    this.stompClient.activate(); // Activate WebSocket connection
    console.log('WebSocket connection initiated');
  }

  // Publish a message to a specific destination
  publish(destination: string, message: any) {
    if (this.stompClient.connected) {
      this.stompClient.publish({ destination, body: JSON.stringify(message) });
    } else {
      console.error('STOMP is not connected');
    }
  }

  // Observable to listen for incoming messages
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
