// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import luxon
import { DateTime } from "luxon";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { referAndEarnDaoObj } from "../daos/ReferAndEarn.dao";

// Import dtos
import {
  ReferAndEarnCreateDto,
  ReferAndEarnFilterOptions,
  ReferAndEarnRequestWithdrawalApiDto,
  ReferAndEarnUpdateApiDto,
  ReferAndEarnUpdateDto,
  UpdateReferAndEarnInternalDto,
} from "../dtos/ReferAndEarn.dto";
import {
  EmailTemplatePlaceholderREFERRER_REFER_AND_EARN,
  EmailTemplatePlaceholderRECIPIENT_REFER_AND_EARN,
  EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED,
  EmailTemplatePlaceholderREFERRER_REFER_AND_EARN_PAYMENT_COMPLETED,
} from "../dtos/EmailTemplatePlaceholder.dto";
import {
  WhatsAppBusinessPartnerTemplatePlaceholderREFERRER_REFER_AND_EARN,
  WhatsAppBusinessPartnerTemplatePlaceholderRECIPIENT_REFER_AND_EARN,
} from "../dtos/WhatsAppBusinessPartnerTemplatePlaceholder.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  PaginatedResultsWithMatchingConditionsResponse,
} from "../dtos/Common.dto";

// Import enums
import { WhatsAppBusinessPartnerTemplateNameEnum } from "../enums/WhatsAppBusinessPartnerTemplate.enum";
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";
import { ReferAndEarnJobApplicationStatusEnum, ReferAndEarnStatusEnum } from "../enums/ReferAndEarn.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";
import { getEmailFromPK } from "../helpers/user.helper";
import { formatCurrency } from "../helpers/common.helper";

// Import libraries
import {
  emailLibrary,
  EmailSourceDestinationAddress,
} from "../libraries/email.library";
import { whatsAppBusinessPartnerLibraryObj } from "../libraries/WhatsAppBusinessPartner.library";

// Import models
import { DbReferAndEarnDto } from "../db/models/ReferAndEarn.model";
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";

// Import services
import { userJobApplicationServiceObj } from "./UserJobApplication.service";
import { companyDetailServiceObj } from "./CompanyDetail.service";
import userDetailServiceObj from "./UserDetail.service";
import { companyJobServiceObj } from "./CompanyJob.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 *  ReferAndEarnService class responsible for managing refer and earn related operations.
 */
