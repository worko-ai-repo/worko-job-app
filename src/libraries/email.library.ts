// Import Configurations
import { awsSesClientLibrary } from "../configs/aws-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";


// Import DTOs
import { EmailLogCreateDto } from "../dtos/EmailLog.dto";

// Import Enums
import { EmailLogStatusEnum } from "../enums/EmailLog.enum";
import { EmailTemplateStatusEnum } from "../enums/EmailTemplate.enum";

// Import services
import emailLogService from "../services/EmailLog.service";
import emailTemplateService from "../services/EmailTemplate.service";

/**
 * EmailSourceDestinationAddress
 * 
 * Representation of the email source and destination email addresses.
 */
interface EmailSourceDestinationAddress {
  email: string;
  fullName?: string;
}

/**
 * EmailLibrary
 *
 * It is Email library responsible for parsing the email content and sending emails to user.
 * 
 * Mostly it takes care of everything required to send email to the user.
 */
class EmailLibrary {
  /**
   * constructor
   */
  constructor() {
    // Write something if required
  }

  /**
   * sendEmail
   *
   * Send email to the user based on provided details
   */
  async sendEmail(
    templateName: string,
    toAddress: EmailSourceDestinationAddress,
    placeholders: { [key: string]: any },
    replyToAddresses?: EmailSourceDestinationAddress[],
    ccAddresses?: EmailSourceDestinationAddress[],
    bccAddresses?: EmailSourceDestinationAddress[],
    fromAddress?: EmailSourceDestinationAddress,
  ): Promise<{ 
    awsMessageId: string | null, 
    systemLogId: string | null 
  }> {
    // Convert fullName to title case for all address fields before usage
    if (toAddress.fullName) {
      toAddress.fullName = toAddress.fullName.toTitleCase();
    }

    if (fromAddress?.fullName) {
      fromAddress.fullName = fromAddress.fullName.toTitleCase();
    }

    replyToAddresses?.forEach((replyToItem: EmailSourceDestinationAddress) => {
      if (replyToItem.fullName) {
        replyToItem.fullName = replyToItem.fullName.toTitleCase();
      }
    });

    ccAddresses?.forEach((ccItem: EmailSourceDestinationAddress) => {
      if (ccItem.fullName) {
        ccItem.fullName = ccItem.fullName.toTitleCase();
      }
    });

    bccAddresses?.forEach((bccItem: EmailSourceDestinationAddress) => {
      if (bccItem.fullName) {
        bccItem.fullName = bccItem.fullName.toTitleCase();
      }
    });

    // Get the email template details from the local DB to send the email
    let templateDetails =
      await emailTemplateService.getEmailTemplateByTemplateName(templateName);

    // If email entry is not found then email cannot be sent, so add necessary logging, and return appropriate response
    if (!templateDetails) {
      // Logger message
      global.logger.warn(
        `Unable to send the "${templateName}" because unable to find the email template in local db."`,
        {
          filePath: __filename,
          methodName: this.sendEmail.name,
        }
      );

      return {
        awsMessageId: null,
        systemLogId: null,
      };
    }

    // Check if the status is not ENABLED then email cannot be sent, so add necessary logging, and return appropriate response
    if (templateDetails.status !== EmailTemplateStatusEnum.ENABLED) {
      // Logger message
      global.logger.warn(
        `Unable to send the "${templateName}" because email template is disabled or soft deleted in local db."`,
        {
          filePath: __filename,
          methodName: this.sendEmail.name,
          templateStatus: templateDetails.status,
        }
      );

      return {
        awsMessageId: null,
        systemLogId: null,
      };
    }

    // Prepare from address
    fromAddress = fromAddress ?? {
      email: APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.email,
      fullName: APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.fullName.toTitleCase(),
    };

    let fromAddressStr: string = fromAddress.fullName
      ? `${fromAddress.fullName} <${fromAddress.email}>`
      : fromAddress.email;

    // Prepare to addresses
    let toAddressStr: string = toAddress.fullName
      ? `${toAddress.fullName} <${toAddress.email}>`
      : toAddress.email;

    // Prepare replyTo addresses
    let replyToAddressesStr: string[] | undefined = replyToAddresses?.map(
      (replyToItem) =>
        replyToItem.fullName
          ? `${replyToItem.fullName} <${replyToItem.email}>`
          : replyToItem.email
    );

    // Prepare CC addresses
    let ccAddressesStr: string[] | undefined = ccAddresses?.map((ccItem) =>
      ccItem.fullName ? `${ccItem.fullName} <${ccItem.email}>` : ccItem.email
    );

    // Prepare BCC addresses
    let bccAddressesStr: string[] | undefined = bccAddresses?.map((bccItem) =>
      bccItem.fullName
        ? `${bccItem.fullName} <${bccItem.email}>`
        : bccItem.email
    );

    // Prepare request body as required by the AWS SES "sendTemplatedEmail" method
    let sendTemplatedEmailAwsSesRequest: AWS.SES.Types.SendTemplatedEmailRequest =
      {
        Source: fromAddressStr,
        Destination: {
          ToAddresses: [toAddressStr],
          CcAddresses: ccAddressesStr,
          BccAddresses: bccAddressesStr,
        },
        ReplyToAddresses: replyToAddressesStr,
        Template: templateName,
        TemplateData: JSON.stringify(placeholders),
      };

    // Send email using AWS SES based on provided details
    let sendTemplatedEmailAwsSesResponse =
      await awsSesClientLibrary.sendTemplatedEmail(
        sendTemplatedEmailAwsSesRequest
      );

    // Check if "sendTemplatedEmailAwsSesResponse.MessageId" is not present, then possibly the email was not sent
    // @todo Here consider adding more information regarding error.
    if (!sendTemplatedEmailAwsSesResponse.MessageId) {
      // Logger message
      global.logger.info(
        `Sending email "${templateName}" to user "${toAddressStr[0]}" failed.`,
        {
          filePath: __filename,
          methodName: this.sendEmail.name,
          sendTemplatedEmailAwsSesResponse: sendTemplatedEmailAwsSesResponse,
        }
      );

      return {
        awsMessageId: null,
        systemLogId: null,
      };
    }

    /**
     * As the email has been ent, so create email log in the local database for future reference
     * 
     * When storing the email log in the database, convert the fullName to lowercase using typescript's toLowerCase() function.
     */
    let emailLogCreateRequest: EmailLogCreateDto = {
      templateName: templateName,
      awsMessageId: sendTemplatedEmailAwsSesResponse.MessageId,
      createdByUserId: "1", // @todo fix this with correct user id extracting from the token. It will require a bit of change, consider taking this later after the prod release.
      status: EmailLogStatusEnum.SENT, // @todo Review this and make sure the email has been sent before updating the status with "SENT"
      fromEmail: fromAddress.email,
      fromName: fromAddress?.fullName?.toLowerCase(),
      toEmail: toAddress.email,
      toName: toAddress?.fullName?.toLowerCase(),
      replyToEmails: replyToAddresses?.map(
        (item: EmailSourceDestinationAddress) => ({
          ...item,
          fullName: item.fullName?.toLowerCase(),
        })
      ),
      ccEmails: ccAddresses?.map((item: EmailSourceDestinationAddress) => ({
        ...item,
        fullName: item.fullName?.toLowerCase(),
      })),
      bccEmails: bccAddresses?.map((item: EmailSourceDestinationAddress) => ({
        ...item,
        fullName: item.fullName?.toLowerCase(),
      })),
      emailPlaceholders: placeholders, // @todo: need to find solution to store the `name` in lowercase in database because it will be stored as titlecase now

      // @todo fix theses by saving the correct parsed value.
      // It is not possible because the parsing is taken care by AWS SES itself.
      // We should consider removing this entirely. Or look for some other way of sending emails and storing these infos.
      emailSubject: "emailSubject",
      emailTitle: "emailTitle",
      emailBody: "emailBody",
    };
    let emailLogCreateResponse = await emailLogService.createEmailLog(
      emailLogCreateRequest
    );

    // Logger message
    global.logger.info("Sending email using AWS SES (response).", {
      filePath: __filename,
      methodName: this.sendEmail.name,
      sendTemplatedEmailAwsSesResponse: sendTemplatedEmailAwsSesResponse,
      emailLogId: emailLogCreateResponse.id,
    });

    // Return the AWS SES response
    return {
      awsMessageId: sendTemplatedEmailAwsSesResponse.MessageId,
      systemLogId: emailLogCreateResponse.id,
    };
  }
}

const emailLibrary = new EmailLibrary();
export { emailLibrary, EmailSourceDestinationAddress }