
1. CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION
```json
{
"bodyText": "Dear {{corporateUserFullName}},\n\n{{candidateName}} has applied for the position of {{jobTitle}}.\n\nCandidate Match Score: {{matchingScore}}\nWorko Assessment Summary: {{scoreDetails}}\n\nClick below to view their profile:\n{{companyJobApplicantsUrl}}\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102",

"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Candidate Application Notification</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <!-- Main Container -->\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <!-- Main Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{corporateUserFullName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">{{candidateName}} has applied for the position of {{jobTitle}}.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Candidate Match Score:</strong> {{matchingScore}}<br>\n                <strong>Worko Assessment Summary:</strong> {{scoreDetails}}\n              </p>\n              <p style=\"margin: 0 0 20px;\">Click below to view their profile:</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{companyJobApplicantsUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Profile</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>"
,
    "description": "This Email Template is for sending an email to the corporate users to notify them of a job application request from a candidate.",
    "placeholders": [
        "corporateUserFullName",
        "candidateName",
        "jobTitle",
        "matchingScore",
        "scoreDetails",
        "companyJobApplicantsUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Action Required - You've Received a Job Application Request!",
    "templateName": "CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION",
    "title": "Action Required - You've Received a Job Application Request!"
}
```


2. CORP_REQUEST_FEEDBACK_NOTIFICATION
```json
{
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Candidate Feedback/Update Request</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{jobPosterName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">{{candidateName}} has requested feedback or an update regarding their application for the role of {{jobTitle}}.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Application Date:</strong> {{applicationDate}}<br>\n                <strong>Current Status:</strong> {{status}}\n              </p>\n              <p style=\"margin: 0 0 20px;\">Please click below to provide an update:</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href={{corporateUpdateStatusUrl}} style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Update Status</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{jobPosterName}},\n\n{{candidateName}} has requested feedback or an update regarding their application for the role of {{jobTitle}}.\n\nApplication Date: {{applicationDate}}\nCurrent Status: {{status}}\n\nPlease click below to provide an update:\n[Update Status]({{corporateUpdateStatusUrl}})\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This Email Template is for notifying job poster when a candidate requests feedback or an update regarding their application.",
    "placeholders": [
        "jobPosterName",
        "candidateName",
        "jobTitle",
        "applicationDate",
        "status",
        "corporateUpdateStatusUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Action Required - Candidate Requested an Application Update!",
    "templateName": "CORP_REQUEST_FEEDBACK_NOTIFICATION",
    "title": "Action Required - Candidate Requested an Application Update!"
}
```


3. CORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION
```json
{
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Job Application Status Update</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{jobPosterName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">We would like to inform you that the status of a job application for the {{jobTitle}} role has been updated.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Candidate Name:</strong> {{candidateName}}<br>\n                <strong>Current Status:</strong> {{updatedStatus}}\n              </p>\n              <p style=\"margin: 0 0 20px;\">For more detailed information, please click on the link below:</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{corporateApplicationDetailsUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Application Details</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{jobPosterName}},\n\nWe would like to inform you that the status of a job application for the {{jobTitle}} role has been updated.\n\nCandidate Name: {{candidateName}}\nCurrent Status: {{updatedStatus}}\n\nFor more detailed information, please click on the link below:\n[View Application Details]({{corporateApplicationDetailsUrl}})\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This email template notifies job posters about an update in the status of a job application and provides a link for further details.",
    "placeholders": [
        "jobPosterName",
        "jobTitle",
        "candidateName",
        "updatedStatus",
        "corporateApplicationDetailsUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Update on Job Application Status",
    "templateName": "CORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION",
    "title": "Job Application Status Updated"
}
```


