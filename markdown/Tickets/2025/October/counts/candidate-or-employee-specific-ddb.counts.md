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
      // If the user email has candidate account then these details will be stored
      userJobApplicationCounts?: {
         /**
          * @description Count of total job applications(except `REJECTED` job application status) for by registered
         `candidate email`
          */
         total: number;

         applied: number; // count of "status": "APPLIED"

         underEvaluation: number; // count of "status": "UNDER_EVALUATION"
         hired: number; // count of "status": "HIRED"
         rejected: number; // count of "status": "REJECTED"
      };

      // When entityType is "REFERRAL"
      // If the user email has candidate account then these details will be stored
      candidateReferralCounts?: {
         total: number;
         accepted: number;
         awaiting: number;
         rejected: number;
         done: number;
      };

      // When entityType is "REFERRAL"
      // If the user email has employee account then these details will be stored
      employeeReferralCounts?: {
         total: number;
         accepted: number;
         awaiting: number;
         rejected: number;   
         done: number;  
      }

      // When entityType is "REFER_AND_EARN"
      // If the user email has candidate or employee account then these details will be stored
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

1. Write a script to count and store them in respective counts tables
   1. Against user email for `JOB_APPLICATION` entity type:
      ```ts
      let query: Query<DbUserJobApplicationDto> = UserJobApplicationModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{primaryEmail}": primaryEmail,
          })
        )
        .where("SK")
        .beginsWith("JOB#APP#ID#")
        .where("status")
        .eq(status) // "APPLIED" | "REJECTED" | "HIRED" | "UNDER_EVALUATION"
        .count();

      const result: {
        count: number;
      } = await query.exec();
      ```
   2. Against user email for `REFER_AND_EARN` entity type:
   ```ts
      let query: Query<DbReferAndEarnDto> = UserJobApplicationModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{primaryEmail}": primaryEmail, // "primaryEmail" is the `referrerEmail`
          })
        )
        .where("SK")
        .beginsWith("REF#EARN#ID#")
        .where("status")
        .eq(status) // "APPLIED" | "REJECTED" | "HIRED" | "PENDING"
        .count();

      const result: {
        count: number;
      } = await query.exec();
   ```
   3. Against `candidate email` for `REFERRAL` entity type:
   ```ts
      let query: Query<DbUserReferralDto> = UserJobApplicationModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{primaryEmail}": primaryEmail, // "primaryEmail" is the `referrerEmail`
          })
        )
        .where("SK")
        .beginsWith("REF#ID#")
        .where("status")
        .eq(status) // "AWAITING" | "ACCEPTED" | "DONE" | "REJECTED"
        .count();

      const result: {
        count: number;
      } = await query.exec();
   ```
