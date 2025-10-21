// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { CountGlobalDbUserJobApplicationCountsDto, CountGlobalDbCompanyJobApplicationCountsDto, CountGlobalDbReferAndEarnJobApplicationCountsDto, CountGlobalDbReferralCountsDto } from "../../dtos/CountGlobal.dto";

// Import Enums
import { CountGlobalDbEntityTypeEnum } from "../../enums/CountGlobal.enum";

class DbCountGlobalDto extends BaseDbDto {
  entityType!: CountGlobalDbEntityTypeEnum;

  candidateJobApplicationCounts?: CountGlobalDbUserJobApplicationCountsDto;

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
          required: false,
        },
        applied: {
          type: Number,
          required: false,
        },
        hired: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
        },
        processingInterview: {
          type: Number,
          required: false,
        },
      },
    },
    companyJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: false,
        },
        applied: {
          type: Number,
          required: false,
        },
        hired: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
        },
        processingInterview: {
          type: Number,
          required: false,
        },
      },
    },
    referAndEarnJobApplicationCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: false,
        },
        applied: {
          type: Number,
          required: false,
        },
        hired: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
        },
        pending: {
          type: Number,
          required: false,
        },
      },
    },
    referralCounts: {
      type: Object,
      required: false,
      schema: {
        totalReferee: {
          type: Number,
          required: false,
        },
        awaiting: {
          type: Number,
          required: false,
        },
        accepted: {
          type: Number,
          required: false,
        },
        done: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
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
