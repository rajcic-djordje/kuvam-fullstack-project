import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  ChangePasswordRequest,
  DeactivateAccountResponse,
  MessageResponse,
  ProfileResponse,
  UpdateProfileRequest
} from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly profileUrl = `${API_BASE_URL}/users/me`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.profileUrl);
  }

  updateProfile(
    data: UpdateProfileRequest
  ): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(
      this.profileUrl,
      data
    );
  }

  changePassword(
    data: ChangePasswordRequest
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${this.profileUrl}/password`,
      data
    );
  }

  deactivateAccount(): Observable<DeactivateAccountResponse> {
    return this.http.patch<DeactivateAccountResponse>(
      `${this.profileUrl}/deactivate`,
      {}
    );
  }
}