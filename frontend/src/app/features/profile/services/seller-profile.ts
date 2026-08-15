import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  SellerProfileResponse,
  UpdateSellerProfileRequest
} from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class SellerProfileService {
  private readonly http = inject(HttpClient);
  private readonly sellerProfileUrl = `${API_BASE_URL}/sellers/me`;

  getSellerProfile(): Observable<SellerProfileResponse> {
    return this.http.get<SellerProfileResponse>(
      this.sellerProfileUrl
    );
  }

  updateSellerProfile(
    data: UpdateSellerProfileRequest
  ): Observable<SellerProfileResponse> {
    return this.http.patch<SellerProfileResponse>(
      this.sellerProfileUrl,
      data
    );
  }

  uploadProfileImage(file: File): Observable<SellerProfileResponse> {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.patch<SellerProfileResponse>(
      `${this.sellerProfileUrl}/profile-image`,
      formData
    );
  }

  deleteProfileImage(): Observable<SellerProfileResponse> {
    return this.http.delete<SellerProfileResponse>(
      `${this.sellerProfileUrl}/profile-image`
    );
  }

  uploadCoverImage(file: File): Observable<SellerProfileResponse> {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.patch<SellerProfileResponse>(
      `${this.sellerProfileUrl}/cover-image`,
      formData
    );
  }

  deleteCoverImage(): Observable<SellerProfileResponse> {
    return this.http.delete<SellerProfileResponse>(
      `${this.sellerProfileUrl}/cover-image`
    );
  }
}