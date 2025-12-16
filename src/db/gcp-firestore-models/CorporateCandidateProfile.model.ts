// Import dtos
import { CorporateCandidateProfileDbPhoneNumberDto } from "../../dtos/CorporateCandidateProfile.dto";

// Import enums
import { CorporateCandidateProfileDbRefereeTypeEnum } from "../../enums/CorporateCandidateProfile.enum";

// Import models
import { BaseFirestoreModel } from "./Base.model";

interface DbCorporateCandidateProfileDto extends BaseFirestoreModel {
  /**
   * @description
   *  1. "companyId" is required in this collection because for corporate users only the candidate profiles will comes through a particular company
   */
  companyId: string;

  /**
   * @description
   *  1. Whenever "agency" submits a candidate profile against a job then "jobId" will be available
   *  2. Whenever "candidate" apply a job then "jobId" will be available
   */
  jobId?: string;

  candidateEmail: string;

  phoneNumberDetails: CorporateCandidateProfileDbPhoneNumberDto;

  refereeType: CorporateCandidateProfileDbRefereeTypeEnum;

  /**
   * @reference "id" field of "CandidateParsedCv.model.ts"
   */
  candidateParsedCvId: string;

  /**
   * @description
   *  1. If `refereeType` is "AGENCY" then "agencyUserSubmissionId" will be available
   * @reference "id" field of "AgencyUserSubmission.model.ts"
   */
  agencyUserSubmissionId?: string;

  /**
   * @description
   *  1. If `refereeType` is "AGENCY" then "agencyUserId" will be available
   */
  agencyUserId?: string;

  /**
   * @description
   *  1. If `refereeType` is "AGENCY" then "agencyRegisteredEmail" will be available
   */
  agencyRegisteredEmail?: string;

  /**
   * @reference "id" attribute of "UserDetail.model.ts" from "AWS Dynamodb"
   * @description
   *  1. If the candidate is registered in "worko" job portal then "userDetailId" will be available
   */
  userDetailId?: string;
}

export { DbCorporateCandidateProfileDto };
