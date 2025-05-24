
```sh
feature/rohith-external-&-internal-job-same-format-1
```

# Todo:
   ## Testing:
   1. Test `create job application api`
   2. Refer and friend and apply that job
   3. Test job creation api by not sending `htmlJobDescription` in request payload
   4. Test external job application api

# Prod:
   1. workoJobAppRepositoryBaseUrl: `https://jobs.worko.ai`
   2. workoApiRepositoryBaseUrl: `https://api.worko.ai`

# Dev:
   1. workoJobAppRepositoryBaseUrl: `https://jobs.dev.worko.work`
   2. workoApiRepositoryBaseUrl: `https://api.dev.worko.work`

# List of attributes not given by fantastic job api but mandatory fields for us:
   1. typeofEmployment -> examples: `FULL_TIME`, `PART_TIME`, `INTERNSHIP`
      1. old filter provided by fantastic job:
      ```ts
        /*
         BETA Feature. Filter on a specific job type as identified by our AI, the options are:

         FULL_TIME/PART_TIME/CONTRACTOR/TEMPORARY/INTERN/VOLUNTEER/PER_DIEM/OTHER

         To filter on more than one job type, please delimit by comma, like such: FULL_TIME, PART_TIME
         */
      ai_employment_type_filter?: string;
      ```
   2. salaryRange: {
         min: number;
         max: number;
      }
         1. new filter provided by fantastic job:
         ```ts
           /*
            Set to 'true' to only include jobs with a salary, 
            either listed in salary_raw or extracted from the job description with AI
            */
            ai_has_salary?: boolean;
         ```
          ```ts
         /* 
         NOTE: 
            1. Even though if we use this filter we have a challenge to retrieve from `salary_raw` object
               because there is not defined interface for `salary_raw` attribute
         */
         ```
   3. experienceRange: {
         min: number;
         max: number;
      }
         1. new filter provided by fantastic job:
         ```ts
           /*
            BETA Feature. Filter on a certain required experience level as identified by our AI, the options are:

            0-2/2-5/5-10/10+

            To filter on more than one job type, please delimit by comma with no space, like such: 0-2,2-5
            */
         ai_experience_level_filter?: string;
         ```
   4. coreSkills
   5. jobDescription -> sometimes giving `invalid job description`

# List of attributes not given by fantastic job api and not mandatory fields for us:
   1. softSkills
   2. technicalSkills
   3. department

# List of attributes sometimes given and sometimes not by fantastic job api:
   1. company url
   2. typeofEmployment
   3. companyLogoUrl

# Existing High level Flow:
   1. Creating jobs:
      1. Worko admin or corporate-admin/recruiter creates internal job
      2. Weekly 2 times we will retrieve the jobs from fantastic job api and store it in opensearch
   2. We will list jobs:
      1. Frontend will use basic detail api to check whether `cv extraction` happened or not
         1. If cv extraction is not done yet: 
            1. throw error
         2. If cv extraction is done:
            1. Apply `jobTitle(optional)`, `coreSkills(mandatory)`, `YOE(mandatory)` filters to list jobs
               1. List Internal jobs and external jobs
                  1. After Frontend recieves the response they are using the list of `job Ids` and 
                   will call `User Initial Matching score api with list of job ids as payload`
                     1. Then frontend will recieve the list of `User Initial matching scores` and they will populate it 
                      to every jobs respectively
                        1. User clicks on `view details` button  
                           1. User Clicked `Internal job view details` button
                              1. Frontend calls the `User Initial Matching score api` to populate initial matching score
                                 and Check whether the `status=APPLIED` or not.
                                 1. If `status=APPLIED` then:
                                    1. Button will be shown as `Already Applied`
                                 2. If `status!=APPLIED` then:
                                    1. User can able to apply that job
                           2. User Clicked `External job view details` button
                              1. Frontend calls the `User Initial Matching score api` to populate initial matching score
                                 and Check whether the `status=APPLIED` or not.
                                 1. If `status=APPLIED` then:
                                    1. Button will be shown as `Already Applied`
                                 2. If `status!=APPLIED` then:
                                    1. User can able to apply that job
                              2. Frontend calls `get job by id` api  
                                 1. Checks whether the `coreSkills`, `softSkills`, `salaryRange` ...so..on are present or not,
                                  if any one of them are not presenth then:
                                    1. Frontend will call the `parse job description api`
                                       1. Frontend will grab the `parsed job description details` and update only the
                                          fields which are not present in `external jobs` and even if the 
                                          `fields` got empty array from `parseJd` api then those should not pass 
                                          in payload as `empty array`(check with @ashutosh whether this is implemented or not)

