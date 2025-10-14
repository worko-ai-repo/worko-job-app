// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { CountGlobalDbCandidateJobApplicationCountsDto, CountGlobalDbCompanyJobApplicationCountsDto, CountGlobalDbEmployeeJobApplicationCountsDto, CountGlobalDbReferAndEarnJobApplicationCountsDto, CountGlobalDbReferralCountsDto } from "../../dtos/CountGlobal.dto";

// Import Enums
import { CountGlobalDbEntityTypeEnum } from "../../enums/CountGlobal.enum";

class DbCountGlobalDto extends BaseDbDto {
  entityType!: CountGlobalDbEntityTypeEnum;

  candidateJobApplicationCounts?: CountGlobalDbCandidateJobApplicationCountsDto;

  employeeJobApplicationCounts?: CountGlobalDbEmployeeJobApplicationCountsDto;

  companyJobApplicationCounts?: CountGlobalDbCompanyJobApplicationCountsDto;

  referralCounts?: CountGlobalDbReferralCountsDto;

  referAndEarnJobApplicationCounts?: CountGlobalDbReferAndEarnJobApplicationCountsDto;
}

const CountGlobalSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    entityType: {
      type: String,
      required: true,
      enum: Object.values(CountGlobalDbEntityTypeEnum),
    },
    candidateJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: true,
        },
        applied: {
          type: Number,
          required: true,
        },
        hired: {
          type: Number,
          required: true,
        },
        rejected: {
          type: Number,
          required: true,
        },
        processingInterview: {
          type: Number,
          required: true,
        },
      },
    },
    employeeJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: true,
        },
        applied: {
          type: Number,
          required: true,
        },
        hired: {
          type: Number,
          required: true,
        },
        rejected: {
          type: Number,
          required: true,
        },
        processingInterview: {
          type: Number,
          required: true,
        },
      },
    },
    companyJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: true,
        },
        applied: {
          type: Number,
          required: true,
        },
        hired: {
          type: Number,
          required: true,
        },
        rejected: {
          type: Number,
          required: true,
        },
        processingInterview: {
          type: Number,
          required: true,
        },
      },
    },
    referAndEarnJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: true,
        },
        applied: {
          type: Number,
          required: true,
        },
        hired: {
          type: Number,
          required: true,
        },
        rejected: {
          type: Number,
          required: true,
        },
        pending: {
          type: Number,
          required: true,
        },
      },
    },
    referralCounts: {
      type: Object,
      required: false,
      schema: {
        totalReferee: {
          type: Number,
          required: true,
        },
        awaiting: {
          type: Number,
          required: true,
        },
        accepted: {
          type: Number,
          required: true,
        },
        done: {
          type: Number,
          required: true,
        },
        rejected: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const CountGlobalModel: ModelType<DbCountGlobalDto> =
  dynamoose.model<DbCountGlobalDto>(
    "CountGlobal",
    CountGlobalSchema
  );

export { CountGlobalModel, DbCountGlobalDto };
