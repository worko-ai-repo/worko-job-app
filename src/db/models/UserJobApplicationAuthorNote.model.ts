// Load the npm packages
import { Schema } from "dynamoose/dist/Schema";
import dynamoose from "dynamoose";

// import enums
import { UserJobApplicationAuthorNoteCognitoUserGroupEnum } from "../../enums/UserJobApplicationAuthorNote.enum";

// import dtos
import { UserJobApplicationAuthorDbNoteDetail } from "../../dtos/UserJobApplicationAuthorNote.dto";

// Import models
import { BaseDbDto } from "./Base.model";
import { DB_CONSTANTS } from "../DB.constants";

class DbUserJobApplicationAuthorNoteDto extends BaseDbDto {
  id!: string;
  jobApplicationId!: string;
  authorId!: string;
  authorCognitoUserGroup!: UserJobApplicationAuthorNoteCognitoUserGroupEnum;
  noteDetails!: UserJobApplicationAuthorDbNoteDetail[];
  createdByUserId?: string;
  updatedByUserId?: string;
  createdByCorporateUserId?: string;
  updatedByCorporateUserId?: string;
}

/**
 * UserJobApplicationAuthorNoteSchema
 * 
 * Dynamoose schema for UserJobApplicationAuthorNote model
 */
const UserJobApplicationAuthorNoteSchema = new Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    jobApplicationId: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorCognitoUserGroup: {
      type: String,
      required: true,
    },
    noteDetails: {
      type: Array,
      required: true,
      schema: [
        {
          type: Object,
          required: true,
          schema: {
            title: { type: String, required: true },
            detailedDescription: { type: String, required: false },
            createdAt: { type: String, required: false },
            updatedAt: { type: String, required: false },
          },
        },
      ],
    },
    createdByUserId: {
      type: String,
      required: false,
    },
    updatedByUserId: {
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
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);


const UserJobApplicationAuthorNoteModel =
  dynamoose.model<DbUserJobApplicationAuthorNoteDto>(
    "UserJobApplicationAuthorNote",
    UserJobApplicationAuthorNoteSchema
  );

export {UserJobApplicationAuthorNoteModel, DbUserJobApplicationAuthorNoteDto};