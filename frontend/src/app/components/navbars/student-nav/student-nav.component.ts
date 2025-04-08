import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent {
  breadcrumbs: Array<{label: string, url: string}> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{label: string, url: string}> = []): Array<{label: string, url: string}> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
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

  toggleDropdown() {
    const dropdown = document.getElementById('dropdownDivider');
    dropdown?.classList.toggle('hidden');
  }

  toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown?.classList.toggle('hidden');
  }
}