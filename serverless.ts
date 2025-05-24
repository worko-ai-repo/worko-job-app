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
    },

    /**
     * awsLambdaFunctions
     *
     * This `awsLambdaFunctions` object is used to define the ARNs (Amazon Resource Names) of AWS Lambda functions.
     */
    awsLambdaFunctions: {
      /**
       * APP_SCHEDULER_HANDLER
       *
       * In "APP_SCHEDULER_HANDLER", The details of "app-scheduler-handler" AWS Lambda function are stored.
       */
      APP_SCHEDULER_HANDLER: {
        APP_AWS_SCHEDULER_HANDLER_LAMBDA_ARN:
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-app-${self:custom.app.STAGE}-app-scheduler-handler",
        APP_AWS_SCHEDULER_HANDLER_ROLE_ARN:
          "arn:aws:iam::${self:custom.aws.APP_AWS_ACCOUNT_ID}:role/worko-schedule-invoke-lambda-role",
      },
    },
  },

  provider: {
    name: "aws",

    runtime: "nodejs18.x",

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

    environment: {
      /**
       * Environment variables for "app-scheduler-handler" function
       */
      APP_AWS_SCHEDULER_HANDLER_LAMBDA_ARN:
        "${self:custom.awsLambdaFunctions.APP_SCHEDULER_HANDLER.APP_AWS_SCHEDULER_HANDLER_LAMBDA_ARN}",
      APP_AWS_SCHEDULER_HANDLER_ROLE_ARN:
        "${self:custom.awsLambdaFunctions.APP_SCHEDULER_HANDLER.APP_AWS_SCHEDULER_HANDLER_ROLE_ARN}",
    },

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
        Resource: ["arn:aws:s3:::worko-app-*", "arn:aws:s3:::*/*"],
      },

      {
        Effect: "Allow",
        Action: ["lambda:InvokeFunction", "lambda:InvokeAsync"],
        Resource: [
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-jd-resume-matching",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:resume-parser",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-job-description-parser",
          "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-user-matching-score-job",
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
          "arn:aws:iam::${self:custom.aws.APP_AWS_ACCOUNT_ID}:role/worko-schedule-invoke-lambda-role",
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
          "cognito-idp:AdminUpdateUserAttributes",
          "cognito-idp:AdminConfirmSignUp",
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
      vpc: {
        securityGroupIds: ["${self:custom.aws.APP_AWS_SECURITY_GROUP}"],
        subnetIds: [
          "${self:custom.aws.APP_AWS_SUBNET1}",
          "${self:custom.aws.APP_AWS_SUBNET2}",
        ],
      },

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

      vpc: {
        securityGroupIds: ["${self:custom.aws.APP_AWS_SECURITY_GROUP}"],
        subnetIds: [
          "${self:custom.aws.APP_AWS_SUBNET1}",
          "${self:custom.aws.APP_AWS_SUBNET2}",
        ],
      },
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

      vpc: {
        securityGroupIds: ["${self:custom.aws.APP_AWS_SECURITY_GROUP}"],
        subnetIds: [
          "${self:custom.aws.APP_AWS_SUBNET1}",
          "${self:custom.aws.APP_AWS_SUBNET2}",
        ],
      },

      /**
       * @see https://www.serverless.com/framework/docs/providers/aws/events/schedule#specify-name-and-description
       */
      events: [
        {
          schedule: {
            name: "cleanup-old-unapplied-jobs-schedule", // Name can be specified for a schedule event. This is not a required property.
            description:
              "Triggers to hard and soft delete old unapplied external jobs according to cron expression", // Description can be specified for a schedule event. This is not a required property.

            /**
             * Cron expressions
             *  Syntax: cron(fields) -->>  "cron(Minutes Hours Day-of-month Month Day-of-week Year)"
             * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions
             *
             * @reference "Amazon EventBridge" > "Buses" > "Rules" > {name} > Event schedule
             *
             * @description Whatever input you provide will be passed to the function as input,
             *              If no input is provided, the type of event object will be by default `ScheduledEvent`.
             */
            rate: ["cron(30 14 ? * 1 *)"],
            enabled: true,

            /**
             * @see https://www.serverless.com/framework/docs/providers/aws/events/schedule#specify-multiple-schedule-expressions
             *
             * @type { string | { body: string; } | { [k: string]: unknown; } | undefined }
             *
             * @description Whatever input you provide, that will be passed to the handler function as input,
             *              If no input is provided, the type of "event" object will be by default `ScheduledEvent`.
             */
            input: {
              scheduleJob: {
                type: ScheduleJobType.FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS_AND_OLD_INITIAL_MATCHING_SCORE_JOBS,
              },
            },
          },
        },
        {
          schedule: {
            name: "fantastic-job-twenty-four-hours-schedule", // Name can be specified for a schedule event. This is not a required property.
            description:
              "Triggers to retrieve fantastic job twenty four hours according to cron expression", // Description can be specified for a schedule event. This is not a required property.
            /**
             * Cron expressions
             *  Syntax: cron(fields) -->>  "cron(Minutes Hours Day-of-month Month Day-of-week Year)"
             * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions
             *
             * @reference "Amazon EventBridge" > "Buses" > "Rules" > {Rule name} > Event schedule
             */
            rate: ["cron(30 14 ? * TUE,FRI *)"],
            enabled: true,

            /**
             * @see https://www.serverless.com/framework/docs/providers/aws/events/schedule#specify-multiple-schedule-expressions
             *
             * @type { string | { body: string; } | { [k: string]: unknown; } | undefined }
             *
             * @description Whatever input you provide, that will be passed to the handler function as input,
             *              If no input is provided, the type of "event" object will be by default `ScheduledEvent`.
             */
            input: {
              scheduleJob: {
                type: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
              },
            },
          },
        },
      ],
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
  },
};

module.exports = serverlessConfiguration;