
// Import dtos
import { AwsOpensearchRecordListingFilterOptions, AwsOpensearchRecordListingFilterRequestDTO } from "./Common.aws-opensearch.dto";

// Import enums
import { UserMatchingScoreJobStatusEnum } from "../enums/UserMatchingScoreJob.enum";

/**
 * UserMatchingScoreJobApiDTO
 */
export interface UserMatchingScoreJobUpdateApiDTO {
  jobIds: string[]
}

/**
 * UserMatchingScoreJobUpdateDto
 */
export interface UserMatchingScoreJobUpdateDto {
  status: UserMatchingScoreJobStatusEnum;
  updatedAt: string;
}

/**
 * UserMatchingScoreJobListingFilterOptions
 */
export interface UserMatchingScoreJobListingFilterOptions extends AwsOpensearchRecordListingFilterOptions {
  jobIds: string[],
  userId: string,
}

/**
 * UserMatchingScoreJobListingFilterRequestDTO
 */
export interface UserMatchingScoreJobListingFilterRequestDTO extends AwsOpensearchRecordListingFilterRequestDTO {
  jobIds: string, // Comma separated job ids, e.g. "jobId1,jobId2,jobId3"
}