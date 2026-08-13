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
  offences: number;
  suspensionReason: string | null;
  suspendedAt: string | null;
  banReason: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}

export interface AdminUserActionResponse {
  message: string;
  user: AdminUser;
}

export interface AdminUserReasonRequest {
  reason: string;
}

export type AdminUsersSort =
  | 'newest'
  | 'oldest';

export type AdminUsersRoleFilter =
  | 'all'
  | AdminUserRole;

export type AdminUsersStatusFilter =
  | 'all'
  | AdminUserStatus;