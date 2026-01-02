// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import dtos
import {
  ExternalJobCreateInternalDto,
  ExternalJobUpdateDto,
} from "../dtos/ExternalJob.dto";

// Import daos
import { externalJobDaoObj } from "../daos/ExternalJob.dao";

// Import enums
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import models
import { DbExternalJobDto } from "../db/models/ExternalJob.model";
import { DbJobAwsOpensearchDto } from "../db/aws-opensearch-models/AwsOpenSearchJob.model";

/**
 * ExternalJobService
 */
class ExternalJobService {
  /**
   * createExternalJob
   *
   * Creates a new external job entry in the database.
   *
   * @param {ExternalJobCreateInternalDto} externalJobDto - The data transfer object containing details of the external job to be created.
   * @returns {Promise<DbExternalJobDto>} A promise that resolves to the created external job database object.
   */
  async createExternalJob(
    externalJobDto: ExternalJobCreateInternalDto
  ): Promise<DbExternalJobDto> {
    // Logger
    global.logger.info(`Create External Job`, {
      methodName: this.createExternalJob.name,
    });

    return externalJobDaoObj.createExternalJob(externalJobDto);
  }

  /**
   * getExternalJobById
   *
   * Retrieves an external job item from DynamoDB using its `id`.
   *
   * @param {string} id - The `id` of the external job to retrieve.
   * @returns {Promise<QueryResponse<DbExternalJobDto>>} A promise that resolves to the external job details retrieved from DynamoDB.
   */
  async getExternalJobById(
    id: string
  ): Promise<QueryResponse<DbExternalJobDto>> {
    // Logger
    global.logger.info(`Get External Job By Id [SERVICE]`, {
      methodName: this.getExternalJobById.name,
      id,
    });

    return externalJobDaoObj.getExternalJobById(id);
  }

  /**
   * updateExternalJobById
   *
   * Updates an external job item in DynamoDB using its `id`.
   *
   * @param {string} id - The ID of the external job to update.
   * @param {ExternalJobUpdateDto} externalJobDto - The data transfer object containing the updated details of the external job.
   *
   * @returns {Promise<DbExternalJobDto>} - A promise that resolves to the updated external job database object if the update operation is successful.
   */
  async updateExternalJobById(
    id: string,
    externalJobDto: ExternalJobUpdateDto
  ): Promise<DbExternalJobDto> {
    // Logger
    global.logger.info(`Update External Job By Id`, {
      methodName: this.updateExternalJobById.name,
      id,
    });

    return externalJobDaoObj.updateExternalJobById(id, externalJobDto);
  }

  /**
   * validateAndCreateExternalJob
   *
   * Validates and creates an external job entry in the database.
   *
   * If the job is found in the database, the method returns the job details as received.
   * If the job is not found in the database, the method creates a new external job entry in the database.
   *
   * @param {string} jobId - The ID of the external job to validate and create.
   * @param {DbJobAwsOpensearchDto} externalJobDetailsOnAwsOpensearch - The data transfer object containing the details of the external job on AWS OpenSearch.
   * @param {string} decodedJobUrl - The decoded job URL.
   *
   * @returns {Promise<DbExternalJobDto>} A promise that resolves to the created external job database object if the create operation is successful.
   */
  async validateAndCreateExternalJob(
    jobId: string,
    externalJobDetailsOnAwsOpensearch: DbJobAwsOpensearchDto,
    decodedJobUrl: string
  ): Promise<DbExternalJobDto> {
    // Logger
    global.logger.info(`Validate And Create External Job`, {
      methodName: this.validateAndCreateExternalJob.name,
    });

    // Retrived the external Job Details.
    const existingExternalJob: QueryResponse<DbExternalJobDto> =
      await externalJobDaoObj.getExternalJobById(jobId);

    // Check if the job is found and return the details as recieved
    if (existingExternalJob.count) {
      return existingExternalJob[0];
    }

    // Prepare external job create dto
    const externalJobDto: ExternalJobCreateInternalDto = {
      id: externalJobDetailsOnAwsOpensearch.id,
      createdByUserId: externalJobDetailsOnAwsOpensearch.createdByUserId,
      updatedByUserId: externalJobDetailsOnAwsOpensearch.updatedByUserId,
      externalJobId: externalJobDetailsOnAwsOpensearch.externalJobId!,
      status: externalJobDetailsOnAwsOpensearch.status!,
      jobTitle: externalJobDetailsOnAwsOpensearch.jobTitle,
      location: externalJobDetailsOnAwsOpensearch.location ?? {
        city: [],
        state: [],
        country: [],
        fullLocation: [],
      },
      jobDescription: externalJobDetailsOnAwsOpensearch.jobDescription!,
      htmlJobDescription: externalJobDetailsOnAwsOpensearch.htmlJobDescription,
      jobPostedDate: externalJobDetailsOnAwsOpensearch.jobPostedDate ?? "",
      jobCreatedDate: externalJobDetailsOnAwsOpensearch.jobCreatedDate ?? "",
      jobUrl: externalJobDetailsOnAwsOpensearch.jobUrl ?? decodedJobUrl,
      jobInternalUrl: decodedJobUrl,
      workMode: externalJobDetailsOnAwsOpensearch.workMode!,

      sourcedFrom: externalJobDetailsOnAwsOpensearch.sourcedFrom ?? JobSourcedFromEnum.FANTASTIC_JOB,

      department: externalJobDetailsOnAwsOpensearch.department,
      technicalSkills: externalJobDetailsOnAwsOpensearch.technicalSkills,
      coreSkills: externalJobDetailsOnAwsOpensearch.coreSkills,
      softSkills: externalJobDetailsOnAwsOpensearch.softSkills,
      experienceRange: externalJobDetailsOnAwsOpensearch.experienceRange,
      salaryRange: externalJobDetailsOnAwsOpensearch.salaryRange,
      typeofEmployment: externalJobDetailsOnAwsOpensearch.typeofEmployment,
      companyName: externalJobDetailsOnAwsOpensearch.companyName,
      companyUrl: externalJobDetailsOnAwsOpensearch.companyUrl,
      companyLogoUrl: externalJobDetailsOnAwsOpensearch.companyLogoUrl,
      otherRequirements: externalJobDetailsOnAwsOpensearch.otherRequirements,
      noticePeriod: externalJobDetailsOnAwsOpensearch.noticePeriod,
      numOfOpenings: externalJobDetailsOnAwsOpensearch.numOfOpenings,
      miscellaneousSkills:
        externalJobDetailsOnAwsOpensearch.miscellaneousSkills,
      isDeleted: externalJobDetailsOnAwsOpensearch.isDeleted,
    };

    // Create external job in `ExternalJob` model
    return this.createExternalJob(externalJobDto);
  }
}

// Create instance
const externalJobServiceObj: ExternalJobService = new ExternalJobService();

// Export instance object and class
export { externalJobServiceObj, ExternalJobService };
