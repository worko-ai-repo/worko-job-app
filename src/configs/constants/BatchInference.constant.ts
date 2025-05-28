
/**
 * BATCH_INFERENCE_APP_CONSTANTS
 */
const BATCH_INFERENCE_APP_CONSTANTS = {
  /**
   * BATCH_INFERENCE_MODEL_INPUT
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference-data.html#batch-inference-data-ex-text
   */
  BATCH_INFERENCE_MODEL_INPUT: {
    ANTHROPIC_VERSION: "bedrock-2023-05-31",
    MAX_TOKENS: 1024,
    ROLES: {
      USER: "user",
    },
    CONTENT_TYPES: {
      TEXT: "text",
    },
    PROMPT: `Act as a HR analyst, extract the following details from the job description:\n\nHere is the job description:\n\n{promptJobDescription}\n\nReturn only the following JSON structure with extracted values. Do not provide any additional content, explanations, or details:\n\n{\n  \"typeofEmployment\": \"string\", // UPPERCASE format (e.g., FULL_TIME, PART_TIME)\n  \"department\": \"string\", // lowercase format (e.g., hr, marketing, sales)\n  \"companyName\": \"string\", // UPPERCASE format\n  \"salaryRange\": {\n    \"min\": number,\n    \"max\": number\n  }, //in LPA (e.g 3 LPA, 12 LPA)\n  \"experienceRange\": {\n    \"min\": number,\n    \"max\": number\n  }, // in years\n  \"coreSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"technicalSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"softSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"miscellaneousSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"noticePeriod\": number // in days \n}`,
  },

  /**
   * The number of hours after which to force the batch inference job to time out.
   * Valid Range: Minimum value of 24. Maximum value of 168.
   */
  BATCH_INFERENCE_TIME_OUT_DURATION_IN_HOURS: {
    MIN: 24,
    MAX: 168,
    CUSTOM: 24,
  },

  /**
   * BATCH_INFERENCE_AWS_BEDROCK_ARNS
   * 
   * The ARNs for AWS Bedrock
   */
  BATCH_INFERENCE_AWS_BEDROCK_ARNS: {
    /**
     * @example `arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0`
     */
    MODEL: `arn:aws:bedrock:${process.env.APP_SLS_REGION}::foundation-model/${process.env.APP_AWS_BEDROCK_MODEL_NAME}`,

    /**
     * @example `arn:aws:iam::211125353899:role/service-role/worko-batch-inference-role`
     */
    SERVICE_ROLE: `arn:aws:iam::${process.env.APP_AWS_ACCOUNT_ID}:role/service-role/${process.env.APP_AWS_BEDROCK_SERVICE_ROLE}`,
  },
};

export { BATCH_INFERENCE_APP_CONSTANTS };
