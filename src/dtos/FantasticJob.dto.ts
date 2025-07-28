
/**
 * FantasticJobCloudApiDto
 */
export interface FantasticJobCloudApiDto {
  locationFilter?: string; // 'United States', 'London', 'New York', 'India'
  descriptionType?: string; // 'text' or 'html'
  offSet?: number;
  companyNames?: string;
}

/**
 * FantasticJobCloudApiQueryParamDTO
 */
export interface FantasticJobCloudApiQueryParamDTO {
  /**
   * "Data Engineer"
   *
   * Search on the job title. You can search like you search on Google, see the documentation for more info.
   */
  title_filter?: string;

  /**
   * "United States"
   *
   * Filter on location. Please do not search on abbreviations like US, UK, NYC. Instead, search on full names like United States, New
   * York, United Kingdom.
   *
   * You may filter on more than one location in a single API call using the OR parameter. For example: Dubai OR Netherlands OR Belgium
   */
  location_filter?: string;

  /**
   *
   * Filter on the job description. You can search like you
   * search on Google, see the documentation for more info.
   */
  description_filter?: string;

  /**
   *
   * Filter on the job's company name. Only allows for exact
   * matches.
   *
   * You can search on more than one company with a comma
   * delimited list without spaces!. For example:
   * organization_filter:NVIDIA,Walmart
   *
   * Please send us an email at remco@fantastic.jobs to
   * receive a list of all companies in this API
   */
  organization_filter?: string;

  /**
   * 'text'
   *
   * Description Type. Leave empty to return data without job description. Option 1: 'text' Option 2: 'html'
   */
  description_type?: string;

  /**
   *
   * Set to 'true' to include remote jobs only. Set to
   * 'false' to include jobs that are not remote. Leave
   * empty to include both remote and non remote jobs
   */
  remote?: boolean;

  /**
   *
   * Filter on source. You can only select one source per
   * call. Your options are: ashby, bamboohr, breezy
   * eightfold, greenhouse, lever.co, oraclecloud,
   * paylocity, phenompeople, recruitee, smartrecruiters,
   * successfactors, teamtailor, workable, workday, Apple,
   * zoho, pinpoint, paycom, join.com, jobvite, icims,
   * dayforce, jazzhr
   */
  source?: string;

  /**
   *
   * You can limit the API output to less than 100 jobs if
   * needed. 100 is the maximum. Please make sure to change
   * your offset accordingly.
   */
  limit?: string;

  /**
   *
   * Offset allows you to paginate results. For example, if
   * you want to retrieve 300 jobs from our api you can send
   * 3 requests with offset 0, 100, and 200.
   */
  offset?: string;

  /**
   * You can use this filter to return only the most recent
   * jobs, instead of all jobs from the last 7 days. This
   * filter is a greater than filter. For example, if
   * today's date is 2025-01-03 and you wish to only return
   * jobs posted in 2025, you can filter on '2025-01-01'.
   *
   * To include time, use the following syntax:
   * '2025-01-01T14:00:00'
   *
   * Please keep in mind that the jobs posted date/time is
   * UTC and there's a 1 to 2 hour delay before jobs appear
   * on this API.
   */
  date_filter?: string;

  /*
   Advanced Title filter which enables more features like parenthesis, 'AND', and prefix searching.

   Can Not be used in combination with regular title_filter

   Phrares (two words or more) always need to be single quoted or use the operator <->

   Instead of using natural language like 'OR' you need to use operators like:

   & (AND)
   | (OR)
   ! (NOT)
   <-> (FOLLOWED BY)
   ' ' (FOLLOWED BY alternative, does not work with 6. Prefix Wildcard)
   :* (Prefix Wildcard)
   For example:

   (AI | 'Machine Learning' | 'Robotics') & ! Marketing

   Will return all jobs with ai, or machine learning, or robotics in the title except titles with marketing

   Project <-> Manag:*

   Will return jobs like Project Manager or Project Management
   */
  advanced_title_filter?: string;

  /*
   BETA Feature

   We're now extracting useful insights from the job description with AI. Please see the docs for all the included fields. Set to true to include all AI fields

   Please note that we're currently including about 99.5% of all jobs.
   */
  include_ai?: boolean;

  /*
   BETA Feature. Filter on a specific job type as identified by our AI, the options are:

   FULL_TIME/PART_TIME/CONTRACTOR/TEMPORARY/INTERN/VOLUNTEER/PER_DIEM/OTHER

   To filter on more than one job type, please delimit by comma, like such: FULL_TIME, PART_TIME
   */
  ai_employment_type_filter?: string;

