/*
// Import vertexai package
import {
  GenerateContentResult,
  GenerativeModelPreview,
  VertexAI,
  VertexInit,
} from "@google-cloud/vertexai";

// Import libraries
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";

// Import dtos
import { GcpVertexAiSecretResponseDto } from "../dtos/Common.gcp-vertexai.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class GcpVertexAiLibrary {
  constructor() {
    if (
      !process.env.APP_GCP_VERTEX_AI_MODEL_NAME ||
      !process.env.APP_GCP_VERTEX_AI_LOCATION
    ) {
      throw new BaseError(
        "MODEL_NAME or LOCATION is not defined in .env file."
      );
    }
  }

  private vertexAI?: VertexAI = undefined;
  private readonly MODEL_NAME = process.env
    .APP_GCP_VERTEX_AI_MODEL_NAME as string;
  private readonly LOCATION = process.env.APP_GCP_VERTEX_AI_LOCATION as string;

  async initVertexAiArguments(): Promise<VertexInit> {
    const credentials: GcpVertexAiSecretResponseDto =
      await awsClientSecretsManagerLibrary.getParsedSecret<GcpVertexAiSecretResponseDto>(
        "GCP-secrect" // only vertex ai secrets are stored in aws secrets manager
      );
    return {
      project: process.env.APP_GCP_PROJECT_ID!,
      location: this.LOCATION,
      googleAuthOptions: {
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      },
    };
  }

  private async getVertexAI(): Promise<VertexAI> {
    if (!this.vertexAI) {
      const config: VertexInit = await this.initVertexAiArguments();
      this.vertexAI = new VertexAI(config);
    }
    return this.vertexAI;
  }

  async generateEmbedding(text: string): Promise<{
    embedding: number[];
    dimensions: number;
  }> {
    const vertexAI: VertexAI = await this.getVertexAI();
    const model: GenerativeModelPreview = vertexAI.preview.getGenerativeModel({
      model: this.MODEL_NAME,
    });

    const request = {
      contents: [{ role: "user", parts: [{ text }] }],
    };

    const result: GenerateContentResult = await model.generateContent(request);
    const embedding: string | undefined =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!embedding) {
      throw new BaseError(
        "Failed to generate embedding",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    const embeddingArray: number[] = JSON.parse(embedding);

    if (!Array.isArray(embeddingArray)) {
      global.logger.error(`Failed to generate embedding`, {
        methodName: this.generateEmbedding.name,
        embedding,
      });
      throw new BaseError(
        "Failed to generate embedding",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return {
      embedding: embeddingArray,
      dimensions: embeddingArray.length,
    };
  }
}

export { GcpVertexAiLibrary };
*/