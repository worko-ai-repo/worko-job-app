# NOTE:- These error handling tips are just examples, Please don't follow this tips blindly.

1. When you face below kind of error
```ts
/**
 * -> Tip-1: check `serverless.ts` > find `iamRoleStatements` option in the code > check permissions
 * -> Tip-2: @see https://forum.serverless.com/t/user-is-not-authorized-to-access-this-resource/6357
 * -> Tip-3: Clear cookies in postman and login again and try
 */
```
```sh
403 Forbidden
Access to the resource is prohibited.
```
```json
{
   "Message":"User is not authorized to access this resource"
}
```


2. When you get below kind of error
```ts
/**
 * -> Tip-1: check whether environment variables are accessed properly or not, like it will accessed as `undefined`.
 * -> Tip-2: check whether environment variables `name` you are accessing and the `name` you are accessing is same or not.
 */
```
```json
2025-02-11T13:43:47.371Z	undefined	ERROR	Uncaught Exception 	{
    "errorType": "ConfigurationError",
    "errorMessage": "Missing node(s) option",
    "name": "ConfigurationError",
    "stack": [
        "ConfigurationError: Missing node(s) option",
        "    at new I (/var/task/dist/src/app-event-trigger.js:2:437273)",
        "    at <instance_members_initializer> (/var/task/dist/src/app-event-trigger.js:2:1413036)",
        "    at new t.AwsOpensearchLibrary (/var/task/dist/src/app-event-trigger.js:2:1413013)",
        "    at 37480 (/var/task/dist/src/app-event-trigger.js:2:1344781)",
        "    at s (/var/task/dist/src/app-event-trigger.js:2:11866451)",
        "    at 93427 (/var/task/dist/src/app-event-trigger.js:2:1420146)",
        "    at s (/var/task/dist/src/app-event-trigger.js:2:11866451)",
        "    at 8062 (/var/task/dist/src/app-event-trigger.js:2:1444344)",
        "    at s (/var/task/dist/src/app-event-trigger.js:2:11866451)",
        "    at 52961 (/var/task/dist/src/app-event-trigger.js:2:1340517)"
    ]
}
```


3. I have faced below error when I'm trying to create `index` in `aws opensearch managed clusters`,
then I have solved the error using below reference link provided in `Tip-1`
```ts
/**
 * -> Tip-1: @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-more-masters
 */
```
```json
{
  "errorCode": 500,
  "errorMsg": "security_exception: [security_exception] Reason: no permissions for [indices:admin/create] and User [name=arn:aws:iam::211125353899:role/worko-job-app-dev-ap-south-1-lambdaRole, backend_roles=[arn:aws:iam::211125353899:role/worko-job-app-dev-ap-south-1-lambdaRole], requestedTenant=null]",
  "timeStamp": "2025-02-12T12:22:39.740Z"
}
```
```json
{
  "statusCode": 500,
  "body": "{\"error\": \"AuthorizationException(403, 'security_exception', 'no permissions for [indices:data/read/get] and User [name=arn:aws:iam::211125353899:role/service-role/worko-user-matching-score-job-role-34tbkmew, backend_roles=[arn:aws:iam::211125353899:role/service-role/worko-user-matching-score-job-role-34tbkmew], requestedTenant=null]')\"}"
}
```


4. When you get below kind of error
```ts
/**
 * -> Tip-1: Check whether the api endpoint is correct or not, compare the endpoint you are hitting in postman and the api you 
 *    written in the code
 */
```
```json
{
  "message": "Invalid key=value pair (missing equal-sign) in Authorization header (hashed with SHA-256 and encoded with Base64): '4oTPuwIr76FeGjkt/eGqTfhc+YcdBSjFfw5dRwc+hXo='."
}
```


