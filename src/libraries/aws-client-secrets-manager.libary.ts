import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
  SecretsManagerClientConfig,
} from "@aws-sdk/client-secrets-manager";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * AwsClientSecretsManagerLibrary
 */
class AwsClientSecretsManagerLibrary {
  initClientSecretsManagerArguments(): SecretsManagerClientConfig {
    let config: SecretsManagerClientConfig;

    config = {
      region: process.env.APP_SLS_REGION,
    };

    return config;
  }

  client = new SecretsManagerClient(this.initClientSecretsManagerArguments());

  async getSecret(secretName: string): Promise<GetSecretValueCommandOutput> {
    try {
      let response: GetSecretValueCommandOutput = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
      return response;
    } catch (error) {
      global.logger.error("Failed to get secret", {
        methodName: this.getSecret.name,
        error,
      });

      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw new BaseError(
        `Failed to get secret`,
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  async getParsedSecret<ParsedSecretStringResponseDto>(
    secretName: string
  ): Promise<ParsedSecretStringResponseDto> {
    const response: GetSecretValueCommandOutput = await this.getSecret(
      secretName
    );
    return JSON.parse(response.SecretString || "");
  }
}

export { AwsClientSecretsManagerLibrary };
