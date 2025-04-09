// Import Enums related to WhatsApp templates
import {
  WhatsappTemplateCreateLanguageCloudApiEnum,
  WhatsappTemplateCreateCategoryCloudApiEnum,
  WhatsappTemplateCreateComponentTypeCloudApiEnum,
  WhatsappTemplateCreateComponentFormatCloudApiEnum,
  WhatsappTemplateCreateButtonTypeCloudApiEnum,
  WhatsappTemplateStatusEnum,
  WhatsappTemplateRejectedReasonCloudApiEnum,
  WhatsappTemplateCreateStatusCloudApiEnum,
} from "../enums/WhatsappTemplate.enum";
import { WhatsappPlaceholderParamDto } from "./WhatsappTemplatePlaceholder.dto";

/**
 * Represents the request DTO for creating a WhatsApp template via the API.
 * This interface defines the structure of the data required to create a new template.
 */
export interface WhatsappTemplateRequestDtoApi {
  /**
   * Name of the WhatsApp template.
   */
  whatsappTemplateName: string;

  /**
   * Placeholder data as key-value pairs.
   * This should adhere to the structure defined in `WhatsappPlaceholderParamDto`.
   */
  templatePlaceholders: WhatsappPlaceholderParamDto;
}

/**
 * Extends the WhatsappTemplateRequestDtoApi to include user information for internal tracking.
 * This interface is used when creating a template in the application's database.
 */
export interface WhatsappTemplateCreateDto {
  /**
   * Name of the WhatsApp template.
   */
  whatsappTemplateName: string;

  /**
   * Placeholder data as key-value pairs.
   * This should adhere to the structure defined in `WhatsappPlaceholderParamDto`.
   */
  templatePlaceholders: WhatsappPlaceholderParamDto;

  /**
   * Status of the template, default is `ENABLED`.
   * This should be one of the values from `WhatsappTemplateStatusEnum`.
   */
  status: WhatsappTemplateStatusEnum;

  /**
   * ID of the user who created the template.
   */
  createdByUserId: string;
}

/**
 * Extends WhatsappTemplateCreateDto to include additional fields returned by the API.
 * This interface is used to represent the complete response when creating a template.
 */
export interface WhatsappTemplateCreateResponseDtoApi {
  /**
   * Name of the WhatsApp template.
   */
  whatsappTemplateName: string;

  /**
   * Language of the WhatsApp template.
   * This should be one of the values from `WhatsappTemplateCreateLanguageCloudApiEnum`.
   */
  whatsappLanguage: WhatsappTemplateCreateLanguageCloudApiEnum;

  /**
   * Category of the WhatsApp template.
   * This should be one of the values from `WhatsappTemplateCreateCategoryCloudApiEnum`.
   */
  whatsappCategory: WhatsappTemplateCreateCategoryCloudApiEnum;

  /**
   * Placeholder data as key-value pairs.
   * This should adhere to the structure defined in `WhatsappPlaceholderParamDto`.
   */
  templatePlaceholders: WhatsappPlaceholderParamDto;

  /**
   * Optional components for the template.
   * This should adhere to the structure defined in `WhatsappTemplateCreateComponentCloudApiDto[]`.
   */
  whatsappComponents?: WhatsappTemplateCreateComponentCloudApiDto[];

  /**
   * Status of the template.
   * This should be one of the values from `WhatsappTemplateStatusEnum`.
   */
  status: WhatsappTemplateStatusEnum;

  /**
   * ID of the user who created the template.
   */
  createdByUserId: string;

  /**
   * Unique ID of the WhatsApp template.
   */
  whatsappTemplateId: string;

  /**
   * API status of the WhatsApp template.
   * This should be one of the values from `WhatsappTemplateCreateStatusCloudApiEnum`.
   */
  whatsappTemplateStatus: WhatsappTemplateCreateStatusCloudApiEnum;
}