5. 
```ts
/**
 * -> Tip-1: Check whether you have registered the dynamoose model or not in `DB.config.ts`
 */
```
```json
{
    "errorType": "Runtime.UnhandledPromiseRejection",
    "errorMessage": "AccessDeniedException: User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:CreateTable on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/CompanyJob because no identity-based policy allows the dynamodb:CreateTable action",
    "reason": {
        "errorType": "AccessDeniedException",
        "errorMessage": "User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:CreateTable on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/CompanyJob because no identity-based policy allows the dynamodb:CreateTable action",
        "name": "AccessDeniedException",
        "$fault": "client",
        "$metadata": {
            "httpStatusCode": 400,
            "requestId": "5I7LLTNQHDPE0M08NIDJA7TRCFVV4KQNSO5AEMVJF66Q9ASUAAJG",
            "attempts": 1,
            "totalRetryDelay": 0
        },
        "__type": "com.amazon.coral.service#AccessDeniedException",
        "message": "User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:CreateTable on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/CompanyJob because no identity-based policy allows the dynamodb:CreateTable action",
        "stack": [
            "AccessDeniedException: User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:CreateTable on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/CompanyJob because no identity-based policy allows the dynamodb:CreateTable action",
            "    at /var/task/dist/src/app.js:2:702325",
            "    at /var/task/dist/src/app.js:2:702420",
            "    at ns (/var/task/dist/src/app.js:2:180080)",
            "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
            "    at async /var/task/dist/src/app.js:2:666072",
            "    at async /var/task/dist/src/app.js:2:654761",
            "    at async /var/task/dist/src/app.js:2:665043",
            "    at async /var/task/dist/src/app.js:2:376824",
            "    at async t.default (/var/task/dist/src/app.js:2:1236160)",
            "    at async t.createTable (/var/task/dist/src/app.js:2:1229785)"
        ]
    },
    "promise": {},
    "stack": [
        "Runtime.UnhandledPromiseRejection: AccessDeniedException: User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:CreateTable on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/CompanyJob because no identity-based policy allows the dynamodb:CreateTable action",
        "    at process.<anonymous> (file:///var/runtime/index.mjs:1276:17)",
        "    at process.emit (node:events:529:35)",
        "    at process.emit (node:domain:489:12)",
        "    at emit (node:internal/process/promises:149:20)",
        "    at processPromiseRejections (node:internal/process/promises:283:27)",
        "    at process.processTicksAndRejections (node:internal/process/task_queues:96:32)"
    ]
}
```


6. 
```ts
/**
 * -> Tip-1: Check the `timeout` in `serverless.ts` file and increase it or make your code optimize way to reduce for loops
 */
```
```json
// In postman

// 504
// Gateway Timeout
{"message": "Endpoint request timed out"}
```
```sh
# In Cloudwatch
2025-02-25T11:16:05.926Z f922af8b-1eda-470d-99a2-4927ed88f929 Task timed out after 29.04 seconds
```


7. 
```ts
/**
 * -> Tip-1: check serverless file(serverless.ts or serverless.yml) and set the `timeout` for 
 * the `lambda function` which you are using.
 */
```
```sh
2025-02-18T11:51:13.504Z d167b473-a881-4be5-a067-90ea8991ec79 Task timed out after 29.04 seconds
```

8. 
```ts
/**
 * -> Tip-1: check serverless file(serverless.ts or serverless.yml) and set the `VPC` configuartion to the particular `lambda function` for which the error is occuring.
 */
```
```sh
connect ETIMEDOUT 10.0.0.36:443
```


9. 
```ts
/**
 * -> Tip-1: DynamoDB > Tables > {tableName} >Create index
 */
```
```json
{
  "errorCode": 500,
  "errorMsg": "The table does not have the specified index: GSI1",
  "timeStamp": "2025-02-19T10:56:15.022Z"
}
```

10. 
```ts
/**
 * -> Tip-1: check whether the `opensearch` dashboard is opening or not
 */
```
```json
{
  "statusCode": 429,
  "body": {
    "message": "Response Error",
    "error": "Response Error"
  }
}
```

