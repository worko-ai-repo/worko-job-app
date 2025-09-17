// import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import luxon
import { DateTime } from "luxon";

// import dtos
import { UserExternalJobApplicationCreateApiDTO, UserExternalJobApplicationCreateDto } from "../dtos/UserExternalJobApplication.dto";
import { JobUpdateInternalDto } from "../dtos/Job.dto";

// Import daos
import { userExternalJobApplicationDaoObj } from "../daos/UserExternalJobApplication.dao";

// import enums
import { JobStatusEnum } from "../enums/Job.enum";
import { UserExternalJobApplicationStatusEnum } from "../enums/UserExternalJobApplication.enum";
import { UserType } from "../enums/User.enum";

// import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbUserExternalJobApplicationDto } from "../db/models/UserExternalJobApplication.model";

// import services
import { jobServiceObj } from "./Job.service";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * UserExternalJobApplicationService
 */
class UserExternalJobApplicationService {
  /**
   * createUserExternalJobApplication
   * 
   * Creates a new user external job application.
   *
   * This method first verifies if the job is published and if the user has already applied for the job.
   * If the job is not published or if the user has already applied for the job then it throws an error.
   * If the user has not already applied for the job then it updates the user matching score job status to `APPLIED`
   * if the user matching score job details are found. Otherwise, it creates a new user external job application
   * in the database.
   *
   * @param {string} userId - The id of the user applying for the job.
   * @param {string} email - The email of the user applying for the job.
   * @param {UserExternalJobApplicationCreateApiDTO} userExternalJobApplicationRequestBody - The data required to create a new user external job application.
   * @return {Promise<DbUserExternalJobApplicationDto>} A promise that resolves to the created user external job application data.
   */
  async createUserExternalJobApplication(
    userId: string,
    email: string,
    userExternalJobApplicationRequestBody: UserExternalJobApplicationCreateApiDTO
  ): Promise<DbUserExternalJobApplicationDto> {
    // logger
    global.logger.info(`Create User External Job Application [Service]`, {
      methodName: this.createUserExternalJobApplication.name,
      userId,
      email,
    });

    // Get job details by document id
    const externalJobDetailsOnAwsOpensearch: DbJobAwsOpensearchDto | undefined =
      await jobServiceObj.getJobByIdFromAwsOpensearch(
        userExternalJobApplicationRequestBody.jobId
      );

    // As the job is closed, therefore the user should not be able to apply for the job then Throw error 
    if (
      !externalJobDetailsOnAwsOpensearch ||
      externalJobDetailsOnAwsOpensearch?.status !== JobStatusEnum.PUBLISHED
    ) {
      throw new BaseError(
        `Applications for this job are currently closed.`,
        HttpStatusCode.FORBIDDEN_403
      );
    }

    // Decode job url
    let decodedJobUrl: string = decodeURIComponent(
      userExternalJobApplicationRequestBody.jobUrl
    ).trim();
    global.logger.debug(`Decoded job url [SERVICE]`, {
      methodName: this.createUserExternalJobApplication.name,
      requestBodyJobUrl: userExternalJobApplicationRequestBody.jobUrl,
      decodedJobUrl,
    });

    // Check if the user has already applied for the job and throw error if already applied for the job
    let existingJobApplication: QueryResponse<DbUserExternalJobApplicationDto> =
      await userExternalJobApplicationDaoObj.getByJobIdAndApplicantUserEmail(
        email,
        userExternalJobApplicationRequestBody.jobId
      );
    if (existingJobApplication.count) {
      throw new BaseError(
        `You have already applied for this job. Check your dashboard for reference.`,
        HttpStatusCode.FORBIDDEN_403
      );
    }

    // If `isAppliedBySomeone` is not already set then update it.
    if (!externalJobDetailsOnAwsOpensearch.isAppliedBySomeone) {
      // Prepare and update job by id
      const updatDto: Partial<JobUpdateInternalDto> = {
        isAppliedBySomeone: true,
      };

      await jobServiceObj.updateJobByIdOnAwsOpensearch(
        userExternalJobApplicationRequestBody.jobId,
        updatDto
      );
    }

    // Prepare the data required to create a new job application
    const userExternalJobApplicationDto: UserExternalJobApplicationCreateDto = {
      jobId: userExternalJobApplicationRequestBody.jobId,
      applicantUserId: userId,
      status: UserExternalJobApplicationStatusEnum.APPLIED,
      statusTracker: [
        {
          oldStatus: UserExternalJobApplicationStatusEnum.APPLIED,
          newStatus: UserExternalJobApplicationStatusEnum.APPLIED,
          actionDate: DateTime.now().toISO(),
          userId: userId,
          userType: UserType.CAND,
        },
      ],
      companyName: externalJobDetailsOnAwsOpensearch.companyName,
      jobPortal: userExternalJobApplicationRequestBody.jobPortal,
    };

    // Create a new job application
    return userExternalJobApplicationDaoObj.createUserExternalJobApplication(
      email, // email id of the candidate applying for the job
      userExternalJobApplicationDto // job application request body
    );
  }

  /**
   * getByJobIdAndApplicantUserEmail
   * 
   * Retrieves a user's external job application by job id and email.
   * 
   * @param {string} applicantUserEmail - The email of the applicant.
   * @param {string} jobId - The job id.
   * @return {Promise<QueryResponse<DbUserExternalJobApplicationDto>>} A promise that resolves to the job application data.
   */
  async getByJobIdAndApplicantUserEmail(applicantUserEmail: string, jobId: string): Promise<QueryResponse<DbUserExternalJobApplicationDto>> {
    global.logger.info(`Get User External Job Application By Job Id And Applicant User Email [Service]`, {
      filePath: __filename,
      methodName: this.getByJobIdAndApplicantUserEmail.name,
      applicantUserEmail,
      jobId,
    });

    return userExternalJobApplicationDaoObj.getByJobIdAndApplicantUserEmail(applicantUserEmail, jobId);
  }
}

// Create an instance of the UserExternalJobApplicationService class and export it
const userExternalJobApplicationServiceObj = new UserExternalJobApplicationService();
export {
  userExternalJobApplicationServiceObj,
  UserExternalJobApplicationService,
};