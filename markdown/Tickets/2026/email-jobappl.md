
1. 
```json
{
  "subject": "Revised Job Offer Letter",
  "status": "ENABLED",
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
  "GSI1SK": "EMAIL#CAND_JOB_APPLICATION_REVISED_OFFER_SENT",
  "bodyText": "Dear {{candidateName}},\n\nWe would like to inform you that {{companyName}} has shared a revised offer of employment for the position of {{jobTitle}}.\n\nThe revised offer includes updated details related to compensation, benefits, or other terms discussed earlier. We encourage you to carefully review the revised offer.\n\nClick the link below to view your revised offer:\n{{viewOfferUrl}}\n\nIf you have any questions regarding the revised offer, please feel free to reach out to us at support@worko.ai.\n\nWe look forward to hearing from you soon.\n\nOnwards & Upwards,\nTeam Worko\n\nWorko\nHSR Layout, Bengaluru, Karnataka, 560102",
  "templateName": "CAND_JOB_APPLICATION_REVISED_OFFER_SENT",
  "bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Worko Revised Offer Notification</title></head><body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\"><tr><td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\"><tr><td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\"><img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" /></td></tr><tr><td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\"><p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candidateName}},</p><p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">{{companyName}} has shared a revised offer of employment with you for the position of {{jobTitle}}.</p><p style=\"margin: 0 0 20px;\">This revised offer contains updated information related to compensation, benefits, or other employment terms. Please review the details carefully.</p><p style=\"margin: 0 0 20px;\">Click the button below to view your revised offer:</p><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\"><tr><td align=\"center\"><a href=\"{{viewOfferUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;\">View Revised Offer Letter</a></td></tr></table><p style=\"margin: 0 0 20px;\">If you have any questions regarding the revised offer, please contact us at <a href=\"mailto:support@worko.ai\" style=\"color: #007bff; text-decoration: underline; font-weight: bold;\">support@worko.ai</a>.</p><p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br><strong>Team Worko</strong></p></td></tr><tr><td style=\"padding: 20px; background-color: #182b45; color: #ffffff; font-size: 14px; line-height: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\"><p style=\"margin: 0 0 10px;\"><a href=\"{{instagramUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{instagramLogoUrl}}\" alt=\"Instagram\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a><a href=\"{{linkedInUrl}}\" style=\"text-decoration: none; margin: 0 10px;\"><img src=\"{{linkedInLogoUrl}}\" alt=\"LinkedIn\" width=\"24\" style=\"display: inline-block; vertical-align: middle;\" /></a></p><p style=\"margin: 0 0 10px;\">Worko</p><p style=\"margin: 0;\">HSR Layout, Bengaluru, Karnataka, 560102</p></td></tr></table></td></tr></table></body></html>",
  "description": "Whenever `corporate` or `worko-admin` sends a revised offer letter, an email is sent to the candidate",
  "title": "Job Application Revised Offer Letter"
}
```

