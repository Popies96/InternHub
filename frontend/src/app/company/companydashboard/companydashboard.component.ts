import { Component } from '@angular/core';

@Component({
  selector: 'app-companydashboard',
  templateUrl: './companydashboard.component.html',
  styleUrls: ['./companydashboard.component.css']
})
export class CompanydashboardComponent {

  isSidebarCompact = false;

  toggleProfile() {
    const profile = document.getElementById('profile');
    profile?.classList.toggle('hidden');
  }

  onSidebarToggled(isCompact: boolean) {
    this.isSidebarCompact = isCompact; 
  }
}

