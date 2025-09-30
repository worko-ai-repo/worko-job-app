
# Shared single job url s3 vector integration
1. [GET] `https://jobs.dev.worko.work/job/:jobId/s3-vector?coreSkills=Node.js Backend Development,Cloud Computing`
```json
// Response
{
  // ...

  "initialMatchingScoreDetails": {
    "jobId": "01K3TM7E8SBKY4NZAHQZS0N313",
    "matchRank": 2,
    "finalScore": 0.5226
  }

  // ...
}
```
```json
// If job not fount, then you will recieve below response
{}
```

1. Crud Operation for vector DB
2. Lambda name :- worko-s3-vector-job-ingestion | Functions | Lambda
# Operation: -
##	Single Job Insertion - Add one job directly 
```json
{
  "job_data": {<job_json>},
  "index_name": "<index-name>"
}
```

## Multiple Job Insertion - Add multiple jobs at once 
```json
{
  "job_data": [{<job_json>}, {<job_json>}],
  "index_name": "<index-name>"
}
```

## Job Counting - Count jobs in an index 
```json
{
  "count_jobs": true,
  "index_name": "<index-name>"
}
```

## Single Job Deletion - Delete one job by ID 
```json
{
  "delete_job_id": "01K33GGZZFK7PRXGWMYWE34N4S",
  "index_name": "<index-name>"
}
```

## Batch Job Deletion - Delete multiple jobs by IDs
```json
{
  "delete_job_ids": ["01K33GGZZGZM4HACMPYZFAQ3AF", "01K33GGZZHBNDDVR8ETSBER16C"],
  "index_name": "<index-name>"
}
```


# Update single job by id
```json
{
  "updateJobId": "01K33GGZZFGBQ2NQBKMS5NWQDD",
  "jobData":{
        "_index": "worko-jobs",
        "_id": "01K33GGZZFGBQ2NQBKMS5NWQDD",
        "_score": 1,
        "_source": {
          "id": "01K33GGZZFGBQ2NQBKMS5NWQDD",
          "externalJobId": "4245422184",
          "sourcedFrom": "BRIGHT_DATA_JOB",
          "createdAt": "2025-08-20T10:31:19.791+00:00",
          "updatedAt": "2025-08-20T10:31:19.791+00:00",
          "jobTitle": "fs- actuarial -life ifrs17 senior",
          "typeofEmployment": "FULL_TIME",
          "location": {
            "city": [
              "pune, maharashtra, india"
            ],
            "state": [
              "pune, maharashtra, india"
            ],
            "country": [
              "pune, maharashtra, india"
            ],
            "fullLocation": [
              "pune, maharashtra, india"
            ]
          },
          "jobDescription": "At EY, you’ll have the chance to build a career as unique as you are, with the global scale, support, inclusive culture and technology to become the best version of you. And we’re counting on your unique voice and perspective to help EY become even better, too. Join us and build an exceptional experience for yourself, and a better working world for all. Senior, Life Actuarial, EY GDS Consulting Global Delivery Services is one of EY's greatest global assets – a network of service delivery centers that provide high-quality services at a competitive cost for all EY’s client serving and enablement teams. Every day, we combine our subject matter expertise with our technology and automation skills to develop new solutions that deliver greater value for working world, helping to create long-term value for clients, people and society and build trust in the capital markets. Enabled by data and technology, diverse EY teams in over 150 countries provide trust through assurance and help clients grow, transform and operate. Working across assurance, consulting, law, strategy, tax and transactions, EY teams ask better questions to find new answers for the complex issues facing our world today. Show more Show less",
          "jobPostedDate": "2025-08-15T16:37:26.050Z",
          "jobUrl": "https://www.linkedin.com/jobs/view/fs-actuarial-life-ifrs17-senior-at-ey-4245422184?_l=en",
          "status": "PUBLISHED",
          "companyName": "EY",
          "companyUrl": "https://uk.linkedin.com/company/ernstandyoung?trk=public_jobs_topcard-org-name",
          "companyLogoUrl": "https://media.licdn.com/dms/image/v2/C510BAQGpRhkpxp5A9A/company-logo_100_100/company-logo_100_100/0/1630570672166/ernstandyoung_logo?e=2147483647&v=beta&t=b0upZAfAhCLoq3ru166xwEzp681OHwS_p2jRguRs5Fo",
          "isDeleted": false,
          "department": "consulting",
          "brightDataJobPoster": {
            "name": null,
            "title": null,
            "url": null
          },
          "industry": "Professional Services",
          "brightDataJobSeniorityLevel": "Mid-Senior level",
          "softSkills": [
            "problem solving",
            "communication skills",
            "team leadership",
            "strategic planning",
            "stakeholder management",
            "goal setting",
            "performance management"
          ],
          "coreSkills": [
            "actuarial reserving",
            "assumption setting",
            "modelling",
            "insurance products",
            "financial analysis",
            "market research",
            "business development"
          ],
          "technicalSkills": [
            "prophet",
            "mg alfa",
            "ggy axis",
            "moses",
            "rafm",
            "excel",
            "vba",
            "database management"
          ],
          "miscellaneousSkills": [
            "ifrs 17",
            "us gaap",
            "solvency ii",
            "actuarial degree"
          ],
          "isJobUpdated": true,
          "experienceRange": {
            "min": 3,
            "max": 6
          }
       }
  },
  "indexName": "worko-s3-jobs-index-test-test"
}
```