4. CAND_RECEIVED_JOB_APPLICATION_NOTIFICATION
```json
{
    "bodyHtml": "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Job Application Confirmation</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f4f4f4; padding: 40px 0;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 100%;\">\n          \n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block;\" />\n            </td>\n          </tr>\n\n          <!-- Main Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candidateName}},</p>\n\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">\n                Thank you for applying for the position of {{jobTitle}} at {{companyName}} through Worko.ai. Your application has been successfully submitted and shared with the HR team.\n              </p>\n\n              <p style=\"margin: 0 0 20px;\">You can check the status of your application anytime on your Worko dashboard.</p>\n\n              <div style=\"text-align: center; margin: 0 0 20px;\">\n                <a href=\"{{candJobApplUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;\">\n                  View Dashboard\n                </a>\n              </div>\n\n              <p style=\"margin: 0 0 20px; font-weight: bold; color: #182b45;\">Stay tuned for updates, and good luck!</p>\n\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards &amp; Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",
    "bodyText": "Dear {{candidateName}},\n\nThank you for applying for the position of {{jobTitle}} at {{companyName}} through Worko.ai. Your application has been successfully submitted and shared with the HR team.\n\nYou can check the status of your application anytime on your Worko dashboard.\n\n[View Dashboard]({{candJobApplUrl}})\n\nStay tuned for updates, and good luck!\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102",
    "description": "This email template confirms the successful submission of a candidate's job application and provides a link to check the application status.",
    "placeholders": [
        "candidateName",
        "jobTitle",
        "companyName",
        "candJobApplUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Your Job Application Has Been Successfully Submitted",
    "templateName": "CAND_RECEIVED_JOB_APPLICATION_NOTIFICATION",
    "title": "Thank You for Applying job at Worko Dashboard"
}
```


5. CAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE
```json
{
"bodyHtml": "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Profile View Notification</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f4f4f4; padding: 40px 0;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 100%;\">\n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block;\" />\n            </td>\n          </tr>\n\n          <!-- Body Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"font-size: 18px; color: #182b45; font-weight: bold; margin: 0 0 15px;\">Dear {{candName}},</p>\n\n              <p style=\"background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold; margin: 0 0 20px;\">\n                Good news! The HR team at {{companyName}} has viewed your profile for the {{jobTitle}} role.\n              </p>\n\n              <p style=\"margin: 0 0 20px;\">This is a significant step forward, and you can track further updates directly on your dashboard at Worko.ai.</p>\n\n              <div style=\"text-align: center; margin: 0 0 20px;\">\n                <a href=\"{{workoAppUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;\">\n                  View Dashboard\n                </a>\n              </div>\n\n              <p style=\"margin: 0 0 20px;\">We’re here to help you prepare for the next step! Worko can connect you with a senior employee of {{companyName}}. They can mentor you and guide you to success!</p>\n\n              <p style=\"margin: 0 0 20px;\">\n                If you'd like to get guidance, visit\n                <a href={{guidanceUrl}} style=\"color: #007bff; font-weight: bold;\">Guidance Page</a>\n                 on our website and fill the details with the role and company name, and our team will assist you in connecting with the right mentor.\n              </p>\n\n              <p style=\"margin: 0 0 20px;\">Stay confident, and we’re rooting for you! <span style=\"font-size: 16px;\">(Keep it up!)</span></p>\n\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards &amp; Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{candName}},\n\nGood news! The HR team at {{companyName}} has viewed your profile for the {{jobTitle}} role.\n\nThis is a significant step forward, and you can track further updates directly on your dashboard at Worko.ai.\n\n👉 View Dashboard: {{workoAppUrl}}\n\nWe’re here to help you prepare for the next step! Worko can connect you with a senior employee of {{companyName}}. They can mentor you and guide you to success!\n\nIf you'd like to get guidance, visit the Guidance Page ({{guidanceUrl}}) on our website and fill the details with the role and company name, and our team will assist you in connecting with the right mentor.\n\nStay confident, and we’re rooting for you! (Keep it up!)\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This email notifies the candidate that their profile has been viewed by the HR team and offers mentorship support to help them prepare for the next steps.",
    "placeholders": [
        "candName",
        "jobTitle",
        "companyName",
        "workoAppUrl",
        "guidanceUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Your Profile Has Been Viewed!",
    "templateName": "CAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE",
    "title": "Exciting Update! Your Profile Has Been Viewed"
}
```



6. CAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE
```json
{
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Profile Review Notification</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          \n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n\n          <!-- Body Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">\n                Exciting news! The HR team at {{companyName}} is now reviewing your profile for the {{jobTitle}} position for further steps.\n              </p>\n              <p style=\"margin: 0 0 20px;\">\n                You can track your application’s progress anytime on your Worko.ai dashboard.\n              </p>\n              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{workoAppUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Dashboard</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0 0 20px;\">\n                To help you ace the interview, Worko offers personalized mentorship. We can connect you with a senior employee at {{companyName}} who can guide you through every stage.\n              </p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Want to get started?</strong> Visit\n                <a href=\"{{guidanceUrl}}\" style=\"color: #007bff; font-weight: bold;\">Guidance Page</a>\n                 on our website and fill the details with the role and company name, and we’ll help you prepare for success!\n              </p>\n              <p style=\"margin: 0 0 20px; font-weight: bold; color: #182b45;\">\n                We’ll notify you as soon as there are additional updates. Fingers crossed!\n              </p>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{candName}},\n\nExciting news! The HR team at {{companyName}} is now reviewing your profile for the {{jobTitle}} position for further steps.\n\nYou can track your application’s progress anytime on your Worko.ai dashboard.\n👉 View Dashboard: {{workoAppUrl}}\n\nTo help you ace the interview, Worko offers personalized mentorship. We can connect you with a senior employee at {{companyName}} who can guide you through every stage.\n\n💡 Want to get started? Visit the Guidance Page ({{guidanceUrl}}) on our website and fill the details with the role and company name, and we’ll help you prepare for success!\n\nWe’ll notify you as soon as there are additional updates. Fingers crossed!\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This email template informs candidates that their application is under review and provides mentorship options to help them prepare for the interview.",
    "placeholders": [
        "candName",
        "jobTitle",
        "companyName",
        "workoAppUrl",
        "guidanceUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Your Application is Under Review!",
    "templateName": "CAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE",
    "title": "Exciting News! Your Application is Being Reviewed"
}
```


7. CAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE
```json
{
"bodyHtml": "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Job Selection Notification</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f4f4f4; padding: 40px 0;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 100%;\">\n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block;\" />\n            </td>\n          </tr>\n\n          <!-- Body Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"font-size: 18px; color: #182b45; font-weight: bold; margin: 0 0 15px;\">Dear {{candName}},</p>\n\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">\n                We’re thrilled to share that you’ve been selected for the {{jobTitle}} position at {{companyName}}.\n              </p>\n\n              <p style=\"margin: 0 0 20px;\">The HR team at {{companyName}} must have already contacted you or will be reaching out shortly to discuss the next steps.</p>\n\n              <p style=\"margin: 0 0 20px;\">You can also view this update anytime on your Worko dashboard.</p>\n\n              <div style=\"text-align: center; margin: 0 0 20px;\">\n                <a href=\"{{workoAppUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;\">\n                  View Dashboard\n                </a>\n              </div>\n\n              <p style=\"margin: 0 0 20px; font-weight: bold; color: #182b45;\">\n                This is just the beginning of an exciting journey. We wish you immense success in your new role. Go shine!\n              </p>\n\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards &amp; Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{candName}},\n\nWe’re thrilled to share that you’ve been selected for the {{jobTitle}} position at {{companyName}}.\n\nThe HR team at {{companyName}} must have already contacted you or will be reaching out shortly to discuss the next steps.\n\nYou can also view this update anytime on your Worko dashboard: {{workoAppUrl}}\n\nThis is just the beginning of an exciting journey. We wish you immense success in your new role. Go shine!\n\nOnwards & Upwards,\nTeam Worko"
,
    "description": "This email template notifies candidates of their selection for a job position, congratulates them, and provides a link to their dashboard.",
    "placeholders": [
        "candName",
        "jobTitle",
        "companyName",
        "workoAppUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Congratulations on Your Selection for the job application at Worko",
    "templateName": "CAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE",
    "title": "You’ve Been Selected!"
}
```



8. CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE
```json
{
"bodyHtml": "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Job Application Update</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f4f4f4; padding: 40px 0;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 100%;\">\n          \n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block;\" />\n            </td>\n          </tr>\n\n          <!-- Main Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candName}},</p>\n\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">\n                Thank you for applying for the position of {{jobTitle}} at {{companyName}}. After careful consideration, the HR team has decided to move forward with other candidates for this role.\n              </p>\n\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Feedback:</strong> {{hrFeedback}}\n              </p>\n\n              <p style=\"margin: 0 0 20px; font-weight: bold; color: #182b45;\">\n                Don’t lose heart your ideal career opportunity awaits! Continue exploring and applying for positions on worko.ai to find the right job match for your skills and experience.\n              </p>\n\n              <p style=\"margin: 0 0 20px;\">You can view your application status and browse new openings anytime from your dashboard.</p>\n\n              <div style=\"text-align: center; margin: 0 0 20px;\">\n                <a href=\"{{workoAppUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;\">\n                  Explore Opportunities\n                </a>\n              </div>\n\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards &amp; Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"margin: 0 10px; text-decoration: none;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{candName}},\n\nThank you for applying for the position of {{jobTitle}} at {{companyName}}. After careful consideration, the HR team has decided to move forward with other candidates for this role.\n\nFeedback: {{hrFeedback}}\n\nDon’t lose heart your ideal career opportunity awaits! Continue exploring and applying for positions on worko.ai to find the right job match for your skills and experience.\n\nYou can view your application status and browse new openings anytime from your dashboard: {{workoAppUrl}}\n\nOnwards & Upwards,\nTeam Worko"
,
    "description": "This email template notifies candidates of a rejection with personalized HR feedback and encourages them to explore other opportunities on Worko.ai.",
    "placeholders": [
        "candName",
        "jobTitle",
        "companyName",
        "hrFeedback",
        "workoAppUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "Update on Your Job Application",
    "templateName": "CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE",
    "title": "Update on Your Job Application"
}
```


