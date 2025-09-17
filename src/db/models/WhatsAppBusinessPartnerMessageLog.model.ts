// import dynamoose
import * as dynamoose from "dynamoose";

//import constants
import { DB_CONSTANTS } from "../DB.constants";

// import models
import { BaseDbDto } from "./Base.model";

// import enums
import { UserContextTypeEnum } from "../../enums/User.enum";

// import dtos
import { WhatsAppBusinessPartnerPlaceholderParamDto } from "../../dtos/WhatsAppBusinessPartnerTemplatePlaceholder.dto";

// Define the DbWhatsAppBusinessPartnerMessageLogDto class for DynamoDB
class DbWhatsAppBusinessPartnerMessageLogDto extends BaseDbDto {
  // ids
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;

  // references
  recieverEmail!: string;

  // Message Context Details
  contextId?: string;
  contextType?: UserContextTypeEnum;
  // contextDetails?: object;

  // Send Message Details
  whatsAppBusinessPartnerSendMessageResponse?: object;
  whatsAppBusinessPartnerSendMessageResponseStatus?: string;
  whatsAppBusinessPartnerSendMessageResponseId?: string;

  templateName!: string;
  templatePlaceholders!: WhatsAppBusinessPartnerPlaceholderParamDto;
  fromPhoneNumber!: number; // `91xxxxxxxxxx`, without `+` sign and with country code as prefix(`91`)
  toPhoneNumber!: number; // `91xxxxxxxxxx`, without `+` sign and with country code as prefix(`91`)
}

// Define the WhatsAppBusinessPartnerMessageLogSchema for DynamoDB
const WhatsAppBusinessPartnerMessageLogSchema = new dynamoose.Schema(
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
    recieverEmail: {
      type: String,
      required: true,
    },
    contextId: {
      type: String,
      required: false,
    },
    contextType: {
      type: String,
      required: false,
    },
    whatsAppBusinessPartnerSendMessageResponse: {
      type: Object,
      required: false,
    },
    whatsAppBusinessPartnerSendMessageResponseStatus: {
      type: String,
      required: false,
    },
    whatsAppBusinessPartnerSendMessageResponseId: {
      type: String,
      required: false,
    },
    templateName: {
      type: String,
      required: true,
    },
    templatePlaceholders: {
      type: Object,
      required: true,
    },
    fromPhoneNumber: {
      type: Number,
      required: true,
    },
    toPhoneNumber: {
      type: Number,
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Define the WhatsAppBusinessPartnerMessageLogModel
const WhatsAppBusinessPartnerMessageLogModel =
  dynamoose.model<DbWhatsAppBusinessPartnerMessageLogDto>(
    "WhatsAppBusinessPartnerMessageLog",
    WhatsAppBusinessPartnerMessageLogSchema
  );

// Export the DbWhatsAppBusinessPartnerMessageLogDto and the WhatsAppBusinessPartnerMessageLogModel for use in other files
export {
  WhatsAppBusinessPartnerMessageLogModel,
  DbWhatsAppBusinessPartnerMessageLogDto,
};
