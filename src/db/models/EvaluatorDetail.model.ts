// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Define the structure for Evaluator Detail Database Data Transfer Object (DTO)
class DbEvaluatorDetailDto extends BaseDbDto {
  id!: string;

  GSI1PK!: string;

  GSI1SK!: string;

  name!: string;

  email!: string;

  cognitoUserId!: string;
}

// Define the schema for the Evaluator Detail
const EvaluatorDetailSchema: Schema = new dynamoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cognitoUserId: {
      type: String,
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the EvaluatorDetailModel using the defined schema
const EvaluatorDetailModel: ModelType<DbEvaluatorDetailDto> =
  dynamoose.model<DbEvaluatorDetailDto>(
    "EvaluatorDetail",
    EvaluatorDetailSchema
  );

// Export the EvaluatorDetailModel
export { EvaluatorDetailModel, DbEvaluatorDetailDto };