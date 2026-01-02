// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import enums
import { UserExternalJobApplicationStatusEnum } from "../../enums/UserExternalJobApplication.enum";

// Import types
import { UserExternalJobApplicationStatusTrackerType } from "../../types/UserExternalJobApplication.type";

/**
 * DbUserExternalJobApplicationDto
 * 
 * Define the structure for User External Job Application Database Data Transfer Object (DTO)
 */
class DbUserExternalJobApplicationDto extends BaseDbDto {
  // Ids
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;

  // references

  /**
   * @reference
   *  "id" field of `GcpFirestoreJob.model.ts`
   * @description
   *  1. Whenever we store an external job in `gcp firestore` and if someone applies for that job,
   *     then we are using `id` field of `GcpFirestoreJob.model.ts` as `jobId` field in `UserExternalJobApplication.model.ts`
   *  2. We will hard delete the external job from `gcp firestore` whenever its expired, then we should not use
   *     this `jobId` field as reference, instead we should use `externalJobUrl` field as reference.
   */
  jobId!: string;

  /**
   * @reference
   *  1. "jobUrl" field of `GcpFirestoreJob.model.ts`
   * @example "https://www.linkedin.com/jobs/view/test-engineer-at-bajaj-finserv-4292597143?_l=en"
   */
  externalJobUrl?: string;

  /**
   * @reference "externalJobId" field of `GcpFirestoreJob.model.ts`
   * @example "1357943872"
   */
  externalJobId?: string;

  applicantUserId!: string; // `id` attribute from `UserDetail` model in `worko` table on aws dynamodb

  status!: UserExternalJobApplicationStatusEnum;
  statusTracker!: UserExternalJobApplicationStatusTrackerType;
  companyName?: string;
  jobPortal?: string;

  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  matchingScore?: number;
  rejectionFeedbackBySystem?: string;
  scoreDetails?: string;
  scoreFetchedDate?: string;
}

// Define the schema for the User Job Application
const UserExternalJobApplicationSchema: Schema = new dynamoose.Schema(
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
    jobId: {
      type: String,
      required: true,
    },
    externalJobUrl: {
      type: String,
      required: false,
    },
    externalJobId: {
      type: String,
      required: false,
    },
    applicantUserId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    statusTracker:  {
      type: Array,
      required: true,
      schema: [
        {
          type: Object,
          schema: {
            oldStatus: {
              type: String,
              required: true,
            },
            newStatus: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: false,
            },
            userId: {
              type: String,
              required: false,
            },
            userType: {
              type: String,
              required: false,
            },
          },
        },
      ],
    },
    companyName: {
      type: String,
      required: false,
    },
    jobPortal: {
      type: String,
      required: false,
    },
    cvExtract: {
      type: String,
      required: false,
    },
    jdMatchErrorCode: {
      type: Number,
      required: false,
    },
    jdMatchErrorDesc: {
      type: String,
      required: false,
    },
    matchingScore: {
      type: Number,
      required: false,
    },
    rejectionFeedbackBySystem: {
      type: String,
      required: false,
    },
    scoreDetails: {
      type: String,
      required: false,
    },
    scoreFetchedDate: {
      type: String,
      required: false,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the UserExternalJobApplicationModel using the defined schema
const UserExternalJobApplicationModel: ModelType<DbUserExternalJobApplicationDto> =
  dynamoose.model<DbUserExternalJobApplicationDto>(
    "UserExternalJobApplication",
    UserExternalJobApplicationSchema
  );

// Export the UserExternalJobApplicationModel
export { UserExternalJobApplicationModel, DbUserExternalJobApplicationDto };
