
5. Submit feedback
   1. For Schedule interview
      [POST] `https://jobs.dev.worko.work/response-evaluation/`
      ```json
      // Request body
      {
         "createdByUserEmail": "rohith.appala@worko.ai",
         // "evaluationRequesterUserId": "",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9Y00HEWYFH2JQY3KJEANWK",
         "evaluatorName": "john evaluator",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "scheduledInterviewDetails": [
            {
               "timeSlot": "30 mins",
               "availability": 1,
               "date": "2024-12-17", // `yyyy-mm-dd`
               "startTime": "12:30 PM",
               "endTime": "1:00 PM",
               "actionDate": "2024-12-17T11:36:46.753+00:00"
            }
         ],
         "status": "INTERVIEW_SCHEDULED",
         "score": 4,
         "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
         "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
      }
      ```
      ```json
      // Response body
      {
         "PK": "EVAL#rohith.appala@worko.ai",
         "SK": "RESP#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9Y1EBST20EHJ2VA3KJ7GH2",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "createdAt": 1751606409594,
         "createdByUserEmail": "rohith.appala@worko.ai",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9Y00HEWYFH2JQY3KJEANWK",
         "evaluatorName": "john evaluator",
         "GSI1PK": "EVAL#RESP#",
         "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9Y1EBST20EHJ2VA3KJ7GH2",
         "id": "01JZ9Y1EBST20EHJ2VA3KJ7GH2",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "scheduledInterviewDetails": [
         {
            "actionDate": "2024-12-17T11:36:46.753Z",
            "availability": 1,
            "date": "2024-12-17",
            "endTime": "1:00 PM",
            "startTime": "12:30 PM",
            "timeSlot": "30 mins"
         }
         ],
         "status": "INTERVIEW_SCHEDULED",
         "statusTracker": [
         {
            "actionDate": "2025-07-04T05:20:09.593+00:00",
            "comment": "Please prepare a coding test for the next round.",
            "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
            "htmlComment": "<p>Please prepare a <em>coding test</em> for the next round.</p>",
            "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
            "newStatus": "INTERVIEW_SCHEDULED",
            "reason": "Candidate selected for further evaluation.",
            "score": 4
         }
         ],
         "updatedAt": 1751606409594
      }
      ```
   2. For Rejecting
      [POST] `https://jobs.dev.worko.work/response-evaluation/`
      ```json
      // Request body
      {
         "createdByUserEmail": "rohith.appala@worko.ai",
         // "evaluationRequesterUserId": "",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9WY793BA2YM7GTSVTJSDP8",
         "evaluatorName": "john evaluator",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "status": "REJECTED",
         "score": 1,
         "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
         "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
         "reason": "Candidate has fake experience.",
         "comment": "Please don't prepare a coding test for the next round.",
         "htmlComment": "<p>Please don't prepare a <em>coding test</em> for the next round.</p>"
      }
      ```
      ```json
      // Response body
      {
         "PK": "EVAL#rohith.appala@worko.ai",
         "SK": "RESP#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZA039DF4CF45EGFYSG8JV91",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "createdAt": 1751608567215,
         "createdByUserEmail": "rohith.appala@worko.ai",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9WY793BA2YM7GTSVTJSDP8",
         "evaluatorName": "john evaluator",
         "GSI1PK": "EVAL#RESP#",
         "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZA039DF4CF45EGFYSG8JV91",
         "id": "01JZA039DF4CF45EGFYSG8JV91",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "status": "REJECTED",
         "statusTracker": [
         {
            "actionDate": "2025-07-04T05:56:07.214+00:00",
            "comment": "Please don't prepare a coding test for the next round.",
            "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
            "htmlComment": "<p>Please don't prepare a <em>coding test</em> for the next round.</p>",
            "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
            "newStatus": "REJECTED",
            "reason": "Candidate has fake experience.",
            "score": 1
         }
         ],
         "updatedAt": 1751608567215
      }
      ```
   3. For On hold
      [POST] `https://jobs.dev.worko.work/response-evaluation/`
      ```json
      // Request body
      {
         "createdByUserEmail": "rohith.appala@worko.ai",
         // "evaluationRequesterUserId": "",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9WY793BA2YM7GTSVTJSDP8",
         "evaluatorName": "john evaluator",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "status": "ON_HOLD",
         "score": 2,
         "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
         "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
         "reason": "Candidate is suspicious.",
         "comment": "Please don't prepare a coding test for the next round.",
         "htmlComment": "<p>Please don't prepare a <em>coding test</em> for the next round.</p>"
      }
      ```
      ```json
      // Response body
      {
         "PK": "EVAL#rohith.appala@worko.ai",
         "SK": "RESP#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9ZXDCEZCH2Q039YXHHAJAJ",
         "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
         "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
         "createdAt": 1751608374673,
         "createdByUserEmail": "rohith.appala@worko.ai",
         "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
         "evaluationRequestId": "01JZ9WY793BA2YM7GTSVTJSDP8",
         "evaluatorName": "john evaluator",
         "GSI1PK": "EVAL#RESP#",
         "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZ9ZXDCEZCH2Q039YXHHAJAJ",
         "id": "01JZ9ZXDCEZCH2Q039YXHHAJAJ",
         "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
         "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
         "status": "ON_HOLD",
         "statusTracker": [
         {
            "actionDate": "2025-07-04T05:52:54.635+00:00",
            "comment": "Please don't prepare a coding test for the next round.",
            "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
            "htmlComment": "<p>Please don't prepare a <em>coding test</em> for the next round.</p>",
            "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
            "newStatus": "ON_HOLD",
            "reason": "Candidate is suspicious.",
            "score": 2
         }
         ],
         "updatedAt": 1751608374673
      }
      ```

