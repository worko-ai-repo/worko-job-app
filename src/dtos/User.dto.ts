// import dtos
import {
  RecordListingFilterOptions,
  RecordListingFilterRequestDTO,
} from "../dtos/Common.dto";

// import enums
import { UserType } from "../enums/User.enum";

/**
 * Data required for user sign-up. Includes basic personal information,
 * optional professional details, and terms acceptance.
 */
export interface UserSignUpDTO {
  name: string;
  email: string;
  number: string;
  linkedinUrl?: string;
  ECTC?: number;
  YOE?: number;
  CV?: string;
  userId: string;
  acceptedTermsAndConditions: boolean;
}

/**
 * Extended data for creating a new candidate user in the system.
 * Includes all sign-up data plus additional fields for system management.
 */
export interface NewUserCandSignUpDTO {
  id: string;
  userId: string;
  name: string;
  email: string;
  number: string;
  linkedinUrl?: string;
  ECTC?: number;
  YOE?: number;
  CV?: string;
  emailList: { [key: string]: string };
  userType: string[];
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  lastAccessedDash: string;
  referralCount: number;
  isSubscribed: boolean;
  expiryDate: Date;
  acceptedTermsAndConditions: boolean;
}

/**
 * Data required from the API to create a user's referral request.
 * Focuses on the essentials needed to initiate the request.
 */
export interface UserReferralRequestCreateApiDTO {
  companyId: string;
  jobUrl: string;
  jdExtracted?: string;
  jobId?: string;
  jobPortal?: string;
}

/**
 * Complete data for creating a user's referral request in the system.
 * Includes API data plus the user's subscription ID.
 */
export interface UserReferralRequestCreateDTO {
  userSubscriptionId: string;
  companyId: string;
  jobUrl: string;
  jdExtracted?: string;
  jobId?: string;
  jobPortal?: string;
}

/**
 * Basic user details for responding to client requests.
 * Provides key information about the user's status.
 */
export interface UserDetailResponseDto {
  name: string;
  email: string;
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  isSubscribed: boolean;
}

/**
 * Data required for employee sign-up. Similar to UserSignUpDTO
 * but with additional work-related fields.
 */
export interface UserEmployeeSignUpDTO {
  name: string;
  email: string;
  number: string;
  linkedinUrl?: string;
  YOE: number; // @todo: `YOE` is not being used in UI, while employee sign-up, need to be removed by discussing with team
  companyName: string;
  companySK: string;
  companyEmailId?: string;
  department?: string;
  /* UI removed these fields from sign-up page
  designation: string;
  designationTag: number; */
  userId: string;
  acceptedTermsAndConditions: boolean;
}

/**
 * Extended data for creating a new employee user in the system.
 * Includes all sign-up data plus additional fields for system management.
 */
export interface NewUserEmpSignUpDTO {
  id: string;
  userId: string;
  name: string;
  email: string;
  number: string;
  linkedinUrl: string;
  YOE: number;
  emailList: { [key: string]: string };
  userType: string[];
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  lastAccessedDash: string;
  companyName: string;
  companySK: string;
  companyEmailId?: string;
  department?: string;
  referralCount: number;
  expiryDate: Date;
  isSubscribed: boolean;
  acceptedTermsAndConditions: boolean;
}

/**
 * User profile data for display purposes.
 * Contains key information to show in the UI.
 */
export interface UserProfileResponse {
  name: string;
  lastAccessedDash: string;
  profileImage: string;
}

/**
 * Data for updating a user's subscription details.
 * Allows modifying subscription status and referral counts.
 */
export interface UserSubscriptionDetailsUpdateDto {
  isSubscribed: boolean;
  referralCount: number;
  expiryDate?: Date;
}

/**
 * UsersListingFilterOptions
 *
 * It is similar to "UsersListingFilterRequestDTO" but it would be used in the backend to perform business logic.
 */
export interface UsersListingFilterOptions extends RecordListingFilterOptions {
  // Represents the filter options for querying users.
  // Should be used when filtering users records.
  userType?: UserType;
}

/**
 * UsersListingFilterRequestDTO
 */
export interface UsersListingFilterRequestDTO
  extends RecordListingFilterRequestDTO {
  // Represents the filter request DTO for querying users.
  // Should be used when requesting to filter users records.
  userType?: UserType;
}

export interface UserDetailDbResponsibilitiesDto {
  companyId?: string;
  companyName?: string;
  date?: {
    startDate: string; // "2025-03-20T16:02:34.277Z"
    endDate?: string;
  };
  description: string;
};