// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { ResponseEvaluationScheduledInterviewDetailsDto, ResponseEvaluationStatusTrackerDto } from "../../dtos/ResponseEvaluation.dto";

// import enums
import { ResponseEvaluationStatusEnum } from "../../enums/ResponseEvaluation.enum";

// Define the structure for Response Evaluation Database Data Transfer Object (DTO)
class DbResponseEvaluationDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;

  /**
   * createdByEvaluatorUserId
   *
   * @reference `id` attribute of `EvaluatorDetail.model.ts` in `worko-job-app` table of `dynamodb`
   */
  createdByEvaluatorUserId!: string;

  createdByUserEmail!: string;

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
   * evaluationRequestId
   *
   * @reference `id` attribute of `RequestEvaluation.model.ts`
   */
  evaluationRequestId!: string;

  /**
   * evaluatorName
   */
  evaluatorName!: string;

  /**
   * @reference `id` attribute of `UserJobApplication.model.ts` in `worko-job-app` table of `dynamodb`
   */
  jobApplicationId!: string;

  /**
   * @reference `id` attribute of `CompanyJob.model.ts` in `worko-job-app` table of `dynamodb`
   */
  jobId!: string;

  /**
   * @reference `id` attribute of `CompanyDetail.model.ts` in `worko` table of `dynamodb`
   */
  companyId!: string;

  /**
   * @reference `id` attribute of `UserDetail.model.ts` in `worko` table of `dynamodb`
   * @description 
   *  1. This will not be stored if applicant is unregistered
   */
  applicantUserId?: string;

  /**
   * @reference `email` attribute of `UserDetail.model.ts`
   */
  applicantUserEmail!: string;

  scheduledInterviewDetails?: ResponseEvaluationScheduledInterviewDetailsDto[];

  status!: ResponseEvaluationStatusEnum;

  statusTracker!: ResponseEvaluationStatusTrackerDto[];
}

// Define the schema for the Response Evaluation
const ResponseEvaluationSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    GSI1PK: {
      type: String,
      index: {
        name: "GSI1",
        type: "global",
        rangeKey: "GSI1SK",
      },
    },
    GSI1SK: {
      type: String,
      index: {
        name: "GSI1",
        type: "global",
      },
    },
    createdByEvaluatorUserId: {
      type: String,
      required: true,
    },
    createdByUserEmail: {
      type: String,
      required: true,
    },
    evaluationRequesterUserId: {
      type: String,
      required: false,
    },
    evaluationRequesterCorporateUserId: {
      type: String,
      required: false,
    },
    evaluationRequestId: {
      type: String,
      required: true,
    },
    evaluatorName: {
      type: String,
      required: true,
    },
    jobApplicationId: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    applicantUserId: {
      type: String,
      required: false,
    },
    applicantUserEmail: {
      type: String,
      required: true,
    },
    scheduledInterviewDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          required: false,
          schema: {
            timeSlot: { type: String, required: true },
            availability: { type: Number, required: true },
            date: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            actionDate: { type: String, required: true },
          },
        },
      ],
    },
    status: {
      type: String,
      required: true,
    },
    statusTracker: {
      type: Array,
      required: true,
      schema: [
        {
          type: Object,
          required: true,
          schema: {
            score: { type: Number, required: true },
            detailedFeedback: { type: String, required: true },
            htmlDetailedFeedback: { type: String, required: true },
            oldStatus: { type: String, required: false },
            newStatus: { type: String, required: true },
            reason: { type: String, required: false },
            comment: { type: String, required: false },
            htmlComment: { type: String, required: false },
            actionDate: { type: String, required: true },
          },
        },
      ],
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the ResponseEvaluationModel using the defined schema
const ResponseEvaluationModel: ModelType<DbResponseEvaluationDto> =
  dynamoose.model<DbResponseEvaluationDto>(
    "ResponseEvaluation",
    ResponseEvaluationSchema
  );

// Export the ResponseEvaluationModel
export { ResponseEvaluationModel, DbResponseEvaluationDto };
