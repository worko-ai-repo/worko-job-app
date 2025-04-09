// Import ulidx package
import { uuidToULID } from "ulidx";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";


/**
 * getActionByUserId
 *
 * This function will return the "actionByUserId" and "actionByCorporateUserId" based on the user's role.
 * If the user is a worko admin, then the "actionByUserId" will be set to the "userId" of the user.
 * If the user is a corporate recruiter or admin, then the "actionByCorporateUserId" will be set to the "userId" of the user converted to ULID.
 *
 * @returns {{ actionByUserId: string | undefined;actionByCorporateUserId: string | undefined; }} - An object containing the "actionByUserId" and "actionByCorporateUserId" of the user.
 */
export const getActionByUserId = (): {
  actionByUserId: string | undefined;
  actionByCorporateUserId: string | undefined;
} => {
  // Read the "userId" of the user from the global object
  const tokenUserId: string = global.requestLocalContext.userId;

  // Read the "cognitoUserGroups" of the user from the global object
  const cognitoUserGroups: string[] = global.requestLocalContext.cognitoUserGroups;

  // Initialize "actionByUserId","actionByCorporateUserId" and check if the user is a worko admin or a corporate recruiter
  let actionByUserId: string | undefined;
  let actionByCorporateUserId: string | undefined;
  if (
    cognitoUserGroups.includes(
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_ADMIN
    ) ||
    cognitoUserGroups.includes(
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_RECRUITER
    )
  ) {
    // Convert the UUID to ULID
    actionByCorporateUserId = uuidToULID(tokenUserId);
    global.logger.info(
      `User is a corporate recruiter/admin with ID: ${actionByCorporateUserId}. [helper]`
    );
  } else {
    // Set the "actionByUserId"
    actionByUserId = tokenUserId;
    global.logger.info(
      `User is a worko admin with ID: ${actionByUserId}. [helper]`
    );
  }

  // Return the "actionByUserId" and "actionByCorporateUserId"
  return { actionByUserId, actionByCorporateUserId };
};


/**
 * getEmailFromPK
 *
 * Takes a Partition Key (PK) and extracts the email id from it.
 * 
 * @format `USR#EML#{primaryEmail}`
 *
 * @param {string} PK - The Partition Key (PK).
 * @return {string} the email id extracted from the PK.
 */
export const getEmailFromPK = (PK: string): string => {
  return PK.split("#")[2];
}