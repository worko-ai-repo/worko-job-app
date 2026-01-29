gemini-3 vertex gcp updated batch inference prompt
system_prompt = (
f"**JOB DESCRIPTION EXTRACTION TASK**\n\n"
    
    f"**STEP 1 - ANALYSIS & EXTRACTION RULES:**\n"
    f"Your goal is MAXIMAL EXTRACTION. Do not summarize; extract every relevant detail.\n"
    f"1. **Deconstruct Compound Skills:** If a line says 'Java/Python' or 'Experience in React, Redux, and Node', extract these as SEPARATE individual skills.\n"
    f"2. **Infer Standard Acronyms:** If 'AWS' is written, you may output 'AWS (Amazon Web Services)'.\n"
    f"3. **Character Limits:** Aim for concise skills (under 50 characters), but do not discard a critical skill just because it is long.\n\n"

    f"**STEP 2 - FIELDS TO EXTRACT:**\n"
    f"- Job Title\n"
    f"- Salary Range (Min/Max) - If only one figure is given, treat as Min. If none, leave empty.\n"
    f"- Experience Range (Min/Max in years)\n"
    f"- Number of Openings\n"
    f"- Work Mode (WFH, WFO, HYBRID)\n"
    f"- Location\n"
    f"- Notice Period (Days) - Use numeric value. If range, use higher value.\n"
    f"- Type of Employment\n"
    f"- Department\n\n"

    f"**STEP 3 - DETAILED SKILL CLASSIFICATION:**\n"
    f"**A) TECHNICAL SKILLS (The 'Tools'):**\n"
    f"- INCLUDE: Programming languages, Frameworks (React, Spring), Databases (SQL, MongoDB), Cloud (AWS, Azure), Tools (JIRA, Git), Methodologies (Agile, Scrum), Operating Systems.\n"
    f"- RULE: Move specific tech stacks here. e.g., 'MERN Stack' implies Technical Skills.\n\n"
    
    f"**B) CORE SKILLS (The 'Domain'):**\n"
    f"- INCLUDE: Functional duties, Industry knowledge, Business processes.\n"
    f"- EXAMPLES: 'Supply Chain Management', 'B2B Sales', 'Financial Auditing', 'Regulatory Compliance'.\n"
    f"- EXCLUDE: Generic soft skills or specific software names.\n\n"

    f"**C) SOFT SKILLS (The 'Person'):**\n"
    f"- INCLUDE: Interpersonal traits, Leadership, Communication, Problem Solving.\n"
    f"- MANDATORY MOVES: 'Team Management', 'Strategic Planning', 'Stakeholder Management', 'Mentoring' MUST go here.\n\n"

    f"**STEP 4 - REQUIREMENT ANALYSIS:**\n"
    f"- **Mandatory Requirements:** Extract exact text for items marked 'Required', 'Must Have', 'Essential', or specific education/years.\n"
    f"- **Preferred Requirements:** Extract exact text for items marked 'Preferred', 'Bonus', 'Nice to have'.\n"
    f"- **Must Have Skills:** Extract short skill keywords derived strictly from the Mandatory Requirements.\n"
    f"- **Good To Have Skills:** Extract short skill keywords derived strictly from the Preferred Requirements.\n\n"

    f"**STEP 5 - FINAL CLEANUP & VALIDATION:**\n"
    f"1. **Deduplication:** Ensure no skill appears in multiple lists. If a skill fits two categories, prioritize: Technical > Core > Soft.\n"
    f"2. **Cleanup:** Remove generic terms like 'Good attitude' or 'Willing to learn' unless emphasized.\n"
    f"3. **Formatting:** Ensure Output is strictly valid JSON.\n\n"
    
    f"**EMPTY FIELD RULE:**\n"
    f"- If information is not explicitly mentioned, leave field empty as \"\" (keep empty str )\n\n"
    f"-for Salary Range and Experience Range, if min is given but max is not, then do not include the "max" key in the JSON object.If both"
    f-"minimum and maximum values are not given, do not return the field never give null or "
    
    f"**OUTPUT FORMAT:**\n"
    f"Return ONLY the JSON structure below with extracted values:\n\n"
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
            '}'
    
        )
dynamic_prompt=f"Parse this JD:\n{job_desc}"



sonnet3 aws bedrrock updated batch inference prompt

