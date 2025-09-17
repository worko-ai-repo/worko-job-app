// import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { UserExternalJobApplicationCreateDto } from "../dtos/UserExternalJobApplication.dto";

// import models
import { DbUserExternalJobApplicationDto, UserExternalJobApplicationModel } from "../db/models/UserExternalJobApplication.model";

// import services
import UlidService from "../services/Ulid.service";

/**
 * UserExternalJobApplicationDao
 */
class UserExternalJobApplicationDao implements BaseDao {
  modelName = "UserExternalJobApplication";
  partitianKey = "USR#EML#{primaryEmail}";
  sortKeys = { SK_INIT: "EXT#JOB#APP#ID#{id}" };
  GSI1PK = "EXT#JOB#APP#";
  GSI1SK = "ID#{id}";

  /**
   * Creates a new user external job application.
   *
   * This method generates a unique ID for the new job application and prepares
   * the necessary data by combining the request body with the generated ID.
   * It then creates a new user external job application in the database.
   *
   * @param {string} email - The email of the user applying for the job.
   * @param {UserExternalJobApplicationCreateDto} userExternalJobApplicationRequestBody -
   * The data required to create a new user external job application.
   * @returns {Promise<DbUserExternalJobApplicationDto>} A promise that resolves to
   * the created user external job application data.
   */
  async createUserExternalJobApplication(
    email: string,
    userExternalJobApplicationRequestBody: UserExternalJobApplicationCreateDto
  ): Promise<DbUserExternalJobApplicationDto> {
    // logger
    global.logger.info(`Creating user external job application`, {
      email,
    });

    // Generate a unique ID
    const ulidId: string = UlidService.getUlidId();

    // Prepare the data required to create a new user external job application
    const newUserExternalJobApplication = {
      ...userExternalJobApplicationRequestBody,
      id: ulidId,
      PK: this.partitianKey.strtr({
        "{primaryEmail}": email,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": ulidId,
      }),
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": ulidId,
      }),
    };

    // Create new user external job application
    return UserExternalJobApplicationModel.create(
      newUserExternalJobApplication
    );
  }

  /**
   * getByJobIdAndApplicantUserEmail
   *
   * Retrieves a user's external job application by job id and email.
   *
   * @param {string} emailId - The email of the applicant.
   * @param {string} jobId - The job id.
   * @return {Promise<QueryResponse<DbUserExternalJobApplicationDto>>} A promise that resolves to the job application data.
   */
  async getByJobIdAndApplicantUserEmail(
    emailId: string,
    jobId: string
  ): Promise<QueryResponse<DbUserExternalJobApplicationDto>> {
    global.logger.info(`Get User External Job Application By jobId [DAO]`, {
      filePath: __filename,
      methodName: this.getByJobIdAndApplicantUserEmail.name,
      emailId,
      jobId,
    });

    return UserExternalJobApplicationModel.query("PK")
      .eq(this.partitianKey.strtr({ "{primaryEmail}": emailId }))
      .where("SK")
      .beginsWith(
        this.sortKeys.SK_INIT.strtr({
          "{id}": "",
        })
      )
      .where("jobId")
      .eq(jobId)
      .exec();
  }
}

// create an instance of UserExternalJobApplicationDao and export instance object & class
const userExternalJobApplicationDaoObj = new UserExternalJobApplicationDao();
export { userExternalJobApplicationDaoObj, UserExternalJobApplicationDao };
