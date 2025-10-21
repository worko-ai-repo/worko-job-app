// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { CountCompanyJobDbAllJobApplicationCountsDto } from "../../dtos/CountCompanyJob.dto";

// Import Enums
import { CountCompanyJobDbEntityTypeEnum } from "../../enums/CountCompanyJob.enum";

class DbCountCompanyJobDto extends BaseDbDto {
  GSI1PK!: string;
  GSI1SK!: string;
  entityType!: CountCompanyJobDbEntityTypeEnum;

  companyId!: string;

  jobId!: string;

  // When entityType is "JOB_APPLICATION"
  // For all applications against single job
  allJobApplicationCounts?: CountCompanyJobDbAllJobApplicationCountsDto;
}

const CountCompanyJobSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
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
    entityType: {
      type: String,
      required: true,
      enum: Object.values(CountCompanyJobDbEntityTypeEnum),
    },
    jobId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    allJobApplicationCounts: {
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
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const CountCompanyJobModel: ModelType<DbCountCompanyJobDto> =
  dynamoose.model<DbCountCompanyJobDto>(
    "CountCompanyJob",
    CountCompanyJobSchema
  );

export { CountCompanyJobModel, DbCountCompanyJobDto };
