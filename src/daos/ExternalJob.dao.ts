// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { ExternalJobCreateInternalDto, ExternalJobUpdateDto } from "../dtos/ExternalJob.dto";

// import models
import {
  DbExternalJobDto,
  ExternalJobModel,
} from "../db/models/ExternalJob.model";

/**
 * ExternalJobDao
 *
 * Dao for handling user external job-related operations
 */
class ExternalJobDao implements BaseDao {
  modelName = "ExternalJob"; // The model name used for external jobs
  partitianKey = "EXT#JOBS#"; 
  sortKeys = { SK_INIT: "ID#{id}" }; // `id` attribute from `Job.aws-opensearch-model.ts`

  /**
   * createExternalJob
   *
   * Creates an external job item in DynamoDB.
   *
   * @param {ExternalJobCreateInternalDto} externalJobDto - The external job data transfer object to be created.
   * @returns {Promise<DbExternalJobDto>} - A promise that resolves to a DbExternalJobDto object if the create operation is successful.
   */
  async createExternalJob(
    externalJobDto: ExternalJobCreateInternalDto
  ): Promise<DbExternalJobDto> {
    // logger
    global.logger.debug(`Create external job [DAO]`, {
      methodName: this.createExternalJob.name,
    });

    // Prepare extrenal job dto
    const createExternalJobDto = {
      ...externalJobDto,
      PK: this.partitianKey,
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": externalJobDto.id,
      }),
    };

    return ExternalJobModel.create(createExternalJobDto);
  }

  /**
   * getExternalJobById
   *
   * Retrieves an external job item from DynamoDB by its `id`.
   *
   * @param {string} id - The ID of the external job to retrieve.
   * @returns {Promise<QueryResponse<DbExternalJobDto>>} - A promise that resolves to the retrieved external job database object.
   */
  async getExternalJobById(
    id: string
  ): Promise<QueryResponse<DbExternalJobDto>> {
    // Logger
    global.logger.info(`Get External Job By Id [DAO]`, {
      methodName: this.getExternalJobById.name,
      id: id,
    });

    return ExternalJobModel.query("PK")
      .eq(this.partitianKey)
      .where("SK")
      .eq(
        this.sortKeys.SK_INIT.strtr({
          "{id}": id,
        })
      )
      .exec();
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
    global.logger.info(`Update External Job By Id [DAO]`, {
      methodName: this.updateExternalJobById.name,
    });

    return ExternalJobModel.update(
      {
        PK: this.partitianKey,
        SK: this.sortKeys.SK_INIT.strtr({
          "{id}": id,
        }),
      },
      externalJobDto
    );
  }
}

const externalJobDaoObj = new ExternalJobDao();
export { externalJobDaoObj, ExternalJobDao };