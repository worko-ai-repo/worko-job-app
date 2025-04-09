// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// import Enums
import { JobApplicationStatus } from "../../enums/UserJobApplication.enum";

// import types
import {
  JobApplicationFollowUpRequestType,
  JobApplicationRejectedByUserIdType,
  JobApplicationStatusTrackerType,
} from "../../types/UserJobApplication.type";

// Define the structure for User Job Application Database Data Transfer Object (DTO)
class DbUserJobApplicationDto extends BaseDbDto {
  // Ids
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  GSI2PK!: string;
  GSI2SK!: string;

  // references
  companyId!: string;
  jobId!: string;

  /**
   * @reference `id` attribute of `ReferAndEarn.model.ts`
   */
  referAndEarnId?: string;

  status!: JobApplicationStatus;
  statusTracker!: JobApplicationStatusTrackerType;
  companyName!: string;
  jobPortal?: string;

  /**
   * When corporate user rejects the job application then
   * this attribute will be set along with other attributes
   */
  rejectedByUserId?: JobApplicationRejectedByUserIdType;

  /**
   * When candidate request follow up then this attribute will be set
   */
  followUpRequest?: JobApplicationFollowUpRequestType;

  /**
   * Attributes Being set after comparing `Job description` and `CV`
   * from `Python script` by Automation Architect Team
   */
  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  matchingScore?: number;
  rejectionFeedbackBySystem?: string;
  scoreDetails?: string;
  scoreFetchedDate?: string;
}

// Define the schema for the User Job Application
const UserJobApplicationSchema: Schema = new dynamoose.Schema(
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
    GSI2PK: {
      type: String,
      index: {
        name: "GSI2",
        type: "global",
        rangeKey: "GSI2SK",
      },
    },
    GSI2SK: {
      type: String,
      index: {
        name: "GSI2",
        type: "global",
      },
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
    companyId: {
      type: String,
      required: true,
    },
    referAndEarnId: {
      type: String,
      required: false
    },
    companyName: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    jobPortal: {
      type: String,
      required: false,
    },
    rejectedByUserId: {
      type: Object,
      required: false,
      schema: {
        userId: {
          type: String,
          required: true,
        },
        userType: {
          type: String,
          required: false,
        },
        actionDate: {
          type: String,
          required: false,
        },
        reason: {
          type: String,
          required: true,
        },
        userComment: {
          type: String,
          required: true,
        },
      },
    },
    followUpRequest: {
      type: Array,
      schema: [
        {
          type: Object,
          required: false,
          schema: {
            actionDate: {
              type: String,
              required: false,
            },
          },
        },
      ],
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

// Create the UserJobApplicationModel using the defined schema
const UserJobApplicationModel: ModelType<DbUserJobApplicationDto> =
  dynamoose.model<DbUserJobApplicationDto>(
    "UserJobApplication",
    UserJobApplicationSchema
  );

// Export the UserJobApplicationModel
export { UserJobApplicationModel, DbUserJobApplicationDto };
