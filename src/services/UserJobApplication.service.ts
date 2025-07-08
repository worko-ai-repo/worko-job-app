
// Import aws sdk
import { AWSError, Scheduler } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

// import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";

// import luxon
import { DateTime } from "luxon";

// import constants
import APP_CONSTANTS from "../configs/constants.config";
import { awsSchedulerClientLibrary } from "../configs/aws-sdk.config";

// import daos
import { userJobApplicationDao } from "../daos/UserJobApplication.dao";

// import dtos
import { UserJobApplicationBulkUpdateApiDTO, UserJobApplicationBulkUploadDto, UserJobApplicationCommonUpdateDto, UserJobApplicationCreateApiDTO, UserJobApplicationCreateDto, UserJobApplicationDisplayToCorporateApiDTO, UserJobApplicationHiredFromOtherPortalDTO, UserJobApplicationInternalUpdateDto, UserJobApplicationListingFilterOptions, UserJobApplicationRequestFeedbackApiDTO, UserJobApplicationUpdateApiDTO } from "../dtos/UserJobApplication.dto";
import { EntityBulkUpdateMetricDto, PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";
import { EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE, EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION, EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION, EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION } from "../dtos/EmailTemplatePlaceholder.dto";
import { ScheduleJobCreateDto, ScheduleJobInternalUpdateDto, ScheduleUserJobApplicationStatusUpdateToRejectedInputDto } from "../dtos/ScheduleJob.dto";
import { ReferAndEarnStatusTrackerDto, UpdateReferAndEarnInternalDto } from "../dtos/ReferAndEarn.dto";

// import enums
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";
import { UserType } from "../enums/User.enum";
import { JobStatusEnum } from "../enums/Job.enum";
import { ScheduleJobStatus, ScheduleJobType } from "../enums/ScheduleJob.enum";
import { MatchingScoreEntityEnum } from "../enums/Common.enum";
import { ReferAndEarnJobApplicationStatusEnum, ReferAndEarnStatusEnum } from "../enums/ReferAndEarn.enum";

// import helpers
import { injectCompanyJobDetails } from "../helpers/injectCompanyJobDetails.helper";
import { getActionByUserId, getEmailFromPK } from "../helpers/user.helper";
import { dateHelperObj } from "../helpers/date.helper";

// import libraries
import { emailLibrary, EmailSourceDestinationAddress } from "../libraries/email.library";

// import models
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbCorporateUserDto } from "../db/models/CorporateUser.model";
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";
import { DbScheduleJobDto } from "../db/models/ScheduleJob.model";
import { DbReferAndEarnDto } from "../db/models/ReferAndEarn.model";

// import services
import scheduleJobService from "../services/ScheduleJob.service";
import UserDetailService from "./UserDetail.service";
import userDetailServiceObj from "../services/UserDetail.service";
import { corporateUserServiceObj } from "./CorporateUser.service";
import { companyJobServiceObj } from "./CompanyJob.service";
import ScheduleJobService from "./ScheduleJob.service";
import InvokeLambdaService from "./InvokeLambda.service";
import { referAndEarnServiceObj } from "./ReferAndEarn.service";

// import types
import { UserDetailProfileInfoType } from "../types/UserDetail.type";
import { JobApplicationStatusTrackerType, JobApplicationStatusType, JobApplicationWithUserDetailsType } from "../types/UserJobApplication.type";
import { EmailPlaceholderDetailsToJobPosterType } from "../types/EmailTemplatePlaceholder.type";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * UserJobApplicationService
 * 
 * Service for handling user job application-related operations
 */
class UserJobApplicationService {
  /**
   * updateJobApplicationByIdAndPrimaryEmail
   *
   * Updates a job application by its ID and user email.
   *
   * This method updates a job application with the provided update data.
   *
   * @param {string} id - The ID of the job application to be updated.
   * @param {string} email - The email of the user who applied for the job.
   * @param {Partial<UserJobApplicationCommonUpdateDto>} updateData - The update data for the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateJobApplicationByIdAndPrimaryEmail(
    id: string,
    email: string,
    updateData: Partial<UserJobApplicationCommonUpdateDto>
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info("Update job application [service]", {
      methodName: this.updateJobApplicationByIdAndPrimaryEmail.name,
      id,
      email
    });

    return userJobApplicationDao.updateJobApplicationByIdAndPrimaryEmail(id, email, updateData);
  }

  /**
   * scheduleUserJobApplicationStatusUpdateToRejected
   *
   * Schedules a delayed job to update the status of a user's job application.
   *
   * This function logs the attempt to schedule a job application status update
   * and calculates the time delay based on predefined constants. It prepares
   * the necessary input details and payload for the scheduled job, which will
   * update the job application status to REJECTED after a specified number of
   * hours. It then attempts to create the scheduled job and logs the outcome.
   *
   * @param {string} userJobApplicationId - The unique identifier of the user's job application.
   * @param {string} userEmail - The email address of the user associated with the job application.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the scheduled job
   *   was successfully created, or `false` if the creation failed.
   */
  async scheduleUserJobApplicationStatusUpdateToRejected(
    userJobApplicationId: string,
    userEmail: string,
    userId: string
  ): Promise<boolean> {
    // Log
    global.logger.info(
      `Attempting to create delay for job application status update`,
      {
        filePath: __filename,
        methodName: this.scheduleUserJobApplicationStatusUpdateToRejected.name,
      }
    );

    // Calculate the schedule time based on the delay hours constant
    const delayHours: number =
      APP_CONSTANTS.USER_JOB_APPLICATION_UPDATE_AFTER_X_HOURS;

    // Prepare input details
    let scheduleUserJobApplicationRejectedStatusUpdateInput: ScheduleUserJobApplicationStatusUpdateToRejectedInputDto =
      {
        userJobApplicationId,
        userEmail,
        userId,
      };

    // Prepare the payload for the scheduled job
    const scheduleJobPayload: ScheduleJobCreateDto = {
      type: ScheduleJobType.USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED,
      scheduleTime: DateTime.now()
        .plus({ hours: delayHours })
        .toUTC()
        .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      input: scheduleUserJobApplicationRejectedStatusUpdateInput,
      desc: `Scheduled job to update job application status to REJECTED after ${delayHours} hours`,
      status: ScheduleJobStatus.SCHEDULED,
    };
    global.logger.info(`scheduleJobPayload`, {
      scheduleJobPayload,
    });

    // Create the scheduled job
    let scheduleJobCreated: DbScheduleJobDto =
      await ScheduleJobService.createScheduleJob(scheduleJobPayload);

    // Log the result of the scheduled job creation
    if (scheduleJobCreated) {
      logger.info(`Scheduled job for job application rejected status update.`, {
        filePath: __filename,
        methodName: this.scheduleUserJobApplicationStatusUpdateToRejected.name,
      });

      // Prepare update job application data
      const updateData: Partial<UserJobApplicationCommonUpdateDto> = {
        rejectionAwsScheduleId: scheduleJobCreated.id,
      }

      const updateJobApplication: DbUserJobApplicationDto = await this.updateJobApplicationByIdAndPrimaryEmail(
        userJobApplicationId,
        userEmail,
        updateData
      )

      return true;
    } else {
      global.logger.error(
        `Failed to create scheduled job for job application rejected status update.`
      );
      return false;
    }
  }

  /**
   * validateUserJobApplicationMatchingScore
   *
   * Validates the matching score of a job application and performs the appropriate action.
   *
   * If the matching score is less than the minimum matching score, then schedules a job
   * to update the job application status to REJECTED after a given delay. Otherwise, sends
   * an email notification to all corporate users who is currently working on that particular
   * company about the new job application.
   *
   * @param {string} userJobApplicationId - The ID of the job application to be validated.
   * @param {string} userEmail - The email of the user who applied for the job.
   * @param {string} userId - The ID of the user who applied for the job.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the validation is successful, or `false` if the validation fails.
   */
  async validateUserJobApplicationMatchingScore(
    userJobApplicationId: string,
    userEmail: string,
    userId: string
  ): Promise<boolean> {
    global.logger.debug(`Validated User matching score`, {
      userJobApplicationId,
      userEmail,
      userId,
    });

    // Get the job application details
    const jobApplicationDetails: DbUserJobApplicationDto =
      await this.getJobApplicationById(userJobApplicationId);

    // Check if the job application has a matching score less than the minimum matching score and perform the appropriate action
    if (
      jobApplicationDetails.matchingScore! <
      APP_CONSTANTS.MATCHING_SCORES.JOB_APPLICATION_MINIMUM_MATCHING_SCORE
    ) {
      await this.scheduleUserJobApplicationStatusUpdateToRejected(
        userJobApplicationId,
        userEmail,
        userId
      );
    } else {
      // Fetch candidate details using user ID
      const candidateDetails: DbUserDetailDto =
        await UserDetailService.getUserByIdOne(userId);

      // Send email notification to all corporate users who is currently working on that particular company about the new job application
      await this.sendEmailToCorporateUsersOnNewJobApplication(
        jobApplicationDetails,
        candidateDetails
      );
    }

    return true;
  }

