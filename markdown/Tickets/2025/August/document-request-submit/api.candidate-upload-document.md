
1. Whenever candidate upload each and every document and clicked `Submit` button:
   [POST] `https://jobs.dev.worko.work/file/gsu2u/USER_JOB_APPL_DOC`
   ```json
   // Payload
   {
      "jobApplicationId": "01K2KJHXT1BE0NCSG22PX3CJCV",
      "userId": "REDACTED",
      "fileDetails": [
         {
            "corporateRequestedFileName": "internship certificate",
            "fileName": "InternshipCertificate.pdf",
            "fileMimeType": "application/pdf"
         },
         {
            "corporateRequestedFileName": "resume",
            "fileName": "Resume.docx",
            "fileMimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
         }
      ]
   }
   ```
   ```json
   // Response
   [
      {
         "userFileName": "InternshipCertificate.pdf",
         "cloudFileName": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf",
         "fileMimeType": "application/pdf",
         "fileExtension": "pdf",
         "awsS3SignedUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/REDACTED/job-applications/01K2KJHXT1BE0NCSG22PX3CJCV/documents/01K2KP3M2JREDFT9JTVV0STD9Q.pdf?Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250814%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250814T070102Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiEAhKPoduGL4JaKqok6lQSvSrMtwzdb5abIAa2fLlON2iMCIFqiAG7x5iLaLVJwqH0xzZS%2FxzWqUihvvDBV9X1j0l9xKpADCEAQABoMMjExMTI1MzUzODk5IgzIVmvqqdTBdnZ66zQq7QI2wsRCmn5uapkZTsjI2uwVhZ%2BGvs3%2BvZzoGAfkdAAxGoiGuUHKs3GudhLmgCwjcBMLWlCmenwncrQu%2FPoUMGB2PxmN%2FHjmU5cx3gVpusN55XChwjaoJesjsHnrgTlZ2h5qo2tDgQW9vTAgfO3Swnl41bjxpwO4IbsE2QyxHmPfEjCrGx0%2BuLhGAA4SnjkWigCZuXhI3eUzG8QXGiSxlloY7lmtuK%2FFEziSJuMgixCGQ%2BGYEPyt7lF%2Be1jMmAje4l9m4gAoMkBdtBFLQrsRiUvomDMQLPczeLJNz4VF4N6R3OEO%2BgiudM2qjnV3%2Frn4JRMNsxUAUkA6zgubW%2F2nvh0O5cnBToMm0k3HRdkXTdMUJ%2F26NuQrrWFeNf76jiSDa54s3NtnWMujZlnE6mFW7asop0HeFI3TeGv27DEvAYZt1nMVDFo8vZO6wO8Hx3H6jaINTxJbWkfxinkWZFuwNAabCc7F5YTHU4eUpl8RHjDjj%2FbEBjqdATx%2BTwu9mYbHvZwAQ7gMp5L9TAAOuuR%2FhD3VaSUpZdnXGIYHbEcy2fN9HF8OvuMRCNRvLmTla%2B7rSTTFZ%2BjBsgEfpHvhoLwd6BTV4FXllSeQphwkLOLFYJXYnOPTH0UKOagTseEIQJciN7ZyuEKA7rn6DNQ0zx1oJLjCEgLU1Do7Mk1x47Nu5U83iC83yn6v6Dq%2BHsLeIMTv2coA40w%3D&X-Amz-Signature=b788d68c6d367c0d663ad524aff3d992c928aec4d468974607ce1d5cdca9f16d&X-Amz-SignedHeaders=host",
         "corporateRequestedFileName": "internship certificate"
      },
      {
         "userFileName": "Resume.docx",
         "cloudFileName": "01K2KP3M3N2SDSGSR70GVN34C9.docx",
         "fileMimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
         "fileExtension": "docx",
         "awsS3SignedUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/REDACTED/job-applications/01K2KJHXT1BE0NCSG22PX3CJCV/documents/01K2KP3M3N2SDSGSR70GVN34C9.docx?Content-Type=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250814%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250814T070102Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiEAhKPoduGL4JaKqok6lQSvSrMtwzdb5abIAa2fLlON2iMCIFqiAG7x5iLaLVJwqH0xzZS%2FxzWqUihvvDBV9X1j0l9xKpADCEAQABoMMjExMTI1MzUzODk5IgzIVmvqqdTBdnZ66zQq7QI2wsRCmn5uapkZTsjI2uwVhZ%2BGvs3%2BvZzoGAfkdAAxGoiGuUHKs3GudhLmgCwjcBMLWlCmenwncrQu%2FPoUMGB2PxmN%2FHjmU5cx3gVpusN55XChwjaoJesjsHnrgTlZ2h5qo2tDgQW9vTAgfO3Swnl41bjxpwO4IbsE2QyxHmPfEjCrGx0%2BuLhGAA4SnjkWigCZuXhI3eUzG8QXGiSxlloY7lmtuK%2FFEziSJuMgixCGQ%2BGYEPyt7lF%2Be1jMmAje4l9m4gAoMkBdtBFLQrsRiUvomDMQLPczeLJNz4VF4N6R3OEO%2BgiudM2qjnV3%2Frn4JRMNsxUAUkA6zgubW%2F2nvh0O5cnBToMm0k3HRdkXTdMUJ%2F26NuQrrWFeNf76jiSDa54s3NtnWMujZlnE6mFW7asop0HeFI3TeGv27DEvAYZt1nMVDFo8vZO6wO8Hx3H6jaINTxJbWkfxinkWZFuwNAabCc7F5YTHU4eUpl8RHjDjj%2FbEBjqdATx%2BTwu9mYbHvZwAQ7gMp5L9TAAOuuR%2FhD3VaSUpZdnXGIYHbEcy2fN9HF8OvuMRCNRvLmTla%2B7rSTTFZ%2BjBsgEfpHvhoLwd6BTV4FXllSeQphwkLOLFYJXYnOPTH0UKOagTseEIQJciN7ZyuEKA7rn6DNQ0zx1oJLjCEgLU1Do7Mk1x47Nu5U83iC83yn6v6Dq%2BHsLeIMTv2coA40w%3D&X-Amz-Signature=06a0e9536af4e08f094b8fed881d72833af24e5a4ff2f93c5c8026fe4ad093ab&X-Amz-SignedHeaders=host",
         "corporateRequestedFileName": "resume"
      }
   ]
   ```

