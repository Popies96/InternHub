import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from './web.service';


@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  constructor(private wsService: WebService) {}

  sendMessage(senderId: string, recipientId: string, content: string) {
    const message = { senderId, recipientId, content };
    this.wsService.publish('/app/chat', message);
  }

  listenToIncomingMessages(userId: string, callback: (msg: any) => void) {
    this.wsService.subscribeToUserQueue(userId, (message) => {
      const parsed = JSON.parse(message.body);
      callback(parsed);
    });
  }

}
