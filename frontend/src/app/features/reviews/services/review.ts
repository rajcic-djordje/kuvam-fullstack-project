import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  SellerReviewsResponse
} from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly reviewsUrl = `${API_BASE_URL}/reviews`;

  createReview(data: CreateReviewRequest): Observable<CreateReviewResponse> {
    return this.http.post<CreateReviewResponse>(
      this.reviewsUrl,
      data
    );
  }

  getSellerReviews(sellerId: string): Observable<SellerReviewsResponse> {
    return this.http.get<SellerReviewsResponse>(
      `${this.reviewsUrl}/seller/${sellerId}`
    );
  }
}