// Import DTOs
import {
  RecordListingFilterOptions,
  RecordListingFilterRequestDTO,
} from "./Common.dto";

// Import Enums
import {
  CorporateUserInviteAccessTypeEnum,
  CorpInviteStatusEnum,
} from "../enums/CorporateUserInvite.enum";

/**
 * CorporateUserInviteCreateApiDto
 *
 * This DTO is used to validate and structure the data received from the client (API request).
 *
 * @see {CorporateUserInviteAccessTypeEnum}  - The type of access the user is requesting.
 */
export interface CorporateUserInviteCreateApiDto {
  companyId: string;
  corporateUserType: CorporateUserInviteAccessTypeEnum; // The type of access the user is requesting.
  email: string; // User Email to send the invite
  firstName: string; // Need firstName of the user
  lastName: string; // Need lastName of the user
}

/**
 * CorporateUserInviteCreateDto
 *
 * This is the DTO used to create a new access request for the company. Specially used by the backend team.
 *
 * @extends CorporateUserInviteCreateApiDto
 *
 * @see {CorpInviteStatusEnum}  - The inviteStatus of the corporate invite.
 */
export interface CorporateUserInviteCreateDto
  extends CorporateUserInviteCreateApiDto {
  companyName?: string; //  This Will be used only in the response that is send back to the user.
  inviteStatus: CorpInviteStatusEnum; // The inviteStatus of the corporate invite. Enum [AWAITING, ACCEPTED]

  createdByUserId?: string;
  createdByCorporateUserId?: string;

  expiresAt: Date; // The expiration date of the invite.
}

/**
 * CorporateUserInviteUpdateApiDto
 *
 * This is the DTO comes in the requestBody used to update the access request for the company.
 */
export interface CorporateUserInviteUpdateApiDto {
  inviteStatus?: CorpInviteStatusEnum; // The inviteStatus of the corporate invite. Enum [AWAITING, ACCEPTED, EXPIRED]
}

/**
 * CorporateUserInviteUpdateDto
 *
 * @extends CorporateUserInviteUpdateApiDto
 *
 * This is the DTO used to update the access request for the company. Specially used by the backend team.
 */
export interface CorporateUserInviteUpdateDto
  extends CorporateUserInviteUpdateApiDto {
  email: string;
  companyId: string;

  updatedByUserId?: string;
  updatedByCorporateUserId?: string;

  deletedByUserId?: string;
  deletedByCorporateUserId?: string;
}

/**
 * CorporateUserInviteLisitngFilterOptionsDTO
 *
 * The DTO that will be used to keep the request query params for the Corporate Invite Listing.
 *
 * @extends RecordListingFilterRequestDTO - The base DTO for the record listing filter requests.
 *
 * @see {CorporateUserInviteAccessTypeEnum}  - The type of access the user is requesting.
 * @see {CorpInviteStatusEnum}  - The inviteStatus of the corporate invite.
 */
export interface CorporateUserInviteLisitngFilterOptionsDTO
  extends RecordListingFilterRequestDTO {
  companyId?: string;
  corporateUserType?: CorporateUserInviteAccessTypeEnum;
  email?: string;
  firstName?: string;
  lastName?: string;
  inviteStatus?: CorpInviteStatusEnum;
}

/**
 * CorporateUserInviteLisitngFilterOptions
 *
 * This is the DTO used by the backend team to filter the corporate invites.
 *
 * @extends RecordListingFilterOptions - The base DTO for the record listing filter used by backend team.
 *
 * @see {CorporateUserInviteAccessTypeEnum}  - The type of access the user is requesting.
 * @see {CorpInviteStatusEnum}  - The inviteStatus of the corporate invite.
 */
export interface CorporateUserInviteLisitngFilterOptions
  extends RecordListingFilterOptions {
  companyId?: string;
  corporateUserType?: CorporateUserInviteAccessTypeEnum;
  email?: string;
  firstName?: string;
  lastName?: string;
  inviteStatus?: CorpInviteStatusEnum;
}
