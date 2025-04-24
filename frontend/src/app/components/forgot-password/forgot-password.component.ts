import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  isOpen = false;
  step = 1;
  selectedMethod: 'email' | 'sms' = 'email';
  userInput: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading = false;

  @Output() close = new EventEmitter<void>();

  constructor(
    private forgotPassword: JwtService,
    private cdr: ChangeDetectorRef
  ) {}

  openModal() {
    this.isOpen = true;
    this.step = 1;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

  selectMethod(method: 'email' | 'sms') {
    this.selectedMethod = method;
    this.step = 2;
  }

  sendVerificationCode() {
    if (!this.userInput) {
      alert(
        `Please enter your ${
          this.selectedMethod === 'email' ? 'email' : 'phone number'
        }`
      );
      return;
    }

   

    this.forgotPassword
      .sendVerificationCode(this.userInput, this.selectedMethod)
      .subscribe({
        next: (response) => {
          console.log('Verification code sent:', response);
          this.step = 3;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Error sending code. Check the identifier.';
          console.error(err);
          this.loading = false;
        },
      });
  }

  verifyCode() {
    if (!this.verificationCode) {
      alert('Please enter the verification code');
      return;
    }
console.log('User Input:', this.userInput);
console.log('Verification Code:', this.verificationCode);
    this.forgotPassword
      .verifyCode(this.userInput, this.verificationCode)
      .subscribe({
        next: (response) => {
          console.log('Code verified:', response);
          this.step = 4;
          this.cdr.detectChanges(); // Move to reset password step
         
        },
        error: (err) => {
          this.errorMessage = 'Invalid verification code.';
          console.error(err);
        
        },
      });
  }

  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      alert('Please fill in both password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.loading = true;
    this.forgotPassword
      .resetPassword(this.userInput, this.newPassword)
      .subscribe({
        next: (response) => {
          console.log('Password reset successful:', response);
          alert('Your password has been reset successfully.');
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Error resetting password.';
          console.error(err);
          this.loading = false;
        },
      });
  }
}
