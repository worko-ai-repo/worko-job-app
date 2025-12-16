// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the constants
import { DB_CONSTANTS } from "../DB.constants";

// Load the local DTOs
import { UserDetailDbResponsibilitiesDto } from "../../dtos/User.dto";
import { UserDetailDbCandidateExperienceDto } from "../../dtos/UserDetail.dto";

// Import enums
import { UserDetailDbGenderEnum } from "../../enums/User.enum";

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
  GSI2PK!: string;
  GSI2SK!: string;
  name!: string;
  gender?: UserDetailDbGenderEnum;
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
  isNoticePeriodNegotiable?: boolean;
  YOE?: number;
  CV?: string; // The uploaded cv file name.
  userCvFileName?: string; // Name of the uploaded CV file.
  cvExtract?: string; // The extracted plain texts.

  /* 
  Sample Value for "cvExtractParsed" field:-
  "cvExtractParsed": {
    "educations": [
        {
            "degree": "B.Tech",
            "institution": "CMR Technical Campus",
            "year": "2024"
        }
    ],
    "responsibilities": [
        "Built backend for website: https://worko.ai/",
        "MERN Website Built By Me: https://www.neobrim.com/"
    ],
    "achievements": [],
    "personalDetails": {
        "name": "Rohith Appala",
        "phone": "+91 9666308100",
        "email": "rohithpatelappala888placement@gmail.com"
    },
    "industryExperiences": [
        {
            "industryType": "B2B",
            "industryDomain": "Technology"
        }
    ],
    "teamHandlingExperiences": [],
    "certifications": [
        {
            "name": "Full Stack Web Development",
            "year": "2023",
            "issuer": "NxtWave"
        },
        {
            "name": "MERN stack development",
            "year": "2023",
            "issuer": "NxtWave"
        }
    ]
  }, */
  cvExtractParsed?: object;
  cvExtractParsedDate?: string;

  /**
   * Whenever candidate uploads `CV` then nodejs api
   * will trigger the `resume-parser` lambda function
   * to extract and store the details from the uploaded CV
   * and once the data is extracted then this field will be set to true
   */
  isCvExtracted?: boolean;

  coverLetter?: string;
  lastAccessedDash!: string;
  profileImage?: string;
  country?: string;
  companyEmailId?: string; // Current company email id of the user(mostly for employee)
  department?: string; // Department of the user in the company for which he is currently working(mostly for employee)
  isCandidateFresher?: boolean;
  candidateExperience?: UserDetailDbCandidateExperienceDto;
  multipleCandidateExperience?: UserDetailDbCandidateExperienceDto[];
  multipleCandidateExperiencedDate?: string;
  responsibilities?: UserDetailDbResponsibilitiesDto[];
  isWhatsappNotificationEnabled?: boolean;

  /**
   * @description
   *  1. whenever the agency submits a unregistered candidate for a job and if a corporate move it to applicants page
   *     then in backend we are creating the candidate account in cognito and aws dynamodb as unverified email without sending any
   *     otp, and we will specify this as "true", and as of now this attribute is used while listing job applications and attaching applicant details
   *     to them.
   */
  isUserCreatedInternally?: boolean;
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
    GSI2PK: {
      type: String,
      index: {
        name: "GSI2",
        type: "global",
        rangeKey: "GSI2SK",
      },
      required: true,
    },
    GSI2SK: {
      type: String,
      index: {
        name: "GSI2",
        type: "global",
      },
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
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
    isNoticePeriodNegotiable: {
      type: Boolean,
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
    userCvFileName: {
      type: String,
      required: false,
    },
    cvExtract: {
      type: String,
      required: false,
    },
    cvExtractParsed: {
      type: Object,
      required: false,
    },
    cvExtractParsedDate: {
      type: String,
      required: false,
    },
    isCvExtracted: {
      type: Boolean,
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
        YOE: {
          type: Number,
          required: false,
        },
        startDate: {
          type: String,
          required: false,
        },
        endDate: {
          type: String,
          required: false,
        },
      },
      required: false,
    },
    multipleCandidateExperiencedDate: {
      type: String,
      required: false,
    },
    multipleCandidateExperience: {
      type: Array,
      schema: [
        {
          type: Object,
          required: false,
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
              required: false,
            },
            YOE: {
              type: Number,
              required: false,
            },
            startDate: {
              type: String,
              required: false,
            },
            endDate: {
              type: String,
              required: false,
            },
          },
        },
      ],
      required: false,
    },
    responsibilities: {
      type: Array,
      schema: Object,
      required: false,
    },
    isWhatsappNotificationEnabled: {
      type: Boolean,
      default: true,
      required: false,
    },
    isUserCreatedInternally: {
      type: Boolean,
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