# New High level Flow:
   1. Creating jobs:
      1. Worko admin or corporate-admin/recruiter creates internal job
      2. Weekly 2 times we will retrieve the jobs from fantastic job api:
         1. we will make each retrieved job in `internal jobs` format
   2. We will list jobs:
      1. Frontend will use basic detail api to check whether `cv extraction` happened or not
         1. If cv extraction is not done yet: 
            1. Give a popup to re-upload the `cv` by frontend
         2. If cv extraction is done:
            1. Apply `jobTitle(optional)`, `coreSkills(mandatory)`, `YOE(mandatory)` filters to list jobs
               1. List Internal jobs and external jobs
                  1. After Frontend recieves the response they are using the list of `job Ids` then 
                   frontend should not call `User Initial Matching score api with list of job ids as payload`, `FE` should
                   calculate the `initial` matching score and display it, and those `initial matching scores` should not
                   store in the `opensearch` also:
                     1. Then frontend will populate the list of `User Initial matching scores generated by frontend only`
                      to every jobs respectively:
                        1. User clicks on `view details` button  
                           1. User Clicked `Internal job view details` button
                              1. Frontend should not call the `User Initial Matching score api` to populate initial matching score,
                              instead they should populate the `score` created by them, and right away user lands to `view job details page` frontend should call a new api i.e `get already applied api by "email" and "jobId"`
                                 1. If already applied then:
                                    1. Button will be shown as `Already Applied`
                                 2. If already not applied then:
                                    1. User can able to apply that job
                           2. User Clicked `External job view details` button
                              1. Frontend should not call the `User Initial Matching score api` to populate initial matching score,
                              instead they should populate the `score` created by them, and right away user lands to `view job details page` frontend should call a new api i.e `get already external applied api by "email" and "jobId"`
                                 1. If already applied then:
                                    1. Button will be shown as `Already Applied`
                                 2. If already not applied then:
                                    1. User can able to apply that job
                              2. NOTE: we are not updating below flow because for `old external` jobs below flow will be useful:
                                 1. Frontend calls `get job by id` api  
                                    1. Checks whether the `coreSkills`, `softSkills`, `salaryRange` ...so..on are present or not,
                                    if any one of them are not presenth then:
                                       1. Frontend will call the `parse job description api`
                                          1. Frontend will grab the `parsed job description details` and update only the
                                             fields which are not present in `external jobs` and even if the 
                                             `fields` got empty array from `parseJd` api then those should not pass 
                                             in payload as `empty array`(check with @ashutosh whether this is implemented or not)

# Few Existing Job & Initial Matching score Apis:
   1. In Job listing page for normal user (https://dev-ui.worko.work/jobs?):
      1. Initial matching score api
         Request URL: `{workoJobAppRepositoryBaseUrl}/user-matching-score-job/`
         Request Method: `PUT`
   2. In Job details view page (https://dev-ui.worko.work/jobs/SOPRA_STERIA/01JTR4WWHKBYX3JXYRSQEYF81Y):
      1. Parse job description api
         Request URL: `{workoJobAppRepositoryBaseUrl}/parsejd`
         Request Method: `POST`
      2. Update external job api
         Request URL: `{workoJobAppRepositoryBaseUrl}/job/01JTR4WWHKBYX3JXYRSQEYF81Y`
         Request Method: `PUT`
      3. Initial matching score api
         Request URL: `{workoJobAppRepositoryBaseUrl}/user-matching-score-job/`
         Request Method: `PUT`

# New Apis:
   1. Get external job application by `jobId` and `applicant user email`
      [GET] `{workoJobAppRepositoryBaseUrl}/external-job-application/:jobId/:applicantUserEmail`
   1. Get internal job application by `jobId` and `applicant user email`
      [GET] `{workoJobAppRepositoryBaseUrl}/job-application/:jobId/:applicantUserEmail`

# Bugs
1. sort job listings in OpenSearch in such a way that the latest jobs appear first, with priority given to jobs that contain a companyId.