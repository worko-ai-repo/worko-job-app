// Interview module enums
/**
 * Enumeration representing the different statuses an interview can have throughout its lifecycle.
 * Used to track and manage the current state of interview processes.
 */
export enum InterviewStatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

/**
 * Type representing the keys of the InterviewStatusEnum.
 */
export type InterviewStatusType = keyof typeof InterviewStatusEnum;

/**
 * Enumeration representing the different actors involved in the interview process.
 * Helps identify who performed specific actions or changes in the interview lifecycle.
 */
export enum InterviewActorEnum {
  ADMIN = "ADMIN",
  CORPORATE_RECRUITER = "CORPORATE_RECRUITER",
  CORPORATE_ADMIN  = "CORPORATE_ADMIN",
  EVALUATOR = "EVALUATOR",
}

/**
 * Type representing the keys of the InterviewActorEnum.
 */
export type InterviewActorType = keyof typeof InterviewActorEnum;

/**
 * Enumeration representing the upload status of interview chunks.
 * Used to track the state of data uploads during the interview process.
 */
export enum InterviewChunkUploadStatusEnum {
  UPLOADED = "UPLOADED",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

/**
 * Type representing the keys of the InterviewChunkUploadStatusEnum.
 */
export type InterviewChunkUploadStatusType = keyof typeof InterviewChunkUploadStatusEnum;

