
# Requirement
1. bulk cvs:
   1. 1000cvs:
      1. we will trigger `1000` lambdas for each cv
         1. if one `cv` fails we will keep that `cv` in `aws sqs` and delay for `certain time` and perform again
2. I want to send a single file with list of `duplicate` candidates details and single file with list of failed candidate details
3. once all the `1000` cvs processed, we need to show a popup in `react ui` with `success`, `failed` and `duplicate` count out of `1000` cvs

# Existing feature
1. bulk cvs:
   1. 1000cvs:
      1. we will trigger `1000` lambdas for each cv
         1. if one `cv` fails we will keep that `cv` in `aws sqs` and delay for `certain time` and perform again

# Extending above `bulk cvs` feature
2. worko-bulk-cvs-track-dev/duplicate-candidate/{date}/{randomId}/corporate-user/{corporateOrWorkoAdminRegisteredUserId}/duplicate-file
   ```sh
   # store list of duplicate cv parsed candidates
   name: candidate name
   email: candidate email
   phone number: candidate phone number
   ```
3. worko-bulk-cvs-track-dev/failed-candidate/{date}/{randomId}/corporate-user/{corporateOrWorkoAdminRegisteredUserId}/failed-file
   ```sh
   # store list of failed cv parsed candidates
   name: candidate name
   email: candidate email
   phone number: candidate phone number
   ```

# Amazon Q approach:-
1000cvs:-> single document with `id` attribute->  `batchBulkCvs` for `1000`-> 
   `totalCvs`: `1000`
   `countOfProcessedCvs`:`1000`
   `eachBulkCvsTrack`
      1st lambda cv: create document in firestore with `batchBulkCvsId`: `string`, statuse: `SUCCESS`
      2nd lambda cv: create document in firestore with `batchBulkCvsId`: `string`, status: `DUPLICATE`
      3rd lambda cv: create document in firestore with `batchBulkCvsId`: `string`, statuse: `FAILED`
      4th lambda cv: create document in firestore with `batchBulkCvsId`: `string`, statuse: `SUCCESS`

      ..
      1000th lambda 
         1. in this `1000th` lambda you need to `retrieve` all the data from `eachBulkCvsTrack` with status as `success` and store it in `csv` file
         and next you will retrieve
