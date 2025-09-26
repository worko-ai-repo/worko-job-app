
# Production checklist:
1. 

# `DOCUMENT_VERIFIED` to `HIRED` Job Application Statuses Order
1. DOCUMENT_VERIFIED
2. OFFER_SENT
3. HIRED

# Authorization checklist:
1. 

# Api calls Order:
1. Whenever `Verified & approve` button is clicked, then status will change from `DOCUMENT_SUBMITTED` to `DOCUMENT_VERIFIED`
2. Offer letter upload to `s3`
3. Using those `pre-signed urls` upload to s3
4. After successfull upload to `s3` update job application status from `DOCUMENT_VERIFIED` to `OFFER_SENT`
5. Generate `Pre Signed Urls To View Documents`
6. Update job application status will be changed from `OFFER_SENT` to `HIRED`  when `Accept` button is clicked

# Pending
1. Testing from frontend `corporate` and `candidate`
2. Ask Email Templates
3. Testing from backend
4. Implement Authorization
5. Testing Authorization

# High level plan
   1. Whenever `status` is `DOCUMENT_SUBMITTED` then `View document` button will be visible 
      1. `View document` button clicked:
         1. `View document` popup will be opened with below details:
            1. `document requested on` date
            2. `document submitted on` date
            3. List of submitted documents
               1. Whenever each and every document is marked as `Verified` in `UI` then `Verified & approve` button will be enabled
                  1. If `Verified & approve` button is clicked:
                     1. Then status will change from `DOCUMENT_SUBMITTED` to `DOCUMENT_VERIFIED`
                        1. Whenever status is `DOCUMENT_VERIFIED` then `Hire now` button will be visible
                           1. If `Hire now` button is clicked:
                              1. A popup with below details will be opened: 
                                 1. Job title -> `Auto Populated`
                                 2. Work mode -> `Auto Populated`
                                 3. Location -> `Auto Populated`
                                 4. Department -> `Auto Populated`
                                 5. CTC -> `Auto Populated`
                                 6. Attach offer letter -> `Not Auto Populated`,`Optional`, need to upload by corporate or worko-admin
                                 7. Remarks -> `Not Auto Populated`,`Optional`, need to write by corporate or worko-admin
                                 8. `Send` Button:
                                    1. Then the status will change from `DOCUMENT_VERIFIED` to `OFFER_SENT`

   ## Candidate Dashboard:
   1. Whenever the status is `OFFER_SENT` then it will shown as `Offer letter recieved` in the `status` column in UI
      1. Whenever the `status` column contains `Offer letter recieved` then `Action` button will be shown as:
         1. If `Offer letter attached` by `corporate or worko-admin` then: 
            1. `Check & accept` button will be visible:
               1. If `Check & accept` button is clicked:
                  1. A popup with below details will be opened: 
                     1. Showing offer letter with download button
                     2. `Accept` button:
                        1. If `Accept` button clicked:
                           1. Then the status will be changed from `OFFER_SENT` to `HIRED` 
                              1. Whenever the status is `HIRED` then `I have joined` button will be shown and in `UI` the status column will show with `Offer accepted/Hired` text
                     3. `Raise issue` button:
                        1. Whenever the `candidate` clicks on `raise issue` button then he will enter the issue in detailed manner and submit 
         2. If `Offer letter didn't attached` by `corporate or worko-admin` then:
            1. `Accept` button will be visible
               1. If `Accept` button is clicked:
                     1. Then the status will be changed from `OFFER_SENT` to `HIRED` 
                        1. Whenever the status is `HIRED` then `I have joined` button will be shown

   ## Corporate Dashboard:
      1. Whenever the status is `HIRED` then `joined` button will be visible
      2. Whenever the status is still `OFFER_SENT` check whether the candidate `raised issue` or not
         1. If raised the `View issue` button will be visible in `Action` button:
            1. Whenever `View issue` button is clicked then whatever issue written by candidate for offer letter will be shown and the `corporate` or `worko-admin` will see below input fields:
               1. View Offer letter
               2. Attach New Offer letter -> `Optional`
               3. Remarks
               4. `Re-Send` button:
                  1. Whenever the `Re-Send` button is clicked the status will be changed from `OFFER_SENT` to 
                  `REVISED_OFFER_SENT`
