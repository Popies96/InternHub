import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReviewService } from '../services/review.service';
import { Router } from '@angular/router';
import { RatingCriteria } from "../models/Review.model";
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  reviewForm!: FormGroup;
  ratingCriteria = Object.values(RatingCriteria);

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private jwtService: JwtService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  setRating(index: number, rating: number): void {
    const scores = this.scores.at(index);
    scores.get('score')?.setValue(rating);
  }

  initializeForm(): void {
    this.reviewForm = this.fb.group({
      internshipId: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      scores: this.fb.array([this.createScoreGroup()])
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
    const reviewerId = this.jwtService.getUserId();

    if (!reviewerId) {
      console.error('Reviewer ID is missing');
      return;
    }

    const reviewData = {
      internshipId: +formValue.internshipId,
      comment: formValue.comment,
      scores: formValue.scores.map((score: any) => ({
        criteria: score.criteria,
        score: +score.score
      }))
    };

    this.reviewService.create(reviewData).subscribe({
      next: () => {
        this.router.navigate(['/student/reviews']);
      },
      error: (error) => {
        console.error('Error creating review:', error);
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
