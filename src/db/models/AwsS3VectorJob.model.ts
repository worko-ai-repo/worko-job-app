
// Import dtos
import { JobLocationDto, MinMaxRange } from "../../dtos/Common.dto";
import { SalaryRangeDto } from "../../dtos/Job.dto";

// Import enums
import { JobStatusEnum } from "../../enums/Job.enum";

/**
 * DbJobAwsS3VectorDto
 * 
 * @description 
 *    1. This model is just for `refrence` purpose
 *    2. We are storing below attributes in aws s3 vector, if you want to add any attributes
 *    or know more about this model please check with "Ai Team".
 */
export interface DbJobAwsS3VectorDto {
  /**
   * jobId
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
  jobId: string;

  /**
   * jobTitle
   */
  jobTitle: string;

  /**
   * location
   *
   * @see {JobLocationDto}
   */
  location?: JobLocationDto;

  /**
   * department
   */
  department?: string;

  /**
   * salaryRange
   *
   * @see {SalaryRangeDto}
   */
  salaryRange?: SalaryRangeDto;

  /**
   * experienceRange
   *
   * @see {MinMaxRange}
   */
  experienceRange?: MinMaxRange;

  /**
   * allSkills
   * 
   * Includes coreSkills, technicalSkills, softSkills and miscellaneousSkills
   */
  allSkills?: string[];

  /**
   * status
   *
   * @see {JobStatusEnum}
   */
  status: JobStatusEnum;

  /**
   * otherRequirements
   */
  otherRequirements?: string;
}
