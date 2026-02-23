
// Import enums
import { MatchingScoreEntityEnum } from "../enums/Common.enum";
import { InvokeLambdaHandlerEventTypeEnum } from "../enums/InvokeLambda.enum";
import { JobStatusEnum } from "../enums/Job.enum";

/**
 * InvokeLambdaParsedJobDescriptionDto
 *
 * Payload for parsed job description while invoking lambda function
 */
export interface InvokeLambdaParsedJobDescriptionDto {
  /**
   * JOB_DESC
   *
   * Job Description to be parsed which will be come from frontend
   */
  JOB_DESC: string;
}

/**
 * InvokeLambdaToMatchUserResumeWithJobAndJdDto
 * 
 * Payload for updating user matching score while invoking lambda function
 */
export interface InvokeLambdaToMatchUserResumeWithJobAndJdDto {
  userId: string; // `id` attribute in `UserDetail.model.ts`
  jobId: string; 
}

/**
 * InvokeLambdaRejectJobApplicationDto
 */
export interface InvokeLambdaRejectJobApplicationDto {
  /**
   * @reference `UserDetail.model.ts`
   */
  applicantEmail: string;

  /**
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  jobApplicationId: string; 
}

/**
 * InvokeLambdMatchingScoreCalcualtionDto
 */
export interface InvokeLambdMatchingScoreCalcualtionDto {
  USER_PK: string;
  USER_DETAIL_SK: string;
  MATCHING_ENTITY: MatchingScoreEntityEnum;
  ENTITY_SK: string;
}

export interface InvokeLambdaHandlerEventPayloadDto {
  eventType: InvokeLambdaHandlerEventTypeEnum;
  data: unknown;
}

export interface InvokeLambdaNewInternalJobCandMatchDto {
  jobId: string;
  companyId: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}

export interface InvokeLambdaJobStatusCandJobRecommendAlertUpdateDto {
  jobId: string;
  jobStatusBeforeUpdate: JobStatusEnum,
}