
1. Register evaluator 
   [`POST`] `https://jobs.dev.worko.work/evaluator-detail/`
   ```json
   // Request body
   {
      "name": "string",
      "email": "string",
      "cognitoUserId": "string" 
   }
   ```
   ```json
   // Response body
   {
      "PK":"EVAL#{evaluatorEmail}",
      "SK": "ID#{id}", 
      "GSI1PK": "EVAL#",
      "GSI1SK": "ID#{id}",
      "name": "string",
      "email": "string",
      "cognitoUserId": "string",
      "createdAt": 781206482187789,
      "updatedAt": 781206482187789
   }
   ```

2. Get evaluator detail by id
   [`GET`] `https://jobs.dev.worko.work/evaluator-detail/:id`
   ```json
   // Response body
   {
      "PK":"EVAL#{evaluatorEmail}",
      "SK": "ID#{id}", 
      "GSI1PK": "EVAL#",
      "GSI1SK": "ID#{id}",
      "name": "string",
      "email": "string",
      "cognitoUserId": "string",
      "createdAt": "string",
      "updatedAt": "string"
   }
   ```

3. Get evaluator detail by email
   [`GET`] `https://jobs.dev.worko.work/evaluator-detail/:emailId/email`
   ```json
   // Response body
   {
      "PK":"EVAL#{evaluatorEmail}",
      "SK": "ID#{id}", 
      "GSI1PK": "EVAL#",
      "GSI1SK": "ID#{id}",
      "name": "string",
      "email": "string",
      "cognitoUserId": "string",
      "createdAt": "string",
      "updatedAt": "string"
   }
   ```
