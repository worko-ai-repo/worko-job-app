
// Load QueryResponse from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Load dynamoose types
import { ObjectType } from "dynamoose/dist/General";

// Import the constants configs
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import BaseDao from "./Base.dao";

//Load Dtos
import {
  ScriptCompanyJobBulkUploadDto,
  CompanyJobCreateDto,
  CompanyJobUpdateDto,
  CompanyJobCommonUpdateDto,
} from "../dtos/CompanyJob.dto";

// Load Model
import {
  DbCompanyJobDto,
  CompanyJobModel,
} from "../db/models/CompanyJob.model";

// Load UlidService for generating ULID IDs
import UlidService from "../services/Ulid.service";

/**
 * CompanyJobDao
 */
class CompanyJobDao implements BaseDao {
  // Define the model name, partitian key and sort keys for CompanyJob
  modelName: string = "CompanyJob";
  partitianKey: string = "COMP#ID#{companyId}#";
  sortKeys: { SK_INIT: string } = { SK_INIT: "JOBS#ID#{id}" };
  GSI1PK: string = "JOBS#";
  GSI1SK = "ID#{id}";

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} companyId - The companyId of the job.
   * @param {string} jobId - The id of the job.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    companyId: string,
    jobId: string
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{companyId}": companyId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": jobId,
      }),
    };
  }

  /**
   * createJob
   * 
   * Creates a new job entry for a given company.
   *
   * @param {string} companyName - The name of the company for which the job is being created.
   * @param {CompanyJobCreateDto} jobDetailsData - The details of the job to be created, encapsulated in a CompanyJobCreateDto object.
   * @returns {Promise<DbCompanyJobDto>} A promise that resolves to the created job details as a DbCompanyJobDto object.
   */
  async createJob(
    companyName: string,
    jobDetailsData: CompanyJobCreateDto
  ): Promise<DbCompanyJobDto> {
    // Global Logger for the Doa
    global.logger.info("Creating Company Job. [dao]", {
      filePath: __filename,
      methodName: this.createJob.name,
    });

    // Unique id of the entry
    let ulidId: string = UlidService.getUlidId();

    // Construct the data to be saved in the database
    const companyJobDbDetails = {
      ...jobDetailsData,
      jobUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_INTERNAL_JOB_URL.strtr({
        "{companyName}": companyName.split(" ").join("_"), // Sample Ex:- "TEST WORKO 4.0" to "TEST_WORKO_4.0"
        "{jobId}": ulidId,
      }),
      PK: this.partitianKey.strtr({
        "{companyId}": jobDetailsData.companyId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": ulidId,
      }),
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": ulidId,
      }),
      id: ulidId,
    };

    // return the result of the created Job
    return CompanyJobModel.create(companyJobDbDetails);
  }

  /**
   * getJobById
   *
   * Fetches a Job by its ID.
   *
   * @param {string} jobId - The ID of the Job to fetch
   *
   * @returns {Promise<QueryResponse<DbCompanyJobDto>>} - Promise resolving to the fetched Job object
   *
   * @see {CompanyJobModel} - The model used to interact with the database
   */
  async getJobById(jobId: string): Promise<QueryResponse<DbCompanyJobDto>> {
    // Logger message
    global.logger.info("Fetching Job by ID. [dao]", {
      filePath: __filename,
      methodName: this.getJobById.name,
      jobId: jobId,
    });

    // Return the final combined data
    return CompanyJobModel.query("GSI1PK")
      .eq(this.GSI1PK)
      .where("GSI1SK")
      .eq(this.GSI1SK.replace("{id}", jobId))
      .exec();
  }

  /**
   * deleteCompanyJob
   *
   * Deletes a Job from the database, given its details.
   *
   * @param {DbCompanyJobDto} jobDetails - The Job details to be deleted.
   * @returns {Promise<void>} A promise that resolves when the Job is deleted.
   * @see {CompanyJobModel} - The model used to interact with the database
   */
  async deleteCompanyJob(jobDetails: DbCompanyJobDto): Promise<void> {
    // Logger message
    global.logger.info("Company Job Deleting !. [dao]", {
      filePath: __filename,
      methodName: this.deleteCompanyJob.name,
    });

    // Find and delete the Job
    return jobDetails.delete();
  }

  /**
   * updateCommonCompanyJobById
   *
   * Updates a Job in the database, given its ID and company ID.
   *
   * @param {string} jobId - The ID of the Job to update.
   * @param {string} companyId - The ID of the company associated with the Job.
   * @param {Partial<CompanyJobCommonUpdateDto>} jobUpdateDto - The updated details of the Job.
   *
   * @returns {Promise<DbCompanyJobDto>} - Promise resolving to the updated Job object
   *
   * @see {CompanyJobModel} - The model used to interact with the database
   */
  async updateCommonCompanyJobById(
    jobId: string,
    companyId: string,
    jobUpdateDto: Partial<CompanyJobCommonUpdateDto>
  ): Promise<DbCompanyJobDto> {
    // Logger
    global.logger.info(`Update job by id [service]`, {
      methodName: this.updateCommonCompanyJobById.name,
      companyId,
      jobId,
    });

    // Update `job` details in `CompanyJob` model in `worko-job-app` table on `AWS Dynamodb` and return the response.
    return CompanyJobModel.update(
      this.preparePKAndSKForQuery(companyId, jobId),
      jobUpdateDto
    );
  }

  async softDeleteJobById(jobId: string, companyId: string, softDeletData: Partial<CompanyJobCommonUpdateDto>) {
    // Logger message
    global.logger.info("Job Deleting !. [dao]", {
      filePath: __filename,
      methodName: this.softDeleteJobById.name,
      jobId: jobId,
      companyId: companyId,
    });

    // Check if the Job exists if exsit then you will get the IDs to proceed further
    const inputKey: {
      PK: string;
      SK: string;
    } = {
      PK: this.partitianKey.strtr({
        "{companyId}": companyId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": jobId,
      }),
    };

    // Find and delete the Job
    return CompanyJobModel.update(inputKey, softDeletData);
  }

  /**
   * updateCompanyJobById
   *
   * Updates a Job by its ID.
   *
   * @param {string} jobId - The ID of the Job to update
   * @param {string} companyId - The `id` attribute from `CompanyDetail.model.ts`
   * @param {CompanyJobUpdateDto} jobUpdateDto - The updated details of the Job
   *
   * @returns {Promise<DbCompanyJobDto>} - Promise resolving to the updated Job object
   *
   * @see {CompanyJobModel} - The model used to interact with the database
   */
  async updateCompanyJobById(
    jobId: string,
    companyId: string,
    jobUpdateDto: CompanyJobUpdateDto
  ): Promise<DbCompanyJobDto> {
    // Logger
    global.logger.debug(`Update job by id [service]`, {
      methodName: this.updateCompanyJobById.name,
      jobId: jobId,
    });

    // Update `job` details in `CompanyJob` model in `worko-job-app` table on `AWS Dynamodb` and return the response.
    return CompanyJobModel.update(
      {
        PK: this.partitianKey.strtr({ "{companyId}": companyId }),
        SK: this.sortKeys.SK_INIT.strtr({ "{id}": jobId }),
      },
      jobUpdateDto
    );
  }

  /**
   * scriptCreateCompanyJobByBatchPut
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
  async scriptCreateCompanyJobByBatchPut(
    companyJobsDto: ScriptCompanyJobBulkUploadDto[]
  ): Promise<{
    unprocessedItems: ObjectType[];
  }> {
    // logger
    global.logger.info(`Create company jobs by batch put [DAO]`, {
      filePath: __filename,
      methodName: this.scriptCreateCompanyJobByBatchPut.name,
    });

    // return the response
    return CompanyJobModel.batchPut(companyJobsDto);
  }
}

// Define Instance of the CompanyDao class
const companyJobDaoObj = new CompanyJobDao();

export { CompanyJobDao, companyJobDaoObj };
