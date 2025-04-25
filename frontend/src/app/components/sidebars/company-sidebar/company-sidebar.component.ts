import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-sidebar',
  templateUrl: './company-sidebar.component.html',
  styleUrls: ['./company-sidebar.component.css'],
})
export class CompanySidebarComponent {
  isCompanyCompact = false;
  @Output() CompanysidebarToggled = new EventEmitter<boolean>();

  toggleCompanySidebar() {
    this.isCompanyCompact = !this.isCompanyCompact;
    this.CompanysidebarToggled.emit(this.isCompanyCompact);
  }
}