/**
 * Represents the response received when creating a WhatsAppCloudApi template.
 * This interface contains the essential information returned by the WhatsAppCloudApi API.
 */
export interface WhatsappTemplateCreateResponseDto {
  /**
   * ID of the created WhatsAppCloudApi template.
   */
  id: string;

  /**
   * Status of the template.
   * This should be one of the values from `WhatsappTemplateCreateStatusCloudApiEnum`.
   */
  status: WhatsappTemplateCreateStatusCloudApiEnum;

  /**
   * Category of the template.
   * This should be one of the values from `WhatsappTemplateCreateCategoryCloudApiEnum`.
   */
  category: WhatsappTemplateCreateCategoryCloudApiEnum;
}

/**
 * Defines the structure of a WhatsApp template component.
 * Components are the building blocks of a template, such as header, body, and buttons.
 */
export interface WhatsappTemplateCreateComponentCloudApiDto {
  /**
   * Type of the component (e.g., header, body).
   * This should be one of the values from `WhatsappTemplateCreateComponentTypeCloudApiEnum`.
   */
  type: WhatsappTemplateCreateComponentTypeCloudApiEnum;

  /**
   * Optional format for the component.
   * This should be one of the values from `WhatsappTemplateCreateComponentFormatCloudApiEnum`.
   */
  format?: WhatsappTemplateCreateComponentFormatCloudApiEnum;

  /**
   * Optional text for the component.
   */
  text?: string;

  /**
   * Optional buttons for the component.
   * This should adhere to the structure defined in `WhatsappTemplateButtonCloudApiDto[]`.
   */
  buttons?: WhatsappTemplateButtonCloudApiDto[];

  /**
   * Optional example for the component.
   * This should adhere to the structure defined in `WhatsappTemplateExampleCloudApiDto`.
   */
  example?: WhatsappTemplateExampleCloudApiDto;
}

/**
 * Represents a button in a WhatsAppCloudApi template.
 * Buttons can be of different types and contain various properties based on their type.
 */
export interface WhatsappTemplateButtonCloudApiDto {
  /**
   * Type of the button (e.g., URL, phone number).
   * This should be one of the values from `WhatsappTemplateCreateButtonTypeCloudApiEnum`.
   */
  type: WhatsappTemplateCreateButtonTypeCloudApiEnum;

  /**
   * Text displayed on the button.
   */
  text: string;

  /**
   * Optional phone number for call buttons.
   */
  phone_number?: string;

  /**
   * Optional URL for URL buttons.
   */
  url?: string;

  /**
   * Optional example values for the button.
   */
  example?: string[];
}

/**
 * Defines the structure for providing examples in a template component.
 * Examples are used to demonstrate how variables in the template will be populated.
 */
export interface WhatsappTemplateExampleCloudApiDto {
  /**
   * Optional example header text.
   */
  header_text?: string[];

  /**
   * Optional example body text.
   */
  body_text?: string[][];

  /**
   * Optional example handles for headers.
   */
  header_handle?: string[];
}

/**
 * Defines the structure for updating a WhatsAppCloudApi template via the API.
 * Only certain fields of a template can be updated after creation.
 */
export interface WhatsappTemplateUpdateDtoApi {
  /**
   * Optional category update for the template.
   * This should be one of the values from `WhatsappTemplateCreateCategoryCloudApiEnum`.
   */
  category?: WhatsappTemplateCreateCategoryCloudApiEnum;

  /**
   * Optional components update for the template.
   * This should adhere to the structure defined in `WhatsappTemplateCreateComponentCloudApiDto[]`.
   */
  components?: WhatsappTemplateCreateComponentCloudApiDto[];

  /**
   * Optional reason for rejection.
   * This should be one of the values from `WhatsappTemplateRejectedReasonCloudApiEnum`.
   */
  rejected_reason?: WhatsappTemplateRejectedReasonCloudApiEnum;

  /**
   * Optional quality score of the template.
   */
  quality_score?: any;

