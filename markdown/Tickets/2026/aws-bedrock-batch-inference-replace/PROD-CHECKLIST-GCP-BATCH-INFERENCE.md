

1. Create `worko-batch-inference-file-prod` bucket in Gcp 
2. Give `Gcp storage bucket` permissions to the credentials present in `GCP-firestore-secret-prod` for client email and private key
3. enable `gemini-3-pro-preview` in `gcp` if its not enabled by checking with `ai team`
4. Create `batchInferenceLogs` collection in `worko-jobs-db-prod` database in `GCP Firestore`

# Deployments
1. take a pull, intall dependencies and deploy `dev` branch of `worko-job-app` repository
2. `worko-job-batch-inference-update-function` lambda in aws console
3. `worko-job-batch-inference-firestore-gcp-update-function` lambda in aws console
