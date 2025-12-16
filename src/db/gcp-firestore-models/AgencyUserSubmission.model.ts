// Import models
import { BaseFirestoreModel } from "./Base.model";

// Import dtos
import { AgencyUserSubmissionDbMatchingScoreDetailDto } from "../../dtos/AgencyUserSubmission.dto";

// Import enums
import { AgencyUserSubmissionDbJobApplicationStatusEnum } from "../../enums/AgencyUserSubmission.enum";

interface DbAgencyUserSubmissionDto extends BaseFirestoreModel {
  /**
   * @description For a "job" belongs to particular "company"
   * the "candidate profile" will be submitted by particular "agency"
   */
  companyId: string;
  jobId: string;

  /**
   * @description Email of the candidate which was submitted by particular "agency"
   */
  candidateEmail: string;

  /**
   * @reference "id" field of "CandidateParsedCv.model.ts"
   */
  candidateParsedCvId: string;

  /**
   * @reference "id" field of "AgencyUser.model.ts"
   * @description The registered agency user who submitted the "candidate profile"
   */
  agencyUserId: string;

  /**
   * @reference "email" field of "AgencyUser.model.ts"
   * @description The registered agency user who submitted the "candidate profile"
   */
  agencyRegisteredEmail: string;

  /**
   * @reference "id" field of "AgencyUserInvite.model.ts"
   */
  agencyUserInviteId: string;

  /**
   * @reference "agencyName" field of "AgencyUserInvite.model.ts"
   */
  agencyName: string;

  /**
   * @reference "id" field of "AgencyJobAssignment.model.ts"
   */
  agencyJobAssignmentId: string;

  agencyComments?: string;

  /**
   * @referenc "assignedByCorporateUserId" field of "AgencyJobAssignment.model.ts"
   */
  agencyJobAssignedByCorporateUserId?: string;

  /**
   * @reference "assignedByUserId" field of "AgencyJobAssignment.model.ts"
   */
  agencyJobAssignedByUserId?: string;

  matchingScoreDetails?: AgencyUserSubmissionDbMatchingScoreDetailDto;

  isFindMatchingScoreInProgress?: boolean;

  updatedByCorporateUserId?: string;

  /**
   * @description when "worko" admin updates the document
   */
  updatedByUserId?: string;

  updatedByAgencyUserId?: string;

  /**
   * @referenc "id" attribute of "UserJobApplication.model.ts" from AWS DynamoDB
   */
  userJobApplicationId?: string;

  jobApplicationStatus?: AgencyUserSubmissionDbJobApplicationStatusEnum;

  rejectApplicantDetails?: {
    reason: string;
    detailedReason?: string;
    actionByUserId?: string;
    actionByCorporateUserId?: string;
  };

  /**
   * @reference "id" attribute of "UserDetail.model.ts"
   * @description Only the user id of "admin"
   */
  moveToApplicantByUserId?: string;

  /***
   * @reference "id" attribute of "CorporateUser.model.ts"
   * @description Only the user id of "corporate-admin/recruiter"
   */
  moveToApplicantByCorporateUserId?: string;

  /**
   * @reference "id" attribute of "UserDetail.model.ts"
   * @description Only the user id of "admin"
   */
  sendForEvaluationByUserId?: string;

  /**
   * @reference "id" attribute of "CorporateUser.model.ts"
   * @description Only the user id of "corporate-admin/recruiter"
   */
  sendForEvaluationByCorporateUserId?: string;
}

export { DbAgencyUserSubmissionDto };
