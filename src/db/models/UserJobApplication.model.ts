// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import {
  UserJobApplicationDbJoinedDateDetailDto,
  UserJobApplicationDbOfferLetterDetailDto,
  UserJobApplicationDbOfferLetterIssueRaisedDetailDto,
  UserJobApplicationDbRejectedForJobClose,
  UserJobApplicationDbRequestedDocumentDetailDto,
  UserJobApplicationDbResponseDocumentDetailDto,
  UserJobApplicationHiredFromOtherPortal,
} from "../../dtos/UserJobApplication.dto";

// import Enums
import {
  JobApplicationStatus,
  UserJobApplicationDocumentStatusEnum,
} from "../../enums/UserJobApplication.enum";

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
  GSI3PK!: string;
  GSI3SK!: string;

  // references
  companyId!: string;
  jobId!: string;

  /**
   * @reference `id` attribute of `ReferAndEarn.model.ts`
   */
  referAndEarnId?: string;

  /**
   * @reference `id` attribute of `AgencyUserSubmission.model.ts`
   */
  agencyUserSubmissionId?: string;
  agencyUserId?: string;
  candidateParsedCvId?: string;

  status!: JobApplicationStatus;
  statusTracker!: JobApplicationStatusTrackerType;
  companyName!: string;
  jobPortal?: string;

  /**
   * When corporate user rejects the job application then
   * this attribute will be set along with other attributes
   */
  rejectedByUserId?: JobApplicationRejectedByUserIdType;

  rejectedForJobClose?: UserJobApplicationDbRejectedForJobClose;

  /**
   * Array to store multiple document requests (initial, additional, re-requests)
   */
  requestedDocumentDetails?: UserJobApplicationDbRequestedDocumentDetailDto[];

  /**
   * Array to store multiple document responses (initial submissions, revisions)
   */
  responseDocumentDetails?: UserJobApplicationDbResponseDocumentDetailDto[];

  /**
   * Current document status mapping for each requested document
   */
  documentCurrentStatusMap?: Record<
    string,
    UserJobApplicationDocumentStatusEnum
  >;

  /**
   * Current document mapping for each requested document
   * 
   * @example 
   * {
      "resume": "{ulidId}.pdf",
      "internship certificate": "{ulidId2}.pdf"
     }
   */
  documentCurrentMapping?: Record<string, string>;

  offerLetterDetails?: UserJobApplicationDbOfferLetterDetailDto[];

  offerLetterIssueRaisedDetails?: UserJobApplicationDbOfferLetterIssueRaisedDetailDto[];

  joiningDateDetails?: UserJobApplicationDbJoinedDateDetailDto[];

  /**
   * When candidate request follow up then this attribute will be set
   */
  followUpRequest?: JobApplicationFollowUpRequestType;

  /**
   * hiredFromOtherPortal
   *
   * This attribute is used to track the actual source of hiring (if any)
   * from external portal by the corporate user.
   *
   * For example:
   * - "Rohith" is a recruiter at Amazon who has registered on both "Worko.ai" and "LinkedIn" job portals.
   * - A candidate "Ashutosh" applies for a job at Amazon through both "Worko.ai" and "LinkedIn" job portals.
   * - Rohith views and hires Ashutosh via "LinkedIn" job portal first.
   * - Later, when Rohith views the same application on Worko.ai, he submits the
   *   information indicating that Ashutosh was already hired from another portal.
   */
  hiredFromOtherPortal?: UserJobApplicationHiredFromOtherPortal;

  /**
   * displayToCorporate
   *
   * This attribute is used whenever the `worko-admin` see a job application
   * and if its matching score is very near to the minimum matching score(example: 69),
   * then `worko-admin` will click on `send to recruiter` button in admin dashboard
   * and this attribute will be set to `true`.
   */
  displayToCorporate?: boolean;

  /**
   * rejectionAwsScheduleId
   *
   * @description
   *  1. This attribute is used whenever the `worko-admin` wants to show candidate
   *     job application even though the matching score is low.
   * @reference
   *  1. `id` attribute of `ScheduleJob.model.ts`
   *  2. `Schedule name` in [Amazon EventBridge > Scheduler > Schedules > Schedule name]
   */
  rejectionAwsScheduleId?: string;

  /**
   * rejectionBlacklistedAwsScheduleId
   *
   * @description
   *  1. This attribute is just stored as of now whenever the candidate is blacklisted 
   *     by `corporate` for his company and still candidate applies for this company job
   *     then we will create a schedule to update the status to `REJECTED`.
   *  2. As of now this attribute is not being used anywhere but just stored for future use.
   * @reference
   *  1. `id` attribute of `ScheduleJob.model.ts`
   *  2. `Schedule name` in [Amazon EventBridge > Scheduler > Schedules > Schedule name]
   */
  rejectionBlacklistedAwsScheduleId?: string;

  /**
   * isEvaluatorResponded
   *
   * If the evaluator has responded to the job application then this attribute will be set to `true`.
   */
  isEvaluatorResponded?: boolean;

  /**
   * @description 
   *  Corporate moving applicant without finding matching score and if corporate wants to find matching score
   *  in applicants page then we will trigger ai match score and set this attribute to `true`
   *  once matching score calculation is done then we will update this attribute to `false`
   */
  isFindMatchingScoreInProgress?: boolean;

  /**
   * Attributes Being set after comparing `Job description` and `CV`
   * from `Python script` by AI/ML Team
   */
  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  matchingScore?: number;
  checkEXPdata?: object;
  rejectCTCAndEXP?: boolean;

  /**
   * This is for `corporate-admin/recruiter` and `worko-admin`
   */
  rejectionFeedbackBySystem?: string;

  /**
   * This is for `candidate`
   */
  rejectionFeedbackBySystemForApplicant?: string;
  scoreDetails?: string;
  scoreDetailsForApplicant?: string;
  scoreFetchedDate?: string;

  /**
   * emailFeedback
   *
   * This attribute will be generated by `python code` when the user applied for a job
   * and will be used to send in email to job posters about job application
   *
   * @example "Candidate excels with over 5 years in Selenium automation, strong technical skills in Selenium, Protractor, Jenkins, and GitLab, and recognized agility in Agile environments."
   */
  emailFeedback?: string;
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
    GSI3PK: {
      type: String,
      index: {
        name: "GSI3",
        type: "global",
        rangeKey: "GSI3SK",
      },
      required: true,
    },
    GSI3SK: {
      type: String,
      index: {
        name: "GSI3",
        type: "global",
      },
      required: true,
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
    agencyUserSubmissionId: {
      type: String,
      required: false,
    },
    agencyUserId: {
      type: String,
      required: false,
    },
    candidateParsedCvId: {
      type: String,
      required: false,
    },
    referAndEarnId: {
      type: String,
      required: false,
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
    requestedDocumentDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          schema: {
            userId: {
              type: String,
              required: true,
            },
            userType: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
            requestedDocumentNames: {
              type: Array,
              schema: String,
              required: true,
            },
            documentStatus: {
              type: String,
              required: true,
            },
          },
        },
      ],
    },
    responseDocumentDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          schema: {
            userId: {
              type: String,
              required: true,
            },
            userType: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
            documentStatus: {
              type: String,
              required: true,
            },
            documentMapping: {
              type: Array,
              required: true, // Maps document name to cloud file name
              schema: [
                {
                  type: Object,
                  schema: {
                    documentName: {
                      type: String,
                      required: true,
                    },
                    cloudFileName: {
                      type: String,
                      required: true,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    documentCurrentStatusMap: {
      type: Object,
      required: false,
    },
    documentCurrentMapping: {
      type: Object,
      required: false,
    },
    offerLetterDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          required: false,
          schema: {
            userId: {
              type: String,
              required: true,
            },
            userType: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
            joiningDate: {
              type: String,
              required: false,
            },
            cloudFileName: {
              type: String,
              required: false,
            },
            remarks: {
              type: String,
              required: false,
            },
          },
        },
      ],
    },
    offerLetterIssueRaisedDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          required: false,
          schema: {
            userId: {
              type: String,
              required: true,
            },
            userType: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
            cloudFileName: {
              type: String,
              required: true,
            },
            remarks: {
              type: String,
              required: true,
            },
          },
        },
      ],
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
    rejectedForJobClose: {
      type: Object,
      required: false,
      schema: {
        userId: {
          type: String,
          required: false,
        },
        userType: {
          type: String,
          required: false,
        },
        actionDate: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: false,
        },
        userComment: {
          type: String,
          required: false,
        },
      },
    },
    joiningDateDetails: {
      type: Array,
      required: false,
      schema: [
        {
          type: Object,
          required: false,
          schema: {
            joiningDate: {
              type: String,
              required: true,
            },
            hrName: {
              type: String,
              required: false,
            },
            hrEmail: {
              type: String,
              required: false,
            },
            message: {
              type: String,
              required: false,
            },
            actionByUserId: {
              type: String,
              required: true,
            },
            actionByUserType: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
          },
        },
      ],
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
    hiredFromOtherPortal: {
      type: Object,
      required: false,
      schema: {
        portal: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
      },
    },
    displayToCorporate: {
      type: Boolean,
      required: false,
    },
    rejectionAwsScheduleId: {
      type: String,
      required: false,
    },
    rejectionBlacklistedAwsScheduleId: {
      type: String,
      required: false,
    },
    isEvaluatorResponded: {
      type: Boolean,
      required: false,
    },
    isFindMatchingScoreInProgress: {
      type: Boolean,
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
    checkEXPdata: {
      type: Object,
      required: false,
    },
    rejectCTCAndEXP: {
      type: Boolean,
      required: false,
    },
    rejectionFeedbackBySystem: {
      type: String,
      required: false,
    },
    rejectionFeedbackBySystemForApplicant: {
      type: String,
      required: false,
    },
    scoreDetails: {
      type: String,
      required: false,
    },
    scoreDetailsForApplicant: {
      type: String,
      required: false,
    },
    scoreFetchedDate: {
      type: String,
      required: false,
    },
    emailFeedback: {
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
