// Import npm packages
import { DateTime } from "luxon";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import DTOs
import {
  EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_INVITE,
  EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_STATUS_UPDATE,
  EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_INVITE,
  EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_STATUS_UPDATE,
} from "../dtos/EmailTemplatePlaceholder.dto";

// Import enums
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";

// Import helpers
import { getEmailFromPK } from "./user.helper";

// Import libraries
import { emailLibrary, EmailSourceDestinationAddress } from "../libraries/email.library";

// Import models
import { DbJobApplicationInterviewDto } from "../db/gcp-firestore-models/JobApplicationInterview.model";
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";

import { userJobApplicationServiceObj } from "../services/UserJobApplication.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import { JobApplicationInterviewStatusEnum } from "../enums/JobApplicationInterview.enum";

class JobApplicationInterviewHelper {
  private getDisplayNameFromEmail(email: string): string {
    const localPart = email.split("@")[0] ?? "";
    if (!localPart) return email;
    return localPart.replace(/[._-]+/g, " ").toTitleCase();
  }

  private getReadableInterviewStatus(status: string): string {
    return status.replace(/_/g, " ").toTitleCase();
  }

  private getCandidateRecipientName(interview: DbJobApplicationInterviewDto): string {
    const candidateName = interview.applicantName?.trim();
    if (candidateName) {
      return candidateName.toTitleCase();
    }
    return this.getDisplayNameFromEmail(interview.applicantEmail);
  }

  /**
   * getJobApplicationInterviewRoundText
   *
   * @example 1 => "1st round"
   * @example 2 => "2nd round"
   * @example 3 => "3rd round"
   * @example 4 => "4th round"
   */
  getJobApplicationInterviewRoundText(roundNumber: number): string {
    if (roundNumber === 1) return "1st round";
    return "next round";
  }

  /**
   * getJobApplicationInterviewEmailTitle
   *
   * Creates a human-readable interview title string for emails.
   */
  getJobApplicationInterviewEmailTitle(interview: DbJobApplicationInterviewDto): string {
    const roundText = this.getJobApplicationInterviewRoundText(interview.roundNumber);
    return `${interview.companyName} is inviting you to ${roundText} - ${interview.interviewType} for ${interview.jobTitle}`;
  }

  /**
   * getJobApplicationInterviewFormattedDateTime
   *
   * Formats ISO datetime string for email templates.
   *
   * @param {string} isoDateTime - ISO datetime value.
   * @returns {string}
   */
  getJobApplicationInterviewFormattedDateTime(isoDateTime: string): string {
    return DateTime.fromISO(isoDateTime).toFormat("dd LLL yyyy, HH:mm ZZZZ");
  }

