
# Requirement Flow:
1. worko-admin will post a job (`createdByUserId?: string;`)
   1. A job application will be listed in both `worko-admin` and `corporate dashboard`
      1. If First In worko-admin dashboard, if he first click on view cv button:
         1. call update job application api to make `CV Downloaded`
            1. you will recieve response and you will show `25 Apr 2025, 12:04 PM [WA]`:
               1. The above same job application in `corporate dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:04 PM [WA]`
                  1. After `10` minutes If `corporate` views cv then in `corporate dashboard` and `admin dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:14 PM`
      2. If First corporate dashboard, if he first click on view cv button:
         1. call update job application api to make `CV Downloaded`
            1. you will recieve response and you will show `25 Apr 2025, 12:04 PM`:
               1. The above same job application in `worko dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:04 PM`
                  1. After `10` minutes If `worko-admin` views cv then in `corporate dashboard` and `admin dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:04 PM` i.e `cv view date` should not change

2. corporate will post a job (`createdByCorporateUserId?: string;`)
   1. A job application will be listed in both `worko-admin` and `corporate dashboard`
      1. If First corporate dashboard, if he first click on view cv button:
         1. call update job application api to make `CV Downloaded`
            1. you will recieve response and you will show `25 Apr 2025, 12:04 PM`:
               1. The above same job application in `worko dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:04 PM`
                  1. After `10` minutes If `worko-admin` views cv then in `corporate dashboard` and `admin dashboard` should be shown like: `status: Cv downloaded`, `CV Viewed Date: 25 Apr 2025, 12:04 PM` i.e `cv view date` should not change
      2. If First In worko-admin dashboard, if he first click on view cv button:
         1. don't call update job application api to make `CV Downloaded`
            1. in both `corporate dashboard` and `worko-admin` dashboard you will show like:- `status: -`, `CV Viewed Date: -`
      3. For `worko-admin` there will be no option to update any job application statuses except `REJECTED`

# Api Details:
   ## Update Job Application Api Details:
   [PATCH] `/job-application/:id/corp-action`
   ```ts
   {
      userId: string; // The ID of the corporate or worko-admin
      status: JobApplicationStatus;
      emailId: string; // The email ID of the corporate or worko-admin
      reason?: string;
      userComment?: string;
      userType: "ADMIN" | "corporate-admin" | "corporate-recruiter";
   }
   ```
   ```ts
   enum JobApplicationStatus {
      APPLIED = "APPLIED",
      REJECTED = "REJECTED",
      CV_DOWNLOADED = "CV_DOWNLOADED",
      UNDER_EVALUATION = "UNDER_EVALUATION",
      PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
      INTERVIEW_DONE = "INTERVIEW_DONE",
      HIRED = "HIRED",
   }
   ```

   ## Get Job By Id Api Details:
   [GET] `/job/:id`
   ```ts
   // If job details present in database then you will get below Response: 
   {
      //...
      createdByUserId?: string;
      createdByCorporateUserId?: string;
      //...
   }
   ```
   ```ts
   // If job details not present in database then you will get below Response i.e empty object: 
   {}
   ```

