// import dtos
import { WhatsAppBusinessPartnerPlaceholderParamDto } from "./WhatsAppBusinessPartnerTemplatePlaceholder.dto";

// import enums
import { UserContextTypeEnum } from "../enums/User.enum";
import { WhatsAppBusinessPartnerTemplateNameEnum } from "../enums/WhatsAppBusinessPartnerTemplate.enum";

/**
 * WhatsAppBusinessPartnerMessageLogCreateApiDto
 *
 * Interface for creating a WhatsApp Business Partner message log entry.
 */
export interface WhatsAppBusinessPartnerMessageLogCreateDto {
  templateName: WhatsAppBusinessPartnerTemplateNameEnum;
  templatePlaceholders: WhatsAppBusinessPartnerPlaceholderParamDto;
  toPhoneNumber: number;
  fromPhoneNumber: number;
  contextId?: string;
  contextType?: UserContextTypeEnum;
  whatsAppBusinessPartnerSendMessageResponse?: object;
  whatsAppBusinessPartnerSendMessageResponseStatus?: string;
  whatsAppBusinessPartnerSendMessageResponseId?: string;
}