9. RECIPIENT_REFER_AND_EARN
```json
{
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Referral Invitation</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{recipientName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">Your friend {{referrerName}} believes you’d be a perfect match for this role at {{companyName}} and wanted you to check it out.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Job Role:</strong> {{jobTitle}}<br>\n                <strong>Company:</strong> {{companyName}}<br>\n                <strong>Apply Here:</strong> <a href=\"{{jobUrl}}\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">Click Here</a>\n              </p>\n              <p style=\"margin: 0 0 20px;\">Applying through Worko increases your chances of getting hired. Plus, if you get the job, don’t forget to treat {{referrerName}}! 😉</p>\n              <p style=\"margin: 0 0 20px;\">Check out the role and apply now.</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{jobUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Apply Now</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Hi {{recipientName}},\n\nYour friend {{referrerName}} believes you’d be a perfect match for this role at {{companyName}} and wanted you to check it out.\n\nJob Role: {{jobTitle}}\nCompany: {{companyName}}\nApply Here: {{jobUrl}}\n\nApplying through Worko increases your chances of getting hired. Plus, if you get the job, don’t forget to treat {{referrerName}}! 😉\n\nCheck out the role and apply now.\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This email is notifying referral recipient that someone referred him.",
    "placeholders": [
        "referrerName",
        "recipientName",
        "companyName",
        "jobTitle",
        "jobUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "status": "ENABLED",
    "subject": "{{referrerName}} Thinks You’re a Great Fit for This Role!",
    "templateName": "RECIPIENT_REFER_AND_EARN",
    "title": "{{referrerName}} Thinks You’re a Great Fit for This Role!"
}
```

10. REFERRER_REFER_AND_EARN
```json
{
    "title": "Your Referral for {{recipientName}} Has Been Sent!",
    "subject": "Your Referral for {{recipientName}} Has Been Sent!",
    "status": "ENABLED",
    "placeholders": [
        "referrerName",
        "recipientName",
        "companyName",
        "jobTitle",
        "dashboardUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "templateName": "REFERRER_REFER_AND_EARN",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Referral Acknowledgment</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{referrerName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">Thank you for referring {{recipientName}} for {{jobTitle}} at {{companyName}}! We've sent them the job details and encouraged them to apply.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">If they get hired and join the company, you’ll receive a ₹5,000 reward! 🎉</p>\n              <p style=\"margin: 0 0 20px;\">Track your referrals and rewards anytime on your <a href=\"{{dashboardUrl}}\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">Worko Dashboard</a>.</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{dashboardUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Track Your Referrals</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Hi {{referrerName}},\n\nThank you for referring {{recipientName}} for {{jobTitle}} at {{companyName}}! We've sent them the job details and encouraged them to apply.\n\nIf they get hired and join the company, you’ll receive a ₹5,000 reward! 🎉\n\nTrack your referrals and rewards anytime on your Worko Dashboard: {{dashboardUrl}}\n\nOnwards & Upwards,\nTeam Worko\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "This email is notifying referrer that he refferred a friend successfully."
}
```



11. WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED
```json
{
    "subject": "Referral Amount Withdrawal Request Submitted by {{referrerName}}",
    "status": "ENABLED",
    "placeholders": [
        "referrerName",
        "referrerEmailId",
        "referrerPhoneNumber",
        "recipientName",
        "jobUrl",
        "jobTitle",
        "appliedDate",
        "referAndEarnJobApplicationStatus",
        "commissionAmount",
        "accountHolderName",
        "accountNumber",
        "ifscCode",
        "branchName",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "templateName": "WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED",
    "bodyText": "A referral amount withdrawal request has been submitted by the user:\n\nUser Details:\nUser Name: {{referrerName}}\nEmail ID: {{referrerEmailId}}\nPhone Number: {{referrerPhoneNumber}}\n\nReferral & Payment Details:\nCandidate Name: {{recipientName}}\nJob URL: {{jobUrl}}\nJob Title: {{jobTitle}}\nApplied Date: {{appliedDate}}\nCurrent Status: {{referAndEarnJobApplicationStatus}}\nReferral Amount: ₹{{commissionAmount}}\nAccount Holder Name: {{accountHolderName}}\nAccount Number: {{accountNumber}}\nIFSC Code: {{ifscCode}}\nBranch Name: {{branchName}}\n\nView Job Details: {{jobUrl}}\n\nOnwards & Upwards,\nWorko System\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102",

"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Referral Withdrawal Request</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">A referral amount withdrawal request has been submitted by the user:</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>User Details:</strong><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>User Name:</strong> {{referrerName}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Email ID:</strong> {{referrerEmailId}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Phone Number:</strong> {{referrerPhoneNumber}}</span>\n              </p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Referral & Payment Details:</strong><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Candidate Name:</strong> {{recipientName}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Job URL:</strong> <a href=\"{{jobUrl}}\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">{{jobUrl}}</a></span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Job Title:</strong> {{jobTitle}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Applied Date:</strong> {{appliedDate}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Current Status:</strong> {{referAndEarnJobApplicationStatus}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Referral Amount:</strong> ₹{{commissionAmount}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Account Holder Name:</strong> {{accountHolderName}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Account Number:</strong> {{accountNumber}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>IFSC Code:</strong> {{ifscCode}}</span><br>\n                <span style=\"display: inline-block; margin: 5px 0;\"><strong>Branch Name:</strong> {{branchName}}</span>\n              </p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{jobUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Job Details</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Worko System</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>"
,
    "description": "This email notifies the admin that a user has submitted a referral amount withdrawal request with account and referral details.",
    "title": "Referral Amount Withdrawal Request Submitted"
}
```



12. REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED
```json
{
    "subject": "🎉 Payment Successful for Referring {{recipientName}}!",
    "status": "ENABLED",
    "placeholders": [
        "referrerName",
        "amountPaid",
        "recipientName",
        "jobTitle",
        "companyName",
        "jobAppliedDate",
        "referrerUniqueTransactionReference",
        "referrerAccountNumber",
        "referrerIfscCode",
        "paymentDate",
        "dashboardUrl",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "templateName": "REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED",
    "bodyText": "Hi {{referrerName}},\n\nWe’re happy to let you know that a payment of {{amountPaid}} has been successfully processed for referring {{recipientName}} for the {{jobTitle}} role at {{companyName}} on {{jobAppliedDate}}.\n\nHere are the payment details:\nUTR / Transaction No.: {{referrerUniqueTransactionReference}}\nAccount Number: {{referrerAccountNumber}}\nIFSC Code: {{referrerIfscCode}}\nPayment Date: {{paymentDate}}\n\nA big thank you for helping someone take a step forward in their career. 🚀\n\nWe truly appreciate your support—and we’d love for you to keep referring amazing talent. Every referral counts, and your contribution makes a real difference.\n\nView Referral Dashboard: {{dashboardUrl}}\n\nLet’s continue helping great candidates find great opportunities!\n\nCheers,\nTeam Worko.ai\n\nFollow us:\nInstagram: {{instagramUrl}}\nLinkedIn: {{linkedInUrl}}\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102",

"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Referral Payment Confirmation</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{referrerName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">We’re happy to let you know that a payment of {{amountPaid}} has been successfully processed for referring {{recipientName}} for the {{jobTitle}} role at {{companyName}} on {{jobAppliedDate}}.</p>\n              <p style=\"margin: 0 0 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                <strong>Here are the payment details:</strong><br>\n                <strong>UTR / Transaction No.:</strong> {{referrerUniqueTransactionReference}}<br>\n                <strong>Account Number:</strong> {{referrerAccountNumber}}<br>\n                <strong>IFSC Code:</strong> {{referrerIfscCode}}<br>\n                <strong>Payment Date:</strong> {{paymentDate}}\n              </p>\n              <p style=\"margin: 0 0 20px;\">A big thank you for helping someone take a step forward in their career. 🚀</p>\n              <p style=\"margin: 0 0 20px;\">We truly appreciate your support—and we’d love for you to keep referring amazing talent. Every referral counts, and your contribution makes a real difference.</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{dashboardUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Referral Dashboard</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0 0 20px;\">Let’s continue helping great candidates find great opportunities!</p>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Cheers,<br><strong>Team Worko.ai</strong></p>\n            </td>\n          </tr>\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>"
,
    "description": "This email notifies the referrer that payment has been completed for a successful referral.",
    "title": "Your Referral Payment is Complete!"
}
```
