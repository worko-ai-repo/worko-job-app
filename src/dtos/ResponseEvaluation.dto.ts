// import dtos
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";

// import enums
import { ResponseEvaluationStatusEnum } from "../enums/ResponseEvaluation.enum";

/**
 * ResponseEvaluationCreateApiDTO
 * 
 * Data required from the API to create a response evaluation
 */
export interface ResponseEvaluationCreateApiDTO {
  /**
   * email of the user creating the response evaluation i.e `evaluator email`
   */
  createdByUserEmail: string;

  /**
   * evaluationRequesterUserId
   *
   * @reference `createdByUserId` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequesterUserId?: string;

  /**
   * evaluationRequesterCorporateUserId
   *
   * @reference `createdByCorporateUserId` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequesterCorporateUserId?: string;

  /**
   * @reference `id` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequestId: string;
  evaluatorName: string;

  jobApplicationId: string;
  jobId: string;
  companyId: string;
  applicantUserId?: string;
  applicantUserEmail: string;
  scheduledInterviewDetails?: ResponseEvaluationScheduledInterviewDetailsDto[];
  status: ResponseEvaluationStatusEnum;
  score: number;
  detailedFeedback: string;
  htmlDetailedFeedback: string;

  reason?: string;
  comment?: string;
  htmlComment?: string;
}

/**
 * ResponseEvaluationCreateDTO
 */
export interface ResponseEvaluationCreateDTO {
  /**
   * email of the user creating the response evaluation i.e `evaluator email`
   */
  createdByUserEmail: string;

  /**
   * @reference `id` attribute of `EvaluatorDetail.model.ts`
   */
  createdByEvaluatorUserId: string;

  /**
   * evaluationRequesterUserId
   *
   * @reference `createdByUserId` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequesterUserId?: string;

  /**
   * evaluationRequesterCorporateUserId
   *
   * @reference `createdByCorporateUserId` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequesterCorporateUserId?: string;

  /**
   * @reference `id` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequestId: string;
  evaluatorName: string;

  jobApplicationId: string;
  jobId: string;
  companyId: string;
  applicantUserId?: string;
  scheduledInterviewDetails?: ResponseEvaluationScheduledInterviewDetailsDto[];
  status: ResponseEvaluationStatusEnum;
  statusTracker: ResponseEvaluationStatusTrackerDto[];
}

/**
 * ResponseEvaluationListingFilterOptions
 */
export interface ResponseEvaluationListingFilterOptions extends RecordListingFilterOptions {
  evaluatorEmail?: string;
  jobApplicationId?: string;
  evaluatorRequesterUserId?: string;
  evaluatorRequesterCorporateUserId?: string;
  status?: ResponseEvaluationStatusEnum;
}

/**
 * ResponseEvaluationListingFilterRequestDTO
 */
export interface ResponseEvaluationListingFilterRequestDTO extends RecordListingFilterRequestDTO {
  evaluatorEmail?: string;
  jobApplicationId?: string;
  evaluatorRequesterUserId?: string;
  evaluatorRequesterCorporateUserId?: string;
  status?: ResponseEvaluationStatusEnum;
}

/**
 * ResponseEvaluationScheduledInterviewDetailsDto
 */
export interface ResponseEvaluationScheduledInterviewDetailsDto {
  timeSlot: string; // "30 mins"
  availability: number; // 1
  date: string; // "2024-12-17"(yyyy-mm-dd)
  startTime: string; // "12:30 PM"
  endTime: string; // "1:30 PM"

  // 2024-12-17T11:36:46.753+00:00
  actionDate: string;
}

/**
 * ResponseEvaluationStatusTrackerDto
 */
export interface ResponseEvaluationStatusTrackerDto {
  score: number;

  detailedFeedback: string;
  htmlDetailedFeedback: string;

  oldStatus?: ResponseEvaluationStatusEnum;

  newStatus: ResponseEvaluationStatusEnum;

  reason?: string;
  comment?: string;
  htmlComment?: string;

  // 2024-12-17T11:36:46.753+00:00
  actionDate: string;
}