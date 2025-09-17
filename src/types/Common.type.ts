
// Import enums
import { AdminRoleEnum } from "../enums/Common.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { UserType } from "../enums/User.enum";

/**
 * CommonUserType
 */
export type CommonUserType =  CorporateUserTypeEnum | UserType | AdminRoleEnum;