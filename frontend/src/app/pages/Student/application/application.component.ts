import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  internshipId!: number;
  currentUserId!: number;
  submitted = false;
  errorMessage: string = '';
  successMessage: string = '';
  resumeBase64: string = '';
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRouteParams();
    this.loadCurrentUser();
  }

  private createForm(): void {
    this.applicationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', Validators.required],
      about: ['', Validators.required],
      resume: ['', Validators.required], // base64 will be saved here
      studentId: [''],
      internshipId: [''],
    });
  }

  private getRouteParams(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.internshipId = parseInt(id);
    }
  }

  private loadCurrentUser(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.applicationForm.patchValue({
          studentId: this.currentUserId,
          internshipId: this.internshipId,
        });
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.errorMessage = 'Failed to load user information.';
      },
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.resumeBase64 = (reader.result as string).split(',')[1]; // remove the prefix (data:...)
        this.applicationForm.patchValue({
          resume: this.resumeBase64,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Form Submitted:', this.applicationForm.value);

    if (this.applicationForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formValues = this.applicationForm.value;

    this.applicationService.createApplication(formValues).subscribe({
      next: (response) => {
        this.successMessage = 'Application submitted successfully!';
        this.errorMessage = '';
        this.applicationForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.errorMessage =
          error.error?.message || 'Failed to submit application.';
        this.successMessage = '';
      },
    });
  }
}