  /**
   * createJobApplication
   *
   * Creates a new job application for a candidate.
   *
   * If the job is not published, then throws an error.
   * If the candidate has already applied for the job, then throws an error.
   * If refer and earn id is present in the request body, then it checks if the refer and earn id is valid.
   * If the refer and earn id is valid, then it updates the refer and earn status to `APPLIED`.
   * If the refer and earn id is not valid, then it ignores the refer and earn id and creates a new job application.
   * If the job application is created successfully, then it triggers a lambda function to calculate the matching score for the job application.
   * If the updated matching score is less than the minimum matching score, then it schedules a job to update the job application status to `REJECTED` after 24 hours.
   * If the updated matching score is greater than the minimum matching score, then it sends an email notification to all corporate users who is currently working on that particular company about the new job application.
   *
   * @param {DbUserDetailDto} candidateDetails - The candidate details.
   * @param {UserJobApplicationCreateApiDTO} jobApplicationRequestBody - The job application request body.
   *
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to an object representing the created job application.
   */
  async createJobApplication(
    candidateDetails: DbUserDetailDto,
    jobApplicationRequestBody: UserJobApplicationCreateApiDTO
  ): Promise<DbUserJobApplicationDto> {
    // Logger
    global.logger.info("Create Job Application [Service]", {
      filePath: __filename,
      methodName: this.createJobApplication.name,
    });

    // Get current date and time
    const currentDateAndTime: string = DateTime.now().toISO();

    // Fetch job details based on job ID
    const jobDetails: DbCompanyJobDto = (
      await companyJobServiceObj.getJobById(jobApplicationRequestBody.jobId)
    )[0];

    // Throw an error if job is not published
    if (jobDetails.status !== JobStatusEnum.PUBLISHED || jobDetails.isDeleted) {
      throw new BaseError(
        `The new job applications for this job are currently closed.`,
        HttpStatusCode.FORBIDDEN_403
      );
    }

    // Extract Candidate details
    const emailId: string = getEmailFromPK(candidateDetails.PK);
    const userId: string = candidateDetails.id;
    const fullPhoneNumber: string = candidateDetails.number; // sample: "+919666xxx100"

    // Check if the user has already applied for the job and throw error if already applied for the job
    let existingUserJobApplicationQueryResponse: QueryResponse<DbUserJobApplicationDto> =
      await userJobApplicationDao.getJobApplicationByjobId(
        emailId,
        jobDetails.id
      );

    // Check if user has already applied for the job
    if (existingUserJobApplicationQueryResponse.count) {
      // Throw error if user has already applied for the job.
      throw new BaseError(
        `You have already applied for this job. Check your dashboard for reference.`,
        HttpStatusCode.FORBIDDEN_403
      );
    }

    // Check if the request body has a refer and earn id
    if (jobApplicationRequestBody.referAndEarnId) {
      // Retrieve refer and earn details by refer and earn id
      const referAndEarnDetails: QueryResponse<DbReferAndEarnDto> =
        await referAndEarnServiceObj.getReferAndEarnById(
          jobApplicationRequestBody.referAndEarnId
        );

      // If refer and earn details not found, then set refer and earn id to undefined
      if(!referAndEarnDetails.count) {
        jobApplicationRequestBody.referAndEarnId = undefined;
      } else {
        // Parse the refer and earn details
        const parsedReferAndEarnDetails: DbReferAndEarnDto =
          referAndEarnDetails[0];

        const { recipientDetails } = parsedReferAndEarnDetails;
        const {
          email: recipientEmailId,
          phoneNumber: recipientPhoneNumber,
          phoneCountryCode: recipientPhoneCountryCode,
        } = recipientDetails;

        /**
         * If recipient email id is not same as applicant email id and recipient phone number is not same as applicant phone number, 
         * then we should not create a new job application as referred by someone.
         * 
         * If any one of the recipient email id or recipient phone number is same as applicant email id or phone number, 
         * then we should create a new job application as referred by someone.
         */
        if (
          recipientEmailId !== emailId &&
          fullPhoneNumber !==
            `+${recipientPhoneCountryCode}${recipientPhoneNumber}`
        ) {
          jobApplicationRequestBody.referAndEarnId = undefined;
        }
      }
    }

    // Prepare the data required to create a new job application
    const userJobApplicationDto: UserJobApplicationCreateDto = {
      ...jobApplicationRequestBody,
      companyId: jobDetails.companyId,
      status: JobApplicationStatus.APPLIED,
      statusTracker: [
        {
          oldStatus: JobApplicationStatus.APPLIED,
          newStatus: JobApplicationStatus.APPLIED,
          actionDate: currentDateAndTime,
          userId: userId,
          userType: UserType.CAND,
        },
      ],
    };

    // Create a new job application
    const jobApplicationDetails: DbUserJobApplicationDto =
      await userJobApplicationDao.createJobApplication(
        userId, // user id of the candidate
        emailId, // email id of the candidate applying for the job
        userJobApplicationDto // job application request body
      );

    // Check if the job application is for a refer and earn id
    if (jobApplicationDetails.referAndEarnId) {
      // Retrieve refer and earn details by refer and earn id
      const referAndEarnDetails: QueryResponse<DbReferAndEarnDto> =
        await referAndEarnServiceObj.getReferAndEarnById(
          jobApplicationDetails.referAndEarnId
        );
      if (referAndEarnDetails.count) {
        // Parse the refer and earn details
        const parsedReferAndEarnDetails: DbReferAndEarnDto =
          referAndEarnDetails[0];

        let referAndEarnUpdateDto: Partial<UpdateReferAndEarnInternalDto>;

        // Check if recipient details id is present or not
        // If present then prepare refer and earn update dto without recipient details
        if (parsedReferAndEarnDetails.recipientDetails.id) {
          // Prepare refer and earn update dto
          referAndEarnUpdateDto = {
            userJobApplicationId: jobApplicationDetails.id,
            jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.APPLIED,
            jobAppliedDate: currentDateAndTime,
          };
        } else {
          // If recipient details id is not present then prepare refer and earn update dto with recipient details
          referAndEarnUpdateDto = {
            recipientDetails: {
              ...parsedReferAndEarnDetails.recipientDetails,
              id: userId,
            },
            userJobApplicationId: jobApplicationDetails.id,
            jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.APPLIED,
            jobAppliedDate: currentDateAndTime,
          };
        }

        // Update refer and earn status
        await referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
          parsedReferAndEarnDetails.id,
          getEmailFromPK(parsedReferAndEarnDetails.PK),
          referAndEarnUpdateDto
        );
      }
    }

    // Send email notification to the candidate about the new job application
    const sendEmailResponse: boolean =
      await this.sendEmailToCandidateOnNewJobApplication(
        jobApplicationDetails,
        candidateDetails,
        jobDetails.jobTitle
      );
    global.logger.debug("send Email To Candidate On New Job Application details", {
      sendEmailResponse,
      email: emailId,
      userId: userId,
    });

    // Prepare the job application SK for the job application to Pass to calculate matching score Lambda
    const jobApplicationSK: string =
      userJobApplicationDao.sortKeys.SK_JOB_APP_ID.strtr({
        "{id}": jobApplicationDetails.id,
      });

    // Invoke a lambda function to calculate matching scores for this job application
    await InvokeLambdaService.triggerMatchingScoreCalculation(
      emailId,
      MatchingScoreEntityEnum.JOB_APP,
      jobApplicationSK
    );

    /**
     * 1. In matching score calculation lambda(python language) code `sqs` will be triggerred
     * 2. After triggering `sqs` you need to Perform actions according to matching score calculation
     *    1. If updated matching score is less than threshold
     *       1. Then schedule job to 24 hours,
     *          1. After 24 hours update the `status` to `REJECTED`
     *    2. If updated matching score is greater than threshold
     *       1. Then send email to all corporates regarding the application
     */

