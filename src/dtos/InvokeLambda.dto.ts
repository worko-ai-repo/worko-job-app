/**
 * InvokeLambdaParsedJobDescriptionDto
 *
 * Payload for parsed job description while invoking lambda function
 */
export interface InvokeLambdaParsedJobDescriptionDto {
  /**
   * JOB_DESC
   *
   * Job Description to be parsed which will be come from frontend
   */
  JOB_DESC: string;
}

/**
 * InvokeLambdaToMatchUserResumeWithJobAndJdDto
 * 
 * Payload for updating user matching score while invoking lambda function
 */
export interface InvokeLambdaToMatchUserResumeWithJobAndJdDto {
  userId: string; // `id` attribute in `UserDetail.model.ts`
  jobId: string; 
}