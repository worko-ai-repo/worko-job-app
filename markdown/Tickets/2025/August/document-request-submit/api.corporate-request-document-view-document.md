
1. Corporate Document Requests:

   **Scenario A: Initial Document Request**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```json
   // Request Payload
   {
      "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
      "emailId": "rohith.appala+corpadmin@worko.ai",
      "userType": "corporate-admin",
      "status": "DOCUMENT_REQUESTED",
      "requestedDocumentNames": ["Internship Certificate", "Resume"],
      "applicantName": "rohith patel appala test"
   }
   ```
   ```json
   // Response
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "status": "DOCUMENT_REQUESTED",
      "rejectionAwsScheduleId": "01K2M0TWKW9CYXFGW5R3EH5MFG",
      "GSI1SK": "ID#01K2M0RCST1E34FA7XV42J8PGR",
      "GSI3SK": "JOB#APP#ID#01K2M0RCST1E34FA7XV42J8PGR",
      "GSI2SK": "ID#01K2M0RCST1E34FA7XV42J8PGR",
      "requestedDocumentDetails": [
         {
               "requestedDocumentNames": [
                  "internship certificate",
                  "resume"
               ],
               "documentStatus": "DOCUMENT_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T10:16:25.842+00:00"
         }
      ],
      "jobPortal": "worko",
      "SK": "JOB#APP#ID#01K2M0RCST1E34FA7XV42J8PGR",
      "id": "01K2M0RCST1E34FA7XV42J8PGR",
      "rejectionFeedbackBySystem": "[\n  { \"heading\": \"Critical Technical Skills Missing\", \"detail\": \"Candidate lacks required SQL, Python, Ruby on Rails, and Java skills.\" },\n  { \"heading\": \"Collaboration Skills Deficiency\", \"detail\": \"Candidate has no explicit collaboration skills mentioned.\" },\n  { \"heading\": \"Experience Mismatch\", \"detail\": \"Candidate's experience exceeds the required 0-1 year range.\" }\n]",
      "jdMatchErrorCode": 200,
      "displayToCorporate": true,
      "companyName": "NELLSYS",
      "createdAt": "2025-08-14T10:07:08.604Z",
      "emailFeedback": "The candidate demonstrates strong Node.js proficiency, solid backend development experience, and excellent problem-solving and communication skills, making them a promising fit for the role.",
      "jobId": "01K09DV0C84XXBQQ44W0XR0V8J",
      "scoreDetails": "[\n  { \"heading\": \"Strong Node.js Expertise\", \"detail\": \"Candidate demonstrates proficiency in Node.js, a key requirement for the role.\" },\n  { \"heading\": \"Backend Development Experience\", \"detail\": \"Candidate has hands-on experience in backend development, crucial for the position.\" },\n  { \"heading\": \"Problem-Solving Skills\", \"detail\": \"Candidate shows strong problem-solving abilities, essential for backend development.\" },\n  { \"heading\": \"Area of Concern\", \"detail\": \"Candidate lacks experience with SQL, Python, Ruby on Rails, and Java.\" },\n  { \"heading\": \"Area of Concern\", \"detail\": \"Candidate has no experience with collaboration tools or methodologies.\" }\n]",
      "statusTracker": [
         {
               "userType": "CAND",
               "newStatus": "APPLIED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T10:07:08.513+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "CV_DOWNLOADED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T10:10:20.959+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "UNDER_EVALUATION",
               "oldStatus": "CV_DOWNLOADED",
               "actionDate": "2025-08-14T10:10:29.436+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "PROCESSING_INTERVIEW",
               "oldStatus": "UNDER_EVALUATION",
               "actionDate": "2025-08-14T10:10:36.218+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "INTERVIEW_DONE",
               "oldStatus": "PROCESSING_INTERVIEW",
               "actionDate": "2025-08-14T10:10:42.015+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "HIRING_IN_PROCESS",
               "oldStatus": "INTERVIEW_DONE",
               "actionDate": "2025-08-14T10:13:15.187+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_REQUESTED",
               "oldStatus": "HIRING_IN_PROCESS",
               "actionDate": "2025-08-14T10:16:25.842+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         }
      ],
      "matchingScore": 51,
      "GSI2PK": "JOB#APP#",
      "GSI1PK": "COMP#ID#01JWAQF1G96E0SE9XHXSFGHNWW#JOB#APP#",
      "GSI3PK": "JOB#ID#01K09DV0C84XXBQQ44W0XR0V8J",
      "scoreFetchedDate": "2025-08-14T10:08:28.041633",
      "updatedAt": "2025-08-14T10:16:25.845Z",
      "jdMatchErrorDesc": "Score is generated successfully",
      "documentCurrentStatusMap": {
         "internship certificate": "DOCUMENT_REQUESTED",
         "resume": "DOCUMENT_REQUESTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```

   **Scenario B: Additional Document Request**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```json
   // Request Payload
   {
      "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
      "emailId": "rohith.appala+corpadmin@worko.ai",
      "userType": "corporate-admin",
      "status": "DOCUMENT_ADDITIONAL_REQUESTED",
      "requestedDocumentNames": ["Degree Certificate", "Experience Letter"],
      "applicantName": "rohith patel appala test"
   }
   ```
   ```json
   // Response
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "status": "DOCUMENT_ADDITIONAL_REQUESTED",
      "rejectionAwsScheduleId": "01K2M0TWKW9CYXFGW5R3EH5MFG",
      "GSI1SK": "ID#01K2M0RCST1E34FA7XV42J8PGR",
      "GSI3SK": "JOB#APP#ID#01K2M0RCST1E34FA7XV42J8PGR",
      "GSI2SK": "ID#01K2M0RCST1E34FA7XV42J8PGR",
      "requestedDocumentDetails": [
         {
               "requestedDocumentNames": [
                  "internship certificate",
                  "resume"
               ],
               "documentStatus": "DOCUMENT_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T10:16:25.842+00:00"
         },
         {
               "requestedDocumentNames": [
                  "degree certificate",
                  "experience letter"
               ],
               "documentStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T10:27:17.203+00:00"
         }
      ],
      "jobPortal": "worko",
      "SK": "JOB#APP#ID#01K2M0RCST1E34FA7XV42J8PGR",
      "id": "01K2M0RCST1E34FA7XV42J8PGR",
      "rejectionFeedbackBySystem": "[\n  { \"heading\": \"Critical Technical Skills Missing\", \"detail\": \"Candidate lacks required SQL, Python, Ruby on Rails, and Java skills.\" },\n  { \"heading\": \"Collaboration Skills Deficiency\", \"detail\": \"Candidate has no explicit collaboration skills mentioned.\" },\n  { \"heading\": \"Experience Mismatch\", \"detail\": \"Candidate's experience exceeds the required 0-1 year range.\" }\n]",
      "jdMatchErrorCode": 200,
      "displayToCorporate": true,
      "companyName": "NELLSYS",
      "createdAt": "2025-08-14T10:07:08.604Z",
      "emailFeedback": "The candidate demonstrates strong Node.js proficiency, solid backend development experience, and excellent problem-solving and communication skills, making them a promising fit for the role.",
      "jobId": "01K09DV0C84XXBQQ44W0XR0V8J",
      "scoreDetails": "[\n  { \"heading\": \"Strong Node.js Expertise\", \"detail\": \"Candidate demonstrates proficiency in Node.js, a key requirement for the role.\" },\n  { \"heading\": \"Backend Development Experience\", \"detail\": \"Candidate has hands-on experience in backend development, crucial for the position.\" },\n  { \"heading\": \"Problem-Solving Skills\", \"detail\": \"Candidate shows strong problem-solving abilities, essential for backend development.\" },\n  { \"heading\": \"Area of Concern\", \"detail\": \"Candidate lacks experience with SQL, Python, Ruby on Rails, and Java.\" },\n  { \"heading\": \"Area of Concern\", \"detail\": \"Candidate has no experience with collaboration tools or methodologies.\" }\n]",
      "statusTracker": [
         {
               "userType": "CAND",
               "newStatus": "APPLIED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T10:07:08.513+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "CV_DOWNLOADED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T10:10:20.959+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "UNDER_EVALUATION",
               "oldStatus": "CV_DOWNLOADED",
               "actionDate": "2025-08-14T10:10:29.436+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "PROCESSING_INTERVIEW",
               "oldStatus": "UNDER_EVALUATION",
               "actionDate": "2025-08-14T10:10:36.218+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "INTERVIEW_DONE",
               "oldStatus": "PROCESSING_INTERVIEW",
               "actionDate": "2025-08-14T10:10:42.015+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "HIRING_IN_PROCESS",
               "oldStatus": "INTERVIEW_DONE",
               "actionDate": "2025-08-14T10:13:15.187+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_REQUESTED",
               "oldStatus": "HIRING_IN_PROCESS",
               "actionDate": "2025-08-14T10:16:25.842+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_SUBMITTED",
               "oldStatus": "DOCUMENT_REQUESTED",
               "actionDate": "2025-08-14T10:22:09.135+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "oldStatus": "DOCUMENT_SUBMITTED",
               "actionDate": "2025-08-14T10:27:17.203+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         }
      ],
      "matchingScore": 51,
      "GSI2PK": "JOB#APP#",
      "GSI1PK": "COMP#ID#01JWAQF1G96E0SE9XHXSFGHNWW#JOB#APP#",
      "documentCurrentMapping": {
         "resume": "01K2KP3M3N2SDSGSR70GVN34C9.docx",
         "internship certificate": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf"
      },
      "GSI3PK": "JOB#ID#01K09DV0C84XXBQQ44W0XR0V8J",
      "responseDocumentDetails": [
         {
               "documentMapping": [
                  {
                     "documentName": "resume",
                     "cloudFileName": "01K2KP3M3N2SDSGSR70GVN34C9.docx"
                  },
                  {
                     "documentName": "internship certificate",
                     "cloudFileName": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf"
                  }
               ],
               "documentStatus": "DOCUMENT_SUBMITTED",
               "userType": "CAND",
               "userId": "REDACTED",
               "actionDate": "2025-08-14T10:22:09.135+00:00"
         }
      ],
      "scoreFetchedDate": "2025-08-14T10:08:28.041633",
      "updatedAt": "2025-08-14T10:27:17.208Z",
      "jdMatchErrorDesc": "Score is generated successfully",
      "documentCurrentStatusMap": {
         "resume": "DOCUMENT_SUBMITTED",
         "internship certificate": "DOCUMENT_SUBMITTED",
         "experience letter": "DOCUMENT_ADDITIONAL_REQUESTED",
         "degree certificate": "DOCUMENT_ADDITIONAL_REQUESTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```

   **Scenario C: Re-request Specific Documents**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```json
   // Request Payload
   {
     "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
     "emailId": "rohith.appala+corpadmin@worko.ai",
     "userType": "corporate-admin",
     "status": "DOCUMENT_REVISION_REQUESTED",
     "requestedDocumentNames": ["resume"],
     "applicantName": "rohith patel appala test"
   }
   ```
   ```json
   // Response
   {
      // ...
      "status": "DOCUMENT_REVISION_REQUESTED",
      "requestedDocumentDetails": [
         {
               "requestedDocumentNames": [
                  "internship certificate",
                  "resume"
               ],
               "documentStatus": "DOCUMENT_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T06:12:59.888+00:00"
         },
         {
               "requestedDocumentNames": [
                  "degree certificate",
                  "experience letter"
               ],
               "documentStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T07:30:58.551+00:00"
         },
         {
               "requestedDocumentNames": [
                  "resume"
               ],
               "documentStatus": "DOCUMENT_REVISION_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T07:47:29.357+00:00"
         }
      ],
      "SK": "JOB#APP#ID#01K2KJHXT1BE0NCSG22PX3CJCV",
      "id": "01K2KJHXT1BE0NCSG22PX3CJCV",
      "statusTracker": [
         {
               "userType": "CAND",
               "newStatus": "APPLIED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T05:58:56.433+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "CV_DOWNLOADED",
               "oldStatus": "APPLIED",
               "actionDate": "2025-08-14T06:04:46.831+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "UNDER_EVALUATION",
               "oldStatus": "CV_DOWNLOADED",
               "actionDate": "2025-08-14T06:05:02.570+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "PROCESSING_INTERVIEW",
               "oldStatus": "UNDER_EVALUATION",
               "actionDate": "2025-08-14T06:05:19.652+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "INTERVIEW_DONE",
               "oldStatus": "PROCESSING_INTERVIEW",
               "actionDate": "2025-08-14T06:05:29.530+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "HIRING_IN_PROCESS",
               "oldStatus": "INTERVIEW_DONE",
               "actionDate": "2025-08-14T06:11:26.532+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_REQUESTED",
               "oldStatus": "HIRING_IN_PROCESS",
               "actionDate": "2025-08-14T06:12:59.888+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_SUBMITTED",
               "oldStatus": "DOCUMENT_REQUESTED",
               "actionDate": "2025-08-14T07:18:01.503+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "oldStatus": "DOCUMENT_SUBMITTED",
               "actionDate": "2025-08-14T07:30:58.551+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "oldStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "actionDate": "2025-08-14T07:43:12.609+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_REVISION_REQUESTED",
               "oldStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "actionDate": "2025-08-14T07:47:29.357+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         }
      ],
      "responseDocumentDetails": [
         {
               "documentMapping": [
                  {
                     "documentName": "resume",
                     "cloudFileName": "01K2KP3M3N2SDSGSR70GVN34C9.docx"
                  },
                  {
                     "documentName": "internship certificate",
                     "cloudFileName": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf"
                  }
               ],
               "documentStatus": "DOCUMENT_SUBMITTED",
               "userType": "CAND",
               "userId": "REDACTED",
               "actionDate": "2025-08-14T07:18:01.503+00:00"
         },
         {
               "documentMapping": [
                  {
                     "documentName": "degree certificate",
                     "cloudFileName": "01K2KRC3KS6674DJKBMG0YTMJ8.pdf"
                  },
                  {
                     "documentName": "experience letter",
                     "cloudFileName": "01K2KRFM8T72SP08RH1T9CAB9Q.pdf"
                  }
               ],
               "documentStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "userType": "CAND",
               "userId": "REDACTED",
               "actionDate": "2025-08-14T07:43:12.609+00:00"
         }
      ],
      "documentCurrentStatusMap": {
         "resume": "DOCUMENT_REVISION_REQUESTED",
         "internship certificate": "DOCUMENT_SUBMITTED",
         "experience letter": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
         "degree certificate": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```

