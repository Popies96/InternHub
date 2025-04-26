import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-edit-certificates',
  templateUrl: './edit-certificates.component.html',
  styleUrls: ['./edit-certificates.component.css'],
})
export class EditCertificatesComponent implements OnInit {
  certificateForm: FormGroup;
  isEditMode = false;
  certificateId: number | null = null;
  statusOptions = ['ACTIVE', 'REVOKED'];
  isLoading = false;

  // For dropdowns
  internships: any[] = [];
  students: any[] = [];
  selectedInternshipId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.certificateForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      issueDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      verificationID: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      certificateContent: ['', [Validators.required, Validators.minLength(10)]],
      studentId: ['', Validators.required],
      internshipId: ['', Validators.required],
    });
  }

  // Getter for easy access to form controls
  get formControls() {
    return this.certificateForm.controls;
  }

  ngOnInit(): void {
    this.certificateId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.certificateId;

    this.loadInternships();
    this.generateVerificationId();

    // Watch for internship selection changes
    this.certificateForm
      .get('internshipId')
      ?.valueChanges.subscribe((internshipId) => {
        if (internshipId) {
          this.loadStudentsForInternship(internshipId);
          this.selectedInternshipId = internshipId;
        } else {
          this.students = [];
          this.selectedInternshipId = null;
        }
      });

    if (this.isEditMode) {
      this.loadCertificate(this.certificateId);
    }
  }

  loadInternships(): void {
    this.certificateService.getAllInternships().subscribe({
      next: (internships) => {
        this.internships = internships;
      },
      error: (err) => {
        console.error('Error loading internships', err);
      },
    });
  }

  loadStudentsForInternship(internshipId: number): void {
    this.certificateService.getStudentsByInternship(internshipId).subscribe({
      next: (students) => {
        this.students = students;
        // Reset student selection when internship changes
        this.certificateForm.get('studentId')?.setValue('');
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.students = [];
      },
    });
  }
  navigateToCertificateList(): void {
    this.router.navigate(['/company/certificates']);
  }
  loadCertificate(id: number): void {
    this.isLoading = true;
    this.certificateService.getCertificateById(id).subscribe({
      next: (cert) => {
        this.certificateForm.patchValue({
          ...cert,
          issueDate: new Date(cert.issueDate!).toISOString().substring(0, 10),
        });
        if (cert.internshipId) {
          this.loadStudentsForInternship(cert.internshipId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading certificate', err);
        this.isLoading = false;
      },
    });
  }

  generateVerificationId(): void {
    if (!this.isEditMode) {
      const verifId =
        'VER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      this.certificateForm.patchValue({ verificationID: verifId });
    }
  }

  onSubmit(): void {
    if (this.certificateForm.valid) {
      this.isLoading = true;
      const certificateData = this.certificateForm.value;

      if (this.isEditMode && this.certificateId) {
        this.certificateService
          .updateCertificate(this.certificateId, certificateData)
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/company/certificates']);
            },
            error: (err) => {
              console.error('Error updating certificate', err);
              this.isLoading = false;
            },
          });
      } else {
        this.certificateService.createCertificate(certificateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/company/certificates']);
          },
          error: (err) => {
            console.error('Error creating certificate', err);
            this.isLoading = false;
          },
        });
      }
    } else {
      this.markFormGroupTouched(this.certificateForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