  /**
   * Optional time-to-live for message sending.
   */
  message_send_ttl_seconds?: number;
}

/**
 * Extends WhatsappCloudApiTemplateUpdateDtoApi to include user information for internal tracking.
 * This interface is used when updating a template in the application's database.
 */
export interface WhatsappTemplateUpdateDto
  extends WhatsappTemplateUpdateDtoApi {
  /**
   * ID of the user who updated the template.
   */
  updatedByUserId?: string;

  /**
   * Optional status update for the template.
   * This should be one of the values from `WhatsappTemplateStatusEnum`.
   */
  status?: WhatsappTemplateStatusEnum;
}

/**
 * Represents the response structure when retrieving multiple WhatsAppCloudApi templates.
 * Includes pagination information for handling large sets of templates.
 */
export interface WhatsappTemplateGetResponseCloudApiDto {
  /**
   * Array of WhatsAppCloudApi template data.
   * Each item should adhere to the structure defined in `WhatsappTemplateDataCloudApiDto[]`.
   */
  data: WhatsappTemplateDataCloudApiDto[];

  /**
   * Optional pagination information.
   */
  paging?: {
    /**
     * Cursor for pagination before the current page.
     */
    cursors: {
      before: string;

      /**
       * Cursor for pagination after the current page.
       */
      after: string;
    };

    /**
     * Optional URL for the next page of results.
     */
    next?: string;
  };
}

/**
 * Defines the structure of a single WhatsAppCloudApi template when retrieved from the API.
 * Includes all relevant information about the template, including its status and quality score.
 */
export interface WhatsappTemplateDataCloudApiDto {
  /**
   * ID of the WhatsAppCloudApi template.
   */
  id: string;

  /**
   * Category of the WhatsAppCloudApi template.
   * This should be one of the values from `WhatsappTemplateCreateCategoryCloudApiEnum`.
   */
  category: WhatsappTemplateCreateCategoryCloudApiEnum;

  /**
   * Components of the WhatsAppCloudApi template.
   * This should adhere to the structure defined in `WhatsappTemplateCreateComponentCloudApiDto[]`.
   */
  components: WhatsappTemplateCreateComponentCloudApiDto[];

  /**
   * Language of the WhatsAppCloudApi template.
   * This should be one of the values from `WhatsappTemplateCreateLanguageCloudApiEnum`.
   */
  language: WhatsappTemplateCreateLanguageCloudApiEnum;

  /**
   * Name of the WhatsAppCloudApi template.
   */
  name: string;

  /**
   * API status of the WhatsAppCloudApi template.
   * This should be one of the values from `WhatsappTemplateCreateStatusCloudApiEnum`.
   */
  status: WhatsappTemplateCreateStatusCloudApiEnum;

  /**
   * Optional reason for rejection.
   * This should be one of the values from `WhatsappTemplateRejectedReasonCloudApiEnum`.
   */
  rejected_reason?: WhatsappTemplateRejectedReasonCloudApiEnum;

  /**
   * Optional quality score of the template.
   */
  quality_score?: any;
}

/**
 * Represents the quality score of a WhatsAppCloudApi template.
 * The exact structure should be defined based on the WhatsAppCloudApi API documentation.
 */
export interface WhatsappTemplateQualityScoreCloudApiDto {
  // Define quality score details based on API documentation.
}

/**
 * Defines the structure for a request to delete a WhatsApp template.
 * Templates can be deleted by name or by their HSM ID.
 */
export interface WhatsappTemplateDeleteRequestCloudApiDto {
  /**
   * Name of the WhatsApp template to delete.
   */
  name: string;

  /**
   * Optional HSM ID of the template.
   */
  hsm_id?: string;
}

/**
 * Represents the response received when deleting a WhatsApp template.
 * A simple boolean indicating the success of the operation.
 */
export interface WhatsappTemplateDeleteResponseCloudApiDto {
  /**
   * Indicates if the deletion was successful.
   */
  success: boolean;
}
