
/**
 * ErrorCodeName
 */
enum ErrorCodeName {
  /**
   * "ResourceNotFoundException" is known AWS error code
   */
  RESOURCE_NOT_FOUND_EXCEPTION = "ResourceNotFoundException",

   /**
    * "ValidationException" is known AWS error code
    */
   VALIDATION_EXCEPTION = "ValidationException",

  /**
   * "ProvisionedThroughputExceededException" is known AWS error code
   */
  PROVISIONED_THROUGHPUT_EXCEEDED_EXCEPTION = "ProvisionedThroughputExceededException",
}

export default ErrorCodeName;