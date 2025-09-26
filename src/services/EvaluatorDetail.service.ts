// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

import {
  AdminAddUserToGroupCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import constant configs
import { awsClientCognitoIdentityProviderLibrary } from "../configs/aws-sdk.config";

// Import daos
import { evaluatorDetailDaoObj } from "../daos/EvaluatorDetail.dao";

// import dtos
import { EvaluatorDetailCreateApiDTO } from "../dtos/EvaluatorDetail.dto";

// import models
import { DbEvaluatorDetailDto } from "../db/models/EvaluatorDetail.model";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * EvaluatorDetailService
 * 
 * Service for handling evaluator detail-related operations
 */
class EvaluatorDetailService {
  /**
   * createEvaluatorDetail
   *
   * Creates an evaluator detail.
   *
   * @param {EvaluatorDetailCreateApiDTO} evaluatorDetail - The evaluator detail to create.
   * @returns {Promise<DbEvaluatorDetailDto>} A promise that resolves to the created evaluator detail.
   */
  async createEvaluatorDetail(
    evaluatorDetail: EvaluatorDetailCreateApiDTO
  ): Promise<DbEvaluatorDetailDto> {
    global.logger.info(`Create Evaluator Detail [Service]`, {
      methodName: this.createEvaluatorDetail.name,
    });

    const existingEvaluatorDetail: QueryResponse<DbEvaluatorDetailDto> =
      await evaluatorDetailDaoObj.getEvaluatorDetailByEmail(
        evaluatorDetail.email
      );
    if (existingEvaluatorDetail.count) {
      throw new BaseError(
        "Evaluator already exists with the same email.",
        HttpStatusCode.CONFLICT_409
      );
    }

    const newEvaluatorDetail: DbEvaluatorDetailDto =
      await evaluatorDetailDaoObj.createEvaluatorDetail(evaluatorDetail);

    if (newEvaluatorDetail?.id) {
      // Get AWS Cognito user pool ID
      const userPoolId: string | undefined = process.env.APP_AWS_COGNITO_USER_POOL_ID;
      if (!userPoolId) {
        global.logger.error("User pool ID is not set.", {
          userPoolId,
          methodName: this.createEvaluatorDetail.name,
        });
        throw new BaseError(
          "User pool ID is not configured.",
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }

      const isEvaluator: boolean = await awsClientCognitoIdentityProviderLibrary.checkUserInCognitoGroup(
        userPoolId,
        newEvaluatorDetail.email,
        APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.EVALUATOR,
      );

      if (isEvaluator) {
        global.logger.error("Evaluator already elevated in the cognito group. [service]", {
          isEvaluator,
          methodName: this.createEvaluatorDetail.name,
        })
        throw new BaseError(
          "Evaluator already exists with the same email.",
          HttpStatusCode.CONFLICT_409
        );
      }

      // Elevate the user to the appropriate cognito group
      const addedUserToGroup: AdminAddUserToGroupCommandOutput =
        await awsClientCognitoIdentityProviderLibrary.elevateUserToGroup(
          userPoolId,
          newEvaluatorDetail.email,
          APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.EVALUATOR
        );
      global.logger.info("User added to group successfully. [service]", {
        methodName: this.createEvaluatorDetail.name,
        addedUserToGroup: addedUserToGroup,
      });
    }

    return newEvaluatorDetail;
  }

  /**
   * getEvaluatorDetailById
   *
   * Retrieves an evaluator detail by its ID.
   *
   * @param {string} id - The ID of the evaluator detail.
   * @returns {Promise<QueryResponse<DbEvaluatorDetailDto>>} A promise that resolves to the evaluator detail data.
   */
  async getEvaluatorDetailById(
    id: string
  ): Promise<QueryResponse<DbEvaluatorDetailDto>> {
    global.logger.info(`Get Evaluator Detail By Id [Service]`, {
      methodName: this.getEvaluatorDetailById.name,
    });

    return evaluatorDetailDaoObj.getEvaluatorDetailById(id);
  }

  /**
   * getEvaluatorDetailByEmail
   *
   * Retrieves an evaluator detail by its email.
   *
   * @param {string} emailId - The email of the evaluator detail.
   *
   * @returns {Promise<QueryResponse<DbEvaluatorDetailDto>>} A promise that resolves to the evaluator detail data.
   */
  async getEvaluatorDetailByEmail(
    emailId: string
  ): Promise<QueryResponse<DbEvaluatorDetailDto>> {
    global.logger.info(`Get Evaluator Detail By Email Id [Service]`, {
      methodName: this.getEvaluatorDetailByEmail.name,
    });

    return evaluatorDetailDaoObj.getEvaluatorDetailByEmail(emailId);
  }
}

// Create an instance of the EvaluatorDetailService class and export it
const evaluatorDetailServiceObj: EvaluatorDetailService = new EvaluatorDetailService();
export { evaluatorDetailServiceObj, EvaluatorDetailService };