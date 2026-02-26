// import dynamoose types 
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";
import { Condition } from "dynamoose/dist/Condition";

// import luxon
import { DateTime } from "luxon";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { UserJobApplicationBulkUploadDto, UserJobApplicationCommonUpdateDto, UserJobApplicationCreateDto, UserJobApplicationDisplayToCorporateApiDTO, UserJobApplicationHiredFromOtherPortalDTO, UserJobApplicationInternalUpdateDto, UserJobApplicationListingFilterOptions } from "../dtos/UserJobApplication.dto";
import { PaginatedResultsWithMatchingConditionsResponse, RecordListingFilterOptions } from "../dtos/Common.dto";

// import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { JobApplicationStatus, UserJobApplicationHiringInProcessRelatedStatusEnum, UserJobApplicationRejectUpdateStatusEnum } from "../enums/UserJobApplication.enum";

// import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// import models
import { DbUserJobApplicationDto, UserJobApplicationModel } from "../db/models/UserJobApplication.model";

// import services
import UlidService from "../services/Ulid.service";

/**
 * UserJobApplicationDao
 * 
 * Dao for handling user job application-related operations
 */
class UserJobApplicationDao implements BaseDao {
  modelName = "UserJobApplication"; // The model name used for user job applications
  partitianKey = "USR#EML#{primaryEmail}"; // Partition key format for user job applications
  sortKeys = { SK_JOB_APP_ID: "JOB#APP#ID#{id}" }; // Sort key format for user job applications
  GSI1PK = "COMP#ID#{companyId}#JOB#APP#"; // `companyID` is the `id` of the company
  GSI1SK = "ID#{id}"; // `id` is the `job application id` which is generated when a job application is created
  GSI2PK = "JOB#APP#";
  GSI2SK = "ID#{id}"; // `id` is the `job application id` which is generated when a job application is created
  GSI3PK = "JOB#ID#{jobId}" // "jobId" will be the "id" attribute of the internal job
  GSI3SK = "JOB#APP#ID#{id}" // `id` is the `job application id` which is generated when a job application is created

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} primaryEmail - The primary email of the user.
   * @param {string} id - The id of the refer and earn.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    primaryEmail: string,
    id: string
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{primaryEmail}": primaryEmail,
      }),
      SK: this.sortKeys.SK_JOB_APP_ID.strtr({
        "{id}": id,
      }),
    };
  }

  /**
   * updateJobApplicationByIdAndPrimaryEmail
   *
   * Updates a job application by its ID and user email.
   *
   * This method updates a job application with the provided update data.
   *
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @param {string} applicantUserEmail - The primary email of the user who applied for the job.
   * @param {Partial<UserJobApplicationCommonUpdateDto>} updateData - The update data for the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateJobApplicationByIdAndPrimaryEmail(
    jobApplicationId: string,
    applicantUserEmail: string,
    updateData: Partial<UserJobApplicationCommonUpdateDto>
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application details [DAO]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationByIdAndPrimaryEmail.name,
      jobApplicationId,
      applicantUserEmail,
      updateData,
    });

    return UserJobApplicationModel.update(
      this.preparePKAndSKForQuery(applicantUserEmail, jobApplicationId),
      updateData
    );
  }

  /**
   * createJobApplication
   *
   * Creates a new job application for a candidate.
   *
   * @param {string} userId - The ID of the user applying for the job.
   * @param {string} emailId - The email ID of the user applying for the job.
   * @param {UserJobApplicationCreateDto} jobApplicationRequestBody - The data required to create a new job application.
   * @returns {Promise<DbUserJobApplicationDto>} - A promise that resolves to an object representing the created job application.
   */
  async createJobApplication(
    userId: string,
    emailId: string,
    jobApplicationRequestBody: UserJobApplicationCreateDto
  ): Promise<DbUserJobApplicationDto> {
    // logger
    global.logger.info(`Create Job Application By Cand [DAO]`, {
      filePath: __filename,
      methodName: this.createJobApplication.name,
      userId,
      emailId,
      jobApplicationRequestBody,
    });

    // Generate a unique ID
    const ulidId: string = UlidService.getUlidId();

    // Prepare the data required to create a new job application
    const newJobApplication = {
      ...jobApplicationRequestBody,
      id: ulidId,
      PK: this.partitianKey.strtr({
        "{primaryEmail}": emailId,
      }),
      SK: this.sortKeys.SK_JOB_APP_ID.strtr({
        "{id}": ulidId,
      }),
      GSI1PK: this.GSI1PK.strtr({
        "{companyId}": jobApplicationRequestBody.companyId,
      }),
      GSI1SK: this.GSI1SK.strtr({
        "{id}": ulidId,
      }),
      GSI2PK: this.GSI2PK,
      GSI2SK: this.GSI2SK.strtr({
        "{id}": ulidId,
      }),
      GSI3PK: this.GSI3PK.strtr({
        "{jobId}": jobApplicationRequestBody.jobId,
      }),
      GSI3SK: this.GSI3SK.strtr({
        "{id}": ulidId,
      }),
    };

    // Create the job application in the database
    return UserJobApplicationModel.create(newJobApplication);
  }

  /**
   * getJobApplicationByjobId
   *
   * Retrieves a job application by job ID for a candidate.
   *
   * @param {string} emailId - The email of the user.
   * @param {string} jobId - The job ID.
   * @return {Promise<QueryResponse<DbUserJobApplicationDto>>} A promise that resolves to the job application data.
   */
  async getJobApplicationByjobId(
    emailId: string,
    jobId: string
  ): Promise<QueryResponse<DbUserJobApplicationDto>> {
    global.logger.info(`Get Job Application By jobId [DAO]`, {
      filePath: __filename,
      methodName: this.getJobApplicationByjobId.name,
      emailId,
      jobId,
    });

    // Generate the PK using the user's email
    let PK: string = this.partitianKey.strtr({ "{primaryEmail}": emailId });

    // Retrieve the job application data from the database and return
    return UserJobApplicationModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith("JOB#APP#ID#")
      .where("jobId")
      .eq(jobId)
      .exec();
  }

  /**
   * getJobApplicationById
   *
   * Retrieves the job application by job application ID.
   *
   * @param {string} jobApplicationId - The job application ID.
   * @returns {Promise<QueryResponse<DbUserJobApplicationDto>>} A promise that resolves to the job application data.
   */
  async getJobApplicationById(
    jobApplicationId: string
  ): Promise<QueryResponse<DbUserJobApplicationDto>> {
    global.logger.info("Get Job Application By Id [DAO]", {
      filePath: __filename,
      methodName: this.getJobApplicationById.name,
      jobApplicationId,
    });

    // Retrieve the job application data from the database and return
    return UserJobApplicationModel.query("GSI2PK")
      .eq(this.GSI2PK)
      .where("GSI2SK")
      .eq(this.GSI2SK.strtr({ "{id}": jobApplicationId }))
      .exec();
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
  ): Promise<QueryResponse<DbUserJobApplicationDto>> {
    global.logger.info(`Get Job Application Score For Cand [DAO]`, {
      filePath: __filename,
      methodName: this.getJobApplicationScore.name,
      jobApplicationId,
    });

    // Generate GSI2SK
    let GSI2SK: string = this.GSI2SK.strtr({ "{id}": jobApplicationId });

    // Query score details for the job application
    return UserJobApplicationModel.query("GSI2PK")
      .eq(this.GSI2PK)
      .where("GSI2SK")
      .eq(GSI2SK)
      .attributes([
        "matchingScore",
        "jdMatchErrorCode",
        "jdMatchErrorDesc",
        "rejectionFeedbackBySystem",
      ])
      .exec();
  }

  /**
   * getUserJobApplicationByEmailIdAndJobId
   *
   * Retrieves a job application by email ID and job ID.
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
      `Get User Job Application By emailId and jobId [DAO]`,
      {
        filePath: __filename,
        methodName: this.getUserJobApplicationByEmailIdAndJobId.name,
        emailId,
        jobId,
      }
    );

    // return user job application by emailId and jobId
    return UserJobApplicationModel.query("PK")
      .eq(this.partitianKey.strtr({ "{primaryEmail}": emailId }))
      .where("SK")
      .beginsWith(this.sortKeys.SK_JOB_APP_ID.strtr({ "{id}": "" }))
      .where("jobId")
      .eq(jobId)
      .exec();
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
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbUserJobApplicationDto>>} A promise that resolves to the paginated results of job applications matching the filter conditions.
   */
  async getJobApplicationsByFilterOptions(
    jobApplicationRequestBody: UserJobApplicationListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbUserJobApplicationDto>
  > {
    global.logger.info(
      `Get Job Applications By filter options For Corp User [DAO]`,
      {
        filePath: __filename,
        methodName: this.getJobApplicationsByFilterOptions.name,
        jobApplicationRequestBody,
      }
    );

    // Initialize the query
    let query: Query<DbUserJobApplicationDto>;

    // Retrieve all the job applications for a specific company
    if (jobApplicationRequestBody.companyId) {
      let GSI1PK: string = this.GSI1PK.strtr({
        "{companyId}": jobApplicationRequestBody.companyId,
      });

      query = UserJobApplicationModel.query("GSI1PK")
        .eq(GSI1PK)
        .where("GSI1SK")
        .beginsWith("ID#");
    } else if (jobApplicationRequestBody.userEmail) {
      // Retrieve all the job applications for a specific user(candidate)
      query = UserJobApplicationModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{primaryEmail}": jobApplicationRequestBody.userEmail,
          })
        )
        .where("SK")
        .beginsWith("JOB#APP#ID#");
    } else if(jobApplicationRequestBody?.jobId) {
      // Retrieve all the job applications for a specific job
      query = UserJobApplicationModel.query("GSI3PK")
        .eq(this.GSI3PK.strtr({ "{jobId}": jobApplicationRequestBody.jobId }))
        .where("GSI3SK")
        .beginsWith(this.GSI3SK.strtr({ "{id}": "" }));
    } else {
      /**
       * If neither `companyId` nor `userEmail` nor `jobId` is provided, then use `GSI2PK` and `GSI2SK`
       */
      query = UserJobApplicationModel.query("GSI2PK")
        .eq(this.GSI2PK)
        .where("GSI2SK")
        .beginsWith("ID#");
    }

    // Sort the results based on the provided sort order
    query = query.sort(
      jobApplicationRequestBody.sortOrder as SortOrderTypeEnum
    );

    // If `userType` is provided, then filter the results based on the user type
    if (
      jobApplicationRequestBody.userType ===
        CorporateUserTypeEnum.CORPORATE_ADMIN ||
      jobApplicationRequestBody.userType ===
        CorporateUserTypeEnum.CORPORATE_RECRUITER
    ) {
      const {MIN, MAX} = APP_CONSTANTS.MATCHING_SCORES.CORPORATE_JOB_APPLICATION_MATCHING_SCORE_RANGE;
      query = query.and().parenthesis((condition: Condition) => {
        return condition
          .where("displayToCorporate")
          .eq(true)
          .or()
          .parenthesis((inner: Condition) => {
            return inner
              .where("rejectionFeedbackBySystem")
              .eq("")
              .where("matchingScore")
              .between(
                MIN,
                MAX,
              );
          });
      });
    }

    // Apply status filter if provided
    if (jobApplicationRequestBody.status) {
      /**
       * If job application status is `HIRING_IN_PROCESS` then 
       * retrieve all the job applications with below specified statuses also:
       *  @see {UserJobApplicationHiringInProcessRelatedStatusEnum}
       */
      if(jobApplicationRequestBody.status === JobApplicationStatus.HIRING_IN_PROCESS) {
        query = query.where("status").in(
          Object.values(UserJobApplicationHiringInProcessRelatedStatusEnum),
        );
      } else {
        query = query.where("status").eq(jobApplicationRequestBody.status);
      }
    }

    if(jobApplicationRequestBody.referAndEarnId) {
      query = query.where("referAndEarnId").eq(jobApplicationRequestBody.referAndEarnId);
    }

    // Apply createdAt date range filter if provided
    if (
      jobApplicationRequestBody.fromDate ||
      jobApplicationRequestBody.toDate
    ) {
      query = query.and().parenthesis((condition) => {
        if (jobApplicationRequestBody.fromDate) {
          condition.where("createdAt").ge(jobApplicationRequestBody.fromDate);
        }
        if (jobApplicationRequestBody.toDate) {
          condition.where("createdAt").le(jobApplicationRequestBody.toDate);
        }
        return condition;
      });
    }

    // Apply updatedAt date range filter if provided
    if (
      jobApplicationRequestBody.updatedAtFromDate ||
      jobApplicationRequestBody.updatedAtToDate
    ) {
      query = query.and().parenthesis((condition) => {
        if (jobApplicationRequestBody.updatedAtFromDate) {
          condition
            .where("updatedAt")
            .ge(jobApplicationRequestBody.updatedAtFromDate);
        }
        if (jobApplicationRequestBody.updatedAtToDate) {
          condition
            .where("updatedAt")
            .le(jobApplicationRequestBody.updatedAtToDate);
        }
        return condition;
      });
    }

    // search by searchText if provided
    if (jobApplicationRequestBody.searchText) {
      // remove trailing and leading spaces from the search text
      let searchTextValue = jobApplicationRequestBody.searchText;

      /* 
      The and() method initiates a condition block where all conditions within it must be satisfied.
      The parenthesis() method allows grouping of conditions for complex queries.
      */
      query = query.and().parenthesis((condition: Condition) => {
        let searchCondition: Condition = condition
          .where("status")
          .contains(searchTextValue.toUpperCase())
          .or()
          // NOTE: `companyName` search will not work when the `companyName` is changed in `CompanyDetail` model and
          // if the `companyName` is changed in `CompanyDetail` model, then the `companyName` will not be updated in `UserJobApplication` model
          .where("companyName")
          .contains(searchTextValue.toUpperCase());

        if(!jobApplicationRequestBody.userEmail) {
          searchCondition = searchCondition
            .or()
          .where("PK")
            .contains(`USR#EML#${searchTextValue.toLowerCase()}`);
        }

        return searchCondition;
      });
    }

    // Execute the query by applying the pagination helper and return the results
    return getPaginatedResultsWithMatchingConditions<
      DbUserJobApplicationDto,
      UserJobApplicationListingFilterOptions
    >(query, jobApplicationRequestBody);
  }

  async getAllNonInitiatedHiringStatusJobApplicationsToReject(
    jobId: string,
    jobApplicationRequestBody: RecordListingFilterOptions
  ): Promise<PaginatedResultsWithMatchingConditionsResponse<DbUserJobApplicationDto>> {
    global.logger.info(
      `Get All Non Initiated Hiring Status Job Applications [DAO]`,
      {
        jobId,
        methodName: this.getAllNonInitiatedHiringStatusJobApplicationsToReject.name,
        jobApplicationRequestBody,
      }
    );

    // Retrieve all the job applications for a specific job
    let query: Query<DbUserJobApplicationDto> = UserJobApplicationModel.query("GSI3PK")
        .eq(this.GSI3PK.strtr({ "{jobId}": jobId }))
        .where("GSI3SK")
        .beginsWith(this.GSI3SK.strtr({ "{id}": "" }))
        .where("status").in(
          Object.values(UserJobApplicationRejectUpdateStatusEnum),
        ) 

    return getPaginatedResultsWithMatchingConditions<
      DbUserJobApplicationDto,
      RecordListingFilterOptions
    >(query, jobApplicationRequestBody);
  }

  /**
   * updateJobApplicationStatus
   *
   * Updates a job application in the database using the provided update data.
   *
   * @param {string} partitianKey - The partition key of the job application.
   * @param {string} sortKey - The sort key of the job application.
   * @param {UserJobApplicationInternalUpdateDto} updateData - The data to be updated in the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateJobApplicationStatus(
    partitianKey: string,
    sortKey: string,
    updateData: UserJobApplicationInternalUpdateDto
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application By Corp User [DAO]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationStatus.name,
      partitianKey,
      sortKey,
      updateData,
    });

    return UserJobApplicationModel.update(
      { PK: partitianKey, SK: sortKey },
      updateData
    );
  }

  /**
   * Updates the job application request feedback in the database.
   *
   * This method updates the follow-up request for a job application identified by the given email ID and job application ID.
   * It logs the update action and returns the updated job application data.
   *
   * @param {string} emailId - The email ID of the user associated with the job application.
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateJobApplicationRequestFeedback(
    emailId: string,
    jobApplicationId: string
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application Request Feedback [DAO]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationRequestFeedback.name,
      emailId: emailId,
      jobApplicationId: jobApplicationId,
    });

    // update job application request feedback and return
    return UserJobApplicationModel.update(
      {
        PK: this.partitianKey.strtr({ "{primaryEmail}": emailId }),
        SK: this.sortKeys.SK_JOB_APP_ID.strtr({ "{id}": jobApplicationId }),
      },
      {
        followUpRequest: [
          {
            actionDate: DateTime.now().toISO(),
          },
        ],
      }
    );
  }

  /**
   * updateJobApplicationDisplayToCorporate
   * 
   * Updates a job application in the database with the provided display to corporate
   * value.
   *
   * This method updates the job application with the provided display to corporate value
   * and logs the update action. It returns the updated job application data.
   *
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @param {string} applicantUserEmail - The email of the user associated with the job
   * application.
   * @param {UserJobApplicationDisplayToCorporateApiDTO} validatedRequestBody - The
   * validated data to be updated in the job application.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated
   * job application data.
   */
  async updateJobApplicationDisplayToCorporate(
    jobApplicationId: string,
    applicantUserEmail: string,
    validatedRequestBody: UserJobApplicationDisplayToCorporateApiDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(`Update Job Application Display To Corporate [DAO]`, {
      filePath: __filename,
      methodName: this.updateJobApplicationDisplayToCorporate.name,
      jobApplicationId,
      applicantUserEmail,
      validatedRequestBody,
    });

    return UserJobApplicationModel.update(
      this.preparePKAndSKForQuery(applicantUserEmail, jobApplicationId),
      validatedRequestBody
    );
  }

  /**
   * updateUserJobApplicationHiredFromOtherPortalDetails
   *
   * Updates the Hired From Other Portal details of a user's job application.
   *
   * @param {string} jobApplicationId - The ID of the job application to be updated.
   * @param {string} emailId - The email ID of the user associated with the job application.
   * @param {UserJobApplicationHiredFromOtherPortalDTO} hiredFromOtherPortalDetails - The Hired From Other Portal details to update.
   * @returns {Promise<DbUserJobApplicationDto>} A promise that resolves to the updated job application data.
   */
  async updateUserJobApplicationHiredFromOtherPortalDetails(
    jobApplicationId: string,
    emailId: string,
    hiredFromOtherPortalDetails: UserJobApplicationHiredFromOtherPortalDTO
  ): Promise<DbUserJobApplicationDto> {
    global.logger.info(
      `Update User Job Application Hired From Other Portal Details [DAO]`,
      {
        filePath: __filename,
        methodName:
          this.updateUserJobApplicationHiredFromOtherPortalDetails.name,
        jobApplicationId,
        emailId,
      }
    );

    // Prepare PK and SK for query
    const { PK, SK } = this.preparePKAndSKForQuery(emailId, jobApplicationId);

    // Update the job application details with externally hired information
    return UserJobApplicationModel.update(
      {
        PK: PK,
        SK: SK,
      },
      hiredFromOtherPortalDetails
    );
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
    // log
    global.logger.info(`Update User Job Application By Id and Email [DAO]`, {
      filePath: __filename,
      methodName: this.updateUserJobApplicationByIdAndEmail.name,
      userJobApplicationId,
      userEmail,
      userJobApplicationUpdateDto,
    });

    // prepare the partitian key and sort key
    const partitianKey: string = this.partitianKey.strtr({
      "{primaryEmail}": userEmail,
    });
    const sortKey: string = this.sortKeys.SK_JOB_APP_ID.strtr({
      "{id}": userJobApplicationId,
    });

    // return updated job application
    return UserJobApplicationModel.update(
      { PK: partitianKey, SK: sortKey },
      userJobApplicationUpdateDto
    );
  }

  /**
   * scriptBatchCreateUserJobApplications
   *
   * This `batchPut` saves items to DynamoDB.
   * This method uses the `batchWriteItem` DynamoDB API call to store your objects
   * in the given table associated with the model.
   *
   * A single call to BatchWriteItem can transmit up to 16MB of data over the network,
   * consisting of up to 25 item put or delete operations.
   * While individual items can be up to 400 KB once stored.
   *
   * @see https://dynamoosejs.com/guide/Model#modelbatchputitems-settings-callback
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#:~:text=The%20BatchWriteItem%20operation%20puts%20or,item%20put%20or%20delete%20operations.
   *
   * @returns {Promise<{unprocessedItems: ObjectType[]}>} - A promise that resolves to an object
   * containing an array of unprocessed items that failed to be created in the database.
   */
  async scriptBatchCreateUserJobApplications(
    userJobApplications: UserJobApplicationBulkUploadDto[]
  ): Promise<{
    unprocessedItems: ObjectType[];
  }> {
    // logger
    global.logger.info(
      `Script Create User Job Application by batch put [DAO]`,
      {
        filePath: __filename,
        methodName: this.scriptBatchCreateUserJobApplications.name,
      }
    );

    // return the response
    return UserJobApplicationModel.batchPut(userJobApplications);
  }
}

// create an instance of UserJobApplicationDao and export instance object & class 
const userJobApplicationDao = new UserJobApplicationDao();
export {userJobApplicationDao, UserJobApplicationDao};