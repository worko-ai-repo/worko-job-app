
# Production Checklist
1. `worko-auth` 
2. create `evaluator` group in `cognito` 
3. create seperate app client for `password less` signin flow
4. add new app client in environment variables in `worko-auth` lambda
5. Amazon Cognito > User pools > worko > Extensions
```sh
worko-create-auth-challange 
worko-define-auth-challange
worko-verify-auth-challange
```

```sh
# Angular corporate login
https://dev-ui.worko.work/v1/auth/corporate/login
```

```sh
# send for evaluation login
https://dev-ui.worko.work/evaluator-dashboard/?evaluatorEmail=rohith.appala%2Bevaluatortwo%40worko.ai
```

# Backend Pending 
1. 
```sh
2025-07-23T12:28:01.837Z	8791abb8-60da-4c34-b14d-1c9d79e1594c	ERROR	CognitoJwtInvalidGroupError: Missing Cognito group. Expected one of: admin, corporate-admin, corporate-recruiter, evaluator
    at assertStringArraysOverlap (file:///opt/nodejs/node_modules/aws-jwt-verify/dist/esm/assert.js:58:15)
    at validateCognitoJwtFields (file:///opt/nodejs/node_modules/aws-jwt-verify/dist/esm/cognito-verifier.js:20:9)
    at CognitoJwtVerifier.verify (file:///opt/nodejs/node_modules/aws-jwt-verify/dist/esm/cognito-verifier.js:120:13)
    at async Runtime.handler (file:///var/task/index.mjs:102:19) {
  failedAssertion: {
    actual: undefined,
    expected: [ 'admin', 'corporate-admin', 'corporate-recruiter', 'evaluator' ]
  }
```
2. Check with frontend regarding `Evaluator` signin flow
3. Check with frontend regarding `Corporate` signin flow because `evaluator` and `corporate` may have same email
4. Don't list request evaluations if those are already submitted for `ON_HOLD` and `REJECTED`
5. Resend evaluation

# Build Passwordless Email OTP Authentication with AWS Cognito:
1. 
```ts
/**
 * Custom authentication challenge Lambda triggers
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html
 * 
 * Implementing passwordless email authentication with Amazon Cognito
 * @see https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
 * 
 * React: Implementing Passwordless Login with AWS Cognito
 * @see https://dev.to/garciadiazjaime/react-implementing-passwordless-login-with-aws-cognito-3bj7
 */
```

# Low level flow:
## Send for evaluation popup:
1. When user clicks on `View Cv` button:
   1. `Send for evaluation` button will be visible:
      1. If `corporate-admin/recruiter` clicks `Send for evaluation` button:
         1. Popup: (Max `10` evaluators can be sent)
            1. `Name`: Name of evaluator 
            2. `Email`: Current Company Email of evaluator
               1. Let's say the `corporate` is working on `amazon` company, then the 
                  `corporate` can only send this job application to the evaluator who is
                  currently working on that same `amazon` company.
                  For example, `corporate` should enter `sahil@amazon.com`, 
                  if `corporate` enters `suresh@swiggy.com`,
                  then we need to throw an error.
            3. `Message`: Detailed explanation from corporate-admin/recruiter
      2. If `worko-admin` clicks `Send for evaluation` button:
         1. Popup: (Max `10` evaluators can be sent)
            1. `Name`: Name of evaluator 
            2. `Email`: Current Company Email of evaluator
               1. Let's say the `worko-admin` can send to other company `evaluators` but should not enter
                  un-official emails like `@gmail`, `@yahoo`. `worko-admin` should also enter 
                  `@companyname.com` etc.
            3. `Message`: Detailed explanation from corporate-admin/recruiter

## Submit send for evaluation popup:
1. If `corporate-admin/recruiter` clicks `Submit` button in send for evaluation popup:
   1. Below api will be called and item will be created in the `dynamodb`:
      ```sh
      `Send for evaluation` create request evaluation api
      ```
      1. After successfully sending job application to even single evaluator we are storing it in below:
         ```sh
         RequestEvaluation.dao.ts -> refer composite keys
         RequestEvaluation.model.ts -> refer db structure						
         ```
         1. After storing in above composite keys, we will send email to the evaluator by giving below link:
            ```sh
            https://dev-ui.worko.work/evaluator-dashboard/?evaluatorEmail=rohith.appala@worko.ai
            ```
