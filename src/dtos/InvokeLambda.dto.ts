
// Import enums
import { CandidateParsedCvAwsS3ResourceTypeEnum } from "../enums/CandidateParsedCv.enum";
import { MatchingScoreEntityEnum } from "../enums/Common.enum";
import { InvokeLambdaHandlerEventTypeEnum, SourceTypeMatchingScoreEntityEnum } from "../enums/InvokeLambda.enum";
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

export interface InvokeLambdaJobApplicationValidationMatchingScoreDto {
  jobApplicationRequestId: string;
  userEmail: string;
}

export interface InvokeLambdaSourceTypeJdResumeMatchingScoreDto {
  sourceTypeMatchingScoreEntity: SourceTypeMatchingScoreEntityEnum;

  applicantEmail?: string;

  /**
   * @description 
   *  1. whenever "sourceTypeMatchingScoreEntity" is "USER_JOB_APPLICATION" then "userJobApplicationId" will be required.
   */
  userJobApplicationId?: string;

  actionByCorporateUserId?: string;

  actionByUserId?: string;

  /**
   * @reference The "id" attribute of the "CompanyJob.model.ts" from AWS DynamoDB
   */
  jobId: string;

  cvAwsS3ResourceType: CandidateParsedCvAwsS3ResourceTypeEnum;

  /**
   * @example
   *  In dev environment
   *    1. "worko-app-dev"
   *    2. "worko-corporate-dev"
   *  In prod environment
   *    1. "worko-app-prod"
   *    2. "worko-corporate-prod"
   */
  cvAwsS3BucketName: string;

  /**
   * @example
   *  1. "/agencies/{agencyUserId}/companies/{companyId}/jobs/{jobId}/user-profiles"
   *  2. "/users/{userId}/resumes"
   *  3. "/companies/{companyId}/bulk-cvs/{corporateBulkJdId}"
   */
  cvAwsS3FilePath: string;

  /**
   * @description
   *  1. Name of the aws s3 file
   *
   * @example "01K8TPT1PT2W5DTRSFPWTB92GH.pdf"
   */
  cvAwsS3FileName?: string;

  /**
   * @description
   *  1. If "cvAwsS3FilePath" is "/users/{userId}/resumes" then this will be used.
   * @example "USR#EML#shaukt1998+29@gmail.com"
   */
  USER_PK?: string;
}