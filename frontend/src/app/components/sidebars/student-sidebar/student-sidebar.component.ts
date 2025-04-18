import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent implements OnInit {
  isCompact = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  decodedToken: any;

  ngOnInit() {
    this.decodeToken();
  }

  toggleSidebar() {
    this.isCompact = !this.isCompact;
    this.sidebarToggled.emit(this.isCompact);
  }

  private decodeToken() {
    // 1. Get the token from storage (adjust key if different)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    

    
    if (token) {
      try {
        // 2. Split the token into its parts
        const tokenParts = token.split('.');
        
        // 3. Decode the payload (middle part)
        const decodedPayload = atob(tokenParts[1]);
        
        // 4. Parse the JSON payload
        this.decodedToken = JSON.parse(decodedPayload);
        
        console.log('Decoded token:', this.decodedToken);
       
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
}