11. 
```ts
/**
 * -> Tip-1: Check whether the data present in the aws opensearch index or not.
 */
```
```sh
Unknown application error occurred
```
```json
2025-02-24T10:43:14.217Z	7e7b363e-555c-46e6-8b84-060948d9986c	ERROR	Unhandled Promise Rejection 	{
    "errorType": "Runtime.UnhandledPromiseRejection",
    "errorMessage": "{\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}],\"type\":\"x_content_parse_exception\",\"reason\":\"[1:85] [bool] failed to parse field [must]\",\"caused_by\":{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}},\"status\":400}",
    "reason": {
        "errorType": "ResponseError",
        "errorMessage": "x_content_parse_exception: [parsing_exception] Reason: [term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
        "name": "ResponseError",
        "meta": {
            "body": {
                "error": {
                    "root_cause": [
                        {
                            "type": "parsing_exception",
                            "reason": "[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
                            "line": 1,
                            "col": 85
                        }
                    ],
                    "type": "x_content_parse_exception",
                    "reason": "[1:85] [bool] failed to parse field [must]",
                    "caused_by": {
                        "type": "parsing_exception",
                        "reason": "[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
                        "line": 1,
                        "col": 85
                    }
                },
                "status": 400
            },
            "statusCode": 400,
            "headers": {
                "date": "Mon, 24 Feb 2025 10:43:14 GMT",
                "content-type": "application/json; charset=UTF-8",
                "content-length": "394",
                "connection": "keep-alive",
                "access-control-allow-origin": "*"
            },
            "meta": {
                "context": null,
                "request": {
                    "params": {
                        "method": "POST",
                        "path": "/worko-user-matching-score-job/_search",
                        "querystring": "",
                        "body": "{\"query\":{\"bool\":{\"must\":[{\"term\":{\"userId\":\"REDACTED\"},\"terms\":{\"jobId\":[\"01JMV66XA3CZGWA80X6W80ZGXY\"]}}]}}}",
                        "headers": {
                            "user-agent": "opensearch-js/3.2.0 (linux 5.10.233-244.887.amzn2.x86_64-x64; Node.js v18.20.4)",
                            "content-type": "application/json",
                            "content-length": "137"
                        },
                        "timeout": 30000
                    },
                    "options": {},
                    "id": 1
                },
                "name": "opensearch-js",
                "connection": {
                    "url": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/",
                    "id": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/",
                    "headers": {},
                    "deadCount": 0,
                    "resurrectTimeout": 0,
                    "_openRequests": 0,
                    "status": "alive",
                    "roles": {
                        "data": true,
                        "ingest": true
                    }
                },
                "attempts": 0,
                "aborted": false
            }
        },
        "stack": [
            "ResponseError: x_content_parse_exception: [parsing_exception] Reason: [term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
            "    at P (/var/task/dist/src/app.js:2:601511)",
            "    at IncomingMessage.m (/var/task/dist/src/app.js:2:600242)",
            "    at IncomingMessage.emit (node:events:529:35)",
            "    at IncomingMessage.emit (node:domain:489:12)",
            "    at endReadableNT (node:internal/streams/readable:1400:12)",
            "    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)"
        ]
    },
    "promise": {},
    "stack": [
        "Runtime.UnhandledPromiseRejection: {\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}],\"type\":\"x_content_parse_exception\",\"reason\":\"[1:85] [bool] failed to parse field [must]\",\"caused_by\":{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}},\"status\":400}",
        "    at process.<anonymous> (file:///var/runtime/index.mjs:1276:17)",
        "    at process.emit (node:events:529:35)",
        "    at process.emit (node:domain:489:12)",
        "    at emit (node:internal/process/promises:149:20)",
        "    at processPromiseRejections (node:internal/process/promises:283:27)",
        "    at process.processTicksAndRejections (node:internal/process/task_queues:96:32)"
    ]
}
```