# High level plan for frontend:
1. An internal job will be listed:
   1. Someone applied for that job:
      1. Job application will be listed in `worko admin dashboard`, `corporate dashboard`, `candidate dashboard` with `APPLIED` status:
         1. At very first time if `worko admin` clicks on the `view cv` button:
            1. Frontend should call get job by Id details api:
               1. Frontend should Check `createdByUserId` or `createdByCorporateUserId` are present or not:
                  1. If `createdByUserId` is present OR If `createdByUserId` and `createdByCorporateUserId` both are not present, then it means `worko-admin` created the job for this particular job application:
                     1. Call the update job application api like below:
                        [PATCH] `/job-application/:id/corp-action`
                        ```ts
                        // Request payload
                        {
                           userId: string; // The ID of the worko-admin
                           status: "CV_DOWNLOADED";
                           emailId: string; // The email ID of the worko-admin
                           userType: "ADMIN";
                        }
                        ```
                        ```json
                        // Sample Response:
                        //......
                        "status": "CV_DOWNLOADED",
                        "statusTracker": [
                           {
                              "userType": "CAND",
                              "newStatus": "APPLIED",
                              "oldStatus": "APPLIED",
                              "actionDate": "2025-04-25T06:33:52.769+00:00",
                              "userId": "e1134dca-6071-70ff-2941-54fcce656f38"
                           },
                           {
                              "oldStatus": "APPLIED",
                              "userType": "ADMIN",
                              "newStatus": "CV_DOWNLOADED",
                              "actionDate": "2025-04-25T00:00:00.000+00:00",
                              "userId": "e1134dca-6071-70ff-2941-54fcce656f38"
                           },
                        ]
                        //.......
                        ```
                        1. After `worko admin` updates the job application status to `CV_DOWNLOADED`, if `corporate-admin` or `corporate-recruiter` click on `view cv` button then the `actionDate` for `"newStatus": "CV_DOWNLOADED",` in `statusTracker` attribute should override with the new date:
                           1. Frontend will call below api from `corporate` dashboard:
                              [PATCH] `/job-application/:id/corp-action`
                              ```ts
                              {
                                 userId: string; // The ID of the `corporate-admin` or `corporate-recruiter`
                                 status: "CV_DOWNLOADED";
                                 emailId: string; // The email ID of the `corporate-admin` or `corporate-recruiter`
                                 userType: "corporate-admin" | "corporate-recruiter";
                              }
                              ```
                              ```json
                              // Sample Response:
                              //......
                              "status": "CV_DOWNLOADED",
                              "statusTracker": [
                                 {
                                    "userType": "CAND",
                                    "newStatus": "APPLIED",
                                    "oldStatus": "APPLIED",
                                    "actionDate": "2025-04-25T06:33:52.769+00:00",
                                    "userId": "e1134dca-6071-70ff-2941-54fcce656f38"
                                 },
                                 {
                                    "oldStatus": "APPLIED",
                                    "newStatus": "CV_DOWNLOADED",
                                    "userType": "corporate-admin or corporate-recruiter user type",
                                    "actionDate": "2025-04-26T00:00:00.000+00:00", // Old Date:- "2025-04-25T00:00:00.000+00:00",
                                    "userId": "`corporate-admin` or `corporate-recruiter` user id" // Old user id: "e1134dca-6071-70ff-2941-54fcce656f38"
                                 },
                              ]
                              //.......
                              ```
                              1. Now again if worko-admin clicks on `view cv` button `frontend` should not call the `update job application api`
                  2. If `createdByCorporateUserId` is present, then:
                     1. `frontend` should not call the `update job application api`
         2. At very first time if `corporate` clicks on the `view cv` button:
            1. Frontend should call get job by Id details api:
               1. Frontend should Check `createdByUserId` or `createdByCorporateUserId` are present or not:
                  1. If `createdByUserId` is present OR If `createdByUserId` and `createdByCorporateUserId` both are not present, then it means `worko-admin` created the job for this particular job application:
                     1. Frontend should call the update job application api like below:
                        [PATCH] `/job-application/:id/corp-action`
                        ```ts
                        // payload
                        {
                           userId: string; // The ID of the corporate-admin or corporate-recruiter
                           status: "CV_DOWNLOADED";
                           emailId: string; // The email ID of the corporate or corporate-recruiter
                           userType: "corporate-admin" | "corporate-recruiter";
                        }
                        ```
                        ```json
                        // Sample Response:
                        //......
                        "status": "CV_DOWNLOADED",
                        "statusTracker": [
                           {
                              "userType": "CAND",
                              "newStatus": "APPLIED",
                              "oldStatus": "APPLIED",
                              "actionDate": "2025-04-25T06:33:52.769+00:00",
                              "userId": "e1134dca-6071-70ff-2941-54fcce656f38"
                           },
                           {
                              "oldStatus": "APPLIED",
                              "userType": "corporate-admin or corporate-recruiter user type",
                              "newStatus": "CV_DOWNLOADED",
                              "actionDate": "2025-04-25T00:00:00.000+00:00",
                              "userId": "string", // The ID of the corporate-admin or corporate-recruiter
                           },
                        ]
                        //.......
                        ```
                        1. If After `corporate-admin` or `corporate-recruiter` updates the job application status to `CV_DOWNLOADED`, if `worko admin` click on `view cv` button then the frontend should not call the `update job application api`
                  2. If `createdByCorporateUserId` is present, then:
                     1. Frontend should call the update job application api like below:
                        [PATCH] `/job-application/:id/corp-action`
                        ```ts
                        // payload
                        {
                           userId: string; // The ID of the corporate-admin or corporate-recruiter
                           status: "CV_DOWNLOADED";
                           emailId: string; // The email ID of the corporate or corporate-recruiter
                           userType: "corporate-admin" | "corporate-recruiter";
                        }
                        ```
                        ```json
                        // Sample Response:
                        //......
                        "status": "CV_DOWNLOADED",
                        "statusTracker": [
                           {
                              "userType": "CAND",
                              "newStatus": "APPLIED",
                              "oldStatus": "APPLIED",
                              "actionDate": "2025-04-25T06:33:52.769+00:00",
                              "userId": "e1134dca-6071-70ff-2941-54fcce656f38"
                           },
                           {
                              "oldStatus": "APPLIED",
                              "userType": "corporate-admin or corporate-recruiter user type",
                              "newStatus": "CV_DOWNLOADED",
                              "actionDate": "2025-04-25T00:00:00.000+00:00",
                              "userId": "string", // The ID of the corporate-admin or corporate-recruiter
                           },
                        ]
                        //.......
                        ```
                        1. If After `corporate-admin` or `corporate-recruiter` updates the job application status to `CV_DOWNLOADED`, if `worko admin` click on `view cv` button then the frontend should not call the `update job application api`
