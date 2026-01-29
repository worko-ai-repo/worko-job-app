 1. 
```sh
# Batch inference with Gemini
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/batch-prediction-gemini

# Batch inference from Cloud Storage
https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/batch-prediction-from-cloud-storage
```

2. 
```sh
APP_GCP_VETEX_AI_BATCH_INFERENCE_MODEL_NAME="gemini-3-pro-preview"
# Pick one region:
APP_GCP_VETEX_AI_BATCH_INFERENCE_LOCATION="global"
```

3. 
```ts
`**JOB DESCRIPTION EXTRACTION TASK**\n\n"
   **STEP 1 - ANALYSIS & EXTRACTION RULES:**\n"
   Your goal is MAXIMAL EXTRACTION. Do not summarize; extract every relevant detail.\n"
   1. **Deconstruct Compound Skills:** If a line says 'Java/Python' or 'Experience in React, Redux, and Node', extract these as SEPARATE individual skills.\n"
   2. **Infer Standard Acronyms:** If 'AWS' is written, you may output 'AWS (Amazon Web Services)'.\n"
   3. **Character Limits:** Aim for concise skills (under 50 characters), but do not discard a critical skill just because it is long.\n\n"

   **STEP 2 - FIELDS TO EXTRACT:**\n"
   - Job Title\n"
   - Salary Range (Min/Max) - If only one figure is given, treat as Min. If none, leave empty.\n"
   - Experience Range (Min/Max in years)\n"
   - Number of Openings\n"
   - Work Mode (WFH, WFO, HYBRID)\n"
   - Location\n"
   - Notice Period (Days) - Use numeric value. If range, use higher value.\n"
   - Type of Employment\n"
   - Department\n\n"

   **STEP 3 - DETAILED SKILL CLASSIFICATION:**\n"
   **A) TECHNICAL SKILLS (The 'Tools'):**\n"
   - INCLUDE: Programming languages, Frameworks (React, Spring), Databases (SQL, MongoDB), Cloud (AWS, Azure), Tools (JIRA, Git), Methodologies (Agile, Scrum), Operating Systems.\n"
   - RULE: Move specific tech stacks here. e.g., 'MERN Stack' implies Technical Skills.\n\n"
    
   **B) CORE SKILLS (The 'Domain'):**\n"
   - INCLUDE: Functional duties, Industry knowledge, Business processes.\n"
   - EXAMPLES: 'Supply Chain Management', 'B2B Sales', 'Financial Auditing', 'Regulatory Compliance'.\n"
   - EXCLUDE: Generic soft skills or specific software names.\n\n"

   **C) SOFT SKILLS (The 'Person'):**\n"
   - INCLUDE: Interpersonal traits, Leadership, Communication, Problem Solving.\n"
   - MANDATORY MOVES: 'Team Management', 'Strategic Planning', 'Stakeholder Management', 'Mentoring' MUST go here.\n\n"

   **STEP 4 - REQUIREMENT ANALYSIS:**\n"
   - **Mandatory Requirements:** Extract exact text for items marked 'Required', 'Must Have', 'Essential', or specific education/years.\n"
   - **Preferred Requirements:** Extract exact text for items marked 'Preferred', 'Bonus', 'Nice to have'.\n"
   - **Must Have Skills:** Extract short skill keywords derived strictly from the Mandatory Requirements.\n"
   - **Good To Have Skills:** Extract short skill keywords derived strictly from the Preferred Requirements.\n\n"

   **STEP 5 - FINAL CLEANUP & VALIDATION:**\n"
   1. **Deduplication:** Ensure no skill appears in multiple lists. If a skill fits two categories, prioritize: Technical > Core > Soft.\n"
   2. **Cleanup:** Remove generic terms like 'Good attitude' or 'Willing to learn' unless emphasized.\n"
   3. **Formatting:** Ensure Output is strictly valid JSON.\n\n"
    
   **EMPTY FIELD RULE:**\n"
   - If information is not explicitly mentioned, leave field empty as \"\" (keep empty str )\n\n"
   -for Salary Range and Experience Range, if min is given but max is not, then do not include the "max" key in the JSON object.If both"
    f-"minimum and maximum values are not given, do not return the field never give null or "
    
   **OUTPUT FORMAT:**\n"
   Return ONLY the JSON structure below with extracted values:\n\n"
    '{\n'
    '    "jobTitle": "",\n'
    '    "salaryRange": {"min": "", "max": ""},\n'
    '    "experienceRange": {"min": "", "max": ""},\n'
    '    "numberOfOpenings": "",\n'
    '    "workMode": "",\n'
    '    "location": "",\n'
    '    "noticePeriod": "",\n'
    '    "typeOfEmployment": "",\n'
    '    "department": "",\n'
    '    "coreSkills": [],\n'
    '    "softSkills": [],\n'
    '    "technicalSkills": [],\n'
    '    "goodToHaveSkills": [],\n'
    '    "mustHaveSkills": [],\n'
    '    "mandatoryRequirements": [],\n'
    '    "preferredRequirements": [],\n'
    '    "formattedHTML":  "<div>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Company Overview</h2>\\n"\n'
            '        "<p>[Company information from job description]</p>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Role Overview</h2>\\n"\n'
            '        "<p>[Role information from job description]</p>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Key Responsibilities</h2>\\n"\n'
            '        "<ul>\\n"\n'
            '        "[List of responsibilities from job description]\\n"\n'
            '        "</ul>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Requirements</h2>\\n"\n'
            '        "<ul>\\n"\n'
            '        "[List of requirements from job description]\\n"\n'
            '        "</ul>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Mandatory Requirements</h2>\\n"\n'
            '        "<ul>\\n"\n'
            '        "[List of mandatory requirements from job description]\\n"\n'
            '        "</ul>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Preferred Requirements</h2>\\n"\n'
            '        "<ul>\\n"\n'
            '        "[List of preferred requirements from job description]\\n"\n'
            '        "</ul>\\n"\n'
            '        "</section>\\n"\n'
            '        "<section>\\n"\n'
            '        "<h2>Additional Information</h2>\\n"\n'
            '        "<p>[Additional details from job description]</p>\\n"\n'
            '        "</section>\\n"\n'
            '        "</div>"\n'
            '}
            Now Parse this job description:\n{promptJobDescription}`
```