2. Upload all the documents to `s3` using `Pre-signed urls`  

3. Update user job application status by candidate:

   **Scenario A: Initial Document Submission**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "DOCUMENT_SUBMITTED",
      "documentMapping": [
         {
         "documentName": "resume",
         "cloudFileName": "01K2KP3M3N2SDSGSR70GVN34C9.docx"
         },
         {
         "documentName": "internship certificate",
         "cloudFileName": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf"
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "status": "DOCUMENT_SUBMITTED",
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
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_SUBMITTED",
               "oldStatus": "DOCUMENT_REQUESTED",
               "actionDate": "2025-08-14T10:22:09.135+00:00",
               "userId": "REDACTED"
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
      "updatedAt": "2025-08-14T10:22:09.142Z",
      "jdMatchErrorDesc": "Score is generated successfully",
      "documentCurrentStatusMap": {
         "resume": "DOCUMENT_SUBMITTED",
         "internship certificate": "DOCUMENT_SUBMITTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```

   **Scenario B: Additional Document Submission**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
      "documentMapping": [
         {
            "documentName": "degree certificate",
            "cloudFileName": "01K2KRC3KS6674DJKBMG0YTMJ8.pdf",
         },
         {
            "documentName": "experience letter",
            "cloudFileName": "01K2KRFM8T72SP08RH1T9CAB9Q.pdf",
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "status": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
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
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "oldStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "actionDate": "2025-08-14T10:29:45.672+00:00",
               "userId": "REDACTED"
         }
      ],
      "matchingScore": 51,
      "GSI2PK": "JOB#APP#",
      "GSI1PK": "COMP#ID#01JWAQF1G96E0SE9XHXSFGHNWW#JOB#APP#",
      "documentCurrentMapping": {
         "resume": "01K2KP3M3N2SDSGSR70GVN34C9.docx",
         "internship certificate": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf",
         "experience letter": "01K2KRFM8T72SP08RH1T9CAB9Q.pdf",
         "degree certificate": "01K2KRC3KS6674DJKBMG0YTMJ8.pdf"
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
               "actionDate": "2025-08-14T10:29:45.672+00:00"
         }
      ],
      "scoreFetchedDate": "2025-08-14T10:08:28.041633",
      "updatedAt": "2025-08-14T10:29:45.704Z",
      "jdMatchErrorDesc": "Score is generated successfully",
      "documentCurrentStatusMap": {
         "resume": "DOCUMENT_SUBMITTED",
         "internship certificate": "DOCUMENT_SUBMITTED",
         "experience letter": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
         "degree certificate": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```

   **Scenario C: Revision Document Submission**
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "DOCUMENT_REVISION_REQUEST_SUBMITTED",
      "documentMapping": [
         {
            "documentName": "resume",
            "cloudFileName": "01K2KRZJMRG12V56R9PXGEPNTA.pdf",
         }
      ]
   }
   ```
   ```json
   // Response
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "status": "DOCUMENT_REVISION_REQUEST_SUBMITTED",
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
         },
         {
               "requestedDocumentNames": [
                  "resume"
               ],
               "documentStatus": "DOCUMENT_REVISION_REQUESTED",
               "userType": "corporate-admin",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "actionDate": "2025-08-14T10:32:24.715+00:00"
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
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "oldStatus": "DOCUMENT_ADDITIONAL_REQUESTED",
               "actionDate": "2025-08-14T10:29:45.672+00:00",
               "userId": "REDACTED"
         },
         {
               "userType": "corporate-admin",
               "newStatus": "DOCUMENT_REVISION_REQUESTED",
               "oldStatus": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
               "actionDate": "2025-08-14T10:32:24.715+00:00",
               "userId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ"
         },
         {
               "userType": "CAND",
               "newStatus": "DOCUMENT_REVISION_REQUEST_SUBMITTED",
               "oldStatus": "DOCUMENT_REVISION_REQUESTED",
               "actionDate": "2025-08-14T10:34:54.683+00:00",
               "userId": "REDACTED"
         }
      ],
      "matchingScore": 51,
      "GSI2PK": "JOB#APP#",
      "GSI1PK": "COMP#ID#01JWAQF1G96E0SE9XHXSFGHNWW#JOB#APP#",
      "documentCurrentMapping": {
         "resume": "01K2KRZJMRG12V56R9PXGEPNTA.pdf",
         "internship certificate": "01K2KP3M2JREDFT9JTVV0STD9Q.pdf",
         "experience letter": "01K2KRFM8T72SP08RH1T9CAB9Q.pdf",
         "degree certificate": "01K2KRC3KS6674DJKBMG0YTMJ8.pdf"
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
               "actionDate": "2025-08-14T10:29:45.672+00:00"
         },
         {
               "documentMapping": [
                  {
                     "documentName": "resume",
                     "cloudFileName": "01K2KRZJMRG12V56R9PXGEPNTA.pdf"
                  }
               ],
               "documentStatus": "DOCUMENT_REVISION_REQUEST_SUBMITTED",
               "userType": "CAND",
               "userId": "REDACTED",
               "actionDate": "2025-08-14T10:34:54.683+00:00"
         }
      ],
      "scoreFetchedDate": "2025-08-14T10:08:28.041633",
      "updatedAt": "2025-08-14T10:34:54.685Z",
      "jdMatchErrorDesc": "Score is generated successfully",
      "documentCurrentStatusMap": {
         "resume": "DOCUMENT_REVISION_REQUEST_SUBMITTED",
         "internship certificate": "DOCUMENT_SUBMITTED",
         "experience letter": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
         "degree certificate": "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED"
      },
      "PK": "USR#EML#rohithappala777+candidate3@gmail.com"
   }
   ```