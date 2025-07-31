# Requirement
1. Below are the lambda functions I'm using in aws with vpc attached and in those lambda functions im sometimes interacting with `aws opensearch with vpc attached same as lambda vpc details`, and when i interact with `aws cognito`, `aws dynamodb` then it will fail because to interact with no vpc attached services like `aws cognito`, `aws dynamodb`, my lambda should without vpc and i don't want to use `NAT Gateway` because its too costly, I want a flow without using `NAT Gateway`
```sh
# Non-vpc lambdas
worko-job-app-dev-workoJobApp
worko-job-app-dev-app-scheduler-handler
worko-job-app-dev-app-scheduler-bright-data-external-jobs
worko-job-app-dev-app-scheduler-external-jobs

# Vpc lambdas
worko-job-app-dev-app-opensearch-operations

i want to use in this way in serverless.ts and in job.dao.ts at the time of calling the qurery, i will invoke `worko-job-app-dev-app-opensearch-operations` lambda with requestResponse invocation type and in using `aws-opensearch.library.ts` it will interact and give response 
```

2. 
  1. When candidate uses `search bar` in job listing page we should search in below attributes: 
    1. jobTitle
    2. department
    3. workMode
    4. companyName
    5. location
    6. coreSkills
    ```ts
      terms: { "coreSkills.keyword": jobFilterOptions.coreSkills.toLowerCaseArray()},
    ```
    7. softSkills
    ```ts
      terms: { "softSkills.keyword": jobFilterOptions.softSkills.toLowerCaseArray() },
    ```
    8. technicalSkills
    ```ts
      terms: { "technicalSkills.keyword": jobFilterOptions.technicalSkills.toLowerCaseArray() },
    ```
