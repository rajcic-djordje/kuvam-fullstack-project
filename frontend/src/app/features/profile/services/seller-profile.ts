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
  SellerProfile,
  SellerProfileResponse,
  UpdateSellerProfileRequest
} from '../models/profile';

const normalizeSellerProfile = (
  seller: SellerProfile
): SellerProfile => {
  return {
    ...seller,
    profileImageUrl:
      resolveMediaUrl(
        seller.profileImageUrl
      ),
    coverImageUrl:
      resolveMediaUrl(
        seller.coverImageUrl
      )
  };
};

@Injectable({
  providedIn: 'root'
})
export class SellerProfileService {
  private readonly http =
    inject(HttpClient);

  private readonly sellerProfileUrl =
    `${API_BASE_URL}/sellers/me`;

  getSellerProfile():
    Observable<SellerProfileResponse> {
    return this.http
      .get<SellerProfileResponse>(
        this.sellerProfileUrl
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }

  updateSellerProfile(
    data: UpdateSellerProfileRequest
  ): Observable<SellerProfileResponse> {
    return this.http
      .patch<SellerProfileResponse>(
        this.sellerProfileUrl,
        data
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }

  uploadProfileImage(
    file: File
  ): Observable<SellerProfileResponse> {
    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    return this.http
      .patch<SellerProfileResponse>(
        `${this.sellerProfileUrl}/profile-image`,
        formData
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }

  deleteProfileImage():
    Observable<SellerProfileResponse> {
    return this.http
      .delete<SellerProfileResponse>(
        `${this.sellerProfileUrl}/profile-image`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }

  uploadCoverImage(
    file: File
  ): Observable<SellerProfileResponse> {
    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    return this.http
      .patch<SellerProfileResponse>(
        `${this.sellerProfileUrl}/cover-image`,
        formData
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }

  deleteCoverImage():
    Observable<SellerProfileResponse> {
    return this.http
      .delete<SellerProfileResponse>(
        `${this.sellerProfileUrl}/cover-image`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSellerProfile(
                response.seller
              )
          };
        })
      );
  }
}