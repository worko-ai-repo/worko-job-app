export enum SortOrderTypeEnum {
  /**
   * Sort in ascending order. For example: 1, 2, 3.
   */
  ASCENDING = "ascending",
  /**
   * Sort in descending order. For example: 3, 2, 1.
   */
  DESCENDING = "descending",
}

/**
 * Admin Role
 */
export enum AdminRoleEnum {
  ADMIN = "ADMIN",
}

/**
 * MatchingScoreEntityEnum
 *
 * This enum is used in the "triggerMatchingScoreCalculation" function present in "InvokeLambda.service.ts"
 */
export enum MatchingScoreEntityEnum {
  REFERRAL = "REFERRAL", // Referral Request
  JOB_APP = "JOB_APP", // Job Application
}

/**
 * InternalUserRoleEnum
 *
 * This enum is used validating the `cognitoUserGroups` of the user in the backend
 * and some of the roles are  worko admin, corp-admin, corp-recruiter
 */
export enum InternalUserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}


/**
 * JobSourcedFromEnum
 */
export enum JobSourcedFromEnum {
  FANTASTIC_JOB = "FANTASTIC_JOB",
  WORKO = "WORKO",
  BRIGHT_DATA_JOB = "BRIGHT_DATA_JOB",
}

/**
 * OpenSearchOperationsEnum
 */
export enum OpenSearchOperationsEnum {
  CREATE_DOCUMENT = "createDocument",
  GET_DOCUMENTS = "getDocuments",
  GET_ALL_DOCUMENTS_WITHOUT_PAGINATION = "getAllDocumentsWithoutPagination",
  GET_DOCUMENT_BY_ID  = "getDocumentById",
  UPDATE_DOCUMENT_BY_ID = "updateDocumentById",
  DELETE_DOCUMENTS_BY_QUERY = "deleteDocumentsByQuery",
  UPDATE_DOCUMENTS_BY_QUERY = "updateDocumentsByQuery",
  BULK_CREATE_DOCUMENT  = "bulkCreateDocument",
}

export enum HiringEligibilityStatusEnum {
  ACTIVE = "ACTIVE",

  /*
  1. `UNDER_COOLING_PERIOD`
    1. Don't mark `candidate` as `UNDER_COOLING_PERIOD` when `candidate's` job application is rejected after any one of below statuses:
        1. APPLIED
        2. ACCEPTED 
        3. ON_HOLD
        4. CV_DOWNLOADED
        5. UNDER_EVALUATION
    2. Mark `candidate` as `UNDER_COOLING_PERIOD` when `candidate's` job application is rejected after any one of below statuses:
        1. PROCESSING_INTERVIEW
        2. INTERVIEW_DONE
        3. HIRING_IN_PROCESS
        4. DOCUMENT_REQUESTED
        5. DOCUMENT_SUBMITTED
        6. DOCUMENT_ADDITIONAL_REQUESTED
        7. DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED
        8. DOCUMENT_REVISION_REQUESTED
        9. DOCUMENT_REVISION_REQUEST_SUBMITTED
        10. DOCUMENT_VERIFIED
        11. OFFER_SENT
        12. OFFER_ISSUE_RAISED
        13. REVISED_OFFER_SENT
        14. HIRED
        15. JOINED
    3. Within this `6` months if `candidate` tries to apply then we should throw below error:
        `You recently interviewed for {COMPANY_NAME} and was rejected. So please wait until {Date} to apply for any other role for {COMPANY_NAME}.`
    4. After `6` months we should update `candidate` as `UNDER_COOLING_PERIOD` to `ACTIVE` for that particular `company` and send notification to candidate 
  */
  UNDER_COOLING_PERIOD = "UNDER_COOLING_PERIOD",

  /*
   1. Mark `candidate` as `BLACK_LISTED` with a reason
   2. When `candidate` applies a job and after 24 hours we will mark application as `REJECTED`.
  */
  BLACK_LISTED = "BLACK_LISTED",
}