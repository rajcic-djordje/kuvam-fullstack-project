import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminUsersResponse,
  AdminUsersSort
} from '../models/admin-user';
import {AdminSuspendedUsersResponse} from '../models/admin-suspended-user';
import { API_BASE_URL } from '../../../core/constants/api.constants';
@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/admin/users`;

  getUsers(
    search = '',
    sort: AdminUsersSort = 'newest'
  ): Observable<AdminUsersResponse> {
    let params = new HttpParams()
      .set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<AdminUsersResponse>(
      this.apiUrl,
      { params }
    );
  }

  getSuspendedUsers(
    search = '',
    sort: AdminUsersSort = 'newest'
  ): Observable<AdminSuspendedUsersResponse> {
    let params = new HttpParams().set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<AdminSuspendedUsersResponse>(
      `${this.apiUrl}/suspended`,
      { params }
    );
  }
}