import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-company-sidebar',
  templateUrl: './company-sidebar.component.html',
  styleUrls: ['./company-sidebar.component.css']
})
export class CompanySidebarComponent implements OnInit {
  isCompact = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  decodedToken: any;


  currentUserPic: string = ''; 
  UserName: string = '';
  email: string = '';
  
  profilePics: string[] = Array.from({length: 17}, (_, i) => `/assets/pfp/p${i+1}.png`);

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


isCompanyCompact = false;
@Output() CompanysidebarToggled = new EventEmitter<boolean>();

toggleCompanySidebar() {
  this.isCompanyCompact = !this.isCompanyCompact;
  this.CompanysidebarToggled.emit(this.isCompanyCompact);
}

}
