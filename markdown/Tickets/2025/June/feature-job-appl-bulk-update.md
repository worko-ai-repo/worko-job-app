
# Production Checklist
1. `worko-auth`
2. Frontend must do below apis update:
   1. `applicantName` in below apis:
      1. update job application api

# Authorization
1. @authorisedRoles:- ["admin", "corporate-recruiter", "corporate-admin"]
```mjs
{ path: "/job-application/bulk-update", method: HttpMethodsConstants.PATCH },
```

# Api
1. 
   1. Minimum number of job applications need to update is `1`
   2. Maximum number of job applications need to update is `30`
   [PATCH] `https://jobs.dev.worko.work/job-application/bulk-update`
   ```json
   // Request Body
   {
      "bulkJobApplicationUpdate": [
         {
            "userType": "corporate-admin" | "corporate-recruiter" | "ADMIN",
            "emailId": "example2@gmail.com",
            "jobApplicationId": "01JMEFYTZ9FSN8HSPBE9G64ZC0",
            "status": "UNDER_EVALUATION" | "PROCESSING_INTERVIEW" | "INTERVIEW_DONE" | "HIRED",

            "oldStatus": "",

            // "statusTracker" attribute of the `job application`
            "oldStatusTracker": {/*..*/}[],
            "applicantName": "string",
         },
         // ...
      ]
   }
   ```
   ```json
   // Response Body
   {
      "success": {
         "count": 4,
         "primaryIds": [
            "01JW8G25TTPKDW2A8KNFXY6ESD",
            "01JMEFYTZ9FSN8HSPBE9G64ZC0",
            "01JMCBWQ9FGCC8FHK827WJAM3S",
            "01JMCBVYFD0NS0Q88QJJPS9NAS"
         ]
      },
      "failure": {
         "count": 0,
         "primaryIds": []
      }
   }
   ```

2. 
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```json
   // Request body
   {
      // ....

      // New 
      "applicantName": "string"

      // ....
   }
   ```

# High level plan:
   1. `Corporate-recruiter/admin` or `Worko-admin` can only select below in a straight forward manner:
      1. `status`: `UNDER_EVALUATION` | `PROCESSING_INTERVIEW` | `INTERVIEW_DONE` | `HIRED`