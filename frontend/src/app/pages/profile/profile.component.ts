import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!:User
constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.user = user;
        console.log('User:', this.user);
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      },
    });
  }


}
