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

  /**
   * "NoSuchKey" is known AWS S3 error code when object doesn't exist
   */
  NO_SUCH_KEY = "NoSuchKey",

  /**
   * "NotFound" is known AWS S3 error code
   */
  NOT_FOUND = "NotFound",

  /**
   * "NoSuchBucket" is known AWS S3 error code
   */
  NO_SUCH_BUCKET = "NoSuchBucket",

  /**
   * "AccessDenied" is known AWS error code
   */
  ACCESS_DENIED = "AccessDenied",
}

export default ErrorCodeName;