6. `View Evaluation` button is click api
   [GET] `https://jobs.dev.worko.work/response-evaluation/?jobApplicationId=01JZ851T8XBSMHCMH5Z213XETC&pageSize=25&sortOrder=descending`
   ```json
   // Response body
   {
      "data": [
         {
               "evaluationRequesterCorporateUserId": "5HJEPQMC51E3SGPFFT1Z2RFKVZ",
               "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
               "status": "REJECTED",
               "jobId": "01JYZP3SKMZTSRSBVDCEN5W5N5",
               "createdAt": "2025-07-04T05:56:07.215Z",
               "statusTracker": [
                  {
                     "score": 1,
                     "reason": "Candidate has fake experience.",
                     "newStatus": "REJECTED",
                     "htmlComment": "<p>Please don't prepare a <em>coding test</em> for the next round.</p>",
                     "detailedFeedback": "The candidate demonstrated excellent problem-solving skills and a strong understanding of backend development.",
                     "comment": "Please don't prepare a coding test for the next round.",
                     "htmlDetailedFeedback": "<p>The candidate demonstrated <strong>excellent problem-solving skills</strong> and a strong understanding of backend development.</p>",
                     "actionDate": "2025-07-04T05:56:07.214+00:00"
                  }
               ],
               "evaluatorName": "john evaluator",
               "GSI1SK": "JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZA039DF4CF45EGFYSG8JV91",
               "applicantUserId": "e1134dca-6071-70ff-2941-54fcce656f38",
               "GSI1PK": "EVAL#RESP#",
               "updatedAt": "2025-07-04T05:56:07.215Z",
               "SK": "RESP#JOB#APP#01JZ851T8XBSMHCMH5Z213XETC#ID#01JZA039DF4CF45EGFYSG8JV91",
               "createdByUserEmail": "rohith.appala@worko.ai",
               "id": "01JZA039DF4CF45EGFYSG8JV91",
               "PK": "EVAL#rohith.appala@worko.ai",
               "jobApplicationId": "01JZ851T8XBSMHCMH5Z213XETC",
               "evaluationRequestId": "01JZ9WY793BA2YM7GTSVTJSDP8"
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
