
# Production checklist
   1. `worko-auth` 

# Requirement
   1. bulkUpdate job status from `corporate dashboard` and `worko-admin` dashboard.

# Api
1. [PATCH] `https://jobs.dev.worko.work/job/bulk-update`
   1. Minimum number of jobs should be selected is `1`
   2. Maximum number of jobs should be selected is `30`
      1. Give message in `frontend` saying you can select `30` maximum number of jobs to update.
   ```json
   // Request Body
   {
      "bulkJobUpdate": [
         {
            "companyId": "01JJVRPHNENTTFFF7M3N6HEQ38",
            "jobId": "01JW8G25TTPKDW2A8KNFXY6ESD",
            "status": "ARCHIVED"
         },
         {
            "companyId": "01JJVRPHNENTTFFF7M3N6HEQ38",
            "jobId": "01JMEFYTZ9FSN8HSPBE9G64ZC0",
            "status": "DRAFT"
         },
         {
            "companyId": "01JJVRPHNENTTFFF7M3N6HEQ38",
            "jobId": "01JMCBWQ9FGCC8FHK827WJAM3S",
            "status": "PUBLISHED"
         },
         {
            "companyId": "01JJVRPHNENTTFFF7M3N6HEQ38",
            "jobId": "01JMCBVYFD0NS0Q88QJJPS9NAS",
            "status": "CLOSED"
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "opensearchBulkJobUpdateMetrics": {
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
      },
      "dynamodbBulkJobUpdateMetrics": {
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
   }
   ```

# Authorization
   1. `corporate-admin/recruiter` and `worko-admin`
   ```mjs
   { path: "/job/bulk-update", method: HttpMethodsConstants.PATCH },
   ```
