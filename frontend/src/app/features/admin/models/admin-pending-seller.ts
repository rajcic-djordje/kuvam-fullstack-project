export interface AdminPendingSellerUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
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

export type AdminPendingSellersSort = 'newest' | 'oldest';