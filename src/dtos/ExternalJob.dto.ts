
// Import dtos
import { JobLocationDto, MinMaxRange } from "./Common.dto";

// Import enums
import { JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

/**
 * ExternalJobCreateDto
 */
export interface ExternalJobCreateInternalDto {
  // Ids
  id: string; // `id` attribute from `Job.aws-opensearch-model.ts`

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

  externalJobId: string;

  jobTitle: string;
  location: JobLocationDto;
  jobDescription: string;
  htmlJobDescription?: string;
  jobPostedDate: string;
  jobCreatedDate: string;
  jobUrl: string;
  jobInternalUrl: string;
  status: JobStatusEnum;
  workMode: JobWorkModeEnum;
  
  sourcedFrom: JobSourcedFromEnum;
  
  typeofEmployment?: string;
  companyName?: string;
  companyUrl?: string;
  companyLogoUrl?: string;
  
  department?: string;
  technicalSkills?: string[];
  coreSkills?: string[];
  softSkills?: string[];
  experienceRange?: MinMaxRange;
  salaryRange?: MinMaxRange;
  otherRequirements?: string;
  noticePeriod?: number;
  numOfOpenings?: number;
  miscellaneousSkills?: string[];
  
  isDeleted: boolean;
}

/**
 * ExternalJobUpdateApiDto
 */
export interface ExternalJobUpdateApiDto {
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
}

/**
 * ExternalJobUpdateDto
 */
export interface ExternalJobUpdateDto extends ExternalJobUpdateApiDto {
  updatedByUserId?: string;
  updatedByCorporateUserId?: string;
  jobDescription?: string;
}