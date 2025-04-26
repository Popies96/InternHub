import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import {RatingCriteria, Review} from '../models/Review.model';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import {Chart} from "chart.js"; // Import jsPDF

@Component({
  selector: 'app-enterprise-review',
  templateUrl: './enterprise-review.component.html',
  styleUrls: ['./enterprise-review.component.css']
})
export class EnterpriseReviewComponent implements OnInit {
  reviews: Review[] = [];
  avatarUrl: string = '/assets/images/default-avatar.jpg';
  selectedInternshipId: number | null = null; // Initialize it with null
  recommendation: string = '';
  chart: any;

  constructor(
    private reviewService: ReviewService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadReviews();

  }
  createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // destroy old chart before creating a new one
    }
    const criteriaScores: { [key in RatingCriteria]?: number[] } = {};

    this.reviews.forEach(review => {
      if (review.scores && review.scores.length > 0) {
        review.scores.forEach(score => {
          const criteria = score.criteria as RatingCriteria;
          if (Object.values(RatingCriteria).includes(criteria)) {
            if (!criteriaScores[criteria]) {
              criteriaScores[criteria] = [];
            }
            criteriaScores[criteria]!.push(score.score); // Use non-null assertion (!) here
          }
        });
      }
    });

    const averageScores = Object.entries(criteriaScores).map(([criteria, scores]) => {
      if (!scores || scores.length === 0) return { criteria, avg: 0 }; // fallback just in case
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return { criteria, avg };
    });

    const chartLabels = averageScores.map(item => this.neatenCriteriaName(item.criteria));
    const chartData = averageScores.map(item => item.avg);

    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Average Score per Criterion',
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    });
  }

  loadReviews(): void {
    this.reviewService.getAllReviews().subscribe((data) => {
      this.reviews = data;
      this.createChart();
    });
  }

  getReviewerName(review: Review): string {
    return review.reviewer?.username || review.reviewer?.fullName || 'Unknown';
  }

  // Modal and recommendation handling
  showModal = false;
  internshipId!: number;

  openModal() {
    this.showModal = true;
    this.recommendation = '';
  }

  closeModal() {
    this.showModal = false;
    this.internshipId = 0;
  }

  generateRecommendation(): void {
    if (!this.selectedInternshipId) {
      console.error('No internship ID selected');
      return;
    }

    this.reviewService.generateRecommendation(this.selectedInternshipId).subscribe({
      next: (response: string) => {
        console.log('Recommendation:', response);
        this.recommendation = response;
      },
      error: (err) => {
        console.error('Error generating recommendation:', err);
      }
    });
  }

  // Download recommendation as PDF using jsPDF
  async downloadRecommendationAsPDF(): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPos = 20;

    // Header styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('AI Recommendation Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Draw a line under title
    doc.setDrawColor(100);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Recommendation section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Recommendation:', margin, yPos);
    yPos += 10;

    // Process recommendation text with page breaks
    const recommendationLines = doc.splitTextToSize(this.recommendation, pageWidth - 2 * margin);

    for (let i = 0; i < recommendationLines.length; i++) {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.text(recommendationLines[i], margin, yPos);
      yPos += 7; // Line height
    }

    yPos += 15; // Add space before chart

    // Add Chart section header
    doc.setFontSize(14);
    doc.text('Performance Metrics:', margin, yPos);
    yPos += 10;

    try {
      // Convert chart to image
      const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
      if (canvas) {
        const chartImage = await this.getChartAsImage(canvas);
        if (chartImage) {
          // Check if we need a new page for the chart
          if (yPos > pageHeight - 120) { // 120 is approximate chart height
            doc.addPage();
            yPos = 20;
          }

          // Add chart image (width: pageWidth - 2*margin, height: auto)
          const chartWidth = pageWidth - 2 * margin;
          const chartHeight = (canvas.height * chartWidth) / canvas.width;
          doc.addImage(chartImage, 'PNG', margin, yPos, chartWidth, chartHeight);
          yPos += chartHeight + 10;
        }
      }
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text('Chart could not be included', margin, yPos);
      yPos += 10;
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generated by InternHub AI', margin, pageHeight - 10);

    // Save
    doc.save('recommendation_report.pdf');
  }

  private getChartAsImage(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to blob conversion failed'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }, 'image/png');
    });

  }
  neatenCriteriaName(criteria: string): string {
    return criteria
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
