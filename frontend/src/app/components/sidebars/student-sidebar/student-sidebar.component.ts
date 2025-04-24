import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent implements OnInit {
  isCompact = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();
constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.UserName = user.nom;
        this.email = user.email;
        this.currentUserPic = localStorage.getItem('pfp') || '' ;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.currentUserPic = '';
      }
    });
  }
  profilePics: string[] = Array.from({length: 17}, (_, i) => `/assets/pfp/p${i+1}.png`);
  

 

  toggleSidebar() {
    this.isCompact = !this.isCompact;
    this.sidebarToggled.emit(this.isCompact);
  }
  currentUserPic: string = ''; 
  currentUserId: number | null = null;
  currentUser: number| null = null;; 
  UserName: string = '';
  email: string = '';
  
 
  
 

}