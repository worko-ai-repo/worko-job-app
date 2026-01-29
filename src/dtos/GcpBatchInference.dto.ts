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
