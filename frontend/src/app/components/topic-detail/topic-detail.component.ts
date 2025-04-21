// topic-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
  topic: any;
  isLoading = true;
  error: string | null = null;
  currentUser!: number;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.loadTopic(+topicId);
    }
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id; // Assuming the user object has an 'id' property

        // ✅ Connect WebSocket only after user is loaded
  
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      }
    });
  }

  loadTopic(id: number): void {
    this.isLoading = true;
    this.topicService.getTopicById(id).subscribe({
      next: (data) => {
        this.topic = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load topic';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  upvoteTopic(): void {
    // Implement upvote logic
  }

  downvoteTopic(): void {
    // Implement downvote logic
  }
  deleteTopic(id: number, userId: number): void {
    this.topicService.deleteTopic(id, userId).subscribe({
      next: () => {
        // Handle successful deletion (e.g., navigate back to the forum or show a success message)
      },
      error: (err) => {
        console.error('Failed to delete topic', err);
      }
    });
  }
  isCreator(): boolean {
    return this.topic && this.currentUser === this.topic.userId; // Assuming topic has userId field
  }
}