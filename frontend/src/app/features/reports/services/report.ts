import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import {
  CreateReportRequest,
  CreateReportResponse
} from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly reportsUrl = `${API_BASE_URL}/reports`;

  createReport(
    data: CreateReportRequest
  ): Observable<CreateReportResponse> {
    return this.http.post<CreateReportResponse>(
      this.reportsUrl,
      data
    );
  }
}