# Multiple job update
```json
{
  "updateJobs": [
    {
      "jobId": "01K33GGZZFGBQ2NQBKMS5NWQDD",
      "jobData": {
        "_index": "worko-jobs",
        "_id": "01K33GGZZFGBQ2NQBKMS5NWQDD",
        "_score": 1,
        "_source": {
          "id": "01K33GGZZFGBQ2NQBKMS5NWQDD",
          "externalJobId": "4245422184",
          "sourcedFrom": "BRIGHT_DATA_JOB",
          "createdAt": "2025-08-20T10:31:19.791+00:00",
          "updatedAt": "2025-08-20T10:31:19.791+00:00",
          "jobTitle": "fs- actuarial -life ifrs17 senior",
          "typeofEmployment": "FULL_TIME",
          "location": {
            "city": [
              "pune, maharashtra, india"
            ],
            "state": [
              "pune, maharashtra, india"
            ],
            "country": [
              "pune, maharashtra, india"
            ],
            "fullLocation": [
              "pune, maharashtra, india"
            ]
          },
          "jobDescription": "At EY, you’ll have the chance to build a career as unique as you are, with the global scale, support, inclusive culture and technology to become the best version of you. And we’re counting on your unique voice and perspective to help EY become even better, too. Join us and build an exceptional experience for yourself, and a better working world for all. Senior, Life Actuarial, EY GDS Consulting Global Delivery Services is one of EY's greatest global assets – a network of service delivery centers that provide high-quality services at a competitive cost for all EY’s client serving and enablement teams. Every day, we combine our subject matter expertise with our technology and automation skills to develop new solutions that deliver greater value for working world, helping to create long-term value for clients, people and society and build trust in the capital markets. Enabled by data and technology, diverse EY teams in over 150 countries provide trust through assurance and help clients grow, transform and operate. Working across assurance, consulting, law, strategy, tax and transactions, EY teams ask better questions to find new answers for the complex issues facing our world today. Show more Show less",
          "jobPostedDate": "2025-08-15T16:37:26.050Z",
          "jobUrl": "https://www.linkedin.com/jobs/view/fs-actuarial-life-ifrs17-senior-at-ey-4245422184?_l=en",
          "status": "PUBLISHED",
          "companyName": "EY",
          "companyUrl": "https://uk.linkedin.com/company/ernstandyoung?trk=public_jobs_topcard-org-name",
          "companyLogoUrl": "https://media.licdn.com/dms/image/v2/C510BAQGpRhkpxp5A9A/company-logo_100_100/company-logo_100_100/0/1630570672166/ernstandyoung_logo?e=2147483647&v=beta&t=b0upZAfAhCLoq3ru166xwEzp681OHwS_p2jRguRs5Fo",
          "isDeleted": false,
          "department": "consulting",
          "brightDataJobPoster": {
            "name": null,
            "title": null,
            "url": null
          },
          "industry": "Professional Services",
          "brightDataJobSeniorityLevel": "Mid-Senior level",
          "softSkills": [
            "problem solving",
            "communication skills",
            "team leadership",
            "strategic planning",
            "stakeholder management",
            "goal setting",
            "performance management"
          ],
          "coreSkills": [
            "actuarial reserving",
            "assumption setting",
            "modelling",
            "insurance products",
            "financial analysis",
            "market research",
            "business development"
          ],
          "technicalSkills": [
            "prophet",
            "mg alfa",
            "ggy axis",
            "moses",
            "rafm",
            "excel",
            "vba",
            "database management"
          ],
          "miscellaneousSkills": [
            "ifrs 17",
            "us gaap",
            "solvency ii",
            "actuarial degree"
          ],
          "isJobUpdated": true,
          "experienceRange": {
            "min": 3,
            "max": 6
          }
        }
      }
    },
    {
      "jobId": "01K33GGZZFK7PRXGWMYWE34N4S",
      "jobData": {
        "_index": "worko-jobs",
        "_id": "01K33GGZZFK7PRXGWMYWE34N4S",
        "_score": 1,
        "_source": {
          "id": "01K33GGZZFK7PRXGWMYWE34N4S",
          "externalJobId": "4282255624",
          "sourcedFrom": "BRIGHT_DATA_JOB",
          "createdAt": "2025-08-20T10:31:19.791+00:00",
          "updatedAt": "2025-08-20T10:31:19.791+00:00",
          "jobTitle": "gms-senior-techops-defender",
          "typeofEmployment": "FULL_TIME",
          "location": {
            "city": [
              "pune, maharashtra, india"
            ],
            "state": [
              "pune, maharashtra, india"
            ],
            "country": [
              "pune, maharashtra, india"
            ],
            "fullLocation": [
              "pune, maharashtra, india"
            ]
          },
          "jobDescription": "At EY, you’ll have the chance to build a career as unique as you are, with the global scale, support, inclusive culture and technology to become the best version of you. And we’re counting on your unique voice and perspective to help EY become even better, too. Join us and build an exceptional experience for yourself, and a better working world for all. CMS-TDR Senior As part of our EY-cyber security team, who shall work as SME for Defender XDR security solutions in CMS TDR team The opportunity We’re looking for Senior Consultant with expertise in Opportunities to develop new skills and progress your career The freedom and flexibility to handle your role in a way that’s right for you EY | Building a better working world EY exists to build a better working world, helping to create long-term value for clients, people and society and build trust in the capital markets. Enabled by data and technology, diverse EY teams in over 150 countries provide trust through assurance and help clients grow, transform and operate. Working across assurance, consulting, law, strategy, tax and transactions, EY teams ask better questions to find new answers for the complex issues facing our world today. Show more Show less",
          "jobPostedDate": "2025-08-14T16:37:25.220Z",
          "jobUrl": "https://www.linkedin.com/jobs/view/gms-senior-techops-defender-at-ey-4282255624?_l=en",
          "status": "PUBLISHED",
          "companyName": "EY",
          "companyUrl": "https://uk.linkedin.com/company/ernstandyoung?trk=public_jobs_topcard-org-name",
          "companyLogoUrl": "https://media.licdn.com/dms/image/v2/C510BAQGpRhkpxp5A9A/company-logo_100_100/company-logo_100_100/0/1630570672166/ernstandyoung_logo?e=2147483647&v=beta&t=b0upZAfAhCLoq3ru166xwEzp681OHwS_p2jRguRs5Fo",
          "isDeleted": false,
          "department": "cybersecurity",
          "brightDataJobPoster": {
            "name": null,
            "title": null,
            "url": null
          },
          "industry": "Professional Services",
          "brightDataJobSeniorityLevel": "Mid-Senior level",
          "softSkills": [
            "communication",
            "teamwork",
            "problem solving",
            "critical thinking",
            "interpersonal skills",
            "presentation skills"
          ],
          "coreSkills": [
            "cybersecurity",
            "security monitoring",
            "cyber incident response",
            "defender xdr",
            "cloud environments"
          ],
          "technicalSkills": [
            "microsoft defender",
            "windows defender",
            "microsoft defender xdr",
            "defender for cloud",
            "azure",
            "aws",
            "windows server",
            "linux",
            "python",
            "bash",
            "powershell",
            "sql",
            "excel",
            "power bi",
            "visualization tools",
            "crm"
          ],
          "miscellaneousSkills": [
            "security threats"
          ],
          "isJobUpdated": true
        }
      }
    }
  ],
  "indexName": "worko-s3-jobs-index-test-test"
}
```



