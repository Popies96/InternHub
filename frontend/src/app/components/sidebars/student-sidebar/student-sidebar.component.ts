import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent {
  isCompact = false;
@Output() sidebarToggled = new EventEmitter<boolean>();

toggleSidebar() {
  this.isCompact = !this.isCompact;
  this.sidebarToggled.emit(this.isCompact);
}
}