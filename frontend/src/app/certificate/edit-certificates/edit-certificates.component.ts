import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-edit-certificates',
  templateUrl: './edit-certificates.component.html',
  styleUrls: ['./edit-certificates.component.css']
})
export class EditCertificatesComponent {
  certificateForm: FormGroup;
  isEditMode = false;
  certificateId: number | null = null;
  statusOptions = ['ACTIVE', 'REVOKED'];

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
  protected router: Router
  ) {
    this.certificateForm = this.fb.group({
      title: ['', Validators.required],
      issueDate: ['', Validators.required],
      verificationID: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      certificateContent: ['', Validators.required],
      studentId: ['', Validators.required],
      internshipId: ['', Validators.required],
      issuerId: ['']
    });
  }

  ngOnInit(): void {
    this.certificateId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.certificateId;

    if (this.isEditMode) {
      this.loadCertificate(this.certificateId);
    }
  }

  loadCertificate(id: number): void {
    this.certificateService.getCertificateById(id).subscribe({
      next: (cert) => {
        this.certificateForm.patchValue({
          ...cert,
          issueDate: new Date(cert.issueDate!).toISOString().substring(0, 10)
        });
      },
      error: (err) => console.error('Error loading certificate', err)
    });
  }

  onSubmit(): void {
    if (this.certificateForm.valid) {
      const certificateData = this.certificateForm.value;

      if (this.isEditMode && this.certificateId) {
        this.certificateService.updateCertificate(this.certificateId, certificateData)
          .subscribe({
            next: () => this.router.navigate(['/certificates']),
            error: (err) => console.error('Error updating certificate', err)
          });
      } else {
        this.certificateService.createCertificate(certificateData)
          .subscribe({
            next: () => this.router.navigate(['/certificates']),
            error: (err) => console.error('Error creating certificate', err)
          });
      }
    }
  }

}
