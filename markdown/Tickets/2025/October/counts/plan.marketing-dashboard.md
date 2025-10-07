
```ts
/**
 * @see https://workoai-my.sharepoint.com/:x:/g/personal/sarvesh_singh_worko_ai/EbydPHsCFQ9KgssUcE1ukkABdIBYhkX3enV3CkcZLyO0XA?e=xXqFaQ
 */

 /**
  * 
  * @see https://www.figma.com/design/zU0XhW4uCO3MVgVwxm5cx2/Worko-Dashboards-file?node-id=0-1&p=f
  */
```

# Dynamodb Design Test cases:
1. Should be cost efficient
2. Should be flexible when we try to add new atttibutes 
3. Should satisfies current access patterns
4. Should be flexible to satisfy future new access patterns

# Backend Repositories:
   1. worko-api
   2. worko-job-app
   3. worko-dashboard-api
   4. worko-chat-app

# Existing main apis and models:
   1. From `worko-api` repository:
      1. User Referral
      2. User Guidance
   2. From `worko-job-app` repository:
      1. User Job Applications
      2. User External Job Applications
      3. User Refer & Earn

# Models to be implemented in new `worko-dashboard-api` repository:
   1. Already Existing models:
      1. From `worko-api` repository:
         1. User Referral
         2. User Guidance
      2. From `worko-job-app` repository:
         1. User Job Applications
         2. User External Job Applications
         3. User Refer & Earn
   2. New Dashboard models:

# New Dashboard Models to be implemented in below repositories:
   1. worko-api
   2. worko-job-app
   3. worko-dashboard-api

# High level flow:
   1. In `worko-dashboard-api`:
      1. Write a one time script to store the marketing dashboard data in to `dashboard` related newly designed tables.
   2. From next time we need to track each entity and update `dashboard` related newly designed tables


# User Job Applications Marketing Dashboard Sample UI Presentation:
   User name     | Email        | phone number | signup date | Profile Completion | CV Uploaded | Last Login date | 7 days frequency | Job applied in 7 days
   rohith appala | ro@gmail.com | 9666308100   | 29-10-2024  | yes                | yes         | 30-10-2024      | 30               | 1

