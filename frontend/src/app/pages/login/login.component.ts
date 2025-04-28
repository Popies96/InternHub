import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from 'src/app/components/verify-email/verify-email.component';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @ViewChild(ForgotPasswordComponent)
  forgotPasswordComponent!: ForgotPasswordComponent;
  @ViewChild('verifyEmailModal') verifyEmailModal!: VerifyEmailComponent;

  constructor(
    private fb: FormBuilder,
    private jwtservice: JwtService,
    private router: Router
  ) {}

  loginWithOAuth() {
    this.jwtservice.loginWithOAuth();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }
  @ViewChild('forgotPasswordModal')
  forgotPasswordModal!: ForgotPasswordComponent;

  openForgotPasswordModal() {
    this.forgotPasswordModal.openModal();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      this.jwtservice.login(this.loginForm.value).subscribe(
        (data) => {
          console.log(data);
          if (data.token != null) {
            const jwtToken = data.token;
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('email', this.loginForm.value.email);
            const roles = data.roles;
            if (roles.includes('ROLE_STUDENT')) {
              this.router.navigate(['/student']);
            } else if (roles.includes('ROLE_ENTERPRISE')) {
              this.router.navigate(['/company']);
            } else if (roles.includes('ROLE_ADMIN')) {
              this.router.navigate(['/admin']);
            }
          }
        },
        (error) => {
          console.log(error);
           if (error.status === 403 && error.error.resend === true) {
          // User is not verified, open Verify Modal
         this.openVerifyEmailModal()


        
          alert(error.error.message); 
        } else if (error.status === 401) {
          alert('Invalid email or password');
        } else if (error.status === 404) {
          alert('User not found');
        } else {
          alert('An unexpected error occurred');
        }
      
    
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  openVerifyEmailModal() {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.verifyEmailModal.openModal(email); // Pass the email to the modal
    }
  }
}
