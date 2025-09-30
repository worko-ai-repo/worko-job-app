
# `HIRING_IN_PROCESSS` to `DOCUMENT_SUBMITTED` Job Application Statuses
   1. HIRING_IN_PROCESSS
   2. DOCUMENT_REQUESTED
   3. DOCUMENT_SUBMITTED

# Api calls Order:
1. Corporate Requests for a document for a single job application
2. Whenever candidate upload each and every document and clicked `Submit` button
3. Upload all the documents to `s3` using `Pre-signed urls`
4. Update user job application `status` to `DOCUMENT_SUBMITTED` by `candidate`
5. Get list of `Pre Signed Urls To View Documents`

# High level flow:
   ## Corporate Dashboard
   1. If `Hire` button is clicked, make `status` to `HIRING_IN_PROCESSS`:
      1. `Request document` button will be visible
         1. Whenever `Request document` button is clicked:
            1. A `Request for document` popup will be opened 
               1. `Add document` button:
                  1. `Corporate` will add the names of `documents` which he is requesting with max limit of `15`
                     1. `Request` button(document request by corporate to candidate)
                        1. Whenever `Request` button is clicked then `status` will be changed from `HIRING_IN_PROCESSS` to `DOCUMENT_REQUESTED`
                           1. Whenever the `status` is `DOCUMENT_REQUESTED` then `Request document` button will not be shown to corporate again
   ## Candidate Dashboard
   1. Whenever the `status` is `DOCUMENT_REQUESTED` then `Submit document` button will be visible
      1. `Submit document` button clicked: 
         1. `Upload document` popup will be open with below details:
            1. `document requested on` date
            2. All the names of documents list:
               1. whenever candidate upload each and every document then `Submit` button will be enabled
                  1. `Submit` button(document submitted by candidate to corporate)
                     1. Whenever `Submit` button is clicked then `status` will be changed from `DOCUMENT_REQUESTED` to `DOCUMENT_SUBMITTED`
                        1. Whenever `status` is `DOCUMENT_SUBMITTED` then there will be no action button shown to `candidate`
   ## Corporate Dashboard
   1. Whenever `status` is `DOCUMENT_SUBMITTED` then `View document` button will be visible 
      1. `View document` button clicked:
         1. `View document` popup will be opened with below details:
            1. `document requested on` date
            2. `document submitted on` date
            3. List of submitted documents
               1. `Document-A` with `re-request document button`
               1. `Document-B` with `re-request document button`:
                  1. If `Document-B` is `re-requested`:
                     1. Then status will change from `DOCUMENT_SUBMITTED` to `DOCUMENT_REVISION_REQUESTED`
            4. `+ request more document` button will be visible:
               1. `Corporate` will add the names of `documents` which he is requesting with remaining limit

   ## Candidate Dashboard:
   1. Whenever status is `DOCUMENT_REVISION_REQUESTED` then frontend should show `Submit document` button
      1. `Submit document` button clicked: 
         1. `Upload document` popup will be open with below details:
            1. `document requested on` date
            2. All the names of documents list:
               1. The document names which are in `red` colour those are `re-requested` by `corporate` 
                  1. whenever candidate upload each and every `re-requested document` then `Submit` button will be enabled
                     1. `Submit` button(document submitted by candidate to corporate)
                        1. Whenever `Submit` button is clicked then `status` will be changed from `DOCUMENT_REVISION_REQUESTED` to `DOCUMENT_REVISION_REQUEST_SUBMITTED`
                           1. Whenever `status` is `DOCUMENT_REVISION_REQUEST_SUBMITTED` then there will be no action button shown to `candidate`
