import { AdminUser } from './admin-user';

export interface AdminSuspendedUser
  extends Omit<AdminUser, 'status'> {
  status: 'suspended';
  suspensionReason: string;
  suspendedAt: string;
}

export interface AdminSuspendedUsersResponse {
  users: AdminSuspendedUser[];
}