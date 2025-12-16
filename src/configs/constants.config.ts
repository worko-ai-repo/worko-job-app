import { EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS } from "../dtos/EmailTemplatePlaceholder.dto";

/**
 * APP_CONSTANTS
 *
 * These are the generic constants common for all applications/services.
 * For the application/service specific constants consider respective constant config file.
 */
const APP_CONSTANTS = {
  // Application default timezone
  APP_DEFAULT_TIMEZONE: process.env.TZ ?? "GMT",

  // Application stage
  APP_SLS_STAGE: process.env.APP_SLS_STAGE,

  // The stages/environments supported by the application.
  STAGES: {
    LOCAL: "local",
    DEV: "dev",
    PROD: "prod",
  },

  /**
   * Date formates
   */
  DATE_FORMAT_BASE_ERROR_TIMESTAMP: "ddd, DD MMM YYYY HH:mm:ss z", // Date format for the "BaseError.timeStamp" class property
  MYSQL_DATE_FORMATE: "YYYY-MM-DD", // MySQL Date formates

  // This is unknow exception error message
  ERROR_MESSAGE_UNKNOWN_EXCEPTION: "Something went wrong!!!",
  ERROR_MESSAGE_REQUEST_FOR_AUTHORISED_RESOURSE_ACCESS: "",
  ERROR_MESSAGE_RESOURCE_NOT_FOUND:
    "The requested resource is not found with the provided details.",

  /**
   * Signed URL expires in the given seconds.
   * Formula: {NUMBER OF MINUTES} * 60 [Unit: Seconds]
   */
  AWS_S3_SIGNED_URL_TO_UPLOAD_FILE_EXPIRY_IN_SECONDS: 15 * 60, // Pre-Signed url to upload the files expires in 15 minutes
  AWS_S3_SIGNED_URL_TO_VIEW_FILE_EXPIRY_IN_SECONDS: 15 * 60, // Pre-Signed url to view the files expires in 15 minutes

  /**
   * AWS S3 directory paths for different types of files.
   */
  AWS_S3_DIR_PATHS: {
    USER_RESUME: "users/{userId}/resumes", // To upload the individual user's resume
    USER_PROFILE_PIC: "users/{userId}/profilePics", // To upload the individual user's profile pics
    CAREER_RESUME: "career-resumes", // To upload the resumes uplaoded via career page
    COMPANY_JOB_DESCRIPTION: "companies/{companyId}/company-job-descriptions", // To upload the company job description uplaoded via `corporate dashboard` or `admin dashboard`
    BULK_CVS: "companies/{companyId}/bulk-cvs/{corporateBulkJdId}", // To upload the bulk cvs uplaoded via `corporate dashboard` or `admin dashboard`
    BATCH_INFERENCE_INPUT: "input/{externalJobSource}/{date}/{ulidId}/", // This is used to store the `id` attributes of the `OpenSearchJob.model.ts` and some batch inference related files in to s3
    BATCH_INFERENCE_OUTPUT: "output/{externalJobSource}/{date}/{ulidId}/", // This is used to store the batch inference output files in to s3
    USER_JOB_APPL_DOC:
      "users/{userId}/job-applications/{jobApplicationId}/documents",
    HR_OFFER_LETTER_SENT: `users/{userId}/job-applications/{jobApplicationId}/offer-letters`,
  },

  /**
   * APP_TEMPORARY_FOLDER_NAMES
   */
  APP_TEMPORARY_FOLDER_NAMES: {
    FANTASTIC_JOBS_BATCH_INFERENCE: "fantastic-jobs-batch-inference",
    BRIGHT_DATA_JOBS_BATCH_INFERENCE: "bright-data-jobs-batch-inference",
  },

  /**
   * AWS S3 file names for different types of files.
   * @awsS3Bucket "worko-{env}"
   */
  AWS_S3_FILE_NAMES: {},

  /**
   * AWS Opensearch bulk create count
   *
   * This is the maximum number of documents that can be created in a single bulk request to the OpenSearch index.
   */
  AWS_OPENSEARCH_AND_S3_VECTOR_BULK_CREATE_COUNT: 300,

  /**
   * AWS_DYNAMODB_BATCH_ACTION_LIMIT
   *
   * This is the maximum number of actions that can be performed in a single batch request to the DynamoDB table.
   */
  AWS_DYNAMODB_BATCH_ACTION_LIMIT: {
    GET: 100,
  },

  // The possible options for the page sizes that is expected in the request payload.
  PAGE_LENGTH_OPTIONS: [10, 25, 30, 50, 100, 150, 200, 250],

  // If "pageSize" from the request does not match with one of the "PAGE_LENGTH_OPTIONS" value, then this value would be used.
  PAGE_LENGTH_DEFAULT: 25,

  LAMBDA_FUNCTION_NAMES: {
    /**
     * RESUME_EXTRACTION_LAMBDA_NAME
     *
     * Lambda function name for "Resume Extraction"
     * AWS Lambada Configurations related to triggering "Resume Extraction"
     */
    RESUME_EXTRACTION_LAMBDA_NAME: "resume-parser",

    /**
     * MATCHING_SCORE_LAMBDA_NAME
     *
     * Lambda function name for "Matching Score"
     * AWS Lambada Configurations related to triggering "Matching Score"
     */
    MATCHING_SCORE_LAMBDA_NAME: "worko-jd-resume-matching",

    /**
     * JOB_DESCRIPTION_PARSER_LAMBDA_NAME
     *
     * Lambda function name for "Job Description Parser"
     * AWS Lambada Configurations related to triggering "Job Description Parser"
     */
    JOB_DESCRIPTION_PARSER_LAMBDA_NAME: "worko-job-description-parser",

    /**
     * USER_MATCHING_SCORE_JOB_LAMBDA_NAME
     *
     * Lambda function name for "User Matching Score Job"
     * AWS Lambada Configurations related to triggering "User Matching Score Job"
     */
    USER_MATCHING_SCORE_JOB_LAMBDA_NAME: "worko-user-matching-score-job",

    /**
     * RAG_FEEDBACK_INGESTION
     * 
     * @description 
     *  1. We are using this lambda to invoke whenever the corporate or worko-admin `rejects` the job application
     */
    RAG_FEEDBACK_INGESTION_LAMBDA_NAME: "worko-rag-feedback-ingestion",

    /**
     * WORKO_JOB_APP_OPENSEARCH_OPERATIONS
     *
     * This lambda function is used to perform opensearch operations
     * This is VPC attached lambda which is used to communicate with VPC-attached OpenSearch
     */
    WORKO_JOB_APP_OPENSEARCH_OPERATIONS: `worko-job-app-${process.env.APP_SLS_STAGE}-app-opensearch-operations`,

    /**
     * WORKO_S3_VECTOR_JOB_SEARCH
     * 
     * @description 
     *  1. We are using this lambda to invoke for searching jobs from s3 vector 
     */
    WORKO_S3_VECTOR_JOB_SEARCH: process.env.APP_AWS_S3_VECTOR_JOB_SEARCH_LAMBDA_NAME,

    /**
     * WORKO_S3_VECTOR_JOB_INGESTION
     * 
     * @description
     *  1. We are using this lambda to invoke for managing CRUD operations on jobs from s3 vector 
     */
    WORKO_S3_VECTOR_JOB_INGESTION: process.env.APP_AWS_S3_VECTOR_JOB_CRUD_LAMBDA_NAME,
  },

  MATCHING_SCORE_PROMPT:
    "From above mentioned Resume and Job description, please match on following parameters and provide score(out of 10) and brief explanation for every parameters and also provide overall matching score.\n1. experience in year\n2. Role \n3.  skills(technical, soft and core)\n4. education\n5. industry experience\n6. responsibilities\n7. certifications\nAssistant:",

  /**
   * SOURCE_EMAIL_ADDRESS
   *
   * Possible source email addresses & names would be used as sender while sending emails outside the application.
   *
   * Here you may consider adding additional sources for different use cases and use them in the application.
   */
  SOURCE_EMAIL_ADDRESS: {
    WORKO_DEFAULT: {
      email: "hello@worko.ai",
      fullName: "Worko.ai",
    },
    WORKO_NO_REPLY: {
      email: "no-reply@worko.ai",
      fullName: "Worko.ai",
    },
  },

  /**
   * PROFILE_COMPLETION_PERCENTAGE
   *
   * These are the minimum profile percentages required to complete the profile for respective dashboards.
   *
   * If the profile is not completed with minimum percentage then the user should not be able to access the certain features of the application.
   */
  PROFILE_COMPLETION_PERCENTAGE: {
    CAND: 80,
    EMP: 80,
  },

  /**
   * BULK_JOB_UPDATE_LIMIT
   */
  BULK_JOB_UPDATE_LIMIT: {
    MIN: 1,
    MAX: 10,
  },

  /**
   * BULK_JOB_APPLICATION_LIMIT
   */
  BULK_JOB_APPLICATION_UPDATE_LIMIT: {
    MIN: 1,
    MAX: 25,
  },

  /**
   * BULK_REQUEST_EVALUATION_CREATE_LIMIT
   */
  BULK_REQUEST_EVALUATION_CREATE_LIMIT: {
    MIN: 1,
    MAX: 30,
  },

  /**
   * REFER_AND_EARN_COMMISION_AMOUNT
   *
   * These are the refer and earn commission amounts for different user types.
   * Whenever a user refers another user, the referer will receive a commission if
   * the referred user joins the company which was referred by the referer.
   */
  REFER_AND_EARN_COMMISION_AMOUNT: {
    DEFAULT: 5000, // INR
    CANDIDATE: 5000, // INR
    EMPLOYEE: 5000, // INR
  },

  /**
   * CURRENCY_FORMAT_CONFIG
   */
  CURRENCY_FORMAT_CONFIG: {
    INR: {
      locale: "en-IN",
      symbol: "₹",
      currency: "INR",
      displayName: "Indian Rupee",
    },
    USD: {
      locale: "en-US",
      symbol: "$",
      currency: "USD",
      displayName: "US Dollar",
    },
    EUR: {
      locale: "de-DE",
      symbol: "€",
      currency: "EUR",
      displayName: "Euro",
    },
    // Add more currencies as needed
  },

  /**
   * FRONTEND_URLS
   */
  FRONTEND_URLS: {
    WORKO_APP_URL: process.env.APP_WORKO_FRONTEND_BASE_URL ?? "https://worko.ai", 
    WORKO_INTERNAL_JOB_URL: `${process.env.APP_WORKO_FRONTEND_BASE_URL}/jobs/{companyName}/{jobId}`,

    WORKO_CORPORATE_COMPANY_JOB_APPLICANTS_URL: `${process.env.APP_WORKO_FRONTEND_BASE_URL}/v1/corporate/cApplicants/{jobId}`,

    WORKO_CANDIDATE_JOB_APPLICATION_URL: `${process.env.APP_WORKO_FRONTEND_BASE_URL}/v1/candidate/jobs`,

    WORKO_CORPORATE_LOGIN: `${process.env.APP_WORKO_FRONTEND_BASE_URL}/auth/login`,

    WORKO_GUIDANCE_URL: `${process.env.APP_WORKO_FRONTEND_BASE_URL}/guidance/`,
  },

  /**
   * Returns the URL for the evaluator dashboard based on the environment.
   *
   * @returns {string} The URL for the evaluator dashboard.
   */
  get WORKO_EVALUATOR_DASHBOARD_URL(): string {
    const PROD_URL: string = `${process.env.APP_WORKO_FRONTEND_BASE_URL}/auth/evaluator-dashboard/login?jobApplicationId={jobApplicationId}&evaluationRequestId={evaluationRequestId}`;
    const DEV_URL: string = `${process.env.APP_WORKO_FRONTEND_BASE_URL}/auth/evaluator-dashboard/login?jobApplicationId={jobApplicationId}&evaluationRequestId={evaluationRequestId}`;

    // return the time based on the environment
    return this.APP_SLS_STAGE === this.STAGES.PROD ? PROD_URL : DEV_URL;
  },

  FRONTEND_ORIGINS: {
    PROD: [
      "https://worko.ai",
      "https://agency.worko.ai",
    ],
    DEV: [
      "https://dev-ui.worko.work", 
      "https://agency.worko.work",
      "https://dev.worko.work",    
      "http://localhost:4200",
      "http://localhost:8080",
      "http://localhost:3001", 
      "http://localhost:3002",  
    ],
  },

  /**
   * SERVERLESS_FUNCTION_NAMES
   *
   * @description These are the function names in `serverless.ts` file
   */
  SERVERLESS_FUNCTION_NAMES: {
    APP_SCHEDULER_HANDLER: "app-scheduler-handler",
    APP_SCHEDULER_BRIGHT_DATA_EXTERNAL_JOBS:
      "app-scheduler-bright-data-external-jobs",
  },

  /**
   * AWS_EVENT_BRIDGE_SCHEDULER_ARNS
   */
  AWS_EVENT_BRIDGE_SCHEDULER_ARNS: {
    LAMBDA_ARN: `arn:aws:lambda:${process.env.APP_SLS_REGION}:${process.env.APP_AWS_ACCOUNT_ID}:function:worko-job-app-${process.env.APP_SLS_STAGE}-{serverlessFunctionName}`,
    ROLE_ARN: `arn:aws:iam::${process.env.APP_AWS_ACCOUNT_ID}:role/${process.env.APP_AWS_EVENT_BRIDGE_SCHEDULE_INVOKE_LAMBDA_ROLE}`,
  },

  /**
   * JOB_APPLICATION_READABLE_STATUS
   *
   * This is the readable status of the job application
   * which is used in the email body to be sent to the end user
   */
  JOB_APPLICATION_READABLE_STATUS: {
    APPLIED: "Applied",
    REJECTED: "Not Selected",
    ACCEPTED: "Accepted",
    CV_DOWNLOADED: "CV Downloaded",
    UNDER_EVALUATION: "Under Evaluation",
    PROCESSING_INTERVIEW: "Processing Interview",
    INTERVIEW_DONE: "Interview Done",
    HIRED: "Hired",
    JOINED: "Joined",
    ON_HOLD: "On Hold",
    HIRING_IN_PROCESS: "Hiring In Process",
    DOCUMENT_REQUESTED: "Document Requested",
    DOCUMENT_SUBMITTED: "Document Submitted",
    DOCUMENT_VERIFIED: "Document Verified",
    OFFER_SENT: "Offer Sent",
    REVISED_OFFER_SENT: "Revised Offer Sent",
    DOCUMENT_REVISION_REQUESTED: "Document Revision Requested",
    DOCUMENT_REVISION_REQUEST_SUBMITTED: "Document Revision Request Submitted",
    DOCUMENT_ADDITIONAL_REQUESTED: "Document Additional Requested",
    DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED:
      "Document Additional Request Submitted",
    OFFER_ISSUE_RAISED: "Offer Issue Raised",
  },

  /**
   * COGNITO_READABLE_GROUPS
   *
   * This is the readable groups of the cognito user
   * which is used in the email body to be sent to the end user
   */
  COGNITO_READABLE_GROUPS: {
    WORKO_ADMIN: "Admin",
    CORPORATE_ADMIN: "Corporate Admin",
    CORPORATE_RECRUITER: "Corporate Recruiter",
  },

  /**
   * MATCHING_SCORES
   */
  MATCHING_SCORES: {
    /**
     * REFERRAL_MINIMUM_MATCHING_SCORE
     *
     * Required constants for Referral score as matching score
     */
    REFERRAL_MINIMUM_MATCHING_SCORE: 70,

    /**
     * JOB_APPLICATION_MINIMUM_MATCHING_SCORE
     *
     * Whenever a candidate applies a job from mini-job portal, this is the minimum matching score required for
     * the job to be applied.
     */
    JOB_APPLICATION_MINIMUM_MATCHING_SCORE: 70,

    /**
     * CORPORATE_JOB_APPLICATION_MATCHING_SCORE_RANGE
     *
     * If the matching score is between `70`(included) and `89`(included) then list
     * the job applications to the "corporate-admin/recruiter"
     */
    CORPORATE_JOB_APPLICATION_MATCHING_SCORE_RANGE: {
      MIN: 70,
      MAX: 89,
    },

    /**
     * CORPORATE_BULK_JD_RESUME_MINIMUM_MATCHING_SCORE
     *
     * Whenever the corporate admin/recruiter uploads resumes for a particular job description, this is the minimum matching score required for
     * the candidate to be selected.
     */
    CORPORATE_BULK_JD_RESUME_MINIMUM_MATCHING_SCORE: 70,
  },

  /**
   * USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE
   *
   * 1. Whenever a job application is in `Hiring in process` status,
   * "corporate" or "worko-admin" may request few documents like "internship certificate", "btech certificate" etc
   * from "applicant" to be uploaded, and the range should be between specified minimum and maximum.
   *
   * 2. And "Applicant" will upload the documents requested by "corporate" or "worko-admin" and the range should be between specified minimum and maximum.
   */
  USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE: {
    MIN: 1,
    MAX: 15,
  },

  /**
   * EXTERNAL_JOB_CLEANUP_CONFIG
   */
  EXTERNAL_JOB_CLEANUP_CONFIG: {
    FANTASTIC_JOB_DELETE_OLDER_THAN_DAYS: 30,
    BRIGHT_DATA_JOB_DELETE_OLDER_THAN_DAYS: 30,
  },

  /**
   * CONFIRMATION_LABELS
   */
  CONFIRMATION_LABELS: {
    YES: "yes",
    NO: "no",
    TRUE: "true",
    FALSE: "false",
  },

  /**
   * USER_JOB_APPLICATION_UPDATE_AFTER_X_HOURS
   *
   * This is the number of hours after which the job application status will be updated
   * to REJECTED.
   *
   * The time is different in prod and dev environments.
   * In prod, the time is 24 hours.
   * In dev, the time is 1 minute converted to hour.
   */
  get USER_JOB_APPLICATION_UPDATE_AFTER_X_HOURS(): number {
    const PROD_HOURS = 1 * 24; // 24 hours
    const DEV_HOURS = 10 / 60; // 10 minutes converted to hour

    // return the time based on the environment
    return this.APP_SLS_STAGE === this.STAGES.PROD ? PROD_HOURS : DEV_HOURS;
  },

  /**
   * CORPORATE_USER_INVITE_DATE_EXPIRATION
   *
   * This constant defines the duration in days for which a corporate user invite remains valid.
   * The duration is determined based on the current environment:
   * - Production (PROD): 15 days
   * - Development/Testing: 1 day
   *
   * @returns {number} - The expiration duration in days.
   */
  get CORPORATE_USER_INVITE_DATE_EXPIRATION(): number {
    const PROD_DAYS = 15; // 15 days
    const DEV_DAYS = 1; // 1 day

    // return the time based on the environment
    return this.APP_SLS_STAGE === this.STAGES.PROD ? PROD_DAYS : DEV_DAYS;
  },

  /**
   * Cognito Identity Pool Groups
   * * ADMIN
   * * CORPORATE-ADMIN
   * * CORPORATE-RECRUITER
   */
  COGNITO_IDENTITY_POOL_GROUPS: {
    ADMIN: "admin",
    CORPORATE_ADMIN: "corporate-admin",
    CORPORATE_RECRUITER: "corporate-recruiter",
    EVALUATOR: "evaluator",
  },

  // Worko App Domain
  WORKO_APP_DOMAIN: "www.worko.ai.",

  // Guidance Email
  GUIDANCE_EMAIL: "guidance@worko.ai.",

  WORKO_SOCIAL_PROFILE_DETAILS: {
    INSTAGRAM: {
      URL: process.env.APP_WORKO_SOCIAL_PROFILE_INSTAGRAM_URL,
      LOGO_URL: process.env.APP_WORKO_SOCIAL_PROFILE_INSTAGRAM_LOGO_URL,
    },
    LINKEDIN: {
      URL: process.env.APP_WORKO_SOCIAL_PROFILE_LINKEDIN_URL,
      LOGO_URL: process.env.APP_WORKO_SOCIAL_PROFILE_LINKEDIN_LOGO_URL,
    },
  },

  get GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL(): EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
    const { INSTAGRAM, LINKEDIN } = this.WORKO_SOCIAL_PROFILE_DETAILS;
    const { LOGO_URL: instagramLogoUrl, URL: instagramUrl } = INSTAGRAM;
    const { LOGO_URL: linkedInLogoUrl, URL: linkedInUrl } = LINKEDIN;

    const socialProfielForEmails: EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS =
      {
        workoLogoUrl:
          this.WORKO_LOGO_URL ??
          "https://worko.ai/assets/logo-text-Dfe5k43I.webp",
        instagramUrl: instagramUrl ?? "https://instagram.com/worko_ai",
        instagramLogoUrl:
          instagramLogoUrl ??
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png",
        linkedInUrl: linkedInUrl ?? "https://www.linkedin.com/company/worko",
        linkedInLogoUrl:
          linkedInLogoUrl ??
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png",
      };

    return socialProfielForEmails
  },

  WORKO_LOGO_URL: process.env.APP_WORKO_LOGO_URL,
};

export default APP_CONSTANTS;