12. 
```json
// In Postman

// 500 Internal Server Error
{"errorCode":500,"errorMsg":"connect ECONNREFUSED 10.0.0.36:443","timeStamp":"2025-02-25T11:37:18.961Z"}
```
```sh
# In Cloudwatch

2025-02-25T11:37:18.978Z	6a104282-a297-492b-b096-fd3945f94cfc	ERROR	ConnectionError: connect ECONNREFUSED 10.0.0.36:443
    at ClientRequest.n (/var/task/dist/src/app.js:2:584553)
    at ClientRequest.emit (node:events:517:28)
    at ClientRequest.emit (node:domain:489:12)
    at TLSSocket.socketErrorListener (node:_http_client:501:9)
    at TLSSocket.emit (node:events:517:28)
    at TLSSocket.emit (node:domain:489:12)
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
```


13. 
```ts
/**
 * The error message indicates that the query parser expected an END_OBJECT but found a FIELD_NAME, which suggests that the query structure is incorrect.
 * 
 * The issue is that you're mixing term and terms queries inside the same object. This is not allowed because each query type must be in its own object within the must
 * array.
 */
```
```sh
2025-02-27T06:07:14.881Z	52e6d484-0197-423d-b338-a3eb9468ffd7	ERROR	Unhandled Promise Rejection 	{
    "errorType": "Runtime.UnhandledPromiseRejection",
    "errorMessage": "{\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}],\"type\":\"x_content_parse_exception\",\"reason\":\"[1:85] [bool] failed to parse field [must]\",\"caused_by\":{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}},\"status\":400}",
    "reason": {
        "errorType": "ResponseError",
        "errorMessage": "x_content_parse_exception: [parsing_exception] Reason: [term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
        "name": "ResponseError",
        "meta": {
            "body": {
                "error": {
                    "root_cause": [
                        {
                            "type": "parsing_exception",
                            "reason": "[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
                            "line": 1,
                            "col": 85
                        }
                    ],
                    "type": "x_content_parse_exception",
                    "reason": "[1:85] [bool] failed to parse field [must]",
                    "caused_by": {
                        "type": "parsing_exception",
                        "reason": "[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
                        "line": 1,
                        "col": 85
                    }
                },
                "status": 400
            },
            "statusCode": 400,
            "headers": {
                "date": "Thu, 27 Feb 2025 06:07:14 GMT",
                "content-type": "application/json; charset=UTF-8",
                "content-length": "394",
                "connection": "keep-alive",
                "access-control-allow-origin": "*"
            },
            "meta": {
                "context": null,
                "request": {
                    "params": {
                        "method": "POST",
                        "path": "/worko-user-matching-score-job/_search",
                        "querystring": "",
                        "body": "{\"query\":{\"bool\":{\"must\":[{\"term\":{\"userId\":\"REDACTED\"},\"terms\":{\"jobId\":[\"01JMV66XA3CZGWA80X6W80ZGXY\"]}}]}}}",
                        "headers": {
                            "user-agent": "opensearch-js/3.2.0 (linux 5.10.233-244.887.amzn2.x86_64-x64; Node.js v18.20.4)",
                            "content-type": "application/json",
                            "content-length": "137"
                        },
                        "timeout": 30000
                    },
                    "options": {},
                    "id": 3
                },
                "name": "opensearch-js",
                "connection": {
                    "url": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/",
                    "id": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/",
                    "headers": {},
                    "deadCount": 0,
                    "resurrectTimeout": 0,
                    "_openRequests": 0,
                    "status": "alive",
                    "roles": {
                        "data": true,
                        "ingest": true
                    }
                },
                "attempts": 0,
                "aborted": false
            }
        },
        "stack": [
            "ResponseError: x_content_parse_exception: [parsing_exception] Reason: [term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
            "    at P (/var/task/dist/src/app.js:2:601511)",
            "    at IncomingMessage.m (/var/task/dist/src/app.js:2:600242)",
            "    at IncomingMessage.emit (node:events:529:35)",
            "    at IncomingMessage.emit (node:domain:489:12)",
            "    at endReadableNT (node:internal/streams/readable:1400:12)",
            "    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)"
        ]
    },
    "promise": {},
    "stack": [
        "Runtime.UnhandledPromiseRejection: {\"error\":{\"root_cause\":[{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}],\"type\":\"x_content_parse_exception\",\"reason\":\"[1:85] [bool] failed to parse field [must]\",\"caused_by\":{\"type\":\"parsing_exception\",\"reason\":\"[term] malformed query, expected [END_OBJECT] but found [FIELD_NAME]\",\"line\":1,\"col\":85}},\"status\":400}",
        "    at process.<anonymous> (file:///var/runtime/index.mjs:1276:17)",
        "    at process.emit (node:events:529:35)",
        "    at process.emit (node:domain:489:12)",
        "    at emit (node:internal/process/promises:149:20)",
        "    at processPromiseRejections (node:internal/process/promises:283:27)",
        "    at process.processTicksAndRejections (node:internal/process/task_queues:96:32)"
    ]
}
```

