import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';
import { AuthService } from '../../features/auth/services/auth';
import { ApiErrorService } from '../../shared/services/api-error';
import { ToastService } from '../../shared/services/toast';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const apiErrorService = inject(ApiErrorService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  const isAuthRequest = request.url.includes('/auth/');

  const authorizedRequest = accessToken && !isAuthRequest
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : request;

  return next(authorizedRequest).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 403 &&
        apiErrorService.isBlockedAccountError(error) &&
        authService.isAuthenticated()
      ) {
        authService.clearSession();

        toastService.error(
          apiErrorService.getMessage(error, 'Tvoj nalog trenutno nije dostupan.'),
          'Sesija prekinuta'
        );

        void router.navigate(['/login']);

        return throwError(() => error);
      }

      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isAuthRequest
      ) {
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap(response => {
          const retriedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`
            }
          });

          return next(retriedRequest);
        }),
        catchError(refreshError => {
          authService.clearSession();

          return throwError(() => refreshError);
        })
      );
    })
  );
};