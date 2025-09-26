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
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

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
    opensearchJobDataToStoreInAwsS3Vector: DbJobAwsOpensearchDto
  ): AwsS3VectorJobCreateOrUpdateJobDataDto {
    const awsS3VectorJobCreateJobDataDto: AwsS3VectorJobCreateOrUpdateJobDataDto =
      {
        _index: indexName,
        _id: opensearchJobDataToStoreInAwsS3Vector.id,
        _source: opensearchJobDataToStoreInAwsS3Vector,
      };

    return awsS3VectorJobCreateJobDataDto;
  }

  prepareAwsS3VectorJobCreateDto(
    indexName: string,
    opensearchJobDataToStoreInAwsS3Vector: DbJobAwsOpensearchDto
  ): AwsS3VectorJobCreateDto {
    const awsS3VectorJobCreateDto: AwsS3VectorJobCreateDto = {
      jobData: this.prepareAwsS3VectorJobsDataCreateOrUpdateDto(
        indexName,
        opensearchJobDataToStoreInAwsS3Vector
      ),
      indexName: indexName,
    };

    return awsS3VectorJobCreateDto;
  }

  prepareAwsS3VectorJobUpdateDto(
    indexName: string,
    opensearchJobDataToStoreInAwsS3Vector: DbJobAwsOpensearchDto
  ): AwsS3VectorJobUpdateDto {
    const awsS3VectorJobUpdateDto: AwsS3VectorJobUpdateDto = {
      updateJobId: opensearchJobDataToStoreInAwsS3Vector.id,
      jobData: this.prepareAwsS3VectorJobsDataCreateOrUpdateDto(
        indexName,
        opensearchJobDataToStoreInAwsS3Vector
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

  async deleteBulkAwsS3VectorJobOldUnappliedExternalJobs(
    deleteJobIds: string[]
  ): Promise<boolean> {
    if (!deleteJobIds?.length) {
      global.logger.info(`No old jobs found to delete [SERVICE]`, {
        methodName: this.deleteBulkAwsS3VectorJobOldUnappliedExternalJobs.name,
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
