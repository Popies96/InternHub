import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddInternshipService } from 'src/app/services/add-internship.service';


@Component({
  selector: 'app-add-internship',
  templateUrl: './add-internship.component.html',
  styleUrls: ['./add-internship.component.css'],
})
export class AddInternshipComponent {
  internshipForm!: FormGroup;

  constructor(
    private addInternshipService: AddInternshipService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.internshipForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      positionTitle: ['', [Validators.required, Validators.maxLength(100)]],
      department: ['', Validators.required],
      durationInMonths: [
        null,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
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
  onSubmit(): void {
    if (this.internshipForm.invalid) {
      this.internshipForm.markAllAsTouched();
      return;
    }

    const internshipData = this.internshipForm.value;

    console.log('Submitting internship:', internshipData);

    this.addInternshipService.createInternship(internshipData).subscribe(
      (response) => {
        console.log('Internship created successfully:', response);
      },
      (error) => {
        console.error('Error creating internship:', error);
      }
    );
  }
}
