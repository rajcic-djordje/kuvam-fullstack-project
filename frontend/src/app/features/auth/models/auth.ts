import { Address, City } from '../../location/models/location';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: string;
  phoneNumber: string;
  createdAt?: string;
  city?: City | null;
  address?: Address;
  hasLocation?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  businessName?: string;
  description?: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface RefreshSessionResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}