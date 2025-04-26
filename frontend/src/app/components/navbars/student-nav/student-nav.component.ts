import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { TaskNotificationService } from 'src/app/services/task-notif.service';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent implements OnInit {
  // Notification properties
  taskNotifications: string[] = [];
  unreadTaskNotifications = 0;
  isNotificationDropdownOpen = false;

  // User properties
  breadcrumbs: Array<{label: string, url: string}> = [];
  currentUserPic = ''; 
  email = '';
  UserName = '';
  profilePics: string[] = Array.from({length: 17}, (_, i) => `/assets/pfp/p${i+1}.png`);

  // Dropdown states
  isDropdownOpen = false;
  isMessagesDropdownOpen = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private taskNotificationService: TaskNotificationService,
    private jwtService: JwtService,
    private userService: UserService
  ) {
    this.setupRouterEvents();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.taskNotificationService.connect(this.userId || 0);
  }

  userId: number | null = null;

  private loadUserData(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        console.log('User:', user);
        this.UserName = user.nom;
        this.email = user.email;
        this.userId = user.id;
        this.currentUserPic = this.getUserProfilePic(user.id);
        localStorage.setItem('pfp', this.currentUserPic);
        this.listenForNotif();
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.currentUserPic = '';
      }
    });
  }
  listenForNotif(): void {
    this.taskNotificationService.onMessage().subscribe((msg) => {
      console.log('Received message:ddddddddddddddddddd', msg);
  
      msg.timestamp = new Date(msg.timestamp);
        this.taskNotifications.push(msg)
     
      
    });
  }
  
  private playNotificationSound() {
    const audio = new Audio();
    audio.src = '/assets/sounds/notification.mp3'; // Add a notification sound file
    audio.load();
    audio.play().catch(e => console.error('Error playing sound:', e));
  }

  viewTask(taskId: number) {
    // Navigate to the task view
    this.router.navigate(['/student/tasks', taskId]);
  }

  clearNotification(notification: string) {
    this.taskNotifications = this.taskNotifications.filter(n => n !== notification);
    if (this.unreadTaskNotifications > 0) {
      this.unreadTaskNotifications--;
    }
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  // UI Interaction Methods
  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    if (this.isNotificationDropdownOpen) {
      this.markNotificationsAsRead();
      setTimeout(() => {
        document.addEventListener('click', this.closeNotificationOutside);
      });
    }
  }

  markNotificationsAsRead(): void {
    this.unreadTaskNotifications = 0;
  }

  // Existing methods (keep the same implementation)
  getUserProfilePic(userId: number): string {
    if (!userId) return ''; 
    const index = Math.abs(userId) % this.profilePics.length;
    return this.profilePics[index];
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{label: string, url: string}> = []): Array<{label: string, url: string}> {
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
    return label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdownOutside);
      });
    }
  }

  private closeDropdownOutside = (event: MouseEvent): void => {
    const dropdown = document.getElementById('dropdownDivider');
    const trigger = document.querySelector('[data-dropdown-trigger]');
    
    if (!dropdown?.contains(event.target as Node) && !trigger?.contains(event.target as Node)) {
      this.isDropdownOpen = false;
      document.removeEventListener('click', this.closeDropdownOutside);
    }
  };

  private closeNotificationOutside = (event: MouseEvent): void => {
    const dropdown = document.getElementById('notificationDropdown');
    const trigger = document.querySelector('[data-notification-trigger]');
    
    if (!dropdown?.contains(event.target as Node) && !trigger?.contains(event.target as Node)) {
      this.isNotificationDropdownOpen = false;
      document.removeEventListener('click', this.closeNotificationOutside);
    }
  };

  toggleMessagesDropdown(): void {
    this.isMessagesDropdownOpen = !this.isMessagesDropdownOpen;
    if (this.isMessagesDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeMessagesOutside);
      });
    }
  }

  private closeMessagesOutside = (event: MouseEvent): void => {
    const dropdown = document.getElementById('messagesDropdown');
    const trigger = document.querySelector('[data-messages-trigger]');
    
    if (!dropdown?.contains(event.target as Node) && !trigger?.contains(event.target as Node)) {
      this.isMessagesDropdownOpen = false;
      document.removeEventListener('click', this.closeMessagesOutside);
    }
  };

  toggleLogout(): void {
    this.jwtService.logout();
    this.router.navigate(['/login']);
  }
}