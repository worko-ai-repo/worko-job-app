// Import google cloud firestore
import { FieldValue } from "@google-cloud/firestore";

// Import dtos
import {
  AgencyUserInviteDbActionTrackerDto,
  AgencyUserInviteDbPhoneNumberDto,
} from "../../dtos/AgencyUserInvite.dto";

// Import enums
import {
  AgencyUserInviteDbActionEnum,
  AgencyUserInviteDbStatusEnum,
} from "../../enums/AgencyUserInvite.enum";

// Import models
import { BaseFirestoreModel } from "./Base.model";

interface DbAgencyUserInviteDto extends BaseFirestoreModel {
  /**
   * @reference "id" attribute of "CorporateUser.model.ts" from "AWS DynamoDB"
   */
  invitedByCorporateUserId: string;

  /**
   * @reference "id" attribute of "CompanyDetail.model.ts" from "AWS DynamoDB"
   */
  companyId: string;

  /**
   * @reference "name" attribute of "CompanyDetail.model.ts" from "AWS DynamoDB"
   */
  companyName: string;

  /**
   * @description The name of the person who invited
   * @reference
   *  1. "firstName" + "lastName" attribute of "CorporateUser.model.ts" from "AWS DynamoDB"
   */
  inviterName: string;

  /**
   * @description The name of the person who is being invited
   */
  name: string;

  /**
   * @description
   *   1. Brand name of the agency
   *   2. May be a company name related to the agency
   *   3. Must store in `uppercase`
   */
  agencyName: string;

  inviteStatus: AgencyUserInviteDbStatusEnum;

  inviteAction?: AgencyUserInviteDbActionEnum;
  inviteActionTracker?: AgencyUserInviteDbActionTrackerDto[];

  /**
   * @description The email of the person who is being invited
   */
  email: string;

  /**
   * @description The phone number of the person who is being invited
   */
  phoneNumberDetails: AgencyUserInviteDbPhoneNumberDto;

  /**
   * @description The domain extracted from the "email" field
   * @example "swiggy.com" from "user@swiggy.com"
   */
  companyEmailDomainName?: string;

  /**
   * @description The domain extracted from the "email" field
   * @example "yahoo.com" from "user@yahoo.com"
   */
  miscellaneousEmailDomainName?: string;

  GSTIN?: string;

  /**
   * @reference Amazon S3 > Buckets > worko-corporate-{environment}/companies/{companyId}/agency-invites/{agencyInviteId}/contract-copies/
   */
  contractCopyAwsS3FileName?: string;

  contractCopyUserFileName?: string;

  /**
   * @reference "id" attribute of "CorporateUser.model.ts" from "AWS DynamoDB"
   */
  updatedByCorporateUserId?: string;

  /**
   * @reference "id" attribute of "AgencyUser.model.ts" from "GCP Firestore"
   * @description
   *  1. Whenever an agency registered, then we will update `inviteStatus` as `ACCEPTED` and this field will store the `id` of the agency registered
   */
  updatedByAgencyUserId?: string;

  /**
   * @description
   *  1. Whenever the "corporate-admin/recruiter" assigns jobs to this agency invite, then we will calculate and update this field
   *  2. Whenever the assigned jobs is removed by "corporate-admin/recruiter", then we will calculate and update this field
   */
  totalAssignedJobs?: number;

  /**
   * @description
   *  1. Whenever the "agency" submits a candidate to particular job, then we will calculate and update this field
   */
  totalCandidatesSubmitted?: number;

  /**
   * @description
   *  1. If `totalCandidatesSubmitted` is `3` and one candidate is rejected then `totalRejected` will be `1`
   */
  totalRejected?: FieldValue | number;

  /**
   * @description
   *  1. If `totalCandidatesSubmitted` is `3` and one candidate is hired then `totalHired` will be `1`
   */
  totalHired?: FieldValue | number;

  /**
   * @reference "id" attribute of "AgencyJobAssignment.model.ts"
   */
  agencyJobAssignmentIds?: string[];

  /**
   * @reference "id" attribute of "AgencyUserSubmission.model.ts" from "GCP Firestore"
   */
  agencyUserSubmissionIds?: string[];
}

export { DbAgencyUserInviteDto };
