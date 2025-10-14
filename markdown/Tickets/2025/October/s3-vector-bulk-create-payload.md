
```sh
# Invoke Lambda function name on "PRODUCTION"
"worko-vector-store-job-crud-prod"
```
```sh
# Invoke Lambda function name on "DEV"
"worko-s3-vector-job-ingestion"
```

```sh
# Lambda Invocation Type:
"RequestResponse" # For the `RequestResponse` invocation type, this status code is 200.
```

```ts
// Invoke Lambda Payload For Bulk Create Jobs
{
  jobData: [
      {
        /**
         * On Production:- "worko-job-index-prod"
         * On Dev:- "worko-s3-jobs-index"
         */
         _index: string;

         /**
          * `id` attribute of `Job` record
          */
         _id: string;

         _source: {
            jobTitle: "node dev",
            location: {
               city?: string[]; // ["Bangalore"]
               state?: string[]; // ["Karnataka"]
               country?: string[]; // ["India"]
               fullLocation?: string[]; // ["Bangalore, Karnataka, India"]
            },
            department: "devops",
            salaryRange: {
               min?: number;
               max?: number;
               fixedComponentPercentage?: number;
               variableComponentPercentage?: number;
            },
            experienceRange: {
               min?: number;
               max?: number;
            },
            status: "PUBLISHED",
            otherRequirements: "...",
            coreSkills: ["nodejs", "express"],
            technicalSkills: ["ts","js"],
            miscellaneousSkills:["devops"],
         };
      }
  ];
  /**
   * On Production:- "worko-job-index-prod"
   * On Dev:- "worko-s3-jobs-index"
   */
  indexName: string;
}
```


```ts
// Invoke Lambda Response For Bulk Create Jobs
{
  /**
   * @example "Direct job data ingestion completed",
   */
  message: string;
  results: {
    /**
     * @example 1
     */
    success: number;

    /**
     * @example 0
     */
    failed: number;
  };

  vectorBucketName: string;

  indexName: string;
}
```