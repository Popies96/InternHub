import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent {
  breadcrumbs: Array<{label: string, url: string}> = [];
  currentUserPic: string = ''; 
  currentUserId: number | null = null;
  currentUser: number | null = null;
  UserName: string = '';
  index: number | null = null;
  profilePics: string[] = Array.from({length: 17}, (_, i) => `/assets/pfp/p${i+1}.png`);
  
  ngOnInit(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id;
        this.UserName = user.nom;
        this.currentUserId = user.id;
        this.index = this.getUserProfilePic(user.id);
        this.currentUserPic =this.profilePics[this.index]
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.currentUserPic = '';
      }
    });
  }
  
  getUserProfilePic(userId: number): number {
   
    const index = Math.abs(userId) % this.profilePics.length;
    
    return index;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute , private jwtService: JwtService , private userService: UserService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }


 


  


 





  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{label: string, url: string}> = []
  ): Array<{label: string, url: string}> {
    const children: ActivatedRoute[] = route.children;
  
    if (children.length === 0) {
      return breadcrumbs;
    }
  
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      const newUrl = routeURL ? `${url}/${routeURL}` : url;
      const label = child.snapshot.data['breadcrumb'];

      if (label && routeURL !== 'student') {
        breadcrumbs.push({
          label: this.formatLabel(label),
          url: newUrl
        });
      }

      if (routeURL === 'intern') {
        breadcrumbs = [
          { label: 'Internships', url: newUrl },
          ...breadcrumbs
        ];
      }
  
      const childBreadcrumbs = this.createBreadcrumbs(child, newUrl, breadcrumbs);
      
      if (childBreadcrumbs.length > breadcrumbs.length) {
        return childBreadcrumbs;
      }
    }
  
    return breadcrumbs;
  }

  private formatLabel(label: string): string {
    if (!label) return '';
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

 // In your component class
isDropdownOpen = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  
  if (this.isDropdownOpen) {
    // Add click listener when opening dropdown
    setTimeout(() => {
      document.addEventListener('click', this.closeDropdownOutside);
    });
  }
}

private closeDropdownOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById('dropdownDivider');
  const trigger = document.querySelector('[data-dropdown-trigger]');
  
  const clickedInside = dropdown?.contains(event.target as Node) || 
                       trigger?.contains(event.target as Node);

  if (!clickedInside) {
    this.isDropdownOpen = false;
    dropdown?.classList.add('hidden');
    document.removeEventListener('click', this.closeDropdownOutside);
  }
};

  // Add this state variable
isNotificationDropdownOpen = false;

// Modified notification toggle function
toggleNotificationDropdown() {
  this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  
  if (this.isNotificationDropdownOpen) {
    setTimeout(() => {
      document.addEventListener('click', this.closeNotificationOutside);
    });
  }
}

// Private handler for outside clicks
private closeNotificationOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById('notificationDropdown');
  const trigger = document.querySelector('[data-notification-trigger]');
  
  const clickedInside = dropdown?.contains(event.target as Node) || 
                       trigger?.contains(event.target as Node);

  if (!clickedInside) {
    this.isNotificationDropdownOpen = false;
    dropdown?.classList.add('hidden');
    document.removeEventListener('click', this.closeNotificationOutside);
  }
};







toggleLogout() {
   this.jwtService.logout();
   this.router.navigate(['/login']);
}




// Add to your component class
isMessagesDropdownOpen = false;

toggleMessagesDropdown() {
  this.isMessagesDropdownOpen = !this.isMessagesDropdownOpen;
  
  if (this.isMessagesDropdownOpen) {
    setTimeout(() => {
      document.addEventListener('click', this.closeMessagesOutside);
    });
  }
}

private closeMessagesOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById('messagesDropdown');
  const trigger = document.querySelector('[data-messages-trigger]');
  
  const clickedInside = dropdown?.contains(event.target as Node) || 
                       trigger?.contains(event.target as Node);

  if (!clickedInside) {
    this.isMessagesDropdownOpen = false;
    dropdown?.classList.add('hidden');
    document.removeEventListener('click', this.closeMessagesOutside);
  }
};









}