`*JOB DESCRIPTION EXTRACTION TASK*
STEP 1 - Extract Basic Information:
- Type of Employment (Return in UPPERCASE, e.g., FULL_TIME, PART_TIME)
- Department (Return in lowercase, e.g., hr, marketing, sales)
- Salary Range (Minimum and Maximum, in LPA)
- Experience Range (Minimum and Maximum, in years)
- Core Skills (Each skill must be lowercase, max 30 characters)
- Technical Skills (Each skill must be lowercase, max 30 characters)
- Soft Skills (Each skill must be lowercase, max 30 characters)
- Miscellaneous Skills (Each skill must be lowercase, max 30 characters)
- Notice Period (Days) (Enter a numeric value. If a range is provided, use the higher value.)
STEP 2 - CRITICAL SKILL CLASSIFICATION RULES:
CORE SKILLS = Functional/Domain Expertise ONLY
- INCLUDE in coreSkills: Specific job functions, domain knowledge, industry expertise
- Examples: "category management", "supplier relations", "e-commerce operations", "revenue management", "market research"
- EXCLUDE from coreSkills: Management abilities, thinking skills, interpersonal skills
- Examples: "team leadership", "strategic planning", "goal setting", "performance management", "stakeholder management"
SOFT SKILLS = Behavioral/Interpersonal Abilities
- INCLUDE in softSkills: How you work, think, and interact
- Examples: "leadership", "communication", "strategic thinking", "problem solving", "team management", "decision making"
TECHNICAL SKILLS = Tools/Software/Platforms
- INCLUDE in technicalSkills: Specific tools, software, platforms, systems
- Examples: "microsoft excel", "crm systems", "analytics tools", "database management"
miscellaneousSkills: Extract any other skills or requirements not fitting into the above categories, in "lowercase".
- If something is mentioned as a general requirement, certification, or domain knowledge that is not a
  core/technical/soft skill, add it here.
MANDATORY SKILL MOVEMENT RULES:
- "team leadership" → softSkills (NOT coreSkills)
- "strategic planning" → softSkills (NOT coreSkills)
- "stakeholder management" → softSkills (NOT coreSkills)
- "goal setting" → softSkills (NOT coreSkills)
- "performance management" → softSkills (NOT coreSkills)
- "data analysis" → technicalSkills if tool-based, softSkills if analytical thinking
- "process development" → softSkills (NOT coreSkills)
- "problem resolution" → softSkills (NOT coreSkills)
- "business development" → coreSkills (NOT softSkills)
- "financial analysis" → coreSkills (NOT technicalSkills)
- "market research" → coreSkills (NOT softSkills)
- "sales strategy" → coreSkills (NOT softSkills)
- "programming languages (python, java, etc.)" → technicalSkills (NOT coreSkills)
- "cloud platforms (aws, azure, gcp)" → technicalSkills (NOT coreSkills)
- "version control (git, svn)" → technicalSkills (NOT coreSkills)
- "database design/sql" → technicalSkills (NOT coreSkills)
- "project management" → softSkills (NOT coreSkills)
- "communication skills" → softSkills (NEVER coreSkills or technicalSkills)
- "excel/power bi/visualization tools" → technicalSkills (NOT coreSkills)
- "customer relationship management (crm)" → technicalSkills (NOT coreSkills)
STEP 5 - FINAL VALIDATION (CRITICAL):
Before generating JSON, perform these checks:
1. Scan coreSkills - remove ANY management/leadership/planning skills
2. Move removed skills to softSkills
3. Check for duplicates across all skill arrays - remove duplicates
4. Ensure each skill is in ONLY ONE category
5. Verify coreSkills contains ONLY functional/domain expertise
6. keep only 20 most relavant skills with respect to job description in each catagory of skills.
7. for Salary Range and Experience Range if min is given but max is not then don't put any value in max if both are not given do not return the field.
8. for Salary Range and Experience Range, if min is given but max is not, then do not include the "max" key in the JSON object.If both minimum and maximum values are not given, do not return the field never give null or "".
EMPTY FIELD RULE:
- If information is not explicitly mentioned, leave field empty (not "Not Mentioned")
PROCESSING THE JOB DESCRIPTION:
Now analyze this job description step by step:
{promptJobDescription}
Return only the following JSON structure with extracted values. Do not provide any additional content, explanations,
or details:\n\n{\n  \"typeofEmployment\": \"string\", // UPPERCASE format (e.g., FULL_TIME, PART_TIME)\n  \"department\": \"string\",
// lowercase format (e.g., hr, marketing, sales)\n , // UPPERCASE format\n  \"salaryRange\": {\n    \"min\": number,
\n    \"max\": number\n  }, //in LPA (e.g 3 LPA, 12 LPA)\n  \"experienceRange\": {\n    \"min\": number,\n    \"max\": number\n  },
// in years\n  \"coreSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"technicalSkills\": [\n    \"string\",
// lowercase format\n    \"string\"\n  ],\n  \"softSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],
\n  \"miscellaneousSkills\": [\n    \"string\", // lowercase format\n    \"string\"\n  ],\n  \"noticePeriod\": number // in days \n}`,