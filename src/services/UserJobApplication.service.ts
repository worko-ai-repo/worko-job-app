
// Import aws sdk
import { DeleteScheduleCommandOutput } from "@aws-sdk/client-scheduler";

// import google cloud firestore
import { DocumentData, QuerySnapshot } from "@google-cloud/firestore";

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
import { UserJobApplicationApplicantUpdateApiDTO, UserJobApplicationBulkUpdateApiDTO, UserJobApplicationBulkUploadDto, UserJobApplicationCommonUpdateDto, UserJobApplicationCreateApiDTO, UserJobApplicationCreateDto, UserJobApplicationDisplayToCorporateApiDTO, UserJobApplicationDocumentMappingDto, UserJobApplicationHiredFromOtherPortalDTO, UserJobApplicationInternalUpdateDto, UserJobApplicationListingFilterOptions, UserJobApplicationRequestFeedbackApiDTO, UserJobApplicationUpdateApiDTO } from "../dtos/UserJobApplication.dto";
import { EntityBulkUpdateMetricDto, PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse, RecordListingFilterOptions } from "../dtos/Common.dto";
import { EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_JOB_APPLICATION_JOINED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE, EmailTemplatePlaceholderCAND_JOB_APPLICATION_REVISED_OFFER_SENT, EmailTemplatePlaceholderCAND_JOB_CLOSED_UPDATE_STATUS, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE, EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE, EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION, EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION, EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION } from "../dtos/EmailTemplatePlaceholder.dto";
import { ScheduleJobCreateDto, ScheduleJobInternalUpdateDto, ScheduleUserJobApplicationStatusUpdateToRejectedInputDto } from "../dtos/ScheduleJob.dto";
import { ReferAndEarnStatusTrackerDto, UpdateReferAndEarnInternalDto } from "../dtos/ReferAndEarn.dto";

// import enums
import { JobApplicationStatus, UserJobApplicationDocumentStatusEnum } from "../enums/UserJobApplication.enum";
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";
import { UserType } from "../enums/User.enum";
import { JobStatusEnum } from "../enums/Job.enum";
import { ScheduleJobStatus, ScheduleJobType } from "../enums/ScheduleJob.enum";
import { MatchingScoreEntityEnum } from "../enums/Common.enum";
import { ReferAndEarnJobApplicationStatusEnum, ReferAndEarnStatusEnum } from "../enums/ReferAndEarn.enum";
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";
import { CorporateCandidateProfileDbRefereeTypeEnum } from "../enums/CorporateCandidateProfile.enum";
import { CentralCandidateProfileDbRefereeTypeEnum } from "../enums/CentralCandidateProfile.enum";
import { CandidateParsedCvAwsS3ResourceTypeEnum } from "../enums/CandidateParsedCv.enum";
import { AgencyUserSubmissionDbJobApplicationStatusEnum } from "../enums/AgencyUserSubmission.enum";

// import helpers
import { injectCompanyJobDetails } from "../helpers/injectCompanyJobDetails.helper";
import { getActionByUserId, getEmailFromPK, getPhoneCountryCodeAndNumber } from "../helpers/user.helper";
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
import { DbCountUserDto } from "../db/models/CountUser.model";
import { DbCountGlobalDto } from "../db/models/CountGlobal.model";
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";
import { DbCountCompanyDto } from "../db/models/CountCompany.model";
import { DbCorporateCandidateProfileDto } from "../db/gcp-firestore-models/CorporateCandidateProfile.model";
import { DbCentralCandidateProfileDto } from "../db/gcp-firestore-models/CentralCandidateProfile.model";
import { DbCandidateParsedCvDto } from "../db/gcp-firestore-models/CandidateParsedCv.model";
import { DbAgencyUserSubmissionDto } from "../db/gcp-firestore-models/AgencyUserSubmission.model";
import { DbInterviewDto } from "../db/models/UserInterview.model";
import { DbUserSkillDto } from "../db/models/UserSkill.model";
import { DbUserPreferenceDto } from "../db/models/UserPreference.model";

// import services
import scheduleJobService from "../services/ScheduleJob.service";
import UserDetailService from "./UserDetail.service";
import userDetailServiceObj from "../services/UserDetail.service";
import { corporateUserServiceObj } from "./CorporateUser.service";
import { companyJobServiceObj } from "./CompanyJob.service";
import ScheduleJobService from "./ScheduleJob.service";
import InvokeLambdaService from "./InvokeLambda.service";
import { referAndEarnServiceObj } from "./ReferAndEarn.service";
import { countUserServiceObj } from "./CountUser.service";
import { countGlobalServiceObj } from "./CountGlobal.service";
import { countCompanyJobServiceObj } from "./CountCompanyJob.service";
import { countCompanyServiceObj } from "./CountCompany.service";
import { corporateCandidateProfileServiceObj } from "./CorporateCandidateProfile.service";
import { centralCandidateProfileServiceObj } from "./CentralCandidateProfile.service";
import { candidateParsedCvServiceObj } from "./CandidateParsedCv.service";
import UlidService from "./Ulid.service";
import { interviewServiceObj } from "./UserInterview.service";
import { agencyUserSubmissionServiceObj } from "./AgencyUserSubmission.service";
import { userSkillServiceObj } from "./UserSkill.service";
import { userPreferenceServiceObj } from "./UserPreference.service";

