import { Component, OnInit } from "@angular/core";
import { ReviewService } from "../services/review.service";
import { Review } from "../models/Review.model";
import {Router} from "@angular/router";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.css"]
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  avatarUrl: string = '/assets/images/default-avatar.jpg';

  constructor(private reviewService: ReviewService, private router: Router) {}
  loadReviews(): void {
    this.reviewService.getAllReviews().subscribe((data) => {
      this.reviews = data;
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.delete(id).subscribe(() => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      });
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/student/edit-review', id]);
  }
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
}
