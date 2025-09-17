
// Import enums
import { UserMatchingScoreJobStatusEnum } from "../../enums/UserMatchingScoreJob.enum";

/**
 * DbUserMatchingScoreJobAwsOpensearchDto
 * 
 * This is the model for the UserMatchingScoreJob to store in AWS OpenSearch
 * 
 * @indexName `worko-user-matching-score-job`
 */
export interface DbUserMatchingScoreJobAwsOpensearchDto {
  /**
   * id
   */
  id: string;

  /**
   * createdAt
   *
   * @example "2025-03-13T04:12:00.644080"
   */
  createdAt: string;

  /**
   * updatedAt
   *
   * @example "2025-03-13T05:11:51.507"
   */
  updatedAt: string;

  /**
   * userId
   *
   * @reference `id` attribute from `UserDetail.model.ts`
   */
  userId: string;

  /**
   * jobId
   *
   * @reference `id` attribute from `OpenSearchJob.model.ts`
   */
  jobId: string;

  /**
   * status
   *
   * @see {UserMatchingScoreJobStatusEnum}
   */
  status?: UserMatchingScoreJobStatusEnum;

  /**
   * isTriggered
   *
   * @example true
   */
  isTriggered?: boolean;

  /**
   * scoreDetails
   *
   * @example "{\"detailedAnalysis\": {\"technicalSkills\": {\"score\": 24, \"relevantSentences\": [\"Technical skills: HTML",...."]}}}
   */
  scoreDetails?: string;

  /**
   * matchingScore
   *
   * @example 70
   */
  matchingScore?: number;

  /**
   * jdMatchErrorCode
   *
   * @example 0
   */
  jdMatchErrorCode?: number;

  /**
   * jdMatchErrorDesc
   *
   * @example "No errors"
   */
  jdMatchErrorDesc?: string;
}