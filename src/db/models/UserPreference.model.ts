// Load the dynamoose packages
import * as dynamoose from "dynamoose";
import { Schema } from "dynamoose/dist/Schema";
import { ModelType } from "dynamoose/dist/General";

// Import the constants
import { DB_CONSTANTS } from "../DB.constants";

// Import Base model class
import { BaseDbDto } from "./Base.model";

class DbUserPreferenceDto extends BaseDbDto {
  id!: string;
  email!: string;
  createdByUserId!: string;
  updatedByUserId?: string;
  userPreferredDepartments?: string[];
  userPreferredIndustries?: string[];
  userPreferredlocations?: string[];
  userPreferredRoles?: string[];
}

const UserPreferenceSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdByUserId: {
      type: String,
      required: true,
    },
    updatedByUserId: {
      type: String,
      required: false,
    },
    userPreferredDepartments: {
      type: Array,
      schema: String,
      required: false,
    },
    userPreferredIndustries: {
      type: Array,
      schema: String,
      required: false,
    },
    userPreferredlocations: {
      type: Array,
      schema: String,
      required: false,
    },
    userPreferredRoles: {
      type: Array,
      schema: String,
      required: false,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const UserPreferenceModel: ModelType<DbUserPreferenceDto> =
  dynamoose.model<DbUserPreferenceDto>("UserPreference", [
    UserPreferenceSchema,
  ]);

export { UserPreferenceModel, DbUserPreferenceDto };