// import types
import { JobApplicationStatusTrackerType, JobApplicationStatusType, JobApplicationUserType, JobApplicationUserTypeWithAdmin, JobApplicationWithUserDetailsType } from "../types/UserJobApplication.type";
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

    // Prepare scheduler lambda arn
    const schedulerLambdaArn: string = APP_CONSTANTS.AWS_EVENT_BRIDGE_SCHEDULER_ARNS.LAMBDA_ARN.strtr({
      "{serverlessFunctionName}": APP_CONSTANTS.SERVERLESS_FUNCTION_NAMES.APP_SCHEDULER_HANDLER
    });

    // Create the scheduled job
    let scheduleJobCreated: DbScheduleJobDto =
      await ScheduleJobService.createScheduleJob(scheduleJobPayload,schedulerLambdaArn);

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

    const matchingScore: number = jobApplicationDetails.matchingScore!

    const { MIN, MAX } = APP_CONSTANTS.MATCHING_SCORES.CORPORATE_JOB_APPLICATION_MATCHING_SCORE_RANGE

    // Check if the job application has a matching score less than the minimum matching score and perform the appropriate action
    if (
      matchingScore <
      APP_CONSTANTS.MATCHING_SCORES.JOB_APPLICATION_MINIMUM_MATCHING_SCORE
    ) {
      await this.scheduleUserJobApplicationStatusUpdateToRejected(
        userJobApplicationId,
        userEmail,
        userId
      );
    } else if (matchingScore >= MIN && matchingScore <= MAX) {
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

  private async performCandProfileDatabaseActivitiesAfterJobApply(
    newJobApplication: DbUserJobApplicationDto,
    candidateDetails: DbUserDetailDto,
  ) {
    const {PK, companyId, jobId, companyName} = newJobApplication;
    const {
      number: candidateNumber, 
      id: candidateCognitoUserId,
      name: candidateName,
      noticePeriod: candidateNoticePeriod,
      isNoticePeriodNegotiable: isCandidateNoticePeriodNegotiable,
      CV: candidateCvAwsS3FileName,
      YOE: candidateYoe,
      CTC: candidateCtc,
      ECTC: candidateEctc,
      location: candidateLocation
    } = candidateDetails;
    const {phoneCountryCode, phoneNumber} = getPhoneCountryCodeAndNumber(candidateNumber);
    const applicantEmail: string = (getEmailFromPK(PK)).toLowerCase();
    const existingCorporateCandidateProfile: QuerySnapshot<DocumentData, DocumentData> = await corporateCandidateProfileServiceObj.getDuplicateCorporateCandidateProfile(
      companyId,
      applicantEmail,
      {
        number: phoneNumber,
        countryCode: phoneCountryCode
      }
    );

    const userSkillDetails: QueryResponse<DbUserSkillDto> = await userSkillServiceObj.getUserSkillsByEmail(
      applicantEmail
    );
    const userSkillDetailsData: DbUserSkillDto = userSkillDetails[0];
    const applicantCoreSkills: {
      skillName: string;
      years: number;
      timestamps?: {
          createdAt: string;
          updatedAt: string;
      } | undefined;
    }[] = userSkillDetailsData.coreSkills ?? [];
    const applicantTechnicalSkills: {
      skillName: string;
      years: number;
      timestamps?: {
          createdAt: string;
          updatedAt: string;
      } | undefined;
    }[] = userSkillDetailsData.technicalSkills ?? [];

    const userPreferenceDetails: QueryResponse<DbUserPreferenceDto> = await userPreferenceServiceObj.getUserPreferenceByEmail(
      applicantEmail
    );
    const userPreferenceDetailsData: DbUserPreferenceDto = userPreferenceDetails[0];
    const applicantPreferredLocations: string[] = userPreferenceDetailsData.userPreferredlocations || [];
    const applicantPreferredDepartments: string[] = userPreferenceDetailsData.userPreferredDepartments || [];
    const applicantPreferredIndustries: string[] = userPreferenceDetailsData.userPreferredIndustries || [];
    const applicantPreferredRoles: string[] = userPreferenceDetailsData.userPreferredRoles || [];

    const currentDate: string = dateHelperObj.getISODate();
    if(!existingCorporateCandidateProfile.empty) {
      const existingCorporateCandidateProfileData = existingCorporateCandidateProfile.docs[0].data() as DbCorporateCandidateProfileDto;
      if(existingCorporateCandidateProfileData.candidateEmail === applicantEmail) {
        let updateCorporateCandidateProfileData: Partial<DbCorporateCandidateProfileDto> = {
          updatedAt: currentDate
        };
        let updateCentralCandidateProfileData: Partial<DbCentralCandidateProfileDto> = {
          updatedAt: currentDate
        };
        let updateCandidateParsedCvData: Partial<DbCandidateParsedCvDto> = {
          updatedAt: currentDate
        };
        if(!existingCorporateCandidateProfileData.userDetailId) {
          updateCorporateCandidateProfileData.userDetailId = candidateCognitoUserId;
          updateCentralCandidateProfileData.userDetailId = candidateCognitoUserId;
          updateCandidateParsedCvData.userDetailId = candidateCognitoUserId;
        }
        if(existingCorporateCandidateProfileData.phoneNumberDetails.number !== phoneNumber || existingCorporateCandidateProfileData.phoneNumberDetails.countryCode !== phoneCountryCode) {
          const updatedPhoneNumberDetails = {
            number: phoneNumber,
            countryCode: phoneCountryCode
          };
          updateCorporateCandidateProfileData.phoneNumberDetails = updatedPhoneNumberDetails;
          updateCentralCandidateProfileData.phoneNumberDetails = updatedPhoneNumberDetails;
          updateCandidateParsedCvData.phoneNumberDetails = updatedPhoneNumberDetails;
        }

        /**
         * @todo: 
         *  1. Need to discuss about `refereeType` update after 6 months with "CTO" and "Product Manager"
         *  2. Need to discuss about comparing and updating candidate details in `CandidateParsedCv` collection with "CTO" and "Product Manager"
         */

        const updateEntityCandidateProfilePromises = [];

        if(Object.keys(updateCentralCandidateProfileData).length>1) {
          updateEntityCandidateProfilePromises.push(
            centralCandidateProfileServiceObj.updateCentralCandidateProfileById(applicantEmail, updateCentralCandidateProfileData)
          )
        }

        if(Object.keys(updateCandidateParsedCvData).length>1) {
          updateEntityCandidateProfilePromises.push(
            candidateParsedCvServiceObj.updateCandidateParsedCvWithEmbedding(existingCorporateCandidateProfileData.candidateParsedCvId, updateCandidateParsedCvData)
          )
        }
        
        if(Object.keys(updateCorporateCandidateProfileData).length>1) {
          updateEntityCandidateProfilePromises.push(
            corporateCandidateProfileServiceObj.updateCorporateCandidateProfileById(existingCorporateCandidateProfileData.id, updateCorporateCandidateProfileData)
          )
        }

        if(updateEntityCandidateProfilePromises.length) {
          await Promise.all(updateEntityCandidateProfilePromises);
        }
      } else if(existingCorporateCandidateProfileData.phoneNumberDetails.number === phoneNumber && existingCorporateCandidateProfileData.phoneNumberDetails.countryCode === phoneCountryCode) {
        global.logger.debug(`Candidate already exists with same phone number and country code [SERVICE]`, {
          existingCorporateCandidateProfileData,
          applicantEmail,
          candidateNumber,
          candidateCognitoUserId,
        });
      }
    } else {
      // Prepare Create corporate candidate profile
      const corporateCandidateProfileCreateData: DbCorporateCandidateProfileDto = {
        id: UlidService.getUlidId(),
        createdAt: currentDate,
        updatedAt: currentDate,
        companyId: companyId,
        jobId: jobId,
        candidateEmail: applicantEmail,
        refereeType: CorporateCandidateProfileDbRefereeTypeEnum.WORKO,
        phoneNumberDetails: {
          number: phoneNumber,
          countryCode: phoneCountryCode
        },
        userDetailId: candidateCognitoUserId,

        /**
         * @note We given it empty to avoid typescript error, this will be updated in below lines of code
         */
        candidateParsedCvId: "", 
      };

      // Get existing candidate data from `CentralCandidateProfile` model
      const existingCentralCandidateProfile: DbCentralCandidateProfileDto | undefined =
        await centralCandidateProfileServiceObj.getCentralCandidateProfileById(
          applicantEmail
        );

      let createOrUpdateCentralCandidateProfile: Promise<DbCentralCandidateProfileDto | undefined>;
      let createOrUpdateCandidateProfile: Promise<DbCandidateParsedCvDto | undefined> | Promise<boolean>;

      if(existingCentralCandidateProfile) {
        createOrUpdateCandidateProfile = candidateParsedCvServiceObj.updateCandidateParsedCvWithEmbedding(existingCentralCandidateProfile.latestCandidateParsedCvId, {
          updatedAt: currentDate,
          // currentCompany: ,
          // currentDesignation: ,
          totalYOE: candidateYoe,
          relevantYOE: candidateYoe,
          currentCTC: candidateCtc,
          expectedCTC: candidateEctc,
          noticePeriod: candidateNoticePeriod,
          location: candidateLocation ? candidateLocation.toLowerCase() : undefined,
          // readyToRelocate: ,
          userPreferredDepartments: applicantPreferredDepartments,
          userPreferredIndustries: applicantPreferredIndustries,
          userPreferredlocations: applicantPreferredLocations,
          userPreferredRoles: applicantPreferredRoles,
          coreSkills: applicantCoreSkills,
          technicalSkills: applicantTechnicalSkills,
          cvAwsS3ResourceType: CandidateParsedCvAwsS3ResourceTypeEnum.USER_RESUME,
          cvAwsS3BucketName: process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
          cvAwsS3FilePath: APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_RESUME.strtr({
            "{userId}": candidateCognitoUserId,
          }),
          cvAwsS3FileName: candidateCvAwsS3FileName,
          cvAwsS3FileTracker: [
            {
              actionDate: currentDate,
              resourceType: CandidateParsedCvAwsS3ResourceTypeEnum.USER_RESUME,
              bucketName: process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
              filePath: APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_RESUME.strtr({
                "{userId}": candidateCognitoUserId,
              }),
              fileName: candidateCvAwsS3FileName
            }
          ],
          isNoticePeriodNegotiable: isCandidateNoticePeriodNegotiable,
          companyId: companyId,
          jobId: jobId,
          corporateCandidateProfileId: corporateCandidateProfileCreateData.id,
          userDetailId: candidateCognitoUserId,
        });

        corporateCandidateProfileCreateData.candidateParsedCvId = existingCentralCandidateProfile.latestCandidateParsedCvId;
        
        createOrUpdateCentralCandidateProfile = centralCandidateProfileServiceObj.updateCentralCandidateProfileById(
          applicantEmail,
          {
            updatedAt: currentDate,
            candidateProfileInCompanies: [
              ...(existingCentralCandidateProfile?.candidateProfileInCompanies ?? []),
              {
                companyId: companyId,
                companyName: companyName,
                jobIds: [jobId],
              }
            ],
            corporateCandidateProfileIds: [
              ...(existingCentralCandidateProfile?.corporateCandidateProfileIds ?? []),
              corporateCandidateProfileCreateData.id
            ],
            userDetailId: candidateCognitoUserId
          }
        )
      } else {
        // Prepare Create candidate parsed CV
        const candidateParsedCvCreateData: DbCandidateParsedCvDto = {
          id: UlidService.getUlidId(),
          createdAt: currentDate,
          updatedAt: currentDate,
          name: candidateName.toLowerCase(),
          email: applicantEmail,
          phoneNumberDetails: {
            number: phoneNumber,
            countryCode: phoneCountryCode
          },
          // currentCompany: ,
          // currentDesignation: ,
          totalYOE: candidateYoe,
          relevantYOE: candidateYoe,
          currentCTC: candidateCtc,
          expectedCTC: candidateEctc,
          noticePeriod: candidateNoticePeriod,
          location: candidateLocation ? candidateLocation.toLowerCase() : undefined,
          // readyToRelocate: ,
          cvAwsS3ResourceType: CandidateParsedCvAwsS3ResourceTypeEnum.USER_RESUME,
          cvAwsS3BucketName: process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
          cvAwsS3FilePath: APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_RESUME.strtr({
            "{userId}": candidateCognitoUserId,
          }),
          cvAwsS3FileName: candidateCvAwsS3FileName,
          cvAwsS3FileTracker: [
            {
              actionDate: currentDate,
              resourceType: CandidateParsedCvAwsS3ResourceTypeEnum.USER_RESUME,
              bucketName: process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
              filePath: APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_RESUME.strtr({
                "{userId}": candidateCognitoUserId,
              }),
              fileName: candidateCvAwsS3FileName
            }
          ],
          isNoticePeriodNegotiable: isCandidateNoticePeriodNegotiable,
          companyId: companyId,
          jobId: jobId,
          userDetailId: candidateCognitoUserId,
          corporateCandidateProfileId: corporateCandidateProfileCreateData.id
        };
        corporateCandidateProfileCreateData.candidateParsedCvId = candidateParsedCvCreateData.id;
        createOrUpdateCandidateProfile = candidateParsedCvServiceObj.createCandidateParsedCvWithEmbedding(candidateParsedCvCreateData);

        let createCentralCandidateProfileData: DbCentralCandidateProfileDto = {
          id: applicantEmail,
          createdAt: currentDate,
          updatedAt: currentDate,
          candidateEmail: applicantEmail,
          phoneNumberDetails: candidateParsedCvCreateData.phoneNumberDetails,
          refereeType: CentralCandidateProfileDbRefereeTypeEnum.WORKO,
          userDetailId: candidateDetails.id,
          candidateProfileInCompanies: [
            {
              companyId: companyId,
              companyName: companyName,
              jobIds: [jobId],
            },
          ],
          corporateCandidateProfileIds: [corporateCandidateProfileCreateData.id],
          candidateParsedCvIds: [candidateParsedCvCreateData.id],
          latestCandidateParsedCvId: candidateParsedCvCreateData.id,
        };
        createOrUpdateCentralCandidateProfile = centralCandidateProfileServiceObj.createCentralCandidateProfile(createCentralCandidateProfileData);
      }

      const candidateProfileResult: [
        boolean | DbCandidateParsedCvDto | undefined, 
        DbCorporateCandidateProfileDto | undefined, 
        DbCentralCandidateProfileDto | undefined
      ] = await Promise.all([
        createOrUpdateCandidateProfile,
        corporateCandidateProfileServiceObj.createCorporateCandidateProfile(corporateCandidateProfileCreateData),
        createOrUpdateCentralCandidateProfile
      ]);

      return candidateProfileResult;
    }
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
        HttpStatusCode.CONFLICT_409
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

        const countUserReferAndEarnQueryResponse: QueryResponse<DbCountUserDto> =
          await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
            parsedReferAndEarnDetails.referrerDetails.email,
            CountUserDbEntityTypeEnum.REFER_AND_EARN
          );
        const countUserReferAndEarnData: DbCountUserDto =
          countUserReferAndEarnQueryResponse[0];

        const countGlobalReferAndEarnQueryResponse: QueryResponse<DbCountGlobalDto> =
          await countGlobalServiceObj.getCountGlobalByEntityType(
            CountGlobalDbEntityTypeEnum.REFER_AND_EARN
          );
        const countGlobalReferAndEarnData: DbCountGlobalDto =
          countGlobalReferAndEarnQueryResponse[0];

        await Promise.all([
          // Update refer and earn status
          referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
            parsedReferAndEarnDetails.id,
            getEmailFromPK(parsedReferAndEarnDetails.PK),
            referAndEarnUpdateDto
          ),
          countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
            parsedReferAndEarnDetails.referrerDetails.email,
            {
              referAndEarnJobApplicationCounts: {
                ...countUserReferAndEarnData?.referAndEarnJobApplicationCounts,
                pending: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.pending ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.pending - 1:0),
                applied: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.applied + 1:1),
              },
            },
            !!countUserReferAndEarnQueryResponse.count, // If count user already exists in ddb then `true` else `false`
          ),
          countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
            {
              referAndEarnJobApplicationCounts: {
                ...countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts,
                pending: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.pending ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.pending - 1:0),
                applied: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.applied + 1:1),
              },
            },
            !!countGlobalReferAndEarnQueryResponse.count, 
          )
        ]);
      }
    }

    // Prepare the job application SK for the job application to Pass to calculate matching score Lambda
    const jobApplicationSK: string =
      userJobApplicationDao.sortKeys.SK_JOB_APP_ID.strtr({
        "{id}": jobApplicationDetails.id,
      });

    this.sendEmailToCandidateOnNewJobApplication(
      jobApplicationDetails,
      candidateDetails,
      jobDetails.jobTitle
    );

    const countUserJobApplicationQueryResponse: QueryResponse<DbCountUserDto> = await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
      emailId,
      CountUserDbEntityTypeEnum.JOB_APPLICATION
    )
    const countUserJobApplicationData: DbCountUserDto = countUserJobApplicationQueryResponse[0];

    const countGlobalCompanyJobQueryResponse: QueryResponse<DbCountGlobalDto> = await countGlobalServiceObj.getCountGlobalByEntityType(
      CountGlobalDbEntityTypeEnum.COMPANY_JOB
    );
    const countGlobalCompanyJobData: DbCountGlobalDto = countGlobalCompanyJobQueryResponse[0]

    const countGlobalCandidateQueryResponse: QueryResponse<DbCountGlobalDto> = await countGlobalServiceObj.getCountGlobalByEntityType(
      CountGlobalDbEntityTypeEnum.CANDIDATE
    );
    const countGlobalCandidateData: DbCountGlobalDto = countGlobalCandidateQueryResponse[0]

    const countCompanyJobQueryResponse: QueryResponse<DbCountCompanyJobDto> = await countCompanyJobServiceObj.getCountCompanyJobByCompanyIdJobIdAndEntityType(
      jobDetails.companyId,
      jobDetails.id,
      CountCompanyJobDbEntityTypeEnum.JOB_APPLICATION
    );
    const countCompanyJobData: DbCountCompanyJobDto = countCompanyJobQueryResponse[0]

    const countCompanyQueryResponse: QueryResponse<DbCountCompanyDto> = await countCompanyServiceObj.getCountCompanyByCompanyIdAndEntityType(
      jobDetails.companyId,
      CountCompanyDbEntityTypeEnum.JOB_APPLICATION
    );
    const countCompanyData: DbCountCompanyDto = countCompanyQueryResponse[0]

    await Promise.all([
      countUserServiceObj.createOrUpdateCountUserForJobApplicationEntityType(
        emailId,
        {
          userJobApplicationCounts: {
            ...countUserJobApplicationData?.userJobApplicationCounts,
            total: (countUserJobApplicationData?.userJobApplicationCounts?.total ? countUserJobApplicationData.userJobApplicationCounts.total + 1 : 1),
            applied: (countUserJobApplicationData?.userJobApplicationCounts?.applied ? countUserJobApplicationData.userJobApplicationCounts.applied + 1:1),
          }
        },
        !!countUserJobApplicationQueryResponse.count, // If count user already exists in ddb then `true` else `false`
      ),
      countGlobalServiceObj.createOrUpdateCountGlobalForCompanyJobEntityType(
        {
          companyJobApplicationCounts: {
            ...countGlobalCompanyJobData?.companyJobApplicationCounts,
            total: (countGlobalCompanyJobData?.companyJobApplicationCounts?.total ? countGlobalCompanyJobData.companyJobApplicationCounts.total + 1:1),
            applied: (countGlobalCompanyJobData?.companyJobApplicationCounts?.applied ? countGlobalCompanyJobData.companyJobApplicationCounts.applied + 1:1),
          }
        },
        !!countGlobalCompanyJobQueryResponse.count, 
      ),
      countGlobalServiceObj.createOrUpdateCountGlobalForCandidateEntityType(
        {
          candidateJobApplicationCounts: {
            ...countGlobalCandidateData?.candidateJobApplicationCounts,
            total: (countGlobalCandidateData?.candidateJobApplicationCounts?.total ? countGlobalCandidateData.candidateJobApplicationCounts.total + 1:1),
            applied: (countGlobalCandidateData?.candidateJobApplicationCounts?.applied ? countGlobalCandidateData.candidateJobApplicationCounts.applied + 1:1),
          }
        },
        !!countGlobalCompanyJobQueryResponse.count, 
      ),
      countCompanyJobServiceObj.createOrUpdateCountCompanyJobForJobApplicationEntityType(
        jobDetails.companyId,
        jobDetails.id,
        {
          allJobApplicationCounts: {
            ...countCompanyJobData?.allJobApplicationCounts,
            total: (countCompanyJobData?.allJobApplicationCounts?.total ? countCompanyJobData.allJobApplicationCounts.total + 1:1),
            applied: (countCompanyJobData?.allJobApplicationCounts?.applied ? countCompanyJobData.allJobApplicationCounts.applied + 1:1),
          }
        },
        !!countCompanyJobQueryResponse.count, 
      ),
      countCompanyServiceObj.createOrUpdateCountCompanyForJobApplicationEntityType(
        jobDetails.companyId,
        {
          allJobApplicationCounts: {
            ...countCompanyData?.allJobApplicationCounts,
            total: (countCompanyData?.allJobApplicationCounts?.total ? countCompanyData.allJobApplicationCounts.total + 1:1),
            applied: (countCompanyData?.allJobApplicationCounts?.applied ? countCompanyData.allJobApplicationCounts.applied + 1:1),
          }
        },
        !!countCompanyQueryResponse.count,
      ),

      // Invoke a lambda function to calculate matching scores for this job application
      InvokeLambdaService.triggerMatchingScoreCalculation(
        emailId,
        MatchingScoreEntityEnum.JOB_APP,
        jobApplicationSK
      ),

      this.performCandProfileDatabaseActivitiesAfterJobApply(jobApplicationDetails, candidateDetails)
    ]);

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

  async prepareUserJobApplicationUpdateDtoToRejectAfterXHours(
    userJobApplicationId: string,
    userEmail: string,
    userId: string
  ): Promise<boolean> {
    // logger
    global.logger.info("Prepare User Job Application Update Dto [Service]", {
      methodName: this.prepareJobApplicationsWithUserDetails.name,
      userJobApplicationId,
      userEmail,
      userId,
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

      if (!updatedUserJobApplicationDetails.id) {
        return false;
      }

      await Promise.all([
        this.performCountUserActivitiesAfterJobApplicationUpdate(
          updatedUserJobApplicationDetails,
          userJobApplicationDetails.status
        ),

        this.performCountGlobalActivitiesAfterJobApplicationUpdate(
          updatedUserJobApplicationDetails,
          userJobApplicationDetails.status
        ),

        this.performCountCompanyJobActivitiesAfterJobApplicationUpdate(
          updatedUserJobApplicationDetails,
          userJobApplicationDetails.status
        ),

        this.performCountCompanyActivitiesAfterJobApplicationUpdate(
          updatedUserJobApplicationDetails,
          userJobApplicationDetails.status
        )
      ]);

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

          const countUserReferAndEarnQueryResponse: QueryResponse<DbCountUserDto> =
            await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
              updatedReferAndEarnDetails.referrerDetails.email,
              CountUserDbEntityTypeEnum.REFER_AND_EARN
            );
          const countUserReferAndEarnData: DbCountUserDto =
            countUserReferAndEarnQueryResponse[0];

          const countGlobalReferAndEarnQueryResponse: QueryResponse<DbCountGlobalDto> =
            await countGlobalServiceObj.getCountGlobalByEntityType(
              CountGlobalDbEntityTypeEnum.REFER_AND_EARN
            );
          const countGlobalReferAndEarnData: DbCountGlobalDto =
            countGlobalReferAndEarnQueryResponse[0];

          await Promise.all([
            countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
              updatedReferAndEarnDetails.referrerDetails.email,
              {
                referAndEarnJobApplicationCounts: {
                  ...countUserReferAndEarnData?.referAndEarnJobApplicationCounts,
                  total: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.total ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.total - 1 : 0), // count except rejected
                  rejected: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.rejected ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.rejected  + 1: 1),
                  applied: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.applied - 1 : 0),
                },
              },
              !!countUserReferAndEarnQueryResponse.count, 
            ),
            countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
              {
                referAndEarnJobApplicationCounts: {
                  ...countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts,
                  total: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.total ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.total - 1:0), // count except rejected
                  rejected: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.rejected ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.rejected + 1:1),
                  applied: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.applied - 1: 0),
                },
              },
              !!countGlobalReferAndEarnQueryResponse.count, 
            )
          ]);
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

  private async getApplicantDetailsForJobApplicationListing(
    applicantEmails: string[],
  ): Promise<(Partial<DbUserDetailDto> & {
    email: string;
    cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
    cvAwsS3BucketName?: string;
    cvAwsS3FilePath?: string;
  })[]>
  {
    const applicantDetailsArray: Promise<Partial<DbUserDetailDto> & {
      email: string;
      cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
    }>[] = applicantEmails.map(async (eachApplicantEmail: string) => {
      const registeredApplicantDetails: QueryResponse<DbUserDetailDto> = await userDetailServiceObj.get(
        eachApplicantEmail
      );
      if(registeredApplicantDetails.count) {
        const userDetail: DbUserDetailDto = registeredApplicantDetails[0];
        if(userDetail.isEmailVerified && userDetail.CV) {
          const registeredUser: Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} = {
            ...userDetail,
            email: eachApplicantEmail,
            cvAwsS3ResourceType: CandidateParsedCvAwsS3ResourceTypeEnum.USER_RESUME,
          }
          return registeredUser;
        } else if((!userDetail.isEmailVerified || !userDetail.CV) && userDetail.isUserCreatedInternally) {
          const centralCandidateProfileDetails: DbCentralCandidateProfileDto | undefined = await centralCandidateProfileServiceObj.getCentralCandidateProfileById(eachApplicantEmail);
          if(!centralCandidateProfileDetails) {
            const internallyCreatedUser: Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} = {
              ...userDetail,
              email: eachApplicantEmail
            };
            return internallyCreatedUser;
          } else {
            const candidateParsedCv: DbCandidateParsedCvDto | undefined = await candidateParsedCvServiceObj.getCandidateParsedCvById(
              centralCandidateProfileDetails.latestCandidateParsedCvId
            );
            if(!candidateParsedCv) {
              const internallyCreatedUser: Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} = {
                ...userDetail,
                email: eachApplicantEmail
              };
              return internallyCreatedUser;
            } else {
              const {
                name: candidateName,
                currentCTC,
                expectedCTC,
                location: candidateLocation,
                noticePeriod: candidateNoticePeriod,
                totalYOE: totalYearsOfExperience,
                cvAwsS3BucketName,
                cvAwsS3FilePath,
                cvAwsS3ResourceType,
                cvAwsS3FileName,
                currentCompany,
                currentDesignation
              } = candidateParsedCv;
              const internallyCreatedUser: Partial<DbUserDetailDto> & {
                cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum, 
                cvAwsS3BucketName?: string,
                cvAwsS3FilePath?: string,
                email: string,
              } = {
                id: userDetail.id,
                name: candidateName,
                email: eachApplicantEmail,
                CTC: currentCTC,
                ECTC: expectedCTC,
                YOE: totalYearsOfExperience,
                location: candidateLocation,
                noticePeriod: candidateNoticePeriod,
                cvAwsS3ResourceType,
                cvAwsS3BucketName,
                cvAwsS3FilePath,
                CV: cvAwsS3FileName,
                multipleCandidateExperience: [
                  {
                    designation: currentDesignation ?? "",
                    department: "",
                    endDate: "",
                    companyName: currentCompany ?? "",
                  }
                ]
              };
              return internallyCreatedUser;
            }
          }
        } else {
          const internallyCreatedUser: Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} = {
            ...userDetail,
            email: eachApplicantEmail
          };
          return internallyCreatedUser;
        }
      } else {
        const notFoundUser: Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} = {
          email: eachApplicantEmail
        };
        return notFoundUser;
      }
    });

    // Return the user details
    return Promise.all(applicantDetailsArray);
  }

  async prepareJobApplicationsWithUserDetails(
    jobApplicationsArray: (DbUserJobApplicationDto & {
      jobUrl: string | undefined;
      jobTitle: string | undefined;
      jdExtracted: string | undefined;
    })[],
    includeInterviewDetails: boolean = false
  ): Promise<JobApplicationWithUserDetailsType[]> {
    // logger
    global.logger.info("Prepare job applications with user details [Service]", {
      filePath: __filename,
      methodName: this.prepareJobApplicationsWithUserDetails.name,
      includeInterviewDetails,
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
    const userDetailsArray: (Partial<DbUserDetailDto> & {
      email: string;
      cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
      cvAwsS3BucketName?: string;
      cvAwsS3FilePath?: string;
    })[] = await this.getApplicantDetailsForJobApplicationListing(
      uniqueUserEmailIds
    );

    // Covert user details to map for easy access
    const userDetailsMap: Map<string, Partial<DbUserDetailDto> & {
      email: string;
      cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
    }> = new Map<string, Partial<DbUserDetailDto> & {email: string, cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum} >(
      userDetailsArray.map(
        (
          eachUserDetail: Partial<DbUserDetailDto> & {
            email: string;
            cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
          }
        ) => [eachUserDetail.email, eachUserDetail]
      )
    );

    // Fetch interview details if flag is enabled
    let interviewMap: Map<string, DbInterviewDto[]> = new Map();
    if (includeInterviewDetails) {
      interviewMap = await interviewServiceObj.getUserInterviewsByEmailIds(
        uniqueUserEmailIds
      );
    }

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
            const userEmail: string = eachJobApplication.PK.split("#")[2];
            const userDetails: (Partial<DbUserDetailDto> & {
              email: string;
              cvAwsS3ResourceType?: CandidateParsedCvAwsS3ResourceTypeEnum;
            }) | undefined = userDetailsMap.get(userEmail);

            // if user details not found, return job application without applicant details
            if (!userDetails) {
              return {
                ...eachJobApplication,
                applicantDetails: undefined,
              };
            }

            // Get interview details if flag is enabled
            const interviewDetails: DbInterviewDto[] | undefined =
              includeInterviewDetails ? interviewMap.get(userEmail) : undefined;
            
            const jobAppliactionDetailWithUserDetail: JobApplicationWithUserDetailsType =
              {
                ...eachJobApplication,
                applicantDetails: {
                  ...userDetails,
                  ...(includeInterviewDetails && {
                    interviewDetails: interviewDetails || [],
                  }),
                },
              };

            return jobAppliactionDetailWithUserDetail;
          }
        )
      );

    return jobApplicationsWithUserDetails;
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
   * Optionally, if `includeInterviewDetails` is set to true, it will also fetch and attach
   * interview details for each applicant.
   *
   * @param {DbUserJobApplicationDto & { jobUrl: string | undefined; jobTitle: string | undefined; jdExtracted: string | undefined; }[]} jobApplicationsArray - An array of job applications.
   * @param {boolean} includeInterviewDetails - Flag to include interview details. Default: false.
   * @returns {Promise<JobApplicationWithUserDetailsType[]>} A promise that resolves to an array of job applications with user details.
   */
  /*
  async prepareJobApplicationsWithUserDetails(
    jobApplicationsArray: (DbUserJobApplicationDto & {
      jobUrl: string | undefined;
      jobTitle: string | undefined;
      jdExtracted: string | undefined;
    })[],
    includeInterviewDetails: boolean = false
  ): Promise<JobApplicationWithUserDetailsType[]> {
    // logger
    global.logger.info("Prepare job applications with user details [Service]", {
      filePath: __filename,
      methodName: this.prepareJobApplicationsWithUserDetails.name,
      includeInterviewDetails,
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
    const userDetailsArray: (DbUserDetailDto | DbCandidateParsedCvDto | {
      onlyApplicantEmail: string;
    })[] = await this.getApplicantDetailsForJobApplicationListing(
      uniqueUserEmailIds
    );

    // Covert user details to map for easy access
    const userDetailsMap = new Map<string, DbUserDetailDto | DbCandidateParsedCvDto | { onlyApplicantEmail: string }>(
      userDetailsArray.map(
        (
          eachUserDetail: DbUserDetailDto | DbCandidateParsedCvDto | { onlyApplicantEmail: string }
        ) => {
          if ("PK" in eachUserDetail) {
            return [eachUserDetail.PK.split("#")[2], eachUserDetail];
          } else if ("email" in eachUserDetail) {
            return [eachUserDetail.email, eachUserDetail];
          } else {
            return [eachUserDetail.onlyApplicantEmail, eachUserDetail];
          }
        }
      )
    );

    // Fetch interview details if flag is enabled
    let interviewMap: Map<string, DbInterviewDto[]> = new Map();
    if (includeInterviewDetails) {
      interviewMap = await interviewServiceObj.getUserInterviewsByEmailIds(
        uniqueUserEmailIds
      );
    }

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
            const userEmail: string = eachJobApplication.PK.split("#")[2];
            const userDetails: DbUserDetailDto | DbCandidateParsedCvDto | { onlyApplicantEmail: string;} | undefined =
              userDetailsMap.get(userEmail);

            // if user details not found, return job application without applicant details
            if (!userDetails) {
              return {
                ...eachJobApplication,
                applicantDetails: undefined,
              };
            }

            // Get interview details if flag is enabled
            const interviewDetails: DbInterviewDto[] | undefined =
              includeInterviewDetails ? interviewMap.get(userEmail) : undefined;
            
            let registered: Partial<DbUserDetailDto> | undefined;
            let unregistered: DbCandidateParsedCvDto | { onlyApplicantEmail: string } = { onlyApplicantEmail: userEmail };
            if("PK" in userDetails) {
              registered = userDetails;
            } else {
              unregistered = userDetails;
            }

            const jobAppliactionDetailWithUserDetail: JobApplicationWithUserDetailsType =
              {
                ...eachJobApplication,
                applicantDetails: {
                  registered,
                  unregistered,
                  ...(includeInterviewDetails && {
                    interviewDetails: interviewDetails || [],
                  }),
                },
              };

            return jobAppliactionDetailWithUserDetail;
          }
        )
      );

    return jobApplicationsWithUserDetails;
  }
  */

  /*
  async prepareJobApplicationsWithUserDetails(
    jobApplicationsArray: (DbUserJobApplicationDto & {
      jobUrl: string | undefined;
      jobTitle: string | undefined;
      jdExtracted: string | undefined;
    })[],
    includeInterviewDetails: boolean = false
  ): Promise<JobApplicationWithUserDetailsType[]> {
    // logger
    global.logger.info("Prepare job applications with user details [Service]", {
      filePath: __filename,
      methodName: this.prepareJobApplicationsWithUserDetails.name,
      includeInterviewDetails,
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

    // Fetch interview details if flag is enabled
    let interviewMap: Map<string, DbInterviewDto[]> = new Map();
    if (includeInterviewDetails) {
      interviewMap = await interviewServiceObj.getUserInterviewsByEmailIds(
        uniqueUserEmailIds
      );
    }

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
            const userEmail: string = eachJobApplication.PK.split("#")[2];
            const userDetails: UserDetailProfileInfoType | undefined =
              userDetailsMap.get(userEmail);

            // if user details not found, return job application without applicant details
            if (!userDetails) {
              return {
                ...eachJobApplication,
                applicantDetails: undefined,
              };
            }

            // Get interview details if flag is enabled
            const interviewDetails: DbInterviewDto[] | undefined =
              includeInterviewDetails ? interviewMap.get(userEmail) : undefined;

            const jobAppliactionDetailWithUserDetail: JobApplicationWithUserDetailsType =
              {
                ...eachJobApplication,
                applicantDetails: {
                  ...userDetails.userDetails,
                  profileImageAwsS3SignedUrl:
                    userDetails.profileImageAwsS3SignedUrl,
                  cvAwsS3SignedUrl: userDetails.cvAwsS3SignedUrl,
                  ...(includeInterviewDetails && {
                    interviewDetails: interviewDetails || [],
                  }),
                },
              };

            return jobAppliactionDetailWithUserDetail;
          }
        )
      );

    return jobApplicationsWithUserDetails;
  }
  */

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
      jobCreatedByUserId: string | undefined;
      jobCreatedByCorporateUserId: string | undefined;
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

    // Prepare job applications with optional interview details
    const jobApplicationsWithUserDetails: JobApplicationWithUserDetailsType[] =
      await this.prepareJobApplicationsWithUserDetails(
        userJobApplicationArrayWithCompanyJobDetails,
        jobApplicationRequestBody.includeInterviewDetails || false
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
            guidanceUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_GUIDANCE_URL,
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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
            guidanceUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_GUIDANCE_URL,
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          };

        // Send email to the corporate user
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE,
          toAddress,
          rejectedEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.DOCUMENT_REQUESTED: {
        global.logger.debug(`Sending Document requested email to candidate`, { 
          updateStatus: updatedJobApplication.status,
        });
        // Construct the email placeholders object
        const documentRequestedEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE =
          {
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
            candidateName: applicantNameToTitleCase,
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            companyName: updatedJobApplication.companyName.toTitleCase(),
            uploadDocumentsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
          };

        // Send email to the candidate 
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE,
          toAddress,
          documentRequestedEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUESTED: {
        const documentAdditionalRequestedEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE = {
          ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          candidateName: applicantNameToTitleCase,
          jobTitle: companyJobDetails.jobTitle.toTitleCase(),
          companyName: updatedJobApplication.companyName.toTitleCase(),
          uploadDocumentsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
        };

        // Send email to the candidate 
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE,
          toAddress,
          documentAdditionalRequestedEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.DOCUMENT_REVISION_REQUESTED: {
        const documentRevisionRequestedEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE = {
          ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          candidateName: applicantNameToTitleCase,
          jobTitle: companyJobDetails.jobTitle.toTitleCase(),
          companyName: updatedJobApplication.companyName.toTitleCase(),
          uploadDocumentsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
        };
        
        // Send email to the candidate
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE,
          toAddress,
          documentRevisionRequestedEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.OFFER_SENT: {
        
        // Construct the email placeholders object
        const offerSentEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE =
          {
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
            candidateName: applicantNameToTitleCase,
            jobTitle: companyJobDetails.jobTitle.toTitleCase(),
            companyName: updatedJobApplication.companyName.toTitleCase(),
            viewOfferUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
          };

        // Send email to the candidate 
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE,
          toAddress,
          offerSentEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.REVISED_OFFER_SENT: {
        const revisedOfferSentEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_REVISED_OFFER_SENT = {
          ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          candidateName: applicantNameToTitleCase,
          jobTitle: companyJobDetails.jobTitle.toTitleCase(),
          companyName: updatedJobApplication.companyName.toTitleCase(),
          viewOfferUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
        };
        
        // Send email to the candidate 
        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_APPLICATION_REVISED_OFFER_SENT,
          toAddress,
          revisedOfferSentEmailPlaceholders
        );
        break;
      }

      case JobApplicationStatus.JOINED: {
        const {joiningDateDetails} = updatedJobApplication;

        if(!joiningDateDetails || !joiningDateDetails.length) {
          throw new BaseError("Joining date details should not be empty when status is JOINED", HttpStatusCode.BAD_REQUEST_400);
        }

        if (joiningDateDetails[0].actionByUserType !== UserType.CAND) {
          // Construct the email placeholders object
          const joinedEmailPlaceholders: EmailTemplatePlaceholderCAND_JOB_APPLICATION_JOINED_STATUS_UPDATE =
            {
              ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
              candidateName: applicantNameToTitleCase,
              jobTitle: companyJobDetails.jobTitle.toTitleCase(),
              companyName: updatedJobApplication.companyName.toTitleCase(),
              joiningDate: dateHelperObj.formatDateToDayMonthYear(joiningDateDetails[0].joiningDate),
            };

          // Send email to the candidate 
          await emailLibrary.sendEmail(
            EmailTemplateEnum.CAND_JOB_APPLICATION_JOINED_STATUS_UPDATE,
            toAddress,
            joinedEmailPlaceholders
          );
        }
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
      [JobApplicationStatus.ACCEPTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.ACCEPTED,
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
      [JobApplicationStatus.JOINED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.JOINED,
      [JobApplicationStatus.ON_HOLD]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.ON_HOLD,
      [JobApplicationStatus.HIRING_IN_PROCESS]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.HIRING_IN_PROCESS,
      [JobApplicationStatus.DOCUMENT_REQUESTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_REQUESTED,
      [JobApplicationStatus.DOCUMENT_SUBMITTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_SUBMITTED,
      [JobApplicationStatus.DOCUMENT_REVISION_REQUESTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_REVISION_REQUESTED,
      [JobApplicationStatus.DOCUMENT_REVISION_REQUEST_SUBMITTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_REVISION_REQUEST_SUBMITTED,
      [JobApplicationStatus.DOCUMENT_VERIFIED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_VERIFIED,
      [JobApplicationStatus.OFFER_SENT]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.OFFER_SENT,
      [JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUESTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_ADDITIONAL_REQUESTED,
      [JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED,
      [JobApplicationStatus.REVISED_OFFER_SENT]:
        APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.REVISED_OFFER_SENT,
      [JobApplicationStatus.OFFER_ISSUE_RAISED]: APP_CONSTANTS.JOB_APPLICATION_READABLE_STATUS.OFFER_ISSUE_RAISED,
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
        companyJobApplicantsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CORPORATE_COMPANY_JOB_APPLICANTS_URL.strtr({
          "{jobId}": updatedJobApplication.jobId,
        }),
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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

  private async performReferAndEarnActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    currentActionDateTime: string
  ): Promise<void> {
    if (
      [
        JobApplicationStatus.REJECTED,
        JobApplicationStatus.PROCESSING_INTERVIEW,
        JobApplicationStatus.HIRED,
        JobApplicationStatus.JOINED,
      ].includes(updatedJobApplication.status)
    ) {
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

          const { referrerDetails } = parsedReferAndEarnDetails;
          const { email: referrerEmail } = referrerDetails;

          const countUserReferAndEarnQueryResponse: QueryResponse<DbCountUserDto> =
            await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
              referrerEmail,
              CountUserDbEntityTypeEnum.REFER_AND_EARN
            );
          const countUserReferAndEarnData: DbCountUserDto =
            countUserReferAndEarnQueryResponse[0];

          const countGlobalReferAndEarnQueryResponse: QueryResponse<DbCountGlobalDto> = await countGlobalServiceObj.getCountGlobalByEntityType(
            CountGlobalDbEntityTypeEnum.REFER_AND_EARN
          );
          const countGlobalReferAndEarnData: DbCountGlobalDto =
            countGlobalReferAndEarnQueryResponse[0];

          const { referAndEarnJobApplicationCounts: countUserReferAndEarnJobApplicationCounts } = countUserReferAndEarnData || {};
          const totalUserReferAndEarnJobApplicationCount: number | undefined = countUserReferAndEarnJobApplicationCounts?.total;
          const appliedUserReferAndEarnJobApplicationCount: number | undefined = countUserReferAndEarnJobApplicationCounts?.applied;
          const hiredUserReferAndEarnJobApplicationCount: number | undefined = countUserReferAndEarnJobApplicationCounts?.hired;
          const rejectedUserReferAndEarnJobApplicationCount: number | undefined = countUserReferAndEarnJobApplicationCounts?.rejected;

          const { referAndEarnJobApplicationCounts: countGlobalReferAndEarnJobApplicationCounts } = countGlobalReferAndEarnData || {};
          const totalGlobalReferAndEarnJobApplicationCount: number | undefined = countGlobalReferAndEarnJobApplicationCounts?.total;
          const appliedGlobalReferAndEarnJobApplicationCount: number | undefined = countGlobalReferAndEarnJobApplicationCounts?.applied;
          const hiredGlobalReferAndEarnJobApplicationCount: number | undefined = countGlobalReferAndEarnJobApplicationCounts?.hired;
          const rejectedGlobalReferAndEarnJobApplicationCount: number | undefined = countGlobalReferAndEarnJobApplicationCounts?.rejected;

          let referAndEarnUpdateDto: Partial<UpdateReferAndEarnInternalDto>;

          /**
           * @todo: Optimize the Readability
           */
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
              jobApplicationStatus:
                ReferAndEarnJobApplicationStatusEnum.REJECTED,
            };

            await Promise.all([
              // Update refer and earn status
              referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
                parsedReferAndEarnDetails.id,
                getEmailFromPK(parsedReferAndEarnDetails.PK),
                referAndEarnUpdateDto
              ),

              countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
                referrerEmail,
                {
                  referAndEarnJobApplicationCounts: {
                    ...countUserReferAndEarnJobApplicationCounts,
                    rejected: (rejectedUserReferAndEarnJobApplicationCount ? rejectedUserReferAndEarnJobApplicationCount + 1 : 1),
                    total: (totalUserReferAndEarnJobApplicationCount ? totalUserReferAndEarnJobApplicationCount - 1 : 0),

                    /**
                     * If Rejection update happened when old refer and earn job application status was `APPLIED` then decrease the `applied` count by 1,
                     * otherwise don't change the `applied` count.
                     */
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (appliedUserReferAndEarnJobApplicationCount ? appliedUserReferAndEarnJobApplicationCount - 1 : 0) : appliedUserReferAndEarnJobApplicationCount,

                    hired: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.HIRED ? (hiredUserReferAndEarnJobApplicationCount ? hiredUserReferAndEarnJobApplicationCount - 1 : 0) : hiredUserReferAndEarnJobApplicationCount,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),

              countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
                {
                  referAndEarnJobApplicationCounts: {
                    ...countGlobalReferAndEarnJobApplicationCounts,
                    rejected: (rejectedGlobalReferAndEarnJobApplicationCount ? rejectedGlobalReferAndEarnJobApplicationCount + 1 : 1),
                    total: (totalGlobalReferAndEarnJobApplicationCount ? totalGlobalReferAndEarnJobApplicationCount - 1 : 0),

                    /**
                     * If Rejection update happened when old refer and earn job application status was `APPLIED` then decrease the `applied` count by 1,
                     * otherwise don't change the `applied` count.
                     */
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (appliedGlobalReferAndEarnJobApplicationCount ? appliedGlobalReferAndEarnJobApplicationCount - 1 : 0) : appliedGlobalReferAndEarnJobApplicationCount,

                    hired: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.HIRED ? (hiredGlobalReferAndEarnJobApplicationCount ? hiredGlobalReferAndEarnJobApplicationCount - 1 : 0) : hiredGlobalReferAndEarnJobApplicationCount,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),
            ]);
          } else if (
            updatedJobApplication.status ===
            JobApplicationStatus.PROCESSING_INTERVIEW
          ) {
            // Prepare refer and earn update dto
            referAndEarnUpdateDto = {
              jobApplicationStatus:
                ReferAndEarnJobApplicationStatusEnum.PROCESSING_INTERVIEW,
            };

            await Promise.all([
              // Update refer and earn status
              referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
                parsedReferAndEarnDetails.id,
                getEmailFromPK(parsedReferAndEarnDetails.PK),
                referAndEarnUpdateDto
              ),

              countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
                referrerEmail,
                {
                  referAndEarnJobApplicationCounts: {
                    ...countUserReferAndEarnJobApplicationCounts,
                    applied: (appliedUserReferAndEarnJobApplicationCount ? appliedUserReferAndEarnJobApplicationCount - 1 : 0),
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),

              countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
                {
                  referAndEarnJobApplicationCounts: {
                    ...countGlobalReferAndEarnJobApplicationCounts,
                    applied: (appliedGlobalReferAndEarnJobApplicationCount ? appliedGlobalReferAndEarnJobApplicationCount - 1 : 0),
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),
            ]);
          } else if (
            updatedJobApplication.status === JobApplicationStatus.HIRED
          ) {
            // Prepare refer and earn update dto
            referAndEarnUpdateDto = {
              jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.HIRED,
            };

            await Promise.all([
              // Update refer and earn status
              referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
                parsedReferAndEarnDetails.id,
                getEmailFromPK(parsedReferAndEarnDetails.PK),
                referAndEarnUpdateDto
              ),

              countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
                referrerEmail,
                {
                  referAndEarnJobApplicationCounts: {
                    ...countUserReferAndEarnJobApplicationCounts,
                    hired: (hiredUserReferAndEarnJobApplicationCount ? hiredUserReferAndEarnJobApplicationCount + 1 : 1),
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (countUserReferAndEarnJobApplicationCounts?.applied ?? 0) - 1 : countUserReferAndEarnJobApplicationCounts?.applied,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),

              countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
                {
                  referAndEarnJobApplicationCounts: {
                    ...countGlobalReferAndEarnJobApplicationCounts,
                    hired: (countGlobalReferAndEarnJobApplicationCounts?.hired ?? 0) + 1,
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (countGlobalReferAndEarnJobApplicationCounts?.applied ?? 0) - 1 : countGlobalReferAndEarnJobApplicationCounts?.applied,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              )
            ]);
          } else if(
            updatedJobApplication.status === JobApplicationStatus.JOINED
          ) {
            // Prepare refer and earn update dto
            referAndEarnUpdateDto = {
              jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.JOINED,
              status: ReferAndEarnStatusEnum.ACHIEVED,
              statusTracker: [
                ...parsedReferAndEarnDetails.statusTracker,
                {
                  oldStatus: parsedReferAndEarnDetails.status,
                  newStatus: ReferAndEarnStatusEnum.ACHIEVED,
                  actionDate: currentActionDateTime,
                  actionByUserId: undefined,
                  description: undefined,
                },
              ],
            };

            await Promise.all([
              // Update refer and earn status
              referAndEarnServiceObj.updateReferAndEarnInternalByIdAndEmail(
                parsedReferAndEarnDetails.id,
                getEmailFromPK(parsedReferAndEarnDetails.PK),
                referAndEarnUpdateDto
              ),       

              countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
                referrerEmail,
                {
                  referAndEarnJobApplicationCounts: {
                    ...countUserReferAndEarnJobApplicationCounts,
                    hired: (hiredUserReferAndEarnJobApplicationCount ? hiredUserReferAndEarnJobApplicationCount - 1 : 0),
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (appliedUserReferAndEarnJobApplicationCount ? appliedUserReferAndEarnJobApplicationCount - 1 : 0) : appliedUserReferAndEarnJobApplicationCount,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              ),

              countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
                {
                  referAndEarnJobApplicationCounts: {
                    ...countGlobalReferAndEarnJobApplicationCounts,
                    hired: (hiredGlobalReferAndEarnJobApplicationCount ? hiredGlobalReferAndEarnJobApplicationCount - 1 : 0),
                    applied: parsedReferAndEarnDetails.jobApplicationStatus === 
                      ReferAndEarnJobApplicationStatusEnum.APPLIED ? (appliedGlobalReferAndEarnJobApplicationCount ? appliedGlobalReferAndEarnJobApplicationCount - 1 : 0) : appliedGlobalReferAndEarnJobApplicationCount,
                  },
                },
                !!countUserReferAndEarnQueryResponse.count,
              )
            ]);
          }
        }
      }
    }
  }

  private async performAgencyUserSubmissionActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    currentActionDateTime: string
  ) {
    if (
      [
        JobApplicationStatus.REJECTED,
        JobApplicationStatus.UNDER_EVALUATION,
        JobApplicationStatus.PROCESSING_INTERVIEW,
        JobApplicationStatus.HIRED,
        JobApplicationStatus.JOINED,
      ].includes(updatedJobApplication.status)
    ) {
      if (updatedJobApplication.agencyUserSubmissionId) {
        const agencyUserSubmissionDetails: DbAgencyUserSubmissionDto | undefined = await agencyUserSubmissionServiceObj.getAgencyUserSubmissionById(
          updatedJobApplication.agencyUserSubmissionId
        );
        if(agencyUserSubmissionDetails) {
          if(agencyUserSubmissionDetails.userJobApplicationId === updatedJobApplication.id) {
            await agencyUserSubmissionServiceObj.updateAgencyUserSubmissionById(
              agencyUserSubmissionDetails.id,
              {
                updatedAt: currentActionDateTime,
                jobApplicationStatus: updatedJobApplication.status as unknown as AgencyUserSubmissionDbJobApplicationStatusEnum
              }
            );
          }
        }
      }
    }
  }

  private async performCountUserActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    jobApplicationStatusBeforeUpdate: JobApplicationStatus
  ) {
    const updatedJobApplicationStatus: JobApplicationStatus = updatedJobApplication.status;
    const applicantUserEmail: string = getEmailFromPK(updatedJobApplication.PK);

    const countUserJobApplicationQueryResponse: QueryResponse<DbCountUserDto> = await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
      applicantUserEmail,
      CountUserDbEntityTypeEnum.JOB_APPLICATION
    )
    const countUserJobApplicationData: DbCountUserDto = countUserJobApplicationQueryResponse[0]

    const {userJobApplicationCounts: countUserJobApplicationCounts} = countUserJobApplicationData || {};

    const total: number | undefined = countUserJobApplicationCounts?.total;
    const applied: number | undefined = countUserJobApplicationCounts?.applied;
    const underEvaluation: number | undefined = countUserJobApplicationCounts?.underEvaluation;
    const rejected: number | undefined = countUserJobApplicationCounts?.rejected;
    const hired: number | undefined = countUserJobApplicationCounts?.hired;

    /**
     * @todo: Optimize the Readability
     */
    if (updatedJobApplicationStatus === JobApplicationStatus.REJECTED ) {
      await countUserServiceObj.createOrUpdateCountUserForJobApplicationEntityType(
        applicantUserEmail,
        {
          userJobApplicationCounts: {
            ...countUserJobApplicationCounts,
            total: (total ? total - 1 : 0),
            rejected: (rejected ? rejected + 1 : 1),

            /**
             * If previous status was under evaluation then decrease under evaluation count
             * otherwise keep it as it is
             */
            underEvaluation:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.UNDER_EVALUATION
                ? (underEvaluation ? underEvaluation - 1 : 0)
                : (underEvaluation),

            /**
             * If previous status was applied then decrease applied count
             * otherwise keep it as it is
             */
            applied:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : (applied),

            /**
             * If previous status was hired then decrease hired count
             * otherwise keep it as it is
             */
            hired:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : (hired),
          }
        },
        !!countUserJobApplicationQueryResponse.count, 
      )
    }
    else if (updatedJobApplicationStatus === JobApplicationStatus.UNDER_EVALUATION) {
      await countUserServiceObj.createOrUpdateCountUserForJobApplicationEntityType(
        applicantUserEmail,
        {
          userJobApplicationCounts: {
            ...countUserJobApplicationCounts,
            underEvaluation: (underEvaluation ? underEvaluation + 1 : 1),

            /**
             * If previous status was applied then decrease applied count
             * otherwise keep it as it is
             */
            applied:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : (applied ?? 0),
          }
        },
        !!countUserJobApplicationQueryResponse.count, 
      )        
    } 
    else if (updatedJobApplicationStatus === JobApplicationStatus.HIRED) {
      await countUserServiceObj.createOrUpdateCountUserForJobApplicationEntityType(
        applicantUserEmail,
        {
          userJobApplicationCounts: {
            ...countUserJobApplicationCounts,
            hired: (hired ? hired + 1 : 1),

            /**
             * If previous status was under evaluation then decrease under evaluation count
             * otherwise keep it as it is
             */
            underEvaluation:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.UNDER_EVALUATION
                ? (underEvaluation ? underEvaluation- 1 : 0)
                : (underEvaluation ?? 0),

            /**
             * If previous status was applied then decrease applied count
             * otherwise keep it as it is
             */
            applied:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : (applied ?? 0),
          }
        },
        !!countUserJobApplicationQueryResponse.count, 
      )        
    } else if(
      [
        JobApplicationStatus.UNDER_EVALUATION,
        JobApplicationStatus.APPLIED,
        JobApplicationStatus.HIRED
      ].includes(jobApplicationStatusBeforeUpdate)
    ) {
      await countUserServiceObj.createOrUpdateCountUserForJobApplicationEntityType(
        applicantUserEmail,
        {
          userJobApplicationCounts: {
            ...countUserJobApplicationCounts,
            /**
             * If previous status was under evaluation then decrease under evaluation count
             * otherwise keep it as it is
             */
            underEvaluation:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.UNDER_EVALUATION
                ? (underEvaluation ? underEvaluation - 1 : 0)
                : (underEvaluation ?? 0),

            /**
             * If previous status was applied then decrease applied count
             * otherwise keep it as it is
             */
            applied:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : (applied ?? 0),

            /**
             * If previous status was hired then decrease hired count
             * otherwise keep it as it is
             */
            hired:
              jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : (hired ?? 0),            
          }
        },
        !!countUserJobApplicationQueryResponse.count, 
      )  
    }
  }

  private async performCountGlobalActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    jobApplicationStatusBeforeUpdate: JobApplicationStatus
  ) {
    const updatedJobApplicationStatus: JobApplicationStatus = updatedJobApplication.status;

    const countGlobalCompanyJobQueryResponse: QueryResponse<DbCountGlobalDto> = await countGlobalServiceObj.getCountGlobalByEntityType(
      CountGlobalDbEntityTypeEnum.COMPANY_JOB
    );
    const countGlobalCompanyJobData: DbCountGlobalDto = countGlobalCompanyJobQueryResponse[0];
    const {companyJobApplicationCounts: countGlobalCompanyJobApplicationCounts} = countGlobalCompanyJobData || {};

    const totalGlobalCompanyJobApplicationCount: number | undefined = countGlobalCompanyJobApplicationCounts?.total;
    const rejectedGlobalCompanyJobApplicationCount: number | undefined = countGlobalCompanyJobApplicationCounts?.rejected;
    const appliedGlobalCompanyJobApplicationCount: number | undefined = countGlobalCompanyJobApplicationCounts?.applied;
    const hiredGlobalCompanyJobApplicationCount: number | undefined = countGlobalCompanyJobApplicationCounts?.hired;
    const processingInterviewGlobalCompanyJobApplicationCount: number | undefined = countGlobalCompanyJobApplicationCounts?.processingInterview;

    const countGlobalCandidateQueryResponse: QueryResponse<DbCountGlobalDto> = await countGlobalServiceObj.getCountGlobalByEntityType(
      CountGlobalDbEntityTypeEnum.CANDIDATE
    );
    const countGlobalCandidateData: DbCountGlobalDto = countGlobalCandidateQueryResponse[0]
    const {candidateJobApplicationCounts: countGlobalCandidateJobApplicationCounts} = countGlobalCandidateData || {};
    
    const totalGlobalCandidateJobApplicationCount: number | undefined = countGlobalCandidateJobApplicationCounts?.total;
    const rejectedGlobalCandidateJobApplicationCount: number | undefined = countGlobalCandidateJobApplicationCounts?.rejected;
    const appliedGlobalCandidateJobApplicationCount: number | undefined = countGlobalCandidateJobApplicationCounts?.applied;
    const hiredGlobalCandidateJobApplicationCount: number | undefined = countGlobalCandidateJobApplicationCounts?.hired;
    const processingInterviewGlobalCandidateJobApplicationCount: number | undefined = countGlobalCandidateJobApplicationCounts?.processingInterview;

    /**
     * @todo: Optimize the Readability
     */
    if (updatedJobApplicationStatus === JobApplicationStatus.REJECTED ) {
      await Promise.all([
        countGlobalServiceObj.createOrUpdateCountGlobalForCompanyJobEntityType(
          {
            companyJobApplicationCounts: {
              ...countGlobalCompanyJobApplicationCounts,
              total: (totalGlobalCompanyJobApplicationCount ? totalGlobalCompanyJobApplicationCount - 1 : 0),
              rejected: (rejectedGlobalCompanyJobApplicationCount ? rejectedGlobalCompanyJobApplicationCount + 1 : 1),
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCompanyJobApplicationCount ? appliedGlobalCompanyJobApplicationCount - 1 : 0)
                  : (appliedGlobalCompanyJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCompanyJobApplicationCount ? hiredGlobalCompanyJobApplicationCount - 1 : 0)
                  : (hiredGlobalCompanyJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? (processingInterviewGlobalCompanyJobApplicationCount ? processingInterviewGlobalCompanyJobApplicationCount - 1 : 0)
                  : (processingInterviewGlobalCompanyJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCompanyJobQueryResponse.count,
        ),
        countGlobalServiceObj.createOrUpdateCountGlobalForCandidateEntityType(
          {
            candidateJobApplicationCounts: {
              ...countGlobalCandidateJobApplicationCounts,
              total: (totalGlobalCandidateJobApplicationCount ? totalGlobalCandidateJobApplicationCount - 1 : 0),
              rejected: (rejectedGlobalCandidateJobApplicationCount ? rejectedGlobalCandidateJobApplicationCount + 1 : 1),
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCandidateJobApplicationCount ? appliedGlobalCandidateJobApplicationCount - 1 : 0)
                  : (appliedGlobalCandidateJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCandidateJobApplicationCount ? hiredGlobalCandidateJobApplicationCount - 1 : 0)
                  : (hiredGlobalCandidateJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? (processingInterviewGlobalCandidateJobApplicationCount ? processingInterviewGlobalCandidateJobApplicationCount - 1 : 0)
                  : (processingInterviewGlobalCandidateJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCandidateQueryResponse.count, 
        )
      ]);
    } else if (updatedJobApplicationStatus === JobApplicationStatus.PROCESSING_INTERVIEW) {
      await Promise.all([
        countGlobalServiceObj.createOrUpdateCountGlobalForCompanyJobEntityType(
          {
            companyJobApplicationCounts: {
              ...countGlobalCompanyJobApplicationCounts,
              processingInterview: (processingInterviewGlobalCompanyJobApplicationCount ? processingInterviewGlobalCompanyJobApplicationCount + 1 : 1),
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCompanyJobApplicationCount ? appliedGlobalCompanyJobApplicationCount - 1 : 0)
                  : (appliedGlobalCompanyJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCompanyJobApplicationCount ? hiredGlobalCompanyJobApplicationCount - 1 : 0)
                  : (hiredGlobalCompanyJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCompanyJobQueryResponse.count,
        ),

        countGlobalServiceObj.createOrUpdateCountGlobalForCandidateEntityType(
          {
            candidateJobApplicationCounts: {
              ...countGlobalCandidateJobApplicationCounts,
              processingInterview: (processingInterviewGlobalCandidateJobApplicationCount ? processingInterviewGlobalCandidateJobApplicationCount + 1 : 1),
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCandidateJobApplicationCount ? appliedGlobalCandidateJobApplicationCount - 1 : 0)
                  : (appliedGlobalCandidateJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCandidateJobApplicationCount ? hiredGlobalCandidateJobApplicationCount - 1 : 0)
                  : (hiredGlobalCandidateJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCandidateQueryResponse.count
        )
      ]);
    } else if (updatedJobApplication.status === JobApplicationStatus.HIRED) {
      await Promise.all([
        countGlobalServiceObj.createOrUpdateCountGlobalForCompanyJobEntityType(
          {
            companyJobApplicationCounts: {
              ...countGlobalCompanyJobApplicationCounts,
              hired: hiredGlobalCompanyJobApplicationCount ? hiredGlobalCompanyJobApplicationCount + 1 : 1,
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? appliedGlobalCompanyJobApplicationCount ? appliedGlobalCompanyJobApplicationCount - 1 : 0
                  : (appliedGlobalCompanyJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? processingInterviewGlobalCompanyJobApplicationCount ? processingInterviewGlobalCompanyJobApplicationCount - 1 : 0
                  : (processingInterviewGlobalCompanyJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCompanyJobQueryResponse.count
        ),

        countGlobalServiceObj.createOrUpdateCountGlobalForCandidateEntityType(
          {
            candidateJobApplicationCounts: {
              ...countGlobalCandidateJobApplicationCounts,
              hired: hiredGlobalCandidateJobApplicationCount ? hiredGlobalCandidateJobApplicationCount + 1 : 1,
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? appliedGlobalCandidateJobApplicationCount ? appliedGlobalCandidateJobApplicationCount - 1 : 0
                  : (appliedGlobalCandidateJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? processingInterviewGlobalCandidateJobApplicationCount ? processingInterviewGlobalCandidateJobApplicationCount - 1 : 0
                  : (processingInterviewGlobalCandidateJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCandidateQueryResponse.count
        )
      ]);
    } else if(
      [
        JobApplicationStatus.APPLIED,
        JobApplicationStatus.PROCESSING_INTERVIEW,
        JobApplicationStatus.HIRED
      ].includes(jobApplicationStatusBeforeUpdate)
    ) {
      await Promise.all([
        countGlobalServiceObj.createOrUpdateCountGlobalForCompanyJobEntityType(
          {
            companyJobApplicationCounts: {
              ...countGlobalCompanyJobApplicationCounts,
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCompanyJobApplicationCount ? appliedGlobalCompanyJobApplicationCount - 1 : 0)
                  : (appliedGlobalCompanyJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? (processingInterviewGlobalCompanyJobApplicationCount ? processingInterviewGlobalCompanyJobApplicationCount - 1 : 0)
                  : (processingInterviewGlobalCompanyJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCompanyJobApplicationCount ? hiredGlobalCompanyJobApplicationCount - 1 : 0)
                  : (hiredGlobalCompanyJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCompanyJobQueryResponse.count
        ),

        countGlobalServiceObj.createOrUpdateCountGlobalForCandidateEntityType(
          {
            candidateJobApplicationCounts: {
              ...countGlobalCandidateJobApplicationCounts,
              applied: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.APPLIED
                  ? (appliedGlobalCandidateJobApplicationCount ? appliedGlobalCandidateJobApplicationCount - 1 : 0)
                  : (appliedGlobalCandidateJobApplicationCount ?? 0),
              processingInterview: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.PROCESSING_INTERVIEW
                  ? (processingInterviewGlobalCandidateJobApplicationCount ? processingInterviewGlobalCandidateJobApplicationCount - 1 : 0)
                  : (processingInterviewGlobalCandidateJobApplicationCount ?? 0),
              hired: jobApplicationStatusBeforeUpdate ===
                JobApplicationStatus.HIRED
                  ? (hiredGlobalCandidateJobApplicationCount ? hiredGlobalCandidateJobApplicationCount - 1 : 0)
                  : (hiredGlobalCandidateJobApplicationCount ?? 0),
            }
          },
          !!countGlobalCandidateQueryResponse.count
        )
      ]);
    }
  }

  private async performCountCompanyJobActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    jobApplicationStatusBeforeUpdate: JobApplicationStatus,
  ): Promise<void> {
    const countCompanyJobQueryResponse: QueryResponse<DbCountCompanyJobDto> = await countCompanyJobServiceObj.getCountCompanyJobByCompanyIdJobIdAndEntityType(
      updatedJobApplication.companyId,
      updatedJobApplication.jobId,
      CountCompanyJobDbEntityTypeEnum.JOB_APPLICATION
    );
    const countCompanyJobData: DbCountCompanyJobDto = countCompanyJobQueryResponse[0];
    const {
      allJobApplicationCounts: countCompanyJobAllJobApplicationCounts
    } = countCompanyJobData || {};
    
    const total: number | undefined = countCompanyJobAllJobApplicationCounts?.total;
    const rejected: number | undefined = countCompanyJobAllJobApplicationCounts?.rejected;
    const applied: number | undefined = countCompanyJobAllJobApplicationCounts?.applied;
    const hired: number | undefined = countCompanyJobAllJobApplicationCounts?.hired;
    const processingInterview: number | undefined = countCompanyJobAllJobApplicationCounts?.processingInterview;
    
    /**
     * @todo Optimize the Readability
     */
    if(updatedJobApplication.status === JobApplicationStatus.REJECTED) {
      await countCompanyJobServiceObj.createOrUpdateCountCompanyJobForJobApplicationEntityType(
        updatedJobApplication.companyId,
        updatedJobApplication.jobId,
        {
          allJobApplicationCounts: {
            ...countCompanyJobAllJobApplicationCounts,
            total: (total ? total - 1 : 0),
            rejected: (rejected ? rejected + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : hired,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1 : 0)
                : processingInterview,
          }
        },
        !!countCompanyJobQueryResponse.count,
      )
    } else if (updatedJobApplication.status === JobApplicationStatus.PROCESSING_INTERVIEW) {
      await countCompanyJobServiceObj.createOrUpdateCountCompanyJobForJobApplicationEntityType(
        updatedJobApplication.companyId,
        updatedJobApplication.jobId,
        {
          allJobApplicationCounts: {
            ...countCompanyJobAllJobApplicationCounts,
            processingInterview: (processingInterview ? processingInterview + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : hired,
          }
        },
        !!countCompanyJobQueryResponse.count,
      )
    } else if (updatedJobApplication.status === JobApplicationStatus.HIRED) {
      await countCompanyJobServiceObj.createOrUpdateCountCompanyJobForJobApplicationEntityType(
        updatedJobApplication.companyId,
        updatedJobApplication.jobId,
        {
          allJobApplicationCounts: {
            ...countCompanyJobAllJobApplicationCounts,
            hired: (hired ? hired + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1 : 0)
                : processingInterview,
          }
        },
        !!countCompanyJobQueryResponse.count
      )
    } else if (
      [
        JobApplicationStatus.APPLIED,
        JobApplicationStatus.PROCESSING_INTERVIEW,
        JobApplicationStatus.HIRED
      ].includes(jobApplicationStatusBeforeUpdate)
    ) {
      await countCompanyJobServiceObj.createOrUpdateCountCompanyJobForJobApplicationEntityType(
        updatedJobApplication.companyId,
        updatedJobApplication.jobId,
        {
          allJobApplicationCounts: {
            ...countCompanyJobAllJobApplicationCounts,
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied -1 : 0)
                : applied,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1 : 0)
                : processingInterview,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : hired,
          }
        },
        !!countCompanyJobQueryResponse.count
      )
    }
  }

  private async performCountCompanyActivitiesAfterJobApplicationUpdate(
    updatedJobApplication: DbUserJobApplicationDto,
    jobApplicationStatusBeforeUpdate: JobApplicationStatus,
  ): Promise<void> {
    const countCompanyQueryResponse: QueryResponse<DbCountCompanyDto> = await countCompanyServiceObj.getCountCompanyByCompanyIdAndEntityType(
      updatedJobApplication.companyId,
      CountCompanyDbEntityTypeEnum.JOB_APPLICATION
    );
    const countCompanyData: DbCountCompanyDto = countCompanyQueryResponse[0]
    const {
      allJobApplicationCounts: countCompanyAllJobApplicationCounts
    } = countCompanyData || {};
    const total: number | undefined = countCompanyAllJobApplicationCounts?.total;
    const rejected: number | undefined = countCompanyAllJobApplicationCounts?.rejected;
    const applied: number | undefined = countCompanyAllJobApplicationCounts?.applied;
    const hired: number | undefined = countCompanyAllJobApplicationCounts?.hired;
    const processingInterview: number | undefined = countCompanyAllJobApplicationCounts?.processingInterview;

    /**
     * @todo: Optimize the Readability
     */
    if(updatedJobApplication.status === JobApplicationStatus.REJECTED) {
      await countCompanyServiceObj.createOrUpdateCountCompanyForJobApplicationEntityType(
        updatedJobApplication.companyId,
        {
          allJobApplicationCounts: {
            ...countCompanyAllJobApplicationCounts,
            total: (total ? total - 1 : 0),
            rejected: (rejected ? rejected + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : hired,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1 : 0)
                : processingInterview,
          }
        },
        !!countCompanyQueryResponse.count,
      )
    } else if (updatedJobApplication.status === JobApplicationStatus.PROCESSING_INTERVIEW) {
      await countCompanyServiceObj.createOrUpdateCountCompanyForJobApplicationEntityType(
        updatedJobApplication.companyId,
        {
          allJobApplicationCounts: {
            ...countCompanyAllJobApplicationCounts,
            processingInterview: (processingInterview ? processingInterview + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired - 1 : 0)
                : hired,
          }
        },
        !!countCompanyQueryResponse.count,
      )
    } else if (updatedJobApplication.status === JobApplicationStatus.HIRED) {
      await countCompanyServiceObj.createOrUpdateCountCompanyForJobApplicationEntityType(
        updatedJobApplication.companyId,
        {
          allJobApplicationCounts: {
            ...countCompanyAllJobApplicationCounts,
            hired: (hired ? hired + 1 : 1),
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied -1 : 0)
                : applied,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1: 0)
                : processingInterview,
          }
        },
        !!countCompanyQueryResponse.count
      )
    } else if (
      [
        JobApplicationStatus.APPLIED,
        JobApplicationStatus.PROCESSING_INTERVIEW,
        JobApplicationStatus.HIRED
      ].includes(jobApplicationStatusBeforeUpdate)
    ) {
      await countCompanyServiceObj.createOrUpdateCountCompanyForJobApplicationEntityType(
        updatedJobApplication.companyId,
        {
          allJobApplicationCounts: {
            ...countCompanyAllJobApplicationCounts,
            applied: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.APPLIED
                ? (applied ? applied - 1 : 0)
                : applied,
            processingInterview: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.PROCESSING_INTERVIEW
                ? (processingInterview ? processingInterview - 1 : 0)
                : processingInterview,
            hired: jobApplicationStatusBeforeUpdate ===
              JobApplicationStatus.HIRED
                ? (hired ? hired -1 : 0)
                : hired,
          }
        },
        !!countCompanyQueryResponse.count
      )
    }
  }

  private async performActivitiesAfterJobApplicationUpdate(
    jobApplicationStatusBeforeUpdate: JobApplicationStatus,
    updatedJobApplication: DbUserJobApplicationDto,
    currentActionDateTime: string,
    applicantName: string,
  ): Promise<void> {

    await Promise.all([
      this.performCountUserActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        jobApplicationStatusBeforeUpdate,
      ),

      this.performCountGlobalActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        jobApplicationStatusBeforeUpdate,
      ),

      this.performReferAndEarnActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        currentActionDateTime
      ),

      this.performAgencyUserSubmissionActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        currentActionDateTime,
      ),

      this.performCountCompanyJobActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        jobApplicationStatusBeforeUpdate,
      ),

      this.performCountCompanyActivitiesAfterJobApplicationUpdate(
        updatedJobApplication,
        jobApplicationStatusBeforeUpdate
      ),

      // send email to candidate
      this.sendEmailToCandidateOnJobApplicationUpdate(
        updatedJobApplication,
        applicantName
      ),

      // send email to job poster on job application update
      this.sendEmailToJobPosterOnJobApplicationUpdate(
        updatedJobApplication,
        applicantName
      )
    ]);
  }

  private prepareStatusTrackerDataForUpdate(
    existingStatus: JobApplicationStatus,
    existingStatusTracker: JobApplicationStatusTrackerType,
    newStatus: JobApplicationStatus,
    currentActionDateTime: string,
    actionByUserId: string,
    actionByUserType: JobApplicationUserType,
  ): JobApplicationStatusTrackerType {
    return [
      ...existingStatusTracker,
      {
        oldStatus: existingStatus,
        newStatus: newStatus,
        actionDate: currentActionDateTime,
        userId: actionByUserId,
        userType: actionByUserType,
      },
    ];
  }

  private throwErrorForAlreadyUpdatedJobApplicationStatus(
    newStatus: JobApplicationStatus,
    oldStatus: JobApplicationStatus,
  ): void {
    if (newStatus === oldStatus) {
      throw new BaseError(
        "Job application is already updated with this status.",
        HttpStatusCode.BAD_REQUEST_400
      );
    }
  }

  private missingRequiredDataErrorWhileUpdatingJobApplication(
    newStatus: JobApplicationStatus,
    methodName: string,
    jobApplicationId: string,
    requiredFields: string[],
  ): void {
    global.logger.error(`Missing required fields`, {
      methodName,
      newStatus,
      jobApplicationId,
      requiredFields,
    });

    throw new BaseError(
      "Missing required fields",
      HttpStatusCode.BAD_REQUEST_400
    );
  }


  async updateJobApplicationByCorpUser(
    jobApplicationId: string,
    jobApplicationRequestBody: UserJobApplicationUpdateApiDTO,
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application By Corp User [Service]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationByCorpUser.name,
      jobApplicationId,
      jobApplicationRequestBody,
    });

    const {
      status: newJobApplicationStatus,
      userId: actionByUserId,
      userType: actionByUserType,
    } = jobApplicationRequestBody;

    // Fetch job application details
    const parsedJobApplication: DbUserJobApplicationDto =
      await this.getJobApplicationById(jobApplicationId);

    // Other than CV_DOWNLOADED, DOCUMENT_ADDITIONAL_REQUESTED status, if the status is already updated, throw an error
    if(![
      JobApplicationStatus.CV_DOWNLOADED, 
      JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUESTED,
      JobApplicationStatus.DOCUMENT_REVISION_REQUESTED
    ].includes(newJobApplicationStatus)) {
      this.throwErrorForAlreadyUpdatedJobApplicationStatus(
        newJobApplicationStatus,
        parsedJobApplication.status
      );
    }

    // Fetch current date and time
    const currentActionDateTime: string = DateTime.now().toISO();

    // Prepare update data
    let updateData: UserJobApplicationInternalUpdateDto;

    const commonUpdateStatusTracker: JobApplicationStatusTrackerType = this.prepareStatusTrackerDataForUpdate(
      parsedJobApplication.status,
      parsedJobApplication.statusTracker,
      newJobApplicationStatus,
      currentActionDateTime,
      actionByUserId,
      actionByUserType,
    )

    switch (newJobApplicationStatus) {
      case JobApplicationStatus.REJECTED:
        updateData = {
          status: newJobApplicationStatus,
          rejectedByUserId: {
            userId: actionByUserId,
            userType: actionByUserType,
            actionDate: currentActionDateTime,
            reason:
              jobApplicationRequestBody.reason ?? "Reason not provided by User",
            userComment:
              jobApplicationRequestBody.userComment ??
              "Comment not provided by User",
          },
          statusTracker: commonUpdateStatusTracker,
        };

        break;

      case JobApplicationStatus.CV_DOWNLOADED:
        // If cv is already downloaded then override the action date, user id and user type
        if (
          parsedJobApplication.status === JobApplicationStatus.CV_DOWNLOADED
        ) {
          const statusTrackerDataForCvDownloaded: JobApplicationStatusTrackerType = [
            ...parsedJobApplication.statusTracker.map(
              (item) =>
                item.newStatus === JobApplicationStatus.CV_DOWNLOADED
                  ? {
                      ...item,
                      actionDate: currentActionDateTime,
                      userId: actionByUserId,
                      userType: actionByUserType,
                    } // override "actionDate", "userId" and "userType"
                  : item // keep others unchanged
            ),
          ];

          updateData = {
            status: newJobApplicationStatus,
            statusTracker: statusTrackerDataForCvDownloaded,
          };
        } else {
          updateData = {
            status: newJobApplicationStatus,
            statusTracker: commonUpdateStatusTracker,
          };
        }
        break;
    
      case JobApplicationStatus.DOCUMENT_REQUESTED:
        const {requestedDocumentNames} = jobApplicationRequestBody;

        if(!requestedDocumentNames || !requestedDocumentNames?.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByCorpUser.name,
            jobApplicationId,
            ["requestedDocumentNames"]
          );
        };

        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          requestedDocumentDetails: [
            ...(parsedJobApplication.requestedDocumentDetails ?? []),
            {
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_REQUESTED,
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              requestedDocumentNames: requestedDocumentNames!,
            },
          ],
          documentCurrentStatusMap: requestedDocumentNames!.reduce(
            (
              acc: Record<string, UserJobApplicationDocumentStatusEnum>, // The initialValue, or the previously returned value of the function.
              doc: string // The value of the current element.The value of the current element.
            ) => {
              acc[doc] = UserJobApplicationDocumentStatusEnum.DOCUMENT_REQUESTED;
              return acc;
            },
            {} as Record<string, UserJobApplicationDocumentStatusEnum> // initialValue
          ),
        };
        break;

      case JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUESTED:
        const {requestedDocumentNames: additionalRequestedDocumentNames} = jobApplicationRequestBody;

        if(!additionalRequestedDocumentNames || !additionalRequestedDocumentNames?.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByCorpUser.name,
            jobApplicationId,
            ["requestedDocumentNames"]
          );
        };

        const existingDocuments: string[] = Object.keys(
          parsedJobApplication.documentCurrentStatusMap || {}
        );
        const newDocuments: string[] = additionalRequestedDocumentNames!.filter((doc: string) => !existingDocuments.includes(doc));

        if(!newDocuments?.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByCorpUser.name,
            jobApplicationId,
            ["requestedDocumentNames"]
          );
        };
        
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          requestedDocumentDetails: [
            ...(parsedJobApplication.requestedDocumentDetails || []),
            {
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_ADDITIONAL_REQUESTED,
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              requestedDocumentNames: newDocuments,
            },
          ],
          documentCurrentStatusMap: {
            ...(parsedJobApplication.documentCurrentStatusMap || {}),
            ...newDocuments.reduce(
              (acc: Record<string, UserJobApplicationDocumentStatusEnum>, doc: string) => {
                acc[doc] = UserJobApplicationDocumentStatusEnum.DOCUMENT_ADDITIONAL_REQUESTED;
                return acc;
              },
              {} as Record<string, UserJobApplicationDocumentStatusEnum>
            ),
          },
        };
        break;

      case JobApplicationStatus.DOCUMENT_REVISION_REQUESTED:
        const { requestedDocumentNames: reRequestedDocuments } =
          jobApplicationRequestBody;

        if (!reRequestedDocuments || !reRequestedDocuments?.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByCorpUser.name,
            jobApplicationId,
            ["requestedDocumentNames"]
          );
        };

        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          requestedDocumentDetails: [
            ...(parsedJobApplication.requestedDocumentDetails || []),
            {
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_REVISION_REQUESTED,
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              requestedDocumentNames: reRequestedDocuments!,
            },
          ],
          documentCurrentStatusMap: {
            ...(parsedJobApplication.documentCurrentStatusMap || {}),
            ...reRequestedDocuments!.reduce((acc: Record<string, UserJobApplicationDocumentStatusEnum>, doc: string) => {
              acc[doc] = UserJobApplicationDocumentStatusEnum.DOCUMENT_REVISION_REQUESTED;
              return acc;
            }, {} as Record<string, UserJobApplicationDocumentStatusEnum>)
          }
        };
        break;

      case JobApplicationStatus.DOCUMENT_VERIFIED:
        const existingDocumentCurrentMapping: Record<string, UserJobApplicationDocumentStatusEnum> | undefined = parsedJobApplication.documentCurrentStatusMap;

        if(!existingDocumentCurrentMapping) {
          throw new BaseError(
            `You should have requested at least one document before making it verified.`,
            HttpStatusCode.FORBIDDEN_403,
          )
        }

        // Check if all documents are in submitted status
        const submittedStatuses = [
          UserJobApplicationDocumentStatusEnum.DOCUMENT_SUBMITTED,
          UserJobApplicationDocumentStatusEnum.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED,
          UserJobApplicationDocumentStatusEnum.DOCUMENT_REVISION_REQUEST_SUBMITTED
        ];
        
        // Check if all documents are in submitted status
        const allDocumentsSubmitted: boolean = Object.values(existingDocumentCurrentMapping).every(
          status => submittedStatuses.includes(status)
        );

        if (!allDocumentsSubmitted) {
          throw new BaseError(
            `You can only make document verified only when all the documents are submitted by the applicant.`,
            HttpStatusCode.FORBIDDEN_403,
          )
        }

        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
        };
        break;
      
      case JobApplicationStatus.OFFER_SENT: 
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          offerLetterDetails: [
            ...(parsedJobApplication.offerLetterDetails || []),
            {
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              joiningDate: jobApplicationRequestBody.offerLetterJoiningDate,
              cloudFileName:
                jobApplicationRequestBody.offerLetterCloudFileName,
              remarks: jobApplicationRequestBody.offerLetterRemarks,
            },
          ],
        };
        break;
      
      case JobApplicationStatus.REVISED_OFFER_SENT: 
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          offerLetterDetails: [
            ...(parsedJobApplication.offerLetterDetails || []),
            {
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              cloudFileName:
                jobApplicationRequestBody.offerLetterCloudFileName,
              remarks: jobApplicationRequestBody.offerLetterRemarks,
              joiningDate: jobApplicationRequestBody.offerLetterJoiningDate,
            },
          ],
        };
        break;

      case JobApplicationStatus.JOINED:
        const {status: existingJobApplicationStatus, joiningDateDetails} = parsedJobApplication
        if (existingJobApplicationStatus === JobApplicationStatus.JOINED && joiningDateDetails) {
          throw new BaseError(
            "Already submitted joined date details",
            HttpStatusCode.BAD_REQUEST_400,
          )
        }

        const {joiningDate} = jobApplicationRequestBody

        if (!joiningDate) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByCorpUser.name,
            jobApplicationId,
            ["joiningDate"]
          );
        };

        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          joiningDateDetails: [
            {
              joiningDate: joiningDate!,
              actionByUserId: actionByUserId,
              actionByUserType: actionByUserType,
              actionDate: currentActionDateTime,
            },
          ],
        };
        break;

      default:
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
        };
        break;
    }

    // Update job application by corp user
    let updatedJobApplication: DbUserJobApplicationDto =
      await userJobApplicationDao.updateJobApplicationStatus(
        parsedJobApplication.PK,
        parsedJobApplication.SK,
        updateData
      );

    if (updatedJobApplication?.id) {
      await this.performActivitiesAfterJobApplicationUpdate(
        parsedJobApplication.status, // Job application status before update
        updatedJobApplication,
        currentActionDateTime,
        jobApplicationRequestBody.applicantName,
      );
    }

    return updatedJobApplication;
  }

  async updateJobApplicationByApplicant(
    jobApplicationId: string,
    jobApplicationRequestBody: UserJobApplicationApplicantUpdateApiDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application By Applicant [Service]`, {
      methodName: this.updateJobApplicationByApplicant.name,
      jobApplicationId,
    });

    const {
      status: newJobApplicationStatus,
      userId: actionByUserId,
      userType: actionByUserType,
    } = jobApplicationRequestBody;

    // Fetch job application details
    const parsedJobApplication: DbUserJobApplicationDto =
      await this.getJobApplicationById(jobApplicationId);

    const cognitoUserId: string = global.requestLocalContext.userId;

    // Parse the user details
    const userDetails: DbUserDetailDto = await userDetailServiceObj.getUserByIdOne(
      cognitoUserId
    );

    // If the user is not a candidate, throw an error
    if(parsedJobApplication.PK !== userDetails.PK || !userDetails.userType.includes(UserType.CAND)) {
      throw new BaseError(`Only candidate can update this type of job application.`, HttpStatusCode.FORBIDDEN_403);
    }

    this.throwErrorForAlreadyUpdatedJobApplicationStatus(
      newJobApplicationStatus,
      parsedJobApplication.status,
    )

    // Fetch refer and earn details
    const currentActionDateTime: string = DateTime.now().toISO();

    const commonUpdateStatusTracker: JobApplicationStatusTrackerType = this.prepareStatusTrackerDataForUpdate(
      parsedJobApplication.status,
      parsedJobApplication.statusTracker,
      newJobApplicationStatus,
      currentActionDateTime,
      actionByUserId,
      actionByUserType,
    )

    let updateData: Partial<UserJobApplicationCommonUpdateDto>;

    switch (newJobApplicationStatus) {
      case JobApplicationStatus.DOCUMENT_SUBMITTED:
        const { documentMapping } = jobApplicationRequestBody

        if (!documentMapping || !documentMapping.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByApplicant.name,
            jobApplicationId,
            ["documentMapping"]
          );
        };
        
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          responseDocumentDetails: [ 
            ...(parsedJobApplication.responseDocumentDetails ?? []),
            {
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_SUBMITTED,
              documentMapping: documentMapping!,
            },
          ],
          documentCurrentStatusMap: documentMapping!.reduce((acc: Record<string, UserJobApplicationDocumentStatusEnum>, doc: UserJobApplicationDocumentMappingDto) => {
            acc[doc.documentName] = UserJobApplicationDocumentStatusEnum.DOCUMENT_SUBMITTED
            return acc
          }, {} as Record<string, UserJobApplicationDocumentStatusEnum>),
          documentCurrentMapping: documentMapping!.reduce((acc: Record<string, string>, doc: UserJobApplicationDocumentMappingDto) => {
            acc[doc.documentName] = doc.cloudFileName
            return acc
          }, {} as Record<string, string>)
        };
        break;
        
      case JobApplicationStatus.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED:
        const {documentMapping: additionalDocumentMapping} = jobApplicationRequestBody;

        if (!additionalDocumentMapping || !additionalDocumentMapping.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByApplicant.name,
            jobApplicationId,
            ["documentMapping"]
          );
        }
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          responseDocumentDetails: [
            ...(parsedJobApplication.responseDocumentDetails || []),
            {
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED,
              documentMapping: additionalDocumentMapping!,
            },
          ],
          documentCurrentStatusMap: {
            ...(parsedJobApplication.documentCurrentStatusMap || {}),
            ...additionalDocumentMapping!.reduce((acc: Record<string, UserJobApplicationDocumentStatusEnum>, doc: UserJobApplicationDocumentMappingDto) => {
              acc[doc.documentName] = UserJobApplicationDocumentStatusEnum.DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED;
              return acc;
            }, {} as Record<string, UserJobApplicationDocumentStatusEnum>)
          },
          documentCurrentMapping: {
            ...(parsedJobApplication.documentCurrentMapping || {}),
            ...additionalDocumentMapping!.reduce((acc: Record<string, string>, doc: UserJobApplicationDocumentMappingDto) => {
              acc[doc.documentName] = doc.cloudFileName;
              return acc;
            }, {} as Record<string, string>)
          }
        };
        break;

      case JobApplicationStatus.DOCUMENT_REVISION_REQUEST_SUBMITTED:
        const { documentMapping: revisionDocumentMapping } = jobApplicationRequestBody;

        if (!revisionDocumentMapping || !revisionDocumentMapping.length) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByApplicant.name,
            jobApplicationId,
            ["documentMapping"]
          );
        }
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          responseDocumentDetails: [
            ...(parsedJobApplication.responseDocumentDetails || []),
            {
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              documentStatus: UserJobApplicationDocumentStatusEnum.DOCUMENT_REVISION_REQUEST_SUBMITTED,
              documentMapping: revisionDocumentMapping!,
            },
          ],
          documentCurrentStatusMap: {
            ...(parsedJobApplication.documentCurrentStatusMap || {}),
            ...revisionDocumentMapping!.reduce((acc: Record<string, UserJobApplicationDocumentStatusEnum>, doc: UserJobApplicationDocumentMappingDto) => {
              acc[doc.documentName] = UserJobApplicationDocumentStatusEnum.DOCUMENT_REVISION_REQUEST_SUBMITTED;
              return acc;
            }, {} as Record<string, UserJobApplicationDocumentStatusEnum>)
          },
          documentCurrentMapping: {
            ...(parsedJobApplication.documentCurrentMapping || {}),
            ...revisionDocumentMapping!.reduce((acc: Record<string, string>, doc: UserJobApplicationDocumentMappingDto) => {
              acc[doc.documentName] = doc.cloudFileName;
              return acc;
            }, {} as Record<string, string>)
          }
        };
        break;
      
      case JobApplicationStatus.OFFER_ISSUE_RAISED:
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: commonUpdateStatusTracker,
          offerLetterIssueRaisedDetails: [
            {
              remarks: jobApplicationRequestBody?.offerLetterIssueRemarks ?? "Not Mentioned",
              userId: actionByUserId,
              userType: actionByUserType,
              actionDate: currentActionDateTime,
              cloudFileName: jobApplicationRequestBody?.offerLetterCloudFileName ?? "Not Mentioned",
            },
          ] 
        }
        break;

      case JobApplicationStatus.JOINED:
        const { status: existingJobApplicationStatus, joiningDateDetails } =
          parsedJobApplication;
        if (
          existingJobApplicationStatus === JobApplicationStatus.JOINED &&
          joiningDateDetails
        ) {
          throw new BaseError(
            "Already submitted joined date details",
            HttpStatusCode.BAD_REQUEST_400
          );
        }

        const {joiningDate} = jobApplicationRequestBody;

        if(!joiningDate) {
          this.missingRequiredDataErrorWhileUpdatingJobApplication(
            newJobApplicationStatus,
            this.updateJobApplicationByApplicant.name,
            jobApplicationId,
            ["joiningDate"]
          );
        }

        updateData = {
          status: newJobApplicationStatus,
          statusTracker: [
            ...parsedJobApplication.statusTracker,
            {
              oldStatus: parsedJobApplication.status,
              newStatus: newJobApplicationStatus,
              actionDate: currentActionDateTime,
              userId: actionByUserId,
              userType: actionByUserType,
            },
          ],
          joiningDateDetails: [
            {
              joiningDate: joiningDate!,
              hrName: jobApplicationRequestBody?.joiningHrName ?? "",
              message: jobApplicationRequestBody?.joiningApplicantMessage ?? "",
              actionByUserId: actionByUserId,
              actionByUserType: actionByUserType,
              actionDate: currentActionDateTime,
            },
          ],
        };
        break;

      default:
        updateData = {
          status: newJobApplicationStatus,
          statusTracker: [
            ...parsedJobApplication.statusTracker,
            {
              oldStatus: parsedJobApplication.status,
              newStatus: newJobApplicationStatus,
              actionDate: currentActionDateTime,
              userId: actionByUserId,
              userType: actionByUserType,
            },
          ],
        };
        break;
    }

    // Update job application by corp user
    const updatedJobApplication: DbUserJobApplicationDto = await this.updateJobApplicationByIdAndPrimaryEmail(
      parsedJobApplication.id,
      parsedJobApplication.PK.split("#")[2],
      updateData
    );

    if (updatedJobApplication?.id) {
      this.performActivitiesAfterJobApplicationUpdate(
        parsedJobApplication.status,
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
          jobApplicationMetric.success.primaryIds!.push(jobApplicationId);
          
          this.performActivitiesAfterJobApplicationUpdate(
            oldStatus,
            updatedJobApplication,
            currentActionDateTime,
            applicantName,
          );
        } else {
          jobApplicationMetric.failure.count++;
          jobApplicationMetric.failure.primaryIds!.push(jobApplicationId);

          global.logger.error(
            `Failed to update jobApplicationId: ${jobApplicationId} in DynamoDB`,
            {
              updatedJobApplication,
            }
          );
        }
      } catch (error) {
        jobApplicationMetric.failure.count++;
        jobApplicationMetric.failure.primaryIds!.push(jobApplicationId);

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

  async getAllNonInitiatedHiringStatusJobApplicationsToRejectWithoutPagination(jobId: string): Promise<DbUserJobApplicationDto[]> {
    let lastKeyInternal: ObjectType | undefined = undefined;
    let pageSizeInternal = 50;
    let allUserJobApplicationsWithoutPagination: DbUserJobApplicationDto[] = [];

    // Continue fetching the data until all the data is fetched
    do {
      const filterOptions: RecordListingFilterOptions = {
        lastKey: lastKeyInternal,
        pageSize: pageSizeInternal,
      };

      const userJobApplicationsResponse: PaginatedResultsWithMatchingConditionsResponse<DbUserJobApplicationDto> =
        await userJobApplicationDao.getAllNonInitiatedHiringStatusJobApplicationsToReject(
          jobId,
          filterOptions
        );

      const {
        lastKey,
        count,
        timesQueried,
        queriedCount,
        ...userJobApplicationsData
      } = userJobApplicationsResponse;

      const userJobApplicationsArray: DbUserJobApplicationDto[] =
        Object.values(userJobApplicationsData);

      allUserJobApplicationsWithoutPagination =
        allUserJobApplicationsWithoutPagination.concat(
          userJobApplicationsArray
        );

      lastKeyInternal = lastKey ?? undefined;
    } while (lastKeyInternal);

    return allUserJobApplicationsWithoutPagination;
  }

  async updateAllNonInitiatedHiringStatusJobApplicationsToReject(jobId: string, jobTitle: string, jobClosedByUserId?: string, jobClosedByUserType?: JobApplicationUserTypeWithAdmin, shortRejectionReason?: string, detailedRejectionReason?: string) {
    const userJobApplicationsToUpdate: DbUserJobApplicationDto[] =
      await this.getAllNonInitiatedHiringStatusJobApplicationsToRejectWithoutPagination(
        jobId
      );

    userJobApplicationsToUpdate.forEach(async (userJobApplication: DbUserJobApplicationDto) => {
      const currentActionDateTime: string = dateHelperObj.getISODate();
      const updatedJobApplication: DbUserJobApplicationDto = await this.updateJobApplicationByIdAndPrimaryEmail(
        userJobApplication.id,
        userJobApplication.PK.split("#")[2],
        {
          status: JobApplicationStatus.REJECTED,
          statusTracker: [
            ...userJobApplication.statusTracker,
            {
              oldStatus: userJobApplication.status,
              newStatus: JobApplicationStatus.REJECTED,
              actionDate: currentActionDateTime,
              userId: jobClosedByUserId,
              userType: jobClosedByUserType,
            },
          ],
          rejectedForJobClose: {
            userId: jobClosedByUserId,
            userType: jobClosedByUserType,
            actionDate: currentActionDateTime,
            reason: shortRejectionReason,
            userComment: detailedRejectionReason
          }
        }
      );

      const candidateDetails: DbUserDetailDto = await UserDetailService.getUserDetailsByEmail(
        userJobApplication.PK.split("#")[2]
      )

      if(updatedJobApplication.status === JobApplicationStatus.REJECTED) {
        await Promise.all([
          this.performCountUserActivitiesAfterJobApplicationUpdate(
            updatedJobApplication,
            userJobApplication.status
          ),

          this.performCountGlobalActivitiesAfterJobApplicationUpdate(
            updatedJobApplication,
            userJobApplication.status
          ),

          this.performCountCompanyJobActivitiesAfterJobApplicationUpdate(
            updatedJobApplication,
            userJobApplication.status
          ),

          this.performCountCompanyActivitiesAfterJobApplicationUpdate(
            updatedJobApplication,
            userJobApplication.status
          )  
       ]);  
        
        // Check if the job application is for a refer and earn id
        if (updatedJobApplication.referAndEarnId) {
          // Retrieve refer and earn details by refer and earn id
          const referAndEarnDetails: QueryResponse<DbReferAndEarnDto> =
            await referAndEarnServiceObj.getReferAndEarnById(
              updatedJobApplication.referAndEarnId
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

            const countUserReferAndEarnQueryResponse: QueryResponse<DbCountUserDto> =
              await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
                updatedReferAndEarnDetails.referrerDetails.email,
                CountUserDbEntityTypeEnum.REFER_AND_EARN
              );
            const countUserReferAndEarnData: DbCountUserDto =
              countUserReferAndEarnQueryResponse[0];

            const countGlobalReferAndEarnQueryResponse: QueryResponse<DbCountGlobalDto> =
              await countGlobalServiceObj.getCountGlobalByEntityType(
                CountGlobalDbEntityTypeEnum.REFER_AND_EARN
              );
            const countGlobalReferAndEarnData: DbCountGlobalDto =
              countGlobalReferAndEarnQueryResponse[0];

            await Promise.all([
              countUserServiceObj.createOrUpdateCountUserForReferAndEarnEntityType(
                updatedReferAndEarnDetails.referrerDetails.email,
                {
                  referAndEarnJobApplicationCounts: {
                    ...countUserReferAndEarnData?.referAndEarnJobApplicationCounts,
                    total: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.total ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.total - 1 : 0), // count except rejected
                    rejected: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.rejected ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.rejected  + 1: 1),
                    applied: (countUserReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countUserReferAndEarnData.referAndEarnJobApplicationCounts.applied - 1 : 0),
                  },
                },
                !!countUserReferAndEarnQueryResponse.count, 
              ),
              countGlobalServiceObj.createOrUpdateCountGlobalForReferAndEarnEntityType(
                {
                  referAndEarnJobApplicationCounts: {
                    ...countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts,
                    total: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.total ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.total - 1:0), // count except rejected
                    rejected: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.rejected ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.rejected + 1:1),
                    applied: (countGlobalReferAndEarnData?.referAndEarnJobApplicationCounts?.applied ? countGlobalReferAndEarnData.referAndEarnJobApplicationCounts.applied - 1: 0),
                  },
                },
                !!countGlobalReferAndEarnQueryResponse.count, 
              ),
            ]);
          }
        }

        const toAddress: EmailSourceDestinationAddress = {
          email: updatedJobApplication.PK.split("#")[2],
          fullName: candidateDetails.name.toTitleCase(),
        };

        const emailPlaceholders: EmailTemplatePlaceholderCAND_JOB_CLOSED_UPDATE_STATUS =
          {
            candName: candidateDetails.name.toTitleCase(),
            jobTitle: jobTitle.toTitleCase(),
            companyName: updatedJobApplication.companyName,
            workoAppUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_APP_URL,
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL
          };

        await emailLibrary.sendEmail(
          EmailTemplateEnum.CAND_JOB_CLOSED_UPDATE_STATUS,
          toAddress,
          emailPlaceholders
        )
      }
    });
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

            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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
        candJobApplUrl:
          APP_CONSTANTS.FRONTEND_URLS.WORKO_CANDIDATE_JOB_APPLICATION_URL,
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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

        companyJobApplicantsUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CORPORATE_COMPANY_JOB_APPLICANTS_URL.strtr({
          "{jobId}": jobApplicationDetails.jobId,
        }),

        corporateUpdateStatusUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_CORPORATE_LOGIN,

        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
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

      const deleteResponse: DeleteScheduleCommandOutput = await awsSchedulerClientLibrary.deleteSchedule({ Name: rejectionAwsScheduleId });
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