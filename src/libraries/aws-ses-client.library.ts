// NPM packages
import {
  SESClient,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  DeleteTemplateCommand,
  GetTemplateCommand,
  SendEmailCommand,
  SendTemplatedEmailCommand,
  SendRawEmailCommand,
  type SESClientConfig,
  type CreateTemplateCommandInput,
  type CreateTemplateCommandOutput,
  type UpdateTemplateCommandInput,
  type UpdateTemplateCommandOutput,
  type DeleteTemplateCommandOutput,
  type GetTemplateCommandOutput,
  type SendEmailCommandInput,
  type SendEmailCommandOutput,
  type SendTemplatedEmailCommandInput,
  type SendTemplatedEmailCommandOutput,
  type SendRawEmailCommandInput,
  type SendRawEmailCommandOutput,
} from "@aws-sdk/client-ses";

/**
 * AwsSesClientLibrary
 *
 * This library is a wrapper library for AWS SES service that has regularly used method.
 * Feel free to enhance this as needed.
 */
class AwsSesClientLibrary {
  /**
   * ses
   *
   * AWS SES object to perform SES related operations.
   */
  private ses: SESClient;

  /**
   * constructor
   *
   * @param {SESClientConfig} config
   */
  constructor(private config: SESClientConfig) {
    this.ses = new SESClient(this.config);

    // Log message
    console.log(`The '${AwsSesClientLibrary.name}' is initialised."`, {
      filePath: __filename,
    });
  }

  /**
   * updateConfig
   *
   * Update the AWS SES configuration
   *
   * @param {AWS.SES.ClientConfiguration} config
   * @returns {void}
   */
  updateConfig(config: SESClientConfig): void {
    this.config = config;
    this.ses = new SESClient(config);
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Email Templates
   * ********************************************************************************************************************************************
   */

  /**
   * createEmailTemplate
   *
   * Create a new email template in AWS SES based on the data provided
   */
  async createEmailTemplate(
    emailTemplate: CreateTemplateCommandInput
  ): Promise<CreateTemplateCommandOutput> {
    // Logger message
    global.logger.info("Creating master email template in AWS SES (data).", {
      filePath: __filename,
      methodName: this.createEmailTemplate.name,
      emailTemplate: emailTemplate,
    });

    // Creae the email template in AWS SES
    return this.ses.send(new CreateTemplateCommand(emailTemplate));
  }

  /**
   * updateEmailTemplate
   *
   * Update existing email template in AWS SES based on the data provided
   *
   * @param {AWS.SES.Types.UpdateTemplateRequest} emailTemplate
   * @returns {Promise<AWS.SES.Types.UpdateTemplateResponse>}
   */
  async updateEmailTemplate(
    emailTemplate: UpdateTemplateCommandInput
  ): Promise<UpdateTemplateCommandOutput> {
    return this.ses.send(new UpdateTemplateCommand(emailTemplate));
  }

  /**
   * deleteEmailTemplateByName
   *
   * Delete the provided email template from AWS SES.
   *
   * Note: The delete should not be allowed usually.
   * It you really want to delete the template then know that once it is deleted it cannot be used or recovered.
   *
   * @param {string} templateName
   * @returns {Promise<AWS.SES.Types.DeleteTemplateResponse>}
   */
  async deleteEmailTemplateByName(
    templateName: string
  ): Promise<DeleteTemplateCommandOutput> {
    // Logger message
    global.logger.warn("Deleting master email template from AWS SES (data).", {
      filePath: __filename,
      methodName: this.deleteEmailTemplateByName.name,
      templateName: templateName,
    });

    // Delete the email template from AWS SES
    return this.ses.send(
      new DeleteTemplateCommand({ TemplateName: templateName })
    );
  }

  /**
   * getEmailTemplateByTemplateName
   *
   * Get existing email template from AWS SES for the provided Template name
   *
   * @param {string} templateName
   * @returns {Promise<AWS.SES.Types.GetTemplateResponse>}
   */
  async getEmailTemplateByTemplateName(
    templateName: string
  ): Promise<GetTemplateCommandOutput> {
    return this.ses.send(
      new GetTemplateCommand({ TemplateName: templateName })
    );
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Sending Emails
   * ********************************************************************************************************************************************
   */

  /**
   * sendEmail
   *
   * Send email using AWS SES with the provided details
   *
   * @param {AWS.SES.Types.SendEmailRequest} emailDetails
   * @returns {Promise<AWS.SES.Types.SendEmailResponse>}
   */
  async sendEmail(
    emailDetails: SendEmailCommandInput
  ): Promise<SendEmailCommandOutput> {
    // Logger message
    global.logger.info("Sending email using AWS SES (data).", {
      filePath: __filename,
      methodName: this.sendEmail.name,
      emailDetails: emailDetails,
    });

    // Send the email and return the response
    return this.ses.send(new SendEmailCommand(emailDetails));
  }

  /**
   * sendTemplatedEmail
   *
   * Send email using AWS SES with the provided details (with template)
   *
   * @param {AWS.SES.Types.SendTemplatedEmailRequest} emailDetails
   * @returns {Promise<AWS.SES.Types.SendTemplatedEmailResponse>}
   */
  async sendTemplatedEmail(
    emailDetails: SendTemplatedEmailCommandInput
  ): Promise<SendTemplatedEmailCommandOutput> {
    // Logger message
    global.logger.info("Sending email using AWS SES (data).", {
      filePath: __filename,
      methodName: this.sendTemplatedEmail.name,
      templateName: emailDetails.Template,
      toEmail: emailDetails.Destination?.ToAddresses,
      fromEmail: emailDetails.Source,
      placeholders: emailDetails.TemplateData,
    });

    // Send the email and return the response
    return this.ses.send(new SendTemplatedEmailCommand(emailDetails));
  }

  /**
   * sendRawEmail
   *
   * Send raw MIME email using AWS SES (attachments supported).
   */
  async sendRawEmail(
    emailDetails: SendRawEmailCommandInput
  ): Promise<SendRawEmailCommandOutput> {
    global.logger.info("Sending raw email using AWS SES (data).", {
      filePath: __filename,
      methodName: this.sendRawEmail.name,
      to: emailDetails.Destinations,
      from: emailDetails.Source,
    });

    return this.ses.send(new SendRawEmailCommand(emailDetails));
  }
}

export { AwsSesClientLibrary };
