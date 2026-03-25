
const BRIGHT_DATA_JOB_GCP_BATCH_INFERENCE_APP_CONSTANTS = {
  BATCH_INFERENCE_MODEL_INPUT: {
    GENERATION_CONFIG: {
      MAX_OUTPUT_TOKENS: 16384,
      TEMPERATURE: 0,
      TOP_P: 0.8,
      THINKING_CONFIG: {
        THINKING_BUDGET: 2048,
      },
    },
    ROLES: {
      USER: "user",
    },

    /**
     * 1. If below attributes are already assigned with values then don't update them.
     *    1. department
     *    2. salaryRange
     *    3. experienceRange
     *    4. coreSkills
     *    5. technicalSkills
     *    6. softSkills
     *    7. miscellaneousSkills
     *    8. noticePeriod
     *    9. typeOfEmployment
     */
    PROMPT: `"*JOB DESCRIPTION EXTRACTION TASK*\n\n"

            "*STEP 1 - Extract Basic Information:*\n"
            "- Job Title\n"
            "- Salary Range (Minimum and Maximum)\n"
            "- Experience Range (Minimum and Maximum)\n"
            "- Number of Openings\n"
            "- Work Mode (WFH, WFO, HYBRID)\n"
            "- Location\n"
            "- Notice Period (Days)(Enter a numeric value. If a range is provided, use the higher value.)\n"
            "- Type of Employment\n"
            "- Department\n"
            "- Core Skills (Each skill must be a maximum of 30 characters)\n"
            "- Soft Skills (Each skill must be a maximum of 30 characters)\n"
            "- Technical Skills (Include only IT skills as Technical Skill. Each skill must be a maximum of 30 characters)\n"
            "- Good to Have Skills (Each skill must be a maximum of 30 characters)\n"
            "- Must Have Skills (These are skills explicitly mentioned as 'must have' in the job description. Each skill must be a maximum of 30 characters)\n"
            "- Mandatory Requirements (Identify all MANDATORY requirements in the job description - look for terms like \"required,\" \"must have,\" \"X years in [specific industry]\")\n"
            "- Preferred Requirements (Identify all PREFERRED/NON-MANDATORY experience requirements - look for terms like \"preferred,\" \"nice to have,\" \"desirable\")\n\n"

            "*STEP 2 - CRITICAL SKILL CLASSIFICATION RULES:*\n"
            "*CORE SKILLS = Functional/Domain Expertise ONLY*\n"
            "- INCLUDE in coreSkills: Specific job functions, domain knowledge, industry expertise\n"
            "- Examples: 'Category Management', 'Supplier Relations', 'E-commerce Operations', 'Revenue Management', 'Market Research'\n"
            "- EXCLUDE from coreSkills: Management abilities, thinking skills, interpersonal skills\n"
            "- Examples: 'Team Leadership', 'Strategic Planning', 'Goal Setting', 'Performance Management', 'Stakeholder Management'\n\n"

            "*SOFT SKILLS = Behavioral/Interpersonal Abilities*\n"
            "- INCLUDE in softSkills: How you work, think, and interact\n"
            "- Examples: 'Leadership', 'Communication', 'Strategic Thinking', 'Problem Solving', 'Team Management', 'Decision Making'\n\n"

            "*TECHNICAL SKILLS = Tools/Software/Platforms*\n"
            "INCLUDE in technicalSkills: Specific tools, software, platforms, systems\n"
            "Examples: 'Microsoft Excel', 'CRM Systems', 'Analytics Tools', 'Database Management'\n\n"

            "*MANDATORY SKILL MOVEMENT RULES:*\n"
            "- 'Team Leadership' → softSkills (NOT coreSkills)\n"
            "- 'Strategic Planning' → softSkills (NOT coreSkills)\n"
            "- 'Stakeholder Management' → softSkills (NOT coreSkills)\n"
            "- 'Goal Setting' → softSkills (NOT coreSkills)\n"
            "- 'Performance Management' → softSkills (NOT coreSkills)\n"
            "- 'Data Analysis' → technicalSkills if tool-based, softSkills if analytical thinking\n"
            "- 'Process Development' → softSkills (NOT coreSkills)\n"
            "- 'Problem Resolution' → softSkills (NOT coreSkills)\n"
            "- 'Business Development' → coreSkills (NOT softSkills)\n"
            "- 'Financial Analysis' → coreSkills (NOT technicalSkills)\n"
            "- 'Market Research' → coreSkills (NOT softSkills)\n"
            "- 'Sales Strategy' → coreSkills (NOT softSkills)\n"
            "- 'Programming Languages (Python, Java, etc.)' → technicalSkills (NOT coreSkills)\n"
            "- 'Cloud Platforms (AWS, Azure, GCP)' → technicalSkills (NOT coreSkills)\n"
            "- 'Version Control (Git, SVN)' → technicalSkills (NOT coreSkills)\n"
            "- 'Database Design/SQL' → technicalSkills (NOT coreSkills)\n"
            "- 'Project Management' → softSkills (NOT coreSkills)\n"
            "- 'Communication Skills' → softSkills (NEVER coreSkills or technicalSkills)\n"
            "- 'Excel/Power BI/Visualization Tools' → technicalSkills (NOT coreSkills)\n"
            "- 'Customer Relationship Management (CRM)' → technicalSkills (NOT coreSkills)\n\n"

            "*STEP 3 - MANDATORY vs PREFERRED REQUIREMENTS:*\n"
            "*Mandatory Requirements:* Look for exact phrases:\n"
            "- 'Required', 'Must have', 'Necessary', 'Essential'\n"
            "- Items under 'Requirements', 'Mandatory Requirements', 'Essential Criteria'\n"
            "- Education requirements (BE/B.Tech Graduate)\n"
            "- Experience requirements with specific years\n\n"

            "*Preferred Requirements:* Look for exact phrases:\n"
            "- 'Preferred', 'Nice to have', 'Desirable', 'Good to have'\n"
            "- Items under 'Preferred Qualifications', 'Additional Skills'\n"
            "- 'Experience with X is an added advantage'\n\n"

            "*STEP 4 - MUST HAVE vs GOOD TO HAVE SKILLS:*\n"
            "- mustHaveSkills: Extract skills from mandatory requirements\n"
            "- goodToHaveSkills: Extract skills from preferred requirements\n\n"

            "*STEP 5 - FINAL VALIDATION (CRITICAL):*\n"
            "Before generating JSON, perform these checks:\n"
            "1. Scan coreSkills - remove ANY management/leadership/planning skills\n"
            "2. Move removed skills to softSkills\n"
            "3. Check for duplicates across all skill arrays - remove duplicates\n"
            "4. Ensure each skill is in ONLY ONE category\n"
            "5. Verify coreSkills contains ONLY functional/domain expertise\n"
            "6. Keep only 20 most relevant skills with respect to job description in each category\n"
            "7. For Salary Range and Experience Range: if min is given but max is not, set max as null; if both are missing, do not return the field\n"
            "8. Remove any redundant or repeating data\n"
	    "9. never give two responses or array of json. always give single json conaining output\n\n"

            "*EMPTY FIELD RULE:*\n"
            "- If information is not explicitly mentioned, put it as null. never put anything else then null\n\n"

            "*PROCESSING THE JOB DESCRIPTION:*\n"
            "Now analyze this job description step by step:\n\n"
            f"{promptJobDescription}\n\n"

            "*OUTPUT FORMAT:*\n"
            "Return ONLY the JSON structure below with extracted values:\n\n"
            "{\n"
            "    \"jobTitle\": \"\",\n"
            "    \"salaryRange\": {\"min\": \"\" (int), \"max\": \"\" (int)},\n"
            "    \"experienceRange\": {\"min\": \"\" (int), \"max\": \"\" (int)},\n"
            "    \"numberOfOpenings\": \"\" (int),\n"
            "    \"workMode\": \"\" (str),\n"
            "    \"location\": \"\" (str),\n"
            "    \"noticePeriod\": \"\" (int),\n"
            "    \"typeOfEmployment\": \"\" (str),\n"
            "    \"department\": \"\" (str),\n"
            "    \"coreSkills\": [],\n"
            "    \"softSkills\": [],\n"
            "    \"technicalSkills\": [],\n"
            "    \"goodToHaveSkills\": [],\n"
            "    \"mustHaveSkills\": [],\n"
            "    \"mandatoryRequirements\": [],\n"
            "    \"preferredRequirements\": [],\n"
            "    \"formattedHTML\": \"<div>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Company Overview</h2>\\n\"\n"
            "        \"<p>[Company information from job description]</p>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Role Overview</h2>\\n\"\n"
            "        \"<p>[Role information from job description]</p>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Key Responsibilities</h2>\\n\"\n"
            "        \"<ul>\\n\"\n"
            "        \"[List of responsibilities from job description]\\n\"\n"
            "        \"</ul>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Requirements</h2>\\n\"\n"
            "        \"<ul>\\n\"\n"
            "        \"[List of requirements from job description]\\n\"\n"
            "        \"</ul>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Mandatory Requirements</h2>\\n\"\n"
            "        \"<ul>\\n\"\n"
            "        \"[List of mandatory requirements from job description]\\n\"\n"
            "        \"</ul>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Preferred Requirements</h2>\\n\"\n"
            "        \"<ul>\\n\"\n"
            "        \"[List of preferred requirements from job description]\\n\"\n"
            "        \"</ul>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"<section>\\n\"\n"
            "        \"<h2>Additional Information</h2>\\n\"\n"
            "        \"<p>[Additional details from job description]</p>\\n\"\n"
            "        \"</section>\\n\"\n"
            "        \"</div>\"\n"
            "}"`,
  },
};

export { BRIGHT_DATA_JOB_GCP_BATCH_INFERENCE_APP_CONSTANTS };
