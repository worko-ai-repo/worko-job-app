// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { CountUserDbCandidateReferralDto, CountUserDbEmployeeReferralDto, CountUserDbReferAndEarnJobApplicationDto, CountUserDbUserJobApplicationDto } from "../../dtos/CountUser.dto";

// Import Enums
import { CountUserDbEntityTypeEnum } from "../../enums/CountUser.enum";

class DbCountUserDto extends BaseDbDto {
  GSI1PK!: string;
  GSI1SK!: string;

  entityType!: CountUserDbEntityTypeEnum;

  /**
   * @reference `email` in `PK` attribute of `UserDetail.model.ts`
   */
  email!: string;

  /**
   * @description
   *  1. When entityType is "JOB_APPLICATION"
   *  2. If the user email has candidate account then these details will be stored
   */
  userJobApplicationCounts?: CountUserDbUserJobApplicationDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has candidate account then these details will be stored
   */
  candidateReferralCounts?: CountUserDbCandidateReferralDto;

  /**
   * @description
   *  1. When entityType is "REFERRAL"
   *  2. If the user email has employee account then these details will be stored
   */
  employeeReferralCounts?: CountUserDbEmployeeReferralDto;

  /**
   * @description
   *  1. When entityType is "REFER_AND_EARN"
   *  2. If the user email is a "referrer" and referred someone then these details will be stored
   */
  referAndEarnJobApplicationCounts?: CountUserDbReferAndEarnJobApplicationDto;
}

const CountUserSchema: Schema = new dynamoose.Schema(
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
      enum: Object.values(CountUserDbEntityTypeEnum),
    },
    email: {
      type: String,
      required: true,
    },
    userJobApplicationCounts: {
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
        underEvaluation: {
          type: Number,
          required: false,
        },
      },
    },
    candidateReferralCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: false,
        },
        accepted: {
          type: Number,
          required: false,
        },
        awaiting: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
        },
        done: {
          type: Number,
          required: false,
        },
      },
    },
    employeeReferralCounts: {
      type: Object,
      required: false,
      schema: {
        total: {
          type: Number,
          required: false,
        },
        accepted: {
          type: Number,
          required: false,
        },
        awaiting: {
          type: Number,
          required: false,
        },
        rejected: {
          type: Number,
          required: false,
        },
        done: {
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
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const CountUserModel: ModelType<DbCountUserDto> =
  dynamoose.model<DbCountUserDto>(
    "CountUser",
    CountUserSchema
  );

export { CountUserModel, DbCountUserDto };
