import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css'],
})
export class OnboardComponent implements OnInit {
  onboardingForm: FormGroup;
  token: string | null = null;
  role: string = 'student'; // Default role
  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize form with default values
    this.onboardingForm = this.fb.group({
      role: [this.role, Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      school: [''],
      cin: [''],
      companyName: [''],
      companyAddress: [''],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        // Save token in localStorage
      
 localStorage.setItem('token', this.token);
        // Redirect to the appropriate page based on role
      
      } else {
        // Handle error: Token not found
        console.error('Authentication token not found');
      }
    });
  }
  selectRole(selectedRole: string) {
    this.role = selectedRole;
    this.onboardingForm.patchValue({ role: selectedRole });

    if (selectedRole === 'student') {
      this.onboardingForm.get('school')?.setValidators(Validators.required);
      this.onboardingForm.get('cin')?.setValidators(Validators.required);
      this.onboardingForm.get('companyName')?.clearValidators();
      this.onboardingForm.get('companyAddress')?.clearValidators();
    } else {
      this.onboardingForm
        .get('companyName')
        ?.setValidators(Validators.required);
      this.onboardingForm
        .get('companyAddress')
        ?.setValidators(Validators.required);
      this.onboardingForm.get('school')?.clearValidators();
      this.onboardingForm.get('cin')?.clearValidators();
    }

    this.onboardingForm.get('school')?.updateValueAndValidity();
    this.onboardingForm.get('cin')?.updateValueAndValidity();
    this.onboardingForm.get('companyName')?.updateValueAndValidity();
    this.onboardingForm.get('companyAddress')?.updateValueAndValidity();
  }
  onSubmit() {
    if (this.onboardingForm.valid) {
      console.log('Form submitted:', this.onboardingForm.value);
      this.jwtService.completeOnboarding(this.onboardingForm.value).subscribe(
        (data) => {
          console.log(data);
            this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
