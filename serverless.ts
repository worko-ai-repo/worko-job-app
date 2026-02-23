/**
 * In place of "serverless.yml" file we are using "serverless.ts" file because we are using typescript language in
 * our entire project but ".yml" extension uses YAML language to define the structure of the Serverless configuration object.
 * To maintain consistency, we are using "serverless.ts" file which uses TypeScript language to define the structure of the
 * Serverless configuration object.
 *
 * To use "serverless.ts" file instead of "serverless.yml" file, we must install below dependencies in devDependencies using the following command:
 * npm install -D @serverless/typescript ts-node
 */


/**
 * Imports the `AWS` type from the `@serverless/typescript` package.
 * This type is used to define the structure of the Serverless configuration object.
 * It helps with TypeScript type checking and ensures that the configuration adheres to the expected format.
 */
import type { AWS } from "@serverless/typescript";

// Import dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import constants
import APP_CONSTANTS from "./src/configs/constants.config";

// Import enums
import { ScheduleJobType } from "./src/enums/ScheduleJob.enum";

/**
 * Serverless configuration for the "worko-job-app" service.
 * This configuration includes provider settings, plugins, package options, and function definitions.
 * 
 * @type {AWS}
 */
const serverlessConfiguration: AWS = {
  service: "worko-job-app", // Name of the service

  frameworkVersion: "^3.40.0",

  useDotenv: true, // Enables the use of the `.env` file for environment variables.

  package: {
    excludeDevDependencies: true,
  },

  /**
   * Plugins used in the Serverless configuration to enhance the build and deployment process.
   */
  plugins: [
    "serverless-offline", // Enables local testing of the APIs
    "serverless-dotenv-plugin", // Loads environment variables from `.env` files.
    "serverless-webpack", // Optimizes the build process using Webpack for packaging Lambda functions.
  ],

  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      packager: 'npm',
      includeModules: {
        forceExclude: [
          "@aws-sdk/client-bedrock",
          "@aws-sdk/client-cognito-identity-provider",
          "@aws-sdk/client-scheduler",
          "@aws-sdk/client-secrets-manager",
          "@aws-sdk/credential-provider-node",
          "@aws-sdk/client-ses",
          "@aws-sdk/client-s3",
          "@aws-sdk/client-scheduler",
          "@aws-sdk/s3-request-presigner",
          "@aws-sdk/lib-storage"
        ]
      }
    },
    app: {
      STAGE: "${env:APP_SLS_STAGE}",
    },

    aws: {
      APP_AWS_ACCOUNT_ID: "${env:APP_AWS_ACCOUNT_ID}",
      APP_AWS_VPC: "${env:APP_AWS_VPC}",
      APP_AWS_SECURITY_GROUP: "${env:APP_AWS_SECURITY_GROUP}",
      APP_AWS_SUBNET1: "${env:APP_AWS_SUBNET1}",
      APP_AWS_SUBNET2: "${env:APP_AWS_SUBNET2}",
      APP_AWS_COGNITO_USER_POOL_ID: "${env:APP_AWS_COGNITO_USER_POOL_ID}",
      APP_SLS_REGION: "${env:APP_SLS_REGION}",
      APP_OPENSEARCH_SERVICE: "${env:APP_OPENSEARCH_SERVICE}",
      APP_AWS_BEDROCK_MODEL_NAME: "${env:APP_AWS_BEDROCK_MODEL_NAME}",
      APP_AWS_BEDROCK_SERVICE_ROLE: "${env:APP_AWS_BEDROCK_SERVICE_ROLE}",
      APP_AWS_EVENT_BRIDGE_SCHEDULE_INVOKE_LAMBDA_ROLE:
        "${env:APP_AWS_EVENT_BRIDGE_SCHEDULE_INVOKE_LAMBDA_ROLE}",
      APP_AWS_S3_VECTOR_JOB_CRUD_LAMBDA_NAME:
        "${env:APP_AWS_S3_VECTOR_JOB_CRUD_LAMBDA_NAME}",
      APP_AWS_S3_VECTOR_JOB_SEARCH_LAMBDA_NAME:
        "${env:APP_AWS_S3_VECTOR_JOB_SEARCH_LAMBDA_NAME}",
      APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE_ARN_SECRET:
        "${env:APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE_ARN_SECRET}",
      APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM_ARN_SECRET:
        "${env:APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM_ARN_SECRET}",
    },
  },

  provider: {
    name: "aws",

    runtime: "nodejs20.x",

    /**
     * @todo:
     *  1. This is not working. We need to fix this.
     *     @see https://www.serverless.com/framework/docs/guides/variables/env-vars#reference-environment-variables
     *  2. "${env:APP_SLS_STAGE}"  ->  This is not working by giving below error:-
     *    Error:
     *      Cannot resolve serverless.ts: Variables resolution errored with:
     *        - Value not found at "env" source
     *
     * As of now while deploying the application we are specifying stage in the run command.
     *  ex:- 1. sls deploy --stage=dev
     *       2. sls deploy --stage=prod
     */
    stage: process.env.APP_SLS_STAGE,

    /**
     * region
     *
     * The type of `region` is a string literal type,so that's why we are not assigning dynamic value.
     *
     * @type {"ap-south-1" | "us-east-1" | "us-east-2" | "us-gov-east-1" | "us-gov-west-1" | "us-iso-east-1" | "us-iso-west-1" | "us-isob-east-1" | "us-west-1" | "us-west-2" | "af-south-1" | ... 24 more ... | undefined}
     */
    region: "ap-south-1",

    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
        ],
        Resource: [
          /**
           * arn:aws:dynamodb:{region}:{account-id}:table/{tablename}
           */

          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko/index/GSI1",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko/index/GSI2",

          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI1",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI2",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI3",

          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-count",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-count/index/GSI1",
        ],
      },

      {
        Effect: "Allow",
        Action: [
          "ses:SendEmail",
          "ses:GetContactList",
          "ses:SendCustomVerificationEmail",
          "ses:UpdateContactList",
          "ses:UpdateEmailTemplate",
          "ses:GetEmailIdentityPolicies",
          "ses:GetEmailTemplate",
          "ses:CreateEmailTemplate",
          "ses:SendBulkEmail",
          "ses:GetEmailIdentity",
          "ses:CreateTemplate",
          "ses:UpdateTemplate",
          "ses:GetTemplate",
          "ses:DeleteTemplate",
          "ses:SendTemplatedEmail",
          "ses:CreateTemplate",
        ],
        Resource: "*",
      },

      {
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
        Resource: ["arn:aws:s3:::worko-app-*","arn:aws:s3:::worko-ui-comp-logo-*", "arn:aws:s3:::*/*"],
      },

      {
        Effect: "Allow",
        Action: ["lambda:InvokeFunction", "lambda:InvokeAsync"],
        Resource: [
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-jd-resume-matching",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-description-parser",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-user-matching-score-job",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-rag-feedback-ingestion",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:${self:custom.aws.APP_AWS_S3_VECTOR_JOB_SEARCH_LAMBDA_NAME}",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:${self:custom.aws.APP_AWS_S3_VECTOR_JOB_CRUD_LAMBDA_NAME}",
          // "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-app-${self:custom.app.STAGE}-app-opensearch-operations",
          // "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-app-${self:custom.app.STAGE}-app-migrate-jobs",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-app-${self:custom.app.STAGE}-appInvokeLambda",
        ],
      },

      {
        Effect: "Allow",
        Action: [
          "iam:PassRole",
          "scheduler:GetSchedule",
          "scheduler:UpdateSchedule",
          "scheduler:CreateSchedule",
          "scheduler:DeleteSchedule",
        ],
        Resource: [
          "arn:aws:iam::${self:custom.aws.APP_AWS_ACCOUNT_ID}:role/${self:custom.aws.APP_AWS_EVENT_BRIDGE_SCHEDULE_INVOKE_LAMBDA_ROLE}",
          "arn:aws:scheduler:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:schedule/*/*",
        ],
      },

      {
        Effect: "Allow",
        Action: [
          "scheduler:GetScheduleGroup",
          "scheduler:DeleteScheduleGroup",
          "scheduler:CreateScheduleGroup",
        ],
        Resource:
          "arn:aws:scheduler:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:schedule-group/*",
      },

      {
        Effect: "Allow",
        Action: [
          "cognito-idp:AdminAddUserToGroup",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminListGroupsForUser",
        ],
        Resource:
          "arn:aws:cognito-idp:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:userpool/${self:custom.aws.APP_AWS_COGNITO_USER_POOL_ID}",
      },

      /**
       * Identity and Access Management in Amazon OpenSearch Service
       * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html
       */
      {
        Effect: "Allow",
        Action: [
          "es:ESHttpGet", // Required for search queries.
          "es:ESHttpPut", //  Required for creating/updating documents.
          "es:ESHttpPost", // Required for bulk operations and indexing.
          "es:ESHttpDelete", // Required for deleting documents.
        ],
        Resource:
          "arn:aws:${self:custom.aws.APP_OPENSEARCH_SERVICE}:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:domain/worko",
      },

      {
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ],
        Resource:
          "arn:aws:sqs:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:worko-job-app-event-queue",
      },

      /**
       * Required permissions for an IAM identity to submit and manage batch inference jobs
       * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference-permissions.html
       */
      {
        Effect: "Allow",
        Action: ["iam:PassRole", "bedrock:CreateModelInvocationJob"],
        Resource: [
          "arn:aws:bedrock:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:model-invocation-job/*",
          "arn:aws:bedrock:${self:custom.aws.APP_SLS_REGION}::foundation-model/${self:custom.aws.APP_AWS_BEDROCK_MODEL_NAME}",
          "arn:aws:iam::${self:custom.aws.APP_AWS_ACCOUNT_ID}:role/service-role/${self:custom.aws.APP_AWS_BEDROCK_SERVICE_ROLE}",
        ],
      },
      {
        Effect: "Allow",
        Action: ["secretsmanager:GetSecretValue"],
        Resource: [
          "arn:aws:secretsmanager:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:secret:${self:custom.aws.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE_ARN_SECRET}",
          "arn:aws:secretsmanager:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:secret:${self:custom.aws.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM_ARN_SECRET}",
        ],
      },
    ],
  },

  /**
   * AWS Lambda Functions
   *
   * @see https://www.serverless.com/framework/docs/providers/aws/guide/functions#aws-lambda-functions
   */
  functions: {
    /**
     * workoJobApp
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-workoJobApp`
     *  2. `worko-job-app-dev-workoJobApp`
     *  3. `worko-job-app-prod-workoJobApp`
     */
    workoJobApp: {
      handler: "dist/src/app.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)

      /**
       * events: REST (API Gateway v1)
       *
       * HTTP Endpoint with Extended Options
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoint-with-extended-options
       *
       * Enabling CORS
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors
       *
       * HTTP Endpoints with Custom Authorizers
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers
       */
      events: [
        {
          // This handles the Preflight (OPTIONS) and has NO Authorizer
          http: {
            path: "/",
            method: "OPTIONS",
            cors: true,
          },
        },
        {
          http: {
            path: "/{proxy+}",
            method: "ANY",
            cors: {
              origin: "*",
              headers: [
                "Content-Type",
                "X-Amz-Date",
                "Authorization",
                "X-Api-Key",
                "X-Amz-Security-Token",
                "X-Amz-User-Agent",
                "X-Amzn-Trace-Id",
              ],
              allowCredentials: false,
            },
            authorizer: {
              type: "request",
              arn: "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-auth",
              // identitySource: "method.request.header.Authorization"
            },
          },
        },
      ],
    },

    /**
     * app-scheduler-handler
     *
     * Using `AWS EventBridge` service to schedule jobs
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-app-scheduler-handler`
     *  2. `worko-job-app-dev-app-scheduler-handler`
     *  3. `worko-job-app-prod-app-scheduler-handler`
     */
    "app-scheduler-handler": {
      handler: "dist/src/app-scheduler.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
    },

    /**
     * app-scheduler-bright-data-external-jobs
     *
     * Using `AWS EventBridge` service to schedule jobs
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-app-scheduler-bright-data-external-jobs`
     *  2. `worko-job-app-dev-app-scheduler-bright-data-external-jobs`
     *  3. `worko-job-app-prod-app-scheduler-bright-data-external-jobs`
     */
    "app-scheduler-bright-data-external-jobs": {
      handler: "dist/src/app-scheduler-bright-data-external-jobs.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
    },

    /**
     * app-scheduler-external-jobs
     *
     * Using `AWS EventBridge` service
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-app-scheduler-external-jobs`
     *  2. `worko-job-app-dev-app-scheduler-external-jobs`
     *  3. `worko-job-app-prod-app-scheduler-external-jobs`
     */
    "app-scheduler-external-jobs": {
      handler: "dist/src/app-scheduler-external-jobs.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
      events:
        process.env.APP_SLS_STAGE === APP_CONSTANTS.STAGES.PROD
          ? [
              {
                schedule: {
                  name: "cleanup-old-unapplied-jobs-schedule-${self:custom.app.STAGE}", // Name can be specified for a schedule event. This is not a required property.
                  description:
                    "Triggers to hard and soft delete old unapplied external jobs according to cron expression", // Description can be specified for a schedule event. This is not a required property.

                  rate: ["cron(30 14 ? * SUN *)"],
                  enabled: true,
                  input: {
                    scheduleJob: {
                      type: ScheduleJobType.BRIGHT_DATA_JOB_HARD_DELETE_OLD_JOBS,
                    },
                  },
                },
              },

              {
                schedule: {
                  name: "bright-data-external-job-schedule-${self:custom.app.STAGE}", // Name can be specified for a schedule event. This is not a required property.
                  description:
                    "Triggers to retrieve bright data external job.", // Description can be specified for a schedule event. This is not a required property.
                  rate: ["rate(30 days)"], // ["rate(5 minutes)"]
                  enabled: true,
                  input: {
                    scheduleJob: {
                      type: ScheduleJobType.BRIGHT_DATA_JOB_TO_CREATE_SNAPSHOT,
                    },
                  },
                },
              },
            ]
          : [],
    },

    /**
     * app-scheduler-candidate-job-alert
     * 
     * Using `AWS EventBridge` service
     * 
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * 
     * Ex:
     *  1. `worko-job-app-local-app-scheduler-candidate-job-alert`
     *  2. `worko-job-app-dev-app-scheduler-candidate-job-alert`
     *  3. `worko-job-app-prod-app-scheduler-candidate-job-alert`
     */
    "app-scheduler-candidate-job-alert": {
      handler: "dist/src/app-scheduler-candidate-job-alert.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
      events:
        process.env.APP_SLS_STAGE === APP_CONSTANTS.STAGES.PROD
          ? [
              {
                schedule: {
                  name: "candidate-job-alert-schedule-${self:custom.app.STAGE}", // Name can be specified for a schedule event. This is not a required property.
                  description:
                    "Triggers to send candidate job alert according to cron expression", // Description can be specified for a schedule event. This is not a required property.

                  rate: ["cron(0 9 ? * SUN *)"], // every Sunday at 2:30pm in IST
                  enabled: true,
                  input: {
                    scheduleJob: {
                      type: ScheduleJobType.SEND_CANDIDATE_JOB_ALERT,
                    },
                  },
                },
              },
            ]
          : [],
    },

    /**
     * appeventtrigger
     *
     * Using `AWS SQS` service
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-appeventtrigger`
     *  2. `worko-job-app-dev-appeventtrigger`
     *  3. `worko-job-app-prod-appeventtrigger`
     */
    appeventtrigger: {
      handler: "dist/src/app-event-trigger.handler",
      events: [
        {
          sqs: {
            arn: "arn:aws:sqs:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:worko-job-app-event-queue",
            batchSize: 1,
            maximumBatchingWindow: 0,
          },
        },
      ],
    },

    /**
     * appInvokeLambda
     * 
     * @note
     *  1. This lambda function is used for direct lambda to lambda invocations,
     *  like if a lambda needs to invoke a another lambda without any sqs queue,
     *  then in this "worko-job-app" repository this lambda is used,
     *  for every different kind of use cases if direct lambda to lambda invocation is needed 
     *  then this lambda can be used.
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Example:
     *  1. `worko-job-local-appInvokeLambda`
     *  2. `worko-job-dev-appInvokeLambda`
     *  3. `worko-job-prod-appInvokeLambda`
     */
    appInvokeLambda: {
      handler: "dist/src/app-invoke-lambda.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
    },

    /**
     * app-opensearch-operations
     *
     * Using to interact with `AWS OpenSearch` service
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-app-opensearch-operations`
     *  2. `worko-job-app-dev-app-opensearch-operations`
     *  3. `worko-job-app-prod-app-opensearch-operations`
     */
    /*
    "app-opensearch-operations": {
      handler: "dist/src/app-opensearch-operations.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)

      vpc: {
        securityGroupIds: ["${self:custom.aws.APP_AWS_SECURITY_GROUP}"],
        subnetIds: [
          "${self:custom.aws.APP_AWS_SUBNET1}",
          "${self:custom.aws.APP_AWS_SUBNET2}",
        ],
      },
    },
    */

    /**
     * app-migrate-jobs
     *
     * Using to migrate jobs from `AWS OpenSearch` to `Google Cloud Firestore`
     *
     * AWS Lambda Function Format:- {service}-{enviroment}-{functionName}
     * Ex:
     *  1. `worko-job-app-local-app-migrate-jobs`
     *  2. `worko-job-app-dev-app-migrate-jobs`
     *  3. `worko-job-app-prod-app-migrate-jobs`
     */
    /*
    "app-migrate-jobs": {
      handler: "dist/src/app-migrate-jobs.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
    },
    */
  },
};

module.exports = serverlessConfiguration;