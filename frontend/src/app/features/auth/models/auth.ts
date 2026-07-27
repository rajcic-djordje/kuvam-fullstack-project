export type UserRole = 'buyer' | 'seller';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: string;
  createdAt?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  businessName?: string;
  description?: string;
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