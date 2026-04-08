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
  /**
   * Escapes special characters in ICS text.
   * 
   * ICS format requires certain characters to be escaped with a backslash.
   * 
   * @param value The text to escape.
   * @returns The escaped text.
   */ 
  private escapeIcsText(value: string): string {
    return (value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  /**
   * foldIcsLine
   * 
   * Folds a line of ICS content if it exceeds the specified maximum length.
   * 
   * @param line A single line of ICS content to fold if it exceeds the max length.
   * @param maxLen The maximum length of a line before it is folded.
   * @returns The folded line.
   */
  private foldIcsLine(line: string, maxLen = 73): string {
    // RFC 5545: lines should be <= 75 octets; we keep a conservative char limit.
    if (line.length <= maxLen) return line;
    const chunks: string[] = [];
    let i = 0;
    while (i < line.length) {
      const chunk = line.slice(i, i + maxLen);
      chunks.push(i === 0 ? chunk : ` ${chunk}`);
      i += maxLen;
    }
    return chunks.join("\r\n");
  }

  /**
   * generateInterviewIcsContent
   *
   * Generates ICS calendar content for interview scheduling emails.
   *
   * @param {DbJobApplicationInterviewDto} interview - Interview details.
   * @param {Object} attendee - Attendee details (email and optional name).
   * @param {"REQUEST" | "CANCEL"} [method="REQUEST"] - ICS method type for scheduling or cancellation.
   * @returns {string} ICS file content as a string.
   */
  generateInterviewIcsContent(params: {
    interview: DbJobApplicationInterviewDto;
    attendee: { email: string; name?: string };
    method?: "REQUEST" | "CANCEL";
  }): string {
    const { interview, attendee } = params;
    const method = params.method ?? "REQUEST";

    const tz = interview.timezone || APP_CONSTANTS.APP_DEFAULT_TIMEZONE;
    const startUtc = DateTime.fromISO(interview.scheduledAt, { zone: tz })
      .toUTC()
      .toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endUtc = DateTime.fromISO(interview.endAt, { zone: tz })
      .toUTC()
      .toFormat("yyyyMMdd'T'HHmmss'Z'");
    const dtStampUtc = DateTime.utc().toFormat("yyyyMMdd'T'HHmmss'Z'");

    const summary = this.escapeIcsText(
      `Interview: ${interview.jobTitle} at ${interview.companyName}`
    );

    const descriptionParts: string[] = [
      `Interview for ${interview.jobTitle} at ${interview.companyName}.`,
      `Round: ${this.getJobApplicationInterviewRoundText(interview.roundNumber)} — ${interview.interviewType}`,
    ];
    if (interview.meetingLink) {
      descriptionParts.push(`Join link: ${interview.meetingLink}`);
    }
    const description = this.escapeIcsText(descriptionParts.join("\n"));

    const uid = this.escapeIcsText(`${interview.id}@worko`);
    const organizer = this.escapeIcsText(interview.organizerEmail);
    const attendeeEmail = this.escapeIcsText(attendee.email);
    const attendeeCn = this.escapeIcsText(
      attendee.name?.trim() ? attendee.name.trim() : this.getDisplayNameFromEmail(attendee.email)
    );

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "PRODID:-//Worko//Interview Scheduler//EN",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      `METHOD:${method}`,
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtStampUtc}`,
      `DTSTART:${startUtc}`,
      `DTEND:${endUtc}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `ORGANIZER:MAILTO:${organizer}`,
      `ATTENDEE;CN=${attendeeCn};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:MAILTO:${attendeeEmail}`,
      ...(interview.meetingLink
        ? [`URL:${this.escapeIcsText(interview.meetingLink)}`, "LOCATION:Online meeting"]
        : []),
      `STATUS:${method === "CANCEL" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    return lines.map((l) => this.foldIcsLine(l)).join("\r\n") + "\r\n";
  }

  /**
   * Gets the display name from an email address.
   * @param email The email address to extract the display name from.
   * @returns The display name.
   */
  private getDisplayNameFromEmail(email: string): string {
    const localPart = email.split("@")[0] ?? "";
    if (!localPart) return email;
    return localPart.replace(/[._-]+/g, " ").toTitleCase();
  }

  /**
   * Gets a human-readable interview status string.
   * @example "SCHEDULED" => "Scheduled"
   * @param status The interview status to convert.
   * @returns The human-readable status.
   */
  private getReadableInterviewStatus(status: string): string {
    return status.replace(/_/g, " ").toTitleCase();
  }

  /**
   * getCandidateRecipientName
   *
   * Determines the recipient name for the candidate in interview emails.
   * Priority: applicantName (if available and non-empty) > derived name from applicantEmail.
   *
   * @param {DbJobApplicationInterviewDto} interview - Interview details containing applicant info.
   * @returns {string} Recipient name for the candidate.
   */
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
   * @example 1 => "1st round" everything else => "next round"
   * @param {number} roundNumber - The interview round number.
   * @returns {string} Human-readable text for the interview round.
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
    return DateTime.fromISO(isoDateTime).toFormat("cccc, dd LLL yyyy 'at' h:mm a ZZZZ");
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
  ): Promise<void> {
    const interviewTitleForEmail: string = this.getJobApplicationInterviewEmailTitle(interview);
    const interviewRoundText: string = this.getJobApplicationInterviewRoundText(interview.roundNumber);
    const icsFilename = `interview-${interview.id}.ics`;

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

    await emailLibrary.sendEmailWithAttachments(
      EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_INVITE,
      { email: interview.applicantEmail },
      candidatePlaceholders,
      [
        {
          filename: icsFilename,
          contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
          content: this.generateInterviewIcsContent({
            interview,
            attendee: { email: interview.applicantEmail, name: candidatePlaceholders.recipientName },
            method: "REQUEST",
          }),
        },
      ]
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

        await emailLibrary.sendEmailWithAttachments(
          EmailTemplateEnum.JOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_INVITE,
          recipient,
          placeholders,
          [
            {
              filename: icsFilename,
              contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
              content: this.generateInterviewIcsContent({
                interview,
                attendee: { email: recipient.email, name: placeholders.recipientName },
                method: "REQUEST",
              }),
            },
          ]
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
