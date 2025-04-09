// NPM packages
import AWS from "aws-sdk";

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
  private ses: AWS.SES;

  /**
   * constructor
   *
   * @param {AWS.SES.ClientConfiguration} config
   */
  constructor(private config: AWS.SES.ClientConfiguration) {
    this.ses = new AWS.SES(this.config);

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
  updateConfig(config: AWS.SES.ClientConfiguration): void {
    this.config = config;
    this.ses = new AWS.SES(config);
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
   * 
   * @param {AWS.SES.Types.CreateTemplateRequest} emailTemplate 
   * @returns {Promise<AWS.SES.Types.CreateTemplateResponse>}
   */
  async createEmailTemplate(emailTemplate: AWS.SES.Types.CreateTemplateRequest): Promise<AWS.SES.Types.CreateTemplateResponse> {
    // Logger message
    global.logger.info("Creating master email template in AWS SES (data).", {
      filePath: __filename,
      methodName: this.createEmailTemplate.name,
      emailTemplate: emailTemplate,
    });

    // Creae the email template in AWS SES
    return this.ses.createTemplate(emailTemplate).promise();
  }

  /**
   * updateEmailTemplate
   * 
   * Update existing email template in AWS SES based on the data provided
   * 
   * @param {AWS.SES.Types.UpdateTemplateRequest} emailTemplate 
   * @returns {Promise<AWS.SES.Types.UpdateTemplateResponse>}
   */
  async updateEmailTemplate(emailTemplate: AWS.SES.Types.UpdateTemplateRequest): Promise<AWS.SES.Types.UpdateTemplateResponse> {
    return this.ses.updateTemplate(emailTemplate).promise();
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
  async deleteEmailTemplateByName(templateName: string): Promise<AWS.SES.Types.DeleteTemplateResponse> {
    // Logger message
    global.logger.warn("Deleting master email template from AWS SES (data).", {
      filePath: __filename,
      methodName: this.deleteEmailTemplateByName.name,
      templateName: templateName,
    });

    // Delete the email template from AWS SES
    return this.ses.deleteTemplate({ TemplateName: templateName }).promise();
  }
  
  /**
   * getEmailTemplateByTemplateName
   * 
   * Get existing email template from AWS SES for the provided Template name
   * 
   * @param {string} templateName 
   * @returns {Promise<AWS.SES.Types.GetTemplateResponse>}
   */
  async getEmailTemplateByTemplateName(templateName: string): Promise<AWS.SES.Types.GetTemplateResponse> {
    return this.ses.getTemplate({ TemplateName: templateName }).promise();
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
  async sendEmail(emailDetails: AWS.SES.Types.SendEmailRequest): Promise<AWS.SES.Types.SendEmailResponse> {
    // Logger message
    global.logger.info("Sending email using AWS SES (data).", {
      filePath: __filename,
      methodName: this.sendEmail.name,
      emailDetails: emailDetails,
    });

    // Send the email and return the response
    return this.ses.sendEmail(emailDetails).promise();
  }
  
  /**
   * sendTemplatedEmail
   * 
   * Send email using AWS SES with the provided details (with template)
   * 
   * @param {AWS.SES.Types.SendTemplatedEmailRequest} emailDetails 
   * @returns {Promise<AWS.SES.Types.SendTemplatedEmailResponse>}
   */
  async sendTemplatedEmail(emailDetails: AWS.SES.Types.SendTemplatedEmailRequest): Promise<AWS.SES.Types.SendTemplatedEmailResponse> {
    // Logger message
    global.logger.info("Sending email using AWS SES (data).", {
      filePath: __filename,
      methodName: this.sendTemplatedEmail.name,
      templateName: emailDetails.Template,
      toEmail: emailDetails.Destination.ToAddresses,
      fromEmail: emailDetails.Source,
      placeholders: emailDetails.TemplateData,
    });

    // Send the email and return the response
    return this.ses.sendTemplatedEmail(emailDetails).promise();
  }
}

export { AwsSesClientLibrary }