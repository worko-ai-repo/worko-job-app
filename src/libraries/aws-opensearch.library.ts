// Import AWS SDK packages and openSearch packages
import { defaultProvider } from "@aws-sdk/credential-provider-node"; // V3 SDK.
import { Client, ClientOptions } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

// Import opensearch request and response types
import { Hit } from "@opensearch-project/opensearch/api/_types/_core.search";
import {
  Bulk_RequestBody,
  Bulk_Response,
  Delete_Response,
  Index_RequestBody,
  Index_Response,
  Search_RequestBody,
  Search_Response,
  Update_Response,
} from "@opensearch-project/opensearch/api";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  AwsOpensearchRecordListingFilterOptions,
  AwsOpensearchRecordListingResponseDTO,
} from "../dtos/Common.aws-opensearch.dto";

// Import helpers
import { awsOpensearchlastKeyToBase64EncodeStr } from "../helpers/aws-opensearch.helper";

// Import types
import { AwsSigv4SignerOptionsServiceType } from "../types/Common.aws-opensearch.type";

/**
 * Introduction to OpenSearch
 * @see https://opensearch.org/docs/latest/getting-started/intro/
 *
 * SQL and OpenSearch terminology
 * @see https://opensearch.org/docs/latest/search-plugins/sql/sql/index/
 *
 * The OpenSearch JavaScript (JS) client
 * @see https://opensearch.org/docs/latest/clients/javascript/index/
 */
class AwsOpensearchLibrary {
  /**
   * initOpensearchClientOptions
   *
   * Initialises the AWS Opensearch client options.
   *
   * @returns {ClientOptions} The AWS Opensearch client options.
   */
  initOpensearchClientOptions(): ClientOptions {
    // Initialize opensearch client options
    let opensearchClientOptions: ClientOptions;

    // If stage is local, then use `dev` opensearch dashboard credentials for connection.
    if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
      opensearchClientOptions = {
        node: process.env.APP_OPENSEARCH_ENDPOINT,
        auth: {
          username: process.env.APP_OPENSEARCH_DASHBOARD_USER_NAME as string,
          password: process.env.APP_OPENSEARCH_DASHBOARD_PASSWORD as string,
        },
        ssl: {
          rejectUnauthorized: false, // Ignore SSL certificate validation for local
        },
      };

      return opensearchClientOptions;
    }

