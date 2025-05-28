
# Prod checklist
1. delete all the `unapplied` fantastic jobs in `opensearch` before running batch inference
2. create `worko-batch-inference-prod` in aws s3 bucket and create `input` and `output` folders in it.
3. check in `Amazon Bedrock > Model catalog` path whether access granted for `Claude 3 Haiku By: Anthropic`(`anthropic.claude-3-haiku-20240307-v1:0`) 
4. check will below create automatically after deploying
```ts
APP_AWS_BEDROCK_SERVICE_ROLE="worko-batch-inference-role"
```
5. 
   1. create below lambda function in `aws`, update the code and configuration in it.
   2. copy the `lambda role` and paste in the `opensearch dashboard` security list
```sh
worko-job-batch-inference-update-function
```
6. Copy and paste `worko-auth` lambda

# Test cases:
   1. External job view details page
      1. Don't call below apis
         1. 
            Request URL https://jobs.dev.worko.work/job/parsejd
            Request Method POST
         2. 
            Request URL https://jobs.dev.worko.work/job/01JW0HS6E75MWS3Q63SQ8E4VPD
            Request Method PUT
   2. User Jobs listing page
      1. When user don't apply any filter pass below default filters:
         1. jobTitle
         2. YOE
         3. coreSkills
         4. department -> `recommend jeetesh and pankaj to pass this new default filter`
         5. softSkills -> `recommend jeetesh and pankaj to pass this new default filter`
      2. Don't pass default filters when user apply any single filter

# Fields to update `worko-jobs` index in opensearch
   1. typeofEmployment
      ```ts
      typeofEmployment: string; // Example values i: `FULL_TIME`, `PART_TIME`, `INTERNSHIP`
      ```
         1. Must in `Uppercase`
         2. If already present then don't update

   2. department
      ```ts
      department: string; // `hr`, `marketing`, `sales`, `tech` etc..
      ```
      1. Must in `Lowercase`

   3. salaryRange
   ```ts
   salaryRange: {
      min: number,
      max: number
   };
   ```

   4. experienceRange
   ```ts
   experienceRange: {
      min: number,
      max: number
   };
   ```

   5. below all Must in `Lowercase`
   ```ts
   coreSkills: string[];
   softSkills: string[];
   technicalSkills: string[];
   miscellaneousSkills: string[]; // optional
   noticePeriod: number;
   ```

   6. 
      ```ts
      companyName: string;
      ```
      1. If already present then don't update
      2. Must in `Uppercase`
