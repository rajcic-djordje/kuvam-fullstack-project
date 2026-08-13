import { AuthUser } from '../../auth/models/auth';
import {
  Address,
  City,
  UpdateLocationRequest
} from '../../location/models/location';

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
  slug: string | null;
  description: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  city: City | null;
  pickupAddress: Address;
  approvalStatus: SellerApprovalStatus;
  rejectionReason?: string | null;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
  isOpen: boolean;
}

export interface UserProfile extends AuthUser {
  status: UserStatus;
  city: City | null;
  address: Address;
  hasLocation: boolean;
  reportsCount: number;
  offences: number;
  createdAt: string;
  sellerProfile?: SellerProfile | null;
}

export interface ProfileResponse {
  message: string;
  user: UserProfile;
}

export interface SellerProfileResponse {
  message: string;
  seller: SellerProfile;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface UpdateSellerProfileRequest {
  businessName?: string;
  description?: string;
  cityId?: string;
  street?: string;
  streetNumber?: string;
  additionalInfo?: string | null;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
}

export interface UpdateLocationResponse {
  message: string;
  user: UserProfile;
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

export type { UpdateLocationRequest };