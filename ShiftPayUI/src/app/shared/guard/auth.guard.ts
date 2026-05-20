import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Optionally check if the route requires specific role permissions
    const expectedRoles = route.data['roles'] as Array<number>;
    if (expectedRoles && expectedRoles.length > 0) {
      const userRole = authService.getUserRole();
      if (userRole === null || !expectedRoles.includes(userRole)) {
        // User role not permitted, redirect to home/login
        router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }

  // Not authenticated, redirect to login with original returnUrl
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
