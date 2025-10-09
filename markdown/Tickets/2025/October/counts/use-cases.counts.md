
# Dashboards
## Admin dashboard
### Candidates
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for all the `candidates`
      2. Rejected
         1. Count of total `REJECTED` job applications for all the `candidates`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for all the `candidates`
      4. New Applicants
         1. Count of only `APPLIED` job applications for all the `candidates`
      5. Hired
         1. Count of only `HIRED` job applications for all the `candidates`
   2. Count columns while listing registered candidates:
      1. Job applied
         1. Count of only `APPLIED` job applications of specific `candidate`
      2. Referral applied
         1. Count of only `AWAITING` referral requests of specific `candidate`
### Employees
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for all the `employees`
      2. Rejected
         1. Count of total `REJECTED` job applications for all the `employees`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for all the `employees`
      4. New Applicants
         1. Count of only `APPLIED` job applications for all the `employees`
      5. Hired
         1. Count of only `HIRED` job applications for all the `employees`
   2. Count columns while listing registered employees:
      1. Referral request pending
         1. Count of only `AWAITING` referral requests recieved for this specific `employee`
   3. Count attribute in `View details drop down` in each registered employees:
      1. Referral request accepted
         1. Count of only `ACCEPTED` referral requests for this specific `employee`
### Jobs
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for all the `company jobs`
      2. Rejected
         1. Count of total `REJECTED` job applications for all the `company jobs`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for all the `company jobs`
      4. New Applicants
         1. Count of only `APPLIED` job applications for all the `company jobs`
      5. Hired
         1. Count of only `HIRED` job applications for all the `company jobs`
   2. Count columns while listing company jobs
      1. Total applications
         1. Count of total job applications(except `REJECTED` job application status) for this specific `company job`
      2. Pending
         1. Count of only `APPLIED` job applications for this specific `company job`
### Applicants
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for choosen single `company job`
      2. Rejected
         1. Count of total `REJECTED` job applications for choosen single `company job`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for choosen single `company job`
      4. New Applicants
         1. Count of only `APPLIED` job applications for choosen single `company job`
      5. Hired
         1. Count of only `HIRED` job applications for choosen single `company job`
### All Applicants
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for all the `company jobs`
      2. Rejected
         1. Count of total `REJECTED` job applications for all the `company jobs`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for all the `company jobs`
      4. New Applicants
         1. Count of only `APPLIED` job applications for all the `company jobs`
      5. Hired
         1. Count of only `HIRED` job applications for all the `company jobs`
### Referral
   1. Counts header:
      1. Total referee
      2. Pending referrals
         1. Count of all `AWAITING` referral requests
      3. Accepted referrals
         1. Count of all `ACCEPTED` referral requests
      4. Hired referrals
         1. Count of all `DONE` referral requests
      5. Rejected referrals
         1. Count of all `REJECTED` referral requests
### Refer & Earn
   1. Counts header: 
      1. Total referrals
         1. 
      2. Pending
         1. Count of `PENDING` refer and earn job application
      3. Applied
         1. Count of `APPLIED` refer and earn job application
      4. Hired
         1. Count of `HIRED` refer and earn job application
      5. Rejected/Cancelled
         1. Count of `REJECTED` refer and earn job application




## Corporate dashboard
### Jobs
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for all the `jobs`
         by corporate loggedin `company`
      2. Rejected
         1. Count of total `REJECTED` job applications for all the `jobs`
         by corporate loggedin `company`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for all the `jobs`
         by corporate loggedin `company`
      4. New Applicants
         1. Count of only `APPLIED` job applications for all the `jobs`
         by corporate loggedin `company`
      5. Hired
         1. Count of only `HIRED` job applications for all the `jobs`
         by corporate loggedin `company`
   2. Count columns while listing company jobs
      1. Total applications
         1. Count of total job applications(except `REJECTED` job application status) for this specific `company job`
      2. Pending
         1. Count of only `APPLIED` job applications for this specific `company job`
### Applicants
   1. Counts header:
      1. Total applicants
         1. Count of total job applications(except `REJECTED` job application status) for choosen single `company job`
      2. Rejected
         1. Count of total `REJECTED` job applications for choosen single `company job`
      3. Interviewed
         1. Count of only `PROCESSING_INTERVIEW` job applications for choosen single `company job`
      4. New Applicants
         1. Count of only `APPLIED` job applications for choosen single `company job`
      5. Hired
         1. Count of only `HIRED` job applications for choosen single `company job`



## Candidate dashboard
### Jobs
   1. Counts header:
      1. Total Applicantions
         1. Count of total job applications(except `REJECTED` job application status) for by registered `candidate email`
      2. Pending
         1. Count of `APPLIED` job applications by registered `candidate email`
      3. Under evaluation
         1. Count of `UNDER_EVALUATION` job applications by registered `candidate email`
      4. In process
         1. Count between `HIRING_IN_PROCESS` and `HIRED`(Not included) job applications by registered `candidate email`
      5. Hired
         1. Count of `HIRED` job applications by registered `candidate email`
      6. Rejected/Cancelled
         1. Count of `REJECTED` job applications by registered `candidate email`
### Referral
   1. Counts header:
      1. Total referrals
         1. Count of all referral requests(except `REJECTED`) by registered `candidate email`
      2. Accepted
         1. Count of all `ACCEPTED` referral requests by registered `candidate email`
      3. Pending
         1. Count of all `AWAITING` referral requests by registered `candidate email`
      4. Rejected
         1. Count of all `REJECTED` referral requests by registered `candidate email`
### Refer And Earn
   1. Counts header: 
      1. Total referrals
         1. 
      2. Pending
         1. Count of `PENDING` refer and earn job application by registered `candidate email`
      3. Applied
         1. Count of `APPLIED` refer and earn job application by registered `candidate email`
      4. Hired
         1. Count of `HIRED` refer and earn job application by registered `candidate email`
      5. Rejected/Cancelled
         1. Count of `REJECTED` refer and earn job application by registered `candidate email`




## Employee dashboard
### Referral
   1. Counts header:
      1. Total referrals
         1. Count of all referral requests(except `REJECTED`) by registered `employee email`
      2. Accepted
         1. Count of all `ACCEPTED` referral requests by registered `employee email`
      3. Pending
         1. Count of all `AWAITING` referral requests by registered `employee email`
      4. Rejected
         1. Count of all `REJECTED` referral requests by registered `employee email`
### Refer And Earn
   1. Counts header: 
      1. Total referrals
         1. 
      2. Pending
         1. Count of `PENDING` refer and earn job application by registered `employee email`
      3. Applied
         1. Count of `APPLIED` refer and earn job application by registered `employee email`
      4. Hired
         1. Count of `HIRED` refer and earn job application by registered `employee email`
      5. Rejected/Cancelled
         1. Count of `REJECTED` refer and earn job application by registered `employee email`


