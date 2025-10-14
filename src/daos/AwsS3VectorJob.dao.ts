// Import lambdas
import { APIGatewayProxyResult } from "aws-lambda";

// Import sdk configs
import { awsClientLambdaLibrary } from "../configs/aws-sdk.config";

// Import local configs
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  AwsS3VectorJobBulkCreateDto,
  AwsS3VectorJobBulkDeleteDto,
  AwsS3VectorJobBulkDeleteParsedResponseDto,
  AwsS3VectorJobCreateDto,
  AwsS3VectorJobCreateOrUpdateParsedResponseDto,
  AwsS3VectorJobListingFilterOptions,
  AwsS3VectorJobGetParsedResponseDto,
  AwsS3VectorJobUpdateDto,
  AwsS3VectorJobBulkUpdateDto,
  AwsS3VectorJobBulkUpdateParsedResponseDto,
} from "../dtos/AwsS3VectorJob.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class AwsS3VectorJobDao {
  IndexName: string | undefined = process.env.APP_AWS_S3_VECTOR_INDEX_NAME;

  private getAwsS3VectorJobSearchLambdaFunctionName(): string {
    const lambdaFunctionName: string | undefined =
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.WORKO_S3_VECTOR_JOB_SEARCH;

    if (!lambdaFunctionName) {
      throw new BaseError(
        "S3 Vector Job search Lambda function name is not defined.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return lambdaFunctionName;
  }

  private getAwsS3VectorCrudLambdaFunctionName(): string {
    const lambdaFunctionName: string | undefined =
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.WORKO_S3_VECTOR_JOB_INGESTION;

    if (!lambdaFunctionName) {
      throw new BaseError(
        "S3 Vector CRUD Lambda function name is not defined.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return lambdaFunctionName;
  }

  private async performAwsS3VectorActionsOnRequestResponseInvocationType<PayloadAwsS3VectorJobDto, ResponseAwsS3VectorJobDto>(
    lambdaFunctionName: string,
    payload: PayloadAwsS3VectorJobDto,
  ): Promise<ResponseAwsS3VectorJobDto> {
    global.logger.info("Interacting with aws s3 vector job.", {
      lambdaFunctionName, 
      methodName: this.performAwsS3VectorActionsOnRequestResponseInvocationType.name,
    });

    const awsS3VectorJobResponse: APIGatewayProxyResult =
      await awsClientLambdaLibrary.triggerLambdaRequestResponseInvocationType<PayloadAwsS3VectorJobDto>(
        lambdaFunctionName,
        payload
      );

    if(awsS3VectorJobResponse.statusCode !== HttpStatusCode.OK_200) {
      global.logger.error("Unable to interact with aws s3 vector job. Please try again.", {
        payload,
        lambdaFunctionName,
        awsS3VectorJobResponse
      });
      throw new BaseError("Unable to interact with aws s3 vector job. Please try again.", awsS3VectorJobResponse.statusCode);
    }

    return JSON.parse(awsS3VectorJobResponse["body"]);
  }

  async createAwsS3VectorJob(
    payload: AwsS3VectorJobCreateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobCreateDto,
      AwsS3VectorJobCreateOrUpdateParsedResponseDto
    >(this.getAwsS3VectorCrudLambdaFunctionName(), payload);
  }

  async createBulkAwsS3VectorJobs(
    bulkS3VectorCreateJobData: AwsS3VectorJobBulkCreateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobBulkCreateDto,
      AwsS3VectorJobCreateOrUpdateParsedResponseDto
    >(this.getAwsS3VectorCrudLambdaFunctionName(), bulkS3VectorCreateJobData);
  }

  async getAllAwsS3VectorJobsByFilterOptions(
    payload: AwsS3VectorJobListingFilterOptions
  ): Promise<AwsS3VectorJobGetParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobListingFilterOptions,
      AwsS3VectorJobGetParsedResponseDto
    >(this.getAwsS3VectorJobSearchLambdaFunctionName(), payload);
  }

  async updateAwsS3VectorJobById(
    updateData: AwsS3VectorJobUpdateDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobUpdateDto,
      AwsS3VectorJobCreateOrUpdateParsedResponseDto
    >(this.getAwsS3VectorCrudLambdaFunctionName(), updateData);
  }

  async updateBulkAwsS3VectorJobs(
    updateData: AwsS3VectorJobBulkUpdateDto
  ): Promise<AwsS3VectorJobBulkUpdateParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobBulkUpdateDto,
      AwsS3VectorJobBulkUpdateParsedResponseDto
    >(this.getAwsS3VectorCrudLambdaFunctionName(), updateData);
  }

  async deleteBulkAwsS3VectorJobsByIds(
    payload: AwsS3VectorJobBulkDeleteDto
  ): Promise<AwsS3VectorJobBulkDeleteParsedResponseDto> {
    return this.performAwsS3VectorActionsOnRequestResponseInvocationType<
      AwsS3VectorJobBulkDeleteDto,
      AwsS3VectorJobBulkDeleteParsedResponseDto
    >(this.getAwsS3VectorCrudLambdaFunctionName(), payload);
  }
}

const awsS3VectorJobDaoObj: AwsS3VectorJobDao = new AwsS3VectorJobDao();
export { awsS3VectorJobDaoObj, AwsS3VectorJobDao };
