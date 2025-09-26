// import dtos
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";

// Import enums
import { ResponseEvaluationStatusEnum } from "../enums/ResponseEvaluation.enum";
import { RequestEvaluationDashboardTypeEnum } from "../enums/RequestEvaluation.enum";

/**
 * RequestEvaluationCreateApiDTO
 * 
 * Data required from the API to create a request evaluation
 */
export interface RequestEvaluationCreateApiDTO {
  jobApplicationId: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  applicantUserId: string;
  applicantUserEmail: string;
  applicantName: string;
  evaluatorDetails: RequestEvaluationDbEvaluatorDetailsDto;

  /**
   * hrName
   *
   * 1. `hrName` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
   */
  hrName: string;

  /**
   * hrCurrentCompanyName
   *
   * 1. `hrCurrentCompanyName` may be `worko-admin's current company` or `corporate-admin's current company` or `corporate-recruiter's current company`
   */
  hrCurrentCompanyName: string;

  /**
   * 1. `hr` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
   * 2. Whenever the hr sends a job application to the evaluator then feedback will be used.
   */
  hrDetailedFeedback?: string;
  hrHtmlDetailedFeedback?: string;
}

/**
 * RequestEvaluationCreateDto
 */
export interface RequestEvaluationCreateDto extends RequestEvaluationCreateApiDTO {
  createdByUserId?: string;
  createdByCorporateUserId?: string;
}

/**
 * RequestEvaluationBulkCreateApiDTO
 * 
 * Data required from the API to create bulk request evaluations
 */
export interface RequestEvaluationBulkCreateApiDTO {
  requestEvaluations: RequestEvaluationCreateApiDTO[];
}

/**
 * RequestEvaluationListingFilterOptions
 */
export interface RequestEvaluationListingFilterOptions extends RecordListingFilterOptions {
  evaluatorEmail?: string;
  jobApplicationId?: string;
  evaluationRequesterAdminUserId?: string;
  evaluationRequesterCorporateUserId?: string;
  dashboardType?: RequestEvaluationDashboardTypeEnum;
}

/**
 * RequestEvaluationListingFilterRequestDTO
 */
export interface RequestEvaluationListingFilterRequestDTO extends RecordListingFilterRequestDTO {
  evaluatorEmail?: string;
  jobApplicationId?: string;
  evaluationRequesterAdminUserId?: string;
  evaluationRequesterCorporateUserId?: string;
  dashboardType?: RequestEvaluationDashboardTypeEnum;
}

/**
 * RequestEvaluationCommonUpdateDto
 */
export interface RequestEvaluationCommonUpdateDto {
  evaluationResponseId: string;
  evaluationResponseStatus: ResponseEvaluationStatusEnum;
}

/**
 * RequestEvaluationDbEvaluatorDetailsDto
 * 
 * @reference `evaluatorDetails` attribute of `RequestEvaluation.model.ts`
 */
export interface RequestEvaluationDbEvaluatorDetailsDto {
  name: string;
  email: string;
}