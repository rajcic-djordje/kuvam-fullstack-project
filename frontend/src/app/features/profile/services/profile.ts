import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable
} from '@angular/core';
import {
  map,
  Observable
} from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import { resolveMediaUrl } from '../../../shared/utils/media-url';
import {
  ChangePasswordRequest,
  DeactivateAccountResponse,
  MessageResponse,
  ProfileResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
  UpdateProfileRequest,
  UserProfile
} from '../models/profile';

const normalizeProfile = (
  user: UserProfile
): UserProfile => {
  if (!user.sellerProfile) {
    return user;
  }

  return {
    ...user,
    sellerProfile: {
      ...user.sellerProfile,
      profileImageUrl:
        resolveMediaUrl(
          user.sellerProfile
            .profileImageUrl
        ),
      coverImageUrl:
        resolveMediaUrl(
          user.sellerProfile
            .coverImageUrl
        )
    }
  };
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http =
    inject(HttpClient);

  private readonly profileUrl =
    `${API_BASE_URL}/users/me`;

  getProfile():
    Observable<ProfileResponse> {
    return this.http
      .get<ProfileResponse>(
        this.profileUrl
      )
      .pipe(
        map(response => {
          return {
            ...response,
            user:
              normalizeProfile(
                response.user
              )
          };
        })
      );
  }

  updateProfile(
    data: UpdateProfileRequest
  ): Observable<ProfileResponse> {
    return this.http
      .patch<ProfileResponse>(
        this.profileUrl,
        data
      )
      .pipe(
        map(response => {
          return {
            ...response,
            user:
              normalizeProfile(
                response.user
              )
          };
        })
      );
  }

  updateLocation(
    data: UpdateLocationRequest
  ): Observable<UpdateLocationResponse> {
    return this.http
      .patch<UpdateLocationResponse>(
        `${this.profileUrl}/location`,
        data
      )
      .pipe(
        map(response => {
          return {
            ...response,
            user:
              normalizeProfile(
                response.user
              )
          };
        })
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

  deactivateAccount():
    Observable<DeactivateAccountResponse> {
    return this.http.patch<DeactivateAccountResponse>(
      `${this.profileUrl}/deactivate`,
      {}
    );
  }
}