
1. Job application listing issue for `sarvesh` in candidate jobs page
   1. This job id is not found in `opensearch`
   ```sh 
   GET worko-jobs/_doc/01JWG1Z51H0SDZ92DKX17JG85B
   ```
   ```json
   {
   "_index": "worko-jobs",
   "_id": "01JWG1Z51H0SDZ92DKX17JG85B",
   "found": false
   }
   ```
   2. 
   ```json
   {
   "PK": "USR#EML#sarvesh.singh@worko.ai",
   "SK": "JOB#APP#ID#01JWG207SX96B6ST841RXVNVGP",
   "companyId": "01J1BZ59A0V0AXY21TNDSPRJ78",
   "companyName": "WORKO",
   "createdAt": 1748590665533, // Friday, 30 May 2025 1:07:45.533 PM GMT+05:30
   "displayToCorporate": true,
   "GSI1PK": "COMP#ID#01J1BZ59A0V0AXY21TNDSPRJ78#JOB#APP#",
   "GSI1SK": "ID#01JWG207SX96B6ST841RXVNVGP",
   "GSI2PK": "JOB#APP#",
   "GSI2SK": "ID#01JWG207SX96B6ST841RXVNVGP",
   "GSI3PK": "JOB#ID#01JWG1Z51H0SDZ92DKX17JG85B",
   "GSI3SK": "JOB#APP#ID#01JWG207SX96B6ST841RXVNVGP",
   "id": "01JWG207SX96B6ST841RXVNVGP",
   "jobId": "01JWG1Z51H0SDZ92DKX17JG85B", // This job is not present in "opensearch" and "dynamodb"
   }
   ```

