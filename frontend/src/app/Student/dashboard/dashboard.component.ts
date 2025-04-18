import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarCompact = false;

  toggleProfile() {
    const profile = document.getElementById('profile');
    profile?.classList.toggle('hidden');
  }

  onSidebarToggled(isCompact: boolean) {
    this.isSidebarCompact = isCompact;
  }
}