14. when I tried to interact with `aws opensearch` i got below error:
```json
{
  "error": {
    "meta": {
      "body": { "message": "No server available to handle the request" }
    }
  }
}
```

15. 
```ts
/**
 * Increase the payload size limit of API Gateway
 * @see https://repost.aws/questions/QUuinc6g08T2iRQQd03PHjbQ/increase-the-payload-size-limit-of-api-gateway
 * 
 * 
 */
```
```json
// 413 Payload Too Large
// Request is too large for the server to process.
// PayloadTooLargeError
{
  "errorCode": 413,
  "errorMsg": "request entity too large",
  "timeStamp": "2025-03-06T10:57:42.655Z"
}
```
```sh
413 Request Entity Too Large
Request is too large for the server to process.

HTTP content length exceeded 10485760 bytes.
```

16. 
```json
{"errorCode":500,"errorMsg":"Response Error","timeStamp":"2025-03-08T10:40:12.688Z"}
```

17. 
```ts
/**
 * Tip:-1: Connect with `CTO` and increate `WCU` to `50 to 60` 
 */
```
```json
{"errorCode":500,"errorMsg":"The level of configured provisioned throughput for the table was exceeded. Consider increasing your provisioning level with the UpdateTable API.","timeStamp":"2025-03-09T04:57:38.413Z"}
```


18. 
```ts
2025-03-10T03:36:59.772Z	702af9ed-da02-486a-bbb6-e4b5891bb984	ERROR	Uncaught Exception 	{
    "errorType": "TypeError",
    "errorMessage": "t is not a function",
    "code": "TypeError",
    "message": "t is not a function",
    "time": "2025-03-10T03:36:59.771Z",
    "stack": [
        "TypeError: t is not a function",
        "    at /var/task/dist/src/app.js:2:1136861",
        "    at constructor.<anonymous> (/var/task/dist/src/app.js:2:1136492)",
        "    at constructor.<anonymous> (/var/task/dist/src/app.js:2:991044)",
        "    at constructor.callListeners (/var/task/dist/src/app.js:2:1008368)",
        "    at constructor.emit (/var/task/dist/src/app.js:2:1008078)",
        "    at constructor.emitEvent (/var/task/dist/src/app.js:2:993919)",
        "    at constructor.e (/var/task/dist/src/app.js:2:989424)",
        "    at t.runTo (/var/task/dist/src/app.js:2:1074116)",
        "    at /var/task/dist/src/app.js:2:1074322",
        "    at constructor.<anonymous> (/var/task/dist/src/app.js:2:989694)"
    ]
}
```


19. 
```ts
/**
 * Tip:1:- check express middleware in app.ts file
 */
```
```ts
{"errorCode":500,"errorMsg":"e.flatMap is not a function","timeStamp":"2025-03-10T12:04:59.319Z"}
```


