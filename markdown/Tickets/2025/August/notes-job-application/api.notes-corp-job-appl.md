

1. Create note against job application by `corporate-admin`
   [POST] `https://jobs.dev.worko.work/job-application-author-note/`
   ```json
   // Request body
   {
      "jobApplicationId":"01K50ZMR6FE028RDNBJB802058",
      "authorCognitoUserGroup":"ADMIN",
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description"
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "jobApplicationId": "01K50ZMR6FE028RDNBJB802058",
      "authorCognitoUserGroup": "ADMIN",
      "noteDetails": [
         {
               "title": "note one",
               "detailedDescription": "note one detailed description",
               "createdAt": "2025-09-15T08:53:07.351+00:00"
         }
      ],
      "authorId": "REDACTED",
      "createdByUserId": "REDACTED",
      "id": "01K5697VPH7T60GFPH2AP304KD",
      "PK": "JOB#APP#ID#01K50ZMR6FE028RDNBJB802058",
      "SK": "NOTE#AUTHOR#REDACTED#ID#01K5697VPH7T60GFPH2AP304KD",
      "createdAt": 1757926387412,
      "updatedAt": 1757926387412
   }
   ```

2. Create note against job application by `corporate-recruiter`
   [POST] `https://jobs.dev.worko.work/job-application-author-note/`
   ```json
   // Request body
   {
      "jobApplicationId": "string",
      "authorCognitoUserGroup":"corporate-recruiter",
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "id": ".....",
      "PK": "JOB#APP#ID#{jobApplicationId}",
      "SK": "NOTE#AUTHOR#{authorId}#ID#{noteId}",
      "authorCognitoUserGroup":"corporate-recruiter",
      "createdByCorporateUserId": "string",
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         }
      ]
   }
   ```

3. Create note against job application by `ADMIN`(i.e "worko-admin")
   [POST] `https://jobs.dev.worko.work/job-application-author-note/`
   ```json
   // Request body
   {
      "jobApplicationId": "string",
      "authorCognitoUserGroup":"ADMIN",
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "id": ".....",
      "PK": "JOB#APP#ID#{jobApplicationId}",
      "SK": "NOTE#AUTHOR#{authorId}#ID#{noteId}",
      "authorCognitoUserGroup":"ADMIN",
      "createdByUserId": "string",
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         }
      ]
   }
   ```


4. Update job application note by `corporate-admin` 
   [PATCH] `https://jobs.dev.worko.work/job-application-author-note/:jobApplicationId/:noteId`
   ```json
   // Request body
   {
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         },

         {
            "title": "new note second",
            "detailedDescription": "new note second detailed description",
         },
      ]
   }
   ```
   ```json
   // Response
   ```

5. Update job application note by `corporate-recruiter` 
   [PATCH] `https://jobs.dev.worko.work/job-application-author-note/:jobApplicationId/:noteId`
   ```json
   // Request body
   {
      "noteDetails": [
         {
            "title": "note one",
            "detailedDescription": "note one detailed description",
         },

         {
            "title": "new note second",
            "detailedDescription": "new note second detailed description",
         },
      ]
   }
   ```
   ```json
   // Response
   ```


6. Update job application note by `ADMIN` 
   [PATCH] `https://jobs.dev.worko.work/job-application-author-note/:jobApplicationId/:noteId`
   ```json
   // Request body
   {
      "noteDetails": [
         {
            "title": "note two",
            "detailedDescription": "note two detailed description"
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "createdByUserId": "REDACTED",
      "updatedByUserId": "REDACTED",
      "noteDetails": [
         {
               "title": "note two",
               "detailedDescription": "note two detailed description",
               "updatedAt": "2025-09-15T09:26:52.221+00:00"
         }
      ],
      "updatedAt": "2025-09-15T09:26:52.225Z",
      "authorId": "REDACTED",
      "SK": "NOTE#AUTHOR#REDACTED#ID#01K5697VPH7T60GFPH2AP304KD",
      "createdAt": "2025-09-15T08:53:07.412Z",
      "PK": "JOB#APP#ID#01K50ZMR6FE028RDNBJB802058",
      "authorCognitoUserGroup": "ADMIN",
      "id": "01K5697VPH7T60GFPH2AP304KD",
      "jobApplicationId": "01K50ZMR6FE028RDNBJB802058"
   }
   ```

7. Get job application note by `jobApplicationId` and `noteId`
   [GET] `https://jobs.dev.worko.work/job-application-author-note/:jobApplicationId/:authorId`
   ```json
   // Response
   {
      "PK": "JOB#APP#ID#01K50ZMR6FE028RDNBJB802058",
      "authorCognitoUserGroup": "ADMIN",
      "authorId": "REDACTED",
      "createdAt": "2025-09-15T08:53:07.412Z",
      "createdByUserId": "REDACTED",
      "id": "01K5697VPH7T60GFPH2AP304KD",
      "jobApplicationId": "01K50ZMR6FE028RDNBJB802058",
      "noteDetails": [
         {
               "title": "note 3",
               "detailedDescription": "note 3 detailed description",
               "updatedAt": "2025-09-15T09:38:08.681+00:00"
         }
      ],
      "updatedAt": "2025-09-15T09:38:08.684Z",
      "updatedByUserId": "REDACTED",
      "SK": "NOTE#AUTHOR#REDACTED#ID#01K5697VPH7T60GFPH2AP304KD"
   }
   ```