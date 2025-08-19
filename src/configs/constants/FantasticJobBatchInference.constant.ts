
/**
 * FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS
 */
const FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS = {
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
    PROMPT: `**JOB DESCRIPTION EXTRACTION TASK**
**STEP 1 - Extract Basic Information:**
- Type of Employment (Return in UPPERCASE, e.g., FULL_TIME, PART_TIME)
- Department (Return in lowercase, e.g., hr, marketing, sales)
- Company Name (Return in UPPERCASE)
- Salary Range (Minimum and Maximum, in LPA)
- Experience Range (Minimum and Maximum, in years)
- Core Skills (Each skill must be lowercase, max 30 characters)
- Technical Skills (Each skill must be lowercase, max 30 characters)
- Soft Skills (Each skill must be lowercase, max 30 characters)
- Miscellaneous Skills (Each skill must be lowercase, max 30 characters)
- Notice Period (Days) (Enter a numeric value. If a range is provided, use the higher value.)
**STEP 2 - CRITICAL SKILL CLASSIFICATION RULES:**
**CORE SKILLS = Functional/Domain Expertise ONLY**
- INCLUDE in coreSkills: Specific job functions, domain knowledge, industry expertise
- Examples: "category management", "supplier relations", "e-commerce operations", "revenue management", "market research"
- EXCLUDE from coreSkills: Management abilities, thinking skills, interpersonal skills
- Examples: "team leadership", "strategic planning", "goal setting", "performance management", "stakeholder management"
**SOFT SKILLS = Behavioral/Interpersonal Abilities**
- INCLUDE in softSkills: How you work, think, and interact
- Examples: "leadership", "communication", "strategic thinking", "problem solving", "team management", "decision making"
**TECHNICAL SKILLS = Tools/Software/Platforms**
- INCLUDE in technicalSkills: Specific tools, software, platforms, systems
- Examples: "microsoft excel", "crm systems", "analytics tools", "database management"
**miscellaneousSkills**: Extract any other skills or requirements not fitting into the above categories, in "lowercase".
- If something is mentioned as a **general requirement, certification, or domain knowledge** that is not a
  core/technical/soft skill, add it here.
**MANDATORY SKILL MOVEMENT RULES:**
- "team leadership" → softSkills (NOT coreSkills)
- "strategic planning" → softSkills (NOT coreSkills)
- "storytelling" → softSkills (NOT coreSkills)
- "event handling" → softSkills (NOT coreSkills and NOT technicalSkills)
- "project execution" → softSkills (NOT coreSkills and NOT technicalSkills)
- "stakeholder management" → softSkills (NOT coreSkills)
- "goal setting" → softSkills (NOT coreSkills)
- "performance management" → softSkills (NOT coreSkills)
- "data analysis" → technicalSkills if tool-based, softSkills if analytical thinking
- "process development" → softSkills (NOT coreSkills)
- "problem resolution" → softSkills (NOT coreSkills)
- "business development" → coreSkills (NOT softSkills)
- "financial analysis" → coreSkills (NOT technicalSkills)
- "market research" → coreSkills (NOT softSkills)
- "sales strategy" → coreSkills (NOT softSkills)
- "programming languages (python, java, etc.)" → technicalSkills (NOT coreSkills)
- "cloud platforms (aws, azure, gcp)" → technicalSkills (NOT coreSkills)
- "version control (git, svn)" → technicalSkills (NOT coreSkills)
- "database design/sql" → technicalSkills (NOT coreSkills)
- "project management" → softSkills (NOT coreSkills)
- "communication skills" → softSkills (NEVER coreSkills or technicalSkills)
- "excel/power bi/visualization tools" → technicalSkills (NOT coreSkills)
- "customer relationship management (crm)" → technicalSkills (NOT coreSkills)
- "rag pipelines"  → technicalSkills (NOT coreSkills and NOT softSkills)
**STEP 5 - FINAL VALIDATION (CRITICAL):**
Before generating JSON, perform these checks:
1. Scan coreSkills - remove ANY management/leadership/planning skills
2. Move removed skills to softSkills
3. Check for duplicates across all skill arrays - remove duplicates
4. Ensure each skill is in ONLY ONE category
5. Verify coreSkills contains ONLY functional/domain expertise
**EMPTY FIELD RULE:**
- If information is not explicitly mentioned, leave field empty (not "Not Mentioned")
**PROCESSING THE JOB DESCRIPTION:**
Now analyze this job description step by step:
{promptJobDescription}
Return only the following JSON structure with extracted values. Do not provide any additional content, explanations,
or details:\n\n{\n  \"typeofEmployment\": \"string\", // UPPERCASE format (e.g., FULL_TIME, PART_TIME)\n  \"department\": \"string\",
// lowercase format (e.g., hr, marketing, sales)\n  \"companyName\": \"string\", // UPPERCASE format\n  \"salaryRange\": {\n    \"min\": number,
\n    \"max\": number\n  }, //in LPA (e.g 3 LPA, 12 LPA)\n  \"experienceRange\": {\n    \"min\": number,\n    \"max\": number\n  },
// in years\n  \"coreSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"technicalSkills\": [\n    \"string\",
// lowercase format\n    \"string\"\n  ],\n  \"softSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],
\n  \"miscellaneousSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"noticePeriod\": number // in days \n}`,
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

export { FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS };
