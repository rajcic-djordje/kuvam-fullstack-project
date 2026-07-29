import {inject} from '@angular/core';
import {CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../features/auth/services/auth';

export const adminGuard: CanActivateFn = (
  route,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(
      ['/admin/login'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }

  if (authService.currentUser()?.role === 'admin') {
    return true;
  }

  return router.createUrlTree(['/']);
};