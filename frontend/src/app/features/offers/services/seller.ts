import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
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
  PublicSeller,
  SellerFilters,
  SellerResponse,
  SellersResponse
} from '../models/seller';

const normalizeSeller = (
  seller: PublicSeller
): PublicSeller => {
  return {
    ...seller,
    profileImageUrl:
      resolveMediaUrl(
        seller.profileImageUrl
      ),
    coverImageUrl:
      resolveMediaUrl(
        seller.coverImageUrl
      ),
    offers:
      seller.offers.map(
        offer => {
          return {
            ...offer,
            imageUrl:
              resolveMediaUrl(
                offer.imageUrl
              )
          };
        }
      )
  };
};

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly http =
    inject(HttpClient);

  private readonly sellersUrl =
    `${API_BASE_URL}/sellers`;

  getSellers(
    filters: SellerFilters = {}
  ): Observable<SellersResponse> {
    let params =
      new HttpParams();

    const search =
      filters.search?.trim();

    if (search) {
      params =
        params.set(
          'search',
          search
        );
    }

    if (filters.category) {
      params =
        params.set(
          'category',
          filters.category
        );
    }

    return this.http
      .get<SellersResponse>(
        this.sellersUrl,
        {
          params
        }
      )
      .pipe(
        map(response => {
          return {
            ...response,
            sellers:
              response.sellers.map(
                normalizeSeller
              )
          };
        })
      );
  }

  getSellerBySlug(
    slug: string
  ): Observable<SellerResponse> {
    return this.http
      .get<SellerResponse>(
        `${this.sellersUrl}/${slug}`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            seller:
              normalizeSeller(
                response.seller
              )
          };
        })
      );
  }
}