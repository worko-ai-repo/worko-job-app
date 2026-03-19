
```sh
# Deployed on "Feb 24th at 3:07 PM"
1771925818000
```

# Requirement
1. whenever `internal job` is created, we should match the `job description` to every candidate in database and send email to candidate every week
2. same job should not send to candidate more than `3` times but for candidate we should send atleast `1` matched published job 





# Approach One
   ## High level flow
   1. Example use case
      1. monday-saturday = 10 created
         1. sunday = pull monday-saturday jobs 
            1. for each job we will pull cands from firestore
               1st job: candA-1job, candB-1job
               2nd job: candA-2job, candC-2job
               .
               .
               .
               up to "n"
            2. store `candA`, `candB`, `candC` in `candidateJobAlerts` and if already existed, then dont store them again
            3. retrieve all candidates from `candidateJobAlerts` and let's say we recieved `candA`, `candB`, `candC`
               1. retrieve `candA` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc, lets say: 1st job and 2nd job and `send single email with 3 jobs`
               2. retrieve `candB` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`
               3. retrieve `candC` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`

      2. monday-saturday = 0 created
         1. sunday = pull monday-saturday jobs 
            1. `0` job and don't pull candidates from firestore
            2. so don't need to store any candidates in `candidateJobAlerts`
            3. retrieve all candidates from `candidateJobAlerts` and let's say we recieved `candA`, `candB`, `candC`
               1. retrieve `candA` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc , 1st job and 2nd job and `send single email with 3 jobs`
               2. retrieve `candB` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`
               3. retrieve `candC` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`
   2. Implement `cron` configuration in `serverless.ts`
   3. Whenever `internal job` status is updated, we should update `jobStatus` in `candidateJobRecommendations` also


# Approach Two
   1. job-1 created:
      1. trigger match-job-cands lambda
         1. for job-1 we will pull cands from firestore
            1. store retrieved candidates in `candidateJobAlerts` and if already present then don't store
            2. store `job-1-candA`, `job-1-candB`..up to `job-1-candN`
            `candidateJobRecommendations`

   2. every `sunday` cron will run a lambda and inside that
      1. retrieve all candidates from `candidateJobAlerts` and let's say we recieved `candA`, `candB`, `candC`.. up to n
         1. retrieve `candA` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc , 1st job and 2nd job and `send single email with 3 jobs`
         2. retrieve `candB` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`
         3. retrieve `candC` from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and `send single email with 3 jobs`


```ts
// For `candidateJobRecommendations` collection
interface DbCandidateJobRecommendationDto {
   id: string; // It should be same as the "document ID" of the firestore document.
   createdAt: string;
   updatedAt: string;
   candidateEmail: string;
   companyId: string;
   jobId: string;
   embeddingVectorDistance: number;
   jobTitle: string;
   companyName: string;

   /**
      * @description
      *  1. count of emails send to this candidate for this particular job.
      */
   includedInEmailCount: number;

   isJobPublished: boolean;
}
```


```ts
// For `candidateJobAlerts` collection
interface DbCandidateJobAlertDto {
   id: string; // It should be same as the "document ID" of the firestore document.
   createdAt: string;
   updatedAt: string;
   candidateEmail: string;

   /**
    * @description
      1. If this is true only then "send email to candidate every week with job matches" every week, otherwise don't send.
   */
   isEmailJobAlertEnabled: boolean;
}
```





```sh
# Prompt given by "Product manager" for email template creation
I want to send the e-mail to candiates with the relevent opening every week this wil be logic : send max 3 e-mails to candidate( 1 email per week) if no news jobs are published for him. In e-mail we will show max 3 jobs & minimum 1 job. can you help me with creative e-mail contnet. for all 3 emails
Give me 3-types of subject line for 1st e-mail.
```




