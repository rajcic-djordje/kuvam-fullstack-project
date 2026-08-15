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
  CreateOfferRequest,
  DeleteOfferResponse,
  Offer,
  OfferResponse,
  OffersResponse,
  SellerOffer,
  SellerOfferResponse,
  SellerOffersResponse,
  UpdateOfferRequest
} from '../models/offer';

export interface OfferFilters {
  search?: string;
  category?: string;
}

const normalizeOffer = (
  offer: Offer
): Offer => {
  return {
    ...offer,
    imageUrl:
      resolveMediaUrl(
        offer.imageUrl
      ),
    seller: {
      ...offer.seller,
      profileImageUrl:
        resolveMediaUrl(
          offer.seller.profileImageUrl
        ),
      coverImageUrl:
        resolveMediaUrl(
          offer.seller.coverImageUrl
        )
    }
  };
};

const normalizeSellerOffer = (
  offer: SellerOffer
): SellerOffer => {
  return {
    ...offer,
    imageUrl:
      resolveMediaUrl(
        offer.imageUrl
      )
  };
};

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly http =
    inject(HttpClient);

  private readonly offersUrl =
    `${API_BASE_URL}/offers`;

  getOffers(
    filters: OfferFilters = {}
  ): Observable<OffersResponse> {
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
      .get<OffersResponse>(
        this.offersUrl,
        {
          params
        }
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offers:
              response.offers.map(
                normalizeOffer
              )
          };
        })
      );
  }

  getOfferById(
    offerId: string
  ): Observable<OfferResponse> {
    return this.http
      .get<OfferResponse>(
        `${this.offersUrl}/${offerId}`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeOffer(
                response.offer
              )
          };
        })
      );
  }

  getMyOffers():
    Observable<SellerOffersResponse> {
    return this.http
      .get<SellerOffersResponse>(
        `${this.offersUrl}/mine`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offers:
              response.offers.map(
                normalizeSellerOffer
              )
          };
        })
      );
  }

  createOffer(
    data: CreateOfferRequest
  ): Observable<SellerOfferResponse> {
    return this.http
      .post<SellerOfferResponse>(
        this.offersUrl,
        data
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  updateOffer(
    offerId: string,
    data: UpdateOfferRequest
  ): Observable<SellerOfferResponse> {
    return this.http
      .patch<SellerOfferResponse>(
        `${this.offersUrl}/${offerId}`,
        data
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  uploadOfferImage(
    offerId: string,
    file: File
  ): Observable<SellerOfferResponse> {
    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    return this.http
      .patch<SellerOfferResponse>(
        `${this.offersUrl}/${offerId}/image`,
        formData
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  deleteOfferImage(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http
      .delete<SellerOfferResponse>(
        `${this.offersUrl}/${offerId}/image`
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  activateOffer(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http
      .patch<SellerOfferResponse>(
        `${this.offersUrl}/${offerId}/activate`,
        {}
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  deactivateOffer(
    offerId: string
  ): Observable<SellerOfferResponse> {
    return this.http
      .patch<SellerOfferResponse>(
        `${this.offersUrl}/${offerId}/deactivate`,
        {}
      )
      .pipe(
        map(response => {
          return {
            ...response,
            offer:
              normalizeSellerOffer(
                response.offer
              )
          };
        })
      );
  }

  deleteOffer(
    offerId: string
  ): Observable<DeleteOfferResponse> {
    return this.http
      .delete<DeleteOfferResponse>(
        `${this.offersUrl}/${offerId}`
      );
  }
}