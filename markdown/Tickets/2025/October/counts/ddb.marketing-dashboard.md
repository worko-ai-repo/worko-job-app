
```ts
// Importing necessary packages/modules from npm
import { Item } from "dynamoose/dist/Item";

// Represents the base structure for the database DTO (Data Transfer Object)
class BaseDbDto extends Item {
  "PK": string;
  "SK": string;
  "timestamps": {
    createdAt: string; // Dynamoose will handle this field
    updatedAt: string; // Dynamoose will handle this field
  };
}

// Exports the necessary elements to be used externally
export { BaseDbDto };
```

# Dashboard Metrics 
  1. Company Job Specific metrics
    ```ts
    modelName: string = "CompanyJob";
    partitianKey: string = "COMP#ID#{companyId}#";
    sortKeys: { SK_INIT: string } = { SK_INIT: "JOBS#ID#{id}" };
    GSI1PK: string = "JOBS#";
    GSI1SK = "ID#{id}";
    ```
    ```ts
    modelName = "";
    partitianKey = "COMP#ID#{companyId}#";
    sortKey = "" 
    GSI1PK = ""; 
    GSI1SK = "";
    ```
    ```ts
    class Db-Dto extends BaseDbDto {
    }
    ```

  2. `Candidate` or `Employee` specific metrics
    ```ts
    modelName = "UserEntityMetrics"; 
    partitianKey = "USR#EML#{primaryEmail}";
    sortKey = "MET#ENT#{entityType}" // "{entityType}" is one of "LOGIN", "JOB_APPL", "REFERRAL", "REFER_AND_EARN"
    GSI1PK = "MET#"; 
    GSI1SK = "ENT#{entityType}";
    ```
    ```ts
    class DbUserEntityMetricsDto extends BaseDbDto {
        entityType!: "LOGIN" | "JOB_APPL" | "REFERRAL" | "REFER_AND_EARN";

        /**
        * @reference `id` attribute of `UserDetail.model.ts`
        */
        updatedByUserId?:string;

        applicantDetails!: {
          name: string,
          email: string,

          /**
            * phoneCountryCode
            *
            * @example 91
            */
          phoneCountryCode: number;

          /**
            * phoneNumber
            *
            * @example 9666xxx100
            */
          phoneNumber: number;

          /**
            * store `createdAt` attribute from `UserDetail.model.ts`
            */
          signupDate: string;

          /**
           * "isProfileCompleted" is given as `optional` because still
          * need to figure out how to implement it.
          */
          isProfileCompleted?: {
            CAND?: boolean,
            EMP?: boolean
          }

          isCvUploaded: boolean;

          /**
           * "isProfileCompleted" is given as `optional` because still
          * need to figure out how to implement it.
          */
          lastLoginDate?: string;
        };

        loginFrequency: {
          totalCount: number,
          lastSevenDaysCount: number, //  In `7` day period count of how many times he loggedin.
          lastThirtyDaysCount: number, //  In `30` day period count of how many times he loggedin.
          lastSixtyDaysCount: number, //  In `60` day period count of how many times he loggedin.
        };

        internalJobAppliedFrequency?: {
          totalCount: number,
          lastSevenDaysCount: number,
          lastThirtyDaysCount: number, 
          lastSixtyDaysCount: number,
        };

        externalJobAppliedFrequency?: {
          totalCount: number,
          lastSevenDaysCount: number,
          lastThirtyDaysCount: number, 
          lastSixtyDaysCount: number,
        };

        /*
        count of below:
          CV_DOWNLOADED = "CV_DOWNLOADED",

          UNDER_EVALUATION = "UNDER_EVALUATION",

          PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",

          INTERVIEW_DONE = "INTERVIEW_DONE",
        */
        internalJobInProgressFrequency?: {
          totalCount: number,
        };

        rejectedFrequencyByCorporate?: {
          totalCount: number,
          lastSevenDaysCount: number, 
          lastThirtyDaysCount: number, 
        };

        rejectedFrequencyByWorkoAdmin?: {
          totalCount: number,
          lastSevenDaysCount: number, 
          lastThirtyDaysCount: number, 
        };

        followUpRequestFrequency?: {
          totalCount: number,
        };





        referralRequestFrequency?: {
          totalCount: number,
          lastSevenDaysCount: number, 
          lastThirtyDaysCount: number, 
          lastSixtyDaysCount: number,
        };

        acceptedReferralRequestFrequency?: {
          totalCount: number,
          lastSevenDaysCount: number, 
          lastThirtyDaysCount: number, 
        };

        rejectedReferralRequestFrequency?: {
          totalCount: number,
          lastThirtyDaysCount: number, 
        };

        doneReferralRequestFrequency?: {
          totalCount: number,
          totalCount: number,
        };

        // referral count left
        remainingReferralCountFrequency?: {
          totalCount: number,
          totalCount: number,
        };

        referralPremiumPlanName:? string;





        referredReferAndEarnFrequency: {
          totalCount: number,
        };
        
        // reference: `UserReferAndEarn.model.ts`
        appliedReferAndEarnFrequency?: {
          totalCount: number,
        };

        hiringProcessReferAndEarnFrequency?: {
          totalCount: number,
        };

        rejectedReferAndEarnFrequency?: {
          totalCount: number,
        };

        hiredReferAndEarnFrequency?: {
          totalCount: number,
        };

        appliedByReferrerReferAndEarnFrequency?: {
          totalCount: number,
        };

        referralBonusReferAndEarnFrequency?: {
          totalBonus: number,
        }
    }
    ```

  3. `Corporate-admin/recruiter` specific metrics
