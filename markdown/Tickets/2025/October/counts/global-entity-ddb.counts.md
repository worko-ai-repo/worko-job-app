
### 1. Global Metrics
```ts
modelName = "GlobalEntityMetrics";
partitionKey = "GLBL#COUNT";
sortKey = "MET#ENT#{entityType}"; // "CANDIDATE", "EMPLOYEE", "COMPANY_JOB", "REFERRAL", "REFER_AND_EARN"
```

```ts
class DbGlobalEntityMetricsDto extends BaseDbDto {
   entityType!: "CANDIDATE" | "EMPLOYEE" | "COMPANY_JOB" | "REFERRAL" | "REFER_AND_EARN";

   // When entityType is "CANDIDATE"
   // All `job application counts` For all the "candidates" 
   candidateJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "EMPLOYEE"
   // All `job application counts` For all the "employees"
   employeeJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "COMPANY_JOB"
   // All `job application counts` For all the "company jobs"
   companyJobApplicationCounts?: {
      total: number;
      rejected: number;
      processingInterview: number;
      applied: number;
      hired: number;
   };

   // When entityType is "REFERRAL"
   // All `referral counts` for all entire referral entity
   referralCounts?: {
      totalReferee: number;
      awaiting: number;
      accepted: number;
      done: number;
      rejected: number;
   };

   // When entityType is "REFER_AND_EARN"
   // All `refer and earn job application counts` for all `refer and earn` entity
   referAndEarnJobApplicationCounts?: {
      total: number;
      pending: number;
      applied: number;
      hired: number;
      rejected: number;
   };
}
```

