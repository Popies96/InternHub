import {Component, Input} from '@angular/core';
import {RecommendationService} from "../services/RecommendationService";

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent {
  @Input() internshipId!: number;
  recommendation: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.fetchRecommendation();
  }

  fetchRecommendation(regenerate: boolean = false) {
    this.loading = true;
    this.recommendationService.getRecommendation(this.internshipId, regenerate).subscribe({
      next: (res) => {
        this.recommendation = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch recommendation';
        this.loading = false;
      }
    });
  }
}
