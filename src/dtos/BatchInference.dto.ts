/**
 * BatchInferenceInput
 *
 * Code examples for batch inference
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference-example.html
 *
 * Format and upload your batch inference data
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference-data.html
 */
export interface BatchInferenceModelInput {
  recordId: string;
  modelInput: {
    anthropic_version: string;
    max_tokens: number;
    messages: {
      role: string;
      content: {
        type: string;
        text: string;
      }[];
    }[];
  };
}
