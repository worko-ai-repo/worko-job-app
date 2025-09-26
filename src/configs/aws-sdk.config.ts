// NPM Packages
import AWS from "aws-sdk";

// Import configs
import APP_CONSTANTS from "./constants.config";

// Import libraries
import { AwsS3ClientLibrary } from "../libraries/aws-s3-client.library";
import { AwsSesClientLibrary } from "../libraries/aws-ses-client.library";
import { AwsSqsClientLibrary } from "../libraries/aws-sqs-client.library";
import { AwsSchedulerLibrary } from "../libraries/aws-scheduler-client.library";
import { AwsOpensearchLibrary } from "../libraries/aws-opensearch.library";
import { AwsBedrockClientLibrary } from "../libraries/aws-bedrock-client.library";
import { AwsClientLambdaLibrary } from "../libraries/aws-client-lambda.library";
import { AwsClientCognitoIdentityProviderLibrary } from "../libraries/aws-client-cognito-identity-provider.library";

/**
 * awsConfigOptions
 *
 * Generic configurations for the AWS services.
 */
let awsConfigOptions: AWS.ConfigurationOptions = {};

// For the "local" env/stage use the credentials from the environment config,
// and for all other envs/stages the permissions from the lambda function would be used.
if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
  awsConfigOptions = {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.APP_AWS_SESSION_TOKEN,
    region: process.env.APP_AWS_REGION,
  };
}

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
const awsS3ConfigOptions: AWS.S3.ClientConfiguration = {
  ...awsConfigOptions,
  apiVersion: "2023-09-08",
};

/**
 * awsS3ClientLibrary
 *
 * Application/local S3 wrapper client to interact with AWS S3 service to perform regular activities
 */
const awsS3ClientLibrary: AwsS3ClientLibrary = new AwsS3ClientLibrary(
  awsS3ConfigOptions
);
console.log("The 'awsS3ClientLibrary' is initialised.", {
  filePath: __filename,
});

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
const awsSesConfigOptions: AWS.SES.ClientConfiguration = {
  ...awsConfigOptions,
  apiVersion: "2010-12-01",
};

/**
 * awsSesClientLibrary
 *
 * Application/local SES wrapper client to interact with AWS SES service to perform regular activities
 */
const awsSesClientLibrary: AwsSesClientLibrary = new AwsSesClientLibrary(
  awsSesConfigOptions
);
console.log("The 'awsSesClientLibrary' is initialised.", {
  filePath: __filename,
});

/**
 * ****************************************************************************************************
 * AWS SQS Client Library
 * ****************************************************************************************************
 */

/**
 * awsSqsConfigOptions
 *
 * AWS SQS specific configurations extending the "awsConfigOptions".
 */
const awsSqsConfigOptions: AWS.SQS.ClientConfiguration = {
  ...awsConfigOptions,
};

/**
 * awsSqsClientLibrary
 *
 * Application/local SQS wrapper client to interact with AWS SQS service to perform regular activities
 */
const awsSqsClientLibrary: AwsSqsClientLibrary = new AwsSqsClientLibrary(
  awsSqsConfigOptions
);
console.log("The 'awsSqsClientLibrary' is initialised.", {
  filePath: __filename,
});

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
const awsSchedulerConfigOptions: AWS.Scheduler.ClientConfiguration = {
  ...awsConfigOptions,
};

/**
 * awsSchedulerClientLibrary
 *
 * Application/local Scheduler wrapper client to interact with AWS Scheduler service to perform regular activities
 */
const awsSchedulerClientLibrary: AwsSchedulerLibrary = new AwsSchedulerLibrary(
  awsSchedulerConfigOptions
);
console.log("The 'awsSchedulerClientLibrary' is initialised.", {
  filePath: __filename,
});

// ****************************************************************************************************
// AWS DynamoDB Client Library
// ****************************************************************************************************

/**
 * awsDynamoDBConfigOptions
 *
 * AWS DynamoDB specific configurations extending the "awsConfigOptions".
 */
const awsDynamoDBConfigOptions: AWS.DynamoDB.ClientConfiguration = {
  ...awsConfigOptions,
};

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
 * awsBedrockClientLibrary
 * 
 * NOTE: For this bedrock client, the `aws-sdk v3` is used
 */
const awsBedrockClientLibrary: AwsBedrockClientLibrary = new AwsBedrockClientLibrary();
global.logger.info(`The "awsBedrockClientLibrary" is initialised.`);

/**
 * awsClientCognitoIdentityProviderLibrary
 * 
 * NOTE: For this client, the `aws-sdk v3` is used
 */
const awsClientCognitoIdentityProviderLibrary: AwsClientCognitoIdentityProviderLibrary = new AwsClientCognitoIdentityProviderLibrary();
global.logger.info(`The "awsClientCognitoIdentityProviderLibrary" is initialised.`);

/**
 * awsClientLambdaLibrary
 * 
 * NOTE: For this lambda client, the `aws-sdk v3` is used
 */
const awsClientLambdaLibrary: AwsClientLambdaLibrary = new AwsClientLambdaLibrary();
global.logger.info(`The "awsClientLambdaLibrary" is initialised.`);

// Export the required resourses
export {
  awsConfigOptions,
  awsS3ConfigOptions,
  awsSesConfigOptions,
  awsSqsConfigOptions,
  awsSchedulerConfigOptions,
  awsDynamoDBConfigOptions,
  awsS3ClientLibrary,
  awsSesClientLibrary,
  awsSqsClientLibrary,
  awsSchedulerClientLibrary,
  awsOpensearchLibrary,
  awsBedrockClientLibrary,
  awsClientLambdaLibrary,
  awsClientCognitoIdentityProviderLibrary
};
