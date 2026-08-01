import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
export interface UpdateAdminProfileRequest {
  firstName: string;
  lastName: string;
}

export interface UpdateAdminProfileResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    createdAt?: string;
  };
}

export interface ChangeAdminPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeAdminPasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${API_BASE_URL}/users`;

  updateProfile(
    request: UpdateAdminProfileRequest
  ): Observable<UpdateAdminProfileResponse> {
    return this.http.patch<UpdateAdminProfileResponse>(
      `${this.usersUrl}/me`,
      request
    );
  }

  changePassword(
    request: ChangeAdminPasswordRequest
  ): Observable<ChangeAdminPasswordResponse> {
    return this.http.patch<ChangeAdminPasswordResponse>(
      `${this.usersUrl}/me/password`,
      request
    );
  }
}