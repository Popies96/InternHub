import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReviewService } from '../services/review.service';
import { Router } from '@angular/router';
import {RatingCriteria, Review} from "../models/Review.model";

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {

  reviewForm!: FormGroup;
  ratingCriteria = Object.values(RatingCriteria); // Now using the enum

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Load any initial data if needed
  }
  setRating(index: number, rating: number): void {
    const scores = this.scores.at(index);
    scores.get('score')?.setValue(rating); // Set the selected rating
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
    console.log('Review payload:', JSON.stringify(reviewData, null, 2));
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