  /*
   BETA Feature. Filter on a specific work arrangement identified by our AI, This is a more granular version of the 'remote' filter, which is quite broad.

   the options are:

   On-site (Job is on site only, no working from home available)
   Hybrid (Job is in the office with one or more days remote)
   Remote OK (Job is fully remote, but an office is available)
   Remote Solely (Job is fully remote, and no office is available)
   To filter on more than one job type, please delimit by comma with no space, like such: Hybrid,Remote OK,Remote Solely
   */
  ai_work_arrangement_filter?: string;

  /*
   BETA Feature. Filter on a certain required experience level as identified by our AI, the options are:

   0-2/2-5/5-10/10+

   To filter on more than one job type, please delimit by comma with no space, like such: 0-2,2-5
   */
  ai_experience_level_filter?: string;

  /*
   BETA Feature. Filter on a jobs that include a mention of Visa sponsorship within the job description.
   */
  ai_visa_sponsorship_filter?: boolean;

  /*
  Set to 'true' to only include jobs with a salary, 
  either listed in salary_raw or extracted from the job description with AI
  */
  ai_has_salary?: boolean;

  /*
  BETA Feature. We're now including LinkedIn Company profiles for ~93% of all jobs.
  Accuracy is over 99%, which means that there can be mistakes Please report any mistakes here: https://tally.so/r/nW1j8k
  */
  include_li?: boolean;

  /*
  Filter on the job's company via the slug. You can search on more than one company with a comma delimited list without spaces!. For example: organization_filter:netflix,walmart

  Only allows for exact matches, please check the exact company slug before filtering.

  The slug is the company specific part of the url. For example the slug in the following url is 'walmart': https://www.linkedin.com/company/walmart/

  Please send us a message or email at remco@fantastic.jobs to receive a list of companies
  */
  li_organization_slug_filter?: string;

  /*
  Similar to the slug filter, but it removes companies from the results.
  */
  li_organization_slug_exclusion_filter?: string;

  /*
    Filter on the organization's LinkedIn Industry.

    Please use the exact Industry name. This filter is case sensitive.

    You can filter on more than one industry with a comma-delimited list without spaces. For example: industry_filter=Accounting,Staffing and Recruiting

    If the industry contains a comma, please double-quote.

    You can find a list of industries on our website: https://fantastic.jobs/article/linkedin-industries
   */
  li_industry_filter?: string;

  /*
  Filter on the job's organization LinkedIn specialties, with the same syntax as our job search filters. Please note that not all companies have specialties listed on their company profile
  */
  li_organization_specialties_filter?: string;

  /*
  Filter on the company's description, with the same syntax as our job search filters
   */
  li_organization_description_filter?: string;
}

/**
 * FantasticJobApiResponse
 */
export interface FantasticJobApiResponse {
  id: string; // "1357943872"
  date_posted: string; // "2025-02-01T00:00:00"
  date_created: string; // "2025-02-01T15:33:14.375184"
  title: string; // "Data Engineer III - Scala/Spark - Media Solutions"
  organization: string; // "Expedia Group"
  organization_url: string | null; // "https://agileengine.com/" | null | ""
  date_validthrough: string | null; // "2025-03-02T10:55:00" | null

  /*
  [
      {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "37.4529598",
        "longitude": "-122.1817252"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "United States",
        "addressLocality": "Menlo Park",
        "addressRegion": "California"
      },
      "@type": "Place"
      }
  ]
  */
  locations_raw: object[];

  locations_alt_raw: string[] | null; // ["USA - Illinois - Chicago"] | null
  location_type: string | null; // "TELECOMMUTE" | null

  /*
  [
      { "@type": "Country", "name": "United States of America" }
  ]
  */
  location_requirements_raw: object[] | null;

  /*
  {
      "@type": "MonetaryAmount",
      "currency": "",
      "value": {
            "@type": "QuantitativeValue",
            "minValue": "",
            "maxValue": "",
            "unitText": ""
      }
  }
  */
  salary_raw: object | null;

  employment_type: string[] | null; // ["FULL_TIME"] | null
  url: string; // "https://expedia.wd5.myworkdayjobs.com/private/job/USA---Illinois---Chicago/Data-Engineer-III---Scala-Spark---Media-Solutions_R-93916"
  source_type: string; // "ats"
  source: string; // "workday"
  source_domain: string; // "expedia.wd5.myworkdayjobs.com"
  organization_logo: string | null; // "https://assets.phenompeople.com/CareerConnectResources/prod/SNCOUS/images/job_logo_config-1597759560794.png" | null | ""
  cities_derived: string[] | null; // ["Boston"] | null
  regions_derived: string[] | null; // ["Florida"] | null
  countries_derived: string[]; // ["United States"]
  locations_derived: string[]; // ["Tampa, Florida, United States"]
  timezones_derived: string[]; // ["America/New_York"]
  lats_derived: number[]; // [27.9945]
  lngs_derived: number[]; // [-73.9467]
  remote_derived: boolean; // false | true
  description_text: string | undefined;
  description_html: string | undefined;
}
