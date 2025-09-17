// Import Common Dto
import { JobLocationDto, MinMaxRange, RecordListingFilterOptions, RecordListingFilterRequestDTO } from '../dtos/Common.dto';

// Import Enums
import { CompanyJobStatusEnum, CompanyJobWorkModeEnum } from '../enums/CompanyJob.enum';
import { JobStatusEnum, JobWorkModeEnum } from '../enums/Job.enum';

/**
 * SalaryRange
 * 
 * This is the DTO for the Salary Range.
 */
export interface CompanyJobRangeDto {
    min: number;
    max: number;
}
/**
 * CompanyJobCreateApiDto:
 * 
 * This DTO is used to validate and structure the data received from the client (API request).
 */
export interface CompanyJobCreateApiDto {
  companyId: string;
  jobTitle: string;
  jobDescription: string;
  htmlJobDescription: string;
  otherRequirements?: string;
  experienceRange: MinMaxRange;
  noticePeriod?: number;
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
  status: JobStatusEnum;
  displaySalaryRange?: boolean; 
}

/**
 * CompanyJobCreateDto
 * 
 * This is the DTO used to create a new job for the company .Specially used by the backend team.
 * 
 * @extends CompanyJobCreateApiDto
 * 
 * @property {string} createdByUserId - The ID of the user who created the job.
 */
export interface CompanyJobCreateDto extends CompanyJobCreateApiDto {
    createdByUserId?: string;
    createdByCorporateUserId?: string;
}

/**
 * CompanyJobUpdateApiDto
 * 
 * This DTO is used to validate and structure the data received from the client (API request).
 */
export interface CompanyJobUpdateApiDto {
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
 * CompanyJobUpdateDto
 * 
 * This is the DTO used to update a job for the company .Specially used by the backend team.
 * 
 * @extends CompanyJobUpdateApiDto
 * 
 * @property {string} updatedByUserId - The ID of the user who updated the job.
 */
export interface CompanyJobUpdateDto extends CompanyJobUpdateApiDto {
  updatedByUserId?: string;
  updatedByCorporateUserId?: string;
  jobDescription?: string;
  isDeleted?: boolean;
}

/**
 * CompanyJobCommonUpdateDto
 */
export interface CompanyJobCommonUpdateDto {
  updatedByUserId: string;
  updatedByCorporateUserId: string;  
  status: JobStatusEnum;
  isDeleted: boolean;
}

/**
 * JobListingFilterOptions
 * 
 * This is the DTO used by Backend to get the Query Params for the Job Listing.Listing.
 */
export interface JobListingFilterOptions extends RecordListingFilterOptions {
    companyId?: string[];
    location?: string[];
    department?: string[];
    softSkills?: string[];
    coreSkills?: string[];
    technicalSkills?: string[];
    minExperience?: number;
    maxExperience?: number;
    workMode?: CompanyJobWorkModeEnum[];
    minSalary?: number;
    maxSalary?: number;
    status?: CompanyJobStatusEnum;
}

/**
 * JobListingFilterRequestDTO
 * 
 * This is the Dto for Receving the Query Params for the Job Listing which extends the RecordListingFilterOptionsDTO 
 * 
 * RecordListingFilterOptions is the DTO that contains the common fields for the Query Params i.e Sort, Limit, Page, Search etc.
 * and JobListingFilterOptions contains the fields that are specific to the Job 
 */
export interface JobListingFilterRequestDTO extends RecordListingFilterRequestDTO {
    companyId?: string[];
    location?: string[];
    department?: string[];
    softSkills?: string[];
    coreSkills?: string[];
    technicalSkills?: string[];
    minExperience?: number;
    maxExperience?: number;
    workMode?: CompanyJobWorkModeEnum[];
    minSalary?: number;
    maxSalary?: number;
    status?: CompanyJobStatusEnum;
}

/**
 * ScriptCompanyJobBulkUploadDto
 */
export interface ScriptCompanyJobBulkUploadDto {
  createdAt: number;
  updatedAt: number;
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  id: string;
  companyId: string;

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
   * The `updatedByUserId` attribute represents the ID of the worko admin user who updated the job
   */
  updatedByUserId?: string;

  coreSkills: string[];
  department: string;
  experienceRange: MinMaxRange;
  jobTitle: string;
  jobDescription: string;
  location: JobLocationDto;
  miscellaneousSkills?: string[];
  noticePeriod: number;
  numOfOpenings: number;
  otherRequirements?: string;
  salaryRange: MinMaxRange;
  softSkills: string[];
  status: JobStatusEnum;
  technicalSkills: string[];
  typeofEmployment: string;
  workMode: JobWorkModeEnum;
  jobUrl: string;

  isDeleted: boolean;
}