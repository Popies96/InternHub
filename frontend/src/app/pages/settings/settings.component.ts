import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  userForm!: FormGroup;
  currentUser!: User;
  isStudent!: boolean;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserFromLocalStorage().subscribe((user) => {
      this.currentUser = user;

      this.isStudent = user.role === 'STUDENT';
      this.initForm();
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      nom: [this.currentUser.nom, Validators.required],
      prenom: [this.currentUser.prenom, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      phone: [this.currentUser.phone, Validators.required],
      password: ['', Validators.minLength(6)],
      confirmPassword: [''],
      
    },
  { validators: this.passwordsMatchValidator });

    // Add role-specific fields
    if (this.isStudent) {
      this.userForm.addControl(
        'school',
        this.fb.control(
          (this.currentUser as any).school || '',
          Validators.required
        )
      );
      this.userForm.addControl(
        'cin',
        this.fb.control(
          (this.currentUser as any).cin || '',
          Validators.required
        )
      );
    } else {
      this.userForm.addControl(
        'companyName',
        this.fb.control(
          (this.currentUser as any).companyName || '',
          Validators.required
        )
      );
      this.userForm.addControl(
        'companyAddress',
        this.fb.control(
          (this.currentUser as any).companyAddress || '',
          Validators.required
        )
      );
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.userService.updateUser(this.userForm.value).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.loading = false;

        console.log('User updated successfully:', updatedUser);
      },
      error: (err) => {
        this.loading = false;
        console.log('Error updating user:', err);
      },
    });
  }
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }
}
