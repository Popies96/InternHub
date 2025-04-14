import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  role: string = 'student'; // Default role

  constructor(private fb: FormBuilder,private jwtService:JwtService) {
    this.signupForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [this.role],
      school: [''],
      cin: [''],
      companyName: [''],
      companyAddress: [''],
    });
  }

  ngOnInit(): void {}

  selectRole(selectedRole: string) {
    this.role = selectedRole;
    this.signupForm.patchValue({ role: selectedRole });

    if (selectedRole === 'student') {
      this.signupForm.get('school')?.setValidators(Validators.required);
      this.signupForm.get('cin')?.setValidators(Validators.required);
      this.signupForm.get('companyName')?.clearValidators();
      this.signupForm.get('companyAddress')?.clearValidators();
    } else {
      this.signupForm.get('companyName')?.setValidators(Validators.required);
      this.signupForm.get('companyAddress')?.setValidators(Validators.required);
      this.signupForm.get('school')?.clearValidators();
      this.signupForm.get('cin')?.clearValidators();
    }

    // Update validation
    this.signupForm.get('school')?.updateValueAndValidity();
    this.signupForm.get('cin')?.updateValueAndValidity();
    this.signupForm.get('companyName')?.updateValueAndValidity();
    this.signupForm.get('companyAddress')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form submitted:', this.signupForm.value);
      this.jwtService.register(this.signupForm.value).subscribe(
        (data)=>{
          console.log(data);
        },
        (error)=>{
          console.log(error);
        })
    } else {
      console.log('Form is invalid');
    }
  }
  
}
