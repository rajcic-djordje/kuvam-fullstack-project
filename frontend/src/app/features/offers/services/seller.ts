import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  inject,
  Injectable
} from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  SellerFilters,
  SellerResponse,
  SellersResponse
} from '../models/seller';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly http = inject(HttpClient);
  private readonly sellersUrl = `${API_BASE_URL}/sellers`;

  getSellers(
    filters: SellerFilters = {}
  ): Observable<SellersResponse> {
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

    return this.http.get<SellersResponse>(
      this.sellersUrl,
      {
        params
      }
    );
  }

  getSellerBySlug(slug: string): Observable<SellerResponse> {
    return this.http.get<SellerResponse>(
      `${this.sellersUrl}/${slug}`
    );
  }
}