2. 
```json
{
  "subject": "Additional Documents Requested by Worko Hr",
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
  "bodyText": "Dear {{candidateName}},\n\nWe hope this email finds you well.\n\nAs part of the ongoing evaluation process for the {{jobTitle}} position at {{companyName}}, we require some additional documents from you.\n\nPlease upload clear, legible copies of the requested additional documents through our secure portal at your earliest convenience.\n\nClick the link below to upload the additional documents:\n{{uploadUrl}}\n\nIf you have any questions or face any issues while uploading, please contact us at support@worko.ai.\n\nThank you for your cooperation. We look forward to reviewing the additional information.\n\nOnwards & Upwards,\nWorko",
  "templateName": "CAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE",
  "bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Worko Additional Document Request</title></head><body style=\"margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f4f4;\"><tr><td align=\"center\" valign=\"top\" style=\"padding: 40px 0;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);\"><tr><td align=\"center\" style=\"padding: 20px; background-color: #71f8f8; border-top-left-radius: 8px; border-top-right-radius: 8px;\"><img src=\"{{workoLogoUrl}}\" alt=\"Worko Logo\" width=\"150\" style=\"display: block; max-width: 150px;\" /></td></tr><tr><td style=\"padding: 40px 25px; font-size: 16px; line-height: 26px; color: #333333;\"><p style=\"margin: 0 0 15px; font-size: 18px; color: #182b45; font-weight: bold;\">Dear {{candidateName}},</p><p style=\"margin: 0 0 20px; background-color: #f1faff; padding: 15px; border-left: 4px solid #007bff; color: #182b45; font-weight: bold;\">Additional documents are required to proceed with your application.</p><p style=\"margin: 0 0 20px;\">As part of the evaluation for the {{jobTitle}} role at {{companyName}}, we request you to upload a few additional documents.</p><p style=\"margin: 0 0 20px;\">Click the button below to upload the additional documents:</p><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin: 0 0 20px;\"><tr><td align=\"center\"><a href=\"{{uploadUrl}}\" style=\"display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;\">Upload Additional Documents</a></td></tr></table><p style=\"margin: 0 0 20px;\">For any questions, reach out to <a href=\"mailto:support@worko.ai\" style=\"color: #007bff; font-weight: bold;\">support@worko.ai</a>.</p><p style=\"margin: 0; font-weight: bold; color: #182b45;\">Onwards & Upwards,<br>Worko</p></td></tr><tr><td style=\"padding: 20px; background-color: #182b45; color: #ffffff; text-align: center; font-size: 14px;\"><p><a href=\"{{instagramUrl}}\"><img src=\"{{instagramLogoUrl}}\" width=\"24\" /></a> <a href=\"{{linkedInUrl}}\"><img src=\"{{linkedInLogoUrl}}\" width=\"24\" /></a></p><p>Worko</p><p>HSR Layout, Bengaluru, Karnataka, 560102</p></td></tr></table></td></tr></table></body></html>",
  "description": "Whenever `corporate` or `worko-admin` requests additional documents from candidate",
  "title": "Additional Documents Requested by Worko Hr"
}

```

3. 
```json
{
  "subject": "Document Revision Requested by Worko Hr",
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
  "bodyText": "Dear {{candidateName}},\n\nWe hope you are doing well.\n\nUpon reviewing the documents submitted for the {{jobTitle}} position at {{companyName}}, we require certain revisions or corrections.\n\nPlease re-upload the revised documents through our secure portal at your earliest convenience.\n\nClick the link below to upload the revised documents:\n{{uploadUrl}}\n\nIf you need any clarification, please reach out to us at support@worko.ai.\n\nThank you for your prompt attention.\n\nOnwards & Upwards,\nWorko",
  "templateName": "CAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE",
  "bodyHtml": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Worko Document Revision Request</title></head><body style=\"margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;\"><table width=\"100%\"><tr><td align=\"center\" style=\"padding:40px 0;\"><table width=\"600\" style=\"background:#fff;border-radius:8px;border:1px solid #e0e0e0;\"><tr><td align=\"center\" style=\"padding:20px;background:#71f8f8;\"><img src=\"{{workoLogoUrl}}\" width=\"150\" /></td></tr><tr><td style=\"padding:40px 25px;color:#333;\"><p style=\"font-size:18px;font-weight:bold;color:#182b45;\">Dear {{candidateName}},</p><p style=\"background:#f1faff;padding:15px;border-left:4px solid #007bff;font-weight:bold;\">Revisions are required for the documents you submitted.</p><p>During review for the {{jobTitle}} role at {{companyName}}, we found that some documents need revision.</p><p>Please click below to upload the revised documents:</p><p style=\"text-align:center;\"><a href=\"{{uploadUrl}}\" style=\"padding:12px 24px;background:#007bff;color:#fff;border-radius:4px;font-weight:bold;text-decoration:none;\">Upload Revised Documents</a></p><p>For assistance, contact <a href=\"mailto:support@worko.ai\" style=\"color:#007bff;font-weight:bold;\">support@worko.ai</a>.</p><p style=\"font-weight:bold;color:#182b45;\">Onwards & Upwards,<br>Worko</p></td></tr><tr><td style=\"background:#182b45;color:#fff;text-align:center;padding:20px;font-size:14px;\"><p><a href=\"{{instagramUrl}}\"><img src=\"{{instagramLogoUrl}}\" width=\"24\" /></a> <a href=\"{{linkedInUrl}}\"><img src=\"{{linkedInLogoUrl}}\" width=\"24\" /></a></p><p>Worko</p><p>HSR Layout, Bengaluru, Karnataka, 560102</p></td></tr></table></td></tr></table></body></html>",
  "description": "Whenever `corporate` or `worko-admin` requests document revisions from candidate",
  "title": "Document Revision Requested by Worko Hr"
}
```