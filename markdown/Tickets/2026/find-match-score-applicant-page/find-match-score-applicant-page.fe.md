

1. Matching score api
[POST] `https://jobs.dev.worko.work/job-application/find-matching-score`
```json
// Request body
{
   "userJobApplicationId": "string",
   "candidateParsedCvId": "string"
}
```
```json
// 202 status code
{ "message": "Matching score process initiated." }
```

2. Look up api
[GET] `https://jobs.dev.worko.work/job-application/:id`
```json
// Response
{
   // ...
   "isFindMatchingScoreInProgress": false | true
   // ...
}
```