
# Requirement
1. Once a job is closed then auto `reject` all the job application statuses whose statuses are not includes in `UserJobApplicationIgnoreRejectUpdateStatusEnum` in `UserJobApplication.enum.ts`

2. Reject with a message which was entered by `recruiter` or `worko-admin`, If `recruiter` or `worko-admin` didn't entered any reason then show default message `Position has been went on closed by the Recruiter`.

3. Retrieve all job applications by `jobId` which doesn't includes `status` in `UserJobApplicationIgnoreRejectUpdateStatusEnum` in `UserJobApplication.enum.ts` and update those job applications `status` as `REJECTED` 