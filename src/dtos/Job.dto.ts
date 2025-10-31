
// Import dtos
import { EntityBulkUpdateMetricDto, JobLocationDto, MinMaxRange } from "./Common.dto";
import { AwsOpensearchRecordListingFilterOptions, AwsOpensearchRecordListingFilterRequestDTO } from "./Common.aws-opensearch.dto";

// Import enums
import { JobDashboardEnum, JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

/**
 * JobCreateApiDto
 *
 * This DTO is used to validate and structure the data received from the client (API request).
 */
export interface JobCreateApiDto {
  companyId: string;
  jobTitle: string;
  jobDescription: string;
  htmlJobDescription: string;
  otherRequirements?: string;
  experienceRange: MinMaxRange;
  noticePeriod?: number;
  flexibleNotice?: boolean;
  numOfOpenings: number;
  salaryRange: SalaryRangeDto;
  department: string;
  location: JobLocationDto;
  workMode: JobWorkModeEnum;
  typeofEmployment: string;
  coreSkills: string[]; // Array of skills like [JAVA, PYTHON] i.e skillName
  goodToHaveSkills: string[]; // Array of skills like [JAVA, PYTHON]
  softSkills: string[]; // Array of skills like [COMMUNICATION, TEAMWORK]
  technicalSkills: string[]; // Array of skills like [MS EXCEL, MS OFFICE, SAP]
  miscellaneousSkills?: string[]; // Array of any skills could be from the above 3 fields.
  status: JobStatusEnum; // This will be asked by the UI team to update the status of the Job. for eg. If the admin leaves the form and close the session it'd be saved as draft.
  displaySalaryRange?: boolean;
  gradeLevel?: number;
}

/**
 * JobCreateDto
 * 
 * This is the internal interface which would be used in the backend.
 */
export interface JobCreateDto extends JobCreateApiDto {
  createdByUserId?: string;
  createdByCorporateUserId?: string;
}

/**
 * JobListingFilterOptions
 * 
 * This is the DTO used by Backend to get the Query Params for the Job Listing.Listing.
 */
export interface JobListingFilterOptions extends AwsOpensearchRecordListingFilterOptions {
  /**
   * If this is true then it means that we will retrieve the jobs from s3 vector.
   */
  fromS3Vector?: boolean;

  /**
   * This is for pagination implementation in s3 vector
   */
  s3VectorPageNumber?: number;

  dashboard?: JobDashboardEnum;
  companyId?: string;
  location?: string;
  minExperience?: number; // Converted to number datatype by `Joi` schema.
  maxExperience?: number; // Converted to number datatype by `Joi` schema.
  minSalary?: number; // Converted to number datatype by `Joi` schema.
  maxSalary?: number; // Converted to number datatype by `Joi` schema.
  department?: string[]; // Converted to array datatype by `Joi` schema.
  softSkills?: string[]; // Converted to array datatype by `Joi` schema.
  coreSkills?: string[]; // Converted to array datatype by `Joi` schema.
  technicalSkills?: string[]; // Converted to array datatype by `Joi` schema.
  workMode?: string;
  status?: JobStatusEnum;
  jobTitle?: string;
  typeofEmployment?: string;
  companyName?: string;
  YOE?: number;
  userRole?: CorporateUserTypeEnum;
  corporateRecruiterUserId?: string; // `id` attribute from `CorporateUser.model.ts`

  /**
   * @description: Whenever `corporate` or `worko-admin` clicks directly the `Applicants` tab directly without
   * selecting a job, we are showing a popup to search a job and select a job to list all the job applications
   * for that selected job. But we are attaching the company details also, to avoid attaching company details
   * for this use case. We are using this field.
   */
  includeCompanyDetails?: boolean;

  /**
   * @description: While listing jobs in `corporate` or `worko-admin` dashboard
   * we will show the counts of user job applications for each job, If we want to show this count we will set this field to `true`.
   */
  includeCountCompanyJobEntityJobApplication?: boolean;
}

/**
 * JobListingFilterRequestDTO
 * 
 * This is the Dto for Receving the Query Params for the Job Listing which extends the AwsOpensearchRecordListingFilterRequestDTO 
 * 
 * AwsOpensearchRecordListingFilterOptions is the DTO that contains the common fields for the Query Params i.e Sort, Limit, Page, Search etc.
 * and JobListingFilterOptions contains the fields that are specific to the Job 
 */
export interface JobListingFilterRequestDTO extends AwsOpensearchRecordListingFilterRequestDTO {
  fromS3Vector?: boolean;
  s3VectorPageNumber?: string; // "1" which can be convertable to a number at `Joi` schema.
  dashboard?: JobDashboardEnum;
  companyId?: string;
  location?: string;
  minExperience?: string; // Sample value : "2" which can be convertable to a number at `Joi` schema.
  maxExperience?: string; // Sample value : "2" which can be convertable to a number at `Joi` schema.
  minSalary?: string; // Sample value : "2" which can be convertable to a number at `Joi` schema.
  maxSalary?: string; // Sample value : "2" which can be convertable to a number at `Joi` schema.
  department?: string; // Sample value : "IT,HR"
  softSkills?: string; // Sample value : "communication,teamwork,leadership"
  coreSkills?: string; // Sample value : "communication,teamwork,leadership"
  technicalSkills?: string; // Sample value : "ts,js,react"
  workMode?: string;
  status?: JobStatusEnum;
  jobTitle?: string;
  typeofEmployment?: string;
  companyName?: string;
  YOE?: string;

  /**
   * @description
   *  1. As of now we are using "userRole" and "corporateRecruiterUserId" for below scenarios:
   *     1. For `corporate-admin`:
   *        1. Only jobs from their `Company`:
   *           1. Include `corporate-admin` created jobs
   *           2. Include `corporate-recruiter` created jobs
   *     2. For `corporate-recruiter`:
   *        1. Only jobs from their `Company`:
   *           1. Include `corporate-recruiter` created jobs
   */
  userRole?: CorporateUserTypeEnum;
  corporateRecruiterUserId?: string; // `id` attribute from `CorporateUser.model.ts`

  /**
   * @description: Whenever `corporate` or `worko-admin` clicks directly the `Applicants` tab directly without
   * selecting a job, we are showing a popup to search a job and select a job to list all the job applications
   * for that selected job. But we are attaching the company details also, to avoid attaching company details
   * for this use case. We are using this field.
   */
  includeCompanyDetails?: boolean;

  /**
   * @description: While listing jobs in `corporate` or `worko-admin` dashboard
   * we will show the counts of job applications for each job, If we want to show this count we will set this field to `true`.
   */
  includeCountCompanyJobEntityJobApplication?: boolean;
}

/**
 * ParsedJobDescriptionApiDto
 */
export interface ParsedJobDescriptionApiDto {
  jobDescription: string;
}


/**
 * ParsedJobDescriptionResponseDto
 * 
 * Whenever the job description is sent from the frontend it will be parsed by the lambda function(`worko-job-description-parser`) 
 * and the parsed job description will be returned to the frontend
 */
export interface ParsedJobDescriptionResponseDto {
  jobTitle: string;
  salaryRange: {
    min: string;
    max: string;
  };
  experienceRange: {
    min: string;
    max: string;
  };
  numberOfOpenings: string;
  workMode: string;
  location: string;
  noticePeriod: string;
  typeOfEmployment: string;
  department: string;
  coreSkills: string[];
  softSkills: string[];
  technicalSkills: string[];
  goodToHaveSkills: string[];
  mustHaveSkills: string[];

  /**
   * Sample value: "<div>\n<section>\n<h2>Company Overview</h2>\n<p>Not provided in the job description.</p>\n</section>\n<section>\n<h2>Role...."
   */
  formattedHTML?: string;
  mandatoryRequirements?: string[];
  preferredRequirements?: string[];
}

/**
 * JobUpdateApiDto
 * 
 * This DTO is used to validate and structure the data received from the client (API request).
 */
export interface JobUpdateApiDto {
  companyId?: string;
  status?: JobStatusEnum;
  jobTitle?: string;
  jobDescription?: string;
  htmlJobDescription?: string;
  otherRequirements?: string;
  experienceRange?: MinMaxRange;
  noticePeriod?: number;
  flexibleNotice?: boolean;
  numOfOpenings?: number;
  salaryRange?: SalaryRangeDto;
  department?: string;
  location?: JobLocationDto;
  workMode?: JobWorkModeEnum;
  typeofEmployment?: string;
  coreSkills?: string[];
  goodToHaveSkills?: string[];
  softSkills?: string[];
  technicalSkills?: string[];
  miscellaneousSkills?: string[];
  displaySalaryRange?: boolean;
  gradeLevel?: number;
}

/**
 * JobUpdateDto
 */
export interface JobUpdateDto extends JobUpdateApiDto {
  updatedByUserId?: string;
  updatedByCorporateUserId?: string;

  /**
   * updatedAt
   * 
   * @example "2023-02-01T15:33:14.375184"
   */
  updatedAt?: string;
  isDeleted?: boolean;
}

/**
 * JobSoftDeleteApiDto
 */
export interface JobSoftDeleteApiDto {
  companyId: string;
  shortSoftDeleteReason: string;
  detailedSoftDeleteReason?: string;
}

/**
 * JobUpdateInternalDto
 */
export interface JobUpdateInternalDto {
  isAppliedBySomeone: boolean;
  isDeleted: boolean;
  shortSoftDeleteReason: string;
  detailedSoftDeleteReason: string;

  /**
   * updatedAt
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  updatedAt: string;

  status: JobStatusEnum;

  /**
   * updatedByCorporateUserId
   *
   * @reference `id` attribute from `CorporateUser.model.ts`
   *
   * @description The `updatedByCorporateUserId` attribute represents the ID of the corporate user who updated the job,
   * While updating a job, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * who updated the job from the `CorporateUser` model.
   */
  updatedByCorporateUserId: string;

  /**
   * updatedByUserId
   *
   * @reference `id` attribute from `UserDetail.model.ts`
   *
   * @description The `updatedByUserId` attribute represents the ID of the worko admin user who updated the job
   */
  updatedByUserId: string;
}

/**
 * JobCreateCompanyDetailInternalDto
 */
export interface JobCreateCompanyDetailInternalDto {
  companyName: string;
  companyUrl?: string;
  companyLogoUrl?: string;
}

/**
 * JobBulkUpdateApiDto
 */
export interface JobBulkUpdateApiDto {
  bulkJobUpdate: {
    companyId: string;
    jobId: string;
    status: JobStatusEnum;
  }[]
}

/**
 * JobBulkUpdateResponseDto
 */
export interface JobBulkUpdateResponseDto {
  opensearchBulkJobUpdateMetrics: EntityBulkUpdateMetricDto;
  dynamodbBulkJobUpdateMetrics: EntityBulkUpdateMetricDto;
}

export interface SalaryRangeDto {
  min?: number;
  max?: number;
  fixedComponentPercentage?: number;
  variableComponentPercentage?: number;
}