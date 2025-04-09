// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the constants
import { DB_CONSTANTS } from "../DB.constants";

// Load the enums
import { UserType } from "../../enums/User.enum";

// Load the local base model functionalities
import { BaseDbDto } from "./Base.model";

// @todo the "DbUserDetailDto" and "UserDetailSchema" should be in sync.
// For ex, the "DbUserDetailDto.CV" is required but the "UserDetailSchema.CV" is optional.
// So update this and review all DTOs and makre they are in sync with respective Schemas.

// Define the structure for User Details Database Data Transfer Object (DTO)
class DbUserDetailDto extends BaseDbDto {
  id!: string; // Cognito Provided UserId for registered user
  GSI1PK!: string;
  GSI1SK!: string;
  name!: string;
  emailList!: { [key: string]: string }; // @todo we should consider removing this. And make the fields are always upto date. Instead use the "UserEmail" SK.
  number!: string;
  userType!: string[];
  isEmailVerified!: boolean;
  isNumberVerified!: boolean;
  isSubscribed!: boolean;
  referralCount!: number;
  expiryDate!: Date; // @rename this to "subscriptionExpiryDate"
  location?: string;
  about?: string;
  CTC?: number;
  ECTC?: number;
  noticePeriod?: number;
  YOE?: number;
  CV?: string;
  coverLetter?: string;
  lastAccessedDash!: string;
  profileImage?: string;
  country?: string;
  companyEmailId?: string; // Current company email id of the user(mostly for employee)
  department?: string; // Department of the user in the company for which he is currently working(mostly for employee)
  isCandidateFresher?: boolean;
  candidateExperience?: {
    companyId?: string;
    companyName: string;
    designation: string;
    department: string;
  };
  isWhatsappNotificationEnabled?: boolean;
}

// Define the schema for the User Details model using DynamoDB
const UserDetailSchema = new dynamoose.Schema(
  {
    // ...DBBaseSchema.attributes, // Use the attributes property from DBBaseSchema
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    GSI1PK: {
      //@todo Add required true to GSI1
      type: String,
      index: {
        name: "GSI1",
        type: "global",
        rangeKey: "GSI1SK",
      },
      required: true,
    },
    GSI1SK: {
      type: String,
      index: {
        name: "GSI1",
        type: "global",
      },
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    emailList: {
      type: Object,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    userType: {
      type: Array,
      schema: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
    },
    isNumberVerified: {
      type: Boolean,
      required: true,
    },
    isSubscribed: {
      type: Boolean,
      required: true,
    },
    referralCount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    CTC: {
      type: Number,
      required: false,
    },
    ECTC: {
      type: Number,
      required: false,
    },
    noticePeriod: {
      type: Number,
      required: false,
    },
    YOE: {
      type: Number,
      required: false,
    },
    CV: {
      type: String,
      required: false,
    },
    coverLetter: {
      type: String,
      required: false,
    },
    lastAccessedDash: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    companyEmailId: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    isCandidateFresher: {
      type: Boolean,
      required: false,
    },
    candidateExperience: {
      type: Object,
      schema: {
        companyId: {
          type: String,
          required: false,
        },
        companyName: {
          type: String,
          required: true,
        },
        designation: {
          type: String,
          required: true,
        },
        department: {
          type: String,
          required: true,
        },
      },
      required: false,
    },
    isWhatsappNotificationEnabled: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the UserDetailsModel using the defined schema
const UserDetailModel = dynamoose.model<DbUserDetailDto>("UserDetail", [
  UserDetailSchema,
]);

// Export the UserDetailsModel
export { UserDetailModel, DbUserDetailDto };
