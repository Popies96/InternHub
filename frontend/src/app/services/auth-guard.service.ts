import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: JwtService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = next.data['roles'] as Array<string>;
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole();

    console.log('--- AuthGuard Debug ---');
    console.log('Requested URL:', state.url);
    console.log('Required Roles:', requiredRoles);
    console.log('Is User Logged In:', isLoggedIn);
    console.log('Current User Role:', userRole);

    // Public route (no role required)
    if (!requiredRoles) {
      return true;
    }

    // Route requires login but user not logged in
    if (requiredRoles.length > 0 && !isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // Check if user has required role
    if (isLoggedIn && (!userRole || !requiredRoles.includes(userRole))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
