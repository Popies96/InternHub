import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js';
import { Review, RatingCriteria } from 'src/app/models/reviewModel';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-enterprise-review',
  templateUrl: './enterprise-review.component.html',
  styleUrls: ['./enterprise-review.component.css'],
})
export class EnterpriseReviewComponent implements OnInit {
  reviews: Review[] = [];
  avatarUrl: string = '/assets/images/default-avatar.jpg';
  selectedInternshipId: number | null = null;
  recommendation: string = '';
  chart: any;

  constructor(private reviewService: ReviewService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReviews();
  }
  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const criteriaScores: { [key in RatingCriteria]?: number[] } = {};

    this.reviews.forEach((review) => {
      if (review.scores && review.scores.length > 0) {
        review.scores.forEach((score) => {
          const criteria = score.criteria as RatingCriteria;
          if (Object.values(RatingCriteria).includes(criteria)) {
            if (!criteriaScores[criteria]) {
              criteriaScores[criteria] = [];
            }
            criteriaScores[criteria]!.push(score.score);
          }
        });
      }
    });

    const averageScores = Object.entries(criteriaScores).map(
      ([criteria, scores]) => {
        if (!scores || scores.length === 0) return { criteria, avg: 0 };
        const avg =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return { criteria, avg };
      }
    );

    const chartLabels = averageScores.map((item) =>
      this.neatenCriteriaName(item.criteria)
    );
    const chartData = averageScores.map((item) => item.avg);

    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Average Score per Criterion',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
          },
        },
      },
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

    this.reviewService
      .generateRecommendation(this.selectedInternshipId)
      .subscribe({
        next: (response: string) => {
          console.log('Recommendation:', response);
          this.recommendation = response;
        },
        error: (err) => {
          console.error('Error generating recommendation:', err);
        },
      });
  }

  async downloadRecommendationAsPDF(): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Increased margin for better whitespace
    let yPos = 25;

    // Clean the recommendation text by removing special characters
    const cleanRecommendation = this.recommendation.replace(/[*#]/g, '');

    // Add company header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('InternHub Performance Evaluation', pageWidth / 2, yPos, {
      align: 'center',
    });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    yPos += 8;
    doc.text('Confidential Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // Add report date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${formattedDate}`, margin, yPos);
    yPos += 15;

    // Section 1: Executive Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('1. Executive Summary', margin, yPos);
    yPos += 10;

    // Horizontal line
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Recommendation text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const formattedText = cleanRecommendation
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    for (const paragraph of formattedText) {
      const lines = doc.splitTextToSize(paragraph, pageWidth - 2 * margin);

      for (const line of lines) {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 25;
        }
        doc.text(line, margin, yPos);
        yPos += 7;
      }
      yPos += 5; // Extra space between paragraphs
    }

    yPos += 15;

    // Section 2: Performance Analysis
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('2. Performance Analysis', margin, yPos);
    yPos += 10;

    // Horizontal line
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    try {
      const canvas = document.getElementById(
        'chartCanvas'
      ) as HTMLCanvasElement;
      if (canvas) {
        const chartImage = await this.getChartAsImage(canvas);
        if (chartImage) {
          if (yPos > pageHeight - 150) {
            doc.addPage();
            yPos = 25;
          }

          // Add chart title
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Performance Trend Analysis', margin, yPos);
          yPos += 8;

          // Add chart description
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(
            'The following chart illustrates the performance metrics over time:',
            margin,
            yPos
          );
          yPos += 12;

          // Add chart with border
          const chartWidth = pageWidth - 2 * margin;
          const chartHeight = (canvas.height * chartWidth) / canvas.width;

          // Draw border around chart
          doc.setDrawColor(220);
          doc.rect(margin, yPos, chartWidth, chartHeight);

          doc.addImage(
            chartImage,
            'PNG',
            margin,
            yPos,
            chartWidth,
            chartHeight
          );
          yPos += chartHeight + 15;
        }
      }
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      doc.setFontSize(10);
      doc.setTextColor(150, 0, 0);
      doc.text(
        'Performance chart could not be included in this report',
        margin,
        yPos
      );
      yPos += 10;
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      '© ' + today.getFullYear() + ' InternHub. All rights reserved.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 10
      );
    }

    // Save the PDF
    const fileName = `InternHub_Performance_Report_${today.getFullYear()}${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.pdf`;
    doc.save(fileName);
  }

  private async getChartAsImage(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve) => {
      // Create a temporary canvas with white background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');

      if (ctx) {
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw original chart
        ctx.drawImage(canvas, 0, 0);

        // Convert to data URL
        resolve(tempCanvas.toDataURL('image/png'));
      } else {
        resolve('');
      }
    });
  }

  neatenCriteriaName(criteria: string): string {
    return criteria
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Reporting a review
  showReportModal = false;
  reportReviewId: string = '';
  selectedReason: string = '';
  reportReasons: string[] = [
    'FALSE_INFORMATION',
    'BAD_LANGUAGE',
    'SPAM',
    'OFFENSIVE_CONTENT',
  ];

  openReportModal(reviewId: string) {
    this.reportReviewId = reviewId;
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.selectedReason = '';
  }

  submitReport() {
    if (!this.selectedReason) {
      console.error('You must select a reason!');
      return;
    }

    this.reviewService
      .reportReview(this.reportReviewId, this.selectedReason)
      .subscribe({
        next: (response) => {
          console.log('Reported successfully!', response);
          alert('Review reported successfully!');
          this.closeReportModal();
        },
        error: (err) => {
          console.error('Error reporting review:', err);
          alert('Failed to report review.');
        },
      });
  }

  protected readonly String = String;
}
