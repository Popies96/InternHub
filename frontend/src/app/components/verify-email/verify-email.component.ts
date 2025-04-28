// verify-email.component.ts
import { Component } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent {
  email: string = '';
  isVisible: boolean = false;
  verificationCode: string = '';
constructor(private jwtService: JwtService) {}
  openModal(email: string) {
    this.email = email;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  send() {
    if (this.verificationCode) {
      // Logic to verify the code (you can integrate with an API here)
      console.log(
        'Verifying email:',
        this.email,
        'with code:',
        this.verificationCode
      );
      this.jwtService.verifyEmail(this.email, this.verificationCode).subscribe(
        (response) => {
          console.log('Email verified successfully:', response);
          alert('Email verified successfully!');
           this.closeModal();
          
        },
        (error) => {
          console.error('Error verifying email:', error);
         
        })
      // After verification, close the modal
     
    } else {
      alert('Please enter the verification code.');
    }
  }
}
