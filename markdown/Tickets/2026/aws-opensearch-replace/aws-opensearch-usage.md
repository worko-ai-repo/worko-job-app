
```ts
/**
 * @todo 
 *    1. Try using dynamodb for listing "internal" jobs in both "corporate" and "admin" dashboards, 
 *       if this way satisfies all the listing use cases in both dashboards then we can save
 *       creating "composite indexes" in "gcp firestore" database
 */
```

# Dashboards

## Admin
1. Listing Jobs
   1. For Corporate Recruiter
   [GET] `https://jobs.dev.worko.work/job?pageSize=100&sortOrder=desc&dashboard=ADMIN&status=PUBLISHED&includeCountCompanyJobEntityJobApplication=true&includeCompanyDetails=true&searchText=node+dev`
      1. Filters used:
      ```sh
         1. status: `PUBLISHED` | `CLOSED` | `ARCHIVED`  # Used Equals to value
         2. companyId # If "companyId" exists in the document then that document should return
         3. jobTitle: `node dev` # Used Equals to value
      ```
2. Create Job
3. Update Job
4. Bulk update job status(`ARCHIVED`,`PUBLISHED`)

## Corporate
### Jobs Page
1. Listing Jobs
   1. For Corporate Recruiter
   [GET] `https://jobs.dev.worko.work/job?pageSize=100&sortOrder=desc&dashboard=CORPORATE&userRole=corporate-recruiter&status=PUBLISHED&includeCountCompanyJobEntityJobApplication=true&companyId=01JWAQF1G96E0SE9XHXSFGHNWW&searchText=node+dev&corporateRecruiterUserId=21GCPHNR5HE10D0S8YSMZGS63H`
      1. Filters used:
      ```sh
         1. status: `PUBLISHED` | `CLOSED` | `ARCHIVED`  # Used Equals to value
         2. createdByCorporateUserId: `21GCPHNR5HE10D0S8YSMZGS63H` # Used Equals to value 
         3. companyId: `01JWAQF1G96E0SE9XHXSFGHNWW` # Used Equals to value
         4. jobTitle: `node dev` # Used Equals to value
      ```
   2. For Corporate Admin
   [GET] `https://jobs.dev.worko.work/job?pageSize=100&sortOrder=desc&dashboard=CORPORATE&userRole=corporate-admin&status=PUBLISHED&includeCountCompanyJobEntityJobApplication=true&companyId=01HZM7MDK1QZCCV7ZD41VGBAVD&searchText=node+dev`
      1. Filters used:
      ```sh
         1. status: `PUBLISHED` | `CLOSED` | `ARCHIVED`  # Used Equals to value
         2. createdByCorporateUserId # If "createdByCorporateUserId" exists in the document then that document should return
         3. companyId: `01JWAQF1G96E0SE9XHXSFGHNWW` # Used Equals to value
         4. jobTitle: `node dev` # Used Equals to value
      ```
2. Create Job
3. Update Job
4. Bulk update job status(`ARCHIVED`,`PUBLISHED`)

## Candidate
1. Listing Jobs
   1. Check in `getAllJobsByListOfS3VectorJobIds` method of `Job.dao.ts`

# Backend Internal 
1. Batch inference with `Bright data external jobs`
   1. creating `300` jobs in one `aws opensearch db call`
2. Delete expired jobs
   1. getAllOldUnappliedExternalJobs in `Job.dao.ts` without pagination
   2. deleteOldUnappliedExternalJobByIds in `Job.dao.ts` 
