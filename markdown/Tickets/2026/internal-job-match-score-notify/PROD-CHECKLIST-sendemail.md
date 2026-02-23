
# Pre-deployment checklist
1. create `candidateJobRecommendations` and `candidateJobAlerts` in `worko-corp-db-prod` database in `gcp firestore`
2. create `candidateEmail + isJobPublished + includedInEmailCount` composite index in `candidateJobRecommendations` and all fields must be in `descending` order
3. create `isEmailJobAlertEnabled + publishedJobRecommendationsCount` composite index in `candidateJobAlerts` and all fields must be in `descending` order
3. Check whether `CAND_JOBS_RECOMMENDATION` email template is created or not with backend developer


# Deployments
1. `dev` of `worko-job-app` repo

# Post-deployment checklist
1. Check whether `candidate-job-alert-schedule-prod` is created in `Amazon EventBridge > Scheduled rules`
