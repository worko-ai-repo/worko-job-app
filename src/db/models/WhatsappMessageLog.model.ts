// import dynamoose
import * as dynamoose from "dynamoose";

//import constants
import { DB_CONSTANTS } from "../DB.constants";

// import models
import { BaseDbDto } from "./Base.model";

// import enums
import { WhatsappMessageStatusEnum } from "../../enums/WhatsappMessageLog.enum";
import { UserContextTypeEnum } from "../../enums/User.enum";

// import dtos
import { WhatsappWebhookLogRecievedCreateDto } from "../../dtos/WhatsappMessageLog.dto";
import { WhatsappPlaceholderParamDto } from "../../dtos/WhatsappTemplatePlaceholder.dto";

class DbWhatsappMessageLogDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  userId!: string;
  templateName!: string;
  whatsappMessageId!: string;

  /**
   * This Status attr store the worko message status.
   * @todo WE ARE NOT STORING THE STATUS FROM WHATSAPP CLOUD API, consider to store it.
   */
  status!: WhatsappMessageStatusEnum; // todo : Store here another status that is coming from whatsapp cloud api after sending messages and also check for webhook status
  fromPhoneNumber!: string;
  toPhoneNumber!: string;
  templatePlaceholders!: WhatsappPlaceholderParamDto;
  contextType?: UserContextTypeEnum;
  contextId?: string;
  // contextDetails!:object;
  createdByUserId!: string;
  updatedByUserId?: string;
  whatsappWebhookLogRecievedResponse?: WhatsappWebhookLogRecievedCreateDto[];
}

const WhatsappMessageLogSchema = new dynamoose.Schema(
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
    userId: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    whatsappMessageId: {
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
    whatsappWebhookLogRecievedResponse: {
      type: Array,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    fromPhoneNumber: {
      type: String,
      required: true,
    },
    toPhoneNumber: {
      type: String,
      required: true,
    },
    templatePlaceholders: {
      type: Object,
      required: true,
    },
    contextType: {
      type: String,
      required: false,
    },
    contextId: {
      type: String,
      required: false,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const WhatsappMessageLogModel = dynamoose.model<DbWhatsappMessageLogDto>(
  "WhatsappMessageLog",
  WhatsappMessageLogSchema
);

export { WhatsappMessageLogModel, DbWhatsappMessageLogDto };
