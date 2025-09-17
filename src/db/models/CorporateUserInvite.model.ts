// Load the dynamoose library
import * as dynamoose from "dynamoose";

// Import bade Dto interface
import { BaseDbDto } from "./Base.model";

// Import the constants
import { DB_CONSTANTS } from "../DB.constants";

// Import Enums
import { CorporateUserInviteAccessTypeEnum, CorpInviteStatusEnum } from "../../enums/CorporateUserInvite.enum";

// Define the structure for Corporate Invite Database Data Transfer Object (DTO)
class DbCorporateUserInviteDto extends BaseDbDto {
  // Base Keys
  GSI1PK!: string;
  GSI1SK!: string;
  id!: string;

  // Refreneces
  companyId!: string;

  corporateUserType!: CorporateUserInviteAccessTypeEnum; // Enum
  email!: string;
  firstName!: string;
  lastName!: string;
  inviteStatus!: CorpInviteStatusEnum; // Enum

  // Created By, Updated By and Deleted By Users are worko admins which are basically cognito user ids
  createdByUserId?: string;
  updatedByUserId?: string;
  deletedByUserId?: string;

  /**
   * Created by corporate recruiter or corporate admin
   *
   * The `createdByCorporateUserId` attribute represents the ID of the corporate user who created the invite,
   * While creating a invite, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * from the `CorporateUser` model who created the invite.
   */
  createdByCorporateUserId?: string;

  /**
   * Updated by corporate recruiter or corporate admin
   *
   * The `updatedByCorporateUserId` attribute represents the ID of the corporate user who updated the invite details,
   * While updating a invite details, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * from the `CorporateUser` model who updated the invite details
   */
  updatedByCorporateUserId?: string;

  /**
   * Deleted by corporate recruiter or corporate admin
   *
   * The `deletedByCorporateUserId` attribute represents the ID of the corporate user who made the status of the invite to be deleted,
   * While makeing a invite status to be deleted, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * from the `CorporateUser` model who made the status of the invite to be deleted
   */
  deletedByCorporateUserId?: string;

  // Dates
  expiresAt!: Date;

  /**
   * Deletion Attribute : Use Case If mail is send to wrong user
   * and that user tries to create an account
   * then we can set this flag to true that will be checked while
   * creating a user and will block the flow for that user.
   **/
  isDeleted!: boolean;
}

const CorporateUserInviteSchema = new dynamoose.Schema(
    {
        ...DB_CONSTANTS.WORKO_PK_SK,
        GSI1PK: {
            type: String,
            index: {
                name: 'GSI1',
                type: 'global',
                rangeKey: 'GSI1SK',
            },
            required: true,
        },
        GSI1SK: {
            type: String,
            index: {
                name: 'GSI1',
                type: 'global',
            },
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        companyId: {
            type: String,
            required: true,
        },
        corporateUserType: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        inviteStatus: {
            type: String,
            required: true,
        },
        createdByUserId: {
            type: String,
            required: false,
        },
        updatedByUserId: {
            type: String,
            required: false,
        },
        deletedByUserId: {
            type: String,
            required: false,
        },
        createdByCorporateUserId: {
            type: String,
            required: false,
        },
        updatedByCorporateUserId: {
            type: String,
            required: false,
        },
        deletedByCorporateUserId: {
            type: String,
            required: false,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            required: true,
        },
    },
    {
        ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
    }
);

const CorporateUserInviteModel = dynamoose.model<DbCorporateUserInviteDto>(
    "CorporateUserInvite", // Table Name
    CorporateUserInviteSchema   // Table Schema
);
export { CorporateUserInviteModel, DbCorporateUserInviteDto };