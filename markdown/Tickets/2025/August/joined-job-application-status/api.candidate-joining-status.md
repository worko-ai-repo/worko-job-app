

1. Update user job application `status` to `JOINED` by `candidate`
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "JOINED",
      "joiningDate": "2025-07-11T08:01:52.193Z",
      "joiningHrName": "Sarvesh",
      "joiningApplicantMessage": "Thanks"
   }
   ```
   ```json
   // ...
   "status": "JOINED",
   "joiningDateDetails": [
      {
         "joiningDate": "2025-07-11T08:01:52.193Z",
         "joiningHrName": "Sarvesh",
         "joiningApplicantMessage": "Thanks",
         "actionByUserId": "REDACTED",
         "actionByUserType": "ADMIN",
         "actionDate": "2025-08-05T12:48:29.895+00:00"
      }
   ],
    // ...
   ```