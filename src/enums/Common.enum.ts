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
 * 
 * @todo: explain comment
 */
export enum JobSourcedFromEnum {
  FANTASTIC_JOB = "FANTASTIC_JOB",
  WORKO = "WORKO",
}