// Import dtos
import {
  GcpFirestoreRecordListingFilterOptions,
  GcpFirestoreRecordListingFilterRequestDTO,
} from "./Common.gcp-firestore.dto";
import { CommonPhoneNumberDto } from "./Common.dto";

// Import enums
import {
  AgencyUserInviteDbActionEnum,
  AgencyUserInviteDbStatusEnum,
} from "../enums/AgencyUserInvite.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

export interface AgencyUserInviteCreateApiDto {
  companyId: string;

  /**
   * @description name of the person who is being invited
   */
  name: string;
  email: string;
  phoneNumberDetails: AgencyUserInviteDbPhoneNumberDto;

  /**
   * @description
   *   1. Brand name of the agency
   *   2. May be a company name related to the agency
   */
  agencyName: string;

  GSTIN?: string;
  contractCopyUserFileName?: string;
}

export interface AgencyUserInviteCreateDto extends AgencyUserInviteCreateApiDto {
  invitedByCorporateUserId: string;
  inviteStatus: AgencyUserInviteDbStatusEnum;

  /**
   * @reference "name" attribute of "CompanyDetail.model.ts" from "AWS DynamoDB"
   */
  companyName: string;

  /**
   * @description The name of the person who invited
   */
  inviterName: string;

  /**
   * @description The domain extracted from the "email" field (e.g., "swiggy.com" from "user@swiggy.com")
   * @example "swiggy.com" from "user@swiggy.com"
   */
  companyEmailDomainName?: string;

  /**
   * @description The domain extracted from the "email" field
   * @example "yahoo.com" from "user@yahoo.com"
   */
  miscellaneousEmailDomainName?: string;
}

export interface AgencyUserInviteDbPhoneNumberDto extends CommonPhoneNumberDto {}

export interface AgencyUserInviteCorpUpdateApiDto {
  agencyInviteId: string;

  /**
   * @example "01K8X5828XCC0E5QKTJ1ED91KJ.pdf"
   */
  contractCopyAwsS3FileName?: string;

  phoneNumberDetails?: AgencyUserInviteDbPhoneNumberDto;

  /**
   * @description
   *   1. Brand name of the agency
   *   2. May be a company name related to the agency
   */
  agencyName?: string;
}

export interface AgencyUserInviteListingFilterOptions extends GcpFirestoreRecordListingFilterOptions {
  /**
   * @reference "id" attribute of "CorporateUser.model.ts"
   */
  invitedByCorporateUserId?: string;

  /**
   * @reference "id" attribute of "CompanyDetail.model.ts"
   */
  companyId?: string;

  inviteStatus?: AgencyUserInviteDbStatusEnum;

  /**
   * @description The email of the person who is being invited
   */
  agencyEmail?: string;

  includeCompanyDetails?: boolean;

  includeInvitedOwnerDetails?: boolean;
}

export interface AgencyUserInviteListingFilterRequestDTO extends GcpFirestoreRecordListingFilterRequestDTO {
  /**
   * @reference "id" attribute of "CorporateUser.model.ts"
   */
  invitedByCorporateUserId?: string;

  /**
   * @reference "id" attribute of "CompanyDetail.model.ts"
   */
  companyId?: string;

  inviteStatus?: AgencyUserInviteDbStatusEnum;

  /**
   * @description The email of the person who is being invited
   */
  agencyEmail?: string;

  includeCompanyDetails?: boolean;

  includeInvitedOwnerDetails?: boolean;
}

export interface AgencyUserInviteAgencyUpdateApiDto {
  agencyInviteId: string;
  inviteStatus: AgencyUserInviteDbStatusEnum;
}

export interface AgencyUserInviteDbActionTrackerDto {
  oldAction?: AgencyUserInviteDbActionEnum;
  newAction: AgencyUserInviteDbActionEnum;
  actionDate?: string;
  actionByCorporateUserId?: string;
  actionByUserType?: CorporateUserTypeEnum;
  reason?: string;
  detailedDescription?: string;
}

export interface AgencyUserInviteActionUpdateApiDto {
  inviteAction: AgencyUserInviteDbActionEnum;
  agencyInviteId: string;
  reason?: string;
  detailedDescription?: string;
}
