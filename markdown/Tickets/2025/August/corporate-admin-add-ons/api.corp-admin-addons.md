
1. `Grade level` attribute while creating job
   [POST] `https://jobs.dev.worko.work/job`
   ```json
   // Request body
   {
      // ...
      "gradeLevel": 2
      // ...
   }
   ```

2. `Grade level` attribute while updating job
   [PUT] `https://jobs.dev.worko.work/job`
   ```json
   // Request body
   {
      // ...
      "gradeLevel": 2
      // ...
   }
   ```

3. While searching job by title in `applicants` page of `corporate` and `admin` dashboard:
   [GET] `https://jobs.dev.worko.work/job?includeCompanyDetails=false`

4. `salary range` attribute while creating job
   [POST] `https://jobs.dev.worko.work/job`
   ```json
   // Request body
   {
      // ...
      "salaryRange": {
         "min": 8,
         "max": 10,
         "fixedComponentPercentage": 90,
         "variableComponentPercentage": 10,
      }
      // ...
   }
   ```
5. `salary range` attribute while updating job
   [PUT] `https://jobs.dev.worko.work/job`
   ```json
   // Request body
   {
      // ...
      "salaryRange": {
         "min": 8,
         "max": 10,
         "fixedComponentPercentage": 90,
         "variableComponentPercentage": 10,
      }
      // ...
   }
   ```

6. While listing jobs in `corporate` or `admin` dashboards, if you click dropdown then to show `Created By` column, In job object if it contains `createdByCorporateUserId` then call  
   [GET] `https://api.dev.worko.work/corporate-user/:createdByCorporateUserId`

7. While listing jobs in `corporate` or `admin` dashboards, if you click dropdown then to show `Created By` column, In job object if it contains  `createdByUserId` then call 
   [GET] `https://api.dev.worko.work/user/:createdByUserId/detail`

8. Bulk jd create api
   [POST] `https://api.dev.worko.work/corporate-bulk-jd/`
   ```json
   {
      "companyId": "01JWAQF1G96E0SE9XHXSFGHNWW",
      "jobDescription":"...",
      "jobTitle": "Full Stack Engineer (Node.js + React)",
      "jobLocation": "jl",
      "experienceRange": { "min": 0, "max": 1 },
      "mustHaveSkills": [
         "JavaScript",
         "Node.js",
         "React",
         "Full Stack Development"
      ],
      "mustNotHaveSkills": [],
      "goodToHaveSkills": ["uvjl"],
      "coreSkills": ["core1", "core2"],
      "softSkills": ["core1", "core2"],
      "technicalSkills": ["core1", "core2"],
      "industryPreferences": ["core1", "core2"]
   }
   ```