import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  interviews: any[] = [];

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (data) => {
        console.log('Data received from backend:', data);
        this.interviews = data;
      },
      error: (err) => {
        console.error('Failed to load interviews', err);
      }
    });
  }
  

  extractMeetingId(link: string): string {
    const parts = link.split('/');
    return parts[parts.length - 1];
  }
}
