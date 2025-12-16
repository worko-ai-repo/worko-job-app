// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Define the structure for User Skill Database Data Transfer Object (DTO)
class DbUserSkillDto extends BaseDbDto {
  coreSkills?: {
    skillName: string;
    years: number;
    timestamps?: {
      createdAt: string;
      updatedAt: string;
    };
  }[];
  technicalSkills?: {
    skillName: string;
    years: number;
    timestamps?: {
      createdAt: string;
      updatedAt: string;
    };
  }[];
  softSkills?: {
    skillName: string;
    timestamps?: {
      createdAt: string;
    };
  }[];
  certifications?: {
    certName?: string;
    issuedInstitution?: string;
    completionDate?: Date;
    timestamps?: {
      createdAt: string;
    };
  }[];
}

const UserSkillSchema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    softSkills: {
      type: Array,
      required: false,
      schema: [Object],
    },
    coreSkills: {
      type: Array,
      required: false,
      schema: [Object],
    },
    technicalSkills: {
      type: Array,
      required: false,
      schema: [Object],
    },
    certifications: {
      type: Array,
      required: false,
      schema: [Object],
    },
    // Add other user-specific attributes here
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the UserSkillModel using the defined schema
const UserSkillModel = dynamoose.model<DbUserSkillDto>(
  "UserSkill",
  UserSkillSchema
);

// Export the UserSkillModel
export { UserSkillModel, DbUserSkillDto };
