
// Import enums
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";

export interface CountUserCommonJobApplicationDto {
  applied?: number;
  hired?: number;
  rejected?: number;
}

export interface CountUserDbUserJobApplicationDto extends CountUserCommonJobApplicationDto {
   total?: number;
   underEvaluation?: number;
}

export interface CountUserDbReferAndEarnJobApplicationDto extends CountUserCommonJobApplicationDto {
  total?: number;
  pending?: number;
}

export interface CountUserCommonReferralDto {
  total?: number;
  accepted?: number;
  awaiting?: number;
  rejected?: number;
  done?: number;
}

export interface CountUserDbCandidateReferralDto extends CountUserCommonReferralDto {}

export interface CountUserDbEmployeeReferralDto extends CountUserCommonReferralDto {}

export interface CountUserCreateDto {
  entityType: CountUserDbEntityTypeEnum;

  /**
   * @reference `email` in `PK` attribute of `UserDetail.model.ts`
   */
  email: string;

  /**
   * @description
   *  1. When entityType is "JOB_APPLICATION"
   *  2. If the user email has candidate account then these details will be stored
   */
  userJobApplicationCounts?: CountUserDbUserJobApplicationDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has candidate account then these details will be stored
   */
  candidateReferralCounts?: CountUserDbCandidateReferralDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has employee account then these details will be stored
   */
  employeeReferralCounts?: CountUserDbEmployeeReferralDto;

  /**
   * @description
   *  1. When entityType is "REFER_AND_EARN"
   *  2. If the user email is a "referrer" and referred someone then these details will be stored
   */
  referAndEarnJobApplicationCounts?: CountUserDbReferAndEarnJobApplicationDto;
}

export interface CountUserCommonUpdateDto {
  /**
   * @description
   *  1. When entityType is "JOB_APPLICATION"
   *  2. If the user email has candidate account then these details will be stored
   */
  userJobApplicationCounts: CountUserDbUserJobApplicationDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has candidate account then these details will be stored
   */
  candidateReferralCounts: CountUserDbCandidateReferralDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has employee account then these details will be stored
   */
  employeeReferralCounts: CountUserDbEmployeeReferralDto;

  /**
   * @description
   *  1. When entityType is "REFER_AND_EARN"
   *  2. If the user email is a "referrer" and referred someone then these details will be stored
   */
  referAndEarnJobApplicationCounts: CountUserDbReferAndEarnJobApplicationDto;
}

/**
 * @description
 *  1. When entityType is "JOB_APPLICATION"
 */
export interface CountUserJobApplicationEntityUpdateDto {
  userJobApplicationCounts: CountUserDbUserJobApplicationDto;
}

/**
 * @description
 *  1. When entityType is "REFER_AND_EARN"
 */
export interface CountUserReferAndEarnEntityUpdateDto {
  referAndEarnJobApplicationCounts: CountUserDbReferAndEarnJobApplicationDto;
}