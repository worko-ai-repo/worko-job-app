
// import aws lambda related types
import { APIGatewayProxyResult } from "aws-lambda";

// import constants and configs
import { awsClientLambdaLibrary } from "../configs/aws-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import userDetailDao from "../daos/UserDetail.dao";

// import dtos
import { InvokeLambdaHandlerEventPayloadDto, InvokeLambdaParsedJobDescriptionDto, InvokeLambdaRejectJobApplicationDto, InvokeLambdaToMatchUserResumeWithJobAndJdDto, InvokeLambdMatchingScoreCalcualtionDto } from "../dtos/InvokeLambda.dto";
import { ParsedJobDescriptionApiDto } from "../dtos/Job.dto";

// import enums
import { MatchingScoreEntityEnum } from "../enums/Common.enum";
import { InvocationTypeEnum } from "../enums/InvokeLambda.enum";

// import utils
import { BaseError } from "../utils/errors.util";

class InvokeLambdaService {
  /**
   * triggerParseJobDescription
   *
   * Triggers the Lambda function to parse the job description.
   *
   * @param {ParsedJobDescriptionApiDto} parsedJobDescriptionApiDto - The DTO containing the job description to be parsed.
   * @returns {Promise<APIGatewayProxyResult>} The decoded payload from the Lambda response, which includes the parsed job details.
   */
  async triggerParseJobDescription(
    parsedJobDescriptionApiDto: ParsedJobDescriptionApiDto
  ): Promise<APIGatewayProxyResult> {
    // log the info
    global.logger.info(" [service] Trigger Parse Job Description ", {
      filePath: __filename,
      methodName: this.triggerParseJobDescription.name,
    });

    // Prepare Payload
    const parsedJobDescriptionPayload: InvokeLambdaParsedJobDescriptionDto = {
      JOB_DESC: parsedJobDescriptionApiDto.jobDescription,
    }; 

    return awsClientLambdaLibrary.triggerLambdaRequestResponseInvocationType<InvokeLambdaParsedJobDescriptionDto>(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.JOB_DESCRIPTION_PARSER_LAMBDA_NAME,
      parsedJobDescriptionPayload
    );
  }

  /**
   * triggerOpenSearchOperation
   *
   * Triggers an AWS Lambda function to perform operations on an OpenSearch
   * cluster. This method sends a payload to the Lambda function specified
   * in the configuration and handles the response.
   *
   * @param {OpensearchPayload} payload - The payload containing details of the
   * OpenSearch operation to be performed.
   * @returns {Promise<APIGatewayProxyResult>} The response object containing
   * the status code and message indicating the success or failure of the
   * operation.
   */
  async triggerOpenSearchOperation<OpensearchPayload>(
    payload: OpensearchPayload
  ): Promise<APIGatewayProxyResult> {
    // log the info
    global.logger.info("Trigger OpenSearch Operation Lambda [service]", {
      methodName: this.triggerOpenSearchOperation.name,
    }); 

    return awsClientLambdaLibrary.triggerLambdaRequestResponseInvocationType<OpensearchPayload>(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.WORKO_JOB_APP_OPENSEARCH_OPERATIONS,
      payload
    );
  }

  /**
   * triggerLambdaToMatchUserResumeWithJobAndJd
   *
   * Triggers the AWS Lambda function to update the user matching score for a specific job with the given userId and jobId.
   *
   * @param {string} userId - The ID of the user for whom the matching score is being updated.
   * @param {string} jobId - The ID of the job for which the matching score is being updated.
   * @returns {Promise<APIGatewayProxyResult>} The response object containing the status code and message
   * indicating the success or failure of the operation.
   */
  async triggerLambdaToMatchUserResumeWithJobAndJd(
    userId: string,
    jobId: string
  ): Promise<APIGatewayProxyResult> {
    global.logger.info(
      `Triggering user matching score job lambda for updating user matching score for a job by userId [service]`,
      {
        methodName: this.triggerLambdaToMatchUserResumeWithJobAndJd.name,
        userId: userId,
        jobId: jobId,
      }
    );

    // Prepare Payload
    const payload: InvokeLambdaToMatchUserResumeWithJobAndJdDto = {
      userId: userId,
      jobId: jobId,
    };

    // Trigger Lambda
    return awsClientLambdaLibrary.triggerLambdaEventInvocationType<InvokeLambdaToMatchUserResumeWithJobAndJdDto>(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.USER_MATCHING_SCORE_JOB_LAMBDA_NAME,
      payload
    );
  }

