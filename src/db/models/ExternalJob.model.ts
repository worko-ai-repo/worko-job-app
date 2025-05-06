// Load the npm packages
import * as dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Schema } from "dynamoose/dist/Schema";

// Load the local model constants and base model functionalities
import { DB_CONSTANTS } from "../DB.constants";
import { BaseDbDto } from "./Base.model";

// Import dtos
import { JobLocationDto, MinMaxRange } from "../../dtos/Common.dto";

// import Enums
import { JobStatusEnum, JobWorkModeEnum } from "../../enums/Job.enum";
import { JobSourcedFromEnum } from "../../enums/Common.enum";

// Define the structure for External Job Database Data Transfer Object (DTO)
class DbExternalJobDto extends BaseDbDto {
  // Ids

  /**
   * Whenever the External Job is created, then the `id` attribute from `Job.aws-opensearch-model.ts` will be set to this attribute
   */
  id!: string;

  /**
   * The `createdByCorporateUserId` attribute represents the ID of the corporate user who created the job,
   * While creating a job, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * who created the job from the `CorporateUser` model.
   */
  createdByCorporateUserId?: string;

  /**
   * The `updatedByCorporateUserId` attribute represents the ID of the corporate user who updated the job,
   * While updating a job, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * who updated the job from the `CorporateUser` model.
   */
  updatedByCorporateUserId?: string;

  /**
   * The `createdByUserId` attribute represents the ID of the worko admin user who created the job
   */
  createdByUserId?: string;

  /**
   * The `updatedByUserId` attribute represents the ID of the worko admin user who updated the job.
   */
  updatedByUserId?: string;

  /**
   * The `externalJobId` attribute represents the ID of the job from the external source.
   */
  externalJobId!: string;

  /**
   * The `status` attribute represents the status of the job,
   * This will be internally set by the backend team, which was
   * not comming from external job api.
   */
  status!: JobStatusEnum;

  /**
   * Below attributes are comming from the external job api,
   * which we are anticipating mandatorily getting from the external job api,
   * but we are not very sure if we will get this data from the external job api or not,
   * because the database structure documentation is not provided by the external job api team.
   */
  jobTitle!: string;
  location!: JobLocationDto;
  jobDescription!: string;
  htmlJobDescription?: string;
  jobPostedDate!: string;
  jobCreatedDate!: string;
  jobUrl!: string;
  jobInternalUrl!: string;
  workMode!: JobWorkModeEnum;

  sourcedFrom!: JobSourcedFromEnum;

  department?: string;
  technicalSkills?: string[];
  coreSkills?: string[];
  softSkills?: string[];
  experienceRange?: MinMaxRange;
  salaryRange?: MinMaxRange;
  displaySalaryRange?: boolean;
  typeofEmployment?: string;
  companyName?: string;
  companyUrl?: string;
  companyLogoUrl?: string;
  otherRequirements?: string;
  noticePeriod?: number;
  numOfOpenings?: number;
  miscellaneousSkills?: string[];

  isDeleted!: boolean;
}

// Define the schema for the External Job
const ExternalJobSchema: Schema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    createdByCorporateUserId: {
      type: String,
      required: false,
    },
    updatedByCorporateUserId: {
      type: String,
      required: false,
    },
    createdByUserId: {
      type: String,
      required: false,
    },
    updatedByUserId: {
      type: String,
      required: false,
    },
    externalJobId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: Object,
      required: true,
      schema: {
        city: { type: Array, schema: String, required: false, default: [] },
        state: { type: Array, schema: String, required: false, default: [] },
        country: { type: Array, schema: String, required: false, default: [] },
        fullLocation: { type: Array, schema: String, required: false, default: [] },
      },
    },
    jobDescription: {
      type: String,
      required: true,
    },
    htmlJobDescription: {
      type: String,
      required: false,
    },
    jobPostedDate: {
      type: String,
      required: true,
    },
    jobCreatedDate: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      required: true,
    },
    jobInternalUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
    },
    workMode: {
      type: String,
      required: true,
    },
    sourcedFrom: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    coreSkills: {
      type: Array,
      schema: String,
      required: false,
    },
    softSkills: {
      type: Array,
      schema: String,
      required: false,
    },
    technicalSkills: {
      type: Array,
      schema: String,
      required: false,
    },
    experienceRange: {
      type: Object,
      required: false,
      schema: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
    },
    salaryRange: {
      type: Object,
      required: false,
      schema: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
    },
    displaySalaryRange: {
      type: Boolean,
      required: false,
      default: true,
    },
    typeofEmployment: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    companyUrl: {
      type: String,
      required: false,
    },
    companyLogoUrl: {
      type: String,
      required: false,
    },
    otherRequirements: {
      type: String,
      required: false,
    },
    noticePeriod: {
      type: Number,
      required: false,
    },
    numOfOpenings: {
      type: Number,
      required: false,
    },
    miscellaneousSkills: {
      type: Array,
      schema: String,
      required: false,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Create the UserJobApplicationModel using the defined schema
const ExternalJobModel: ModelType<DbExternalJobDto> =
  dynamoose.model<DbExternalJobDto>("ExternalJob", ExternalJobSchema);

// Export the UserJobApplicationModel
export { ExternalJobModel, DbExternalJobDto };