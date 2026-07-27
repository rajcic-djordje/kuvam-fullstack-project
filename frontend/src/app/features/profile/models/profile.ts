import { UserRole } from '../../auth/models/auth';

export type UserStatus =
  | 'active'
  | 'suspended'
  | 'deactivated'
  | 'banned';

export type SellerApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface SellerProfile {
  id: string;
  businessName: string;
  description: string;
  approvalStatus: SellerApprovalStatus;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  reportsCount: number;
  offences: number;
  createdAt: string;
  sellerProfile?: SellerProfile | null;
}

export interface ProfileResponse {
  message: string;
  user: UserProfile;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  description?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface DeactivateAccountResponse {
  message: string;
  user: {
    id: string;
    status: UserStatus;
  };
}