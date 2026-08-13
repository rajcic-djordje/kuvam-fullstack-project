import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';

export const userGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.currentUser()?.role;

  if (role === 'buyer' || role === 'seller') {
    return true;
  }

  if (role === 'admin') {
    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }

  return router.createUrlTree(['/']);
};