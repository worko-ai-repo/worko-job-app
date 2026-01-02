
# Follow below order 
1. Create `worko-jobs-db-prod` database
2. Create `workoJobs` collection in `worko-jobs-db-prod` database
3. Check whether `worko-job-app-prod-app-migrate-jobs` lambda created or not
4. Migrate jobs from `aws opensearch` to `gcp firestore`
[POST] `https://jobs.worko.ai/script/script-migrate-jobs-aws-opensearch-to-gcp-firestore`
```json
// Request payload
{
   "reqPageSize": 200
}
```
5. Check cloudwatch logs in `worko-job-app-prod-app-migrate-jobs`
6. Once every job is migrated successfully create below `composite indexes` all in `descending` order:
```sh
# NOTE: Create every composite index strictly in `descending` order because in `code` we are using it for `inquality` filters

# Corporate dashboard
companyId + status + createdByCorporateUserId + createdAt
companyId + status + jobTitle + createdByCorporateUserId + createdAt

# Worko Admin dashboard
status + companyId + createdAt 
status + jobTitle + companyId + createdAt 

# Non-loggedin user
status + createdAt

# Bright data expired jobs retrieval
sourcedFrom + externalJobId + createdAt
```

# Deployments
1. `worko-auth` aws lambda
2. take a pull, install from `dev` branch of `worko-corp-app` repository
3. take a pull, install from `dev` branch of `worko-job-app` repository
4. `worko-job-batch-inference-update-function` aws lambda
5. 
