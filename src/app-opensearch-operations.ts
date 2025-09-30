// Import aws lambda related types
import { APIGatewayProxyResult, Context } from "aws-lambda";

// Import opensearch related types
import {
  DeleteByQuery_Response,
  Index_Response,
  Update_Response,
  UpdateByQuery_Response,
} from "@opensearch-project/opensearch/api";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import logger library
import "./libraries/logger.library";

// Import constant configs
import { awsOpensearchLibrary } from "./configs/aws-sdk.config";

// Import dtos
import { AwsOpensearchRecordListingResponseDTO } from "./dtos/Common.aws-opensearch.dto";

// Import enums
import { OpenSearchOperationsEnum } from "./enums/Common.enum";

// Import utils
import HttpStatusCode from "./utils/http-codes.util";
import { responseHandlerUtilObj } from "./utils/response-handler.util";

/**
 * OpenSearch Operations Handler
 *
 * This Lambda function handles all AWS OpenSearch operations and runs in VPC
 * to communicate with VPC-attached AWS OpenSearch cluster.
 */
export const handler = async (
  event: {
    indexName: string;
    body: any;
    operation: OpenSearchOperationsEnum;
  },
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { operation, indexName, body } = event;

    global.logger.info("OpenSearch Lambda triggered", {
      methodName: "handler",
      invokedFunctionArn: context.invokedFunctionArn,
      operation,
      indexName,
    });

    switch (operation) {
      case OpenSearchOperationsEnum.CREATE_DOCUMENT:
        type RequestBodyType = typeof body;
        const createResponse: Index_Response =
          await awsOpensearchLibrary.createDocument<RequestBodyType>(
            body.id,
            indexName,
            body
          );

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<Index_Response>(
          createResponse
        );

      case OpenSearchOperationsEnum.GET_DOCUMENTS:
        const { awsOpensearchQuery, filterOptions } = body;

        type FilterOptionsType = typeof filterOptions;

        const getResponse: AwsOpensearchRecordListingResponseDTO<any[]> =
          await awsOpensearchLibrary.getDocuments<any, FilterOptionsType>(
            indexName,
            awsOpensearchQuery,
            filterOptions
          );

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<
          AwsOpensearchRecordListingResponseDTO<any[]>
        >(getResponse);

      case OpenSearchOperationsEnum.GET_ALL_DOCUMENTS_WITHOUT_PAGINATION:
        const { awsOpensearchQuery: getAllQuery } = body;

        const getAllResponse: any[] =
          await awsOpensearchLibrary.getAllDocumentsWithoutPagination<any>(
            indexName,
            getAllQuery
          );

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<any[]>(
          getAllResponse
        );

      case OpenSearchOperationsEnum.UPDATE_DOCUMENT_BY_ID:
        const { id, updatedDto } = body;

        type EntityUpdateDtoType = typeof updatedDto;

        const updateResponse: Update_Response =
          await awsOpensearchLibrary.updateDocumentById<EntityUpdateDtoType>(
            id,
            indexName,
            updatedDto
          );

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<Update_Response>(
          updateResponse
        );

      case OpenSearchOperationsEnum.GET_DOCUMENT_BY_ID:
        const { documentId } = body;

        const getDocumentByIdResponse =
          await awsOpensearchLibrary.getDocumentById<any>(
            documentId,
            indexName
          );

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<any>(
          getDocumentByIdResponse
        );

      case OpenSearchOperationsEnum.DELETE_DOCUMENTS_BY_QUERY:
        const deleteByQueryResponse: DeleteByQuery_Response =
          await awsOpensearchLibrary.deleteDocumentsByQuery(indexName, body);

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<DeleteByQuery_Response>(
          deleteByQueryResponse
        );

      case OpenSearchOperationsEnum.UPDATE_DOCUMENTS_BY_QUERY:
        const updateByQueryResponse: UpdateByQuery_Response =
          await awsOpensearchLibrary.updateDocumentsByQuery(indexName, body);

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<UpdateByQuery_Response>(
          updateByQueryResponse
        );

      case OpenSearchOperationsEnum.BULK_CREATE_DOCUMENT:
        const bulkCreateResponse: boolean =
          await awsOpensearchLibrary.bulkCreateDocument(body);

        return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda<boolean>(
          bulkCreateResponse
        );

      default:
        return {
          statusCode: HttpStatusCode.BAD_REQUEST_400,
          body: JSON.stringify({ error: "Invalid operation" }),
        };
    }
  } catch (error: any) {
    if (global.logger) {
      global.logger.error("OpenSearch operation failed", { error });
    }
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
      body: JSON.stringify({ error: "Unknown error occurred" }),
    };
  }
};
