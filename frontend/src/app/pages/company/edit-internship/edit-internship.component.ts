// edit-internship.component.ts
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Observable } from 'rxjs'; // Add this import
import { AddInternshipService } from 'src/app/services/add-internship.service';

const apiUrl = 'http://localhost:8088/internhub/test'; // Add this line

@Component({
  selector: 'app-edit-internship',
  templateUrl: './edit-internship.component.html',
  styleUrls: ['./edit-internship.component.css'],
})
export class EditInternshipComponent implements OnInit {
  internshipForm: FormGroup;
  internshipId: number = 0; // Initialize with default value
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router, // Changed to public for template access
    private internshipService: AddInternshipService
  ) {
    this.internshipForm = this.fb.group({
      title: ['', Validators.required],
      positionTitle: ['', Validators.required],
      department: ['', Validators.required],
      durationInMonths: [null, [Validators.required, Validators.min(1)]],
      positionSummary: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      stipend: [null],
      stipendFrequency: ['per month'],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      applicationDeadline: ['', Validators.required],
      positionsAvailable: [null, [Validators.required, Validators.min(1)]],
      resumeRequired: [false],
      coverLetterRequired: [false],
      portfolioRequired: [false],
      transcriptRequired: [false],
      additionalNotes: [''],
      requiredMaterials: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    if (id) {
      this.internshipId = +id;
      this.loadInternshipData();
    }
  }

  loadInternshipData(): void {
    this.loading = true;
    this.internshipService.getInternshipById(this.internshipId).subscribe({
      next: (data) => {
        const formattedData = {
          ...data,
          startDate: this.formatDateForInput(data.startDate),
          endDate: this.formatDateForInput(data.endDate),
          applicationDeadline: this.formatDateForInput(
            data.applicationDeadline
          ),
        };
        console.log(formattedData);

        this.internshipForm.patchValue(formattedData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading internship:', error);
        this.loading = false;
        if (error.status === 403) {
          alert('Session expired or unauthorized. Please login again.');
        } else {
          alert('Failed to load internship data');
        }
      },
    });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.internshipForm.invalid) {
      this.internshipForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.internshipService
      .updateInternship(this.internshipId, this.internshipForm.value)
      .subscribe({
        next: () => {
          alert('Internship updated successfully');
        },
        error: (error) => {
          console.error('Error updating internship:', error);
          this.loading = false;
          alert('Failed to update internship');
        },
      });
  }
}
