import { Component, OnInit } from "@angular/core";
import { ReviewService } from "../services/review.service";
import { Review } from "../models/Review.model";
import { Router } from "@angular/router";


@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.css"]
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  avatarUrl: string = '/assets/images/default-avatar.jpg';
  recommendation: string = '';

  constructor(
    private reviewService: ReviewService,
    private router: Router,

  ) {}



  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.delete(id).subscribe(() => {
        this.reviews = this.reviews.filter((r) => r.id !== id);
      });
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/student/edit-review', id]);
  }

  userName: string = '';

  ngOnInit(): void {
    this.reviewService.getAllReviews().subscribe(
      (data: Review[]) => {
        console.log('Reviews:', data);
        this.reviews = data;
      },
      (error) => {
        console.error("Error fetching reviews:", error);
      }
    );


  }
 /* canEdit(review: Review): boolean {
    return review.reviewer?.id === this.currentUserId;
  }

  canDelete(review: Review): boolean {
    return review.reviewer?.id === this.currentUserId || this.isAdmin;
  }
*/

  neatenCriteriaName(criteria: string): string {
    return criteria
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }



  internshipId!: number;


  getReviewerName(review: Review): string {
    return review.reviewer?.username || review.reviewer?.fullName || 'Unknown';
  }




}
