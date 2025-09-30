
1. Whenever `Verified & approve` button is clicked, then status will change from `DOCUMENT_SUBMITTED` to `DOCUMENT_VERIFIED`
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```ts
   // Request Payload
   {
      userId: string; // The ID of the corporateUser or worko-admin
      status: "DOCUMENT_VERIFIED";

      emailId: string; // The email ID of the corporateUser or worko-admin
      userType: "corporate-admin" | "corporate-recruiter" | "ADMIN";

      applicantName: string;
   }
   ```
   ```ts
   // Response 
   
   // ...
   status: "DOCUMENT_VERIFIED",
   // ...
   ```

2. Offer letter upload to `s3` 
   [POST] `https://jobs.dev.worko.work/file/gsu2u/HR_OFFER_LETTER_SENT`
   ```json
   // Payload
   {
      "jobApplicationId": "01JFA15QMZ4BC7Q53E7N1GZ1RS",
      "userId": "REDACTED",
      "fileName": "offer-letter.pdf",
      "fileMimeType": "application/pdf",
   }
   ```
   ```json
   // Recieves pre-signed urls to upload
   {
      "userFileName": "offer-letter.pdf",
      "cloudFileName": "01K1TR9NRQQY7NMY6KT4JT4JMS.pdf",
      "fileMimeType": "application/pdf",
      "fileExtension": "pdf",
      "awsS3SignedUrl": "https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/REDACTED/job-applications/01JFA15QMZ4BC7Q53E7N1GZ1RS/offer-letters/01K1TR9NRQQY7NMY6KT4JT4JMS.pdf?Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20250804%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250804T143816Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA4aCmFwLXNvdXRoLTEiRzBFAiEAtE2ws2JYaXSNOeD3TnnqG41bzRQl%2F4gbRIcHVFC7UAECICVHqGnOYX2DiGbZR%2FKw7m2BH4PmhGTaA8GLGfQLu%2F5%2BKpADCEgQABoMMjExMTI1MzUzODk5IgwLD83R40F8I%2FlZuhAq7QIrHsxSUcF7X03UyTmtuWwzn18NXov5oVqkqiiJjf1yYtn7B1VLXRzso%2BniVIvtPNmpz6YP2SyyLXlRiYFQvVckASaHcPFx4duxZDOb9Kh%2B%2BoGIkEKQ9dz6G6tdpZ%2FWOQLUHikjcI%2Fpf9bY4m4sQuzfJ1hNiMgHs%2BIO6zPWjh%2BVrZHl11NKTmUHSyQiJsJvNmr7HNx%2FBhz6NGSf%2F2fgitaalVgaF%2BDdBV%2FeF4UmExqVazKgQFAcKQ5AL1gA583sche%2F5B%2FrMreDGGOXsMpu8RVcev8mSVYWiZ77CEngiXtLI%2Fk4%2BHq3859QV8iL4v6Xn%2BUQpJMN0Gfb%2B48p7iTyQ3%2FqhxpCYbBWMQ87ESSom4I4QnQY2TsL0QaG028wIjaffFXoA%2FSThcWSTs4mp2d5Yp0PZ0sGz8HsXWHpjc7cIriXGYdBXXrTXPJWkLjFchSY86BnvnfmYwHZAB5bJ50bS%2BTnfl70ed7RFwhJ%2F6EuyTCihsPEBjqdAZjFLvVQVPXcVj853QNUs9GP%2B3lkXHx%2FASGaSfOohNSm3Hi0F1KUnuS7kS1wohMKljiYJFPuTtr6HZNsiNSaUu9pEn5CNReO7eqK2Q924fdZLTAc%2F6nkAtHfJpqHqNwhp8CTAquj5KUMdSqCg%2Fu1Vzy26pKK3XiLn0JIM3woTq3JHXR31llyFcDGkonYt29W5rpMxlIxxe1iydpmyPQ%3D&X-Amz-Signature=15e57f61be3f7f22aed85794f7e6724e5250a58c1f73257c51726a9d254d8e65&X-Amz-SignedHeaders=host"
   }
   ```

3. Using those `pre-signed urls` upload to s3

4. After successfull upload to `s3` update job application status from `DOCUMENT_VERIFIED` to `OFFER_SENT`
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```ts
   // Request Payload
   {
      userId: string; // The ID of the corporateUser or worko-admin
      status: "OFFER_SENT";
      offerLetterCloudFileName?: string;
      offerLetterRemarks?: string;
      offerLetterJoiningDate: string;

      emailId: string; // The email ID of the corporateUser or worko-admin
      userType: "corporate-admin" | "corporate-recruiter" | "ADMIN";

      applicantName: string;
   }
   ```
   ```ts
   // ...
   "status": "OFFER_SENT",
   "offerLetterDetails": [
      {
         "userType": "ADMIN",
         "userId": "REDACTED",
         "actionDate": "2025-08-04T14:40:40.012+00:00",
         "remarks": "Nothing",
         "cloudFileName": "01K1TR9NRQQY7NMY6KT4JT4JMS.pdf"
      },
   ]
   // ...
   ```

5. Revised offer letter:
   [PATCH] `https://jobs.dev.worko.work/job-application/:id/corp-action`
   ```ts
   // Request Payload
   {
      userId: string; // The ID of the corporateUser or worko-admin
      status: "REVISED_OFFER_SENT";
      offerLetterCloudFileName?: string;
      offerLetterRemarks?: string;
      offerLetterJoiningDate: string;

      emailId: string; // The email ID of the corporateUser or worko-admin
      userType: "corporate-admin" | "corporate-recruiter" | "ADMIN";

      applicantName: string;
   }
   ```
   ```ts
   // ...
   "status": "REVISED_OFFER_SENT",
   "offerLetterDetails": [
      {
         "userType": "ADMIN",
         "userId": "REDACTED",
         "actionDate": "2025-08-04T14:40:40.012+00:00",
         "remarks": "Nothing",
         "cloudFileName": "01K1TR9NRQQY7NMY6KT4JT4JMS.pdf"
      },
      {
         "userType": "ADMIN",
         "userId": "REDACTED",
         "actionDate": "2025-08-08T14:40:40.012+00:00",
         "remarks": "Nothing",
         "cloudFileName": "01K1TR9NRQQY7NMYGIVF86YVH.pdf"
      },
   ]
   // ...
   ```