2. If `worko-admin` clicks `Submit` button in send for evaluation popup:

## Evaluator Clicks On link recieved in his email 
1. Frontend will retrieve the evaluator email from url:
   1. Frontend will check whether the email is present in cognito users or not: `Amazon Cognito > User pools > worko > Users`
      1. If the retrieved evaluatorEmail not present in cognito users:
         1. Frontend by Using Amplify signUp method to create an account in cognito with `unconfirmed` status and unverified email:
            1. After email created in cognito users list then automatically the signUp method will send an email to the user with `otp`(Note: 1. on `prod` the email template need to be beautify)
               1. User will copy from email and enter the otp in the popup:(`Resend Otp` button)
                  1. He will enter correct `otp`:
                     1. Copy the code you received from the email and pass it to `confirmSignUp`, along with the same email you used for signUp.
                        1. successfully verified otp: 
                           1. Register evaluator api to store in dynamodb with `email`, `cognitoUserId`, `name` as payload
                              1. After data created in dynamodb by elevating the `email` in `evaluator` group:
                                 1. Then call below api to list job applications for evaluator:
                                    ```ts
                                    [GET] `https://jobs.dev.worko.work/request-evaluation/?evaluatorEmail=rohith.appala@worko.ai&pageSize=25&sortOrder=descending`
                                    ```
                        2. failure:
                  2. He will enter wrong `otp`:
                     1. enter correct `otp` popup
      
      2. If the retrieved evaluatorEmail present in cognito users:
         1. Request One-time Password for login:
            1. He will enter correct `otp`:
               1. Frontend will call [`GET`] `https://jobs.dev.worko.work/evaluator-detail/:emailId/email`
                  1. If evaluator email details not found in dynamodb:
                     1. Frontend will call create api with `name`, `email`,`cognitoUserId`: [`POST`] `https://jobs.dev.worko.work/evaluator-detail/`
                        1. Then call below api to list job applications for evaluator:
                           ```ts
                           [GET] `https://jobs.dev.worko.work/request-evaluation/?evaluatorEmail=rohith.appala@worko.ai&pageSize=25&sortOrder=descending`
                           ```
                  2. If evaluator email details found in dynamodb then, the `email` is already populated in
                     `evaluator` group
                     1. Then call below api to list job applications for evaluator:
                        ```ts
                        [GET] `https://jobs.dev.worko.work/request-evaluation/?evaluatorEmail=rohith.appala@worko.ai&pageSize=25&sortOrder=descending`
                        ```
                        
# Corporate Account Signin/Signup Flow:
   ## corporate-recruiter flow
   1. Frontend will check whether the email is present in cognito users or not: `Amazon Cognito > User pools > worko > Users`
      1. If the retrieved email present in cognito users:
         1. Frontend will check whether the email is present in `corporate-recruiter` group or not:
            1. Not present:
               1. Frontend should check whether the email is present in `evaluator` group or not:
                  1. Present:
                     1. Click on Reset password and login to `corporate dashboard`:
                        1. create corporate api, get cognito api for corporate
                  2. Not present:
                     1. That means the email is `employee email`:
                        1. login to `corporate dashboard` with the same `employee` credentials
            2. Present
      2. If the retrieved email not present in cognito users:
         1. same corporate account creation flow

   ## corporate-admin flow
   1. Frontend will check whether the email is present in cognito users or not: `Amazon Cognito > User pools > worko > Users`
      1. If the retrieved email present in cognito users:
         1. Frontend will check whether the email is present in `corporate-admin` group or not:
            1. Not present:
               1. Frontend should check whether the email is present in `evaluator` group or not:
                  1. Present:
                     1. Click on Reset password and login to `corporate dashboard`:
                        1. create corporate api, get cognito api for corporate
                  2. Not present:
                     1. That means the email is `employee email`:
                        1. login to `corporate dashboard` with the same `employee` credentials
            2. Present
      2. If the retrieved email not present in cognito users:
         1. same corporate account creation flow
