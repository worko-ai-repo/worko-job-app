
1. Generate `Pre Signed Urls To View Documents`
   [POST] `https://jobs.dev.worko.work/file/gsu2v/HR_OFFER_LETTER_SENT`
   ```json
   {
      "jobApplicationId": "01JFA15QMZ4BC7Q53E7N1GZ1RS",
      "userId": "REDACTED",
      "cloudFileName": "01K1QPKXQBKYMHFHD7FX0R361M.docx"
   }
   ```
   ```json
   {
      "objectUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/01332daa-30e1-705d-30fa-24b60011124c/job-applications/01JFA15QMZ4BC7Q53E7N1GZ1RS/documents/01K1QPKXQBKYMHFHD7FX0R361M.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250804%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250804T143242Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA4aCmFwLXNvdXRoLTEiRzBFAiEAtE2ws2JYaXSNOeD3TnnqG41bzRQl%2F4gbRIcHVFC7UAECICVHqGnOYX2DiGbZR%2FKw7m2BH4PmhGTaA8GLGfQLu%2F5%2BKpADCEgQABoMMjExMTI1MzUzODk5IgwLD83R40F8I%2FlZuhAq7QIrHsxSUcF7X03UyTmtuWwzn18NXov5oVqkqiiJjf1yYtn7B1VLXRzso%2BniVIvtPNmpz6YP2SyyLXlRiYFQvVckASaHcPFx4duxZDOb9Kh%2B%2BoGIkEKQ9dz6G6tdpZ%2FWOQLUHikjcI%2Fpf9bY4m4sQuzfJ1hNiMgHs%2BIO6zPWjh%2BVrZHl11NKTmUHSyQiJsJvNmr7HNx%2FBhz6NGSf%2F2fgitaalVgaF%2BDdBV%2FeF4UmExqVazKgQFAcKQ5AL1gA583sche%2F5B%2FrMreDGGOXsMpu8RVcev8mSVYWiZ77CEngiXtLI%2Fk4%2BHq3859QV8iL4v6Xn%2BUQpJMN0Gfb%2B48p7iTyQ3%2FqhxpCYbBWMQ87ESSom4I4QnQY2TsL0QaG028wIjaffFXoA%2FSThcWSTs4mp2d5Yp0PZ0sGz8HsXWHpjc7cIriXGYdBXXrTXPJWkLjFchSY86BnvnfmYwHZAB5bJ50bS%2BTnfl70ed7RFwhJ%2F6EuyTCihsPEBjqdAZjFLvVQVPXcVj853QNUs9GP%2B3lkXHx%2FASGaSfOohNSm3Hi0F1KUnuS7kS1wohMKljiYJFPuTtr6HZNsiNSaUu9pEn5CNReO7eqK2Q924fdZLTAc%2F6nkAtHfJpqHqNwhp8CTAquj5KUMdSqCg%2Fu1Vzy26pKK3XiLn0JIM3woTq3JHXR31llyFcDGkonYt29W5rpMxlIxxe1iydpmyPQ%3D&X-Amz-Signature=4db5b563a13c44809d3db1b336c9d57b115dd8b1d2a614863bfea5fb0326b526&X-Amz-SignedHeaders=host"
   }
   ```

2. Update job application status will be changed from `OFFER_SENT` to `HIRED`  when `Accept` button is clicked
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "HIRED",
   }
   ```
   ```json
   {
      // ...
      "status": "HIRED",
      // ...
   }
   ```

3. If applicant raise issue on offer letter
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/applicant-action`
   ```json
   // Request Payload
   {
      "userId": "REDACTED",
      "emailId": "rohithappala777+candidate3@gmail.com",
      "userType": "CAND",
      "status": "OFFER_ISSUE_RAISED",
      "offerLetterIssueRemarks": "Didn't like to do night shifts, I want morning shift",
      "offerLetterCloudFileName": "4YG23VRYUJVH23RYUV3Q2HJ.pdf"
   }
   ```
   ```json
   {
      // ...
      "status": "OFFER_ISSUE_RAISED",
      "offerLetterIssueRaisedDetails": [
         {
            "userId": "REDACTED",
            "userType": "CAND",
            "actionDate": "...",
            "cloudFileName":"4YG23VRYUJVH23RYUV3Q2HJ.pdf",
            "remarks":"Didn't like to do night shifts, I want morning shift",
         }
      ]
      // ...
   }