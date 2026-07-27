import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import { OffersResponse } from '../models/offer';

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

  getOffers(filters: OfferFilters = {}): Observable<OffersResponse> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    return this.http.get<OffersResponse>(this.offersUrl, { params });
  }
}