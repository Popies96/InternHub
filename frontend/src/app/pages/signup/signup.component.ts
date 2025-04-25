import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  role: string = 'student'; // Default role

  constructor(private fb: FormBuilder, private jwtService: JwtService , private router: Router) {
    this.signupForm = this.fb.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(8)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        role: [this.role],
        school: [''],
        cin: [''],
        companyName: [''],
        companyAddress: [''],
      },
      { validator: this.passwordMathValidator }
    );
  }

  ngOnInit(): void {}

  selectRole(selectedRole: string) {
    console.log('Role selected:', selectedRole);
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

   
    this.signupForm.get('school')?.updateValueAndValidity();
    this.signupForm.get('cin')?.updateValueAndValidity();
    this.signupForm.get('companyName')?.updateValueAndValidity();
    this.signupForm.get('companyAddress')?.updateValueAndValidity();
  }
  passwordMathValidator(formGroup: FormGroup){
 const password = formGroup.get('password')?.value;
 const confirmPassword = formGroup.get('confirmPassword')?.value;
  if(password !== confirmPassword){
    formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
  }else{
    formGroup.get('confirmPassword')?.setErrors(null);
  }
  }
  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form submitted:', this.signupForm.value);
      this.jwtService.register(this.signupForm.value).subscribe(
        (data) => {
          this.router.navigate(['/login']);
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
