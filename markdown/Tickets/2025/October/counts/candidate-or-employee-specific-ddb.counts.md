1. `Candidate` or `Employee` specific metrics
   ```ts
   modelName = "UserEntityMetrics"; // entity metrics against `candidate` or `employee`
   partitianKey = "USR#EML#{primaryEmail}";
   sortKey = "MET#ENT#{entityType}" // "{entityType}" is one of "JOB_APPLICATION", "REFERRAL", "REFER_AND_EARN"
   GSI1PK = "USR#MET#"; 
   GSI1SK = "ENT#{entityType}";
   ```
   ```ts
   class DbUserEntityMetricsDto extends BaseDbDto {
      entityType!: "JOB_APPLICATION" | "REFERRAL" | "REFER_AND_EARN";

      /**
       * @reference `id` attribute of `UserDetail.model.ts`
       */
      userId!: string;

      email!: string;

      // When entityType is "JOB_APPLICATION"
      userJobApplicationCounts?: {
         /**
          * @description Count of total job applications(except `REJECTED` job application status) for by registered
         `candidate email`
          */
         total: number;

         applied: number;
         underEvaluation: number;
         hired: number;
         rejected: number;
      };

      // When entityType is "REFERRAL"
      referralCounts?: {
         total: number;
         accepted: number;
         awaiting: number;
         rejected: number;
      };

      // When entityType is "REFER_AND_EARN"
      referAndEarnJobApplicationCounts?: {
         total: number;

         /**
          * @description count of `ReferAndEarnJobApplicationStatusEnum.PENDING`
          */
         pending: number;

         applied: number;
         hired: number;
         rejected: number;
      };
   }
   ```
