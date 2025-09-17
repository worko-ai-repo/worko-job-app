// import axios library for making HTTP requests
import axios, { AxiosResponse } from "axios";

// import constants
import {
  WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS,
  WHATSAPP_BUSINESS_PARTNER_CLOUD_API_ENDPOINTS,
} from "../configs/constants/WhatsAppBusinessPartner.constant";

// import dtos
import {
  WhatsAppBusinessPartnerSendMessageCloudApiDto,
  WhatsAppBusinessPartnerSendMessageCloudApiPayloadDto,
} from "../dtos/WhatsAppBusinessPartner.dto";

// Import utils
import HttpMethodCode from "../utils/http-methods.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * WhatsAppBusinessPartnerCloudApiLibrary
 */
class WhatsAppBusinessPartnerCloudApiLibrary {

  /**
   * Set up the necessary configuration from environment variables.
   */
  private readonly baseUrl = process.env.APP_WHATSAPP_BUSINESS_PARTNER_CLOUD_API_BASE_URL as string
  private readonly apiKey = process.env.APP_WHATSAPP_BUSINESS_PARTNER_CLOUD_API_KEY as string
  private readonly fromPhoneNumberId = process.env.APP_WHATSAPP_BUSINESS_PARTNER_CLOUD_API_FROM_PHONE_NUMBER_ID as string

  /**
   * sendTemplateMessage
   * 
   * Sends a template message using the WhatsAppBusinessPartner Cloud API
   *
   * @param {WhatsAppBusinessPartnerSendMessageCloudApiDto} sendTemplateMessage - The object containing the template message details
   * @returns {Promise<any>} A promise that resolves to the response from the WhatsAppBusinessPartner Cloud API
   */
  async sendTemplateMessage(
    sendTemplateMessage: WhatsAppBusinessPartnerSendMessageCloudApiDto
  ) {
    try {
      global.logger.info(
        "Send Whatsapp Business Partner template message [library]",
        {
          filePath: __filename,
          methodName: this.sendTemplateMessage.name,
          sendTemplateMessage,
          baseUrl: this.baseUrl,
          apiKey: this.apiKey,
          fromPhoneNumberId: this.fromPhoneNumberId
        }
      );

      /**
       * Prepare endpoint for sending WhatsApp template message
       *
       * Sample endpoint: `https://partnersv1.pinbot.ai/v3/496822040188825/messages`
       */
      const endpoint: string = WHATSAPP_BUSINESS_PARTNER_CLOUD_API_ENDPOINTS.SEND_TEMPLATE_MESSAGE_URL.strtr({
        "{baseUrl}": this.baseUrl,
        "{fromPhoneNumberId}": this.fromPhoneNumberId 
      });

      // Prepare Request headers
      const headers = {
        apikey: this.apiKey,
        "Content-Type": "application/json",
      };

      // Request payload
      const payload: WhatsAppBusinessPartnerSendMessageCloudApiPayloadDto = {
        messaging_product:
          WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.MESSAGING_PRODUCT.WHATSAPP,
        recipient_type:
          WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.RECIPIENT_TYPE.INDIVIDUAL,
        to: sendTemplateMessage.toPhoneNumber, // e.g., "9196663081xxx", without `+` sign, with country code as `91`
        type: WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.MESSAGE_TYPE.TEMPLATE,
        template: {
          name: sendTemplateMessage.templateName,
          language: {
            code: WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.TEMPLATE_LANGUAGE_CODE
              .ENGLISH,
          },
          components: [
            {
              type: WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.COMPONENTS_TYPE
                .BODY,  
              parameters: sendTemplateMessage.placeholders.map(
                (param: string) => ({
                  type: WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS.PARAMETERS_TYPE
                    .TEXT,
                  text: param,
                })
              ),
            },
          ],
        },
      };

      // Log the endpoint details
      global.logger.info("Endpoint Details", {
        filePath: __filename,
        methodName: this.sendTemplateMessage.name,
        method: HttpMethodCode.POST,
        endpoint: endpoint,
        headers: headers,
        payload: payload,
      });

      /**
       * Send the request to the WhatsAppBusinessPartner Cloud API
       */
      const response: AxiosResponse<any, any> = await axios.post(
        endpoint, 
        payload,
        { headers }
      );
      global.logger.debug(
        `Axios Response Details After sending whatsapp message`,
        {
          responseStatus: response.status, // 200
          responseStatusText: response.statusText, // OK
        }
      );

      // return the response data
      return response.data;
    } catch (error: any) {
      global.logger.debug("Error sending template message:", {
        error:error
      });
      return error?.response?.data || {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        message: "Internal Server Error",
      };
    }
  }
}

// Create an instance of the WhatsAppBusinessPartnerCloudApiLibrary class
const whatsAppBusinessPartnerCloudApiLibraryObj = new WhatsAppBusinessPartnerCloudApiLibrary();

// Export an instance of the WhatsAppBusinessPartnerCloudApiLibrary class and the WhatsAppBusinessPartnerCloudApiLibrary class
export { whatsAppBusinessPartnerCloudApiLibraryObj, WhatsAppBusinessPartnerCloudApiLibrary };
