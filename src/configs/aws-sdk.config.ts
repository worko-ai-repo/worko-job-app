// NPM Packages
import type { S3ClientConfig } from "@aws-sdk/client-s3";
import type { SESClientConfig } from "@aws-sdk/client-ses";
import type { SchedulerClientConfig } from "@aws-sdk/client-scheduler";

// Import configs
import APP_CONSTANTS from "./constants.config";

// Import libraries
import { AwsS3ClientLibrary } from "../libraries/aws-s3-client.library";
import { AwsSesClientLibrary } from "../libraries/aws-ses-client.library";
import { AwsSchedulerLibrary } from "../libraries/aws-scheduler-client.library";
import { AwsOpensearchLibrary } from "../libraries/aws-opensearch.library";
import { AwsBedrockClientLibrary } from "../libraries/aws-bedrock-client.library";
import { AwsClientLambdaLibrary } from "../libraries/aws-client-lambda.library";
import { AwsClientCognitoIdentityProviderLibrary } from "../libraries/aws-client-cognito-identity-provider.library";
import { AwsClientSecretsManagerLibrary } from "../libraries/aws-client-secrets-manager.libary";

/**
 * getAwsConfig
 * 
 * Generic configurations for AWS SDK v3 services.
 */
const getAwsConfig = () => ({
    credentials: process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL ? {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.APP_AWS_SESSION_TOKEN,
    } : undefined,
    region: process.env.APP_AWS_REGION,
});

/**
 * ****************************************************************************************************
 * AWS S3 Client Library
 * ****************************************************************************************************
 */

/**
 * awsS3ConfigOptions
 * 
 * AWS S3 specific configurations extending the "awsConfigOptions".
 */
const awsS3ConfigOptions: S3ClientConfig = getAwsConfig();

/**
 * awsS3ClientLibrary
 * 
 * Application/local S3 wrapper client to interact with AWS S3 service to perform regular activities
 */
const awsS3ClientLibrary: AwsS3ClientLibrary = new AwsS3ClientLibrary(awsS3ConfigOptions);
console.log("The 'awsS3ClientLibrary' is initialised.", { filePath: __filename, });

/**
 * ****************************************************************************************************
 * AWS SES Client Library
 * ****************************************************************************************************
 */

/**
 * awsSesConfigOptions
 * 
 * AWS SES specific configurations extending the "awsConfigOptions".
 */
const awsSesConfigOptions: SESClientConfig = getAwsConfig();

/**
 * awsSesClientLibrary
 * 
 * Application/local SES wrapper client to interact with AWS SES service to perform regular activities
 */
const awsSesClientLibrary: AwsSesClientLibrary = new AwsSesClientLibrary(awsSesConfigOptions);
console.log("The 'awsSesClientLibrary' is initialised.", { filePath: __filename, });

/**
 * ****************************************************************************************************
 * AWS Scheduler Client Library
 * ****************************************************************************************************
 */

/**
 * awsSchedulerConfigOptions
 * 
 * AWS Scheduler specific configurations extending the "awsConfigOptions".
 */
const awsSchedulerConfigOptions: SchedulerClientConfig = getAwsConfig();

/**
 * awsSchedulerClientLibrary
 * 
 * Application/local Scheduler wrapper client to interact with AWS Scheduler service to perform regular activities
 */
const awsSchedulerClientLibrary: AwsSchedulerLibrary = new AwsSchedulerLibrary(awsSchedulerConfigOptions);
console.log("The 'awsSchedulerClientLibrary' is initialised.", { filePath: __filename, });


/**
 * awsOpensearchLibrary
 *
 * NOTE: For this opensearch client, the `aws-sdk v3` is used
 */
const awsOpensearchLibrary: AwsOpensearchLibrary = new AwsOpensearchLibrary();
global.logger.info(`The "awsOpensearchLibrary" is initialised.`, {
  filePath: __filename,
});

/**
 * awsClientSecretsManagerLibrary
 *
 * NOTE: For this client secrets manager, the `aws-sdk v3` is used
 */
const awsClientSecretsManagerLibrary: AwsClientSecretsManagerLibrary =
  new AwsClientSecretsManagerLibrary();
global.logger.info(`The "awsClientSecretsManagerLibrary" is initialised.`);

/**
 * awsBedrockClientLibrary
 *
 * NOTE: For this bedrock client, the `aws-sdk v3` is used
 */
const awsBedrockClientLibrary: AwsBedrockClientLibrary =
  new AwsBedrockClientLibrary();
global.logger.info(`The "awsBedrockClientLibrary" is initialised.`);

/**
 * awsClientCognitoIdentityProviderLibrary
 *
 * NOTE: For this client, the `aws-sdk v3` is used
 */
const awsClientCognitoIdentityProviderLibrary: AwsClientCognitoIdentityProviderLibrary =
  new AwsClientCognitoIdentityProviderLibrary();
global.logger.info(
  `The "awsClientCognitoIdentityProviderLibrary" is initialised.`
);

/**
 * awsClientLambdaLibrary
 *
 * NOTE: For this lambda client, the `aws-sdk v3` is used
 */
const awsClientLambdaLibrary: AwsClientLambdaLibrary =
  new AwsClientLambdaLibrary();
global.logger.info(`The "awsClientLambdaLibrary" is initialised.`);

// Export the required resourses
export {
  awsS3ConfigOptions,
  awsSesConfigOptions,
  awsSchedulerConfigOptions,
  awsS3ClientLibrary,
  awsSesClientLibrary,
  awsSchedulerClientLibrary,
  awsOpensearchLibrary,
  awsBedrockClientLibrary,
  awsClientLambdaLibrary,
  awsClientCognitoIdentityProviderLibrary,
  awsClientSecretsManagerLibrary,
};
