import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';

export const sellerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.currentUser()?.role;

  if (role === 'seller') {
    return true;
  }

  if (role === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  if (role === 'buyer') {
    return router.createUrlTree(['/']);
  }

  return router.createUrlTree(['/login']);
};