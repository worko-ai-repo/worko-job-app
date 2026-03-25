
/**
 * InvocationTypeEnum
 * 
 * Enum representing the type of invocation of a Lambda function.
 * 
 * API Reference Invoke Lambda Documentation:
 * @see https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html
 */
export enum InvocationTypeEnum {
  /**
   * RequestResponseType
   *
   * RequestResponse (default) – Invoke the function synchronously.
   * Keep the connection open until the function returns a response or times out.
   * The API response includes the function response and additional data.
   *
   * For the `RequestResponse` invocation type, this status code is 200.
   */
  RequestResponseType = "RequestResponse",

  /**
   * EventType
   *
   * Event – Invoke the function asynchronously.
   * Send events that fail multiple times to the function's dead-letter queue (if one is configured).
   * The API response only includes a status code.
   *
   * For the `Event` invocation type, this status code is 202.
   */
  EventType = "Event",

  /**
   * DryRunType
   *
   * DryRun – Validate parameter values and verify that the user or role has permission to invoke the function.
   *
   * For the `DryRun` invocation type, the status code is 204.
   */
  DryRunType = "DryRun",
}

export enum InvokeLambdaHandlerEventTypeEnum {
  NEW_INTERNAL_JOB_CAND_MATCH = "NEW_INTERNAL_JOB_CAND_MATCH",

  /**
   * @description Whenever the job status is updated to other than "PUBLISHED" then this event will be triggered to
   * update `candidateJobRecommendations` and `candidateJobAlerts` collections in firestore.
   */
  JOB_STATUS_CAND_JOB_RECOMMEND_ALERT_UPDATE = "JOB_STATUS_CAND_JOB_RECOMMEND_ALERT_UPDATE",

  /**
   * @description Whenever `worko-admin` move the candidate(agency submitted candidate or sourcetype candidate) to applicant page
   * then and matching score is already found then this lambda is triggerred to perform send email or reject job application activities.
   */
  JOB_APPLICATION_VALIDATE_MATCHING_SCORE = "JOB_APPLICATION_VALIDATE_MATCHING_SCORE",

  SCRIPT_OLD_JOBS_CAND_ALERT_RECOMMEND = "SCRIPT_OLD_JOBS_CAND_ALERT_RECOMMEND",

  SCRIPT_BATCH_INFERENCE_TEST = "SCRIPT_BATCH_INFERENCE_TEST",
}

export enum SourceTypeMatchingScoreEntityEnum {
  /**
   * @description
   *  1. Whenever a candidate is moved to applicant page without calculating matching score then
   *  in ui we are giving a button to find match score against particular job application, so this source type will be used
   */
  USER_JOB_APPLICATION = "USER_JOB_APPLICATION",
}