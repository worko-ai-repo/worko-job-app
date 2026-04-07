// Import npm packages
import { JWT } from "google-auth-library";
import { google } from "googleapis";

// Import configs
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";

// Import dtos
import { GcpFirestoreSecretResponseDto } from "../dtos/Common.gcp-firestore.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import APP_CONSTANTS from "../configs/constants.config";

/**
 * GcpGoogleCalendarLibrary
 *
 * Google Calendar API client using Service Account (JWT).
 */
class GcpGoogleCalendarLibrary {
  private calendarClient?: ReturnType<typeof google.calendar>;

  constructor() {
    if (!process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE) {
      global.logger.error(
        `AWS_SECRETS_MANAGER is not defined in .env file.`,
        {
          awsSecretsManager:
            process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE,
        }
      );

      throw new BaseError(
        "Google calendar integration is not configured.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * Get Calendar Client (Service Account)
   */
  async getCalendarClient(): Promise<ReturnType<typeof google.calendar>> {
    if (this.calendarClient) {
      return this.calendarClient;
    }

    try {
      const secretName =
        process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE!;

      const credentials: GcpFirestoreSecretResponseDto =
        await awsClientSecretsManagerLibrary.getParsedSecret<GcpFirestoreSecretResponseDto>(
          secretName
        );

      if (!credentials.client_email || !credentials.private_key) {
        throw new Error("Missing client_email or private_key");
      }
      const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key.replace(/\\n/g, "\n"), // IMPORTANT FIX
        scopes: [
          APP_CONSTANTS.JOB_APPLICATION_INTERVIEW_CONSTANTS.GOOGLE_CALENDAR_SCOPES,
        ],
        subject: APP_CONSTANTS.JOB_APPLICATION_INTERVIEW_CONSTANTS.GOOGLE_CALENDAR_SUBJECT,
      });

      this.calendarClient = google.calendar({
        version: "v3",
        auth: auth as any,
      });
      global.logger.info("Google Calendar client initialized successfully", {
        methodName: "getCalendarClient",
      });
      return this.calendarClient;
    } catch (error) {
      global.logger.error("Google Calendar initialization failed", {
        methodName: "getCalendarClient",
        error,
      });

      throw new BaseError(
        "Google calendar integration failed.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * Create Event (Interview / Meeting)
   */
  async createEvent(params: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: { email: string }[];
    calendarId?: string; // optional override
  }) {
    try {
      global.logger.info("Creating calendar event with params [Xfe]", {
        methodName: "createEvent",
        params,
      });

      const calendar = await this.getCalendarClient();

      const event = await calendar.events.insert({
        calendarId: params.calendarId || "primary",
        requestBody: {
          summary: params.summary,
          description: params.description,
          start: {
            dateTime: params.startDateTime,
          },
          end: {
            dateTime: params.endDateTime,
          },
          attendees: params.attendees,
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
            },
          },
        },
        conferenceDataVersion: 1,
        sendUpdates: "none", // Don't send email notifications to attendees
      });

      return event.data;
    } catch (error) {
      global.logger.error("Google Calendar createEvent failed", {
        methodName: "createEvent",
        error,
      });

      throw new BaseError(
        "Failed to create calendar event.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }
}

export { GcpGoogleCalendarLibrary };