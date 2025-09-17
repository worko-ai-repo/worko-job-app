// Load the local models
import { DbUserDetailDto } from "../db/models/UserDetail.model";

/**
 * UserDetailProfileInfoType
 */
export type UserDetailProfileInfoType = {
  userDetails: DbUserDetailDto;
  cvAwsS3SignedUrl: string | null;
  profileImageAwsS3SignedUrl: string | null;
};
