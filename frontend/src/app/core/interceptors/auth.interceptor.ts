import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {inject} from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  throwError
} from 'rxjs';
import {AuthService} from '../../features/auth/services/auth';
import {RefreshSessionResponse} from '../../features/auth/models/auth';

let refreshRequest$: Observable<RefreshSessionResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const isAuthRequest = request.url.includes('/auth/');

  const authorizedRequest = accessToken && !isAuthRequest
    ? addAccessToken(request, accessToken)
    : request;

  return next(authorizedRequest).pipe(
    catchError(error => {
      if(!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthRequest)
        return throwError(() => error);

      return refreshAccessToken(authService).pipe(
        switchMap(response => {
          const retriedRequest = addAccessToken(request, response.accessToken);

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

const addAccessToken = (request: HttpRequest<unknown>, accessToken: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

const refreshAccessToken = (authService: AuthService) => {
  if(!refreshRequest$) {
    refreshRequest$ = authService.refreshSession().pipe(
      finalize(() => {
        refreshRequest$ = null;
      }),
      shareReplay(1)
    );
  }

  return refreshRequest$;
};