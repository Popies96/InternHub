import { Component } from '@angular/core';

@Component({
  selector: 'app-interview-test',
  templateUrl: './interview-test.component.html',
  styleUrls: ['./interview-test.component.css'],
})
export class InterviewTestComponent {
  conversation: { sender: string; text: string; isSign?: boolean }[] = [];

  onSignDetected(text: string) {
    // Now properly receives a string
    if (text.trim()) {
      this.conversation.push({
        sender: 'Candidate (Sign)',
        text: text,
        isSign: true,
      });
    }
  }

  sendTextMessage(message: string) {
    if (message.trim()) {
      this.conversation.push({
        sender: 'Interviewer',
        text: message,
      });
    }
  }
}
