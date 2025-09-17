// Import enums
import { EmailLogStatusEnum } from "../enums/EmailLog.enum";

// Import libraries
import { EmailSourceDestinationAddress } from "../libraries/email.library";

/**
 * EmailLogCreateDto
 *
 * Structure for Create Email Log in local database.
 */
export interface EmailLogCreateDto {
  templateName: string;
  awsMessageId: string;
  createdByUserId: string;
  awsResponse?: Object;
  status: EmailLogStatusEnum;
  fromEmail: string;
  fromName?: string;
  toEmail: string;
  toName?: string;
  replyToEmails?: EmailSourceDestinationAddress[];
  ccEmails?: EmailSourceDestinationAddress[];
  bccEmails?: EmailSourceDestinationAddress[];
  emailPlaceholders: {
    [key: string]: string;
  };
  emailSubject: string;
  emailTitle: string;
  emailBody: string;
}
