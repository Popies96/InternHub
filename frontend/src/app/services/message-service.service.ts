import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from './web.service';

export interface ChatMessage {
  id: number;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  seen: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private wsService: WebService,private http: HttpClient) {}

  // Send a message
  sendMessage(senderId: string, recipientId: string, content: string) {
    const message = { senderId, recipientId, content }; // Create message object
    this.wsService.publish('/app/chat', message);  // Publish to WebSocket destination
  }

  // Listen for incoming messages
  listenToIncomingMessages(userId: string, callback: (msg: any) => void) {
    this.wsService.onMessage().subscribe(callback); // Subscribe to incoming messages
  }
  getMessages(senderId: string, recipientId: string): Observable<ChatMessage[]> {
    const url = `http://localhost:8088/internhub/messages/${senderId}/${recipientId}`;
    return this.http.get<ChatMessage[]>(url);
  }

  getSeenStatus(senderId: string, recipientId: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8088/internhub/seen/${senderId}/${recipientId}`);
  }

  getLastMessages(currentUserId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8088/internhub/last/${currentUserId}`);
  }
}