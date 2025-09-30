
// Import dtos
import { AwsS3VectorRecordListingFilterOptions } from "./Common.aws-s3-vector.dto";

// Import enums
import { JobDashboardEnum, JobStatusEnum } from "../enums/Job.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

export interface AwsS3VectorJobListingFilterOptions extends AwsS3VectorRecordListingFilterOptions {
  jobId?: string;

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
}

export interface AwsS3VectorJobMatchingScoreDto {
  /**
   * @example 0.4529
   */
  finalScore: number;

  /**
   * @example 01K33GGZY62R94HA8R7BQNHCH4
   */
  jobId: string;

  /**
   * @example 1
   */
  matchRank: number;
}

export interface AwsS3VectorJobGetParsedResponseDto {
  jobs: AwsS3VectorJobMatchingScoreDto[];
  success: boolean;
  totalJobsFound: number;
  s3VectorLastKey: boolean;
}

export interface AwsS3VectorJobCreateOrUpdateJobDataDto {
  _index: string;

  _id: string;

  _score?: number;

  _source: Partial<DbJobAwsOpensearchDto>;
}

export interface AwsS3VectorJobCreateDto {
  jobData: AwsS3VectorJobCreateOrUpdateJobDataDto;
  indexName: string;
}

export interface AwsS3VectorJobBulkCreateDto {
  jobData: AwsS3VectorJobCreateOrUpdateJobDataDto[];
  indexName: string;
}

export interface AwsS3VectorJobUpdateDto {
  /**
   * @reference `id` attribute of `OpenSearchJob.model.ts`
   */
  updateJobId: string;
  
  jobData: AwsS3VectorJobCreateOrUpdateJobDataDto;
  indexName: string;
}

export interface AwsS3VectorJobCreateOrUpdateParsedResponseDto {
  /**
   * @example "Direct job data ingestion completed",
   */
  message: string;
  results: {
    /**
     * @example 1
     */
    success: number;

    /**
     * @example 0
     */
    failed: number;
  };

  /**
   * @example "worko-s3-vector-bucket"
   */
  vectorBucketName: string;

  /**
   * @example "worko-s3-jobs-index"
   */
  indexName: string;
}

export interface AwsS3VectorJobBulkDeleteDto {
  deleteJobIds: string[];
  indexName: string;
}

export interface AwsS3VectorJobBulkDeleteParsedResponseDto {
  message: string;
  results: {
    success: boolean;
    totalRequested: number;
    successfulDeletions: number;
    failedDeletions: number;
    indexName: string;
    bucketName: string;
    results: {
      jobId: string;
      vectorKey: string;
      error?: string;
      status: string;
    }[];
    message: string;
  };
  vectorBucketName: string;
  indexName: string;
}

export interface AwsS3VectorJobBulkUpdateDataDto {
  jobId: string;
  jobData: AwsS3VectorJobCreateOrUpdateJobDataDto;
}

export interface AwsS3VectorJobBulkUpdateDto {
  updateJobs: AwsS3VectorJobBulkUpdateDataDto[];
  indexName: string;
}

export interface AwsS3VectorJobBulkUpdateParsedResponseDto {
  indexName: string;
  message: string;
  results: {
    bucketName: string;
    failedUpdates: number;
    indexName: string;
    message: string; // "Successfully updated all 1 jobs"
    results: {
      jobId: string;
      operation: string; // "job_updated"
      status: string; // success
      wasExisting: boolean;
    }[];
    success: boolean;
    successfulUpdates: number;
    totalRequested: number;
  };
  vectorBucketName: string; // worko-s3-vector-bucket
}