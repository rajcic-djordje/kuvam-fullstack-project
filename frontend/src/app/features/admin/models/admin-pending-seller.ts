export type AdminPendingSellersSort =
  | 'newest'
  | 'oldest';

export interface AdminPendingSellerUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'seller';
  status:
    | 'active'
    | 'suspended'
    | 'banned'
    | 'deactivated';
  reportsCount: number;
  offences: number;
  createdAt: string;
}

export interface AdminPendingSeller {
  _id: string;
  user: AdminPendingSellerUser;
  businessName: string;
  description: string;
  approvalStatus: 'pending';
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPendingSellersResponse {
  sellers: AdminPendingSeller[];
}

export interface AdminPendingSellerActionResponse {
  message: string;
  seller: AdminPendingSeller;
}