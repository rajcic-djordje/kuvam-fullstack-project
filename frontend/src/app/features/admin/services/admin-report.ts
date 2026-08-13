import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  AdminReportRejectRequest,
  AdminReportReviewRequest,
  AdminReportReviewResponse,
  AdminReportsResponse,
  AdminReportsSort,
  AdminReportsStatusFilter
} from '../models/admin-report';

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/reports/admin`;

  getReports(
    search = '',
    status: AdminReportsStatusFilter = 'all',
    sort: AdminReportsSort = 'newest'
  ): Observable<AdminReportsResponse> {
    let params = new HttpParams()
      .set('sort', sort);

    const searchTerm = search.trim();

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    if (status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<AdminReportsResponse>(
      this.apiUrl,
      { params }
    );
  }

  approveReport(
    reportId: string,
    adminNote = ''
  ): Observable<AdminReportReviewResponse> {
    const body: AdminReportReviewRequest = {};

    const note = adminNote.trim();

    if (note) {
      body.adminNote = note;
    }

    return this.http.patch<AdminReportReviewResponse>(
      `${this.apiUrl}/${reportId}/approve`,
      body
    );
  }

  rejectReport(
    reportId: string,
    adminNote: string
  ): Observable<AdminReportReviewResponse> {
    const body: AdminReportRejectRequest = {
      adminNote: adminNote.trim()
    };

    return this.http.patch<AdminReportReviewResponse>(
      `${this.apiUrl}/${reportId}/reject`,
      body
    );
  }
}