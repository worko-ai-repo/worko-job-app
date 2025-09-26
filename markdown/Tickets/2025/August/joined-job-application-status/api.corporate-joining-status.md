
1. Whenever `corporate` or `worko-admin` clicks `joined` button, then status will change from `HIRED` to `JOINED`
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```ts
   // Request Payload
   {
      "userType": "ADMIN",
      "userId": "REDACTED",
      "status": "JOINED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "applicantName": "rohith patel appala test",
      /**
         * joiningDate
         *
         * @example "2024-10-11T08:01:52.193Z"
         */
      "joiningDate": "2025-07-11T08:01:52.193Z"
   }
   ```
   ```ts
   // Response 
   
   // ...
   "status": "JOINED",
   "joiningDateDetails": [
      {
         "joiningDate": "2025-07-11T08:01:52.193Z",
         "actionByUserId": "REDACTED",
         "actionByUserType": "ADMIN",
         "actionDate": "2025-08-05T12:48:29.895+00:00"
      }
   ],
   // ...
   ```