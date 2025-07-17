

# Requirement
   ## Worko admin:
   1. `worko-admin` will recieve every job application regardless of matching score
      1. If the matching score is less than `70` then show `send to recruiter` button
      2. If the matching score is between `70`(included) and `89`(included) then don't show `send to recruiter` button 
      3. If the matching score is greater than or equal to `90` then show `send to recruiter` button
         1. Only `worko-admin` can reject it before sending it to recruiter
   
   ## Corporate-admin/recruiter
      ### Listing
      1. If the matching score is less than `70` then don't list
         1. If the `displayToCorporate` is sets to `true` then list it
      2. If the matching score is between `70`(included) and `89`(included) then list
      3. If the matching score is greater than or equal to `90` then don't list
         1. If the `displayToCorporate` is sets to `true` then list it
