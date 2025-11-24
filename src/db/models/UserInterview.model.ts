// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import enums
import { InterviewStatusType } from "../../enums/UserInterview.enum";
import {
  InterviewHistoryEntryDto,
  InterviewRequestedByDto,
  InterviewScoreBreakdownDto,
} from "../../dtos/UserInterview.dto";

/**
 * DbInterviewDto
 *
 * DynamoDB model DTO representing an Interview session.
 * Mirrors the provided schema: keys, status, progress, history,
 * scoring, storage, and audit fields.
 */
class DbInterviewDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  createdByUserId!: string;

  candidateEmail!: string;

  /**
   * @description Interview status enum - e.g., PENDING, IN_PROGRESS, COMPLETED, CLOSED
   */
  status!: InterviewStatusType;
  totalQuestions!: number;
  currentQuestion!: string;

  /**
   * @example If multiple recruiters requested the interview for the candidate they can be tracked here
   */
  requestedBy?: Array<InterviewRequestedByDto>;

  /**
   * @description Overall interview score between 0-100
   */
  score?: number;

  /**
   * @description Detailed breakdown of interview scores by category
   */
  scoreBreakdown?: InterviewScoreBreakdownDto;
  duration?: number;
  avgResponseTime?: number;

  /**
   * @description History of interview questions, answers, feedback, and chunk upload details for each question
   */
  interviewHistory?: Array<InterviewHistoryEntryDto>;

  /**
   * @example It will show the s3 bucket path name where the interview recordings are stored
   */
  storagePath?: string;

  /**
   * @example It will show the overall upload status of the interview recordings e.g., UPLOADED, FAILED, PENDING
   */
  uploadStatus?: string;

  /**
   * @example It will show the last chunk id that was successfully uploaded for the interview recordings
   */
  lastChunkUploaded?: string;

  userFeedback?: { rating: number; comments?: string };

  updatedBy?: string;
  createdBy?: string;

  /**
   * @example Number of times the candidate has attempted the interview
   */
  retryCount?: number;

  /**
   * @example ISO string representing when the interview was initiated
   */
  initiatedAt?: string;

  /**
   * @example typeOfcandidate It will be added by lambda based on candidate responses at initiation time
   */
  typeOfcandidate?:object;
}

/**
 * InterviewSchema
 *
 * Dynamoose schema describing Interview entity attributes and indexes.
 */
const InterviewSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: { type: String, required: true },
    GSI1PK: {
      type: String,
      index: { name: "GSI1", type: "global", rangeKey: "GSI1SK" },
    },
    GSI1SK: { type: String, index: { name: "GSI1", type: "global" } },
    createdByUserId: { type: String, required: true },

    candidateEmail: { type: String, required: true },
    status: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    currentQuestion: { type: String, required: true },

    requestedBy: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          schema: {
            corporateUserId: { type: String, required: true },
            requesterUserName: { type: String, required: true },
            companyName: { type: String, required: true },
            companyId: { type: String, required: true },
            position: { type: String, required: true },
            jobId: { type: String, required: true },
            requestedByActor: { type: String, required: true },
            requestedAt: { type: String, required: true },
          },
        },
      ],
    },

    score: { type: Number, required: false },
    scoreBreakdown: {
      type: Object,
      required: false,
    },

    duration: { type: Number, required: false },
    avgResponseTime: { type: Number, required: false },

    interviewHistory: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          schema: {
            questionId: { type: String, required: true },
            questionText: { type: String, required: true },
            userAnswer: { type: String, required: true },
            feedback: { type: String, required: true },
            detailedFeedback: { type: String, required: false },
            isCorrect: { type: Boolean, required: true },
            timeTaken: { type: Number, required: true },
            chunkId: { type: String, required: true },
            chunkUploadStatus: { type: String, required: true },
            chunkFileMimeType: { type: String, required: true },
          },
        },
      ],
    },

    storagePath: { type: String, required: false },
    uploadStatus: { type: String, required: false },
    lastChunkUploaded: { type: String, required: false },

    userFeedback: {
      type: Object,
      required: false,
      schema: {
        rating: { type: Number, required: true },
        comments: { type: String, required: false },
      },
    },

    retryCount: { type: Number, required: false },
    updatedBy: { type: String, required: false },
    createdBy: { type: String, required: false },
    initiatedAt: { type: String, required: false },
    typeOfcandidate: { type: Object, required: false },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

/**
 * InterviewModel
 *
 * Dynamoose model bound to the Interview schema.
 */
const InterviewModel: ModelType<DbInterviewDto> = dynamoose.model<DbInterviewDto>(
  "Interview",
  InterviewSchema
);

export { InterviewModel, DbInterviewDto };