// Import configs
import APP_CONSTANTS from "../configs/constants.config";
import { gcpGoogleCalendarLibrary } from "../configs/gcp-sdk.config";

// Import daos
import { jobApplicationInterviewFirestoreDaoObj } from "../daos/JobApplicationInterview.firestore.dao";

// Import DTOs
import {
  JobApplicationInterviewCancelApiDto,
  JobApplicationInterviewCompleteApiDto,
  JobApplicationInterviewListFilterOptions,
  JobApplicationInterviewRescheduleApiDto,
  JobApplicationInterviewScheduleApiDto,
} from "../dtos/JobApplicationInterview.dto";

// Import enums
import {
  JobApplicationInterviewAttendeeTypeEnum,
  JobApplicationInterviewProviderEnum,
  JobApplicationInterviewStatusEnum,
} from "../enums/JobApplicationInterview.enum";

// Import helpers
import { jobApplicationInterviewHelperObj } from "../helpers/JobApplicationInterview.helper";

import { getActionByUserId } from "../helpers/user.helper";

// Import models
import { DbJobApplicationInterviewDto } from "../db/gcp-firestore-models/JobApplicationInterview.model";

// Import services
import UlidService from "./Ulid.service";

// Import utils
import { dateHelperObj } from "../helpers/date.helper";
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class JobApplicationInterviewService {
  /**
   * scheduleUserApplicationInterview
   *
   * Schedules a new interview round for a job application.
   *
   * @param {string} applicationId - Job application id.
   * @param {JobApplicationInterviewScheduleApiDto} requestBody - API payload.
   * @returns {Promise<DbJobApplicationInterviewDto>}
   */
  async scheduleUserApplicationInterview(
    applicationId: string,
    requestBody: JobApplicationInterviewScheduleApiDto
  ): Promise<DbJobApplicationInterviewDto> {
    global.logger.info("Schedule User Application Interview [Service]", {
      methodName: this.scheduleUserApplicationInterview.name,
      applicationId,
    });

    const jobApplication =
      await jobApplicationInterviewHelperObj.assertJobApplicationInProcessingInterviewStatus(
        applicationId
      );

    const existingInterviews: DbJobApplicationInterviewDto[] =
      await jobApplicationInterviewFirestoreDaoObj.getAllUserApplicationInterviewsByApplicationId(
        applicationId
      );

    const activeRound = existingInterviews.find((it) =>
      [
        JobApplicationInterviewStatusEnum.SCHEDULED,
        JobApplicationInterviewStatusEnum.RESCHEDULED,
      ].includes(it.status)
    );

    const completedRounds = existingInterviews.filter(
      (it) => it.status === JobApplicationInterviewStatusEnum.COMPLETED
    ).length;

    if (activeRound) {
      throw new BaseError(
        "An active interview already exists. Complete or cancel it before scheduling a new one.",
        HttpStatusCode.CONFLICT_409
      );
    }

    if (completedRounds >= APP_CONSTANTS.JOB_APPLICATION_INTERVIEW_CONSTANTS.MAX_COMPLETED_ROUNDS) {
      throw new BaseError(
        "Maximum interview round limit reached for this job application.",
        HttpStatusCode.CONFLICT_409
      );
    }

    const applicantEmail: string =
      jobApplicationInterviewHelperObj.getJobApplicationInterviewApplicantEmailFromApplication(
        jobApplication
      );
    const organizerEmail: string = global.requestLocalContext.userEmail;

    const attendeesForCalendar: { email: string }[] = [];
    attendeesForCalendar.push({ email: applicantEmail });
    attendeesForCalendar.push({ email: organizerEmail });

    (requestBody.attendees ?? []).forEach((a) => {
      attendeesForCalendar.push({ email: a.email });
    });

    const calendarClient = await gcpGoogleCalendarLibrary.getCalendarClient();
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    const eventResponse = await calendarClient.events.insert({
      calendarId: jobApplicationInterviewHelperObj.getJobApplicationInterviewDefaultCalendarId(),
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: requestBody.title,
        description: `Interview for ${requestBody.jobTitle} at ${requestBody.companyName}.`,
        start: {
          dateTime: requestBody.startTime,
          timeZone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE,
        },
        end: {
          dateTime: requestBody.endTime,
          timeZone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE,
        },
        attendees: attendeesForCalendar,
        conferenceData: {
          createRequest: {
            requestId: UlidService.getUlidId(),
            conferenceSolutionKey: {
              type: jobApplicationInterviewHelperObj.getJobApplicationInterviewGoogleMeetConferenceType(),
            },
          },
        },
      },
    });

    const meetLink: string | undefined = eventResponse?.data?.hangoutLink ?? undefined;
    const eventId: string | undefined = eventResponse?.data?.id ?? undefined;

    if (!meetLink || !eventId) {
      global.logger.error(
        "Google Meet event creation returned missing hangoutLink/id. Interview not persisted.",
        {
          methodName: "scheduleUserApplicationInterview",
          applicationId,
          hasMeetLink: !!meetLink,
          hasEventId: !!eventId,
        }
      );

      throw new BaseError(
        "Unable to create Google meet event.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    const nowIso = dateHelperObj.getISODate();
    const interviewId = UlidService.getUlidId();

    const createdInterview: DbJobApplicationInterviewDto | undefined =
      await jobApplicationInterviewFirestoreDaoObj.createUserApplicationInterview({
        id: interviewId,
        createdAt: nowIso,
        updatedAt: nowIso,
        applicationId,
        jobId: jobApplication.jobId,
        companyId: jobApplication.companyId,
        applicantEmail,
        applicantId: jobApplication.id,
        organizerId: actionByCorporateUserId ?? actionByUserId ?? "unknown", //@Todo: Throw error in case of unknown and log the error
        organizerEmail,
        interviewType: requestBody.interviewType,
        jobTitle: requestBody.jobTitle,
        companyName: requestBody.companyName, 
        roundNumber: existingInterviews.length + 1,
        status: JobApplicationInterviewStatusEnum.SCHEDULED,
        scheduledAt: requestBody.startTime,
        endAt: requestBody.endTime,
        timezone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE,
        meetingProvider: JobApplicationInterviewProviderEnum.GOOGLE_MEET,
        meetingLink: meetLink,
        providerEventId: eventId,
        attendees: (requestBody.attendees ?? []).map((a) => ({
          type: a.type,
          email: a.email,
          name: a.name,
          userId: a.userId,
        })),
        completion: {},
        recruiterNote: requestBody.recruiterNote ?? undefined,
        ruleForCandidate: requestBody.ruleForCandidate ?? undefined,
        updatedByUserId: actionByUserId,
        updatedByCorporateUserId: actionByCorporateUserId,
      });

    if (!createdInterview) {
      throw new BaseError(
        "Unable to persist interview details.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    await jobApplicationInterviewHelperObj.sendJobApplicationInterviewInviteEmails(
      createdInterview,
      requestBody.title
    );
    return createdInterview;
  }

  /**
   * getScheduledUserApplicationInterviewById
   *
   * Returns interview details by interview id.
   *
   * @param {string} interviewId - Interview id.
   * @returns {Promise<DbJobApplicationInterviewDto>}
   */
  async getScheduledUserApplicationInterviewById(
    interviewId: string
  ): Promise<DbJobApplicationInterviewDto> {
    const interview = await jobApplicationInterviewFirestoreDaoObj.getUserApplicationInterviewById(
      interviewId
    );
    if (!interview) {
      throw new BaseError("Interview not found.", HttpStatusCode.NOT_FOUND_404);
    }
    return interview;
  }

  /**
   * getScheduledUserApplicationInterviewsByApplicationId
   *
   * Returns interviews by application id with pagination filters.
   *
   * @param {string} applicationId - Job application id.
   * @param {JobApplicationInterviewListFilterOptions} filterOptions - Parsed listing options.
   * @returns {Promise<any>}
   */
  async getScheduledUserApplicationInterviewsByApplicationId(
    applicationId: string,
    filterOptions: JobApplicationInterviewListFilterOptions
  ): Promise<any> {
    return jobApplicationInterviewFirestoreDaoObj.getUserApplicationInterviewsByApplicationId(
      applicationId,
      filterOptions
    );
  }

  /**
   * rescheduleUserApplicationInterview
   *
   * Reschedules an existing interview round.
   *
   * @param {string} applicationId - Job application id.
   * @param {string} interviewId - Interview id.
   * @param {JobApplicationInterviewRescheduleApiDto} requestBody - API payload.
   * @returns {Promise<DbJobApplicationInterviewDto>}
   */
  async rescheduleUserApplicationInterview(
    applicationId: string,
    interviewId: string,
    requestBody: JobApplicationInterviewRescheduleApiDto
  ): Promise<DbJobApplicationInterviewDto> {
    await jobApplicationInterviewHelperObj.assertJobApplicationInProcessingInterviewStatus(
      applicationId
    );

    const interview = await this.getScheduledUserApplicationInterviewById(interviewId);
    if (
      ![
        JobApplicationInterviewStatusEnum.SCHEDULED,
        JobApplicationInterviewStatusEnum.RESCHEDULED,
      ].includes(interview.status)
    ) {
      throw new BaseError(
        "Only scheduled/rescheduled interviews can be rescheduled.",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const calendarClient = await gcpGoogleCalendarLibrary.getCalendarClient();
    await calendarClient.events.patch({
      calendarId: jobApplicationInterviewHelperObj.getJobApplicationInterviewDefaultCalendarId(),
      eventId: interview.providerEventId,
      sendUpdates: "none",
      requestBody: {
        summary: requestBody.title,
        description: `Interview for ${interview.jobTitle} at ${interview.companyName}.`,
        start: { dateTime: requestBody.startTime, timeZone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE },
        end: { dateTime: requestBody.endTime, timeZone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE },
      },
    });

    const nowIso = dateHelperObj.getISODate();
    const updated = await jobApplicationInterviewFirestoreDaoObj.updateUserApplicationInterviewById(
      interviewId,
      {
        status: JobApplicationInterviewStatusEnum.RESCHEDULED,
        scheduledAt: requestBody.startTime,
        endAt: requestBody.endTime,
        timezone: APP_CONSTANTS.APP_DEFAULT_TIMEZONE,
        updatedAt: nowIso,
      }
    );

    if (!updated) {
      throw new BaseError(
        "Unable to reschedule interview.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    await jobApplicationInterviewHelperObj.sendJobApplicationInterviewStatusEmails(
      updated,
      "RESCHEDULED"
    );
    return updated;
  }

  /**
   * cancelUserApplicationInterview
   *
   * Cancels an existing interview round.
   *
   * @param {string} applicationId - Job application id.
   * @param {string} interviewId - Interview id.
   * @param {JobApplicationInterviewCancelApiDto} requestBody - API payload.
   * @returns {Promise<DbJobApplicationInterviewDto>}
   */
  async cancelUserApplicationInterview(
    applicationId: string,
    interviewId: string,
    requestBody: JobApplicationInterviewCancelApiDto
  ): Promise<DbJobApplicationInterviewDto> {
    await jobApplicationInterviewHelperObj.assertJobApplicationInProcessingInterviewStatus(
      applicationId
    );
    const interview = await this.getScheduledUserApplicationInterviewById(interviewId);

    const calendarClient = await gcpGoogleCalendarLibrary.getCalendarClient();
    await calendarClient.events.delete({
      calendarId: jobApplicationInterviewHelperObj.getJobApplicationInterviewDefaultCalendarId(),
      eventId: interview.providerEventId,
      sendUpdates: "none",
    });

    const nowIso = dateHelperObj.getISODate();
    const updated = await jobApplicationInterviewFirestoreDaoObj.updateUserApplicationInterviewById(
      interviewId,
      {
        status: JobApplicationInterviewStatusEnum.CANCELLED,
        cancellationReason: requestBody.cancellationReason,
        cancellationFeedback: requestBody.cancellationFeedback ?? undefined,
        updatedAt: nowIso,
      }
    );

    if (!updated) {
      throw new BaseError("Unable to cancel interview.", HttpStatusCode.INTERNAL_SERVER_ERROR_500);
    }

    await jobApplicationInterviewHelperObj.sendJobApplicationInterviewStatusEmails(
      updated,
      "CANCELLED"
    );
    return updated;
  }

  /**
   * completeUserApplicationInterview
   *
   * Adds completion feedback for an interview round.
   *
   * Behaviour:
   * - If caller is admin / corporate (non-evaluator) → writes organizer completion
   *   and marks round as COMPLETED.
   * - If caller is evaluator → writes/updates entry under completion.evaluators[evaluatorId].
   *
   * @param {string} applicationId - Job application id.
   * @param {string} interviewId - Interview id.
   * @param {JobApplicationInterviewCompleteApiDto} requestBody - API payload.
   * @returns {Promise<DbJobApplicationInterviewDto>}
   */
  async completeUserApplicationInterview(
    applicationId: string,
    interviewId: string,
    requestBody: JobApplicationInterviewCompleteApiDto
  ): Promise<DbJobApplicationInterviewDto> {
    await jobApplicationInterviewHelperObj.assertJobApplicationInProcessingInterviewStatus(
      applicationId
    );

    // Ensure interview exists
    const interview = await this.getScheduledUserApplicationInterviewById(interviewId);

    const cognitoUserId: string = global.requestLocalContext.userId;
    const cognitoUserGroups: string[] = global.requestLocalContext.cognitoUserGroups ?? [];

    //@TODO Check if the user has proper authorization (must be an evaluator)
   
    const isEvaluator: boolean = cognitoUserGroups.includes(
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.EVALUATOR
    );

    const nowIso = dateHelperObj.getISODate();
    let updated: DbJobApplicationInterviewDto | undefined;

    if (!isEvaluator) {
      /**
       * Organizer / admin / corporate completion.
       * Once organizer feedback is set, it cannot be submitted again.
       */
      if (interview.completion?.organizer) {
        throw new BaseError(
          "Organizer has already submitted completion feedback for this interview.",
          HttpStatusCode.CONFLICT_409
        );
      }

      // When organizer completes, we mark the round as COMPLETED.
      const existingEvaluators = interview.completion?.evaluators ?? {};

      updated = await jobApplicationInterviewFirestoreDaoObj.updateUserApplicationInterviewById(
        interviewId,
        {
          status: JobApplicationInterviewStatusEnum.COMPLETED,
          completion: {
            organizer: {
              rating: requestBody.organizer.rating,
              feedback: requestBody.organizer.feedback,
              submittedAt: nowIso,
            },
            evaluators: existingEvaluators,
          },
          updatedAt: nowIso,
        }
      );
    } else {
      /**
       * Evaluator completion.
       * Evaluator must be attached as attendee with type EVALUATOR and userId.
       * Each evaluator can submit exactly one completion entry.
       */
      const evaluatorAttendee = interview.attendees.find(
        (attendee) =>
          attendee.type === JobApplicationInterviewAttendeeTypeEnum.EVALUATOR &&
          attendee.userId === cognitoUserId
      );

      if (!evaluatorAttendee) {
        throw new BaseError(
          "Evaluator is not allowed to submit feedback for this interview.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const existingEvaluators = interview.completion?.evaluators ?? {};

      if (existingEvaluators[cognitoUserId]) {
        throw new BaseError(
          "Evaluator has already submitted completion feedback for this interview.",
          HttpStatusCode.CONFLICT_409
        );
      }

      updated = await jobApplicationInterviewFirestoreDaoObj.updateUserApplicationInterviewById(
        interviewId,
        {
          completion: {
            organizer: interview.completion?.organizer,
            evaluators: {
              ...existingEvaluators,
              [cognitoUserId]: {
                rating: requestBody.organizer.rating,
                feedback: requestBody.organizer.feedback,
                submittedAt: nowIso,
                submittedById: cognitoUserId,
              },
            },
          },
          updatedAt: nowIso,
        } as Partial<DbJobApplicationInterviewDto>
      );
    }

    if (!updated) {
      throw new BaseError(
        "Unable to complete interview.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    await jobApplicationInterviewHelperObj.sendJobApplicationInterviewStatusEmails(
      updated,
      "COMPLETED"
    );

    return updated;
  }
}

const jobApplicationInterviewServiceObj = new JobApplicationInterviewService();
export { jobApplicationInterviewServiceObj, JobApplicationInterviewService };
