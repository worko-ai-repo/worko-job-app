
// Import enums
import { BrightDataJobCountryEnum, BrightDataJobEmploymentTypeEnum, BrightDataJobExperienceLevelEnum, BrightDataJobTimeRangeEnum, BrightDataJobWorkModeEnum } from "../enums/BrightDataJob.enum";

/**
 * BrightDataJobDataCollectionCreateDto
 */
export interface BrightDataJobDataCollectionCreateDto {
  /**
   * Collect jobs in a specific location
   */
  location: string;

  /**
   * Collect jobs from a specific company
   */
  company: string;

  /**
   * Use country code with 2 letters like US
   */
  country: BrightDataJobCountryEnum;

  /**
   * Time range of the job posting
   */
  time_range: BrightDataJobTimeRangeEnum;

  /**
   * Collect new jobs by keyword search like
   * the job title, for example: Product
   * Manager. Utilize quotation marks around
   * specific words or phrases to ensure an
   * exact match.
   */
  keyword?: string;

  /**
   * Collect jobs from specific type like
   * Full-time or Part-time
   */
  job_type?: BrightDataJobEmploymentTypeEnum;

  /**
   * Collect jobs from a specific experience
   * level
   */
  experience_level?: BrightDataJobExperienceLevelEnum;

  /**
   * Specify if you want to collect only
   * "Remote", "On-site" or "Hybrid" jobs
   */
  remote?: BrightDataJobWorkModeEnum;

  /**
   * When set to true, the filter will exclude
   * titles that do not contain the specified
   * keywords
   */
  selective_search?: boolean;

  /**
   * Jobs IDs to exclude
   */
  jobs_to_not_include?: string[];
}

/**
 * BrightDataJobApiResponse
 */
export interface BrightDataJobApiResponse {
  url?: string | null; // "https://www.linkedin.com/jobs/view/fire-life-safety-transportation-practice-lead-at-hdr-4255560124?_l=en"
  job_posting_id?: string | null; // "4255560124"
  title_id?: string | null; // "1576"
  company_id?: string | null; // "164152"
  job_title?: string | null;
  company_name?: string | null;
  company_url?: string | null;
  company_logo?: string | null;
  job_location?: string | null; // Geographic location of the job
  country_code?: string | null;
  job_seniority_level?: string | null; // "Mid-Senior level"
  job_employment_type?: string | null; // "Full-time"
  job_summary?: string | null; // Brief overview of job responsibilities
  job_description_formatted?: string | null;
  job_function?: string | null; // Specific department or function of the job
  job_num_applicants?: number | null;
  application_availability?: boolean | null;
  apply_link?: string | null; // Link or information for job application
  base_salary: {
    currency?: string | null;
    min_amount?: number | null;
    max_amount?: number | null;
    payment_period?: string | null;
  };
  job_base_pay_range?: string | null;
  job_posted_date?: string | null; // "2025-06-24T14:47:32.678Z",
  job_posted_time?: string | null; // "19 hours ago",
  job_poster?: {
    name?: string | null;
    title?: string | null;
    url?: string | null;
  };
  discovery_input?: object | null;
  input?: object | null;
  job_industries?: string | null;
}