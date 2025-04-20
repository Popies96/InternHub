import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReviewService } from '../services/review.service';
import { RatingCriteria, Review } from '../models/Review.model';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css']
})
export class EditReviewComponent implements OnInit {

  reviewForm!: FormGroup;
  ratingCriteria = Object.values(RatingCriteria); // Now using the enum
  reviewId!: number;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Get the review ID from the URL
    this.route.params.subscribe(params => {
      this.reviewId = +params['id'];
      this.loadReview();
    });
  }

  initializeForm(): void {
    this.reviewForm = this.fb.group({
      reviewerId: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      revieweeId: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      internshipId: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      enterpriseId: ['', Validators.pattern(/^[1-9]\d*$/)],
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      scores: this.fb.array([this.createScoreGroup()])
    });
  }

  loadReview(): void {
    this.reviewService.getById(this.reviewId).subscribe((review: Review) => {
      // Populate the form with review data
      this.reviewForm.patchValue({
        reviewerId: review.reviewer.id,
        revieweeId: review.reviewee.id,
        internshipId: review.internship.id,
        enterpriseId: review.enterprise?.id || '',
        comment: review.comment
      });

      // Populate scores array
      const scoresArray = this.reviewForm.get('scores') as FormArray;
      review.scores.forEach(score => {
        scoresArray.push(this.fb.group({
          criteria: [score.criteria, Validators.required],
          score: [score.score, [Validators.required, Validators.min(1), Validators.max(5)]]
        }));
      });
    });
  }

  createScoreGroup(): FormGroup {
    return this.fb.group({
      criteria: ['', Validators.required],
      score: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  get scores(): FormArray {
    return this.reviewForm.get('scores') as FormArray;
  }

  addScore(): void {
    this.scores.push(this.createScoreGroup());
  }

  removeScore(index: number): void {
    if (this.scores.length > 1) {
      this.scores.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = this.reviewForm.value;
    const reviewData: Review = {
      reviewer: { id: +formValue.reviewerId },
      reviewee: { id: +formValue.revieweeId },
      internship: { id: +formValue.internshipId },
      comment: formValue.comment,
      reviewScores: formValue.scores.map((score: any) => ({
        criteria: score.criteria as RatingCriteria, // Cast to enum type
        score: +score.score
      })),
      ...(formValue.enterpriseId && { enterprise: { id: +formValue.enterpriseId } })
    };

    this.reviewService.update(this.reviewId, reviewData).subscribe({
      next: () => {
        this.router.navigate(['/student/reviews']);
      },
      error: (error) => {
        console.error('Error updating review:', error);
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.reviewForm.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        Object.values(control.controls).forEach(subControl => {
          subControl.markAsTouched();
        });
      } else {
        control.markAsTouched();
      }
    });
  }
}
