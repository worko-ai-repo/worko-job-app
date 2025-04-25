// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { ReferAndEarnCompanyDetailsDto, ReferAndEarnJobDetailsDto, ReferAndEarnPaymentDoneDetailsDto, ReferAndEarnRecipientDetailsDto, ReferAndEarnReferrerBankDetails, ReferAndEarnReferrerDetailsDto, ReferAndEarnStatusTrackerDto } from "../../dtos/ReferAndEarn.dto";

// Import enums
import {
  ReferAndEarnJobApplicationStatusEnum,
  ReferAndEarnStatusEnum,
} from "../../enums/ReferAndEarn.enum";

// Define the structure for User Job Application Database Data Transfer Object (DTO)
class DbReferAndEarnDto extends BaseDbDto {
  /**
   * ids
   */
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  GSI2PK!: string;
  GSI2SK!: string;

  /**
   * createdByUserId
   *
   * The id of the user who created this `item` in the database.
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  createdByUserId!: string;

  /**
   * updatedByUserId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  updatedByUserId?: string;

  /**
   * referrerDetails
   */
  referrerDetails!: ReferAndEarnReferrerDetailsDto;

  /**
   * recipientDetails
   */
  recipientDetails!: ReferAndEarnRecipientDetailsDto;

  /**
   * companyDetails
   */
  companyDetails!: ReferAndEarnCompanyDetailsDto;

  /**
   * jobDetails
   */
  jobDetails!: ReferAndEarnJobDetailsDto;

  /**
   * status
   */
  status!: ReferAndEarnStatusEnum;

  /**
   * statusTracker
   */
  statusTracker!: ReferAndEarnStatusTrackerDto[];

  /**
   * userJobApplicationId
   *
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  userJobApplicationId?: string;

  /**
   * jobApplicationStatus
   */
  jobApplicationStatus!: ReferAndEarnJobApplicationStatusEnum;

  /**
   * jobAppliedDate
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  jobAppliedDate?: string;

  /**
   * referrerBankDetails
   */
  referrerBankDetails?: ReferAndEarnReferrerBankDetails;

  /**
   * paymentDoneDetails
   */
  paymentDoneDetails?: ReferAndEarnPaymentDoneDetailsDto;

  /**
   * commissionAmount
   *
   * @example 5000
   */
  commissionAmount!: number;

  /**
   * referredDate
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  referredDate!: string;
}

// Define the schema for the User Job Application
const ReferAndEarnSchema: Schema = new dynamoose.Schema(
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
    createdByUserId: {
      type: String,
      required: true,
    },
    updatedByUserId: {
      type: String,
      required: false,
    },
    referrerDetails: {
      type: Object,
      required: true,
      schema: {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phoneCountryCode: {
          type: Number,
          required: true,
        },
        phoneNumber: {
          type: Number,
          required: true,
        },
      },
    },
    recipientDetails: {
      type: Object,
      required: true,
      schema: {
        id: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        phoneCountryCode: {
          type: Number,
          required: true,
        },
        phoneNumber: {
          type: Number,
          required: true,
        },
      },
    },
    companyDetails: {
      type: Object,
      required: true,
      schema: {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    },
    jobDetails: {
      type: Object,
      required: true,
      schema: {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        }
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
              required: false,
            },
            newStatus: {
              type: String,
              required: true,
            },
            actionDate: {
              type: String,
              required: true,
            },
            actionByUserId: {
              type: String,
              required: false,
            },
            description: {
              type: String,
              required: false,
            },
          },
        },
      ],
    },
    userJobApplicationId: {
      type: String,
      required: false,
    },
    jobApplicationStatus: {
      type: String,
      required: true,
    },
    jobAppliedDate: {
      type: String,
      required: false,
    },
    referrerBankDetails: {
      type: Object,
      required: false,
      schema: {
        accountHolderName: {
          type: String,
          required: true,
        },
        accountNumber: {
          type: Number,
          required: true,
        },
        branchName: {
          type: String,
          required: true,
        },
        ifscCode: {
          type: String,
          required: true,
        },
      },
    },
    paymentDoneDetails: {
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
        amountPaid: {
          type: Number,
          required: true,
        },
        uniqueTransactionReference: {
          type: String,
          required: true,
        },
      },
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    referredDate: {
      type: String,
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the model using the schema
const ReferAndEarnModel: ModelType<DbReferAndEarnDto> =
  dynamoose.model<DbReferAndEarnDto>("ReferAndEarn", ReferAndEarnSchema);

// Export the model
export { ReferAndEarnModel, DbReferAndEarnDto };