class ReferAndEarnService {
  /**
   * createReferAndEarn
   * 
   * Creates a new refer and earn record in the database.
   *
   * @param {string} referrerEmail - The email of the referrer.
   * @param {ReferAndEarnCreateDto} referAndEarnData - The refer and earn data to be created.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the newly created refer and earn data.
   */
  async createReferAndEarn(
    referrerEmail: string,
    referAndEarnData: ReferAndEarnCreateDto
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Create Refer and earn [Service]", {
      filePath: __filename,
      methodName: this.createReferAndEarn.name,
      referrerEmail: referrerEmail,
    })

    return referAndEarnDaoObj.createReferAndEarn(
      referrerEmail,
      referAndEarnData
    );
  }

  /**
   * performReferAndEarnCreateActivities
   * 
   * This function is responsible for handling all the activities after creating a refer and earn entry.
   * It will throw error if the recipient email is already referred by another user for this job or
   * if the recipient email is already applied for this job.
   * If the recipient email is already a registered email then it will check whether the recipient email
   * has already applied for this job or not. If the recipient email has already applied for this job then
   * it will throw error.
   * It will send email to recipient and referrer.
   * It will also send whatsapp message to recipient and referrer.
   *
   * @param {string} referrerEmail - The email of the referrer.
   * @param {ReferAndEarnCreateDto} referAndEarnData - The refer and earn data to be created.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the newly created refer and earn data.
   */
  async performReferAndEarnCreateActivities(
    referrerEmail: string,
    referAndEarnData: ReferAndEarnCreateDto
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Perform Create Refer and earn [Service]", {
      filePath: __filename,
      methodName: this.performReferAndEarnCreateActivities.name,
    });

    // Retrieve company details
    const companyQueryResponseDetails: QueryResponse<DbCompanyDetailDto> =
      await companyDetailServiceObj.getCompanyDetailById(
        referAndEarnData.companyDetails.id
      );
    if (!companyQueryResponseDetails.count) {
      throw new BaseError(
        "The Company details not found.",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Parsed company details
    const companyDetails: DbCompanyDetailDto = companyQueryResponseDetails[0];

    // Retrieve company job query response and throw error if not found
    const companyJobQueryResponseDetails: QueryResponse<DbCompanyJobDto> =
      await companyJobServiceObj.getJobById(referAndEarnData.jobDetails.id);

    // Parsed company job details
    const companyJobDetails: DbCompanyJobDto =
      companyJobQueryResponseDetails[0];

    // Check for existing refer and earn entries to prevent duplicate referrals
    const existingReferAndEarn: QueryResponse<DbReferAndEarnDto> =
      await referAndEarnDaoObj.getReferAndEarnDetailsByPrimaryEmailWithRecipientEmailAndJobId(
        referrerEmail, // referrer email(primary email)
        referAndEarnData.recipientDetails.email, // recipient email
        referAndEarnData.jobDetails.id // job id
      );
    if (existingReferAndEarn.count) {
      throw new BaseError(
        "You have already referred this person for this job.",
        HttpStatusCode.CONFLICT_409
      );
    }

    /**
     * Check whether this `CompanyJob` for same `email` was already referred by someone or not
     * and throw error if already referred by someone.
     */
    const referAndEarnQueryResponseDetails: QueryResponse<DbReferAndEarnDto> =
      await referAndEarnDaoObj.getReferAndEarnDetailsByCompanyIdWithRecipientEmailAndJobId(
        referAndEarnData.companyDetails.id, // company id
        referAndEarnData.recipientDetails.email, // recipient email
        referAndEarnData.jobDetails.id // job id
      );

    // if this `CompanyJob` with same `email` is already referred by someone then throw error
    if (referAndEarnQueryResponseDetails.count) {
      throw new BaseError(
        "This person has already been referred for this job by someone else, so you cannot refer him again.",
        HttpStatusCode.CONFLICT_409
      );
    }

    // Retrieve user details by recipient email
    const recipientRegisteredUserDetails: QueryResponse<DbUserDetailDto> =
      await userDetailServiceObj.get(referAndEarnData.recipientDetails.email);

    // Check whether recipient email is already registered email or not
    if (recipientRegisteredUserDetails.count) {
      // Check whether the recipient email applied for this `CompanyJob` or not
      const recipientUserJobApplicationDetails: QueryResponse<DbUserJobApplicationDto> =
        await userJobApplicationServiceObj.getUserJobApplicationByEmailIdAndJobId(
          referAndEarnData.recipientDetails.email,
          referAndEarnData.jobDetails.id
        );

      // if the recipient email applied for that `CompanyJob`
      if (recipientUserJobApplicationDetails.count) {
        throw new BaseError(
          "This person has already applied for this job, so you cannot refer him again.",
          HttpStatusCode.CONFLICT_409
        );
      }

      referAndEarnData.recipientDetails.id =
        recipientRegisteredUserDetails[0].id;
    }

    const referAndEarnDetails: DbReferAndEarnDto =
      await this.createReferAndEarn(
        referrerEmail,
        referAndEarnData
      );

    // Prepare job url with refer and earn id
    const jobUrl: URL = new URL(companyJobDetails.jobUrl);
    jobUrl.searchParams.set("referAndEarnId", referAndEarnDetails.id);
    const updatedJobUrlWithReferAndEarnId: string = jobUrl.toString();

    // =========================================================
    // ==== Prepare data and Send email to recipient ================
    // =========================================================
    const toRecipientAddress: EmailSourceDestinationAddress = {
      email: referAndEarnData.recipientDetails.email,
      fullName: referAndEarnData.recipientDetails.name,
    };

    const emailRecipientPlaceholders: EmailTemplatePlaceholderRECIPIENT_REFER_AND_EARN =
      {
        referrerName: referAndEarnData.referrerDetails.name.toTitleCase(),
        recipientName: referAndEarnData.recipientDetails.name.toTitleCase(),
        companyName: companyDetails.name.toTitleCase(),
        jobTitle: companyJobDetails.jobTitle.toTitleCase(),
        jobUrl: updatedJobUrlWithReferAndEarnId,
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    const recipientEmailResponse: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await emailLibrary.sendEmail(
      EmailTemplateEnum.RECIPIENT_REFER_AND_EARN,
      toRecipientAddress,
      emailRecipientPlaceholders
    );

    if (!recipientEmailResponse.awsMessageId) {
      global.logger.error("Failed to send email to recipient", {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
        email: referAndEarnData.recipientDetails.name,
      });
    }

    // =========================================================
    // ======= Prepare data and Send email to referrer ================
    // =========================================================
    const toReferrerAddress: EmailSourceDestinationAddress = {
      email: referrerEmail,
      fullName: referAndEarnData.referrerDetails.name,
    };

    const emailToReferrerPlaceholders: EmailTemplatePlaceholderREFERRER_REFER_AND_EARN =
      {
        referrerName: referAndEarnData.referrerDetails.name.toTitleCase(),
        recipientName: referAndEarnData.recipientDetails.name.toTitleCase(),
        jobTitle: companyJobDetails.jobTitle.toTitleCase(),
        companyName: companyDetails.name.toTitleCase(),
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
        dashboardUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_APP_URL,
      };

    const emailToReferrerSendResponse: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await emailLibrary.sendEmail(
      EmailTemplateEnum.REFERRER_REFER_AND_EARN,
      toReferrerAddress,
      emailToReferrerPlaceholders
    );

    if (!emailToReferrerSendResponse.awsMessageId) {
      global.logger.error("Failed to send email to referrer", {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
        email: referrerEmail,
      });
    }

    // =========================================================
    // ===== Prepare data and Send whatsapp to recipient =============
    // =========================================================
    const whatsAppBusinessPartnerRecipientPlaceholders: WhatsAppBusinessPartnerTemplatePlaceholderRECIPIENT_REFER_AND_EARN =
      {
        recipientName: referAndEarnData.recipientDetails.name.toTitleCase(),
        referrerName: referAndEarnData.referrerDetails.name.toTitleCase(),
        jobTitle: companyJobDetails.jobTitle.toTitleCase(),
        companyName: companyDetails.name.toTitleCase(),
        jobUrl: updatedJobUrlWithReferAndEarnId,
      };

    const sendWhatsAppToRecipientResponse: {
      systemLogId: string | null;
      whatsAppBusinessPartnerSendMessageResponseId: string | null | undefined;
    } =
      await whatsAppBusinessPartnerLibraryObj.sendWhatsAppBusinessPartnerWhatsappMessage(
        WhatsAppBusinessPartnerTemplateNameEnum.RECIPIENT_REFER_AND_EARN,

        `${referAndEarnData.recipientDetails.phoneCountryCode}${referAndEarnData.recipientDetails.phoneNumber}`, // To recipient Phone Number

        whatsAppBusinessPartnerRecipientPlaceholders,

        referAndEarnData.recipientDetails.email
      );

    if (!sendWhatsAppToRecipientResponse.systemLogId) {
      global.logger.error("Failed to send whatsapp message to recipient", {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
        recipientEmail: referAndEarnData.recipientDetails,
      });
    }

    // =========================================================
    // ===== Prepare data and Send whatsapp to referrer===========
    // =========================================================
    const whatsAppBusinessPartnerReferrerPlaceholders: WhatsAppBusinessPartnerTemplatePlaceholderREFERRER_REFER_AND_EARN =
      {
        referrerName: referAndEarnData.referrerDetails.name.toTitleCase(),
        recipientName: referAndEarnData.recipientDetails.name.toTitleCase(),
        jobTitle: companyJobDetails.jobTitle.toTitleCase(),
        companyName: companyDetails.name.toTitleCase(),
      };

    const sendWhatsAppToReferrerResponse: {
      systemLogId: string | null;
      whatsAppBusinessPartnerSendMessageResponseId: string | null | undefined;
    } =
      await whatsAppBusinessPartnerLibraryObj.sendWhatsAppBusinessPartnerWhatsappMessage(
        WhatsAppBusinessPartnerTemplateNameEnum.REFERRER_REFER_AND_EARN,

        `${referAndEarnData.referrerDetails.phoneCountryCode}${referAndEarnData.referrerDetails.phoneNumber}`,

        whatsAppBusinessPartnerReferrerPlaceholders,

        referrerEmail
      );

    if (!sendWhatsAppToReferrerResponse.systemLogId) {
      global.logger.error("Failed to send whatsapp message to referrer", {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
        recipientEmail: referAndEarnData.recipientDetails,
      });
    }

    return referAndEarnDetails;
  }

  /**
   * getReferAndEarnById
   *
   * Retrieves a refer and earn ticket by its unique identifier.
   *
   * This function logs the retrieval attempt and delegates to the data access
   * object to fetch the ticket details from the database. It performs a direct
   * lookup using the provided ID.
   *
   * @param {string} id - The unique identifier of the refer and earn ticket to retrieve.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves to the
   *   query response containing the refer and earn ticket details if found.
   */
  async getReferAndEarnById(
    id: string
  ): Promise<QueryResponse<DbReferAndEarnDto>> {
    global.logger.info("Get Refer and earn by id [Service]", {
      filePath: __filename,
      methodName: this.getReferAndEarnById.name,
    });

    return referAndEarnDaoObj.getReferAndEarnById(id);
  }

  /**
   * getReferAndEarnByReferrerEmailAndId
   *
   * Retrieves a refer and earn ticket by its unique identifier and referrer email.
   *
   * This function logs the retrieval attempt and delegates to the data access
   * object to fetch the ticket details from the database. It performs a direct
   * lookup using the provided ID and referrer email.
   *
   * @param {string} referrerEmail - The email address of the referrer.
   * @param {string} id - The unique identifier of the refer and earn ticket to retrieve.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves to the
   *   query response containing the refer and earn ticket details if found.
   */
  async getReferAndEarnByReferrerEmailAndId(
    referrerEmail: string,
    id: string
  ): Promise<QueryResponse<DbReferAndEarnDto>> {
    // logger
    global.logger.info("Get Refer and earn by referrer email and id [Service]", {
      filePath: __filename,
      methodName: this.getReferAndEarnByReferrerEmailAndId.name,
      referrerEmail: referrerEmail,
      id: id
    });

    return referAndEarnDaoObj.getReferAndEarnByReferrerEmailAndId(
      referrerEmail,
      id
    );
  }

  /**
   * getReferAndEarnByFilterOptions
   *
   * Retrieves refer and earn records based on the provided filter options.
   *
   * This method allows for the querying of referrals using various
   * filter criteria such as status, date range, and search text.
   * The results are sorted according to the specified sort order and
   * paginated using the provided pagination helper.
   *
   * @param {ReferralFilterOptions} referAndEarnRequestBody - The filter options for querying referrals.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsInternalResponse<DbReferAndEarnDto[]>>}
   *          A promise that resolves to the paginated results of referrals matching the filter conditions.
   */
  async getReferAndEarnByFilterOptions(
    referAndEarnRequestBody: ReferAndEarnFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsInternalResponse<DbReferAndEarnDto[]>
  > {
    global.logger.info("Get Refer And Earn By filter options [Service]", {
      filePath: __filename,
      methodName: "getReferAndEarnByFilterOptions",
    });

    // Fetch referrals
    const referAndEarnDetails: PaginatedResultsWithMatchingConditionsResponse<DbReferAndEarnDto> =
      await referAndEarnDaoObj.getReferAndEarnByFilterOptions(
        referAndEarnRequestBody
      );

    // Extract referrals data
    const { lastKey, count, timesQueried, queriedCount, ...referAndEarnData } =
      referAndEarnDetails;

    // Convert to array
    const referAndEarnDataArray: DbReferAndEarnDto[] =
      Object.values(referAndEarnData);

    // If no referrals found, return empty results
    if (!referAndEarnDataArray.length) {
      return {
        data: [],
        lastKey,
        count,
        timesQueried,
        queriedCount,
      };
    }

    // Build paginated response
    return {
      data: referAndEarnDataArray,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };
  }

  /**
   * Updates specific fields of a refer and earn ticket identified by its ID and primary email.
   *
   * This function is the reusable function to update specific fields of a refer and earn model based on its ID and primary email.
   *
   * @param {string} id - The unique identifier of the refer and earn ticket to update.
   * @param {string} primaryEmail - The primary email associated with the referral.
   * @param {Partial<UpdateReferAndEarnInternalDto>} updateDto - Object containing the fields to update
   *   and their new values.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the updated refer and earn
   *   record if the update was successful.
   * @throws {BaseError} Throws a 500 error if the update operation fails.
   */
  async updateReferAndEarnInternalByIdAndEmail(
    id: string,
    primaryEmail: string,
    updateDto: Partial<UpdateReferAndEarnInternalDto>
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Update Refer And Earn [Service]", {
      filePath: __filename,
      methodName: this.updateReferAndEarnInternalByIdAndEmail,
    });

    return referAndEarnDaoObj.updateReferAndEarnInternalByIdAndEmail(
      id,
      primaryEmail,
      updateDto
    );
  }

  async updateReferAndEarnById(
    updateRequestApiBody: ReferAndEarnUpdateApiDto,
    userDetails: DbUserDetailDto,
    existingReferAndEarnData: DbReferAndEarnDto
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Update Refer and Earn [Service]", {
      filePath: __filename,
      methodName: this.updateReferAndEarnById.name,
    });

    // Get current date
    const currentDateAndTime: string = DateTime.now().toISO();

    // Get referrer email
    const referrerEmail: string = getEmailFromPK(existingReferAndEarnData.PK);

    // Prepare update refer and earn dto
    const updateReferAndEarnDto: ReferAndEarnUpdateDto = {
      ...updateRequestApiBody,
      updatedByUserId: userDetails.id,
    };

    // If refer and earn status is withdrawal rejected then update status tracker also
    if (
      updateReferAndEarnDto.status ===
        ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED &&
      existingReferAndEarnData.status !==
        ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED
    ) {
      updateReferAndEarnDto.statusTracker = [
        ...existingReferAndEarnData.statusTracker,
        {
          oldStatus: existingReferAndEarnData.status,
          newStatus: ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED,
          actionDate: currentDateAndTime,
          actionByUserId: userDetails.id,
          description: updateRequestApiBody.withDrawalRequestRejectedReason,
        },
      ];
    } else if (
      updateReferAndEarnDto.status &&
      updateReferAndEarnDto.status !== existingReferAndEarnData.status
    ) {
      updateReferAndEarnDto.statusTracker = [
        ...existingReferAndEarnData.statusTracker,
        {
          oldStatus: existingReferAndEarnData.status,
          newStatus: updateReferAndEarnDto.status,
          actionDate: currentDateAndTime,
          actionByUserId: userDetails.id,
          description: undefined,
        },
      ];
    }

    // updated document
    const updatedReferAndEarnItem: DbReferAndEarnDto =
      await referAndEarnDaoObj.updateReferAndEarnByPkAndSk(
        existingReferAndEarnData.PK,
        existingReferAndEarnData.SK,
        updateReferAndEarnDto
      );

    // If refer and earn item is updated
    if (updatedReferAndEarnItem) {
      if (
        updatedReferAndEarnItem.status ===
          ReferAndEarnStatusEnum.PAYMENT_COMPLETED &&
        updatedReferAndEarnItem.paymentDoneDetails
      ) {
        // =========================================================
        // ===== Prepare data and Send email to referrer ========
        // =========================================================
        const toReferrerAddress: EmailSourceDestinationAddress = {
          email: referrerEmail,
          fullName: existingReferAndEarnData.referrerDetails.name,
        };

        const emailToReferrerPlaceholders: EmailTemplatePlaceholderREFERRER_REFER_AND_EARN_PAYMENT_COMPLETED =
          {
            referrerName:
              existingReferAndEarnData.referrerDetails.name.toTitleCase(),
            amountPaid: formatCurrency(
              updatedReferAndEarnItem.paymentDoneDetails.amountPaid,
              APP_CONSTANTS.CURRENCY_FORMAT_CONFIG.INR.currency,
              APP_CONSTANTS.CURRENCY_FORMAT_CONFIG.INR.locale
            ), // ₹5,000
            recipientName:
              updatedReferAndEarnItem.recipientDetails.name.toTitleCase(),
            jobTitle: updatedReferAndEarnItem.jobDetails.title.toTitleCase(),
            companyName:
              updatedReferAndEarnItem.companyDetails.name.toTitleCase(),
            jobAppliedDate: dateHelperObj.formatDateToDayMonthYear(
              updatedReferAndEarnItem.jobAppliedDate!
            ),
            referrerUniqueTransactionReference:
              updatedReferAndEarnItem.paymentDoneDetails
                .uniqueTransactionReference,
            referrerAccountNumber: `${updatedReferAndEarnItem.referrerBankDetails?.accountNumber}`,
            referrerIfscCode: `${updatedReferAndEarnItem.referrerBankDetails?.ifscCode}`,
            paymentDate: dateHelperObj.formatDateToDayMonthYear(
              updatedReferAndEarnItem.paymentDoneDetails.actionDate
            ),
            dashboardUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_APP_URL,
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          };

        const emailToReferrerSendResponse: {
          awsMessageId: string | null;
          systemLogId: string | null;
        } = await emailLibrary.sendEmail(
          EmailTemplateEnum.REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED,
          toReferrerAddress,
          emailToReferrerPlaceholders
        );

        if (!emailToReferrerSendResponse.awsMessageId) {
          global.logger.error("Failed to send email to referrer", {
            filePath: __filename,
            methodName: this.createReferAndEarn.name,
            email: referrerEmail,
          });
        }
      }
    }

    return updatedReferAndEarnItem;
  }

  /**
   * updateReferAndEarnRequestWithdrawal
   *
   * Updates the refer and earn withdrawal request for a given referral.
   *
   * This function processes a withdrawal request by updating the refer and earn
   * record with the new status and bank details provided by the referrer. It also
   * sends an email notification to the worko admin about the withdrawal request.
   *
   * @param {DbReferAndEarnDto} existingReferAndEarnData - The existing refer and earn data.
   * @param {DbUserDetailDto} referrerDetails - The details of the referrer making the request.
   * @param {ReferAndEarnRequestWithdrawalApiDto} referAndEarnRequestBody - The withdrawal request data provided by the referrer.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the updated refer and earn data.
   * @throws {BaseError} Throws an error if the email notification fails to send.
   */
  async updateReferAndEarnRequestWithdrawal(
    existingReferAndEarnData: DbReferAndEarnDto,
    referrerDetails: DbUserDetailDto,
    referAndEarnRequestBody: ReferAndEarnRequestWithdrawalApiDto
  ): Promise<DbReferAndEarnDto> {
    const referrerEmail: string = getEmailFromPK(existingReferAndEarnData.PK);

    global.logger.info("Update Refer and earn request withdrawal [Service]", {
      filePath: __filename,
      methodName: this.updateReferAndEarnRequestWithdrawal.name,
      referrerEmail,
    });

    // Get current date
    const currentDateAndTime: string = DateTime.now().toISO();

    // ================================================================
    // ==== Prepare data and Send email to worko admin ================
    // ================================================================
    const toWorkoAdminAddress: EmailSourceDestinationAddress = {
      email: APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.email,
      fullName: APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.fullName,
    };

    const emailToWorkoAdminPlaceholders: EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED =
      {
        referrerName: referrerDetails.name.toTitleCase(),
        referrerEmailId: referrerEmail,
        referrerPhoneNumber: referrerDetails.number,
        recipientName:
          existingReferAndEarnData.recipientDetails.name.toTitleCase(),
        jobUrl: existingReferAndEarnData.jobDetails.url,
        jobTitle: existingReferAndEarnData.jobDetails.title.toTitleCase(),
        appliedDate: dateHelperObj.formatDateToDayMonthYear(
          existingReferAndEarnData.jobAppliedDate!
        ),
        referAndEarnJobApplicationStatus:
          existingReferAndEarnData.jobApplicationStatus.toTitleCase(),
        commissionAmount: formatCurrency(
          existingReferAndEarnData.commissionAmount,
          APP_CONSTANTS.CURRENCY_FORMAT_CONFIG.INR.currency,
          APP_CONSTANTS.CURRENCY_FORMAT_CONFIG.INR.locale
        ), // ₹5,000

        // Bank details
        accountHolderName:
          referAndEarnRequestBody.accountHolderName.toTitleCase(),
        accountNumber: referAndEarnRequestBody.accountNumber.toString(),
        ifscCode: referAndEarnRequestBody.ifscCode,
        branchName: referAndEarnRequestBody.branchName,
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    const emailToWorkoAdminSendResponse: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await emailLibrary.sendEmail(
      EmailTemplateEnum.WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED,
      toWorkoAdminAddress,
      emailToWorkoAdminPlaceholders
    );

    if (!emailToWorkoAdminSendResponse.awsMessageId) {
      global.logger.error("Failed to send email to referrer", {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
        toWorkoAdminAddress,
        emailToWorkoAdminPlaceholders,
      });

      throw new BaseError(
        `Failed to send withdrawal request. Please try again later or contact support if the issue persists.`,
        HttpStatusCode.INTERNAL_SERVER_ERROR_500 // 500 - unexpected failure
      );
    }

    // Prepare the update data
    const updateDto: Partial<UpdateReferAndEarnInternalDto> = {
      status: ReferAndEarnStatusEnum.WITHDRAWAL_REQUESTED,
      statusTracker: [
        ...existingReferAndEarnData.statusTracker,
        {
          oldStatus: existingReferAndEarnData.status,
          newStatus: ReferAndEarnStatusEnum.WITHDRAWAL_REQUESTED,
          actionDate: currentDateAndTime,
          actionByUserId: referrerDetails.id,
          description: undefined,
        },
      ],
      updatedByUserId: referrerDetails.id,
      referrerBankDetails: {
        accountHolderName: referAndEarnRequestBody.accountHolderName,
        accountNumber: referAndEarnRequestBody.accountNumber,
        ifscCode: referAndEarnRequestBody.ifscCode,
        branchName: referAndEarnRequestBody.branchName,
      },
    };

    // update refer and earn
    return this.updateReferAndEarnInternalByIdAndEmail(
      existingReferAndEarnData.id,
      referrerEmail,
      updateDto
    );
  }
}

const referAndEarnServiceObj = new ReferAndEarnService();
export { referAndEarnServiceObj, ReferAndEarnService };
