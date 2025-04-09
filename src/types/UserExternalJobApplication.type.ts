
// Import enums
import { AdminRoleEnum } from "../enums/Common.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { UserType } from "../enums/User.enum";
import { UserExternalJobApplicationStatusEnum } from "../enums/UserExternalJobApplication.enum";

// Import models
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbUserExternalJobApplicationDto } from "../db/models/UserExternalJobApplication.model";

/**
 * UserExternalJobApplicationUserType
 */
export type UserExternalJobApplicationUserType =
  | CorporateUserTypeEnum
  | UserType
  | AdminRoleEnum;

/**
 * UserExternalJobApplicationUserTypeWithAdmin
 */
export type UserExternalJobApplicationUserTypeWithAdmin =
  | CorporateUserTypeEnum
  | AdminRoleEnum;

/**
 * UserExternalJobApplicationWithUserDetailsType
 */
export type UserExternalJobApplicationWithUserDetailsType =
  Partial<DbUserExternalJobApplicationDto> & {
    applicantDetails:
      | (Partial<DbUserDetailDto> & {
          profileImageAwsS3SignedUrl: string | null;
          cvAwsS3SignedUrl: string | null;
        })
      | undefined;
  };

/**
 * UserExternalJobApplicationStatusType
 */
export type UserExternalJobApplicationStatusType =
  | "APPLIED"
  | "HIRED";


/**
 * UserExternalJobApplicationStatusTrackerType
 */
export type UserExternalJobApplicationStatusTrackerType = Array<{
  oldStatus: UserExternalJobApplicationStatusEnum;
  newStatus: UserExternalJobApplicationStatusEnum;

  /**
   * Sample value of `actionDate`: 2024-12-17T11:36:46.753+00:00
   */
  actionDate?: string;

  /**
   * NOTE: If the job application status is `REJECTED` due to low matching score,
   * then the `userId` and `userType` will be stored as `undefined`.
   */
  userId?: string;
  userType?: UserExternalJobApplicationUserType;
}>;