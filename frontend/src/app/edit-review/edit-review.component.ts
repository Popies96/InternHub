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
  ratingCriteria = Object.values(RatingCriteria);
  reviewId!: number;
  reviewee! : number;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reviewId = +params['id'];
      this.loadReview();
    });
  }


  initializeForm(): void {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      scores: this.fb.array([])
    });
  }



  loadReview(): void {
    this.reviewService.getById(this.reviewId).subscribe((review: Review) => {

      this.reviewForm.patchValue({
        comment: review.comment,
         // <-- safely access it
      });

      const scoresArray = this.reviewForm.get('scores') as FormArray;
      review.scores.forEach(score => {
        scoresArray.push(this.fb.group({
          criteria: [score.criteria, Validators.required],
          score: [score.score, [Validators.required, Validators.min(1), Validators.max(5)]]
        }));
      });
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

  createScoreGroup(): FormGroup {
    return this.fb.group({
      criteria: ['', Validators.required],
      score: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = this.reviewForm.value;

    const updatedReview: Partial<Review> = {
      comment: formValue.comment,
      reviewer: { id: 1 },
      reviewee:{id:2},
      scores: formValue.scores.map((score: any) => ({
        criteria: score.criteria as RatingCriteria,
        score: +score.score
      }))
    };


    this.reviewService.update(this.reviewId, updatedReview as Review).subscribe({
      next: () => this.router.navigate(['/student/reviews']),
      error: error => console.error('Error updating review:', error)
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
