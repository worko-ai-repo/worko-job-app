

1. soft delete job api
   [PUT] `https://jobs.dev.worko.work/job/:jobId/delete`
   ```json
   {"companyId": "string","shortSoftDeleteReason": "string","detailedSoftDeleteReason": "string"}
   ```