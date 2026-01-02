 1. 
```sh
# Batch predictions with Anthropic Claude models
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude/batch
```

2. 
```sh
APP_GCP_VERTEX_SERVICE_ROLE="worko-batch-inference-role"

APP_GCP_VETEX_MODEL_NAME="claude-sonnet-4@20250514"
# Pick one region:
LOCATION=global
LOCATION=us-east5
LOCATION=europe-west1
```

3. 
```sh
# Anthropic Vertex TypeScript API Library
https://github.com/anthropics/anthropic-sdk-typescript/tree/main/packages/vertex-sdk
```


# AWS Bedrock Batch Inference Flow
1. Retrieve `bright data external jobs` and write `300` records in each `jsonl` file and upload all files to 
`Aws s3 batch inference input folder` 
2. Whenever we create `Batch inference` in `AWS bedrock` we need to specify `source` and `destination` aws s3 paths
3. After we create `Batch inference` in `AWS bedrock` the status will be `Pending` and whenever the status is updated to `Completed` then `worko-job-batch-inference-update-function` aws lambda will be get triggerred 
   ```json
   // Amazon EventBridge > Rules > "worko-job-batch-inference-WorkoBatchInferenceUpdate-i3iA6mBWxO9c"
   {
      "detail-type": ["Batch Inference Job State Change"],
      "source": ["aws.bedrock"],
      "detail": {
         "status": ["Completed"]
      }
   }
   ```
4. `worko-job-batch-inference-update-function` will fetch the results from `Aws s3 batch inference output folder` and update them in `gcp firestore` and create them in `aws s3 vector`


# GCP Vertex AI Batch Inference Flow
1. Retrieve `bright data external jobs` and write `300` records in each `jsonl` file and upload all files to 
`GCP storage batch inference input folder` 
2. Whenever we create `Batch inference` in `GCP vertex AI` we need to specify `source` and `destination` GCP storage paths
3. After we create `Batch inference` in `GCP vertex AI` the status will be `Pending` and whenever the status is updated to `Completed` then `worko-job-batch-inference-update-function` aws lambda should get triggerred 
4. `worko-job-batch-inference-update-function` will fetch the results from `GCP storage batch inference output folder` and update them in `gcp firestore` and create them in `aws s3 vector`