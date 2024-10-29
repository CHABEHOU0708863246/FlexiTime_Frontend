import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const requiredRoles = route.data['requiredRoles'] as string[];
    const userRole = authService.getUserRole();

    if (userRole !== null && hasRequiredRole(userRole, requiredRoles)) {
      return true;
    } else {
      return router.parseUrl('/access-denied');
    }
  } else {
    return router.parseUrl('/auth/login');
  }
};

// Fonction pour vérifier si l'utilisateur possède le rôle requis
const hasRequiredRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};