# Sample job_json: -
```json
{
    "_index": "worko-jobs",
    "_id": "01K33GGZZ134TWCAKRBN7K54FJ",
    "_score": 1,
    "_source": {
      "id": "01K33GGZZ134TWCAKRBN7K54FJ",
      "externalJobId": "4269626647",
      "sourcedFrom": "BRIGHT_DATA_JOB",
      "createdAt": "2025-08-20T10:31:19.777+00:00",
      "updatedAt": "2025-08-20T10:31:19.777+00:00",
      "jobTitle": "oracle finance-ofsaa-senior",
      "typeofEmployment": "FULL_TIME",
      "location": {"city": ["pune, maharashtra, india],
        "state": ["pune, maharashtra, india"],
        "country": ["pune, maharashtra, india"],
        "fullLocation": ["pune, maharashtra, india"]},
      "jobDescription": "At EY, we’re all in to shape your future with confidence. We’ll help you succeed in a globally connected powerhouse of diverse teams and take your career wherever you want it to go. 150 countries and territories. Show more Show less",
"jobPostedDate": "2025-08-14T16:37:16.838Z",
      "jobUrl": "https://www.linkedin.com/jobs/view/oracle-finance-ofsaa-senior-at-ey-4269626647?_l=en",
      "status": "PUBLISHED",
      "companyName": "EY",
      "companyUrl": "https://uk.linkedin.com/company/ernstandyoung?trk=public_jobs_topcard-org-name",
      "companyLogoUrl": "https://media.licdn.com/dms/image/v2/C510BAQGpRhkpxp5A9A/company-logo_100_100/companylogo_100_100/0/1630570672166/ernstandyoung_logo?e=2147483647&v=beta&t=b0upZAfAhCLoq3ru166xwEzp681OHwS_p2jRguRs5Fo",
      "isDeleted": false,
      "department": "consulting",
      "brightDataJobPoster": {"name": null,"title": null, "url": null},
      "industry": "Professional Services",
      "brightDataJobSeniorityLevel": "Mid-Senior level",
      "softSkills": ["client interaction",
        "communications",
        "event handling",
        "storytelling" ],
      "coreSkills": ["ofsaa implementation",
        "financial services",
        "ofsaa epm",
        "ofsaa erm",
        "knowledge management",
        "industry expertise" ],
      "technicalSkills": [
        "etl (odi, informatica)",
        "reporting (obiee, powerbi)",
        "unified metadata manager",
        "scd",
        "amhm" ],
      "miscellaneousSkills": ["financial services background"],
      "isJobUpdated": true
}
```