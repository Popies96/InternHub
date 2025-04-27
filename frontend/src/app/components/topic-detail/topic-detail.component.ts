import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService, Comment as TopicComment } from 'src/app/services/comment.service';
import { TopicService } from 'src/app/services/topic.service';
import { User, UserService } from 'src/app/services/user.service';
import { TopicReactionService } from 'src/app/services/topic-reaction.service';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
  topic: any = null;
  isLoading = true;
  error: string | null = null;
  currentUser: number | null = null;
  commentCount: number = 0;
  viewCount!: number;
  comments: TopicComment[] = [];
  newCommentContent: string = '';
  likes: number = 0;
  dislikes: number = 0;
  userReaction: 'like' | 'dislike' | 'none' |null = null;
  name: string | null = null;
  Current!:User ;
  TopicUser!:User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topicService: TopicService,
    private userService: UserService,
    private commentService: CommentService,
    private topicReactionService: TopicReactionService,
    private cdr: ChangeDetectorRef // <-- inject

  ) {}

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.loadTopic(+topicId);
      this.loadCurrentUser();
      this.loadComments(+topicId);
      this.loadCommentCount(+topicId);
      this.loadReactions(+topicId);
    } else {
      this.error = 'Invalid topic ID';
      this.isLoading = false;
    }
    this.viewTopic(+topicId!);
  }

  loadCurrentUser(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id;
        this.Current=user;
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
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
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load topic';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadReactions(topicId: number): void {
    this.topicReactionService.countLikes(topicId).subscribe(count => this.likes = count);
    this.topicReactionService.countDislikes(topicId).subscribe(count => this.dislikes = count);
    
    if (this.currentUser) {
      this.topicReactionService.getUserReaction(topicId, this.currentUser).subscribe(
        reaction => this.userReaction = reaction === 'LIKE' ? 'like' : reaction === 'DISLIKE' ? 'dislike' : null
      );
    }
  }

  react(reactionType: 'like' | 'dislike'): void {
    if (!this.topic?.id || !this.currentUser) return;

    this.topicReactionService.reactToTopic(this.topic.id, this.currentUser, reactionType).subscribe({
      next: () => {
        this.loadReactions(this.topic.id);
      },
      error: (err) => {
        console.error('Error reacting to topic:', err);
      }
    });
  }

  viewTopic(id: number) {
    this.topicService.incrementViewCount(id).subscribe({
      next: (updatedTopic) => {
        this.topic.views = updatedTopic.views;
        this.viewCount = updatedTopic.views;
      },
      error: (err) => {
        console.error('Error updating view count:', err);
      }
    });
  }

  loadComments(topicId?: number): void {
    if (topicId) {
      this.commentService.getCommentsByTopic(topicId).subscribe({
        next: (comments) => {
          this.comments = comments as TopicComment[];
        },
        error: (err) => {
          console.error('Error loading comments', err);
        }
      });
    }
  }

  addComment() {
    if (!this.newCommentContent.trim() || !this.currentUser || !this.topic?.id) return;

    const comment: TopicComment = {
      comment: this.newCommentContent,
      user: this.Current,
      topicId: this.topic.id
    };

    this.commentService.addComment(comment, comment.topicId, comment.user.id).subscribe({
      next: (createdComment) => {
        this.comments.push(createdComment);
        this.newCommentContent = '';
        this.commentCount++;
      },
      error: (err) => {
        console.error('Error adding comment', err);
      }
    });
  }

  loadCommentCount(topicId: number): void {
    this.commentService.CommentCount(topicId).subscribe({
      next: (count) => {
        this.commentCount = count;
      },
      error: (err) => {
        console.error('Error loading comment count', err);
      }
    });
  }

  deleteComment(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      if (this.currentUser === null) return console.error('Current user is null');
      this.commentService.deleteComment(commentId, this.currentUser).subscribe(() => {
        this.comments = this.comments.filter(c => c.id !== commentId);
      }, error => {
        console.error('Delete failed', error);
      });
    }
  }
  
  editComment(comment: any) {
    const updatedContent = prompt('Edit your comment:', comment.comment);
    if (updatedContent !== null && updatedContent.trim() !== '') {
      if (this.currentUser === null) return console.error('Current user is null');

      this.commentService.updateComment(comment.id, updatedContent,this.currentUser).subscribe(updated => {
        comment.comment = updated.comment; // update in UI
      }, error => {
        console.error('Update failed', error);
      });
    }
  }
}