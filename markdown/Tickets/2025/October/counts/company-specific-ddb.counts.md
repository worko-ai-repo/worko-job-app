1. `Company` specific metrics
   ```ts
   modelName = "CompanyEntityMetrics"; // entity metrics against `company`
   partitianKey = "COMP#ID#{companyId}";
   sortKey = "MET#ENT#{entityType}" // "{entityType}" is one of "JOB_APPLICATION"
   GSI1PK = "COMP#MET#"; 
   GSI1SK = "ENT#{entityType}";
   ```
   ```ts
   class DbUserEntityMetricsDto extends BaseDbDto {
      entityType!: "JOB_APPLICATION";
      companyId!: string;

      // When entityType is "JOB_APPLICATION"
      allJobApplicationCounts?: {
         total: number;

         applied: number;
         processingInterview: number;
         hired: number;
         rejected: number;
      };
   }
   ```
