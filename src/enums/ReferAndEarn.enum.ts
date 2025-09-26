
/**
 * ReferAndEarnStatusEnum
 */
export enum ReferAndEarnStatusEnum {
  /**
   * NOT_ACHIEVED_YET
   *
   * Whenever the `referrer` refer his friend
   */
  NOT_ACHIEVED_YET = "NOT_ACHIEVED_YET",

  /**
   * ACHIEVED
   *
   * Whenever the `recipient` joined the company for the job which was referred by `referrer` then
   * the `referrer` is eligible for request withdrawal money
   */
  ACHIEVED = "ACHIEVED",

  /**
   * WITHDRAWAL_REQUESTED
   *
   * Whenever the Referrer requested a withdrawal money after `recipient` joined the company
   */
  WITHDRAWAL_REQUESTED = "WITHDRAWAL_REQUESTED",

  /**
   * WITHDRAWAL_ACCEPTED
   *
   * Whenever Request was accepted by worko admin
   */
  WITHDRAWAL_ACCEPTED = "WITHDRAWAL_ACCEPTED",

  /**
   * PAYMENT_COMPLETED
   *
   * Whenever Payment was completed by worko admin
   */
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",

  /**
   * WITHDRAWAL_REJECTED
   *
   * 1. Whenever the Request was rejected by worko admin
   * 2. Whenever the Job application of `recipient` was rejected
   *    1. Because of low matching score
   *    2. Because of corporate admin/recruiter rejecting 
   *    3. Because of worko admin rejecting
   */
  WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED",
}

export enum ReferAndEarnAllowedAdminUpdateStatusEnum {
  /**
   * WITHDRAWAL_ACCEPTED
   *
   * Whenever Request was accepted by worko admin
   */
  WITHDRAWAL_ACCEPTED = "WITHDRAWAL_ACCEPTED",

  /**
   * PAYMENT_COMPLETED
   *
   * Whenever Payment was completed by worko admin
   */
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",

  /**
   * WITHDRAWAL_REJECTED
   *
   * 1. Whenever the Request was rejected by worko admin
   * 2. Whenever the Job application of `recipient` was rejected
   *    1. Because of low matching score
   *    2. Because of corporate admin/recruiter rejecting
   *    3. Because of worko admin rejecting
   */
  WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED",
}

/**
 * ReferAndEarnJobApplicationStatusEnum
 */
export enum ReferAndEarnJobApplicationStatusEnum {
  /**
   * PENDING
   *
   * Whenever the `referrer` refer his friend
   */
  PENDING = "PENDING",

  /**
   * APPLIED
   *
   * Whenever the `recipient` applied for the `companyJob` which was
   * through the job link which was send by a `referrer`
   */
  APPLIED = "APPLIED",

  /**
   * REJECTED
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `REJECTED`:
   *  1. Whenever the `worko admin` rejects the `job application`
   *  2. Whenever the `corporate admin/recruiter`  rejects the `job application`
   *  3. Whenever the `job application` rejected because of low matching score
   */
  REJECTED = "REJECTED",

  /**
   * PROCESSING_INTERVIEW
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `PROCESSING_INTERVIEW`:
   *  1. Whenever the `worko admin` update the `job application` status to `PROCESSING_INTERVIEW`
   *  2. Whenever the `corporate admin/recruiter` update the `job application` status to `PROCESSING_INTERVIEW`
   */
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",

  /**
   * HIRED
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `HIRED`:
   *  1. Whenever the `worko admin` update the `job application` status to `hired`
   *  2. Whenever the `corporate admin/recruiter` update the `job application` status to `hired`
   */
  HIRED = "HIRED",

  /**
   * JOINED
   *
   * Whenever the `status` attribute in the `UserJobApplication.model.ts` is `JOINED`:
   *  1. Whenever the `worko admin` update the `job application` status to `JOINED`
   *  2. Whenever the `corporate admin/recruiter` update the `job application` status to `JOINED`
   */
  JOINED = "JOINED",
}