import { Component } from '@angular/core';

@Component({
  selector: 'app-rendu',
  templateUrl: './rendu.component.html',
  styleUrls: ['./rendu.component.css']
})
export class RenduComponent {
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
    if (this.isDropdownOpen) {
      
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdownOutside);
      });
    }
  }

  isDropdownOpen = false;

  private closeDropdownOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById('dropdown');
    const trigger = document.querySelector('[data-dropdown-trigger]');
    
    const clickedInside = dropdown?.contains(event.target as Node) || 
                         trigger?.contains(event.target as Node);
  
    if (!clickedInside) {
      this.isDropdownOpen = false;
      dropdown?.classList.add('hidden');
      document.removeEventListener('click', this.closeDropdownOutside);
    }
  };
}
