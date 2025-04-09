/**
 * EmailTemplateCreateDtoApi
 *
 * Structure for Create Email Template API action.
 */
export interface EmailTemplateCreateDtoApi {
  templateName: string;
  subject: string;
  title: string;
  bodyHtml: string;
  bodyText: string;
  placeholders: string[];
  description: string;
}

/**
 * EmailTemplateCreateDto
 *
 * Structure for Create Email Template in local database.
 */
export interface EmailTemplateCreateDto {
  templateName: string;
  subject: string;
  title: string;
  bodyHtml: string;
  bodyText: string;
  placeholders: string[];
  description: string;
  createdByUserId: string;
}

/**
 * EmailTemplateUpdateDtoApi
 *
 * Structure for Update Email Template API action.
 */
export interface EmailTemplateUpdateDtoApi {
  templateName: string;
  status: string;
  subject: string;
  title: string;
  bodyHtml: string;
  bodyText: string;
  placeholders: string[];
  description: string;
}

/**
 * EmailTemplateUpdateDto
 *
 * Structure for Update Email Template in local database.
 */
export interface EmailTemplateUpdateDto {
  templateName: string;
  status: string;
  subject: string;
  title: string;
  bodyHtml: string;
  bodyText: string;
  placeholders: string[];
  description: string;
  updatedByUserId: string;
}
