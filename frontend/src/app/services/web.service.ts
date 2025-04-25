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
      brokerURL: `ws://localhost:8088/internhub/ws?token=${token}`, // WebSocket broker URL
      connectHeaders: {},
    });

    // Handle WebSocket error
    this.stompClient.onStompError = (frame) => {
      console.error('Broker error:', frame.headers['message'], frame.body);
    };
  }

  // Connect to the WebSocket broker with user-specific queue
  connect(userId: string): void {
    this.stompClient.onConnect = (frame) => {
      console.log('Successfully connected to WebSocket. Frame:', frame); // Add this
      console.log('WebSocket connected');

      console.log('User ID:', userId); // Add this
      this.stompClient.subscribe(
        `/user/${userId}/queue/messages`,
        (message: IMessage) => {
          console.log('Raw message received:', message); // Add this

          const parsed = JSON.parse(message.body); // Parse incoming message

          console.log('📩 Received message from server:', parsed); // ADD THIS

          this.messageSubject.next(parsed); // Emit message to subscribers
        }
      );
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
