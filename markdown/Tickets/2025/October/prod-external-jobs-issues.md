
1. `CLOSED` bulk job status discuss with business team -> As of now don't show `CLOSED` option in dropdown
2. On `05-10-2025` the few job deletion failed in `s3 vector`:
   1. Why `5000` jobs are not found for deletion in `s3 vector` ?
   2. Is migrating jobs from `opensearch` to `s3 vector` is mismatched ?
   3. Need to check present count of jobs in both `opensearch` and `s3 vector`
3. On `06-10-2025` why the `s3Ulid` ids generated `3` times and files are stored in it ?
   1. Need to check `cron` expression
   2. Need to check whether the same jobs stored 3 times in `opensearch` and `s3 vector`
