import { Component } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.css']
})
export class ChatappComponent {
  messages: any[] = [];

  constructor(private wsService: WebService) {

  }

  ngOnInit(): void {
    const username = 'zebi'; // replace with dynamic value
    this.wsService.connect(username);
    this.wsService.onMessage().subscribe((msg) => {
      console.log('New message:', msg);
      this.messages.push(msg);
    });
  }

  sendTest() {
    const username = "zebi@gmail.com"; // replace with dynamic value
    const username1 = 'sorm'; // replace with dynamic value

    this.wsService.sendMessage('/app/chat', { 
      senderId: username,
      recipientId: username1,
      content: 'Hello from Angular!'
    });
  }

}
