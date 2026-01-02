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