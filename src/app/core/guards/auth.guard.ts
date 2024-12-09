import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (authService.isAuthenticated() && !tokenService.isTokenExpired()) {
    const requiredRoles = route.data['requiredRoles'] as string[];
    const userRole = authService.getUserRole();

    if (userRole !== null && hasRequiredRole(userRole, requiredRoles)) {
      return true;
    } else {
      return router.parseUrl('/access-denied');
    }
  } else {
    authService.logout();
    return router.parseUrl('/auth/login');
  }
};

const hasRequiredRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};
