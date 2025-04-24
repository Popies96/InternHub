import { Component } from '@angular/core';

@Component({
  selector: 'app-interns',
  templateUrl: './interns.component.html',
  styleUrls: ['./interns.component.css']
})
export class InternsComponent {

  /* ----------------------------------  Internship Program ----------------------------------------- */
  isInt = false;

toggleInt() {
  this.isInt = !this.isInt;
  
  if (this.isInt) {
    // Add click listener when opening dropdown
    setTimeout(() => {
      document.addEventListener('click', this.closeInt);
    });
  }
}

private closeInt = (event: MouseEvent) => {
  const dropdown = document.getElementById('dropdownInt');
  const trigger = document.querySelector('[data-Int-trigger]');
  
  const clickedInside = dropdown?.contains(event.target as Node) || 
                       trigger?.contains(event.target as Node);

  if (!clickedInside) {
    this.isInt = false;
    dropdown?.classList.add('hidden');
    document.removeEventListener('click', this.closeInt);
  }
};


  /* ----------------------------------  Project Status ----------------------------------------- */



  isStatus = false;

  toggleStatus() {
    this.isStatus = !this.isStatus;
    
    if (this.isStatus) {
      // Add click listener when opening dropdown
      setTimeout(() => {
        document.addEventListener('click', this.closeStatus);
      });
    }
  }
  
  private closeStatus = (event: MouseEvent) => {
    
     
    const dropdown = document.getElementById('dropdownStatus');
    const trigger = document.querySelector('[data-Status-trigger]');
    
    const clickedInside = dropdown?.contains(event.target as Node) || 
                         trigger?.contains(event.target as Node);
  
    if (!clickedInside) {
      this.isStatus = false;
      dropdown?.classList.add('hidden');
      document.removeEventListener('click', this.closeStatus);
    }
  };






  /* ----------------------------------  Project Department ----------------------------------------- */



  isDepart = false;

  toggleDepart() {
    this.isDepart = !this.isDepart;
    
    if (this.isDepart) {
      // Add click listener when opening dropdown
      setTimeout(() => {
        document.addEventListener('click', this.closeDepart);
      });
    }
  }
  
  private closeDepart = (event: MouseEvent) => {
    const dropdown = document.getElementById('dropdownDepart');
    const trigger = document.querySelector('[data-Depart-trigger]');
    
    const clickedInside = dropdown?.contains(event.target as Node) || 
                         trigger?.contains(event.target as Node);
  
    if (!clickedInside) {
      this.isDepart = false;
      dropdown?.classList.add('hidden');
      document.removeEventListener('click', this.closeDepart);
    }
  };





  projects: {[key: number]: {expanded: boolean}} = {
    1: { expanded: false },
    2: { expanded: false },
    3: { expanded: false }
  };

  toggleProject(projectId: number) {
    this.projects[projectId].expanded = !this.projects[projectId].expanded;
  }
}
