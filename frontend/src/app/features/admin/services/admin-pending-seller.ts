import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  inject,
  Injectable
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_BASE_URL
} from '../../../core/constants/api.constants';
import {
  AdminPendingSellerActionResponse,
  AdminPendingSellersResponse,
  AdminPendingSellersSort
} from '../models/admin-pending-seller';

@Injectable({
  providedIn: 'root'
})
export class AdminPendingSellerService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_BASE_URL}/admin/sellers`;

  getPendingSellers(
    search = '',
    sort: AdminPendingSellersSort = 'newest'
  ): Observable<AdminPendingSellersResponse> {
    let params = new HttpParams()
      .set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set(
        'search',
        searchTerm
      );
    }

    return this.http.get<AdminPendingSellersResponse>(
      `${this.apiUrl}/pending`,
      { params }
    );
  }

  approveSeller(
    sellerId: string
  ): Observable<AdminPendingSellerActionResponse> {
    return this.http.patch<AdminPendingSellerActionResponse>(
      `${this.apiUrl}/${sellerId}/approve`,
      {}
    );
  }

  rejectSeller(
    sellerId: string,
    reason: string
  ): Observable<AdminPendingSellerActionResponse> {
    return this.http.patch<AdminPendingSellerActionResponse>(
      `${this.apiUrl}/${sellerId}/reject`,
      {
        reason: reason.trim()
      }
    );
  }
}