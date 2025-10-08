1. `Candidate` or `Employee` specific metrics
   ```ts
   modelName = "UserEntityMetrics"; 
   partitianKey = "USR#EML#{primaryEmail}";
   sortKey = "MET#ENT#{entityType}#ID#{id}" // "{entityType}" is one of "JOB_APPLICATION", "REFERRAL", "REFER_AND_EARN"
   GSI1PK = "MET#"; 
   GSI1SK = "ENT#{entityType}#ID#{id}";
   ```
   ```ts
   class DbUserEntityMetricsDto extends BaseDbDto {
      id!: string;
      entityType!: "JOB_APPLICATION" | "REFERRAL" | "REFER_AND_EARN";

      /**
       * @reference `id` attribute of `UserDetail.model.ts`
       */
      userId!: string;

      email!: string;

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

      referralCounts?: {
         total: number;
         accepted: number;
         awaiting: number;
         rejected: number;
      };

      referAndEarnCounts?: {
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
