// Import dtos
import { CommonPhoneNumberDto } from "./Common.dto";

export interface CorporateCandidateProfileDbPhoneNumberDto
  extends CommonPhoneNumberDto {}


export interface CorporateCandidateProfileDbUnderCoolingPeriodDto {
  /**
   * @example "2022-01-01T00:00:00.000Z"
   * @description
   *  1. Start date of the cooling period
   */
  startDate: string;

  /**
   * @example "2022-01-01T00:00:00.000Z"
   * @description
   *  1. End date of the cooling period
   */
  endDate: string;

  /**
   * @description
   *  1. This attribute is just stored whenever a candidate is rejected after interview,
   *     we set few months delay in the cooling period for the candidate, and this schedule
   *     job will trigger and remove candidate from cooling period and mark candidate as 
   *     "ACTIVE" hiringEligibilityStatus, so that candidate can apply for other jobs in that particular company.
   * @reference
   *  1. `id` attribute of `ScheduleJob.model.ts`
   *  2. `Schedule name` in [Amazon EventBridge > Scheduler > Schedules > Schedule name]
   */
  scheduledJobId: string;

  /**
   * @description
   *  1. This cooling period started because of this job application is rejected
   * @reference 
   *  1. `id` attribute of `UserJobApplication.model.ts`
   */
  userJobApplicationId: string;
}