
// Import dtos
import { JobLocationDto, MinMaxRange } from "./Common.dto";
import { AwsOpensearchRecordListingFilterOptions, AwsOpensearchRecordListingFilterRequestDTO } from "./Common.aws-opensearch.dto";

// Import enums
import { JobDashboardEnum, JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";

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
  noticePeriod: number;
  numOfOpenings: number;
  salaryRange: MinMaxRange;
  department: string;
  location: JobLocationDto;
  workMode: JobWorkModeEnum;
  typeofEmployment: string;
  coreSkills: string[]; // Array of skills like [JAVA, PYTHON] i.e skillName
  softSkills: string[]; // Array of skills like [COMMUNICATION, TEAMWORK]
  technicalSkills: string[]; // Array of skills like [MS EXCEL, MS OFFICE, SAP]
  miscellaneousSkills?: string[]; // Array of any skills could be from the above 3 fields.
  status: JobStatusEnum; // This will be asked by the UI team to update the status of the Job. for eg. If the admin leaves the form and close the session it'd be saved as draft.
  displaySalaryRange?: boolean; 
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
  dashboard?: JobDashboardEnum,
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
  jobTitle? : string
  typeofEmployment?: string;
  companyName?: string;
  YOE?: number;
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
  dashboard?: JobDashboardEnum,
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
  jobTitle? : string
  typeofEmployment?: string;
  companyName?: string;
  YOE?: string;
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

  /**
   * Sample value: "<div>\n<section>\n<h2>Company Overview</h2>\n<p>Not provided in the job description.</p>\n</section>\n<section>\n<h2>Role...."
   */
  formattedHTML?: string;
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
  numOfOpenings?: number;
  salaryRange?: MinMaxRange;
  department?: string;
  location?: JobLocationDto;
  workMode?: JobWorkModeEnum;
  typeofEmployment?: string;
  coreSkills?: string[];
  softSkills?: string[];
  technicalSkills?: string[];
  miscellaneousSkills?: string[];
  displaySalaryRange?: boolean;
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
}

/**
 * JobSoftDeleteApiDto
 */
export interface JobSoftDeleteApiDto {
  companyId: string;
}

/**
 * JobUpdateInternalDto
 */
export interface JobUpdateInternalDto {
  isAppliedBySomeone: boolean;
  isDeleted: boolean;

  /**
   * updatedAt
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  updatedAt: string;
  
  status: JobStatusEnum;
}

/**
 * JobCreateCompanyDetailInternalDto
 */
export interface JobCreateCompanyDetailInternalDto {
  companyName: string;
  companyUrl?: string;
  companyLogoUrl?: string;
}