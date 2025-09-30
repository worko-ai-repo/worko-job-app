
// Import cognito related types
import {
  // Client
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,

  // Commands
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,

  // Command outputs
  AdminAddUserToGroupCommandOutput,
  AdminGetUserCommandOutput,
  AdminListGroupsForUserCommandOutput,

  // Types
  AttributeType,
  GroupType,
} from "@aws-sdk/client-cognito-identity-provider";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * AwsClientCognitoIdentityProviderLibrary
 */
class AwsClientCognitoIdentityProviderLibrary {
  /**
   * Checks if the environment variables required to create the AWS client Cognito Identity Provider
   * are set. If not, logs an error and throws a BaseError with a 500 status code.
   * @throws {BaseError} If environment variables are missing
   */
  constructor() {
    if (
      !process.env.APP_SLS_REGION
    ) {
      global.logger.error(
        "Missing required environment variables for Cognito Identity Provider client.[LIBRARY]",
        {
          region: process.env.APP_SLS_REGION,
          methodName: this.constructor.name,
        }
      );
      throw new BaseError(
        "Missing required environment variables for Cognito Identity Provider client.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * initClientCognitoIdentityProviderArguments
   * 
   * Creates the configuration object for the Cognito Identity Provider client.
   * 
   * @returns {CognitoIdentityProviderClientConfig} The configuration object for the Cognito Identity Provider client.
   */
  initClientCognitoIdentityProviderArguments(): CognitoIdentityProviderClientConfig {
    let config: CognitoIdentityProviderClientConfig;

    if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
      config = {
        region: process.env.APP_SLS_REGION,
        credentials: {
          accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY as string,
        },
      };
    }

    config = {
      region: process.env.APP_SLS_REGION,
    };

    return config;
  }

  client = new CognitoIdentityProviderClient(this.initClientCognitoIdentityProviderArguments());

  /**
   * elevateUserToGroup
   * 
   * Elevates a user to a specified group in AWS Cognito.
   *
   * This method logs the action of adding a user to a group and constructs
   * an `AdminAddUserToGroupCommand` to execute the operation. It sends the
   * command through the Cognito client and logs the success or failure of the
   * operation. It throws an error if the operation fails.
   *
   * @param {string} userPoolId - The ID of the Cognito User Pool.
   * @param {string} username - The username of the user to be added to the group.
   * @param {string} groupName - The name of the group to add the user to.
   * @returns {Promise<AdminAddUserToGroupCommandOutput>} A promise that resolves
   * to the result of the add user to group operation.
   * @throws {BaseError} If the user cannot be added to the group.
   */
  async elevateUserToGroup(userPoolId: string, username: string, groupName: string): Promise<AdminAddUserToGroupCommandOutput> {
    try {
      // Logger
      global.logger.info("Elevating user to group in Cognito. [LIBRARY]", {
        methodName: this.elevateUserToGroup.name,
      });

      // Create a new command to add the user to the group
      const addUserToGroup: AdminAddUserToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: username,
        GroupName: groupName,
      });

      // Send the command to Cognito
      const userDetails: AdminAddUserToGroupCommandOutput = await this.client.send(addUserToGroup);
      global.logger.info("User added to group successfully. [LIBRARY]", {
        methodName: this.elevateUserToGroup.name,
      });

      // Return the user details
      return userDetails;
    } catch (error) {
      // Log and skip if some error occoured
      global.logger.error("Error at caught while adding user to group. [LIBRARY]", {
        methodName: this.elevateUserToGroup.name,
        error: error,
        userPoolId: userPoolId,
        username: username,
        groupName: groupName,
      });
      
      throw new BaseError(
        "Unable to add user to cognito group.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * getUserDetails
   * 
   * Retrieves a user's details from AWS Cognito.
   * 
   * This method logs the action of retrieving a user's details and constructs
   * an `AdminGetUserCommand` to execute the operation. It sends the command
   * through the Cognito client and logs the success or failure of the
   * operation. It throws an error if the operation fails.
   * 
   * @param {string} userPoolId - The ID of the Cognito User Pool.
   * @param {string} userName - The username of the user to be retrieved.
   * @returns {Promise<AdminGetUserCommandOutput>} A promise that resolves
   * to the result of the get user operation.
   * @throws {BaseError} If the user cannot be retrieved.
   */
  async getUserDetails(userPoolId: string, userName: string): Promise<AdminGetUserCommandOutput> {
    try {
      global.logger.info("Getting user details from Cognito. [LIBRARY]", {
        methodName: this.getUserDetails.name,
        userPoolId,
        userName,
      });

      const command: AdminGetUserCommand = new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: userName,
      });

      return this.client.send(command);
    } catch (error) {
      global.logger.error("Error caught while getting user details. [LIBRARY]", {
        methodName: this.getUserDetails.name,
        error: error,
        userPoolId: userPoolId,
        userName: userName,
      });
      
      throw new BaseError(
        "Unable to get user details from cognito.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * getGroupsForUser
   * 
   * Retrieves the groups a user is a member of in AWS Cognito.
   * 
   * This method logs the action of retrieving a user's groups and constructs
   * an `AdminListGroupsForUserCommand` to execute the operation. It sends the
   * command through the Cognito client and logs the success or failure of the
   * operation. It throws an error if the operation fails.
   * 
   * @param {string} userPoolId - The ID of the Cognito User Pool.
   * @param {string} userName - The username of the user to be retrieved.
   * @returns {Promise<AdminListGroupsForUserCommandOutput>} A promise that resolves
   * to the result of the get user groups operation.
   * @throws {BaseError} If the user groups cannot be retrieved.
   */
  async getGroupsForUser(userPoolId: string, userName: string): Promise<AdminListGroupsForUserCommandOutput> {
    try {
      global.logger.info("Getting user groups from Cognito. [LIBRARY]", {
        methodName: this.getGroupsForUser.name,
        userPoolId,
        userName,
      });

      const command: AdminListGroupsForUserCommand = new AdminListGroupsForUserCommand({
        UserPoolId: userPoolId,
        Username: userName,
      });

      return this.client.send(command);
    } catch (error) {
      global.logger.error("Error caught while getting user groups. [LIBRARY]", {
        methodName: this.getGroupsForUser.name,
        error: error,
        userPoolId: userPoolId,
        userName: userName,
      });
      
      throw new BaseError(
        "Unable to get user groups from cognito.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * checkUserInCognitoGroup
   * 
   * Checks if user is in specified Cognito group.
   * 
   * @param {string} userPoolId - The ID of the Cognito User Pool.
   * @param {string} userName - The username of the user to be checked.
   * @param {string} groupName - The name of the group to check the user against.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user is in the specified group or not.
   * @throws {BaseError} If the user group membership cannot be checked.
   */
  async checkUserInCognitoGroup(userPoolId: string, userName: string, groupName: string): Promise<boolean> {
    try {
      global.logger.info("Checking if user is in specified cognito group. [LIBRARY]", {
        methodName: this.checkUserInCognitoGroup.name,
        userName,
        userPoolId,
        groupName,
      });

      const userResponse: AdminGetUserCommandOutput = await this.getUserDetails(userPoolId, userName);
      global.logger.info("User details fetched. [LIBRARY]", {
        methodName: this.checkUserInCognitoGroup.name,
        userResponse,
      })

      const userEmail: string | undefined = userResponse.UserAttributes?.find(
        (attr: AttributeType) => attr.Name === "email"
      )?.Value;

      if (userEmail !== userName) {
        global.logger.error("Email mismatch for user. [LIBRARY]", {
          methodName: this.checkUserInCognitoGroup.name,
          expectedEmail: userName,
          actualEmail: userEmail,
        });
        return false;
      }

      const groupsResponse: AdminListGroupsForUserCommandOutput = await this.getGroupsForUser(userPoolId, userName);
      global.logger.info("Lists the groups that a user belongs to. [LIBRARY]", {
        methodName: this.checkUserInCognitoGroup.name,
        groupsResponse,
      });

      const isInSpecifiedGroup: boolean =
        groupsResponse?.Groups?.some(
          (group: GroupType) => group.GroupName === groupName
        ) ?? false;

      global.logger.info("User group check completed. [LIBRARY]", {
        methodName: this.checkUserInCognitoGroup.name,
        isInSpecifiedGroup,
      });

      return isInSpecifiedGroup;
    } catch (error) {
      global.logger.error("Error checking user group membership. [LIBRARY]", {
        methodName: this.checkUserInCognitoGroup.name,
        error: error,
        userPoolId,
        userName,
        groupName,
      });
      
      throw new BaseError(
        "Unable to check user group membership.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }
}

// Export the instance and the class
export { AwsClientCognitoIdentityProviderLibrary };