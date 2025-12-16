// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { RequestEvaluationDbEvaluatorDetailsDto } from "../../dtos/RequestEvaluation.dto";

// Import enums
import { ResponseEvaluationStatusEnum } from "../../enums/ResponseEvaluation.enum";

// Define the structure for Request Evaluation Database Data Transfer Object (DTO)
class DbRequestEvaluationDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;

  /**
   * @reference `id` attribute of `UserJobApplication.model.ts` in `worko-job-app` table of `dynamodb`
   */
  jobApplicationId!: string;

  /**
   * @reference `id` attribute of `CompanyJob.model.ts` in `worko-job-app` table of `dynamodb`
   */
  jobId!: string;

  /**
   * @reference `jobTitle` attribute of `CompanyJob.model.ts` in `worko-job-app` table of `dynamodb`
   */
  jobTitle!: string;

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
   * @description
   *  1. Whenever `corporate` or `worko-admin` clicks `Accept & Send for evaluation` from `agency user submission` listing
   * @reference "id" attribute of "CandidateParsedCv.model.ts" in gcp firestore
   */
  candidateParsedCvId?: string;

  /**
   * @reference `PK` attribute of `UserDetail.model.ts` in `worko` table of `dynamodb`
   */
  applicantUserEmail!: string;

  /**
   * @reference `name` attribute of `UserDetail.model.ts` in `worko` table of `dynamodb`
   */
  applicantName!: string;

  /**
   * @reference `id` attribute of `UserDetail.model.ts` in `worko` table of `dynamodb`
   */
  createdByUserId?: string;

  /**
   * @reference `id` attribute of `UserDetail.model.ts` in `worko` table of `dynamodb`
   */
  updatedByUserId?: string;

  /**
   * @reference `id` attribute of `CorporateUser.model.ts` in `worko` table of `dynamodb`
   */
  createdByCorporateUserId?: string;

  /**
   * @reference `id` attribute of `CorporateUser.model.ts` in `worko` table of `dynamodb`
   */
  updatedByCorporateUserId?: string;

  /**
   * 1. If evaluator submit feedback then item is
   *    created in `ResponseEvaluation` table and
   *    this attribute will be set with the `id` attribute of `ResponseEvaluation` table.
   *
   * @reference `id` attribute of `ResponseEvaluation.model.ts` in `worko-job-app` table of `dynamodb`
   */
  evaluationResponseId?: string;

  /**
   * 1. When the evaluator submit feedback then this attribute will be set with the `status` attribute of `ResponseEvaluation` table.
   * @reference `status` attribute of `ResponseEvaluation.model.ts` in `worko-job-app` table of `dynamodb`
   */
  evaluationResponseStatus?: ResponseEvaluationStatusEnum;

  /**
   * evaluatorDetails
   */
  evaluatorDetails!: RequestEvaluationDbEvaluatorDetailsDto;

  /**
   * hrName
   *
   * 1. `hrName` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
   */
  hrName!: string;

  /**
   * hrCurrentCompanyName
   *
   * 1. `hrCurrentCompanyName` may be `worko-admin's current company` or `corporate-admin's current company` or `corporate-recruiter's current company`
   */
  hrCurrentCompanyName!: string;

  /**
   * 1. `hr` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
   * 2. Whenever the hr sends a job application to the evaluator then feedback will be used.
   */
  hrDetailedFeedback!: string;
  hrHtmlDetailedFeedback!: string;
}

// Define the schema for the Request Evaluation
const RequestEvaluationSchema: Schema = new dynamoose.Schema(
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
    jobApplicationId: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    jobTitle: {
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
    candidateParsedCvId: {
      type: String,
      required: false,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantUserEmail: {
      type: String,
      required: true,
    },
    createdByUserId: {
      type: String,
      required: false,
    },
    updatedByUserId: {
      type: String,
      required: false,
    },
    createdByCorporateUserId: {
      type: String,
      required: false,
    },
    updatedByCorporateUserId: {
      type: String,
      required: false,
    },
    evaluatorDetails: {
      type: Object,
      required: true,
      schema: {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    },
    hrName: {
      type: String,
      required: true,
    },
    hrCurrentCompanyName: {
      type: String,
      required: true,
    },
    hrDetailedFeedback: {
      type: String,
      required: true,
    },
    hrHtmlDetailedFeedback: {
      type: String,
      required: true,
    },
    evaluationResponseId: {
      type: String,
      required: false,
    },
    evaluationResponseStatus: {
      type: String,
      required: false,
    }
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the RequestEvaluationModel using the defined schema
const RequestEvaluationModel: ModelType<DbRequestEvaluationDto> =
  dynamoose.model<DbRequestEvaluationDto>(
    "RequestEvaluation",
    RequestEvaluationSchema
  );

// Export the RequestEvaluationModel
export { RequestEvaluationModel, DbRequestEvaluationDto };