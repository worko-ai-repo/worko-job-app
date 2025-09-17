// Import v3 SDK for AWS Bedrock
import {
  BedrockClient,
  CreateModelInvocationJobCommand,
  CreateModelInvocationJobCommandInput,
  CreateModelInvocationJobCommandOutput,
} from "@aws-sdk/client-bedrock";

/**
 * AwsBedrockClientLibrary
 * 
 * 1. Describes the API operations for creating, managing, fine-turning, and evaluating Amazon Bedrock models.
 *    @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-bedrock/
 */
class AwsBedrockClientLibrary {
  // Initialize a new BedrockClient
  private readonly bedrockClient = new BedrockClient({
    /**
     * 1. Supported foundation models in Amazon Bedrock
     *    @see https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
     */
    region: process.env.APP_SLS_REGION,
  });

  /**
   * createModelInvocationJob
   *
   * Creates a new model invocation job with the specified input parameters.
   *
   * @param {CreateModelInvocationJobCommandInput} input - The input parameters for the model invocation job.
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-bedrock/Interface/CreateModelInvocationJobCommandInput/
   */
  async createModelInvocationJob(
    input: CreateModelInvocationJobCommandInput
  ): Promise<CreateModelInvocationJobCommandOutput> {
    global.logger.debug(`Create model invocation job [AWS BEDROCK LIBRARY]`, {
      methodName: this.createModelInvocationJob.name,
      input,
    });

    const command: CreateModelInvocationJobCommand = new CreateModelInvocationJobCommand(input);
    return await this.bedrockClient.send(command);
  }
}

// Export the AwsBedrockClientLibrary
export { AwsBedrockClientLibrary };