    // Return created job application details
    return jobApplicationDetails;
  }

  /**
   * getJobApplicationById
   *
   * Retrieves and parses the job application details by job application ID.
   *
   * This method fetches the job application details using the provided ID,
   * parses the details, and returns the parsed job application data. If the
   * job application details are not found, it throws a `BaseError`.
   *
   * @param {string} jobApplicationId - The job application ID.
   * @throws {BaseError} If the job application details are not found.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the parsed job application data.
   */
  async getJobApplicationById(
    jobApplicationId: string
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(
      "Get Job Application By Id with Parsing Details and throw error if not found [Service]",
      {
        filePath: __filename,
        methodName: this.getJobApplicationById.name,
        jobApplicationId,
      }
    );

    // Fetch job application details using job application ID
    const jobAppliactionDetails: QueryResponse<DbUserJobApplicationDto> =
      await userJobApplicationDao.getJobApplicationById(jobApplicationId);

    // If job application details are not found, throw an error
    if (!jobAppliactionDetails.count) {
      throw new BaseError(
        `The job application details not found".`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return jobAppliactionDetails[0];
  }

  /**
   * getJobApplicationScore
   *
   * Retrieves the matching score for the job application with the specified
   * job application ID.
   *
   * @param {string} jobApplicationId - The job application ID.
   * @returns {Promise<QueryResponse<DbUserJobApplicationDto>>} A promise that resolves to the matching score of the job application
   */
  async getJobApplicationScore(
    jobApplicationId: string
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info("Get Job Application Score [Service]", {
      filePath: __filename,
      methodName: this.getJobApplicationScore.name,
    });

    // Fetch job application details using job application ID
    const jobAppliactionDetails: QueryResponse<DbUserJobApplicationDto> =
      await userJobApplicationDao.getJobApplicationScore(jobApplicationId);

    // If job application details are not found, throw an error
    if (!jobAppliactionDetails.count) {
      throw new BaseError(
        `The job application details not found".`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return jobAppliactionDetails[0];
  }

  /**
   * getUserJobApplicationByEmailIdAndJobId
   *
   * Retrieves a job application by email ID and job ID.
   *
   * This method logs the retrieval action and returns a promise that resolves to the job application data.
   *
   * @param {string} emailId - The email of the user.
   * @param {string} jobId - The job ID.
   * @return {Promise<QueryResponse<DbUserJobApplicationDto>>} A promise that resolves to the job application data.
   */
  async getUserJobApplicationByEmailIdAndJobId(
    emailId: string,
    jobId: string
  ): Promise<QueryResponse<DbUserJobApplicationDto>> {
    global.logger.info(
      `Get User Job Application By emailId and jobId [Service]`,
      {
        filePath: __filename,
        methodName: this.getUserJobApplicationByEmailIdAndJobId.name,
        emailId,
        jobId,
      }
    );

    return userJobApplicationDao.getUserJobApplicationByEmailIdAndJobId(
      emailId,
      jobId
    )
  } 

  /**
   * prepareUserJobApplicationUpdateDtoToRejectAfterXHours
   *
   * Prepares a user job application update dto after a certain number of hours.
   *
   * This method fetches the job application details using the provided job application ID and
   * logs an error if the job application details are not found. It then prepares a user job
   * application update dto by setting the status to `REJECTED` and adding the current date and time
   * to the status tracker. Finally, it updates the job application using the prepared update
   * dto and returns a promise that resolves to `true` if the update was successful, or `false` if
   * the update failed.
   *
   * @param {string} userJobApplicationId - The ID of the job application to be updated.
   * @param {string} userEmail - The email address of the user who applied for the job.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the update was successful, or `false` if the update failed.
   */
  async prepareUserJobApplicationUpdateDtoToRejectAfterXHours(
    userJobApplicationId: string,
    userEmail: string
  ): Promise<boolean> {
    // logger
    global.logger.info("Prepare User Job Application Update Dto [Service]", {
      methodName: this.prepareJobApplicationsWithUserDetails.name,
    });

    // Fetch job application details using job application ID and log error if not found
    const userJobApplicationDetailsQueryResponse: QueryResponse<DbUserJobApplicationDto> =
      await userJobApplicationDao.getJobApplicationById(userJobApplicationId);
    if (userJobApplicationDetailsQueryResponse.count) {
      // Fetch job application details
      const userJobApplicationDetails: DbUserJobApplicationDto =
        userJobApplicationDetailsQueryResponse[0];

      if (userJobApplicationDetails.displayToCorporate === true) {
        global.logger.info(
          `Job application is sent to corporate by worko-admin`,
          {
            methodName:
              this.prepareUserJobApplicationUpdateDtoToRejectAfterXHours.name,
            userJobApplicationId,
          }
        );
        return true;
      }

      const currentActionDateTime: string = DateTime.now().toISO();

      // Prepare user job application update dto
      const updateUserJobApplicationDto: UserJobApplicationInternalUpdateDto = {
        status: JobApplicationStatus.REJECTED,
        statusTracker: [
          ...userJobApplicationDetails.statusTracker,
          {
            oldStatus: userJobApplicationDetails.status,
            newStatus: JobApplicationStatus.REJECTED,
            actionDate: currentActionDateTime,
            userId: undefined,
            userType: undefined,
          },
        ],
      };

      const updatedUserJobApplicationDetails: DbUserJobApplicationDto =
        await this.updateUserJobApplicationByIdAndEmail(
          userJobApplicationId,
          userEmail,
          updateUserJobApplicationDto
        );

      if (!updatedUserJobApplicationDetails) {
        return false;
      }

      // Check if the job application is for a refer and earn id
      if (updatedUserJobApplicationDetails.referAndEarnId) {
        // Retrieve refer and earn details by refer and earn id
        const referAndEarnDetails: QueryResponse<DbReferAndEarnDto> =
          await referAndEarnServiceObj.getReferAndEarnById(
            updatedUserJobApplicationDetails.referAndEarnId
          );
        if (referAndEarnDetails.count) {
          // Parse the refer and earn details
          const parsedReferAndEarnDetails: DbReferAndEarnDto =
            referAndEarnDetails[0];

          // Prepare statusTracker Data to update 
          const referAndEarnUpdatedStatusTracker: ReferAndEarnStatusTrackerDto[] = [
            ...parsedReferAndEarnDetails.statusTracker,
            {
              oldStatus: parsedReferAndEarnDetails.status,
              newStatus: ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED,
              actionDate: currentActionDateTime,
              actionByUserId: undefined,
              description: undefined
            },
          ]

          // Prepare refer and earn update dto
          const referAndEarnUpdateDto: Partial<UpdateReferAndEarnInternalDto> =
            {
              status: ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED,
              statusTracker: referAndEarnUpdatedStatusTracker,
              jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.REJECTED,
            };

          // Update refer and earn status
          const updatedReferAndEarnDetails: DbReferAndEarnDto =
            await referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
              parsedReferAndEarnDetails.id,
              getEmailFromPK(parsedReferAndEarnDetails.PK),
              referAndEarnUpdateDto
            );

          // If refer and earn update failed return false
          if (!updatedReferAndEarnDetails) {
            return false;
          }
        }
      }

      return true;
    }

    return false;
  }

  /**
   * updateUserJobApplicationByIdAndEmail
   *
   * Updates a job application by its ID and user email.
   *
   * This method updates a job application with the provided update data.
   *
   * @param {string} userJobApplicationId - The ID of the job application to be updated.
   * @param {string} userEmail - The email of the user who applied for the job.
   * @param {UserJobApplicationInternalUpdateDto} userJobApplicationUpdateDto - The update data for the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateUserJobApplicationByIdAndEmail(
    userJobApplicationId: string,
    userEmail: string,
    userJobApplicationUpdateDto: UserJobApplicationInternalUpdateDto
  ): Promise<DbUserJobApplicationDto> {
    // Update user job application
    global.logger.info("Update User Job Application By Id [Service]", {
      filePath: __filename,
      methodName: this.updateUserJobApplicationByIdAndEmail.name,
      userJobApplicationId,
    });

    // Update user job application
    return userJobApplicationDao.updateUserJobApplicationByIdAndEmail(
      userJobApplicationId,
      userEmail,
      userJobApplicationUpdateDto
    );
  }

  /**
   * prepareJobApplicationsWithUserDetails
   *
   * Prepares job applications with user details.
   *
   * This method takes an array of job applications and returns an array of job applications
   * with user details. It first gets the unique user email ids from the job applications
   * array and then fetches the user details for those email ids. It then converts the
   * user details to a map for easy access and finally attaches the user details to each
   * job application.
   *
   * @param {DbUserJobApplicationDto & { jobUrl: string | undefined; jobTitle: string | undefined; jdExtracted: string | undefined; }[]} jobApplicationsArray - An array of job applications.
   * @returns {Promise<JobApplicationWithUserDetailsType[]>} A promise that resolves to an array of job applications with user details.
   */
  async prepareJobApplicationsWithUserDetails(
    jobApplicationsArray: (DbUserJobApplicationDto & {
      jobUrl: string | undefined;
      jobTitle: string | undefined;
      jdExtracted: string | undefined;
    })[]
  ): Promise<JobApplicationWithUserDetailsType[]> {
    // logger
    global.logger.info("Prepare job applications with user details [Service]", {
      filePath: __filename,
      methodName: this.prepareJobApplicationsWithUserDetails.name,
    });

    // get unique user email ids
    const uniqueUserEmailIds: string[] = Array.from(
      new Set(
        jobApplicationsArray.map(
          (
            item: DbUserJobApplicationDto & {
              jobUrl: string | undefined;
              jobTitle: string | undefined;
              jdExtracted: string | undefined;
            }
          ) => item.PK.split("#")[2]
        )
      )
    );

    // get user details by unique user email ids
    const userDetailsArray: UserDetailProfileInfoType[] =
      await userDetailServiceObj.getUserDetailsByEmailIds(uniqueUserEmailIds);

    // Covert user details to map for easy access
    const userDetailsMap: Map<string, UserDetailProfileInfoType> = new Map(
      userDetailsArray.map((userProfileDetail: UserDetailProfileInfoType) => [
        userProfileDetail.userDetails.PK.split("#")[2],
        userProfileDetail,
      ])
    );

    // attach user details to job applications
    const jobApplicationsWithUserDetails: JobApplicationWithUserDetailsType[] =
      await Promise.all(
        jobApplicationsArray.map(
          async (
            eachJobApplication: DbUserJobApplicationDto & {
              jobUrl: string | undefined;
              jobTitle: string | undefined;
              jdExtracted: string | undefined;
            }
          ) => {
            // get user details for each job application
            const userDetails: UserDetailProfileInfoType | undefined =
              userDetailsMap.get(eachJobApplication.PK.split("#")[2]);

            // if user details not found, return job application without applicant details
            if (!userDetails) {
              return {
                ...eachJobApplication,
                applicantDetails: undefined,
              };
            }

            const jobAppliactionDetailWithUserDetail: JobApplicationWithUserDetailsType =
              {
                ...eachJobApplication,
                applicantDetails: {
                  ...userDetails.userDetails,
                  profileImageAwsS3SignedUrl:
                    userDetails.profileImageAwsS3SignedUrl,
                  cvAwsS3SignedUrl: userDetails.cvAwsS3SignedUrl,
                },
              };

            return jobAppliactionDetailWithUserDetail;
          }
        )
      );

    return jobApplicationsWithUserDetails;
  }

  /**
   * getJobApplicationsByFilterOptions
   *
   * Retrieves job applications based on the provided filter options.
   *
   * This method allows for the querying of job applications using various
   * filter criteria such as company ID, user email, status, and job ID.
   * The results are sorted according to the specified sort order and
   * paginated using the provided pagination helper.
   *
   * @param {UserJobApplicationListingFilterOptions} jobApplicationRequestBody - The filter options for querying job applications.
   * @returns {Promise<
   *   | PaginatedResultsWithMatchingConditionsInternalResponse<
   *       JobApplicationWithUserDetailsType[]
   *     >
   *   | PaginatedResultsWithMatchingConditionsInternalResponse<
   *       (DbUserJobApplicationDto & {
   *         jobUrl: string | undefined;
   *         jobTitle: string | undefined;
   *         jdExtracted: string | undefined;
   *       })[]
   *     >
   * >} A promise that resolves to the paginated results of job applications matching the filter conditions.
   */
  async getJobApplicationsByFilterOptions(
    jobApplicationRequestBody: UserJobApplicationListingFilterOptions
  ): Promise<
    | PaginatedResultsWithMatchingConditionsInternalResponse<
        JobApplicationWithUserDetailsType[]
      >
    | PaginatedResultsWithMatchingConditionsInternalResponse<
        (DbUserJobApplicationDto & {
          jobUrl: string | undefined;
          jobTitle: string | undefined;
          jdExtracted: string | undefined;
        })[]
      >
  > {
    // logger
    global.logger.info("Get Job Applications By filter options [Service]", {
      filePath: __filename,
      methodName: this.getJobApplicationsByFilterOptions.name,
    });

    // Fetch job applications
    const jobApplicationsDetails: PaginatedResultsWithMatchingConditionsResponse<DbUserJobApplicationDto> =
      await userJobApplicationDao.getJobApplicationsByFilterOptions(
        jobApplicationRequestBody
      );

    // Extract job applications
    const {
      lastKey,
      count,
      timesQueried,
      queriedCount,
      ...userJobApplicationsData
    } = jobApplicationsDetails;

    // Convert to array
    const userJobApplicationArray: DbUserJobApplicationDto[] = Object.values(
      userJobApplicationsData
    );

    // Enrich the data with company job details
    const userJobApplicationArrayWithCompanyJobDetails: (DbUserJobApplicationDto & {
      jobUrl: string | undefined;
      jobTitle: string | undefined;
      jdExtracted: string | undefined;
    })[] = await injectCompanyJobDetails<DbUserJobApplicationDto>(
      userJobApplicationArray
    );

    // If the user is a candidate then return job applications without attaching user details
    if (jobApplicationRequestBody.userType === UserType.CAND) {
      const jobApplicationsWithoutUserDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
        (DbUserJobApplicationDto & {
          jobUrl: string | undefined;
          jobTitle: string | undefined;
          jdExtracted: string | undefined;
        })[]
      > = {
        data: userJobApplicationArrayWithCompanyJobDetails,
        lastKey,
        count,
        timesQueried,
        queriedCount,
      };

      return jobApplicationsWithoutUserDetails;
    }

    // Prepare job applications
    const jobApplicationsWithUserDetails: JobApplicationWithUserDetailsType[] =
      await this.prepareJobApplicationsWithUserDetails(
        userJobApplicationArrayWithCompanyJobDetails
      );

    const paginatedJobApplicationsWithUserDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
      JobApplicationWithUserDetailsType[]
    > = {
      data: jobApplicationsWithUserDetails,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };

    return paginatedJobApplicationsWithUserDetails;
  }

  /**
   * sendEmailToCandidateOnJobApplicationUpdate
   *
   * Sends an email to the candidate when their job application status is updated.
   *
   * @param {DbUserJobApplicationDto} updatedJobApplication - The updated job application data.
   * @param {string} applicantName - The name of the candidate.
   * @returns {Promise<boolean>} A promise that resolves to true if the email was sent successfully.
   */
  async sendEmailToCandidateOnJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    applicantName: string, // Refer "name" attribute in "UserDetail.model.ts"
  ): Promise<boolean> {
    const toAddress: EmailSourceDestinationAddress = {
      email: updatedJobApplication.PK.split("#")[2],
      fullName: applicantName,
    };

    const applicantNameToTitleCase: string = applicantName.toTitleCase();

    // Get company job details query response
    const companyJobDetailsQueryResponse: QueryResponse<DbCompanyJobDto> =
      await companyJobServiceObj.getJobById(updatedJobApplication.jobId);

    // Get company job details from query response
    const companyJobDetails: DbCompanyJobDto =
      companyJobDetailsQueryResponse[0];

    switch (updatedJobApplication.status) {
      case JobApplicationStatus.CV_DOWNLOADED: {
        // Construct the email placeholders object
        const cvDownloadedEmailPlaceholders: EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE =
          {
            candName: applicantNameToTitleCase,
            companyName: updatedJobApplication.companyName.toTitleCase(),
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            workoAppUrl: APP_CONSTANTS.WORKO_APP_DOMAIN,
            guidanceEmail: APP_CONSTANTS.GUIDANCE_EMAIL,
          };

        // Send email to the corporate user
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE,
          toAddress,
          cvDownloadedEmailPlaceholders
        );
        break;
      }
      case JobApplicationStatus.UNDER_EVALUATION: {
        // Construct the email placeholders object
        const underEvaluationEmailPlaceholders: EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE =
          {
            candName: applicantNameToTitleCase,
            companyName: updatedJobApplication.companyName.toTitleCase(),
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            workoAppUrl: APP_CONSTANTS.WORKO_APP_DOMAIN,
            guidanceEmail: APP_CONSTANTS.GUIDANCE_EMAIL,
          };

        // Send email to the corporate user
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE,
          toAddress,
          underEvaluationEmailPlaceholders
        );
        break;
      }
      case JobApplicationStatus.HIRED: {
        // Construct the email placeholders object
        const hiredEmailPlaceholders: EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE =
          {
            candName: applicantNameToTitleCase,
            companyName: updatedJobApplication.companyName.toTitleCase(),
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            workoAppUrl: APP_CONSTANTS.WORKO_APP_DOMAIN,
          };

        // Send email to the corporate user
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE,
          toAddress,
          hiredEmailPlaceholders
        );
        break;
      }
      case JobApplicationStatus.REJECTED: {
        // Construct the email placeholders object
        const rejectedEmailPlaceholders: EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE =
          {
            candName: applicantNameToTitleCase,
            companyName: updatedJobApplication.companyName.toTitleCase(),
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            hrFeedback:
              updatedJobApplication.rejectedByUserId?.reason ??
              "Hiring manager has not provided any feedback",
            workoAppUrl: APP_CONSTANTS.WORKO_APP_DOMAIN,
          };

        // Send email to the corporate user
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE,
          toAddress,
          rejectedEmailPlaceholders
        );
        break;
      }
      default:
        return false;
    }

    return true;
  }

  /**
   * formatJobApplicationStatus
   *
   * Formats the job application status to a human-readable string.
   * As of now we are formatting to send emails to the end users.
   *
   * @param {JobApplicationStatusType} status - The job application status.
   * @returns {string} The formatted job application status.
   */
  formatJobApplicationStatus(status: JobApplicationStatusType): string {
    global.logger.info("Format Job Application Status [Service]", {
      filePath: __filename,
      methodName: this.formatJobApplicationStatus.name,
      status,
    });

    /**
     * Record<JobApplicationStatus, string> creates an object type where:
     *    1. The keys must be one of the JobApplicationStatus enum values ("APPLIED", "REJECTED", etc.).
     *    2. The values must be strings.
     */
    const formattedStatuses: Record<JobApplicationStatus, string> = {
      [JobApplicationStatus.APPLIED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.APPLIED,
      [JobApplicationStatus.REJECTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.REJECTED,
      [JobApplicationStatus.CV_DOWNLOADED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.CV_DOWNLOADED,
      [JobApplicationStatus.UNDER_EVALUATION]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.UNDER_EVALUATION,
      [JobApplicationStatus.PROCESSING_INTERVIEW]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.PROCESSING_INTERVIEW,
      [JobApplicationStatus.INTERVIEW_DONE]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.INTERVIEW_DONE,
      [JobApplicationStatus.HIRED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.HIRED,
    };

    // Return the formatted status or default to "Applied"
    return (
      formattedStatuses[status] ||
      formattedStatuses[JobApplicationStatus.APPLIED]
    );
  }

  /**
   * sendEmailToJobPosterOnJobApplicationUpdate
   *
   * Sends an email to the job poster when a candidate's job application status is updated.
   *
   * @param {DbUserJobApplicationDto} updatedJobApplication - The updated job application data.
   * @param {string} applicantName - The name of the candidate.
   * @returns {Promise<boolean>} A promise that resolves to true if the email was sent successfully.
   */
  async sendEmailToJobPosterOnJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    applicantName: string,
  ): Promise<boolean> {
    global.logger.info(
      "Send Email To Job Poster On Job Application Update [Service]",
      {
        filePath: __filename,
        methodName: this.sendEmailToJobPosterOnJobApplicationUpdate.name,
        updatedJobApplicationId: updatedJobApplication.id,
      }
    );

    // Send email to the job poster placeholder details
    const sendEmailPlaceholderDetailsToJobPoster: EmailPlaceholderDetailsToJobPosterType =
      await this.preparePlaceholdersToSendEmailToJobPoster(
        updatedJobApplication,
        applicantName,
      );
    
    if(!sendEmailPlaceholderDetailsToJobPoster) {
      return false;
    }

    const {
      jobPosterName,
      jobTitle,
      candidateName,
      status,
      jobPosterSendingEmail,
    } = sendEmailPlaceholderDetailsToJobPoster;

    const toAddress: EmailSourceDestinationAddress = {
      email: jobPosterSendingEmail,
      fullName: jobPosterName,
    };

    // Construct the email placeholders object
    const emailPlaceholders: EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION =
      {
        jobPosterName,
        jobTitle,
        candidateName,
        updatedStatus: this.formatJobApplicationStatus(
          status as JobApplicationStatusType
        ),
      };

    // Send email to the corporate user
    await emailLibrary.sendEmail(
      EmailTemplateEnum.CORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION,
      toAddress,
      emailPlaceholders
    );

    return true;
  }

  /**
   * Prepares placeholders to send email to job poster.
   *
   * This method takes a job application object and returns an object containing the placeholders
   * for the email template used when an email is sent to the job poster. The placeholders include
   * the job poster's email address, name, job title, job application status, candidate name, and candidate email id.
   *
   * @param {DbUserJobApplicationDto} parsedJobApplicationDetails - The parsed job application data.
   * @param {string} applicantName - The name of the applicant.
   * @returns {Promise<EmailPlaceholderDetailsToJobPosterType>} A promise that resolves to an object containing the placeholders for the email template.
   */
  async preparePlaceholdersToSendEmailToJobPoster(
    parsedJobApplicationDetails: DbUserJobApplicationDto,
    applicantName: string,
  ): Promise<EmailPlaceholderDetailsToJobPosterType> {

    // get job id from jobApplicationDetails
    const jobId: string = parsedJobApplicationDetails.jobId;

    // get posted job details by jobId
    const postedJobDetails: DbCompanyJobDto = (
      await companyJobServiceObj.getJobById(jobId)
    )[0];

    /**
     * 1. First we will initialize the jobPosterSendingEmail and jobPosterName with the default source email address
     * 2. If the job poster is a corporate user, we will get the job poster details by userId and assign the job poster sending email and name
     * 3. If the job poster is a user, we will get the job poster details by userId and assign the job poster sending email and name
     * 4. If the job poster is not a user or a corporate user, we will assign the job poster sending email and name with the default source email address,
     *    so we can send the email to the default source email address to not break the system.
     */
    let jobPosterSendingEmail: string = APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.email;
    let jobPosterName: string = APP_CONSTANTS.SOURCE_EMAIL_ADDRESS.WORKO_DEFAULT.fullName

    // check if job poster is a corporate user
    if (postedJobDetails.createdByCorporateUserId) {
      // get job poster details by userId
      const jobPosterQueryResponseDetails: QueryResponse<DbCorporateUserDto> =
        await corporateUserServiceObj.getCorpUserById(
          postedJobDetails.createdByCorporateUserId
        );

      // check if job poster exists and assign job poster details
      // If the count doesn't exist, it means the corporate user doesn't exist
      if(jobPosterQueryResponseDetails.count) {
        // Retrieve job poster details from the query response
        const jobPosterDetails: DbCorporateUserDto = jobPosterQueryResponseDetails[0];

        // assign job poster sending email
        jobPosterSendingEmail = jobPosterDetails.email;
  
        // assign job poster name
        jobPosterName = `${jobPosterDetails.firstName.toTitleCase()} ${jobPosterDetails.lastName.toTitleCase()}`;
      }
    } else if(postedJobDetails.createdByUserId) {
      // get job poster details by userId
      const jobPosterQueryResponseDetails: QueryResponse<DbUserDetailDto> =
        await userDetailServiceObj.getUserById(
          postedJobDetails.createdByUserId
        );

      // check if job poster exists and assign job poster details
      if(jobPosterQueryResponseDetails.count) {
        // Retrieve job poster details from the query response
        const jobPosterDetails: DbUserDetailDto =
          jobPosterQueryResponseDetails[0];

        // assign job poster sending email
        jobPosterSendingEmail = jobPosterDetails.PK.split("#")[2];

        // assign job poster name
        jobPosterName = jobPosterDetails.name.toTitleCase();
      }
    } 

    const placeholderDetails: EmailPlaceholderDetailsToJobPosterType = {
      jobPosterSendingEmail,
      jobPosterName,
      jobTitle: postedJobDetails.jobTitle.toTitleCase(),
      status: parsedJobApplicationDetails.status,
      candidateName: applicantName.toTitleCase(),
      candidateEmailId: parsedJobApplicationDetails.PK.split("#")[2],
    };

    global.logger.debug(
      `placeholder details to job poster - jobPosterSendingEmail:`,
      {
        filePath: __filename,
        methodName: this.preparePlaceholdersToSendEmailToJobPoster.name,
        placeholderDetails,
      }
    );

    return placeholderDetails;
  }

  /**
   * handleReferAndEarnAndNotificationOnJobApplicationUpdate
   * 
   * Handles refer and earn and notification on job application update.
   *
   * It checks if the job application is for a refer and earn id and if yes, it updates the refer and earn status accordingly.
   * It also sends an email to the candidate and job poster about the job application update.
   *
   * @param {DbUserJobApplicationDto} updatedJobApplication - The updated job application details.
   * @param {string} currentActionDateTime - The current date and time in ISO format.
   * @param {string} applicantName - The name of the applicant.
   *
   * @returns {Promise<void>} A promise that resolves when the function is done.
   */
  private async handleReferAndEarnAndNotificationOnJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    currentActionDateTime: string,
    applicantName: string,
  ): Promise<void> {
    // Check if the job application is for a refer and earn id
    if (updatedJobApplication?.referAndEarnId) {
      // Retrieve refer and earn details by refer and earn id
      const referAndEarnDetails: QueryResponse<DbReferAndEarnDto> =
        await referAndEarnServiceObj.getReferAndEarnById(
          updatedJobApplication.referAndEarnId
        );
      if (referAndEarnDetails.count) {
        // Parse the refer and earn details
        const parsedReferAndEarnDetails: DbReferAndEarnDto =
          referAndEarnDetails[0];

        let referAndEarnUpdateDto: Partial<UpdateReferAndEarnInternalDto>;

        if (updatedJobApplication.status === JobApplicationStatus.REJECTED) {
          // Prepare statusTracker Data to update
          const referAndEarnUpdatedStatusTracker: ReferAndEarnStatusTrackerDto[] =
            [
              ...parsedReferAndEarnDetails.statusTracker,
              {
                oldStatus: parsedReferAndEarnDetails.status,
                newStatus: ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED,
                actionDate: currentActionDateTime,
                actionByUserId: undefined,
                description: undefined,
              },
            ];

          // Prepare refer and earn update dto
          referAndEarnUpdateDto = {
            status: ReferAndEarnStatusEnum.WITHDRAWAL_REJECTED,
            statusTracker: referAndEarnUpdatedStatusTracker,
            jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.REJECTED,
          };

          // Update refer and earn status
          await referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
            parsedReferAndEarnDetails.id,
            getEmailFromPK(parsedReferAndEarnDetails.PK),
            referAndEarnUpdateDto
          );
        } else if (
          updatedJobApplication.status ===
          JobApplicationStatus.PROCESSING_INTERVIEW
        ) {
          // Prepare refer and earn update dto
          referAndEarnUpdateDto = {
            jobApplicationStatus:
              ReferAndEarnJobApplicationStatusEnum.PROCESSING_INTERVIEW,
          };

          // Update refer and earn status
          await referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
            parsedReferAndEarnDetails.id,
            getEmailFromPK(parsedReferAndEarnDetails.PK),
            referAndEarnUpdateDto
          );
        } else if (
          updatedJobApplication.status === JobApplicationStatus.HIRED
        ) {
          // Prepare refer and earn update dto
          referAndEarnUpdateDto = {
            jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.HIRED,
          };

          // Update refer and earn status
          await referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
            parsedReferAndEarnDetails.id,
            getEmailFromPK(parsedReferAndEarnDetails.PK),
            referAndEarnUpdateDto
          );
        }
      }
    }

    // send email to candidate
    await this.sendEmailToCandidateOnJobApplicationUpdate(
      updatedJobApplication,
      applicantName,
    );

    // send email to job poster on job application update
    await this.sendEmailToJobPosterOnJobApplicationUpdate(
      updatedJobApplication,
      applicantName,
    );
  }

  /**
   * updateJobApplicationByCorpUser
   *
   * Updates a job application by corporate user.
   *
   * This method updates a job application with the provided status and
   * reason. It also sends an email notification to the candidate of the
   * job application status update.
   *
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @param {UserJobApplicationUpdateApiDTO} jobApplicationRequestBody - The update data for the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateJobApplicationByCorpUser(
    jobApplicationId: string,
    jobApplicationRequestBody: UserJobApplicationUpdateApiDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application By Corp User [Service]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationByCorpUser.name,
      jobApplicationId,
      jobApplicationRequestBody,
    });

    // Fetch job application details
    const parsedJobApplication: DbUserJobApplicationDto =
      await this.getJobApplicationById(jobApplicationId);

    // Fetch refer and earn details
    const currentActionDateTime: string = DateTime.now().toISO();

    // Prepare update data
    let updateData: UserJobApplicationInternalUpdateDto;

    // Prepare update data based on job application status
    if (jobApplicationRequestBody.status === JobApplicationStatus.REJECTED) {
      const statusTrackerData: JobApplicationStatusTrackerType = [
        ...parsedJobApplication.statusTracker,
        {
          oldStatus: parsedJobApplication.status,
          newStatus: jobApplicationRequestBody.status,
          actionDate: currentActionDateTime,
          userId: jobApplicationRequestBody.userId,
          userType: jobApplicationRequestBody.userType,
        },
      ];

      updateData = {
        status: jobApplicationRequestBody.status,
        rejectedByUserId: {
          userId: jobApplicationRequestBody.userId,
          userType: jobApplicationRequestBody.userType,
          actionDate: currentActionDateTime,
          reason:
            jobApplicationRequestBody.reason ?? "Reason not provided by User",
          userComment:
            jobApplicationRequestBody.userComment ??
            "Comment not provided by User",
        },
        statusTracker: statusTrackerData,
      };
    } else if(jobApplicationRequestBody.status === JobApplicationStatus.CV_DOWNLOADED) {
      // If cv is already downloaded then override the action date, user id and user type
      if(parsedJobApplication.status === JobApplicationStatus.CV_DOWNLOADED) {
        const statusTrackerData: JobApplicationStatusTrackerType = [
          ...parsedJobApplication.statusTracker.map(
            (item) =>
              item.newStatus === JobApplicationStatus.CV_DOWNLOADED
                ? { 
                  ...item, 
                  actionDate: currentActionDateTime,
                  userId: jobApplicationRequestBody.userId,
                  userType: jobApplicationRequestBody.userType
                } // override "actionDate", "userId" and "userType"
                : item // keep others unchanged
          )
        ];
  
        updateData = {
          status: jobApplicationRequestBody.status,
          statusTracker: statusTrackerData,
        };
      } else {
        const statusTrackerData: JobApplicationStatusTrackerType = [
          ...parsedJobApplication.statusTracker,
          {
            oldStatus: parsedJobApplication.status,
            newStatus: jobApplicationRequestBody.status,
            actionDate: currentActionDateTime,
            userId: jobApplicationRequestBody.userId,
            userType: jobApplicationRequestBody.userType,
          },
        ];

        updateData = {
          status: jobApplicationRequestBody.status,
          statusTracker: statusTrackerData,
        };
      }
    } else {
      const statusTrackerData: JobApplicationStatusTrackerType = [
        ...parsedJobApplication.statusTracker,
        {
          oldStatus: parsedJobApplication.status,
          newStatus: jobApplicationRequestBody.status,
          actionDate: currentActionDateTime,
          userId: jobApplicationRequestBody.userId,
          userType: jobApplicationRequestBody.userType,
        },
      ];

      updateData = {
        status: jobApplicationRequestBody.status,
        statusTracker: statusTrackerData,
      };
    }

    // Update job application by corp user
    let updatedJobApplication: DbUserJobApplicationDto =
      await userJobApplicationDao.updateJobApplicationStatus(
        parsedJobApplication.PK,
        parsedJobApplication.SK,
        updateData
      );

    // Send email to candidate on job application update
    if (updatedJobApplication?.id) {
      await this.handleReferAndEarnAndNotificationOnJobApplicationUpdate(
        updatedJobApplication,
        currentActionDateTime,
        jobApplicationRequestBody.applicantName,
      );
    }

    return updatedJobApplication;
  }

  /**
   * updateBulkJobApplication
   *
   * Updates multiple job applications in the database using the provided update data.
   *
   * @param {UserJobApplicationBulkUpdateApiDTO} reqBody - The update data for the job applications.
   * @returns {Promise<EntityBulkUpdateMetricDto>} A promise that resolves to the metric details of the updated job applications.
   */
  async updateBulkJobApplication(
    reqBody: UserJobApplicationBulkUpdateApiDTO
  ): Promise<EntityBulkUpdateMetricDto> {
    global.logger.info(`Update Bulk Job Application [Service]`, {
      methodName: this.updateBulkJobApplication.name,
    });

    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    const jobApplicationMetric: EntityBulkUpdateMetricDto = {
      success: {
        count: 0,
        primaryIds: [],
      },
      failure: {
        count: 0,
        primaryIds: [],
      },
    };

    const currentActionDateTime: string = dateHelperObj.getISODate();

    for (const eachUpdateObj of reqBody.bulkJobApplicationUpdate) {
      const {
        emailId,
        jobApplicationId,
        status,
        oldStatus,
        oldStatusTracker,
        userType,
        applicantName,
      } = eachUpdateObj;

      // Prepare status tracker data to update
      const newStatusTracker: JobApplicationStatusTrackerType = [
        ...oldStatusTracker,
        {
          oldStatus: oldStatus,
          newStatus: status,
          actionDate: currentActionDateTime,
          userId: actionByCorporateUserId || actionByUserId,
          userType: userType,
        },
      ];

      // Prepare update data
      const updateData: Partial<UserJobApplicationCommonUpdateDto> = {
        status: status,
        statusTracker: newStatusTracker,
      };

      try {
        const updatedJobApplication: DbUserJobApplicationDto =
          await this.updateJobApplicationByIdAndPrimaryEmail(
            jobApplicationId,
            emailId,
            updateData
          );
        if (updatedJobApplication?.id) {
          jobApplicationMetric.success.count++;
          jobApplicationMetric.success.primaryIds.push(jobApplicationId);
          
          await this.handleReferAndEarnAndNotificationOnJobApplicationUpdate(
            updatedJobApplication,
            currentActionDateTime,
            applicantName,
          );
        } else {
          jobApplicationMetric.failure.count++;
          jobApplicationMetric.failure.primaryIds.push(jobApplicationId);

          global.logger.error(
            `Failed to update jobApplicationId: ${jobApplicationId} in DynamoDB`,
            {
              updatedJobApplication,
            }
          );
        }
      } catch (error) {
        jobApplicationMetric.failure.count++;
        jobApplicationMetric.failure.primaryIds.push(jobApplicationId);

        global.logger.error(
          `Failed to update job application id: ${jobApplicationId}`,
          {
            error,
          }
        );
      }
    }

    return jobApplicationMetric;
  }

  /**
   * sendEmailToCorporateUsersOnNewJobApplication
   *
   * Sends an email to all corporate users for a company when a job application is created.
   *
   * @param {DbUserJobApplicationDto} parsedJobApplication - The parsed job application data.
   * @param {DbUserDetailDto} candidateDetails - The parsed candidate details.
   * @returns {Promise<boolean>} A promise that resolves to true if the email was sent successfully.
   */
  async sendEmailToCorporateUsersOnNewJobApplication(
    parsedJobApplication: DbUserJobApplicationDto,
    candidateDetails: DbUserDetailDto
  ): Promise<boolean> {
    global.logger.info(
      `Send Email To Corporate Users On New Job Application [Service]`,
      {
        filePath: __filename,
        methodName: this.sendEmailToCorporateUsersOnNewJobApplication.name,
        jobApplicationId: parsedJobApplication.id,
        candidateEmail: candidateDetails.PK.split("#")[2],
      }
    );

    // Get all corporate users without pagination
    const corporateUsersData: DbCorporateUserDto[] =
      await corporateUserServiceObj.getAllCorporateUsersWithoutPagination(
        parsedJobApplication.companyId
      );

    // Check if there are any corporate users and if not return false
    if (corporateUsersData.length === 0) {
      return false;
    }

    // Get company job details query response
    const companyJobDetailsQueryResponse: QueryResponse<DbCompanyJobDto> =
      await companyJobServiceObj.getJobById(parsedJobApplication.jobId);

    // Get company job details from query response
    const companyJobDetails: DbCompanyJobDto =
      companyJobDetailsQueryResponse[0];

    // Send email to each corporate user
    const corporateUsersEmailPromises: Promise<{
      awsMessageId: string | null;
      systemLogId: string | null;
    }>[] = Object.values(corporateUsersData).map(
      async(corporateUser: DbCorporateUserDto) => {
        // Retrieve email and first name from the corporate user
        const { email, firstName, lastName } = corporateUser;

        // Construct the corporate user full name
        const corporateUserFullName: string =
          `${firstName} ${lastName}`.toTitleCase();

        // Construct the email address object
        const toAddress: EmailSourceDestinationAddress = {
          email,
          fullName: corporateUserFullName,
        };

        // Construct the email placeholders object
        const emailPlaceholders: EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION =
          {
            corporateUserFullName: corporateUserFullName,
            candidateName: candidateDetails.name.toTitleCase(),
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            matchingScore: parsedJobApplication.matchingScore!,

            // If email feedback is not falsy then use it, otherwise use the overall matching score
            scoreDetails: parsedJobApplication?.emailFeedback ? parsedJobApplication.emailFeedback : `Overall Matching Score is ${parsedJobApplication.matchingScore}.`,
            companyJobApplicantsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CORPORATE_COMPANY_JOB_APPLICANTS_URL.strtr({
              "{jobId}": parsedJobApplication.jobId,
            }),
          };

        // Send email to the corporate user
        return emailLibrary.sendEmail(
          EmailTemplateEnum.CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION,
          toAddress,
          emailPlaceholders
        );
      }
    );

    // Wait for all send email promises to resolve
    await Promise.all(corporateUsersEmailPromises);

    return true;
  }

  /**
   * sendEmailToCandidateOnNewJobApplication
   *
   * Sends an email notification to the candidate upon the creation of their job application.
   *
   * @param {DbUserJobApplicationDto} parsedJobApplication - The parsed job application details.
   * @param {DbUserDetailDto} candidateDetails - The details of the candidate.
   * @returns {Promise<boolean>} A promise that resolves to true if the email was sent successfully.
   */
  async sendEmailToCandidateOnNewJobApplication(
    parsedJobApplication: DbUserJobApplicationDto,
    candidateDetails: DbUserDetailDto,
    jobTitle: string
  ): Promise<boolean> {
    global.logger.info(
      `Send Email To Candidate On Job Application Creation [Service]`,
      {
        filePath: __filename,
        methodName: this.sendEmailToCandidateOnNewJobApplication.name,
      }
    );

    // Construct the email address object
    const toAddress: EmailSourceDestinationAddress = {
      email: candidateDetails.PK.split("#")[2],
      fullName: candidateDetails.name,
    };

    // Construct the email placeholders object
    const emailPlaceholders: EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION =
      {
        candidateName: candidateDetails.name.toTitleCase(),
        jobTitle: jobTitle.toTitleCase(),
        companyName: parsedJobApplication.companyName,
      };

    const { awsMessageId } = await emailLibrary.sendEmail(
      EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_NOTIFICATION,
      toAddress,
      emailPlaceholders
    );

    // If awsMessageId is null, return false because email was not sent
    if (!awsMessageId) {
      return false;
    }

    // If awsMessageId is not null, return true because email was sent
    return true;
  }

  /**
   * updateJobApplicationRequestFeedback
   *
   * @param {UserJobApplicationRequestFeedbackApiDTO} requestBody - The request body containing the application date and additional comments.
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @returns {Promise<boolean>} A promise that resolves to true if the job application request feedback was updated successfully.
   */
  async updateJobApplicationRequestFeedback(
    requestBody: UserJobApplicationRequestFeedbackApiDTO,
    jobApplicationId: string
  ): Promise<boolean> {
    // get job application details by jobApplicationId
    const jobApplicationDetails: DbUserJobApplicationDto =
      await this.getJobApplicationById(jobApplicationId);

    // Retrieve Candidate details
    const candidateDetails: DbUserDetailDto = await UserDetailService.getUserDetailsByEmail(getEmailFromPK(jobApplicationDetails.PK));

    const sendEmailPlaceholderDetailsToJobPoster: EmailPlaceholderDetailsToJobPosterType =
      await this.preparePlaceholdersToSendEmailToJobPoster(
        jobApplicationDetails,
        candidateDetails.name
      );

    // If sendEmailPlaceholderDetailsToJobPoster is undefined, return false
    if(!sendEmailPlaceholderDetailsToJobPoster) {
      return false;
    }

    // Destructure sendEmailPlaceholderDetailsToJobPoster
    const {
      jobPosterName,
      jobTitle,
      candidateName,
      status,
      jobPosterSendingEmail,
    } = sendEmailPlaceholderDetailsToJobPoster;

    // Construct the email address object
    const toAddress: EmailSourceDestinationAddress = {
      email: jobPosterSendingEmail,
      fullName: jobPosterName,
    };

    // Construct the email placeholders object
    const emailPlaceholders: EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION =
      {
        jobPosterName: jobPosterName.toTitleCase(),
        candidateName: candidateName.toTitleCase(),
        jobTitle: jobTitle.toTitleCase(),

        /**
         * Convert application date to required format
         *
         * If `requestBody.applicationDate` is `2024-12-09T05:19:11.312Z`
         * then `formattedDate` will be `9th December 2024`
         */
        applicationDate: DateTime.fromISO(requestBody.applicationDate).toFormat(
          "d'th' MMMM yyyy"
        ),

        status: this.formatJobApplicationStatus(
          status as JobApplicationStatusType
        ),
      };

    // Send email to the corporate user
    const sendEmailDetails: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await emailLibrary.sendEmail(
      EmailTemplateEnum.CORP_REQUEST_FEEDBACK_NOTIFICATION,
      toAddress,
      emailPlaceholders
    );

    if (!sendEmailDetails.awsMessageId) {
      return false;
    }

    // Update the job application request feedback
    await userJobApplicationDao.updateJobApplicationRequestFeedback(
      jobApplicationDetails.PK.split("#")[2], // email
      jobApplicationDetails.id // job Application Id
    );

    return true;
  }

  /**
   * updateJobApplicationDisplayToCorporate
   * 
   * Updates the visibility of a job application to corporate users.
   *
   * This method performs the following steps:
   * 1. Logs the update attempt.
   * 2. Fetches the existing job application by ID.
   * 3. Checks if the `displayToCorporate` flag is already set to the requested value; if so, throws a 409 Conflict.
   * 4. If a pending rejection schedule exists:
   *    - Retrieves the schedule job.
   *    - If the schedule has already completed, throws a 403 Forbidden.
   *    - Deletes the AWS Scheduler entry.
   *    - Marks the schedule job as completed in DynamoDB.
   * 5. Updates the job application record in the database.
   * 6. Fetches candidate details by email.
   * 7. Sends notification emails to all corporate users associated with the company.
   * 8. Returns the updated job application record.
   * 
   * @param {string} jobApplicationId - The unique identifier of the job application to update.
   * @param {UserJobApplicationDisplayToCorporateApiDTO} validatedRequestBody
   *   - DTO containing the new `displayToCorporate` flag.
   *
   * @returns {Promise<DbUserJobApplicationDto>}
   *   The updated job application record from the database.
   *
   * @throws {BaseError} 409 Conflict
   *   - If the `displayToCorporate` value is already the same as requested.
   * @throws {BaseError} 403 Forbidden
   *   - If attempting to resend to corporate after the rejection schedule has completed.
   * @throws {BaseError} 500 Internal Server Error
   *   - If the update operation fails unexpectedly.
   */
  async updateJobApplicationDisplayToCorporate(
    jobApplicationId: string,
    validatedRequestBody: UserJobApplicationDisplayToCorporateApiDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(
      `Update Job Application Display To Corporate [Service]`,
      {
        filePath: __filename,
        methodName: this.updateJobApplicationDisplayToCorporate.name,
        jobApplicationId,
      }
    );

    const existingJobApplicationDetails: DbUserJobApplicationDto = await this.getJobApplicationById(
      jobApplicationId
    )
    if(existingJobApplicationDetails.displayToCorporate === validatedRequestBody.displayToCorporate){
      throw new BaseError("The Job Application already updated.", HttpStatusCode.CONFLICT_409);
    }

    if(existingJobApplicationDetails?.rejectionAwsScheduleId){
      const rejectionAwsScheduleId: string = existingJobApplicationDetails.rejectionAwsScheduleId;

      // Retrieve the schedule job details by `rejectionAwsScheduleId` from `ScheduleJob.model.ts`
      const scheduleJobDetails: DbScheduleJobDto = await ScheduleJobService.getScheduleJobById(rejectionAwsScheduleId); 

      // validate the `status` attribute in `ScheduleJob.model.ts`
      if (scheduleJobDetails.status === ScheduleJobStatus.COMPLETED) {
        throw new BaseError(
          `You can only send to corporates before specified hours.`,
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const deleteResponse: PromiseResult<Scheduler.DeleteScheduleOutput, AWSError> = await awsSchedulerClientLibrary.deleteSchedule({ Name: rejectionAwsScheduleId });
      global.logger.info(
        `Delete Schedule Job [Service]`,
        {
          methodName: this.updateJobApplicationDisplayToCorporate.name,
          deleteResponse,
        }
      )

      // Prepare scheduleJob status update data
      const updateData: Partial<ScheduleJobInternalUpdateDto> = {
        status: ScheduleJobStatus.COMPLETED
      }

      const updateScheduleJobStatus: DbScheduleJobDto = await scheduleJobService.updateScheduleJobById(
        rejectionAwsScheduleId,
        updateData,
      )
      global.logger.info(`Schedule job details updated in dynamodb`, {
        updateScheduleJobStatus: updateScheduleJobStatus.status
      })
    }

    const applicantUserEmail: string = getEmailFromPK(
      existingJobApplicationDetails.PK
    );

    const updatedJobApplication: DbUserJobApplicationDto =
      await userJobApplicationDao.updateJobApplicationDisplayToCorporate(
        jobApplicationId,
        applicantUserEmail,
        validatedRequestBody
      );

    // Fetch candidate details using email and throw error if not found
    const candidateDetails: DbUserDetailDto =
      await UserDetailService.getUserDetailsByEmail(applicantUserEmail);

    // Send email notification to all corporate users who is currently working on that particular company about the job application
    await this.sendEmailToCorporateUsersOnNewJobApplication(
      updatedJobApplication,
      candidateDetails
    );

    return updatedJobApplication;
  }

  /**
   * updateUserJobApplicationHiredFromOtherPortalDetails
   *
   * Service for when a corporate recruiter/admin hires a candidate
   * from a different job portal and updates the duplicacy details while viewing the application on Worko.ai.
   * 
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @param {string} emailId - The email ID of the candidate who had applied for the job.
   * @param {UserJobApplicationHiredFromOtherPortalDTO} hiredFromOtherPortalDetails - The updated CV duplicacy details of the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateUserJobApplicationHiredFromOtherPortalDetails(
    jobApplicationId: string,
    emailId: string,
    hiredFromOtherPortalDetails: UserJobApplicationHiredFromOtherPortalDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(
      `Update User Job Application Hired From Other Portal Details [Service]`,
      {
        filePath: __filename,
        methodName: this.updateUserJobApplicationHiredFromOtherPortalDetails.name,
      }
    );

    return userJobApplicationDao.updateUserJobApplicationHiredFromOtherPortalDetails(
      jobApplicationId,
      emailId,
      hiredFromOtherPortalDetails
    );
  }

  /**
   * scriptBatchCreateUserJobApplications
   *
   * The script to create user job applications in batches.
   *
   * This method is used to migrate the `user job applications` from 
   * `worko` dynamodb table to `worko-job-app` dynamodb table
   *
   * @see https://dynamoosejs.com/guide/Model#modelbatchputitems-settings-callback
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#:~:text=The%20BatchWriteItem%20operation%20puts%20or,item%20put%20or%20delete%20operations.
   *
   * @param {UserJobApplicationBulkUploadDto[]} formattedJobListingArray - An array of formatted job applications to be created in the database.
   *
   * @returns {Promise<{unprocessedItems: ObjectType[]}>} - A promise that resolves to an object containing an array of unprocessed items that failed to be created in the database.
   */
  async scriptBatchCreateUserJobApplications(
    formattedJobListingArray: UserJobApplicationBulkUploadDto[]
  ): Promise<{
      unprocessedItems: ObjectType[];
    }> {
    return userJobApplicationDao.scriptBatchCreateUserJobApplications(
      formattedJobListingArray
    );
  }
}

// Create an instance of the UserJobApplicationService class and export it
const userJobApplicationServiceObj = new UserJobApplicationService();
export { userJobApplicationServiceObj, UserJobApplicationService };