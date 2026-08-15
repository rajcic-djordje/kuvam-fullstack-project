import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  CreateOfferRequest,
  DeleteOfferResponse,
  OfferResponse,
  OffersResponse,
  SellerOfferResponse,
  SellerOffersResponse,
  UpdateOfferRequest
} from '../models/offer';

export interface OfferFilters {
  search?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly offersUrl = `${API_BASE_URL}/offers`;

  getOffers(
    filters: OfferFilters = {}
  ): Observable<OffersResponse> {
    let params = new HttpParams();

    const search = filters.search?.trim();

    if (search) {
      params = params.set('search', search);
    }

    if (filters.category) {
      params = params.set(
        'category',
        filters.category
      );
    }

    return this.http.get<OffersResponse>(
      this.offersUrl,
      {
        params
      }
    );
  }

  getOfferById(
    offerId: string
  ): Observable<OfferResponse> {
    return this.http.get<OfferResponse>(
      `${this.offersUrl}/${offerId}`
    );
  }

  getMyOffers(): Observable<SellerOffersResponse> {
    return this.http.get<SellerOffersResponse>(
      `${this.offersUrl}/mine`
    );
  }

  createOffer(
    data: CreateOfferRequest
  ): Observable<SellerOfferResponse> {
    return this.http.post<SellerOfferResponse>(
      this.offersUrl,
      data
    );
  }

  updateOffer(
    offerId: string,
    data: UpdateOfferRequest
  ): Observable<SellerOfferResponse> {
    return this.http.patch<SellerOfferResponse>(
      `${this.offersUrl}/${offerId}`,
      data
    );
  }

  uploadOfferImage(
    offerId: string,
    file: File
  ): Observable<SellerOfferResponse> {
    const formData = new FormData();

    formData.append(
      'image',
      file
    );

    return this.http.patch<SellerOfferResponse>(
      `${this.offersUrl}/${offerId}/image`,
      formData
    );
  }

  deleteOfferImage(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http.delete<SellerOfferResponse>(
      `${this.offersUrl}/${offerId}/image`
    );
  }

  activateOffer(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http.patch<SellerOfferResponse>(
      `${this.offersUrl}/${offerId}/activate`,
      {}
    );
  }

  deactivateOffer(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http.patch<SellerOfferResponse>(
      `${this.offersUrl}/${offerId}/deactivate`,
      {}
    );
  }

  deleteOffer(
    offerId: string
  ): Observable<DeleteOfferResponse> {
    return this.http.delete<DeleteOfferResponse>(
      `${this.offersUrl}/${offerId}`
    );
  }
}