20. 
```ts
{
  "errorCode": 500,
  "errorMsg": "search_phase_execution_exception: [illegal_argument_exception] Reason: Text fields are not optimised for operations that require per-document field data like aggregations and sorting, so these operations are disabled by default. Please use a keyword field instead. Alternatively, set fielddata=true on [companyId] in order to load field data by uninverting the inverted index. Note that this can use significant memory.",
  "timeStamp": "2025-03-17T14:33:12.794Z"
}
```


21. 
```json
{
  "errorCode": 500,
  "errorMsg": "self-signed certificate",
  "timeStamp": "2025-03-24T13:19:26.300Z"
}
```

22. 
```ts
ERROR	Uncaught Exception 	
{
    "errorType": "Error",
    "errorMessage": "Scheduler ARNs are not properly configured",
    "errorCode": 500,
    "errorMsg": "Scheduler ARNs are not properly configured",
    "timeStamp": "2025-04-02T11:00:04.135Z",
    "stack": [
        "Error: Scheduler ARNs are not properly configured",
        "    at new a (/var/task/dist/src/app.js:2:1915512)",
        "    at new <anonymous> (/var/task/dist/src/app.js:2:1882104)",
        "    at 47106 (/var/task/dist/src/app.js:2:1881836)",
        "    at a (/var/task/dist/src/app.js:2:12602513)",
        "    at 14644 (/var/task/dist/src/app.js:2:1871042)",
        "    at a (/var/task/dist/src/app.js:2:12602513)",
        "    at 10377 (/var/task/dist/src/app.js:2:1876840)",
        "    at a (/var/task/dist/src/app.js:2:12602513)",
        "    at 77609 (/var/task/dist/src/app.js:2:1727729)",
        "    at a (/var/task/dist/src/app.js:2:12602513)"
    ]
}
```

23. 
```sh
Error:
Stack:arn:aws:cloudformation:ap-south-1:211125353899:stack/worko-job-app-dev/9312d820-e878-11ef-97a2-020ab519482b is in UPDATE_IN_PROGRESS state and can not be updated.
```

24. 
```sh
ERROR	TypeError: Cannot read properties of undefined (reading 'includes')
```

25. delete response when `id` is wrong
```json
{
    "error": {
        "[Message]": "See error.Message for details.",
        "code": "ResourceNotFoundException",
        "message": "Schedule s does not exist.",
        "requestId": "a161c048-2460-4143-b454-8ad2754736f6",
        "retryDelay": 18.198095140667657,
        "retryable": false,
        "statusCode": 404,
        "time": "2025-05-17T05:27:08.097Z"
    }
}
```

25. 
```ts
/**
 * Tip:1 -> Go to `tsconfig.json` file and check
 */
```
```json
{
  "errorCode": 500,
  "errorMsg": "ENOENT: no such file or directory, scandir '/var/task/dist/src/files-to-be-upload'",
  "timeStamp": "2025-05-13T09:43:05.996Z"
}
```

26. 
```json
{
    "errorCode": 500,
    "errorMsg": "ENOENT: no such file or directory, mkdir '/var/task/dist/src/files-to-be-upload'",
    "timeStamp": "2025-05-14T03:03:05.058Z"
}
```

27. 
```json
{
  "error": {
    "meta": {
      "body": "Too Many Requests",
      "headers": {
        "connection": "keep-alive",
        "content-length": "17",
        "content-type": "text; charset=utf-8",
        "date": "Thu, 15 May 2025 07:42:14 GMT"
      }
    },
    "meta": {
      "aborted": false,
      "attempts": 0,
      "connection": {
        "_openRequests": 0,
        "deadCount": 0,
        "headers": {},
        "id": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/",
        "resurrectTimeout": 0,
        "roles": { "data": true, "ingest": true },
        "status": "alive",
        "url": "https://vpc-worko-xj7suso2dgzou25l2lgpoymbk4.aos.ap-south-1.on.aws/"
      },
      "context": null,
      "name": "opensearch-js"
    }
  }
}
```

