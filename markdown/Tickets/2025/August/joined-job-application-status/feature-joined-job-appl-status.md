
# Production checklist

# Api order flow

# Pending

# Requirement
   1. If corporate-admin/recruiter or worko-admin clicks `joined` button:
      1. A popup with below input fields will be open:
         1. `Joining date`
         2. `Submit` button:
            1. Whenever submit button is clicked the status will be changed from 
            `HIRED` to `JOINED` in both `candidate` and `corporate` dashboards and in
            `candidate` dashboard we should not show `I have joined` button again

   2. If candidate clicks `I have joined` button:
      1. A joining form popup will be open with below input details:
         1. `Joining date`
         2. `HR name`
         3. `Message` -> `Any message candidate want to write` 
         4. `Submit` button
