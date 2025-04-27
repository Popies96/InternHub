import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  interviews: any[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    height: 600,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: []
  };

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews() {
    this.interviewService.getAllInterviews().subscribe({
      next: (data) => {
        console.log('Data received from backend:', data);
        this.interviews = data;
        this.populateCalendarWithEvents();
      },
      error: (err) => {
        console.error('Failed to load interviews', err);
      }
    });
  }
  populateCalendarWithEvents() {
    const events = this.interviews.map(interview => ({
      title: `Interview # ${interview.id}`, 
      date: interview.scheduledDate,
      description: `Interview for Application #${interview.applicationId}`,
      color: interview.mode === 'ONLINE' ? '#1e40af' : '#34d399'
    }));
    this.calendarOptions.events = events;
  }

  extractMeetingId(link: string): string {
    const parts = link.split('/');
    return parts[parts.length - 1];
  }
}