28. 
```ts
/**
 * Check account id is correct or wronf
 */
```
```json
{
    "error": {
        "$fault": "client",
        "$metadata": {
            "attempts": 1,
            "httpStatusCode": 403,
            "requestId": "9b45a814-ecec-4799-aaa2-2db8c92f2965",
            "totalRetryDelay": 0
        },
        "name": "AccessDeniedException"
    },
}
```

29. 
```json
{
    "response": {
        "body": "{
            \"message\":\"The provided resource ARN is from a different account.\",\"error\":\"The provided resource ARN is from a different account.\"
        }",
    }
}
```

30. 
```sh
User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-app-scheduler-external-jobs is not authorized to perform: bedrock:CreateModelInvocationJob on resource: arn:aws:bedrock:ap-south-1:211125353899:model-invocation-job/* because no identity-based policy allows the bedrock:CreateModelInvocationJob action
```

31. 
```sh
User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-app-scheduler-external-jobs is not authorized to perform: bedrock:CreateModelInvocationJob on resource: arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0 because no identity-based policy allows the bedrock:CreateModelInvocationJob action
```

32. 
```sh
User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-app-scheduler-external-jobs is not authorized to perform: iam:PassRole on resource: arn:aws:iam::211125353899:role/service-role/worko-batch-inference-role because no identity-based policy allows the iam:PassRole action
```

33. 
```sh
Batch inference is not supported for model arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0 in region ap-south-1
```



34. 
```ts
/**
 * Tip-1: Check whether "NAT Gateway" is exists in aws or not.
 * 
 * 1. How do I troubleshoot an ETIMEDOUT error in my Lambda function?
 *    @see https://repost.aws/knowledge-center/lambda-function-etimedout-error
 * 
 * 2. Enable internet access for VPC-connected Lambda functions
 *    @see https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html
 */
```
```json
{
   "errorType": "Runtime.UnhandledPromiseRejection",
   "errorMessage": "TimeoutError: connect ETIMEDOUT 35.71.100.133:443",
   "reason": {
       "errorType": "TimeoutError",
       "errorMessage": "connect ETIMEDOUT 35.71.100.133:443",
       "code": "ETIMEDOUT",
       "errno": -110,
       "syscall": "connect",
       "address": "35.71.100.133",
       "port": 443,
       "name": "TimeoutError",
       "$metadata": {
           "attempts": 3,
           "totalRetryDelay": 159
       },
       "stack": [
           "Error: connect ETIMEDOUT 35.71.100.133:443",
           "    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16)"
       ]
   },
   "promise": {},
   "stack": [
       "Runtime.UnhandledPromiseRejection: TimeoutError: connect ETIMEDOUT 35.71.100.133:443",
       "    at process.<anonymous> (file:///var/runtime/index.mjs:1294:17)",
       "    at process.emit (node:events:529:35)",
       "    at process.emit (node:domain:489:12)",
       "    at emit (node:internal/process/promises:149:20)",
       "    at processPromiseRejections (node:internal/process/promises:283:27)",
       "    at process.processTicksAndRejections (node:internal/process/task_queues:96:32)"
   ]
}
```

35. 
```ts
/**
 * Update dynamodb GSI3 below in `iamRoleStatements`:-
 * "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI3"
 */
```
```json
{
    "errorCode": 500,
    "errorMsg": "User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: dynamodb:Query on resource: arn:aws:dynamodb:ap-south-1:211125353899:table/worko-job-app/index/GSI3 because no identity-based policy allows the dynamodb:Query action",
    "timeStamp": "2025-07-22T11:30:10.306Z"
}
```

