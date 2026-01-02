// Import daos
import { awsS3VectorJobDaoObj } from "../daos/AwsS3VectorJob.dao";

// Import dtos
import {
  AwsS3VectorJobBulkCreateDto,
  AwsS3VectorJobBulkDeleteDto,
  AwsS3VectorJobBulkDeleteParsedResponseDto,
  AwsS3VectorJobCreateDto,
  AwsS3VectorJobCreateOrUpdateJobDataDto,
  AwsS3VectorJobCreateOrUpdateParsedResponseDto,
  AwsS3VectorJobListingFilterOptions,
  AwsS3VectorJobGetParsedResponseDto,
  AwsS3VectorJobUpdateDto,
  AwsS3VectorJobBulkUpdateDto,
  AwsS3VectorJobBulkUpdateParsedResponseDto,
} from "../dtos/AwsS3VectorJob.dto";

// Import models
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class AwsS3VectorJobService {
  getAwsS3VectorJobIndexName(): string {
    const indexName: string | undefined = awsS3VectorJobDaoObj.IndexName;
    if (!indexName)
      throw new BaseError(
        "AwsS3VectorJob index name not found.",
        HttpStatusCode.NOT_FOUND_404
      );
    return indexName;
  }

  prepareAwsS3VectorJobsDataCreateOrUpdateDto(
    indexName: string,
    jobDataToStoreInAwsS3Vector: DbGcpFirestoreJobDto
  ): AwsS3VectorJobCreateOrUpdateJobDataDto {
    const awsS3VectorJobCreateJobDataDto: AwsS3VectorJobCreateOrUpdateJobDataDto =
      {
        _index: indexName,
        _id: jobDataToStoreInAwsS3Vector.id,
        _source: jobDataToStoreInAwsS3Vector,
      };

    return awsS3VectorJobCreateJobDataDto;
  }

  prepareAwsS3VectorJobCreateDto(
    indexName: string,
    jobDataToStoreInAwsS3Vector: DbGcpFirestoreJobDto
  ): AwsS3VectorJobCreateDto {
    const awsS3VectorJobCreateDto: AwsS3VectorJobCreateDto = {
      jobData: this.prepareAwsS3VectorJobsDataCreateOrUpdateDto(
        indexName,
        jobDataToStoreInAwsS3Vector
      ),
      indexName: indexName,
    };

    return awsS3VectorJobCreateDto;
  }

  prepareAwsS3VectorJobUpdateDto(
    indexName: string,
    jobDataToStoreInAwsS3Vector: DbGcpFirestoreJobDto
  ): AwsS3VectorJobUpdateDto {
    const awsS3VectorJobUpdateDto: AwsS3VectorJobUpdateDto = {
      updateJobId: jobDataToStoreInAwsS3Vector.id,
      jobData: this.prepareAwsS3VectorJobsDataCreateOrUpdateDto(
        indexName,
        jobDataToStoreInAwsS3Vector
      ),
      indexName: indexName,
    };

    return awsS3VectorJobUpdateDto;
  }

  async createAwsS3VectorJob(
    awsS3VectorJobCreateDto: AwsS3VectorJobCreateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    global.logger.info(`Create AwsS3VectorJob [SERVICE]`, {
      methodName: this.createAwsS3VectorJob.name,
      jobId: awsS3VectorJobCreateDto.jobData._id,
    });

    return awsS3VectorJobDaoObj.createAwsS3VectorJob(awsS3VectorJobCreateDto);
  }

  async createBulkAwsS3VectorJobs(
    bulkS3VectorCreateJobData: AwsS3VectorJobBulkCreateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    global.logger.info(`Create Bulk AwsS3VectorJobs [SERVICE]`, {
      methodName: this.createBulkAwsS3VectorJobs.name,
      jobsCount: bulkS3VectorCreateJobData.jobData.length,
    });

    return awsS3VectorJobDaoObj.createBulkAwsS3VectorJobs(
      bulkS3VectorCreateJobData
    );
  }

  async getAllAwsS3VectorJobsByFilterOptions(
    filterOptions: AwsS3VectorJobListingFilterOptions
  ): Promise<AwsS3VectorJobGetParsedResponseDto> {
    return awsS3VectorJobDaoObj.getAllAwsS3VectorJobsByFilterOptions(
      filterOptions
    );
  }

  async updateAwsS3VectorJobById(
    updateData: AwsS3VectorJobUpdateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    global.logger.info(`Update AwsS3VectorJob by id [SERVICE]`, {
      methodName: this.updateAwsS3VectorJobById.name,
      jobId: updateData.updateJobId,
    });

    return awsS3VectorJobDaoObj.updateAwsS3VectorJobById(updateData);
  }

  async updateBulkAwsS3VectorJobs(
    updateData: AwsS3VectorJobBulkUpdateDto
  ): Promise<AwsS3VectorJobBulkUpdateParsedResponseDto> {
    global.logger.info(`Update Bulk AwsS3VectorJobs [SERVICE]`, {
      methodName: this.updateAwsS3VectorJobById.name,
      updateDataCount: updateData.updateJobs.length,
    });

    return awsS3VectorJobDaoObj.updateBulkAwsS3VectorJobs(updateData);
  }

  async deleteAwsS3VectorJobById(jobIdToDelete: string): Promise<boolean> {
    global.logger.info(`Delete AwsS3VectorJob by id [SERVICE]`, {
      methodName: this.deleteAwsS3VectorJobById.name,
      jobId: jobIdToDelete,
    });

    const deletePayload: AwsS3VectorJobBulkDeleteDto = {
      deleteJobIds: [jobIdToDelete],
      indexName: this.getAwsS3VectorJobIndexName(),
    };

    const parsedDeletedResponse: AwsS3VectorJobBulkDeleteParsedResponseDto =
      await awsS3VectorJobDaoObj.deleteBulkAwsS3VectorJobsByIds(deletePayload);
    global.logger.info(`Delete AwsS3VectorJob by id [SERVICE]`, {
      totalRequested: parsedDeletedResponse?.results?.totalRequested,
      successFulDeletions: parsedDeletedResponse?.results?.successfulDeletions,
      failedDeletions: parsedDeletedResponse?.results?.failedDeletions,
      successResponse: parsedDeletedResponse?.results?.success,
    });

    return parsedDeletedResponse?.results?.success ?? false;
  }

  async deleteBulkAwsS3VectorJobsByIds(
    deleteJobIds: string[]
  ): Promise<boolean> {
    if (!deleteJobIds?.length) {
      global.logger.info(`No old jobs found to delete [SERVICE]`, {
        methodName: this.deleteBulkAwsS3VectorJobsByIds.name,
        deleteJobIdsLength: deleteJobIds.length,
      });
      return false;
    }

    const deletePayload: AwsS3VectorJobBulkDeleteDto = {
      deleteJobIds: deleteJobIds,
      indexName: this.getAwsS3VectorJobIndexName(),
    };

    const parsedDeletedResponse: AwsS3VectorJobBulkDeleteParsedResponseDto =
      await awsS3VectorJobDaoObj.deleteBulkAwsS3VectorJobsByIds(deletePayload);
    global.logger.info(`Delete AwsS3VectorJob by id [SERVICE]`, {
      totalRequested: parsedDeletedResponse?.results?.totalRequested,
      successFulDeletions: parsedDeletedResponse?.results?.successfulDeletions,
      failedDeletions: parsedDeletedResponse?.results?.failedDeletions,
      successResponse: parsedDeletedResponse?.results?.success,
    });

    return parsedDeletedResponse?.results?.success ?? false;
  }
}

const awsS3VectorJobServiceObj = new AwsS3VectorJobService();
export { awsS3VectorJobServiceObj, AwsS3VectorJobService };
