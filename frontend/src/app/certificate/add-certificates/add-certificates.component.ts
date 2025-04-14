import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-add-certificates',
  templateUrl: './add-certificates.component.html',
  styleUrls: ['./add-certificates.component.css']
})
export class AddCertificatesComponent implements OnInit {
  certificateForm: FormGroup;
  statusOptions = ['ACTIVE', 'REVOKED'];
  isLoading = false;
  studentDetails: any = null;
  internshipDetails: any = null;
  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private router: Router
  ) {
    this.certificateForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      issueDate: [new Date().toISOString().substring(0, 10), Validators.required],
      verificationID: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      certificateContent: ['', [Validators.required, Validators.minLength(10)]],
      studentId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      internshipId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      issuerId: ['']
    });
  }
  loadStudentDetails(): void {
    const studentId = this.certificateForm.get('studentId')?.value;
    if (studentId) {
      // Simulez la récupération des données étudiant
      this.studentDetails = {
        firstName: 'John', // Remplacez par une vraie requête API
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };
      
      // Alternative: Utilisez les champs existants du formulaire
      this.certificateForm.patchValue({
        studentFirstName: this.studentDetails.firstName,
        studentLastName: this.studentDetails.lastName
      });
    }
  }
  
  loadInternshipDetails(): void {
    const internshipId = this.certificateForm.get('internshipId')?.value;
    if (internshipId) {
      // Simulez la récupération des données de stage
      this.internshipDetails = {
        title: 'Advanced Web Development', // Remplacez par une vraie requête API
        duration: 12
      };
      
      this.certificateForm.patchValue({
        internshipTitle: this.internshipDetails.title
      });
    }
  }
  ngOnInit(): void {
    // Générer un ID de vérification par défaut
    this.generateVerificationId();
  }

  generateVerificationId(): void {
    const verifId = 'VER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    this.certificateForm.patchValue({ verificationID: verifId });
  }
// Add this method to both components
navigateToCertificateList(): void {
  this.router.navigate(['/certificates']);
}
  onSubmit(): void {
    if (this.certificateForm.valid) {
      this.isLoading = true;
      const certificateData = this.certificateForm.value;

      this.certificateService.createCertificate(certificateData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/certificates'], {
            queryParams: { created: true }
          });
        },
        error: (err) => {
          console.error('Error creating certificate', err);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.certificateForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() { return this.certificateForm.controls; }
 
}