# AWS Bedrock Batch Inference Flow
1. Retrieve `bright data external jobs` and write `300` records in each `jsonl` file and upload all files to 
`Aws s3 batch inference input folder` 
2. Whenever we create `Batch inference` in `AWS bedrock` we need to specify `source` and `destination` aws s3 paths
3. After we create `Batch inference` in `AWS bedrock` the status will be `Pending` and whenever the status is updated to `Completed` then `worko-job-batch-inference-update-function` aws lambda will be get triggerred 
   ```json
   // Amazon EventBridge > Rules > "worko-job-batch-inference-WorkoBatchInferenceUpdate-i3iA6mBWxO9c"
   {
      "detail-type": ["Batch Inference Job State Change"],
      "source": ["aws.bedrock"],
      "detail": {
         "status": ["Completed"]
      }
   }
   ```
4. `worko-job-batch-inference-update-function` will fetch the results from `Aws s3 batch inference output folder` and update them in `gcp firestore` and create them in `aws s3 vector`


# GCP Vertex AI Batch Inference Flow
1. Retrieve `bright data external jobs` and write `300` records in each `jsonl` file and upload all files to 
`GCP storage batch inference input folder` 
2. Whenever we create `Batch inference` in `GCP vertex AI` we need to specify `source` and `destination` GCP storage paths
3. After we create `Batch inference` in `GCP vertex AI` the status will be `Pending` and whenever the status is updated to `Completed` then `worko-job-batch-inference-update-function` aws lambda should get triggerred 
4. `worko-job-batch-inference-update-function` will fetch the results from `GCP storage batch inference output folder` and update them in `gcp firestore` and create them in `aws s3 vector`


```sh
gcp-storage.library.ts
gcp-aiplatform-batch-inference.library.ts
batch-inference-payload-example.json 
BrightDataJobGcpBatchInference.service.ts
BrightDataJobGcpBatchInference.constant.ts
CommonExternalJobAwsBatchInference.service.ts
```
