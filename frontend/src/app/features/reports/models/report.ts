export type ReportReason =
  | 'no_show'
  | 'inappropriate_behavior'
  | 'misleading_information'
  | 'food_quality_or_safety'
  | 'payment_issue'
  | 'other';

export interface CreateReportRequest {
  orderId: string;
  reason: ReportReason;
  description: string;
}

export interface CreatedReport {
  _id: string;
  reporter: string;
  reportedUser: string;
  order: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportResponse {
  message: string;
  report: CreatedReport;
}