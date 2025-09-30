# Api Design
1. `Send for evaluation` update job application api
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```ts
   // Request body
   {
      userId: string; // The ID of the corporate user i.e `CorporateUser`
      status: "UNDER_EVALUATION";
      emailId: string; // The email ID of the corporate user i.e `CorporateUser` model
      userType: "corporate-admin" | "corporate-recruiter" | "ADMIN";
      applicantName: string;
   }
   ```
   ```json
   // Request body

   ```

2. `Send for evaluation` create request evaluation api
   [POST] `https://jobs.dev.worko.work/request-evaluation/`
   ```json
   // Request body
   {
      "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
      "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
      "jobTitle": "unreal game developer",
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
      "applicantName": "...",
      "applicantUserEmail": "divy.raushan26@gmail.com",
      "evaluatorDetails": {
         "name": "John Evaluator",
         "email": "rohith.appala@worko.ai"
      },


      // https://api.dev.worko.work/corporate-user/b193ad7a-30a1-70f3-0b3d-fa0fc587cf7f/cognito
      "hrName": "Rohith test nellsys admin",


      "hrCurrentCompanyName": "Nellsys",

      /**
         * 1. `hr` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
         * 2. Whenever the hr sends a job application to the evaluator then feedback will be used.
         */
      "hrDetailedFeedback": "Hi John, please evaluate this candidate for the game developer position.",
      "hrHtmlDetailedFeedback": "<p>Hi John,</p><p>Please evaluate this candidate for the <strong>Game Developer</strong> position.</p>"
   }
   ```
   ```json
   // Response body One
   {
      "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
      "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
      "jobTitle": "unreal game developer",
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
      "applicantUserEmail": "divy.raushan26@gmail.com",
      "applicantName": "...",
      "evaluatorDetails": {
         "name": "john evaluator",
         "email": "rohith.appala@worko.ai"
      },
      "hrName": "rohith test nellsys admin",
      "hrCurrentCompanyName": "NELLSYS",
      "hrDetailedFeedback": "Hi John, please evaluate this candidate for the game developer position.",
      "hrHtmlDetailedFeedback": "<p>Hi John,</p><p>Please evaluate this candidate for the <strong>Game Developer</strong> position.</p>",
      "createdByCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
      "id": "01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "PK": "EVAL#rohith.appala@worko.ai",
      "SK": "REQ#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "GSI1PK": "EVAL#REQ#",
      "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "createdAt": 1751599855714,
      "updatedAt": 1751599855714
   }
   ```
   ```json
   // Response body Two
   {
    "errorCode": 409,
    "errorMsg": "Already sent this job application to the same evaluator with the email address rohith.appala@worko.ai.",
    "timeStamp": "2025-07-03T13:18:47.031Z"
   }
   ```
3. List of `job applications/applicants details` for single `evaluator`
   [GET] `https://jobs.dev.worko.work/request-evaluation/?evaluatorEmail=rohith.appala@worko.ai&pageSize=25&sortOrder=descending`
   ```json
   // Response Body
   {
      "data": [
         {
               "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
               "hrDetailedFeedback": "Hi John, please evaluate this candidate for the game developer position.",
               "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
               "createdAt": "2025-07-04T03:30:55.714Z",
               "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
               "createdByCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "hrCurrentCompanyName": "NELLSYS",
               "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
               "applicantName": "...",
               "applicantUserEmail": "divy.raushan26@gmail.com",
               "GSI1PK": "EVAL#REQ#",
               "updatedAt": "2025-07-04T03:30:55.714Z",
               "evaluatorDetails": {
                  "name": "john evaluator",
                  "email": "rohith.appala@worko.ai"
               },
               "SK": "REQ#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
               "jobTitle": "unreal game developer",
               "id": "01JZ9QSE2Z22966YXPZ0G5KHFZ",
               "PK": "EVAL#rohith.appala@worko.ai",
               "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
               "hrHtmlDetailedFeedback": "<p>Hi John,</p><p>Please evaluate this candidate for the <strong>Game Developer</strong> position.</p>",
               "hrName": "rohith test nellsys admin"
         }
      ],
      "pagination": {
         "count": 1,
         "pageSize": 25,
         "sortOrder": "descending",
         "timesQueried": 1,
         "queriedCount": 0
      }
   }
   ```

4. 
   [GET] `https://jobs.dev.worko.work/request-evaluation/:jobApplicationId/:evaluationRequestId`
   ```json
   // Response body One
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "hrDetailedFeedback": "Hi John, please evaluate this candidate for the game developer position.",
      "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
      "createdAt": "2025-07-04T03:30:55.714Z",
      "createdByCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
      "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "hrCurrentCompanyName": "NELLSYS",
      "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
      "applicantUserEmail": "divy.raushan26@gmail.com",
      "GSI1PK": "EVAL#REQ#",
      "updatedAt": "2025-07-04T03:30:55.714Z",
      "evaluatorDetails": {
         "name": "john evaluator",
         "email": "rohith.appala@worko.ai"
      },
      "SK": "REQ#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "jobTitle": "unreal game developer",
      "id": "01JZ9QSE2Z22966YXPZ0G5KHFZ",
      "PK": "EVAL#rohith.appala@worko.ai",
      "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
      "hrHtmlDetailedFeedback": "<p>Hi John,</p><p>Please evaluate this candidate for the <strong>Game Developer</strong> position.</p>",
      "hrName": "rohith test nellsys admin"
   }
   ```
   ```json
   // Response Body Two
   {
    "errorCode": 404,
    "errorMsg": "No request evaluation found for this job application.",
    "timeStamp": "2025-07-03T13:24:57.367Z"
   }
   ```