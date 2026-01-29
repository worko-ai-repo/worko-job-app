
// Import aiplatform package
import { PredictionServiceClient } from "@google-cloud/aiplatform";
type PredictionServiceClientConfig = ConstructorParameters<typeof PredictionServiceClient>[0];

// Import sdk configs
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";

// Import dtos
import { GcpAiplatformSecretResponseDto } from "../dtos/Common.gcp-aiplatform.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class GcpAiPlatformEmbeddingLibrary {
  constructor() {
    if (
      !process.env.APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME ||
      !process.env.APP_GCP_AI_PLATFORM_EMBEDDING_LOCATION ||
      !process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM ||
      !process.env.APP_GCP_PROJECT_ID
    ) {
      global.logger.error(
        `MODEL_NAME or LOCATION is not defined in .env file.`,
        {
          modelName: process.env.APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME,
          location: process.env.APP_GCP_AI_PLATFORM_EMBEDDING_LOCATION,
          projectId: process.env.APP_GCP_PROJECT_ID,
          awsSecretsManager: process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM,
        }
      );
      throw new BaseError(
        "MODEL_NAME or LOCATION is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  private predictionClient?: PredictionServiceClient;
  private readonly MODEL_NAME = process.env
    .APP_GCP_AI_PLATFORM_EMBEDDING_MODEL_NAME as string;
  private readonly LOCATION = process.env
    .APP_GCP_AI_PLATFORM_EMBEDDING_LOCATION as string;
  private readonly PROJECT_ID: string = process.env.APP_GCP_PROJECT_ID as string;

  async initAiPlatformEmbeddingArguments(): Promise<PredictionServiceClientConfig> {
    const credentials: GcpAiplatformSecretResponseDto =
      await awsClientSecretsManagerLibrary.getParsedSecret<GcpAiplatformSecretResponseDto>(
        process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM as string
      );
    const config: PredictionServiceClientConfig = {
      apiEndpoint: `${this.LOCATION}-aiplatform.googleapis.com`,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    };

    return config;
  }

  private async getAiPlatformPredictionClient(): Promise<PredictionServiceClient> {
    if (!this.predictionClient) {
      const config: PredictionServiceClientConfig =
        await this.initAiPlatformEmbeddingArguments();
      this.predictionClient = new PredictionServiceClient(config);
    }
    return this.predictionClient;
  }

  async generateEmbedding(
    text: string,
    taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" = "RETRIEVAL_DOCUMENT",
    title?: string,
    retries: number = 3
  ): Promise<{
    embedding: number[];
    dimensions: number;
  }> {
    const predictionClient: PredictionServiceClient =
      await this.getAiPlatformPredictionClient();

    const endpoint: string = `projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/${this.MODEL_NAME}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Build instance according to API documentation
        const fields: any = {
          task_type: { stringValue: taskType },
          content: { stringValue: text },
        };

        if (title) {
          fields.title = { stringValue: title };
        }

        const instanceValue = {
          structValue: { fields },
        };

        const request = {
          endpoint,
          instances: [instanceValue],
        };

        const [response] = await predictionClient.predict(request);
        const predictions = response.predictions;

        if (!predictions || predictions.length === 0) {
          throw new BaseError("No embedding returned from API");
        }

        const prediction = predictions[0] as any;

        // According to documentation: prediction.embeddings.values
        // In structValue format: prediction.structValue.fields.embeddings.structValue.fields.values.listValue.values
        const embeddingArray =
          prediction.structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values?.map(
            (v: any) => v.numberValue
          );

        if (
          !embeddingArray ||
          !Array.isArray(embeddingArray) ||
          embeddingArray.length === 0
        ) {
          global.logger.error(
            "Prediction structure:",
            JSON.stringify(prediction, null, 2)
          );
          throw new BaseError(
            `Invalid embedding format. Expected array, got: ${typeof embeddingArray}`,
            HttpStatusCode.INTERNAL_SERVER_ERROR_500
          );
        }

        // Validate dimensions against Firestore limit
        const MAX_FIRESTORE_DIMENSIONS: number = 2048;
        if (embeddingArray.length > MAX_FIRESTORE_DIMENSIONS) {
          global.logger.error("Embedding dimensions exceed Firestore limit", {
            dimensions: embeddingArray.length,
            limit: MAX_FIRESTORE_DIMENSIONS,
            model: this.MODEL_NAME,
          });
          throw new BaseError(
            `Embedding dimensions (${embeddingArray.length}) exceed Firestore limit (${MAX_FIRESTORE_DIMENSIONS}). ` +
              `Consider using a model with fewer dimensions like text-embedding-004 (768 dimensions).`,
            HttpStatusCode.INTERNAL_SERVER_ERROR_500
          );
        }

        global.logger.info("Successfully generated embedding", {
          dimensions: embeddingArray.length,
          taskType,
          model: this.MODEL_NAME,
        });

        return {
          embedding: embeddingArray,
          dimensions: embeddingArray.length,
        };
      } catch (error: any) {
        const isRateLimitError =
          error?.message?.includes("429") ||
          error?.message?.includes("RESOURCE_EXHAUSTED") ||
          error?.message?.includes("Quota exceeded");

        if (isRateLimitError && attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          global.logger.warn(
            `Rate limit hit, retrying in ${delay}ms (attempt ${
              attempt + 1
            }/${retries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          global.logger.error("Failed to generate embedding", {
            methodName: this.generateEmbedding.name,
            attempt,
            retries,
            error,
          });

          throw new BaseError(
            "Failed to generate embedding",
            HttpStatusCode.INTERNAL_SERVER_ERROR_500
          );
        }
      }
    }

    throw new BaseError("Failed to generate embedding after retries", HttpStatusCode.INTERNAL_SERVER_ERROR_500);
  }
}

export { GcpAiPlatformEmbeddingLibrary };
