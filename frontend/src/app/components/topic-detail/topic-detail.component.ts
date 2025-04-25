
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css'],
})
export class TopicDetailComponent implements OnInit {
  topic: any = null;
  isLoading = true;
  error: string | null = null;
  currentUser: number | null = null;
  voteCount: number = 0;
  commentCount: number = 0;
  viewCount!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topicService: TopicService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.loadTopic(+topicId);
      this.loadCurrentUser();
    } else {
      this.error = 'Invalid topic ID';
      this.isLoading = false;
    }
  }

  loadCurrentUser(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id;
      },
      error: (err) => {
        console.error('Error loading user:', err);
      },
    });
  }

  loadTopic(id: number): void {
    this.isLoading = true;
    this.topicService.getTopicById(id).subscribe({
      next: (topic) => {
        this.topic = {
          ...topic,
          imagePath: topic.imagePath
            ? `http://localhost:8088/internhub/topic/${topic.id}/image`
            : null,
        };

        console.log('Topic loaded:', this.topic);
        console.log('topic viewss', topic.views);

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load topic';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  upvoteTopic(): void {
    if (!this.topic?.id) return;
    this.voteCount++;
    console.log('Upvoted topic:', this.topic.id);
  }

  downvoteTopic(): void {
    if (!this.topic?.id) return;
    this.voteCount--;
    console.log('Downvoted topic:', this.topic.id);
  }
  viewTopic(id: number) {
    this.topicService.incrementViewCount(id).subscribe({
      next: (updatedTopic) => {
        this.topic.views = updatedTopic.views;
        this.viewCount = updatedTopic.views; // <-- add this line!
      },
      error: (err) => {
        console.error('Error updating view count:', err);
      },
    });
  }
}
