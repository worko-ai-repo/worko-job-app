// Importing necessary packages/modules from npm
import { Item } from "dynamoose/dist/Item";

// Represents the base structure for the database DTO (Data Transfer Object)
class BaseDbDto extends Item {
  "PK": string;
  "SK": string;
  "timestamps": {
    createdAt: string; // Dynamoose will handle this field
    updatedAt: string; // Dynamoose will handle this field
  };
}

// Exports the necessary elements to be used externally
export { BaseDbDto };
