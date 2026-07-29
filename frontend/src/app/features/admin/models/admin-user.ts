export type AdminUserRole = 'buyer' | 'seller';

export type AdminUserStatus =
  | 'active'
  | 'suspended'
  | 'banned'
  | 'deactivated';

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  reportsCount: number;
  offences: unknown[];
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}

export type AdminUsersSort = 'newest' | 'oldest';