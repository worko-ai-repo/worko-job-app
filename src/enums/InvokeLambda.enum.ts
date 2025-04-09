
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