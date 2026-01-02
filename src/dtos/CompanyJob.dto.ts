// Import Common Dto
import { JobLocationDto, MinMaxRange, RecordListingFilterOptions, RecordListingFilterRequestDTO } from '../dtos/Common.dto';
import { SalaryRangeDto } from "./Job.dto";

// Import Enums
import { JobDashboardEnum, JobStatusEnum, JobWorkModeEnum } from '../enums/Job.enum';
import { CorporateUserTypeEnum } from '../enums/CorporateUser.enum';


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
  flexibleNotice?: boolean;
  numOfOpenings: number;
  salaryRange: SalaryRangeDto;
  department: string;
  location: JobLocationDto;
  workMode: JobWorkModeEnum;
  typeofEmployment: string;
  coreSkills: string[]; // Array of skills like [JAVA, PYTHON] i.e skillName
  goodToHaveSkills?: string[];
  softSkills: string[]; // Array of skills like [COMMUNICATION, TEAMWORK]
  technicalSkills: string[]; // Array of skills like [MS EXCEL, MS OFFICE, SAP]
  miscellaneousSkills?: string[]; // Array of any skills could be from the above 3 fields.
  status: JobStatusEnum;
  displaySalaryRange?: boolean;
  gradeLevel?: number;
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
  shortSoftDeleteReason: string;
  detailedSoftDeleteReason: string;
}

export interface CompanyJobListingFilterOptions extends RecordListingFilterOptions {
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

export interface CompanyJobListingFilterRequestDTO extends RecordListingFilterRequestDTO {
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