
/**
 * FileResourceKeyEnum
 */
export enum FileResourceKeyEnum {
  /**
   * USER_JOB_APPL_DOC
   *
   * 1. The `corporate` or `worko admin` requests documents like `internship certificate`,
   * `education certificate` from `applicant` to follow hiring process
   * 2. And `applicant` can upload documents and submit to `corporate` or `worko admin`
   */
  USER_JOB_APPL_DOC = "USER_JOB_APPL_DOC",

  /**
   * HR_OFFER_LETTER_SENT
   * 
   * 1. Whenever the `corporate` or `worko admin` send offer letter to `applicant/candidate` then the offer letter will be uploaded to `s3`
   */
  HR_OFFER_LETTER_SENT = "HR_OFFER_LETTER_SENT",
}