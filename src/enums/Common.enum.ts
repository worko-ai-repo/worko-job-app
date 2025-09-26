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