// Import dtos
import {
  RecordListingFilterOptions,
  RecordListingFilterRequestDTO,
} from "./Common.dto";

// Import enums
import { ReferAndEarnJobApplicationStatusEnum, ReferAndEarnStatusEnum } from "../enums/ReferAndEarn.enum";
import { AdminRoleEnum } from "../enums/Common.enum";

/**
 * ReferAndEarnCreateApiDto
 *
 * @description - The DTO is used to validate the request body of the refer and earn API.
 */
export interface ReferAndEarnCreateApiDto {
  /**
   * recipientDetails
   */
  recipientDetails: ReferAndEarnRecipientDetailsDto;

  /**
   * companyDetails
   */
  companyDetails: ReferAndEarnCompanyDetailsDto;

  /**
   * jobDetails
   */
  jobDetails: ReferAndEarnJobDetailsDto;
}

/**
 * ReferAndEarnCreateDto
 *
 * @description - The DTO is used by backend team to create refer and earn details.
 */
export interface ReferAndEarnCreateDto extends ReferAndEarnCreateApiDto {
  /**
   * createdByUserId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  createdByUserId: string;

  /**
   * referrerDetails
   */
  referrerDetails: ReferAndEarnReferrerDetailsDto;
}

/**
 * ReferAndEarnFilterOptions
 *
 * @description - Used for filtering referrals
 */
export interface ReferAndEarnFilterOptions extends RecordListingFilterOptions {
  status?: ReferAndEarnStatusEnum;
  companyId?: string;
  referrerEmail?: string;
  jobId?: string;
  userJobApplicationId?: string;
  jobApplicationStatus?: ReferAndEarnJobApplicationStatusEnum;
}

/**
 * ReferAndEarnListingFilterRequestDTO
 *
 * @description - The DTO used for requesting referral listings with filter options
 * Extends RecordListingFilterRequestDTO to ensure it has all required pagination properties
 */
export interface ReferAndEarnListingFilterRequestDTO extends RecordListingFilterRequestDTO {
  status?: ReferAndEarnStatusEnum;
  companyId?: string;
  referrerEmail?: string;
  jobId?: string;
  userJobApplicationId?: string;
  jobApplicationStatus?: ReferAndEarnJobApplicationStatusEnum;
}

/**
 * ReferAndEarnUpdateApiDto
 */
export interface ReferAndEarnUpdateApiDto {
  status?: ReferAndEarnStatusEnum;
  withDrawalRequestRejectedReason?: string;
  paymentDoneDetails?: ReferAndEarnPaymentDoneDetailsDto;
  referrerBankDetails?: ReferAndEarnReferrerBankDetails;
  commissionAmount?: number;
}

/**
 * ReferAndEarnUpdateDto
 * 
 * This is the api internal dto
 */
export interface ReferAndEarnUpdateDto {
  status?: ReferAndEarnStatusEnum;
  statusTracker?: ReferAndEarnStatusTrackerDto[];
  jobApplicationStatus?: ReferAndEarnJobApplicationStatusEnum;
  referrerBankDetails?: ReferAndEarnReferrerBankDetails;
  paymentDoneDetails?: ReferAndEarnPaymentDoneDetailsDto;
  commissionAmount?: number;
  updatedByUserId?: string;
}

/**
 * UpdateReferAndEarnInternalDto
 * 
 * This is the internal dto which will be reused for updating refer and earn details
 */
export interface UpdateReferAndEarnInternalDto {
  updatedByUserId: string;
  recipientDetails: ReferAndEarnRecipientDetailsDto;
  userJobApplicationId: string;
  jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum;
  jobAppliedDate: string;
  status: ReferAndEarnStatusEnum;
  statusTracker: ReferAndEarnStatusTrackerDto[];
  referrerBankDetails: ReferAndEarnReferrerBankDetails;
}

/**
 * ReferAndEarnRequestWithdrawalApiDto
 */
export interface ReferAndEarnRequestWithdrawalApiDto {
  accountHolderName: string;
  accountNumber: number;
  ifscCode: string;
  branchName: string;
}

