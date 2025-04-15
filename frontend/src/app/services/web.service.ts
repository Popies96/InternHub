import { Injectable } from '@angular/core';
import { Client as StompClient, IMessage } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  publish(arg0: string, message: { senderId: string; recipientId: string; content: string; }) {
    throw new Error('Method not implemented.');
  }
  subscribeToUserQueue(userId: string, arg1: (message: any) => void) {
    throw new Error('Method not implemented.');
  }
  private stompClient: StompClient;
  private messageSubject = new Subject<any>();
  constructor() {
    const token = localStorage.getItem('token');

    this.stompClient = new StompClient({
      brokerURL: 'ws://localhost:8088/internhub/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}` // 👈 JWT here
      },
      reconnectDelay: 1000000,
      debug: (msg) => console.log(msg),
    });

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error:', frame.headers['message'], frame.body);
    };
  }

  connect(username: string): void {

    
    this.stompClient.onConnect = () => {
      console.log('WebSocket connected');

      this.stompClient.subscribe(`/user/${username}/queue/messages`, (message: IMessage) => {
        const parsed = JSON.parse(message.body);
        this.messageSubject.next(parsed);
      });
    };

    this.stompClient.activate();
    console.log('WebSocket connection initiated');
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendMessage(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('STOMP is not connected');
    }
  }
}
