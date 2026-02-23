// Load QueryResponse from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";

// Load Dao
import { companyJobDaoObj } from "../daos/CompanyJob.dao";

// Load Dto
import {
  ScriptCompanyJobBulkUploadDto,
  CompanyJobCreateDto,
  CompanyJobUpdateDto,
  CompanyJobCommonUpdateDto,
  CompanyJobListingFilterOptions,
} from "../dtos/CompanyJob.dto";
import { PaginatedResultsWithMatchingConditionsResponse, RecordListingFilterOptions } from "../dtos/Common.dto";

// Import enums
import { JobStatusEnum } from "../enums/Job.enum";

// import models
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CompanyJobService {
  /**
   * createJob
   *
   * Creates a Job for a Company.
   *
   * @param {string} companyName - The name of the Company.
   * @param {CompanyJobCreateDto} companyJobDetailsData - The details of the Job to be created.
   *
   * @returns {Promise<DbCompanyJobDto>} - Promise resolving to the newly created Job.
   *
   * @see {CompanyJobDao} - The dao used to interact with the database
   */
  async createJob(
    companyName: string,
    companyJobDetailsData: CompanyJobCreateDto
  ): Promise<DbCompanyJobDto> {
    // Global Logger for the service
    global.logger.info(
      `Creating Job for Company: ${companyJobDetailsData.jobTitle} [service]`,
      {
        filePath: __filename,
        methodName: this.createJob.name,
      }
    );

    return companyJobDaoObj.createJob(companyName, companyJobDetailsData);
  }

  async softDeleteJobById(
    jobId: string,
    companyId: string,
    softDeletData: Partial<CompanyJobCommonUpdateDto>
  ): Promise<DbCompanyJobDto> {
    // Global Logger for the service
    global.logger.info(`Deleting Job for Company: ${jobId} [service]`, {
      filePath: __filename,
      methodName: this.softDeleteJobById.name,
    });

    return companyJobDaoObj.softDeleteJobById(jobId, companyId, softDeletData);
  }

  /**
   * getJobById
   *
   * Get Company Job By Id
   *
   * @param {string} jobId - Job Id
   *
   * @returns {Promise<QueryResponse<DbCompanyJobDto>>}
   */
  async getJobById(jobId: string): Promise<QueryResponse<DbCompanyJobDto>> {
    // Global Logger for the service
    global.logger.info(`Fetching Job by ID: ${jobId} [service]`, {
      filePath: __filename,
      methodName: this.getJobById.name,
    });

    // Fetch Job by Id and Check if the job exists
    const jobDetailById = await companyJobDaoObj.getJobById(jobId);
    if (!jobDetailById.length) {
      throw new BaseError(
        `The Company Job not found.`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return jobDetailById;
  }

  /**
   * getJobByIds
   *
   * Fetches multiple Company Jobs by providing the Job IDs.
   *
   * @param {string[]} jobIds - The list of Job IDs to be fetched.
   * @returns {Promise<DbCompanyJobDto[]>} - A promise that resolves to an array of CompanyJobDto
   *                                          objects if the jobs are found, else an empty array.
   */
  async getJobByIds(jobIds: string[]): Promise<DbCompanyJobDto[]> {
    // Global Logger for the service
    global.logger.info(`Fetching Company Jobs by IDs: [service]`, {
      filePath: __filename,
      methodName: this.getJobById.name,
    });

    // return all job details by ids
    return Promise.all(
      jobIds.map(async (jobId: string): Promise<DbCompanyJobDto> => {
        return (await companyJobDaoObj.getJobById(jobId))[0];
      })
    );
  }

  async getCompanyJobsByFilterOptions(jobReqBody: CompanyJobListingFilterOptions): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCompanyJobDto>
  > {
    return companyJobDaoObj.getCompanyJobsByFilterOptions(jobReqBody);
  }

  async getAllJobsByFilterOptionsWithoutPagination(jobReqBody: CompanyJobListingFilterOptions): Promise<DbCompanyJobDto[]> {
    let lastKeyInternal: ObjectType | undefined = undefined;
    let pageSizeInternal: number = jobReqBody.pageSize ?? 50;
    let allCompanyJobsWithoutPagination: DbCompanyJobDto[] = [];

    // Continue fetching the data until all the data is fetched
    do {
      const filterOptions: RecordListingFilterOptions = {
        lastKey: lastKeyInternal,
        pageSize: pageSizeInternal,
      };

      const companyJobsResponse: PaginatedResultsWithMatchingConditionsResponse<DbCompanyJobDto> =
        await this.getCompanyJobsByFilterOptions(
          {
            ...jobReqBody,
            ...filterOptions,
          }
        );

      const {
        lastKey,
        count,
        timesQueried,
        queriedCount,
        ...companyJobsData
      } = companyJobsResponse;

      const companyJobsArray: DbCompanyJobDto[] = Object.values(companyJobsData);

      allCompanyJobsWithoutPagination =
        allCompanyJobsWithoutPagination.concat(
          companyJobsArray
        );

      lastKeyInternal = lastKey ?? undefined;
    } while (lastKeyInternal);

    return allCompanyJobsWithoutPagination;
  }

  /**
   * deleteCompanyJob
   *
   * Deletes a Job from the database based on the passed in job details.
   *
   * @param {DbCompanyJobDto} jobDetails - The job details to delete
   * @returns {Promise<void>}
   */
  async deleteCompanyJob(jobDetails: DbCompanyJobDto): Promise<void> {
    // Global Logger for the service
    global.logger.info(`Deleting Job for Company: [service]`, {
      filePath: __filename,
      methodName: this.deleteCompanyJob.name,
    });

    return companyJobDaoObj.deleteCompanyJob(jobDetails);
  }

  /**
   * updateCompanyJobById
   *
   * Updates a Job in the database based on the passed in job details.
   *
   * @param {string} jobId - The ID of the Job to update
   * @param {string} companyId - The `id` attribute from `CompanyDetail.model.ts`
   * @param {CompanyJobUpdateDto} jobUpdateDto - The updated job details
   *
   * @returns {Promise<DbCompanyJobDto>} - The updated Job object
   */
  async updateCompanyJobById(
    jobId: string,
    companyId: string,
    jobUpdateDto: CompanyJobUpdateDto
  ): Promise<DbCompanyJobDto> {
    // Logger
    global.logger.debug(`Update job by id [service]`, {
      methodName: this.updateCompanyJobById.name,
      companyId,
      jobId,
    });

    if (jobUpdateDto?.status) {
      jobUpdateDto.isDeleted = jobUpdateDto.status === JobStatusEnum.CLOSED;
    }

    // Update `job` details in `CompanyJob` model in `worko-job-app` table on `AWS Dynamodb` and return the response.
    return companyJobDaoObj.updateCompanyJobById(
      jobId,
      companyId,
      jobUpdateDto
    );
  }

  /**
   * updateCommonCompanyJobById
   *
   * Updates a company's job in the database by its ID and company ID with the provided update details.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {string} companyId - The ID of the company associated with the job.
   * @param {Partial<CompanyJobCommonUpdateDto>} jobUpdateDto - The updated job details.
   *
   * @returns {Promise<DbCompanyJobDto>} - A promise that resolves to the updated job object.
   */
  async updateCommonCompanyJobById(
    jobId: string,
    companyId: string,
    jobUpdateDto: Partial<CompanyJobCommonUpdateDto>
  ): Promise<DbCompanyJobDto> {
    global.logger.info(`Update job by id [service]`, {
      methodName: this.updateCommonCompanyJobById.name,
      companyId,
      jobId,
    });

    if (jobUpdateDto?.status) {
      jobUpdateDto.isDeleted = jobUpdateDto.status === JobStatusEnum.CLOSED;
    }

    return companyJobDaoObj.updateCommonCompanyJobById(
      jobId,
      companyId,
      jobUpdateDto
    );
  }

  /**
   * scriptCopyCompanyJobsFromWorkoToJobTable
   *
   * The script to copy `CompanyJobs` from `worko` to `worko-job-app` table.
   *
   * @param {ScriptCompanyJobBulkUploadDto[]} formattedJobListingArray - The array of formatted job details to be created.
   *
   * @returns {Promise<{unprocessedItems: ObjectType[]}>} - A promise that resolves to an object containing an array of unprocessed items that failed to be created in the database.
   *
   * @see {CompanyJobDao} - The dao used to interact with the database
   */
  async scriptCopyCompanyJobsFromWorkoToJobTable(
    formattedJobListingArray: ScriptCompanyJobBulkUploadDto[]
  ) {
    return companyJobDaoObj.scriptCreateCompanyJobByBatchPut(
      formattedJobListingArray
    );
  }
}

const companyJobServiceObj = new CompanyJobService();

export { companyJobServiceObj, CompanyJobService };
