import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {Observable, tap, finalize, catchError, of} from 'rxjs';
import {API_BASE_URL} from '../../../core/constants/api.constants';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshSessionResponse,
  LogoutResponse
} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${API_BASE_URL}/auth`;
  private readonly adminAuthUrl = `${API_BASE_URL}/admin/auth`;

  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly authInitializedSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly authInitialized = this.authInitializedSignal.asReadonly();

  readonly isAuthenticated = computed(() => {
    return this.currentUserSignal() !== null && this.accessTokenSignal() !== null;
  });

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.authUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, data, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.accessTokenSignal.set(response.accessToken);
        this.currentUserSignal.set(response.user);
      })
    );
  }

  loginAdmin(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.adminAuthUrl}/login`, data, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.accessTokenSignal.set(response.accessToken);
        this.currentUserSignal.set(response.user);
      })
    );
  }

  refreshSession(): Observable<RefreshSessionResponse> {
    return this.http.post<RefreshSessionResponse>(`${this.authUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.accessTokenSignal.set(response.accessToken);
        this.currentUserSignal.set(response.user);
      })
    );
  }

  initializeSession(): Observable<RefreshSessionResponse | null> {
    return this.refreshSession().pipe(
      catchError(() => {
        this.clearSession();

        return of(null);
      }),
      finalize(() => {
        this.authInitializedSignal.set(true);
      })
    );
  }

  updateCurrentUser(user: AuthUser): void {
    this.currentUserSignal.set(user);
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.authUrl}/logout`, {}, {withCredentials: true}).pipe(
      finalize(() => {
        this.clearSession();
      })
    );
  }
  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
  }
}