
### 1. Global Metrics
```ts
modelName = "GlobalEntityMetrics";
partitionKey = "GLOBAL#";
sortKey = "MET#ENT#{entityType}"; // "CANDIDATE", "EMPLOYEE", "COMPANY_JOB", "REFERRAL", "REFER_AND_EARN"
```

```ts
class DbGlobalEntityMetricsDto extends BaseDbDto {
   entityType!: "CANDIDATE" | "EMPLOYEE" | "JOB" | "REFERRAL" | "REFER_AND_EARN";

   // When entityType is "CANDIDATE"
   candidateJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "EMPLOYEE"
   employeeJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "COMPANY_JOB"
   companyJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "REFERRAL"
   referralCounts?: {
      totalReferee: number;
      awaiting: number;
      accepted: number;
      done: number;
      rejected: number;
   };

   // When entityType is "REFER_AND_EARN"
   referAndEarnJobApplicationCounts?: {
      total: number;
      pending: number;
      applied: number;
      hired: number;
      rejected: number;
   };
}
```

