
1. CAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE 
```json
{
  "templateName": "CAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE",
  "subject": "Documents Requested by Worko Hr",
  "title": "Documents Requested by Worko Hr",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Document Request</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <!-- Main Container -->\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <!-- Main Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candidateName}},</p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">We hope this email finds you well.</p>\n              <p style=\"margin: 0 0 20px;\">As a next step in the evaluation process for the {{jobTitle}} position at {{companyName}}, we require you to submit a few documents.</p>\n              \n              <p style=\"margin: 0 0 20px;\">Please upload clear, legible copies of these documents through our secure portal at your earliest convenience. \n                <br></p>\n              <p style=\"margin: 0 0 20px;\">Click the button below to go directly to the upload page:</p>\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href=\"{{uploadUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Upload Documents</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0 0 20px;\">If you have any questions or encounter any technical issues, please do not hesitate to reply to this email at <a href=\"mailto:support@worko.ai\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">support@worko.ai</a>.</p>\n              <p style=\"margin: 0 0 20px;\">Thank you for your cooperation. We look forward to proceeding with your application.</p>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">\n                Onwards & Upwards,<br>\n                Worko\n              </p>\n            </td>\n          </tr>\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Dear {{candidateName}},\n\nWe hope this email finds you well.\n\nAs a next step in the evaluation process for the {{jobTitle}} position at {{companyName}}, we require you to submit a few documents.\n\nPlease upload clear, legible copies of these documents through our secure portal at your earliest convenience.\n\nClick the link below to upload your documents:\n{{uploadUrl}}\n\nIf you have any questions or encounter any technical issues, please reply to this email at support@worko.ai.\n\nThank you for your cooperation. We look forward to proceeding with your application.\n\nOnwards & Upwards,\nWorko"
,
  "placeholders": [
    "candidateName",
    "jobTitle",
    "companyName",
    "uploadDocumentsUrl",
    "instagramUrl",
    "instagramLogoUrl",
    "linkedInUrl",
    "linkedInLogoUrl",
    "workoLogoUrl"
  ],
  "description": "Whenever `corporate` or `worko-admin` request documents from `candidate` then send email to `candidate` to upload the documents requested by `corporate` or `worko-admin`"
}
```


2. CAND_JOB_APPLICATION_JOINED_STATUS_UPDATE
```json
{
  "templateName": "CAND_JOB_APPLICATION_JOINED_STATUS_UPDATE",
  "subject": "Joined Job Application Update",
  "title": "Joined Job Application Update",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Joining Date Notification</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <!-- Main Container -->\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n          <!-- Main Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{candidateName}},</p>\n              <p style=\"margin: 0 0 20px;\">Your official joining date for the {{jobTitle}} role at {{companyName}} has been set to {{joiningDate}}</p>\n              \n              <p style=\"margin: 0 0 20px;\">Hr will contact you directly with more details for your first day.</p>\n              <p style=\"margin: 0 0 20px;\">Congratulations on the new role!</p>\n              <p style=\"margin: 0 0 20px;\">If you have any questions, please contact us at <a href=\"mailto:support@worko.ai\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">support@worko.ai</a>.</p>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">\n                Onwards & Upwards,<br>\n                <strong>Team Worko</strong>\n              </p>\n            </td>\n          </tr>\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Hi {{candidateName}},\n\nYour official joining date for the {{jobTitle}} role at {{companyName}} has been set to {{joiningDate}}.\n\nHr will contact you directly with more details for your first day.\n\nCongratulations on the new role!\n\nIf you have any questions, please contact us at support@worko.ai.\n\nOnwards & Upwards,\nTeam Worko"
,
  "placeholders": [
    "candidateName",
    "jobTitle",
    "joiningDate",
    "companyName",
    "instagramUrl",
    "instagramLogoUrl",
    "linkedInUrl",
    "linkedInLogoUrl",
    "workoLogoUrl"
  ],
  "description": "Whenever `corporate` or `worko-admin` clicks on `joined` button then send email to candidate"
}
```


3. CAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE
```json
{
  "templateName": "CAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE",
  "subject": "Job Application Offer Letter",
  "title": "Job Application Offer Letter ",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Worko Offer Notification</title></head><body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\"><tr><td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\"><tr><td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\"><img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" /></td></tr><tr><td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\"><p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candidateName}},</p><p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">We are thrilled to inform you that {{companyName}} has extended an offer of employment to you for the position of {{jobTitle}}!</p><p style=\"margin: 0 0 20px;\">Please log in to your account to view the complete offer, including important details on compensation, benefits, and your potential start date.</p><p style=\"margin: 0 0 20px;\">Click the button below to be taken directly to your offer:</p><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\"><tr><td align=\"center\"><a href=\"{{viewOfferUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View My Offer Letter</a></td></tr></table><p style=\"margin: 0 0 20px;\">If you have any questions regarding the offer, you can contact us at <a href=\"mailto:support@worko.ai\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">support@worko.ai</a>.</p><p style=\"margin: 0 0 20px;\">Congratulations again on this wonderful opportunity!</p><p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p></td></tr><tr><td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\"><p style=\"margin: 0 0 10px;\"><a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a><a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a></p><p style=\"margin: 0 0 10px;\">Worko</p><p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p></td></tr></table></td></tr></table></body></html>",

"bodyText": "Dear {{candidateName}},\n\nWe are thrilled to inform you that {{companyName}} has extended an offer of employment to you for the position of {{jobTitle}}!\n\nPlease log in to your account to view the complete offer, including important details on compensation, benefits, and your potential start date.\n\nClick the link below to view your offer:\n{{viewOfferUrl}}\n\nIf you have any questions regarding the offer, you can contact us at support@worko.ai.\n\nCongratulations again on this wonderful opportunity!\n\nOnwards & Upwards,\nTeam Worko\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102"

,
  "placeholders": [
    "candidateName",
    "jobTitle",
    "companyName",
    "viewOfferUrl",
    "instagramUrl",
    "instagramLogoUrl",
    "linkedInUrl",
    "linkedInLogoUrl",
    "workoLogoUrl"
  ],
  "description": "Whenever `corporate` or `worko-admin` clicks on hire now button and send offer letter then send email to `candidate`"
}
```


4. EVALUATOR_REQUEST_EVALUATION
```json
{
    "subject": "Candidate Evaluation Request",
    "placeholders": [
        "evaluatorName",
        "jobTitle",
        "evaluatorDashboardUrl",
        "hrName",
        "hrCurrentCompanyName",
        "instagramUrl",
        "instagramLogoUrl",
        "linkedInUrl",
        "linkedInLogoUrl",
        "workoLogoUrl"
    ],
    "templateName": "EVALUATOR_REQUEST_EVALUATION",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Candidate Evaluation Request</title></head><body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color: #f4f4f4;\"><tr><td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\"><table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\"><tr><td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\"><img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" /></td></tr><tr><td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\"><p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{evaluatorName}},</p><p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">Hope you're doing well! I've come across a candidate for the <strong style=\"color: #182b45;\">{{jobTitle}}</strong> role who seems like a strong fit based on our initial discussion and requirements.</p><p style=\"margin: 0 0 20px;\">I'm sharing the profile below for your review — would appreciate your quick feedback so we can move ahead accordingly. Looking forward to your thoughts.</p><p style=\"margin: 0 0 10px; font-weight: bold; color: #182b45;\">Quick evaluation checklist:</p><ul style=\"margin: 0 0 20px; padding-left: 20px; color: #333333;\"><li style=\"margin-bottom: 8px;\">Technical skills match</li><li style=\"margin-bottom: 8px;\">Experience relevance</li><li style=\"margin-bottom: 8px;\">Team fit assessment</li><li style=\"margin-bottom: 8px;\">Your overall recommendation</li></ul><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"margin: 0 0 20px;\"><tr><td align=\"center\"><a href={{evaluatorDashboardUrl}} style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Review Candidate Profile</a></td></tr></table><p style=\"margin: 0 0 20px;\">Thanks for taking the time to help with this! Let me know if you have any questions.</p><p style=\"margin: 0; font-weight: bold; color: #182b45;\">Best regards,<br><strong>{{hrName}} - HR Team</strong><br>{{hrCurrentCompanyName}}</p></td></tr><tr><td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\"><p style=\"margin: 0 0 10px;\"><a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a><a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a></p><p style=\"margin: 0 0 10px;\">Worko.ai</p><p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p></td></tr></table></td></tr></table></body></html>",

"bodyText": "Hi {{evaluatorName}},\n\nHope you're doing well! I've come across a candidate for the {{jobTitle}} role who seems like a strong fit based on our initial discussion and requirements.\n\nI'm sharing the profile below for your review — would appreciate your quick feedback so we can move ahead accordingly. Looking forward to your thoughts.\n\nQuick evaluation checklist:\n - Technical skills match\n - Experience relevance\n - Team fit assessment\n - Your overall recommendation\n\nReview Candidate Profile: {{evaluatorDashboardUrl}}\n\nThanks for taking the time to help with this! Let me know if you have any questions.\n\nBest regards,\n{{hrName}} - HR Team\n{{hrCurrentCompanyName}}\n\nWorko.ai\nHSR Layout, Bengaluru, Karnataka, 560102"
,
    "description": "The email template is used to send notification to `evaluator` whenever a `corporate-admin/recruiter` or `worko-admin` sends a job application details to a `evaluator` for reviewing that candidate's application.",
    "title": "Review and assess top candidates"
}
```


