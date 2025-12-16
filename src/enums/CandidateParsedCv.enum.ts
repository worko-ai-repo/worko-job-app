export enum CandidateParsedCvAwsS3ResourceTypeEnum {
  /**
   * @description
   *  1. `Corporate-recruiter/admin` assign jobs to "Registered agency users" and if "agency" submits candidate cv for that job then
   * this resource key will be used
   *  2. Required request body: "companyId", "jobId", "agencyUserId", "candidateCvAwsS3FileName"
   */
  AGENCY_SUBMIT_USER_CV = "AGENCY_SUBMIT_USER_CV",

  /**
   * @description
   *  1. Cv of a registered user
   *  2. Required params: "cognitoUserId", "cloudFileName"
   */
  USER_RESUME = "USER_RESUME",

  /**
   * @description
   *  1. Cv of a user when bulk screening
   *  2. Required params: "companyId", "cloudFileName"
   *  3. Required request body: "corporateBulkJdId"
   */
  BULK_CVS = "BULK_CVS",
}
