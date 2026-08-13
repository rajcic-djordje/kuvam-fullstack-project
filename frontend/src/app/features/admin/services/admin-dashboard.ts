import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API_BASE_URL} from '../../../core/constants/api.constants';
import {AdminDashboardResponse} from '../models/admin-dashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly http = inject(HttpClient);
  private readonly dashboardUrl = `${API_BASE_URL}/admin/dashboard`;

  getDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(this.dashboardUrl);
  }
}