export interface AdminDashboardStatistics {
  totalUsers: number;
  buyers: number;
  sellers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  deactivatedUsers: number;
  approvedSellers: number;
  pendingSellers: number;
  activeOffers: number;
  activeOrders: number;
  pendingReports: number;
}

export interface AdminDashboardUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
}

export interface AdminDashboardSeller {
  _id: string;
  businessName: string;
  createdAt: string;
  user: AdminDashboardUser;
}

export interface AdminDashboardReport {
  _id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter?: AdminDashboardUser;
  reportedUser: AdminDashboardUser;
}

export type AdminActivityType =
  | 'user_registered'
  | 'offer_created'
  | 'order_created'
  | 'seller_approved'
  | 'report_reviewed';

export interface AdminActivity {
  type: AdminActivityType;
  title: string;
  description: string;
  createdAt: string;
}

export interface AdminDashboard {
  statistics: AdminDashboardStatistics;
  recentPendingSellers: AdminDashboardSeller[];
  recentPendingReports: AdminDashboardReport[];
  recentActivity: AdminActivity[];
}

export interface AdminDashboardResponse {
  dashboard: AdminDashboard;
}