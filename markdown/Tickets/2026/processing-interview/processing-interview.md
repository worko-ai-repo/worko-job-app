
# High level timeline
1. listing the only `PROCESSING_INTERVIEW` job application status api - `1` day
2. schedule interview button flow
   1. schedule interview round -> requires database design in `aws dynamodb Job application model` - `1.5` days
      1. add evaluator and send email to evaluator
         1. list interview scehdules to evaluator
   3. Google calender schedule automation - `5` days because its a `R & D` task 
      1. create schedule
      2. update schedule
      3. we have multiple accounts
      4. we need good authentication for multiple accounts
3. view history button flow 
   1. list the interview schedules - `1` day
      1. reschedule interview
         1. if evaluator is present then we need to do bulk update schedule -> `1.5` days
         2. cancel or update existing google calender schedule - `1.5` days
      2. cancelling interview
         1. if evaluator is present then we need to do bulk update schedule
         2. cancel or update existing google calender schedule - `1.5` days
