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
  AdminUserActionResponse,
  AdminUsersResponse,
  AdminUsersRoleFilter,
  AdminUsersSort,
  AdminUsersStatusFilter
} from '../models/admin-user';
import {
  AdminSuspendedUsersResponse
} from '../models/admin-suspended-user';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_BASE_URL}/admin/users`;

  getUsers(
    search = '',
    role: AdminUsersRoleFilter = 'all',
    status: AdminUsersStatusFilter = 'all',
    sort: AdminUsersSort = 'newest'
  ): Observable<AdminUsersResponse> {
    let params = new HttpParams()
      .set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set(
        'search',
        searchTerm
      );
    }

    if (role !== 'all') {
      params = params.set(
        'role',
        role
      );
    }

    if (status !== 'all') {
      params = params.set(
        'status',
        status
      );
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
    let params = new HttpParams()
      .set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set(
        'search',
        searchTerm
      );
    }

    return this.http.get<AdminSuspendedUsersResponse>(
      `${this.apiUrl}/suspended`,
      { params }
    );
  }

  suspendUser(
    userId: string,
    reason: string
  ): Observable<AdminUserActionResponse> {
    return this.http.patch<AdminUserActionResponse>(
      `${this.apiUrl}/${userId}/suspend`,
      {
        reason: reason.trim()
      }
    );
  }

  unsuspendUser(
    userId: string
  ): Observable<AdminUserActionResponse> {
    return this.http.patch<AdminUserActionResponse>(
      `${this.apiUrl}/${userId}/unsuspend`,
      {}
    );
  }

  banUser(
    userId: string,
    reason: string
  ): Observable<AdminUserActionResponse> {
    return this.http.patch<AdminUserActionResponse>(
      `${this.apiUrl}/${userId}/ban`,
      {
        reason: reason.trim()
      }
    );
  }

  unbanUser(
    userId: string
  ): Observable<AdminUserActionResponse> {
    return this.http.patch<AdminUserActionResponse>(
      `${this.apiUrl}/${userId}/unban`,
      {}
    );
  }
}