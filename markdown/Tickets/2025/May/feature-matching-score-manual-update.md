
# Prod checklist:
1. Copy and paste `worko-auth` lambda

# Test cases
1. authorization: only worko-admin should able to use the api
2. Joi validation of api:
  1. only accepts `true` value

# Api
1. [PATCH] `/job-application/:id/display-to-corporate`
  ```json
  // Request Payload
  {
    "displayToCorporate": true
  }
  ```
  ## Api functionality:
  1. Do joi validation
  2. Retrieve the job application by id
  3. Check whether the job application is already updated by using retrieved job application
    ```ts
    if(existingJobApplicationDetails.displayToCorporate === jobApplicationRequestBody.displayToCorporate){
      throw new BaseError("The Job Application already updated.", HttpStatusCode.BAD_REQUEST_400);
    }
    ```
  4. Check whether `rejectionAwsScheduleId` is present or not
    1. If present:
      1. Retrieve the schedule job details by `rejectionAwsScheduleId` from `ScheduleJob.model.ts`:
        1. validate the `status` attribute in `ScheduleJob.model.ts`:
          1. If `status===COMPLETED`:
            1. Throw error by saying `Your time is up to send to recruiter`
          2. If `status!==COMPLETED`:
            1. `delete` that:
              1. If deleting success
                1. Update the job application with `displayToCorporate` to `true`
                  1. If successfully updated then:
                    1. send emails to corporates 
                    2. return the updated job application as response
                  2. If failed to update then: 
                    1. global logger
                    2. send emails to corporates 
                    3. return the updated job application as response
    2. If not present
      1. Update the job application with `displayToCorporate` to `true`
        1. If successfully updated then:
          1. send emails to corporates 
          2. return the updated job application as response
        2. If failed to update then: 
          1. throw error 

# Store rejection schedule details against job application
1. Update `id` attribute of `ScheduleJob.model.ts` in `rejectionAwsScheduleId` attribute present in `UserJobApplication.model.ts`

# High level plan for frontend:
  1. First user will apply a job
    1. For Low matching score job application
      1. we will schedule 24 hours delay to reject the job application
        1. This low matching score job application will be listed to worko admin
          1. if [status==="APPLIED"] and [matchingScore<70] and [rejectionFeedbackBySystem!==""] and [rejectionFeedbackBySystem!==undefined]
            then the job application is Before 24 hours:
            1. `Send to recruiter` button should be enable to `worko-admin`:
              1. If `worko-admin` clicks on `Send to recruiter` button then call below api:
                [PATCH] `/job-application/:id/display-to-corporate`
                  1. Then This low matching score job application should not list to `corporate-admin/recruiter`
          2. if [status!=="APPLIED"]:
            1. `Send to recruiter` button should not shown to `worko-admin`:

# display to corporate listing scenario:
  ```ts
  const jobListingDataInDynamodb = [
    {
        "displayToCorporate": true,
        "rejectionFeedbackBySystem": "something",
        "matchingScore": 60
    },
    {
        "rejectionFeedbackBySystem": "something present",
        "matchingScore": 65
    },
    {
        "displayToCorporate": undefined,
        "rejectionFeedbackBySystem": "their",
        "matchingScore": 68
    },
    {
        "displayToCorporate": undefined,
        "matchingScore": 76,
        "rejectionFeedbackBySystem": ""
    },
    {
        "displayToCorporate": undefined,
        "matchingScore": 79,
        "rejectionFeedbackBySystem":""
    },
    {
        "displayToCorporate": true,
        "rejectionFeedbackBySystem": "something",
        "matchingScore": 65
    },
  ]
  ```

  ```ts
  query = query.and().parenthesis((condition: Condition) => {
    return condition
        .where("displayToCorporate")
        .eq(true)
        .or()
        .parenthesis((inner: Condition) => {
        return inner
          .where("rejectionFeedbackBySystem")
          .eq("")
          .where("matchingScore")
          .ge(
              APP_CONSTANTS.MATCHING_SCORES
              .JOB_APPLICATION_MINIMUM_MATCHING_SCORE
          );
        });
  });
  ```

  ```ts
  const result = [
    {
        "displayToCorporate": true,
        "rejectionFeedbackBySystem": "something",
        "matchingScore": 60
    },
    {
        "displayToCorporate": undefined,
        "matchingScore": 76,
        "rejectionFeedbackBySystem": ""
    },
    {
        "displayToCorporate": undefined,
        "matchingScore": 79,
        "rejectionFeedbackBySystem":""
    },
    {
        "displayToCorporate": true,
        "rejectionFeedbackBySystem": "something",
        "matchingScore": 65
    },
  ]
  ```