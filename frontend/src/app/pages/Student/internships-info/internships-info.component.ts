import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddInternshipService } from 'src/app/services/add-internship.service';


@Component({
  selector: 'app-internships-info',
  templateUrl: './internships-info.component.html',
  styleUrls: ['./internships-info.component.css'],
})
export class InternshipsInfoComponent implements OnInit {
  internship: any;
  loading = true;
  error: string | null = null;

  constructor(
    private internshipService: AddInternshipService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const internshipId = this.route.snapshot.paramMap.get('id');
    if (internshipId) {
      this.getInternshipDetails(+internshipId);
    } else {
      this.error = 'No Internship ID provided.';
      this.loading = false;
    }
  }

  getInternshipDetails(id: number): void {
    this.internshipService.getInternshipById(id).subscribe({
      next: (data) => {
        this.internship = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching internship:', err);
        this.error = 'Failed to load internship details.';
        this.loading = false;
      },
    });
  }
}