5. CAND_JOB_CLOSED_UPDATE_STATUS
```json
{
    "subject": "Job Currently Closed",
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
    "templateName": "CAND_JOB_CLOSED_UPDATE_STATUS",
"bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Worko Application Update</title>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color: #f4f4f4;\">\n    <tr>\n      <td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\">\n          \n          <!-- Header -->\n          <tr>\n            <td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\">\n              <img src={{workoLogoUrl}} alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" />\n            </td>\n          </tr>\n\n          <!-- Body Content -->\n          <tr>\n            <td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\">\n              <p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Hi {{candName}},</p>\n              <p style=\"margin: 0 0 20px;\">\n                Thank you for applying for the <strong style=\"color: #182b45;\">{{jobTitle}}</strong> role at <strong style=\"color: #182b45;\">{{companyName}}</strong>.\n              </p>\n              <p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #333333;\">\n                This position has now been closed by the company and is no longer available, so your application will not be moving forward at this time.\n              </p>\n              <p style=\"margin: 0 0 20px;\">\n                While this specific role is closed, we encourage you to explore the many other opportunities currently available on our platform.\n              </p>\n              <p style=\"margin: 0 0 20px;\">\n                We wish you the best in your job search.\n              </p>\n              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"margin: 0 0 20px;\">\n                <tr>\n                  <td align=\"center\">\n                    <a href={{workoAppUrl}} style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">Find Other Open Roles</a>\n                  </td>\n                </tr>\n              </table>\n              <p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p>\n            </td>\n          </tr>\n\n          <!-- Footer -->\n          <tr>\n            <td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n              <p style=\"margin: 0 0 10px;\">\n                <a href={{instagramUrl}} style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src={{instagramLogoUrl}} alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n                <a href={{linkedInUrl}} style=\"text-decoration: none; margin: 0 10px;\">\n                  <img src={{linkedInLogoUrl}} alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" />\n                </a>\n              </p>\n              <p style=\"margin: 0 0 10px;\">Worko</p>\n              <p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p>\n            </td>\n          </tr>\n\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>",

"bodyText": "Hi {{candName}},\n\nThank you for applying for the {{jobTitle}} role at {{companyName}}.\n\nThis position has now been closed by the company and is no longer available, so your application will not be moving forward at this time.\n\nWhile this specific role is closed, we encourage you to explore the many other opportunities currently available on our platform.\n\nWe wish you the best in your job search.\n\nFind other open roles here: {{workoAppUrl}}\n\nOnwards & Upwards,\nTeam Worko\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102" 
,
    "description": "The email template is used to send notification to candidates who applied for a job which is closed by worko-admin or corporate recruiter.",
    "title": "Job Currently Closed"
}
```