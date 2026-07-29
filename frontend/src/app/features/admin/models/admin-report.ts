export type AdminReportStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type AdminReportReason =
  | 'no_show'
  | 'inappropriate_behavior'
  | 'misleading_information'
  | 'food_quality_or_safety'
  | 'payment_issue'
  | 'other';

export type AdminReportUserRole =
  | 'buyer'
  | 'seller';

export type AdminReportUserStatus =
  | 'active'
  | 'suspended'
  | 'banned'
  | 'deactivated';

export type AdminReportsSort =
  | 'newest'
  | 'oldest';

export type AdminReportsStatusFilter =
  | 'all'
  | AdminReportStatus;

export interface AdminReportUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminReportUserRole;
}

export interface AdminReportedUser extends AdminReportUser {
  status: AdminReportUserStatus;
  reportsCount: number;
  offences: number;
}

export interface AdminReportOrder {
  _id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface AdminReportReviewer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminReport {
  _id: string;
  reporter: AdminReportUser;
  reportedUser: AdminReportedUser;
  order: AdminReportOrder;
  reason: AdminReportReason;
  description: string;
  status: AdminReportStatus;
  reviewedBy: AdminReportReviewer | null;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportsResponse {
  message: string;
  reports: AdminReport[];
}

export interface AdminReportReviewRequest {
  adminNote?: string;
}

export interface AdminReportRejectRequest {
  adminNote: string;
}

export interface AdminReportReviewResponse {
  message: string;
  report: AdminReport;
  reportedUser?: {
    id: string;
    offences: number;
    status: AdminReportUserStatus;
    banReason: string | null;
  };
}