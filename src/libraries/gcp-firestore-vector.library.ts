// Import firestore package
import {
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  VectorQuerySnapshot,
  FieldValue,
} from "@google-cloud/firestore";

// Import sdk configs
import {
  gcpAiPlatformLibrary,
  gcpFirestoreLibrary,
} from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { VectorQueryResult } from "../dtos/Common.gcp-firestore-vector.dto";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class GcpFirestoreVectorLibrary {
  constructor() {
    if (!process.env.APP_GCP_AI_PLATFORM_MODEL_NAME) {
      global.logger.error(`MODEL_NAME is not defined in .env file.`, {
        modelName: process.env.APP_GCP_AI_PLATFORM_MODEL_NAME,
      });
      throw new BaseError(
        "MODEL_NAME is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }
  private readonly MODEL_NAME = process.env
    .APP_GCP_AI_PLATFORM_MODEL_NAME as string;

  async createDocumentWithEmbedding<DbEntityDto extends DocumentData>(
    commonDbDetails: GcpFirestoreInteractionDto,
    data: DbEntityDto,
    embeddingText: string
  ): Promise<DbEntityDto | undefined> {
    const { embedding, dimensions } =
      await gcpAiPlatformLibrary.generateEmbedding(embeddingText);

    const documentWithEmbedding: DbEntityDto & {
      embeddingVector: FieldValue;
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
        embeddingVector: FieldValue;
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
      await gcpAiPlatformLibrary.generateEmbedding(
        embeddingText,
        "RETRIEVAL_DOCUMENT",
        title
      );

    const updateData: UpdateEntityDto & {
      embeddingVector: FieldValue;
      embeddingRegeneratedAt: string;
      embeddingModel: string;
      embeddingDimensions: number;
      embeddingOptimizedForSearch: boolean;
    } = {
      ...data,
      embeddingVector: FieldValue.vector(embedding),
      embeddingRegeneratedAt: data.updatedAt,
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
        embeddingVector: FieldValue;
        embeddingRegeneratedAt: string;
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
    options?: {
      limit?: number;
      page?: number;
      additionalFilters?: {
        field: string;
        operator: FirebaseFirestore.WhereFilterOp;
        value: any;
      }[];
      distanceThreshold?: number;
    }
  ): Promise<{
    results: VectorQueryResult<DbEntityDto>[];
    pagination: {
      page: number;
      limit: number;
      totalResults: number;
      hasMore: boolean;
    };
  }> {
    const limit = options?.limit || 10;
    const page = options?.page || 1;
    const additionalFilters = options?.additionalFilters;
    const distanceThreshold = options?.distanceThreshold;

    // Generate embedding for the query text with RETRIEVAL_QUERY task type
    const { embedding } = await gcpAiPlatformLibrary.generateEmbedding(
      queryText,
      "RETRIEVAL_QUERY"
    );
    const db: Firestore = await gcpFirestoreLibrary.getFirestoreDatabase(
      commonDbDetails.databaseName
    );

    let query: FirebaseFirestore.Query = db.collection(
      commonDbDetails.collectionName
    );

    // Apply additional filters if provided
    if (additionalFilters && additionalFilters.length > 0) {
      additionalFilters.forEach((filter) => {
        query = query.where(filter.field, filter.operator, filter.value);
      });
    }

    // Fetch more results than needed for pagination
    // We need to fetch all results up to the current page to properly paginate
    const fetchLimit = limit * page + 1; // +1 to check if there are more results

    // Use Firestore's native vector search with findNearest (updated API)
    const vectorQuery = query.findNearest({
      vectorField: "embeddingVector",
      queryVector: embedding,
      limit: fetchLimit,
      distanceMeasure: "COSINE",
    });

    const snapshot: VectorQuerySnapshot<DocumentData, DocumentData> =
      await vectorQuery.get();

    const allResults: VectorQueryResult<DbEntityDto>[] = [];

    snapshot.forEach(
      (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
        const data = doc.data() as DbEntityDto & { embeddingVector: number[] };
        global.logger.info(
          "Found document with embedding before calculating cosine distance",
          { documentId: doc.id }
        );

        // Calculate distance (lower distance = higher similarity = better match)
        const distance: number = this.calculateCosineDistance(
          embedding,
          data.embeddingVector
        );

        // Calculate similarity score (0-100, higher is better)
        const score = Math.max(0, Math.min(100, (1 - distance) * 100));

        // Apply distance threshold if provided
        if (!distanceThreshold || distance <= distanceThreshold) {
          allResults.push({
            document: data,
            distance,
            score, // Add score for easier interpretation
          });
        }
      }
    );

    // Results are already sorted by distance (best matches first) from Firestore
    // But we'll ensure they're sorted by score (descending) for clarity
    allResults.sort((a, b) => (a.score || 0) - (b.score || 0)).reverse();

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    const hasMore = allResults.length > endIndex;

    global.logger.info("Vector search completed", {
      queryText,
      totalResults: allResults.length,
      page,
      limit,
      returnedResults: paginatedResults.length,
      hasMore,
      hasFilters: !!additionalFilters?.length,
    });

    return {
      results: paginatedResults,
      pagination: {
        page,
        limit,
        totalResults: allResults.length,
        hasMore,
      },
    };
  }

  /**
   * Smart update: Only regenerates embedding if the text has actually changed
   * This is an optimization to avoid unnecessary API calls
   */
  async updateDocumentWithEmbeddingIfChanged<
    UpdateEntityDto extends DocumentData,
    DbEntityDto
  >(
    commonDbDetails: GcpFirestoreInteractionDto,
    id: string,
    data: UpdateEntityDto,
    newEmbeddingText: string,
    oldEmbeddingText?: string,
    title?: string
  ): Promise<DbEntityDto | undefined> {
    // If text hasn't changed, skip embedding regeneration
    if (oldEmbeddingText && oldEmbeddingText === newEmbeddingText) {
      global.logger.info("Text unchanged, skipping embedding regeneration", {
        documentId: id,
      });

      return gcpFirestoreLibrary.updateDocumentById<
        UpdateEntityDto,
        DbEntityDto
      >(commonDbDetails, id, data);
    }

    // Text changed, regenerate embedding
    return this.updateDocumentWithEmbedding<UpdateEntityDto, DbEntityDto>(
      commonDbDetails,
      id,
      data,
      newEmbeddingText,
      title
    );
  }

  private calculateCosineDistance(vec1: number[], vec2: number[]): number {
    let dotProduct: number = 0;
    let norm1: number = 0;
    let norm2: number = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const similarity: number =
      dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return 1 - similarity;
  }
}

/**
 * @description Gcp Firestore Vector Search Library - Combines Firestore + AI Platform for embedding-based operations.
 *
 * @note According to our conventions the SDK instances go in gcp-sdk.config.ts, but this library
 * interacts with multiple services and provides business logic beyond basic SDK operations.
 */
const gcpFirestoreVectorLibrary: GcpFirestoreVectorLibrary =
  new GcpFirestoreVectorLibrary();
export { GcpFirestoreVectorLibrary, gcpFirestoreVectorLibrary };
