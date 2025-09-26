// import dynamoose types 
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { EvaluatorDetailCreateApiDTO } from "../dtos/EvaluatorDetail.dto";

// import models
import { DbEvaluatorDetailDto, EvaluatorDetailModel } from "../db/models/EvaluatorDetail.model";

// import services
import UlidService from "../services/Ulid.service";

/**
 * EvaluatorDetailDao
 * 
 * Dao for handling evaluator detail-related operations
 */
class EvaluatorDetailDao implements BaseDao {
  modelName = "EvaluatorDetail";
  partitianKey = "EVAL#{evaluatorEmail}";
  sortKeys = { SK_ID: "ID#{id}" }; // `id` should be the converted cognito user id to ulid
  GSI1PK = "EVAL#";
  GSI1SK = "ID#{id}"; // `id` should be the converted cognito user id to ulid

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} evaluatorEmail - The email of the evaluator.
   * @param {string} id - The ID of the evaluator detail.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    evaluatorEmail: string,
    id: string
  ): {
    PK: string,
    SK: string,
  } {
    return {
      PK: this.partitianKey.strtr({
        "{evaluatorEmail}": evaluatorEmail,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{id}": id,
      }),
    };
  }

  /**
   * prepareGsi1PKAndGsi1SKForQuery
   *
   * Prepares the partition key and sort key for a GSI1 query.
   *
   * @param {string} convertedCognitoUserIdToUlid - The converted cognito user id to ulid
   *
   * @returns {{GSI1PK: string, GSI1SK: string}} - An object containing the partition key and sort key.
   */
  prepareGsi1PKAndGsi1SKForQuery(convertedCognitoUserIdToUlid: string): { GSI1PK: string, GSI1SK: string } {
    return {
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": convertedCognitoUserIdToUlid,
      }),
    };
  }

  /**
   * createEvaluatorDetail
   *
   * Creates an evaluator detail.
   *
   * @param {EvaluatorDetailCreateApiDTO} evaluatorDetail - The evaluator detail to create.
   *
   * @returns {Promise<DbEvaluatorDetailDto>} A promise that resolves to the created evaluator detail.
   */
  async createEvaluatorDetail(evaluatorDetail: EvaluatorDetailCreateApiDTO): Promise<DbEvaluatorDetailDto> {
    global.logger.info(`Create Evaluator Detail [Dao]`, {
      methodName: this.createEvaluatorDetail.name,
    });

    const userIdInUlid: string = UlidService.convertUuidToUlid(
      evaluatorDetail.cognitoUserId
    );

    const { PK, SK } = this.preparePKAndSKForQuery(
      evaluatorDetail.email,
      userIdInUlid
    );

    const { GSI1PK, GSI1SK } = this.prepareGsi1PKAndGsi1SKForQuery(userIdInUlid);

    return EvaluatorDetailModel.create({
      ...evaluatorDetail,
      id: userIdInUlid,
      PK,
      SK,
      GSI1PK,
      GSI1SK,
    });
  }

  /**
   * getEvaluatorDetailByEmail
   *
   * Retrieves an evaluator detail based on the provided email.
   *
   * @param {string} email - The email of the evaluator.
   *
   * @returns {Promise<QueryResponse<DbEvaluatorDetailDto>>} A promise that resolves with the query response containing the evaluator detail.
   */
  async getEvaluatorDetailByEmail(email: string): Promise<QueryResponse<DbEvaluatorDetailDto>> {
    global.logger.info(`Get Evaluator Detail By Email [Dao]`, 
      { methodName: this.getEvaluatorDetailByEmail.name }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(email, "");

    return EvaluatorDetailModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK)
      .exec();
  }

  /**
   * getEvaluatorDetailById
   *
   * Retrieves an evaluator detail based on the provided evaluator detail ID.
   *
   * @param {string} id - The ID of the evaluator detail.
   *
   * @returns {Promise<QueryResponse<DbEvaluatorDetailDto>>} A promise that resolves with the query response containing the evaluator detail.
   */ 
  async getEvaluatorDetailById(id: string): Promise<QueryResponse<DbEvaluatorDetailDto>> {
    global.logger.info(`Get Evaluator Detail By Id [Dao]`, {
      methodName: this.getEvaluatorDetailById.name
    })
    
    const {GSI1PK, GSI1SK} = this.prepareGsi1PKAndGsi1SKForQuery(id);

    return EvaluatorDetailModel.query("GSI1PK")
      .eq(GSI1PK)
      .where("GSI1SK")
      .beginsWith(GSI1SK)
      .exec();
  }
}

// Create an instance of EvaluatorDetailDao and export
const evaluatorDetailDaoObj: EvaluatorDetailDao = new EvaluatorDetailDao();
export { evaluatorDetailDaoObj, EvaluatorDetailDao };