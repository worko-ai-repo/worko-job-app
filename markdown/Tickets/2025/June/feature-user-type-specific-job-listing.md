# Prod checklist:
1. Update created owner user id for the jobs that doesn't have both `createdByUserId` and `createdByCorporateUserId` 

# Listing Jobs on different dashboards:
1. List all company jobs:
   1. For `candidate`:
      1. All different jobs for different companies:
         1. Include `corporate-admin` created jobs
         2. Include `corporate-recruiter` created jobs
         3. Include `worko-admin` created jobs
         4. Include `fantastic` jobs
   2. For `worko-admin`:
      1. All different jobs for different companies:
         1. Include `corporate-admin` created jobs
         2. Include `corporate-recruiter` created jobs
         3. Include `worko-admin` created jobs
   3. For `corporate-admin`:
      1. Only jobs from his `Company`:
         1. Include `corporate-admin` created jobs
         2. Include `corporate-recruiter` created jobs
   4. For `corporate-recruiter`:
      1. Only jobs from his `Company`:
         1. Include `corporate-recruiter` created jobs

# Example Scenario
1. `Rapido` company 
   1. `corporate admins`:
      1. `Jeetesh`: Total shown is `25` = `10` + `5` + `4` + `6`
         1. created `10` jobs
      2. `Sarvesh`: Total shown is `25` = `10` + `5` + `4` + `6`
         1. created `5` jobs
   2. `corporate-recruiters`:
      1. `Rohith`: Total shown is `4` -> His own jobs
         1. created `4` jobs
      2. `Pankaj`: Total shown is `6` -> His own jobs
         1. created `6` jobs


# Opensearch queries:
   1. For `corporate-recruiter`:
   ```json
   {
      "query": {
         "bool": {
            "must": [
               {
                  "exists": {
                     "field": "companyId"
                  }
               },
               {
                  "term": {
                     "createdByCorporateUserId.keyword": "11GE6XMW1HE05BB63SWD0Z5FNC"
                  }
               },
               {
                  "term": {
                     "companyId.keyword": "01JWAQF1G96E0SE9XHXSFGHNWW"
                  }
               },
               {
                  "term": {
                     "status.keyword": "PUBLISHED"
                  }
               }
            ]
         }
      },
      "size": 25,
      "sort": [
         {
            "createdAt": {
               "order": "desc"
            }
         },
         {
            "_id": {
               "order": "desc"
            }
         }
      ]
   }
   ```

   2. For `corporate-admin`:
   ```json
   {
      "query": {
         "bool": {
            "must": [
               {
                  "exists": {
                     "field": "companyId"
                  }
               },
               {
                  "exists": {
                     "field": "createdByCorporateUserId"
                  }
               },
               {
                  "term": {
                     "companyId.keyword": "01JWAQF1G96E0SE9XHXSFGHNWW"
                  }
               },
               {
                  "term": {
                     "status.keyword": "PUBLISHED"
                  }
               }
            ]
         }
      },
      "size": 25,
      "sort": [
         {
            "createdAt": {
               "order": "desc"
            }
         },
         {
            "_id": {
               "order": "desc"
            }
         }
      ]
   }
   ```


# APIs:
   1. For `corporate-admin`:
      [GET] `https://jobs.dev.worko.work/job/?pageSize=25&status=PUBLISHED&companyId=01JWAQF1G96E0SE9XHXSFGHNWW&sortOrder=desc&dashboard=CORPORATE&userRole=corporate-admin`
   2. For `corporate-recruiter`:
      [GET] `https://jobs.dev.worko.work/job/?companyId=01JWAQF1G96E0SE9XHXSFGHNWW&status=PUBLISHED&pageSize=25&sortOrder=desc&dashboard=CORPORATE&userRole=corporate-recruiter&corporateRecruiterUserId=11GE6XMW1HE05BB63SWD0Z5FNC`