36. 
```ts
/**
 * -> Tip-1: @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-more-masters
 */
```
```json
{
    "errorCode": 500,
    "errorMsg": "security_exception: [security_exception] Reason: no permissions for [indices:data/read/search] and User [name=arn:aws:iam::211125353899:role/worko-job-app-dev-ap-south-1-lambdaRole, backend_roles=[arn:aws:iam::211125353899:role/worko-job-app-dev-ap-south-1-lambdaRole], requestedTenant=null]",
    "timeStamp": "2025-07-05T09:37:10.357Z"
}
```

37. 
```ts
/**
 * Try add in `serverless.ts` file
 */
```
```json
{
    "error": {
        "$fault": "client",
        "$metadata": {
            "attempts": 1,
            "httpStatusCode": 400,
            "requestId": "3dde64c7-fdeb-491c-8b79-35e90f65e146",
            "totalRetryDelay": 0
        },
        "__type": "AccessDeniedException",
        "message": "User: arn:aws:sts::211125353899:assumed-role/worko-job-app-dev-ap-south-1-lambdaRole/worko-job-app-dev-workoJobApp is not authorized to perform: cognito-idp:AdminGetUser on resource: arn:aws:cognito-idp:ap-south-1:211125353899:userpool/ap-south-1_xGreJKkNc because no identity-based policy allows the cognito-idp:AdminGetUser action",
        "name": "AccessDeniedException"
    }
}
```

38. 
```json
{
  "$metadata": {
    "attempts": 3,
    "totalRetryDelay": 179
  },
  "address": "2406:da1a:93d:8500:964c:e200:2421:1de2",
  "code": "ETIMEDOUT",
  "errno": -110,
  "name": "TimeoutError",
  "port": 443,
  "syscall": "connect"
}
```

39. 
```sh
Error: connect ETIMEDOUT 2406:da1a:93d:8500:9dee:a635:da3c:dc24:443
```

40. 
```ts
/**
 * Solution 1:- Force token refresh after group assignment
 */
```
```sh
ERROR	CognitoJwtInvalidGroupError: Missing Cognito group. Expected one of: admin, corporate-admin, corporate-recruiter, evaluator
```

41. 
```json
// in Joi "allow([]) will not be correct syntax
{
    "errorType": "Error",
    "errorMessage": "Method no longer accepts array arguments: allow",
    "stack": [
        "Error: Method no longer accepts array arguments: allow",
        "    at new module.exports (/var/task/dist/src/app.js:35628:19)",
        "    at module.exports (/var/task/dist/src/app.js:35087:11)",
        "    at exports.verifyFlat (/var/task/dist/src/app.js:143294:9)",
        "    at internals.Base.allow (/var/task/dist/src/app.js:141924:16)",
        "    at 54109 (/var/task/dist/src/app.js:201830:79)",
        "    at __webpack_require__ (/var/task/dist/src/app.js:224075:42)",
        "    at 57907 (/var/task/dist/src/app.js:189757:47)",
        "    at __webpack_require__ (/var/task/dist/src/app.js:224075:42)",
        "    at 31841 (/var/task/dist/src/app.js:199789:67)",
        "    at __webpack_require__ (/var/task/dist/src/app.js:224075:42)"
    ]
}
```

42. 
```sh
Duration: 900000.00 ms	Billed Duration: 900000 ms	Memory Size: 1024 MB	Max Memory Used: 392 MB	Status: timeout
```

43. 
```ts
/**
 * 1. Whenever I add "APP_GCP_PRIVATE_KEY" environment variable for `worko-job-app-dev-workoJobApp` lambda function Im getting below error
 * 2. But in `worko-corp-dev-workoCorp` lambda I didn't recieved this error when i add same "APP_GCP_PRIVATE_KEY"
 */
```
```sh
Request must be smaller than 5120 bytes for the UpdateFunctionConfiguration operation
```


44. 
```json
{
  "errorMessage": "Response payload size exceeded maximum allowed payload size (6291556 bytes).",
  "errorType": "Function.ResponseSizeTooLarge"
}
```