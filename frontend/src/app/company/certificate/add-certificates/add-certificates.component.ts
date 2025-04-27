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
  internships: any[] = [];
  students: any[] = [];
  selectedInternshipId: number | null = null;
  formContext: any = {
    studentName: '',
    internshipTitle: '',
    internshipDuration: '',
    skills: []
  };

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
      studentId: ['', Validators.required],
      internshipId: ['', Validators.required],
    });
  }

  get formControls() {
    return this.certificateForm.controls;
  }

  ngOnInit(): void {
    this.loadInternships();
    this.generateVerificationId();
    
    this.certificateForm.get('internshipId')?.valueChanges.subscribe(internshipId => {
      if (internshipId) {
        this.loadStudentsForInternship(internshipId);
        this.selectedInternshipId = internshipId;
        this.updateFormContext();
      } else {
        this.students = [];
        this.selectedInternshipId = null;
      }
    });

    this.certificateForm.get('studentId')?.valueChanges.subscribe(() => {
      this.updateFormContext();
    });
  }

  updateFormContext(): void {
    const selectedInternship = this.internships.find(i => i.id === this.certificateForm.value.internshipId);
    const selectedStudent = this.students.find(s => s.id === this.certificateForm.value.studentId);
    
    this.formContext = {
      studentName: selectedStudent ? `${selectedStudent.prenom} ${selectedStudent.nom}` : 'Nom de l\'étudiant',
      internshipTitle: selectedInternship?.title || 'Titre du programme',
      internshipDuration: selectedInternship?.durationInMonths || 'Durée',
      skills: selectedInternship?.skills || ['Compétence 1', 'Compétence 2']
    };
  }

  loadInternships(): void {
    this.certificateService.getAllInternships().subscribe({
      next: (internships) => {
        this.internships = internships;
        console.log('All completed internships:', this.internships);
      },
      error: (err) => {
        console.error('Error loading internships', err);
      }
    });
  }

  loadStudentsForInternship(internshipId: number): void {
    this.certificateService.getStudentsByInternship(internshipId).subscribe({
      next: (students) => {
        this.students = students;
        this.certificateForm.get('studentId')?.setValue('');
        this.updateFormContext();
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.students = [];
      }
    });
  }

  generateVerificationId(): void {
    const verifId = 'VER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    this.certificateForm.patchValue({ verificationID: verifId });
  }

  navigateToCertificateList(): void {
    this.router.navigate(['/company/certificates']);
  }

  onSubmit(): void {
    if (this.certificateForm.valid) {
      this.isLoading = true;
      const certificateData = this.certificateForm.value;
  
      this.certificateService.createCertificate(certificateData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/company/certificates']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Detailed error:', err);
          alert(`Failed to create certificate: ${err}`);
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
}