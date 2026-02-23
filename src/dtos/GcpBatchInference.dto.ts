
/**
 * @see https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#request
 */
export interface GcpBatchInferenceModelInput {
  custom_id: string;
  request: {
    contents: [
      {
        role: string;
        parts: {
          text: string;
        }[];
      }
    ];
    generationConfig: {
      maxOutputTokens: number;
      temperature: number;
      topP: number;
    };
  };
}
