// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Declaring a class 'DbEmailTemplateDto' that extends 'BaseDbDto' with specific properties "For Master Email Templates" in database
class DbEmailTemplateDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  templateName!: string;
  status!: string;
  subject!: string;
  title!: string;
  bodyHtml!: string;
  bodyText!: string;
  placeholders!: string[];
  description!: string;
  createdByUserId!: string;
  updatedByUserId?: string;
}

// Creating a Dynamoose "EmailTemplateSchema" for the "EmailTemplateModel" with specified attributes and their types
const EmailTemplateSchema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    GSI1PK: {
      //@todo Add required true to GSI1
      type: String,
      index: {
        name: "GSI1",
        type: "global",
        rangeKey: "GSI1SK",
      },
      required: true,
    },
    GSI1SK: {
      type: String,
      index: {
        name: "GSI1",
        type: "global",
      },
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    bodyHtml: {
      type: String,
      required: true,
    },
    bodyText: {
      type: String,
      required: true,
    },
    placeholders: {
      type: Array,
      required: true,
    },
    description: {
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
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Creating a DynamoDB 'EmailTemplateModel' based on the 'EmailTemplateSchema' and registering it with the database model
const EmailTemplateModel = dynamoose.model<DbEmailTemplateDto>(
  "EmailTemplate",
  EmailTemplateSchema
);

// Exporting the 'EmailTemplateModel' for external usage
export { EmailTemplateModel, DbEmailTemplateDto };
