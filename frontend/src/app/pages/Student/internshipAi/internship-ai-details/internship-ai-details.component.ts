import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipAi } from 'src/app/models/models ';
import { InternshipAiService } from 'src/app/services/internship-ai.service';

@Component({
  selector: 'app-internship-ai-details',
  templateUrl: './internship-ai-details.component.html',
  styleUrls: ['./internship-ai-details.component.css'],
})
export class InternshipAiDetailsComponent implements OnInit {
  internshipId: number | null = null;
  internship!: InternshipAi;

  constructor(
    private router: Router,
    private internshipAiService: InternshipAiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchInternshipAi();
  }

  fetchInternshipAi(): void {
    this.internshipId = this.route.snapshot.params['id'];
    if (this.internshipId !== null) {
      this.internshipAiService.getInternshipAiById(this.internshipId).subscribe(
        (data) => {
          this.internship = data;
          console.log('Internship data:', this.internship);
          this.checkAndUpdateInternshipStatus();
        },
        (error) => {
          console.error('Error fetching internshipAi:', error);
        }
      );
    }
  }

  private checkAndUpdateInternshipStatus(): void {
    if (this.internship && this.internship.taskAiList) {
      // Check if all tasks are completed
      const allTasksCompleted = this.internship.taskAiList.every(
        (task) => task.status === 'COMPLETED'
      );

      // If all tasks are completed and internship is still active
      if (allTasksCompleted && this.internship.active) {
        this.internship.active = false;

        // Call the update API
        this.internshipAiService
          .updateInternshipAi(this.internship, this.internshipId!)
          .subscribe(
            (updatedInternship) => {
              this.internship = updatedInternship;
              console.log('Internship status updated to inactive');
            },
            (error) => {
              console.error('Error updating internship status:', error);
              // Revert the change if update fails
              this.internship.active = true;
            }
          );
      }
    }
  }
}
