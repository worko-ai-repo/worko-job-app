

1. Old email template
```json
{
    "subject": "Action Required - You've Received a Job Application Request!",
    "status": "ENABLED",
    "createdAt": "2024-12-05T08:19:30.875Z",
    "placeholders": [
        "corporateUserFullName",
        "candidateName",
        "jobTitle",
        "matchingScore",
        "scoreDetails"
    ],
    "GSI1SK": "EMAIL#CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION",
    "bodyText": "Dear {{corporateUserFullName}},\n\n{{candidateName}} has applied for the position of {{jobTitle}}.\n\nCandidate Match Score: {{matchingScore}}\nWorko Assessment Summary: {{scoreDetails}}\n\nClick below to view their profile:\n[View Profile](https://dev-ui.worko.work/v1/auth/corporate/login)\n\nOnwards & Upwards,\nTeam Worko",
    "GSI1PK": "NOTIF#TEMP#EMAIL",
    "createdByUserId": "61c36d2a-80c1-706f-1309-70bd21b0495f",
    "updatedByUserId": "REDACTED",
    "bodyHtml": "Dear {{corporateUserFullName}},<br><br>{{candidateName}} has applied for the position of {{jobTitle}}.<br><br>Candidate Match Score: {{matchingScore}}<br>Worko Assessment Summary: {{scoreDetails}}<br><br>Click below to view their profile:<br><a href='https://dev-ui.worko.work/v1/auth/corporate/login'>View Profile</a><br><br>Onwards & Upwards,<br>Team Worko",
    "templateName": "CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION",
    "updatedAt": "2025-05-16T08:08:47.820Z",
    "SK": "EMAIL#CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION",
    "PK": "NOTIF#TEMP",
    "description": "This Email Template is for sending an email to the corporate users to notify them of a job application request from a candidate.",
    "id": "01JEAYE6DT42GM1YJRSE8ZZ2HT",
    "title": "Action Required - You've Received a Job Application Request!"
}
```

```json
{
    "scoreDetails": "Overall Matching Score: 76.5/100\n\nExplanation:\n\n1. The candidate has strong experience in the MERN stack (MongoDB, Express.js, React.js, Node.js), as evidenced by the \"Technical Skills\" and \"Industry Experience\" sections of the resume.\n   Relevant sentence: \"Front-end: React.js, CSS, Bootstrap, Redux Toolkit, JavaScript\" and \"Back-end: Node.js, Express.js, Mongoose ODM, TypeScript, AWS DynamoDB, AWS CodeCatalyst\"\n\n2. The candidate has experience working with databases such as MongoDB, PostgreSQL, and SQLite, which aligns with the job requirements.\n   Relevant sentence: \"Databases: MongoDB, PostgreSQL, SQLite\"\n\n3. The candidate has experience in web development, including building full-stack applications, RESTful APIs, and real-time communication using tools like Socket.IO.\n   Relevant sentence: \"Building website using MERN stack\" and \"Built backend chat application, WhatsApp notification integration, worked on bug fixes\"\n\n4. The candidate has hands-on experience with version control using Git and GitHub, which is a requirement for the job.\n   Relevant sentence: \"Use version control systems like GitHub for project management and collaboration\"\n\n5. The candidate's experience and skills seem to match the job requirements, except for the lack of explicit mention of experience with Socket.IO, which is a key requirement for the role.\n   Relevant sentence: \"Use libraries such as Socket.IO for real-time communication\"\n\nThe overall matching score is 76.5/100, as the candidate meets most of the job requirements, but the lack of explicit mention of Socket.IO experience is a concern."
}
```

```json
{
    "htmlScoreDetailsOutput": "<p>Overall Matching Score: 76.5/100</p>\n<p>Explanation:</p>\n<ol>\n<li><p>The candidate has strong experience in the MERN stack (MongoDB, Express.js, React.js, Node.js), as evidenced by the &quot;Technical Skills&quot; and &quot;Industry Experience&quot; sections of the resume.\nRelevant sentence: &quot;Front-end: React.js, CSS, Bootstrap, Redux Toolkit, JavaScript&quot; and &quot;Back-end: Node.js, Express.js, Mongoose ODM, TypeScript, AWS DynamoDB, AWS CodeCatalyst&quot;</p>\n</li>\n<li><p>The candidate has experience working with databases such as MongoDB, PostgreSQL, and SQLite, which aligns with the job requirements.\nRelevant sentence: &quot;Databases: MongoDB, PostgreSQL, SQLite&quot;</p>\n</li>\n<li><p>The candidate has experience in web development, including building full-stack applications, RESTful APIs, and real-time communication using tools like Socket.IO.\nRelevant sentence: &quot;Building website using MERN stack&quot; and &quot;Built backend chat application, WhatsApp notification integration, worked on bug fixes&quot;</p>\n</li>\n<li><p>The candidate has hands-on experience with version control using Git and GitHub, which is a requirement for the job.\nRelevant sentence: &quot;Use version control systems like GitHub for project management and collaboration&quot;</p>\n</li>\n<li><p>The candidate&#39;s experience and skills seem to match the job requirements, except for the lack of explicit mention of experience with Socket.IO, which is a key requirement for the role.\nRelevant sentence: &quot;Use libraries such as Socket.IO for real-time communication&quot;</p>\n</li>\n</ol>\n<p>The overall matching score is 76.5/100, as the candidate meets most of the job requirements, but the lack of explicit mention of Socket.IO experience is a concern.</p>\n"
}
```