
// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { CountCompanyDbAllJobApplicationCountsDto } from "../../dtos/CountCompany.dto";

// Import Enums
import { CountCompanyDbEntityTypeEnum } from "../../enums/CountCompany.enum";

class DbCountCompanyDto extends BaseDbDto {
  GSI1PK!: string;
  GSI1SK!: string;
  entityType!: CountCompanyDbEntityTypeEnum;

  companyId!: string;

  // When entityType is "JOB_APPLICATION"
  // For all applications against single job
  allJobApplicationCounts?: CountCompanyDbAllJobApplicationCountsDto;
}

const CountCompanySchema: Schema = new dynamoose.Schema(
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
      enum: Object.values(CountCompanyDbEntityTypeEnum),
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
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const CountCompanyModel: ModelType<DbCountCompanyDto> =
  dynamoose.model<DbCountCompanyDto>(
    "CountCompany",
    CountCompanySchema
  );

export { CountCompanyModel, DbCountCompanyDto };
