import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${API_BASE_URL}/auth`;

  private readonly currentUserSignal = signal<AuthUser | null>(
    this.readStoredUser()
  );

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(() => {
    return (
      this.currentUserSignal() !== null &&
      this.hasAccessToken()
    );
  });

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.authUrl}/register`,
      data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.authUrl}/login`,
      data
    ).pipe(
      tap(response => {
        localStorage.setItem(
          'accessToken',
          response.accessToken
        );

        localStorage.setItem(
          'authUser',
          JSON.stringify(response.user)
        );

        this.currentUserSignal.set(response.user);
      })
    );
  }

  updateCurrentUser(user: AuthUser): void {
    localStorage.setItem(
      'authUser',
      JSON.stringify(user)
    );

    this.currentUserSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');

    this.currentUserSignal.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }

  private readStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem('authUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem('authUser');
      return null;
    }
  }

  
}