    opensearchClientOptions = {
      ...AwsSigv4Signer({
        region: process.env.APP_SLS_REGION as string,
        service: process.env
          .APP_OPENSEARCH_SERVICE as AwsSigv4SignerOptionsServiceType,

        // Example with AWS SDK V3:
        getCredentials: () => {
          // Any other method to acquire a new Credentials object can be used.
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      node: process.env.APP_OPENSEARCH_ENDPOINT,
    };

    return opensearchClientOptions;
  }

  /**
   * opensearchClient
   */
  opensearchClient = new Client(this.initOpensearchClientOptions());

  /**
   * createDocument
   *
   * Creates a document in an OpenSearch index with a specified ID.
   *
   * @param {string} id - The ID of the document to be created.
   * @param {string} indexName - The name of the OpenSearch index.
   * @param {EntityDto} document - The document to be created.
   * @returns {Promise<Index_Response>} - A promise that resolves to the result of the document creation operation.
   */
  async createDocument<EntityDto extends Index_RequestBody>(
    id: string,
    indexName: string,
    document: EntityDto
  ): Promise<Index_Response> {
    return this.opensearchClient.index({
      index: indexName,
      id: id,
      body: document,
      refresh: true,
    });
  }

  /**
   * bulkCreateDocument
   *
   * Bulk creates documents in an OpenSearch index.
   *
   * This method sends a bulk request to the OpenSearch client to perform index actions. Each operation
   * in the `bulkData` array can be a new document entry or an index action with metadata specifying the
   * document's index and ID. The method returns a promise that resolves to `true` if all operations in
   * the bulk request succeed, or `false` if any operation fails.
   *
   * Index:-
   * Index actions create a document if it doesn’t yet exist and replace the document if it already exists. The next line must include a JSON document:
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#index
   *
   * @param {(Index_RequestBody | {index: {_index: string; _id: string;}})[]} bulkData - An array of
   * document data and index actions to be processed in the bulk request.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations in the bulk
   * request succeed, or `false` if any operation fails.
   */
  async bulkCreateDocument(
    bulkData:
      | Index_RequestBody
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
  ) {
    const response: Bulk_Response = await this.opensearchClient.bulk({
      body: bulkData,
    });

    return !response.body.errors;
  }

  /**
   * getDocumentById
   *
   * Retrieves a document by its ID from an OpenSearch index.
   *
   * This method sends a search request to the OpenSearch client with a match query
   * to find the document with the given ID. It returns a promise that resolves to
   * the document if found, or `undefined` if not found.
   *
   * @param {string} id - The ID of the document to retrieve.
   * @param {string} indexName - The name of the OpenSearch index.
   * @returns {Promise<EntityDto | undefined>} - A promise that resolves to the
   *   document if found, or `undefined` if not found.
   */
  async getDocumentById<EntityDto>(
    id: string,
    indexName: string
  ): Promise<EntityDto | undefined> {
    const response = await this.opensearchClient.search({
      index: indexName,
      body: { query: { match: { id: id } } },
    });

    return (response.body?.hits?.hits[0]?._source ?? undefined) as
      | EntityDto
      | undefined;
  }

  /**
   * getDocuments
   *
   * Retrieves documents from an OpenSearch index based on the given filter options and search request body.
   *
   * @param {string} indexName - The name of the OpenSearch index.
   * @param {Search_RequestBody} searchRequestBody - The search request body.
   * @param {EntityListingFilterOptions} entityFilterOptions - The filter options for the entity listing.
   * @returns {Promise<AwsOpensearchRecordListingResponseDTO<EntityDto[]>>} - A promise that resolves to the paginated result.
   */
  async getDocuments<
    EntityDto,
    EntityListingFilterOptions extends AwsOpensearchRecordListingFilterOptions
  >(
    indexName: string,
    searchRequestBody: Search_RequestBody,
    entityFilterOptions: EntityListingFilterOptions
  ) {
    // Send the search request
    const awsOpensearchResponse: Search_Response =
      await this.opensearchClient.search({
        index: indexName,
        body: searchRequestBody,
      });

    // Extract the hits
    const awsOpensearchHits: EntityDto[] =
      awsOpensearchResponse.body.hits.hits.map((hit: Hit) => {
        return hit._source as EntityDto;
      });

    // Prepare the paginated result
    const paginatedResult: AwsOpensearchRecordListingResponseDTO<EntityDto[]> =
      {
        data: awsOpensearchHits,
        pagination: {
          lastKey:
            awsOpensearchHits.length === entityFilterOptions.pageSize
              ? awsOpensearchlastKeyToBase64EncodeStr(
                  awsOpensearchResponse.body.hits.hits[
                    awsOpensearchResponse.body.hits.hits.length - 1
                  ].sort
                )
              : undefined,
          count: awsOpensearchHits.length,
          pageSize: entityFilterOptions.pageSize,
        },
      };

    // Return the paginated result
    return paginatedResult;
  }

  /**
   * updateDocumentById
   *
   * Updates a document by its ID in an OpenSearch index.
   *
   * This method sends an update request to the OpenSearch client with the
   * specified ID, index name, and update data. The update data is a partial
   * object that contains only the fields to be updated, and the values to
   * be updated with.
   *
   * The method returns a promise that resolves to the result of the update
   * operation.
   *
   * @see https://opensearch.org/docs/latest/clients/javascript/index/#updating-a-document
   *
   * @param {string} id - The ID of the document to update.
   * @param {string} indexName - The name of the OpenSearch index.
   * @param {Partial<EntityDto>} updateData - The update data for the document.
   * @returns {Promise<Update_Response>} - A promise that resolves to the result
   *   of the update operation.
   */
  async updateDocumentById<EntityDto>(
    id: string,
    indexName: string,
    updateData: Partial<EntityDto>
  ): Promise<Update_Response> {
    return this.opensearchClient.update({
      index: indexName,
      id,
      body: { doc: updateData },
    });
  }

  /**
   * deleteDocumentById
   *
   * Deletes a document by its ID from an OpenSearch index.
   *
   * This method sends a delete request to the OpenSearch client to remove
   * the document with the specified ID from the given index.
   *
   * @param {string} id - The ID of the document to delete.
   * @param {string} indexName - The name of the OpenSearch index from which to delete the document.
   * @returns {Promise<Delete_Response>} - A promise that resolves to the result of the delete operation.
   */
  async deleteDocumentById(
    id: string,
    indexName: string
  ): Promise<Delete_Response> {
    return this.opensearchClient.delete({
      index: indexName,
      id: id,
    });
  }

  /**
   * bulkDeleteDocument
   *
   * Deletes multiple documents from an OpenSearch index based on their IDs.
   *
   * This method constructs a bulk delete request for the specified document IDs
   * in the given index and sends it to the OpenSearch client. Each delete action
   * in the request is associated with a document ID, and the operation will
   * attempt to delete these documents from the index.
   *
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#delete
   *
   * @param {string[]} ids - An array of document IDs to delete from the index.
   * @param {string} indexName - The name of the OpenSearch index from which to delete the documents.
   * @returns {Promise<boolean>} - A promise that resolves when the bulk delete operation is completed.
   */
  async bulkDeleteDocument(ids: string[], indexName: string): Promise<boolean> {
    const bulkData: {
      delete: {
        _index: string;
        _id: string;
      };
    }[] = ids.map((id: string) => ({
      delete: { _index: indexName, _id: id },
    }));

    const response = await this.opensearchClient.bulk({ body: bulkData });

    return !response.body.errors;
  }
}

export { AwsOpensearchLibrary };
