// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the config
import { DB_CONSTANTS } from "../DB.constants";

// Import Enums
import { EmailLogStatusEnum } from "../../enums/EmailLog.enum";

// Import Libraries
import { EmailSourceDestinationAddress } from "../../libraries/email.library";

// Import DTOs
import { BaseDbDto } from "./Base.model";

// Declaring a class 'DbEmailLogDto' that extends 'BaseDbDto' with specific properties required for string "Email Logs" in database
class DbEmailLogDto extends BaseDbDto {
  // Keys configs
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;

  // References and important details
  templateName!: string;
  awsMessageId!: string;
  createdByUserId!: string;
  updatedByUserId?: string;
  awsResponse?: Object;
  status!: EmailLogStatusEnum;

  // Email Addresses
  fromEmail!: string;
  fromName?: string;
  toEmail!: string;
  toName?: string;
  replyToEmails?: EmailSourceDestinationAddress[];
  ccEmails?: EmailSourceDestinationAddress[];
  bccEmails?: EmailSourceDestinationAddress[];

  // Template Template Details
  emailPlaceholders!: {
    [key: string]: string;
  };
  emailSubject!: string;
  emailTitle!: string;
  emailBody!: string;
}

// ReplyToEmailsSchema
// @todo test this just and following by removing the key "replyToEmails", if works then remove them.
const ReplyToEmailsSchema = new dynamoose.Schema({
  replyToEmails: {
    type: Object,
    schema: {
      email: String,
      fullName: String,
    },
  },
});

// CcEmailsSchema
const CcEmailsSchema = new dynamoose.Schema({
  ccEmails: {
    type: Object,
    schema: {
      email: String,
      fullName: String,
    },
  },
});

// BccEmailsSchema
const BccEmailsSchema = new dynamoose.Schema({
  bccEmails: {
    type: Object,
    schema: {
      email: String,
      fullName: String,
    },
  },
});

// Creating a Dynamoose "EmailLogSchema" for the "EmailLogModel" with specified attributes and their types
const EmailLogSchema = new dynamoose.Schema(
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
    awsMessageId: {
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
    awsResponse: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      required: false,
    },
    toEmail: {
      type: String,
      required: true,
    },
    toName: {
      type: String,
      required: false,
    },
    replyToEmails: {
      type: Array,
      required: false,
      schema: [ReplyToEmailsSchema],
    },
    ccEmails: {
      type: Array,
      required: false,
      schema: [CcEmailsSchema],
    },
    bccEmails: {
      type: Array,
      required: false,
      schema: [BccEmailsSchema],
    },
    emailPlaceholders: {
      type: Object,
      required: true,
    },
    emailSubject: {
      type: String,
      required: true,
    },
    emailTitle: {
      type: String,
      required: true,
    },
    emailBody: {
      type: String,
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Creating a DynamoDB 'EmailLogModel' based on the 'EmailLogSchema' and registering it with the database model
const EmailLogModel = dynamoose.model<DbEmailLogDto>(
  "EmailLog",
  EmailLogSchema
);

// Exporting the 'EmailLogModel' for external usage
export { EmailLogModel, DbEmailLogDto };