  /**
   * assertJobApplicationInProcessingInterviewStatus
   *
   * Ensures interview operation is allowed only for PROCESSING_INTERVIEW applications.
   *
   * @param {string} applicationId - Job application id.
   * @returns {Promise<DbUserJobApplicationDto>}
   */
  async assertJobApplicationInProcessingInterviewStatus(
    applicationId: string
  ): Promise<DbUserJobApplicationDto> {
    const jobApplicationDetails: DbUserJobApplicationDto =
      await userJobApplicationServiceObj.getJobApplicationById(applicationId);

    if (jobApplicationDetails.status !== JobApplicationStatus.PROCESSING_INTERVIEW) {
      throw new BaseError(
        "Interview scheduling is allowed only when application status is PROCESSING_INTERVIEW.",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    return jobApplicationDetails;
  }

  /**
   * sendJobApplicationInterviewInviteEmails
   *
   * Sends interview invite emails in two categories:
   * 1) Candidate email with ruleForCandidate
   * 2) Attendee emails (excluding organizer) without recruiterNote/rules
   *
   * @param {DbJobApplicationInterviewDto} interview - Interview details.
   * @param {string} title - Interview title.
   * @returns {Promise<void>}
   */
  async sendJobApplicationInterviewInviteEmails(
    interview: DbJobApplicationInterviewDto,
    title: string
  ): Promise<void> {
    const interviewTitleForEmail: string = this.getJobApplicationInterviewEmailTitle(interview);
    const interviewRoundText: string = this.getJobApplicationInterviewRoundText(interview.roundNumber);

    // Candidate template
    const candidatePlaceholders: EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_INVITE =
      {
        recipientName: this.getCandidateRecipientName(interview),
        companyName: interview.companyName,
        jobTitle: interview.jobTitle,
        interviewType: interview.interviewType,
        interviewRoundText,
        interviewDateTime: this.getJobApplicationInterviewFormattedDateTime(
          interview.scheduledAt
        ),
        interviewMeetLink: interview.meetingLink,
        interviewStatus: this.getReadableInterviewStatus(interview.status),
        interviewTitle: interviewTitleForEmail,
        ruleForCandidate: interview.ruleForCandidate ?? "",
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    await emailLibrary.sendEmail(
      EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_INVITE,
      { email: interview.applicantEmail },
      candidatePlaceholders
    );

    // Attendee template (exclude organizer and candidate)
    const attendeeRecipients = new Map<string, EmailSourceDestinationAddress>();
    interview.attendees.forEach((attendee) => {
      const attendeeEmail: string = attendee.email;
      if (
        attendeeEmail &&
        attendeeEmail !== interview.organizerEmail &&
        attendeeEmail !== interview.applicantEmail
      ) {
        attendeeRecipients.set(attendeeEmail, {
          email: attendeeEmail,
          fullName: attendee.name,
        });
      }
    });

    await Promise.all(
      Array.from(attendeeRecipients.values()).map(async (recipient) => {
        const placeholders: EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_INVITE =
          {
            recipientName: recipient.fullName?.toTitleCase() ?? recipient.email,
            companyName: interview.companyName,
            jobTitle: interview.jobTitle,
            interviewType: interview.interviewType,
            interviewRoundText,
            interviewDateTime: this.getJobApplicationInterviewFormattedDateTime(
              interview.scheduledAt
            ),
            interviewMeetLink: interview.meetingLink,
            interviewStatus: this.getReadableInterviewStatus(interview.status),
            interviewTitle: interviewTitleForEmail,
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          };

        await emailLibrary.sendEmail(
          EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_INVITE,
          recipient,
          placeholders
        );
      })
    );
  }

  /**
   * sendJobApplicationInterviewStatusEmails
   *
   * Sends interview status emails in two categories:
   * 1) Candidate status email with ruleForCandidate
   * 2) Attendee status emails (excluding organizer) without recruiterNote/rules
   *
   * @param {DbJobApplicationInterviewDto} interview - Interview details.
   * @param {keyof typeof JobApplicationInterviewStatusEnum} statusLabel - SCHEDULED, RESCHEDULED, CANCELLED, COMPLETED.
   * @returns {Promise<void>}
   */
  async sendJobApplicationInterviewStatusEmails(
    interview: DbJobApplicationInterviewDto,
    statusLabel: keyof typeof JobApplicationInterviewStatusEnum
  ): Promise<void> {
    const interviewTitleForEmail: string = this.getJobApplicationInterviewEmailTitle(interview);
    const interviewRoundText: string = this.getJobApplicationInterviewRoundText(interview.roundNumber);

    // Candidate template
    const candidatePlaceholders: EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_STATUS_UPDATE =
      {
        recipientName: this.getCandidateRecipientName(interview),
        companyName: interview.companyName,
        jobTitle: interview.jobTitle,
        interviewType: interview.interviewType,
        interviewRoundText,
        interviewTitle: interviewTitleForEmail,
        interviewDateTime: this.getJobApplicationInterviewFormattedDateTime(
          interview.scheduledAt
        ),
        interviewMeetLink: interview.meetingLink,
        interviewStatus: this.getReadableInterviewStatus(statusLabel),
        ruleForCandidate: interview.ruleForCandidate ?? "",
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    await emailLibrary.sendEmail(
      EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_STATUS_UPDATE,
      { email: interview.applicantEmail },
      candidatePlaceholders
    );

    // Attendee template (exclude organizer and candidate)
    const attendeeRecipients = new Map<string, EmailSourceDestinationAddress>();
    interview.attendees.forEach((attendee) => {
      const attendeeEmail: string = attendee.email;
      if (
        attendeeEmail &&
        attendeeEmail !== interview.organizerEmail &&
        attendeeEmail !== interview.applicantEmail
      ) {
        attendeeRecipients.set(attendeeEmail, {
          email: attendeeEmail,
          fullName: attendee.name,
        });
      }
    });

    await Promise.all(
      Array.from(attendeeRecipients.values()).map(async (recipient) => {
        const placeholders: EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_STATUS_UPDATE =
          {
            recipientName: recipient.fullName?.toTitleCase() ?? recipient.email,
            companyName: interview.companyName,
            jobTitle: interview.jobTitle,
            interviewType: interview.interviewType,
            interviewRoundText,
            interviewTitle: interviewTitleForEmail,
            interviewDateTime: this.getJobApplicationInterviewFormattedDateTime(
              interview.scheduledAt
            ),
            interviewMeetLink: interview.meetingLink,
            interviewStatus: this.getReadableInterviewStatus(statusLabel),
            ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
          };

        await emailLibrary.sendEmail(
          EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_STATUS_UPDATE,
          recipient,
          placeholders
        );
      })
    );
  }

  /**
   * getJobApplicationInterviewApplicantEmailFromApplication
   *
   * Returns applicant email from user job application PK.
   *
   * @param {DbUserJobApplicationDto} jobApplication - Job application details.
   * @returns {string}
   */
  getJobApplicationInterviewApplicantEmailFromApplication(
    jobApplication: DbUserJobApplicationDto
  ): string {
    return getEmailFromPK(jobApplication.PK);
  }

  /**
   * getJobApplicationInterviewDefaultCalendarId
   *
   * Returns default calendar id.
   *
   * @returns {string}
   */
  getJobApplicationInterviewDefaultCalendarId(): string {
    console.log("Google Calendar ID from env:", process.env.APP_GCP_GOOGLE_CALENDAR_ID);
    return process.env.APP_GCP_GOOGLE_CALENDAR_ID!
  }

  /**
   * getJobApplicationInterviewGoogleMeetConferenceType
   *
   * Returns conference type used for Google Meet link generation.
   *
   * @returns {string}
   */
  getJobApplicationInterviewGoogleMeetConferenceType(): string {
    return APP_CONSTANTS.JOB_APPLICATION_INTERVIEW_CONSTANTS.GOOGLE_MEET_CONFERENCE_TYPE;
  }
}

export const jobApplicationInterviewHelperObj = new JobApplicationInterviewHelper();
