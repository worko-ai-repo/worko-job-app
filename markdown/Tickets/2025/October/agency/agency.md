
# Admin Dashboard
## Pages
   1. My database
      1. List of all the user appl profiles (it may from `Referral`, `Internal`, `Agency`, `Worko`) with below column names:
         1. Candidate name
         2. Email id
         3. Contact no
         4. Current designation
         5. Applied company
         6. Current CTC
         7. Expected CTC
         8. Notice period
         9. Current location
         10. Added by
         11. Added for
         12. Cooling period companies
         13. Last active
         14. YOE
         15. CV
         16. Action:
            1. Edit profile button:
               1. when `Edit profile button` is clicked below input form will be open:
                  1. Candidate name
                  2. Candidate email
                  3. Candidate contact no
                  4. Current company
                  5. Current designation
                  6. Total YOE
                  7. Current CTC
                  8. Expected CTC
                  9. Location
                  10. Notice period
                  11. Cooling period companies
                  12. CV

   2. Agency 
      1. List of all the assigned job applications by all the agencies(assigned by all corporates) for all the companies with below columns:
         1. Job profile
         2. Agency name
         3. Date submitted
         4. Applicant name
         5. Email id
         6. Phone number
         7. Current company
         8. Current designation
         9. Total YOE
         10. Relevant YOE
         11. Current CTC
         12. Expected CTC
         13. Notice period
         14. Location
         15. Ready to relocate
         16. Any comment
         17. CV 
         18. Worko score:
            1. Find matching score button
         19. Action -> `worko admin` should not perform any actions, `worko admin` can only have `view only access`
         20. Current status
   3. Agency List
      1. Worko admin cannot add or invite `agency`
      2. The list of all corporate invited and registered agencies with below column names:
         1. Agency name
         2. Email id
         3. Contact person name
         4. Ph no
         5. Date activated
         6. Assigned jobs
         7. Total candidate submitted
         8. Total rejected
         9. Total hired
         10. Action -> `Should we allow worko admin to perform actions on job appl profiles ??`
         11. GSTIN No
         12. Contract copy


# Corporate Dashboard
## Pages
   1. My database:
      1. List of all the user appl profiles (it may from `Referral`, `Internal`, `Agency`, `Worko`)
      by the `corporate loggedin` company with below column names:
         1. Referred by
         2. Referee type
         3. Date
         4. Profile name
         5. Candidate name
         6. Current company
         7. Current designation
         8. Current CTC
         9. Expected CTC
         10. Notice period
         11. Location comfortable with
         12. Remark
         13. CV 
         14. Action:
            1. Edit profile button:
               1. when `Edit profile button` is clicked below input form will be open:
                  1. Candidate name
                  2. Candidate email
                  3. Candidate contact no
                  4. Current company
                  5. Current designation
                  6. Total YOE
                  7. Current CTC
                  8. Expected CTC
                  9. Location
                  10. Notice period
                  11. Referred by/Added by
                  12. CV
   2. Agency 
      1. List of all assigned job applications by agencies(only assigned by corporate) for the loggedin corporate company by below column names:
         1. Job profile
         2. Agency name
         3. Date submitted
         4. Applicant name
         5. Email id
         6. Phone number
         7. Current company
         8. Current designation
         9. Total YOE
         10. Relevant YOE
         11. Current CTC
         12. Expected CTC
         13. Notice period
         14. Location
         15. Ready to relocate
         16. Any comment
         17. CV 
         18. Worko score:
            1. Find matching score button
         19. Action:
            1. Accept & move to application button
            2. Reject button
            3. Accept & Send for evaluation button
         20. Current status
   3. Agency List Page
      1. `Add agency` button:
         1. When `Add agency` button is clicked below input form will open:
            1. Agency name
            2. Agency email
               1. This can be any valid email(not restricted to enter `company email`)
            3. Contact person name 
            4. Contact number
            5. GSTIN -> `requirement doubt`
            6. Contract copy -> `requirement doubt`
               1. upload to `s3` by designing the path
            7. `Invite` button:
      2. The `Corporate` invited list of `agencies` with below column names:
         1. Agency name
         2. Email id
         3. Contact person name
         4. Assigned jobs
         5. Total candidate submitted
         6. Total rejected
         7. Total hired
         8. Action:
            1. Assign jobs button:
               1. First show the list of jobs according to the `corporate` role and his company id
            2. Remove jobs button
            3. Edit button
            4. Pause button
            5. Delete button
         9. GSTIN No
         10. Contract copy




# Agency Dashboard
## Notes:
   1. same email id which has been used for agency cannot be used in any other dashboard
   2.  there is mis information in figma while login we will not ask company name but while register we will ask its vice versa in figma
## Signup
   1. `Corporate` will send invite request to a person via email to signup and access `agency` dashboard 
      1. After person clicks the email he recieved below input form will be open
         1. Full name
         2. Contact number
         3. Email
         4. Password
         5. Confirm Password
         6. Enter Otp
         7. Signup
## Login
   1. Email Id
   2. Agency name
   3. Password
## Pages
   1. Invites
      1. List of invites recieved from different `companies` and different `corporates` with below column names:
         1. Company name
         2. Sender name(HR)
         3. Date
         4. Action / Current status
   2. Jobs 
      1. List of different `Company Jobs` assigned by different `corporates` with below column names:
         1. Company name
         2. Profile -> `jobTitle`
         3. YOE range
         4. Salary range
         5. Location
         6. Notice period
         7. Date assigned
         8. `Upload profile` button -> `Upload candidate cv`
            1. Check `duplicate profile`
            2. If its not a `duplicate profile` open below input form:
               1. Candidate name
               2. Candidate email
               3. Candidate contact number
               4. Current company
               5. Current designation
               6. Total YOE
               7. Relevant YOE
               8. Current CTC
               9. Expected CTC
               10. location
               11. Ready to relocate
               12. Notice period: Negotiable checkbox
               13. CV
               14. Any comments
         9. Candidates uploaded -> `count of candidate profiles/cvs which is uploaded by agency`
         10. Candidates rejected -> `count of rejected job application status`
         11. Candidates in-process -> `count of other than rejected job application status`
   3. Applicants
      1. List of User job application profiles assigned by individual `agency` with below column names:
         1. Company name
         2. Job profile
         3. Date submitted
         4. Applicant name
         5. Email Id
         6. Contact number
         7. Current company
         8. Current designation
         9. Total YOE
         10. Relevant YOE
         11. Current CTC
         12. Expected CTC
         13. Notice period
         14. Location
         15. Ready to relocate
         16. Any comment 
         17. CV
         18. Current status
   4. Bulk cv check
      1. As of now implement the way it is implemented in `corporate` dashboard
   5. Recharge
      1. Integrate razorpay payment gateway
      2. `15 RS / CV`
