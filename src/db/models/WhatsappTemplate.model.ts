// import dynamoose
import * as dynamoose from "dynamoose";

//import constants
import { DB_CONSTANTS } from "../DB.constants";

// import models
import { BaseDbDto } from "./Base.model";

// import enums
import {
  WhatsappTemplateCreateLanguageCloudApiEnum,
  WhatsappTemplateCreateCategoryCloudApiEnum,
  WhatsappTemplateStatusEnum,
  WhatsappTemplateCreateStatusCloudApiEnum,
} from "../../enums/WhatsappTemplate.enum";

// import dtos
import { WhatsappTemplateCreateComponentCloudApiDto } from "../../dtos/WhatsappTemplate.dto";
import { WhatsappPlaceholderParamDto } from "../../dtos/WhatsappTemplatePlaceholder.dto";

class DbWhatsappTemplateDto extends BaseDbDto {
  id!: string;
  GSI1PK!: string;
  GSI1SK!: string;
  whatsappTemplateName!: string;
  status!: WhatsappTemplateStatusEnum;
  whatsappLanguage!: WhatsappTemplateCreateLanguageCloudApiEnum;
  whatsappCategory!: WhatsappTemplateCreateCategoryCloudApiEnum;
  whatsappComponents!: WhatsappTemplateCreateComponentCloudApiDto[];
  templatePlaceholders!: WhatsappPlaceholderParamDto;
  createdByUserId!: string;
  updatedByUserId?: string;
  whatsappTemplateId!: string;
  whatsappTemplateStatus!: WhatsappTemplateCreateStatusCloudApiEnum;
  /*
  description?: string; // Describe why the template has been created
  */
}

const WhatsappTemplateSchema = new dynamoose.Schema(
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
    whatsappTemplateName: {
      type: String,
      required: true,
    },
    whatsappLanguage: {
      type: String,
      required: true,
    },
    whatsappCategory: {
      type: String,
      required: true,
    },
    whatsappComponents: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    whatsappTemplateId: {
      type: String,
      required: true,
    },
    whatsappTemplateStatus: {
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
    templatePlaceholders: {
      type: Object,
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

const WhatsappTemplateModel = dynamoose.model<DbWhatsappTemplateDto>(
  "WhatsappTemplate",
  WhatsappTemplateSchema
);

export { WhatsappTemplateModel, DbWhatsappTemplateDto };