/**
 * ReferAndEarnReferrerBankDetails
 * 
 * @reference `referrerBankDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnReferrerBankDetails {
  accountHolderName: string;
  accountNumber: number;
  ifscCode: string;
  branchName: string;
}

/**
 * ReferAndEarnReferrerDetailsDto
 * 
 * @description The details of the user who is referring the job to somebody else
 * 
 * @reference `referrerDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnReferrerDetailsDto {
  /**
   * id
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  id: string;

  /**
   * name
   *
   * @reference `name` attribute of `UserDetail.model.ts`
   */
  name: string;

  /**
   * email
   *
   * @reference `primaryEmail` from `PK` attribute of `UserDetail.model.ts`
   */
  email: string;

  /**
   * phoneCountryCode
   *
   * @example 91
   */
  phoneCountryCode: number;

  /**
   * phoneNumber
   *
   * @example 9666xxx100
   */
  phoneNumber: number;
};

/**
 * ReferAndEarnRecipientDetailsDto
 * 
 * @description The details of the user who is being referred by the "referrer".
 * 
 * @reference `recipientDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnRecipientDetailsDto {
  /**
   * id
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   *
   * NOTE:
   *  1. This value will be populated if the user's account is already `registered` in the application.
   *  2. If the user's account is not registered while referring, this value will be initially `undefined`,
   *     and will be updated once the user registers.
   *     @todo: The `Create Register Api` Code is in `worko-api` repository, so need to find a way
   *            to populate this value by discussing with team lead, but as of now 
   *            we are updating it whenever the user applies for a job which was referred by the referrer.
   */
  id?: string;

  /**
   * email
   */
  email: string;

  /**
   * name
   */
  name: string;

  /**
   * phoneCountryCode
   *
   * @example 91
   */
  phoneCountryCode: number;

  /**
   * phoneNumber
   *
   * @example 9666xxx100
   */
  phoneNumber: number;
};

/**
 * ReferAndEarnCompanyDetailsDto
 * 
 * @reference `companyDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnCompanyDetailsDto {
  /**
   * id
   *
   * @reference `id` attribute of `CompanyDetail.model.ts`
   */
  id: string;

  /**
   * name
   * 
   * @reference `name` attribute of `CompanyDetail.model.ts`
   */
  name: string;
}

/**
 * ReferAndEarnJobDetailsDto
 * 
 * @reference `jobDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnJobDetailsDto {
  /**
   * id
   *
   * @reference `id` attribute of `CompanyJob.model.ts`
   *
   * NOTE: As of now, we are using refer a friend feature for the
   *       jobs which are posted by `corporate admins/recruiters` and `worko admins`,
   *       so that's why we are referencing the `id` from `CompanyJob.model.ts`,
   *       If we implement refer and earn feature for `external jobs` in the future then
   *       we will reference the `id` accordingly.
   */
  id: string;

  /**
   * title
   * 
   * @reference `jobTitle` attribute of `CompanyJob.model.ts`
   */
  title: string;

  /**
   * url
   * 
   * @reference `jobUrl` attribute of `CompanyJob.model.ts`
   */
  url: string;
};

/**
 * ReferAndEarnStatusTrackerType
 */
export interface ReferAndEarnStatusTrackerDto {
  /**
   * oldStatus
   *
   * @reference `status` attribute of `ReferAndEarn.model.ts`
   */
  oldStatus?: ReferAndEarnStatusEnum;

  /**
   * newStatus
   *
   * @reference `status` attribute of `ReferAndEarn.model.ts`
   */
  newStatus: ReferAndEarnStatusEnum;

  /**
   * actionDate
   *
   * @example 2024-12-17T11:36:46.753+00:00
   */
  actionDate: string;

  /**
   * actionByUserId
   */
  actionByUserId?: string;

  /**
   * description
   *
   * Whenever the worko admin rejects the withdrawal request, the
   * reason for rejection will be provided here
   */
  description?: string;
};

/**
 * ReferAndEarnPaymentDoneDetailsType
 * 
 * @reference `paymentDoneDetails` attribute of `ReferAndEarn.model.ts`
 */
export interface ReferAndEarnPaymentDoneDetailsDto {
  /**
   * userId
   * 
   * The id of the user who has done the payment
   * 
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  userId: string;

  /**
   * userType
   * 
   * The type of the user who has done the payment
   */
  userType: AdminRoleEnum;

  /**
   * actionDate
   * 
   * The date and time when the payment was done
   *
   * @example 2024-12-17T11:36:46.753+00:00
   */
  actionDate: string;

  /**
   * amountPaid
   * 
   * The amount paid by the user
   */
  amountPaid: number;

  /**
   * uniqueTransactionReference
   *
   * 1. Unique Transaction Reference is mainly used in India for identifying bank-to-bank fund transfers.
   * 2. Unique Transaction Reference is Common in NEFT, RTGS, and IMPS transactions.
   *
   * @example "N1234567***23456"
   */
  uniqueTransactionReference: string;
};