2. Generate Pre-Signed URLs To View Documents:
   [POST] `https://jobs.dev.worko.work/file/gsu2v/USER_JOB_APPL_DOC`
   ```json
   // Payload
   {
      "jobApplicationId": "01K2KJHXT1BE0NCSG22PX3CJCV",
      "userId": "REDACTED",
      "cloudFileNames": ["01K2KP3M2JREDFT9JTVV0STD9Q.pdf", "01K2KRZJMRG12V56R9PXGEPNTA.pdf"]
   }
   ```
   ```json
   // Response
   [
      {
         "objectUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/REDACTED/job-applications/01K2KJHXT1BE0NCSG22PX3CJCV/documents/01K2KP3M2JREDFT9JTVV0STD9Q.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250814%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250814T080315Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiBL1aZNVEq7CMtD%2BVfHq%2BK%2BeX3FXP6oaWXCNSg6HD%2BdTwIhAL2QvoZGN9REefmIGHa5q8gCgy5eEfh18oZzQtKmHq%2BqKpADCEEQABoMMjExMTI1MzUzODk5IgziIkXMpeXP4LCduV4q7QKvETKLCaqNCTZKlMyOULbcTZ1ftv7d8LcfZXuWOtgJLXhvZg98zKfzWMcjhnh3krqxXYZeC%2FSKgR0243uJNcd5snb%2FRBDy2tcnUmkc0LyxpGTdNl0BAYc%2FW%2BRfnNfPm3f0WI93vAGVZ0mtnV0X%2F1sF0CLGs%2B9QWNAqdDdBJue1ogw6IPLp3rjB6xKf3T2tBXnpvUslKfZp52zQy%2Bug55JsHl9c9Zrd0xEHU%2BiTtswCFwU143kgYngiJ6%2Bvt2DG%2F374ma6pVZhSP11JK3lsU3JHp9AR0HdG0jcBjgOX%2FL%2BrjpGAYccAr0HQz6fs87EVSholikmxxPWz6rPliG3%2F2Byph2H1E3SUTNaVHvLOC4I4ePgkTSIrIGpvJ%2FImD7ke6uZLyg8tIAavRIxWQ3gcmS66nK%2FbdJqYIOUGk0Q317IOEbqgqqZS6TjBNpTjcbCOltYI1qgjPpnN5%2Fg4FT5qfRamfNmELdT2ZGmcdabbEzDKr%2FbEBjqdAeCgMlqfcF9J8dRSJ9h9phuDCsKNHMqH1J%2BLs5J%2FqPjphvBDF0PCXISnl98yZftsGQZm%2BiKqh9FY7Q20kw5zx7JIH3bo9ZEYb1sdv2PQDaqNz1h54tjLR1Gb1I2UqPNOZZi2ljD%2F4FIZyWg9Vfhzdnx7%2BeZl6UC%2BVhBcnsJfTzr%2BFeGu2tHuK%2Fi%2FsZCCIlKFWDCgpny%2BEhC4OBKBJ3c%3D&X-Amz-Signature=4da5351201cd153dafd3a12ff08b23b5f83a9719996889f3fe193f837f2da977&X-Amz-SignedHeaders=host"
      },
      {
         "objectUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/REDACTED/job-applications/01K2KJHXT1BE0NCSG22PX3CJCV/documents/01K2KRZJMRG12V56R9PXGEPNTA.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250814%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250814T080315Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiBL1aZNVEq7CMtD%2BVfHq%2BK%2BeX3FXP6oaWXCNSg6HD%2BdTwIhAL2QvoZGN9REefmIGHa5q8gCgy5eEfh18oZzQtKmHq%2BqKpADCEEQABoMMjExMTI1MzUzODk5IgziIkXMpeXP4LCduV4q7QKvETKLCaqNCTZKlMyOULbcTZ1ftv7d8LcfZXuWOtgJLXhvZg98zKfzWMcjhnh3krqxXYZeC%2FSKgR0243uJNcd5snb%2FRBDy2tcnUmkc0LyxpGTdNl0BAYc%2FW%2BRfnNfPm3f0WI93vAGVZ0mtnV0X%2F1sF0CLGs%2B9QWNAqdDdBJue1ogw6IPLp3rjB6xKf3T2tBXnpvUslKfZp52zQy%2Bug55JsHl9c9Zrd0xEHU%2BiTtswCFwU143kgYngiJ6%2Bvt2DG%2F374ma6pVZhSP11JK3lsU3JHp9AR0HdG0jcBjgOX%2FL%2BrjpGAYccAr0HQz6fs87EVSholikmxxPWz6rPliG3%2F2Byph2H1E3SUTNaVHvLOC4I4ePgkTSIrIGpvJ%2FImD7ke6uZLyg8tIAavRIxWQ3gcmS66nK%2FbdJqYIOUGk0Q317IOEbqgqqZS6TjBNpTjcbCOltYI1qgjPpnN5%2Fg4FT5qfRamfNmELdT2ZGmcdabbEzDKr%2FbEBjqdAeCgMlqfcF9J8dRSJ9h9phuDCsKNHMqH1J%2BLs5J%2FqPjphvBDF0PCXISnl98yZftsGQZm%2BiKqh9FY7Q20kw5zx7JIH3bo9ZEYb1sdv2PQDaqNz1h54tjLR1Gb1I2UqPNOZZi2ljD%2F4FIZyWg9Vfhzdnx7%2BeZl6UC%2BVhBcnsJfTzr%2BFeGu2tHuK%2Fi%2FsZCCIlKFWDCgpny%2BEhC4OBKBJ3c%3D&X-Amz-Signature=5c69ee539b2969ee73b3f6cdb8374a4572a3de6a0310ef28c9bc4c115aacf363&X-Amz-SignedHeaders=host"
      }
   ]
   ```