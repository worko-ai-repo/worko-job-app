// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";

// Define the schema for the User model using DynamoDB
const UserSchema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the UserModel using the defined schema
// const UserModel = model.createDbModel("User", UserSchema);
const UserModel = dynamoose.model("User", UserSchema);

// Export the UserModel
export { UserModel };
