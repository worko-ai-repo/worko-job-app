/**
 * WhatsAppBusinessPartnerSendMessageCloudApiDto
 *
 * This interface defines the structure for sending a WhatsApp message using the WhatsAppBusinessPartner cloud API.
 */
export interface WhatsAppBusinessPartnerSendMessageCloudApiDto {
  templateName: string;
  templateLang: string;
  toPhoneNumber: string;
  placeholders: string[];
}

/**
 * WhatsAppBusinessPartnerSendMessageCloudApiPayloadDto
 *
 * Note: This interface should not be change because the properties are being used in the cloud api
 * which was provided by the WhatsApp Business Partner, If you want to change this interface, you need to contact the WhatsApp Business Partner
 * and the team leader of this project
 */
export interface WhatsAppBusinessPartnerSendMessageCloudApiPayloadDto {
  messaging_product: string; // e.g., "whatsapp"
  recipient_type: string; // e.g., "individual"
  to: string; // Phone number of the recipient (e.g., "91xxxxxxxxxx")
  type: string; // e.g., "template"
  template: {
    name: string; // Template name, refer: `WhatsAppBusinessPartnerTemplate.enum.ts`
    language: {
      code: string; // Language code, e.g., "en"
    };
    components: Array<{
      type: string; // Component type, e.g., "body" or "header"
      parameters: Array<{
        type: string; // Parameter type, e.g., "text"
        text: string; // The text value for the placeholder
      }>;
    }>;
  };
}
