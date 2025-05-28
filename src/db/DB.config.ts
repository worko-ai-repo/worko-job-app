// Import dynamoose related packages
import * as dynamoose from "dynamoose";

// Import DB constants
import APP_CONSTANTS from "../configs/constants.config";
import { DB_CONSTANTS } from "./DB.constants";

// Import `worko-job-app` table related models
import { UserJobApplicationModel } from "./models/UserJobApplication.model";
import { CompanyJobModel } from "./models/CompanyJob.model";
import { ExternalJobModel } from "./models/ExternalJob.model";
import { UserExternalJobApplicationModel } from "./models/UserExternalJobApplication.model";
import { ReferAndEarnModel } from "./models/ReferAndEarn.model";
import { BatchInferenceLogModel } from "./models/BatchInferenceLog.model";
import { FantasticJobLogModel } from "./models/FantasticJobLog.model";

// Import `worko` table related models
import { EmailTemplateModel } from "./models/EmailTemplate.model";
import { EmailLogModel } from "./models/EmailLog.model";
import { WhatsappTemplateModel } from "./models/WhatsappTemplate.model";
import { WhatsappMessageLogModel } from "./models/WhatsappMessageLog.model";
import { WhatsAppBusinessPartnerMessageLogModel } from "./models/WhatsAppBusinessPartnerMessageLog.model";
import { CompanyDetailModel } from "./models/CompanyDetail.model";
import { CorporateUserInviteModel } from "./models/CorporateUserInvite.model";
import { CorporateUserModel } from "./models/CorporateUser.model";
import { UserModel } from "./models/User.model";
import { UserDetailModel } from "./models/UserDetail.model";
import { ScheduleJobModel } from "./models/ScheduleJob.model";

/**
 * DBConfig
 *
 * Class to initialise the database connection, register dynamoose models, etc.
 */
class DBConfig {
  /**
   * init
   *
   * Initialise the required components to enable DynamoDB connection.
   */
  init() {
    this.setDynamooseConnection();
    this.registerDynamooseModels();
  }

  /**
   * setDynamooseConnection
   *
   * Set up the DynamoDB connection to couunicate with the database.
   */
  setDynamooseConnection() {
    // Log message
    global.logger.info(
      "Establish the 'DynamoDB' connection through 'Dynamoose'."
    );

    // Configuration to connect to the DynamodDB database
    let config = {};

    // If the stage is local then use then connect to the local DynamoDB
    if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
      config = {
        credentials: {
          accessKeyId: process.env.APP_AWS_DYNAMODB_ACCESS_KEY_ID as string,
          secretAccessKey: process.env
            .APP_AWS_DYNAMODB_SECRET_ACCESS_KEY as string,
        },
        region: APP_CONSTANTS.STAGES.LOCAL,
        endpoint: "http://localhost:8000",
      };
    }
    // For other stages, the required permissions would be added in the "serverless.ts" file
    else {
      config = {
        region: process.env.APP_SLS_REGION,
      };
    }

    const ddb = new dynamoose.aws.ddb.DynamoDB(config);
    dynamoose.aws.ddb.set(ddb);
  }

  /**
   * registerDynamooseWorkoJobAppModels
   *
   * Register all the worko related models to the dynamoose
   * The models registered here will be used to interact with the
   * "worko-job-app" DynamoDB table.
   */
  registerDynamooseWorkoJobAppModels() {
    global.logger.info(`Registering all available models for "worko-job-app" dynamodb table.`);
    const workoJobAppTable = new dynamoose.Table(
      DB_CONSTANTS.WORKO_TABLE_NAMES.workoJobAppTableName,
      [
        UserJobApplicationModel,
        CompanyJobModel,
        ExternalJobModel,
        UserExternalJobApplicationModel,
        ReferAndEarnModel,
        BatchInferenceLogModel,
        FantasticJobLogModel,
      ]
    );
  }

  /**
   * registerDynamooseWorkoModels
   *
   * Register all the dynamoose models that interact with the "worko" table
   * These models are used to interact with the "worko" dynamodb table
   */
  registerDynamooseWorkoModels() {
    global.logger.info(`Registering all available models for "worko" dynamodb table.`);
    const workoTable = new dynamoose.Table(
      DB_CONSTANTS.WORKO_TABLE_NAMES.workoTableName,
      [
        EmailTemplateModel,
        EmailLogModel,
        WhatsappTemplateModel,
        WhatsappMessageLogModel,
        WhatsAppBusinessPartnerMessageLogModel,
        CompanyDetailModel,
        CorporateUserInviteModel,
        CorporateUserModel,
        UserModel,
        UserDetailModel,
        ScheduleJobModel,
      ]
    );
  }

  /**
   * registerDynamooseModels
   *
   * Register the models created for differet PK and SK to communicate with Dynamoose.
   */
  registerDynamooseModels() {
    this.registerDynamooseWorkoModels();
    this.registerDynamooseWorkoJobAppModels();
  }
}

export default DBConfig;
