
1. `Company Jobs` specific metrics
   ```ts
   modelName = "CompanyJobEntityMetrics"; // entity metrics against `company job`
   partitianKey = "COMP#ID#{companyId}#";
   sortKey = "JOB#{jobId}#MET#ENT#{entityType}" // "{entityType}" is one of "JOB_APPLICATION"
   GSI1PK = "JOB#{jobId}#MET#"; 
   GSI1SK = "ENT#{entityType}";
   ```
   ```ts
   class DbCompanyJobEntityMetricsDto extends BaseDbDto {
      entityType!: "JOB_APPLICATION";

      companyId!: string;

      jobId!: string;

      // When entityType is "JOB_APPLICATION"
      // For all applications against single job
      allJobApplicationCounts?: {
         total: number;
         applied: number;
         processingInterview: number;
         hired: number;
         rejected: number;
      };
   }
   ```
