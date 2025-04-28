import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

const baseUrl = 'ws://localhost:8088';
@Injectable({
  providedIn: 'root',
})
export class TaskNotificationService {
  private stompClient: Client;
  public newTaskNotification = new Subject<any>();
  private isConnected = false;

  constructor() {
    const token = localStorage.getItem('token');

    this.stompClient = new Client({
      brokerURL: `ws://localhost:8088/internhub/ws?token=${token}`,
      connectHeaders: {},
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error:', frame.headers['message'], frame.body);
      this.isConnected = false;
    };
  }

  connect(studentId: number): void {
    if (this.isConnected) {
      console.log('Already connected to WebSocket');
      return;
    }

    console.log('Attempting to connect for student ID:', studentId);

    this.stompClient.onConnect = (frame) => {
      this.isConnected = true;
      console.log('WebSocket connected successfully. Frame:', frame);

      const subscription = this.stompClient.subscribe(
        `/user/${studentId}/topic/tasks`,
        (message: IMessage) => {
          console.log('Received notification:', message);
          try {
            const notification = JSON.parse(message.body);
            this.newTaskNotification.next(notification);
          } catch (e) {
            console.error('Error parsing notification:', e);
          }
        }
      );
      console.log(
        'Subscribed to notifications. Subscription ID:',
        subscription.id
      );
    };

    this.stompClient.onDisconnect = () => {
      this.isConnected = false;
      console.log('WebSocket disconnected');
    };

    this.stompClient.activate();
  }

  onMessage(): Observable<any> {
    return this.newTaskNotification.asObservable();
  }

  sendNotification(message: any) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('Cannot send notification - WebSocket not connected');
      return;
    }

    try {
      this.stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(message),
      });
      console.log('Notification sent successfully:', message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  disconnect(): void {
    if (this.stompClient?.active) {
      this.stompClient.deactivate().then(() => {
        this.isConnected = false;
        console.log('WebSocket intentionally disconnected');
      });
    }
  }
}
