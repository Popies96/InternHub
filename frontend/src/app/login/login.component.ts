import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private jwtService: JwtService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [this.rememberMe]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginData = { email, password };
      
      this.jwtService.login(loginData).subscribe(
        (data) => {
          console.log('Login successful:', data);
          
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
            this.redirectBasedOnRole(data.token);
          }
        },
        (error) => {
          console.error('Login error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  private redirectBasedOnRole(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
    
      const userRole = decodedToken?.roles?.[0]?.toLowerCase();
      console.log('User Role:', userRole);
  
      if (userRole=='role_student') {
        this.router.navigate(['/student']);

      } else if (userRole=='role_enterprise') {
        
        this.router.navigate(['/company']);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
    this.loginForm.patchValue({ rememberMe: this.rememberMe });
  }
}