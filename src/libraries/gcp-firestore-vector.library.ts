
// Import firestore package
import { Firestore, DocumentData, QueryDocumentSnapshot, VectorQuerySnapshot, FieldValue, Query, VectorQuery, VectorValue, WhereFilterOp } from "@google-cloud/firestore";

// Import sdk configs
import { 
  gcpAiPlatformEmbeddingLibrary,
  gcpFirestoreLibrary, 
} from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreVectorRecordListingFilterOptions } from "../dtos/Common.gcp-firestore-vector.dto";
import { GcpFirestoreRecordListingResponseDTO, GcpFirestoreRecordListingPaginationResponseDTO } from "../dtos/Common.gcp-firestore.dto";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * Search with vector embeddings
 * @see https://firebase.google.com/docs/firestore/vector-search
 */
class GcpFirestoreVectorLibrary {
  constructor() {
    if (
      !process.env.APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME 
    ) {
      global.logger.error(
        `MODEL_NAME is not defined in .env file.`,
        {
          modelName: process.env.APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME,
        }
      );
      throw new BaseError(
        "MODEL_NAME is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }
  private readonly MODEL_NAME = process.env.APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME as string;

  /**
   * Store vector embeddings
   * @see https://firebase.google.com/docs/firestore/vector-search#store_vector_embeddings
   */
  async createDocumentWithEmbedding<DbEntityDto extends DocumentData>(
    commonDbDetails: GcpFirestoreInteractionDto,
    data: DbEntityDto,
    embeddingText: string
  ): Promise<DbEntityDto | undefined> {
    const { embedding, dimensions } =
      await gcpAiPlatformEmbeddingLibrary.generateEmbedding(embeddingText);

    const documentWithEmbedding: DbEntityDto & {
      embeddingVector: VectorValue;
      embeddingGeneratedAt: string;
      embeddingModel: string;
      embeddingDimensions: number;
      embeddingOptimizedForSearch: boolean;
    } = {
      ...data,
      embeddingVector: FieldValue.vector(embedding),
      embeddingGeneratedAt: dateHelperObj.getISODate(),
      embeddingModel: this.MODEL_NAME,
      embeddingDimensions: dimensions,
      embeddingOptimizedForSearch: true,
    };

    return gcpFirestoreLibrary.createDocument<
      DbEntityDto & {
        embeddingVector: VectorValue;
        embeddingGeneratedAt: string;
        embeddingModel: string;
        embeddingDimensions: number;
        embeddingOptimizedForSearch: boolean;
      }
    >(commonDbDetails, documentWithEmbedding);
  }

  async updateDocumentWithEmbedding<
    UpdateEntityDto extends DocumentData,
    DbEntityDto
  >(
    commonDbDetails: GcpFirestoreInteractionDto,
    id: string,
    data: UpdateEntityDto,
    embeddingText: string,
    title?: string
  ): Promise<DbEntityDto | undefined> {
    // Regenerate the complete embedding vector for the updated text
    // Note: Embeddings cannot be partially updated - they must be fully regenerated
    // when the source text changes to maintain semantic accuracy
    const { embedding, dimensions } =
      await gcpAiPlatformEmbeddingLibrary.generateEmbedding(
        embeddingText,
        "RETRIEVAL_DOCUMENT",
        title
      );

    const updateData: UpdateEntityDto & {
      embeddingVector: VectorValue;
      embeddingGeneratedAt: string;
      embeddingModel: string;
      embeddingDimensions: number;
      embeddingOptimizedForSearch: boolean;
    } = {
      ...data,
      embeddingVector: FieldValue.vector(embedding),
      embeddingGeneratedAt: data.updatedAt,
      embeddingModel: this.MODEL_NAME,
      embeddingDimensions: dimensions,
      embeddingOptimizedForSearch: true,
    };

    global.logger.info("Updated document with new embedding", {
      documentId: id,
      embeddingDimensions: dimensions,
      textLength: embeddingText.length,
    });

    return gcpFirestoreLibrary.updateDocumentById<
      UpdateEntityDto & {
        embeddingVector: VectorValue;
        embeddingGeneratedAt: string;
        embeddingModel: string;
        embeddingDimensions: number;
        embeddingOptimizedForSearch: boolean;
      },
      DbEntityDto
    >(commonDbDetails, id, updateData);
  }

  async getDocumentsByEmbedding<DbEntityDto>(
    commonDbDetails: GcpFirestoreInteractionDto,
    queryText: string,
    filterOptions: GcpFirestoreVectorRecordListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]>> {
    // Generate embedding for the query text with RETRIEVAL_QUERY task type
    const { embedding } = await gcpAiPlatformEmbeddingLibrary.generateEmbedding(
      queryText,
      "RETRIEVAL_QUERY"
    );

    // 1. Calculate how many documents to skip and how many to fetch
    const skip: number = (filterOptions.pageNumber - 1) * filterOptions.pageSize;
    const fetchLimit: number = skip + filterOptions.pageSize;

    const db: Firestore = await gcpFirestoreLibrary.getFirestoreDatabase(
      commonDbDetails.databaseName
    );

    let query: Query = db.collection(
      commonDbDetails.collectionName
    );

    // Apply additional filters if provided
    if (filterOptions?.preFilters && filterOptions.preFilters.length > 0) {
      filterOptions.preFilters.forEach(
        (filter: {
          field: string;
          operator: WhereFilterOp;
          value: string;
        }) => {
          query = query.where(filter.field, filter.operator, filter.value);
        }
      );
    }

    // Use Firestore's native vector search with findNearest (updated API)
    const vectorQuery: VectorQuery<DocumentData, DocumentData> = query.findNearest({
      vectorField: "embeddingVector",
      queryVector: embedding,
      limit: fetchLimit, // fetch enough docs to cover the current page
      distanceMeasure: "COSINE",
      distanceThreshold: filterOptions.distanceThreshold,
      distanceResultField: "embeddingVectorDistance",
    });

    const snapshot: VectorQuerySnapshot<DocumentData, DocumentData> = await vectorQuery.get();

    // Manually skip the documents from previous pages
    const pageDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = snapshot.docs.slice(skip, fetchLimit);

    const pagination: GcpFirestoreRecordListingPaginationResponseDTO = {
      count: pageDocs.length,
      pageSize: filterOptions.pageSize,
      hasMore: snapshot.docs.length === fetchLimit,
    };

    /**
     * @note 
     *  1. Use below piece of code to get data from response
     *     response.data.map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data())
     *  2. We are not parsing the data here because it will be used differently in different places like if 
     *     we want to attach some additional data to the response then double iteration will be needed, so 
     *     to avoid that we are not parsing the data here.
     */
    const response: GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]> = {
      data: pageDocs,
      pagination,
    };

    return response;
  }

  async getDocumentsByEmbeddingWithoutPagination(
    commonDbDetails: GcpFirestoreInteractionDto,
    queryText: string,
    filterOptions: GcpFirestoreVectorRecordListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]>> {
    // Generate embedding for the query text with RETRIEVAL_QUERY task type
    const { embedding } = await gcpAiPlatformEmbeddingLibrary.generateEmbedding(
      queryText,
      "RETRIEVAL_QUERY"
    );
    const fetchLimit: number = filterOptions.pageSize;

    const db: Firestore = await gcpFirestoreLibrary.getFirestoreDatabase(
      commonDbDetails.databaseName
    );

    let query: Query = db.collection(
      commonDbDetails.collectionName
    );

    // Apply additional filters if provided
    if (filterOptions?.preFilters && filterOptions.preFilters.length > 0) {
      filterOptions.preFilters.forEach(
        (filter: {
          field: string;
          operator: WhereFilterOp;
          value: string;
        }) => {
          query = query.where(filter.field, filter.operator, filter.value);
        }
      );
    }

    // Use Firestore's native vector search with findNearest (updated API)
    const vectorQuery: VectorQuery<DocumentData, DocumentData> = query.findNearest({
      vectorField: "embeddingVector",
      queryVector: embedding,
      limit: fetchLimit, // fetch enough docs to cover the current page
      distanceMeasure: "COSINE",
      distanceThreshold: filterOptions.distanceThreshold,
      distanceResultField: "embeddingVectorDistance",
    });

    const snapshot: VectorQuerySnapshot<DocumentData, DocumentData> = await vectorQuery.get();

    const pagination: GcpFirestoreRecordListingPaginationResponseDTO = {
      count: snapshot.docs.length,
      pageSize: filterOptions.pageSize,
    };

    /**
     * @note 
     *  1. Use below piece of code to get data from response
     *     response.data.map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data())
     *  2. We are not parsing the data here because it will be used differently in different places like if 
     *     we want to attach some additional data to the response then double iteration will be needed, so 
     *     to avoid that we are not parsing the data here.
     */
    const response: GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]> = {
      data: snapshot.docs,
      pagination,
    };

    return response;
  }
}

/**
 * @description Gcp Firestore Vector Search Library - Combines Firestore + AI Platform for embedding-based operations.
 * 
 * @note According to our conventions the SDK instances go in gcp-sdk.config.ts, but this library
 * interacts with multiple services and provides business logic beyond basic SDK operations.
 */
const gcpFirestoreVectorLibrary: GcpFirestoreVectorLibrary = new GcpFirestoreVectorLibrary();
export { 
  GcpFirestoreVectorLibrary, 
  gcpFirestoreVectorLibrary 
};
