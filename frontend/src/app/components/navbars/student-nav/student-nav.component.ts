import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { filter } from 'rxjs/operators';
import { WebService } from 'src/app/services/web.service'; // Ensure WebService is imported correctly
import { User, UserService } from 'src/app/services/user.service'; // Ensure UserService is imported correctly
import {
  ChatMessage,
  MessageService,
} from 'src/app/services/message.service';
import { HttpClient } from '@angular/common/http';
import { ChatpopupComponent } from 'src/app/components/chatpopup/chatpopup.component'; // Update the path based on the correct location of the file
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css'],
})
export class StudentNavComponent {
  unseenMessages: { [userId: number]: boolean } = {};
  users: any[] = [];
  selectedUser: any = null;
  currentUser = ''; // Replace with actual logged-in user ID
  recipientId = '';
  user!: User;
  UserName = '';
  lastMessages: { [userId: string]: ChatMessage } = {};

  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService,
    private WebService: WebService,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  @ViewChild('popup') popupRef: any; // Or ChatpopupComponent if you prefer strong typing
  userToSend: any;

  openChat(user: any): void {
    this.userToSend = user;
    this.popupRef.open(); // Calls the open method inside chatpopup
    if (this.unseenMessages[user.id]) {
      delete this.unseenMessages[user.id];
    }
  }
  ngOnInit(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = String(user.id); // Assuming the user object has an 'id' property
        this.UserName = user.nom; // Assuming you need the username as well
        console.log('UserName:', this.UserName);

        // ✅ Connect WebSocket only after user is loaded
      },
      error: (err) => {
        console.error('Error fetching user from localStorage:', err);
      },
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];

      // Special handling for 'apply' route to show 'Internships' as parent
      if (routeURL === 'apply') {
        breadcrumbs.push(
          { label: 'Internships', url: '/student/intern' },
          { label: this.formatLabel(label), url }
        );
        return breadcrumbs;
      }

      // Skip if no label or if the route is 'student'
      if (label && routeURL !== 'student') {
        breadcrumbs.push({ label: this.formatLabel(label), url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
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

    const clickedInside =
      dropdown?.contains(event.target as Node) ||
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

    const clickedInside =
      dropdown?.contains(event.target as Node) ||
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
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Convert currentUser to number before comparing
        this.users = users.filter((user) => user.id !== +this.currentUser);
        console.log('Fetched users:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });

    if (this.isMessagesDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeMessagesOutside);
      });
    }
    this.loadUsersAndLastMessages();
  }

  private closeMessagesOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById('messagesDropdown');
    const trigger = document.querySelector('[data-messages-trigger]');

    const clickedInside =
      dropdown?.contains(event.target as Node) ||
      trigger?.contains(event.target as Node);

    if (!clickedInside) {
      this.isMessagesDropdownOpen = false;
      dropdown?.classList.add('hidden');
      document.removeEventListener('click', this.closeMessagesOutside);
    }
  };
  messages: ChatMessage[] = [];

  selectUser(user: any): void {
    this.selectedUser = user;
    this.recipientId = user.id;
    console.log(
      `Selecting user ${user.id}, current user is ${this.currentUser}`
    );

    this.WebService.connect(this.currentUser); // OK to call multiple times, internally it should avoid reconnecting

    this.unseenMessages[user.id] = true;
  }
  loadUsersAndLastMessages(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((u) => u.id !== +this.currentUser); // Exclude self

        // Load last messages
        this.messageService.getLastMessages(this.currentUser).subscribe({
          next: (lastMsgsMap) => {
            this.lastMessages = lastMsgsMap;

            // 🔥 Loop through users and check seen status
            this.users.forEach((user) => {
              this.messageService
                .getSeenStatus(user.id, this.currentUser)
                .subscribe({
                  next: (seen) => {
                    this.unseenMessages[user.id] = !seen; // true = unseen
                    console.log(`User ${user.id} => unseen:`, seen);
                  },
                  error: (err) => {
                    console.error(
                      `Error checking seen for user ${user.id}:`,
                      err
                    );
                  },
                });
            });
          },
          error: (err) => {
            console.error('Error fetching last messages:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }
}
