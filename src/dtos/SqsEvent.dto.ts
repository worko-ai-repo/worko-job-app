/**
 * Base interface for SQS message request data transfer objects (DTOs).
 *
 * @interface SqsMsgBaseReqDto
 *
 * @property {string} event - The name of the event.
 * @property {string} userId - The user's unique identifier.
 * @property {string} userEmail - The user's email address.
 */
export interface SqsMsgBaseReqDto {
  event: string;
  userId: string;
  userEmail: string;
}

/**
 * Interface for SQS message request DTO related to job application validation and matching score.
 */
export interface SqsMsgJobApplicationValidationMatchingScoreReqDto
  extends SqsMsgBaseReqDto {
  context: {
    jobApplicationRequestId: string;
  };
}