  /**
   * triggerMatchingScoreCalculation
   *
   * Triggers the AWS Lambda function to calculate matching scores for a user.
   *
   * This method prepares a payload containing user and entity information,
   * and invokes a specific Lambda function to calculate matching scores based
   * on the provided entity type and identifier.
   *
   * @param {string} email - The email of the user for whom the matching score
   * calculation is being triggered.
   * @param {MatchingScoreEntityEnum} entity - The type of entity for which
   * the matching score is being calculated (e.g., "REFERRAL" or "JOB_APP").
   * @param {string} entitySK - The specific identifier of the entity (e.g.,
   *  "JOB#APP#ID#{id}").
   * @returns {Promise<APIGatewayProxyResult>} The response object containing
   * the status code and message indicating the success or failure of the
   * operation.
   */
  async triggerMatchingScoreCalculation(
    email: string,
    entity: MatchingScoreEntityEnum,
    entitySK: string
  ): Promise<APIGatewayProxyResult> {
    global.logger.info("Trigger Matching Score Calculation [service]", {
      filePath: __filename,
      methodName: this.triggerMatchingScoreCalculation.name,
      email,
      entity,
      entitySK,
    });

    // Prepare user Detail PK
    const userDetailPK: string = userDetailDao.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    // Prepare Payload
    const payload: InvokeLambdMatchingScoreCalcualtionDto = {
      USER_PK: userDetailPK,
      USER_DETAIL_SK: "ID#",
      MATCHING_ENTITY: entity,
      ENTITY_SK: entitySK,
    };

    // Trigger Lambda
    return awsClientLambdaLibrary.triggerLambdaEventInvocationType<InvokeLambdMatchingScoreCalcualtionDto>(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.MATCHING_SCORE_LAMBDA_NAME,
      payload
    );
  }

  /**
   * triggerRejectJobApplication
   *
   * Triggers the AWS Lambda function to update the job application status to REJECTED
   * and ingest the feedback into the RAG database.
   *
   * @param {InvokeLambdaRejectJobApplicationDto} payload - The payload containing
   * the job application id and the reason for rejection.
   * @returns {Promise<APIGatewayProxyResult>} The response object containing
   * the status code and message indicating the success or failure of the
   * operation.
   */
  async triggerRejectJobApplication(
    payload: InvokeLambdaRejectJobApplicationDto
  ): Promise<APIGatewayProxyResult> {
    global.logger.info("Trigger Reject Job Application [service]", {
      methodName: this.triggerRejectJobApplication.name,
      payload,
    });
    return awsClientLambdaLibrary.triggerLambdaEventInvocationType<InvokeLambdaRejectJobApplicationDto>(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.RAG_FEEDBACK_INGESTION_LAMBDA_NAME,
      payload
    );
  }

  async triggerLambdaToMigrateJobsAwsOpensearchToGcpFirestore(
    reqPageSize: number,
    lastKey?: string
  ) {
    global.logger.info("Trigger Lambda to Migrate Jobs Aws Opensearch To Gcp Firestore [service]", {
      methodName: this.triggerLambdaToMigrateJobsAwsOpensearchToGcpFirestore.name,
    });
    return awsClientLambdaLibrary.triggerLambdaEventInvocationType(
      APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.MIGRATE_JOBS_LAMBDA_NAME,
      {
        reqPageSize: reqPageSize,
        lastKey: lastKey
      }
    );
  }

  async triggerWorkoJobAppInvokeLambdaTrigger(
    awsLambdaInvocationType: InvocationTypeEnum,
    payload: InvokeLambdaHandlerEventPayloadDto
  ) {
    switch (awsLambdaInvocationType) {
      case InvocationTypeEnum.EventType:
        return awsClientLambdaLibrary.triggerLambdaEventInvocationType(
          APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.WORKO_JOB_APP_INVOKE_LAMBDA_NAME,
          payload,
        );

      case InvocationTypeEnum.RequestResponseType:
        return awsClientLambdaLibrary.triggerLambdaRequestResponseInvocationType(
          APP_CONSTANTS.LAMBDA_FUNCTION_NAMES.WORKO_JOB_APP_INVOKE_LAMBDA_NAME,
          payload,
        );

      case InvocationTypeEnum.DryRunType:
        global.logger.error("DryRunType not supported as of now we may implement it in near future if needed.", {
          methodName: this.triggerWorkoJobAppInvokeLambdaTrigger.name,
        });
        throw new BaseError("DryRunType not supported as of now, we may implement it in near future if needed.");

      default:
        global.logger.error("Invalid Invocation Type", {
          methodName: this.triggerWorkoJobAppInvokeLambdaTrigger.name,
        });
        throw new BaseError("Invalid Invocation Type");
    }
  }
}

// Export an instance of the InvokeLambda class
export default new InvokeLambdaService();