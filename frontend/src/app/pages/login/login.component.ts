import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { JwtService } from 'src/app/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @ViewChild(ForgotPasswordComponent)
  forgotPasswordComponent!: ForgotPasswordComponent;

  constructor(private fb: FormBuilder, private jwtservice: JwtService ,private router: Router) {}

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
      this.jwtservice.login(this.loginForm.value).subscribe(
        (data) => {
          if (data.token != null) {
            const jwtToken = data.token;
            localStorage.setItem('email', this.loginForm.value.email);
            localStorage.setItem('token', jwtToken);
            const roles = data.roles 
            if(roles.includes('ROLE_STUDENT') ){
              this.router.navigate(['/student']);
            }else if (roles.includes('ROLE_ENTERPRISE') ) {
              this.router.navigate(['/company']);
            }
          }
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
