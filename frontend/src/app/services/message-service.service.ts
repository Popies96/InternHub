import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from './web.service';

export interface ChatMessage {
  id: number;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'TEXT' | 'AUDIO';  // New property to differentiate message types
  audioUrl?: string;  // Audio URL for audio messages
  timestamp: Date;
  seen: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private wsService: WebService, private http: HttpClient) {}

  // Send a text or audio message
  sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    messageType: 'TEXT' | 'AUDIO',
    audioUrl?: string
  ) {
    const message = { senderId, recipientId, content, messageType, audioUrl };
    this.wsService.publish('/app/chat', message);  // Publish to WebSocket destination
  }

  // Upload audio and send audio message
  uploadAudioAndSendMessage(
    senderId: string, 
    recipientId: string, 
    file: Blob
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, 'voiceMessage.webm');
    formData.append('senderId', senderId);
    formData.append('recipientId', recipientId);

    return this.http.post<any>('http://localhost:8088/internhub/upload-audio', formData);
  }

  // Listen for incoming messages
  listenToIncomingMessages(userId: string, callback: (msg: any) => void) {
    this.wsService.onMessage().subscribe(callback);  // Subscribe to incoming messages
  }

  // Get all messages between a sender and recipient
  getMessages(senderId: string, recipientId: string): Observable<ChatMessage[]> {
    const url = `http://localhost:8088/internhub/messages/${senderId}/${recipientId}`;
    return this.http.get<ChatMessage[]>(url);
  }

  // Get seen status of messages between sender and recipient
  getSeenStatus(senderId: string, recipientId: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8088/internhub/seen/${senderId}/${recipientId}`);
  }

  // Get the last messages between the current user and others
  getLastMessages(currentUserId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8088/internhub/last/${currentUserId}`);
  }

  getUnseenMessagesCount(userId: string): Observable<number> {
    return this.http.get<number>(`http://localhost:8088/internhub/unseen-count/${userId}`);
  }
}
