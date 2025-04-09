
1. 
```ts
/**
 * @see https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/active-jobs-db/playground/endpoint_cb22369f-a718-452c-b4f2-32591bf058f8
 */
```


2. 
```ts
/**
 * @see https://fantastic.jobs/api#diy-apis
 * @see https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/active-jobs-db/pricing
 */
```


3. Fantastic Job Basic Api Details
   1. baseUrl: `https://active-jobs-db.p.rapidapi.com`
      1. Get Jobs 7 days
         [GET] `{{baseUrl}}/active-ats-7d?location_filter=India&description_type=text`
      2. Get Jobs 24h:- 
         [GET] `{{baseUrl}}/active-ats-24h?location_filter=India&description_type=text`
         1. The Jobs in this API have been indexed by us during the last 24 hours.
      3. Get Jobs Hourly:- 
         [GET] `{{baseUrl}}/active-ats-1h?location_filter=India&description_type=text`
         1. Includes Jobs discoverd in the last hour.
      4. Get Expired Jobs:- 
         [GET] `{{baseUrl}}/active-ats-expired`
         1. Contains IDs of jobs that were flagged as expired yesterday. Updates once per day at 01:30 UTC
         2. Contains all jobs that have been flagged as expired yesterday. Updates once per day
   2. Version: 
      1. v3 
   3. Query Params:
   ```ts
   interface externalJobApiDto {
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
   }
   ```
   4. Basic Response Typescript's Interface:
   ```ts
   /**
    * Response Structure
    * * Note: 
    *  1. dynamoose model allow to store `undefined` value to store.
    *  2. dynamoose model does not allow `null` value to store.
    */
   interface FantasticJobApiResponse {
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
      description_text: string | undefined
   }
   ```
   5. Example Response:
   ```json
   [
      {
         "id": "1378465259",
         "date_posted": "2025-02-06T10:55:19.608",
         "date_created": "2025-02-06T10:57:05.57514",
         "title": "Territory Manager",
         "organization": "Dr Reddy's Laboratories Limited",
         "organization_url": null,
         "date_validthrough": null,
         "locations_raw": [
            {
            "address": {
               "addressLocality": "Kolkata",
               "addressRegion": "West Bengal",
               "addressCountry": "India"
            }
            }
         ],
         "locations_alt_raw": ["Kolkata, West Bengal, India"],
         "location_type": null,
         "location_requirements_raw": null,
         "salary_raw": null,
         "employment_type": ["Full-time"],
         "url": "https://jobs.smartrecruiters.com/DrReddysLaboratoriesLimited/744000040937685-territory-manager",
         "source_type": "ats",
         "source": "smartrecruiters",
         "source_domain": "jobs.smartrecruiters.com",
         "organization_logo": null,
         "cities_derived": ["Kolkāta"],
         "regions_derived": ["West Bengal"],
         "countries_derived": ["India"],
         "locations_derived": ["Kolkāta, West Bengal, India"],
         "timezones_derived": ["Asia/Kolkata"],
         "lats_derived": [22.5675],
         "lngs_derived": [88.37],
         "remote_derived": false,
         "description_text": "Additional InformationAll your information will be kept confidential according to EEO guidelines."
      },
      {
         "id": "1378430819",
         "date_posted": "2025-02-06T10:43:49.454",
         "date_created": "2025-02-06T10:45:05.679943",
         "title": "Senior Software Engineer - Systems",
         "organization": "Freshworks",
         "organization_url": null,
         "date_validthrough": null,
         "locations_raw": [
            {
            "address": {
               "addressLocality": "Hyderabad",
               "addressCountry": "India"
            }
            }
         ],
         "locations_alt_raw": ["Hyderabad, India"],
         "location_type": null,
         "location_requirements_raw": null,
         "salary_raw": null,
         "employment_type": ["Full-time"],
         "url": "https://jobs.smartrecruiters.com/Freshworks/744000040935765-senior-software-engineer-systems",
         "source_type": "ats",
         "source": "smartrecruiters",
         "source_domain": "jobs.smartrecruiters.com",
         "organization_logo": null,
         "cities_derived": ["Hyderābād"],
         "regions_derived": ["Telangāna"],
         "countries_derived": ["India"],
         "locations_derived": ["Hyderābād, Telangāna, India"],
         "timezones_derived": ["Asia/Kolkata"],
         "lats_derived": [17.385],
         "lngs_derived": [78.4867],
         "remote_derived": false,
         "description_text": "Company DescriptionFreshworks makes it fast and easy for businesses to delight their customers and employees. We do this by taking a fresh approach to building and delivering software that is affordable, quick to implement, and designed for the end user. Headquartered in San Mateo, California, Freshworks has a global team operating from 13 global locations to serve more than 65,000 companies -- from startups to public companies – that rely on Freshworks software-as-a-service to enable a better customer experience (CRM, CX) and employee experience (ITSM). Freshworks’ cloud-based software suite includes Freshdesk (omni-channel customer support), Freshsales (sales automation), Freshmarketer (marketing automation), Freshservice (IT service desk), Freshchat (AI-powered bots), supported by Neo, our underlying platform of shared services.Freshworks is featured in global national press including CNBC, Forbes, Fortune, Bloomberg and has been a BuiltIn Best Place to work in San Francisco and Denver for the last 3 years. Our customer ratings have earned Freshworks products TrustRadius Top Rated Software ratings and G2 Best of Awards for Best Feature Set, Best Value for the Price and Best Relationship.Job DescriptionOur System engineers build the APIs / Services / Features to support these complex scenarios and seamlessly scale and perform for current and future rapid growth we are experiencing. We work in solving some of the problems as common platform/foundation-services engineering where we take on problems across products from building SSO, Containerization, Reliable deployment working in Agile mode. Our engineering takes pride in delivering some inspiring and fresh experiences for our customers and their business/customers. As a Senior Systems Engineer you will design and implement multi-tier (DB, services, and the web) software applications, and document, test, fix and enhance systems when needed. In your agile team, you will closely work with engineers, architects, managers, design, QA and operations teams, and create solutions that meet business requirements. You will spend most of your time developing clean code with limited abstraction. In this role, you will also lead and mentor team members across functions. You will also be implementing and supporting compliance to Freshworks compliance and information security processes.Responsibilities● Design and implement engineering solutions in code● Testing and validation of your code ● Deployment of your system● Review your peers' code● You will be responsible for identifying and resolving problems in your services for eg: by using better algorithms, better frameworks, alternative technologies.● You will be working on high scale systems● Ensure high availability and uptime of your production systems● Identify areas of improvement for your systems and come up with execution plans for the same● Collaborating with other teams in the companyQualifications● 3-6 years of Experience●Hands-on programmer and with expertise in data structures and algorithms.● Strong Linux systems knowledge.● Experience in writing clean, readable, and maintainable code.● Experience in troubleshooting complex distributed systems and finding failure scenarios.● Expertise in Golang and/or Java and understanding of how it impacts performance/reliability of applications.● Experience with large-scale distributed systems and in building large-scale performant systems. Experience in Elasticsearch/Solr is a plus.● Skilled communicator and have a proven record of leading work across disciplines.● Solid understanding of the Software as a Service (SaaS) modelAdditional InformationAt Freshworks, we are creating a global workplace that enables everyone to find their true potential, purpose, and passion irrespective of their background, gender, race, sexual orientation, religion and ethnicity. We are committed to providing equal opportunity for all and believe that diversity in the workplace creates a more vibrant, richer work environment that advances the goals of our employees, communities and the business."
      },
   ]
   ```

4. Basic curl structure:
```sh
curl --request GET \
	--url '{{baseUrl}}/active-ats-24h?location_filter=India&description_type=text' \
	--header 'x-rapidapi-host: active-jobs-db.p.rapidapi.com' \
	--header 'x-rapidapi-key: REDACTED'
```
