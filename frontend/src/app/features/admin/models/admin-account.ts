import { AuthUser
    
 } from "../../auth/models/auth";
export interface UpdateAdminProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateAdminProfileResponse {
  message: string;
  user: AuthUser;
}

export interface ChangeAdminPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeAdminPasswordResponse {
  message: string;
}