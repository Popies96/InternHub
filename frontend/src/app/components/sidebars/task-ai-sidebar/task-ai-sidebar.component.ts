import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/models ';
import { InternshipAiService } from 'src/app/services/internship-ai.service';

@Component({
  selector: 'app-task-ai-sidebar',
  templateUrl: './task-ai-sidebar.component.html',
  styleUrls: ['./task-ai-sidebar.component.css'],
})
export class TaskAiSidebarComponent implements OnInit {
  isCompact = false;
  internshipId: number | null = null;
  activeTaskId: number | null = null;
  tasks: Task[] = [];
  loading = true;

  constructor(
    private router: Router,
    private internshipAiService: InternshipAiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.internshipId = this.route.snapshot.params['id'];
    if (this.internshipId !== null) {
      this.internshipAiService.getInternshipAiById(this.internshipId).subscribe(
        (data) => {
          this.tasks = data.taskAiList;
          this.loading = false;
          
        },
        (error) => {
          console.error('Error fetching tasks:', error);
          this.loading = false;
        }
      );
    }
  }

  getMockTasks(): Task[] {
    return [
      {
        id: 1,
        title: 'Natural Language Processing',
        description: 'Implement sentiment analysis for user feedback',
        responseType: 'text',
        status: 'in_progress',
      },
      {
        id: 2,
        title: 'Image Recognition',
        description: 'Train model to identify objects in images',
        responseType: 'image',
        status: 'pending',
      },
      {
        id: 3,
        title: 'Data Cleaning',
        description: 'Prepare dataset for machine learning',
        responseType: 'data',
        status: 'completed',
      },
      {
        id: 4,
        title: 'API Integration',
        description: 'Connect AI model to REST API endpoints',
        responseType: 'json',
        status: 'in_progress',
      },
      {
        id: 5,
        title: 'Performance Optimization',
        description: 'Reduce model inference time by 30%',
        responseType: 'metrics',
        status: 'failed',
      },
    ];
  }

  toggleSidebar(): void {
    this.isCompact = !this.isCompact;
  }

  navigateToTask(task: Task): void {
    this.activeTaskId = task.id;
    this.router.navigate(['workflow', this.internshipId, 'task', task.id]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'IN_PROGRESS':
        return 'blue';
      case 'PENDING':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  getResponseTypeIcon(responseType: string): string {
    switch (responseType) {
      case 'text':
        return 'fa-file-alt';
      case 'image':
        return 'fa-image';
      case 'json':
        return 'fa-code';
      case 'data':
        return 'fa-database';
      default:
        return 'fa-question';
    }
  }
}
