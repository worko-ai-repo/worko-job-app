// Import dtos
import { JobLocationDto, MinMaxRange } from "../../dtos/Common.dto";

// Import enums
import { JobSourcedFromEnum } from "../../enums/Common.enum";
import { JobStatusEnum, JobWorkModeEnum } from "../../enums/Job.enum";

/**
 * JobModel
 *
 * This is the model to store all the jobs in AWS OpenSearch
 * 
 * @indexName `worko-jobs`
 */
export interface DbJobAwsOpensearchDto {
  /**
   * id
   *
   * The `id` attribute is a unique identifier for each job.
   *
   * @description
   *  1. Whenever the job is created by worko admin or corporate user, then the
   *     job will be first created in aws dynamodb, then the `id` attribute
   *     which is generated and stored in the aws dynamodb will be used to
   *     for the `id` attribute in aws opensearch.
   *     @reference `id` attribute from `CompanyJob.model.ts`
   *  2. Whenever the job is retrieved from external source(ex:- fantastic jobs),
   *     then backend will generate the `id` attribute and store in aws opensearch.
   */
  id: string;

  /**
   * companyId
   *
   * @reference `id` attribute from `CompanyDetail.model.ts`
   */
  companyId?: string;

  /**
   * id
   *
   * @example "1357943872"
   */
  externalJobId?: string;

  /**
   * sourcedFrom
   */
  sourcedFrom?: JobSourcedFromEnum;

  /**
   * createdByCorporateUserId
   *
   * @reference `id` attribute from `CorporateUser.model.ts`
   *
   * @description The `createdByCorporateUserId` attribute represents the ID of the corporate user who created the job,
   * While creating a job, the `userId` recieved from the authorizer context will be the `cognito user id`,
   * In the backend, the `userId` will be converted by using `uuidToULID()` method to access the details of the user
   * who created the job from the `CorporateUser` model.
   */
  createdByCorporateUserId?: string;

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
  updatedByCorporateUserId?: string;

  /**
   * createdByUserId
   *
   * @reference `id` attribute from `UserDetail.model.ts`
   *
   * @description The `createdByUserId` attribute represents the ID of the worko admin user who created the job
   */
  createdByUserId?: string;

  /**
   * updatedByUserId
   *
   * @reference `id` attribute from `UserDetail.model.ts`
   *
   * @description The `updatedByUserId` attribute represents the ID of the worko admin user who updated the job
   */
  updatedByUserId?: string;

  /**
   * createdAt
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  createdAt: string;

  /**
   * updatedAt
   *
   * @example "2023-02-01T15:33:14.375184"
   */
  updatedAt: string;

  /**
   * jobTitle
   */
  jobTitle: string;

  /**
   * typeofEmployment
   */
  typeofEmployment?: string;

  /**
   * location
   *
   * @see {JobLocationDto}
   */
  location?: JobLocationDto;

  /**
   * jobDescription
   */
  jobDescription?: string;

  /**
   * htmlJobDescription
   */
  htmlJobDescription?: string;

  /**
   * jobPostedDate
   *
   * @example "2025-02-01T00:00:00"
   */
  jobPostedDate?: string;

  /**
   * jobCreatedDate
   *
   * @example "2025-02-01T15:33:14.375184"
   */
  jobCreatedDate?: string;

  /**
   * department
   */
  department?: string;

  /**
   * salaryRange
   *
   * @see {MinMaxRange}
   */
  salaryRange?: MinMaxRange;

  /**
   * jobUrl
   *
   * @example
   *  1. "https://jobs.smartrecruiters.com/ServiceNow/744000040898085-head-of-financial-services-gtm",
   *  2. "https://dev-ui.worko.work/jobs/TEST_WORKO_4.0/01JP07XTR449YC9CFV1VQ88TX5"
   */
  jobUrl?: string;

  /**
   * experienceRange
   *
   * @see {MinMaxRange}
   */
  experienceRange?: MinMaxRange;

  /**
   * coreSkills
   */
  coreSkills?: string[];

  /**
   * softSkills
   */
  softSkills?: string[];

  /**
   * technicalSkills
   */
  technicalSkills?: string[];

  /**
   * status
   *
   * @see {JobStatusEnum}
   */
  status?: JobStatusEnum;

  /**
   * workMode
   *
   * @see {JobWorkModeEnum}
   */
  workMode?: JobWorkModeEnum;

  /**
   * miscellaneousSkills
   */
  miscellaneousSkills?: string[];

  /**
   * noticePeriod
   */
  noticePeriod?: number;

  /**
   * numOfOpenings
   */
  numOfOpenings?: number;

  /**
   * otherRequirements
   */
  otherRequirements?: string;

  /**
   * companyName
   *
   * @example "ServiceNow"
   */
  companyName?: string;

  /**
   * companyUrl
   *
   * @example "https://agileengine.com/"
   */
  companyUrl?: string;

  /**
   * companyLogoUrl
   *
   * @example "https://assets.phenompeople.com/CareerConnectResources/prod/SNCOUS/images/job_logo_config-1597759560794.png"
   */
  companyLogoUrl?: string;

  /**
   * isAppliedBySomeone
   */
  isAppliedBySomeone?: boolean;

  /**
   * isDeleted
   */
  isDeleted: boolean;

  /**
   * displaySalaryRange
   */
  displaySalaryRange?: boolean; 
}
