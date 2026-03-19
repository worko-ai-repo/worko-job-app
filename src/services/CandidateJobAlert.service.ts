
// Import firestore package
import { FieldValue, SetOptions } from "@google-cloud/firestore";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { candidateJobAlertDaoObj } from "../daos/CandidateJobAlert.dao";

// Import dtos
import { EmailTemplatePlaceholderCAND_JOBS_RECOMMENDATION } from "../dtos/EmailTemplatePlaceholder.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";
import { CandidateJobAlertListingFilterOptions } from "../dtos/CandidateJobAlert.dto";
import { JobLocationDto, MinMaxRange } from "../dtos/Common.dto";
import { SalaryRangeDto } from "../dtos/Job.dto";

// Import enums
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";
import { JobStatusEnum } from "../enums/Job.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";
import { gcpFirestoreBase64EncodeStrToLastKey } from "../helpers/gcp-firestore.helper";

// Import libraries
import { emailLibrary, EmailSourceDestinationAddress } from "../libraries/email.library";

// Import models
import { DbCandidateJobAlertDto } from "../db/gcp-firestore-models/CandidateJobAlert.model";
import { DbCandidateParsedCvDto } from "../db/gcp-firestore-models/CandidateParsedCv.model";
import { DbCandidateJobRecommendationDto } from "../db/gcp-firestore-models/CandidateJobRecommendation.model";
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import services
import { candidateJobRecommendationServiceObj } from "./CandidateJobRecommendation.service";
import { gcpFirestoreJobServiceObj } from "./GcpFirestoreJob.service";

class CandidateJobAlertService {
  async getCandidateJobAlertsByIds(candidateEmails: string[]) {
    return candidateJobAlertDaoObj.getCandidateJobAlertsByIds(
      candidateEmails,
    );
  }

  async createBulkCandidateJobAlert(
    data: DbCandidateJobAlertDto[],
    options?: SetOptions,
  ): Promise<boolean> {
    return candidateJobAlertDaoObj.createBulkCandidateJobAlert(data, options);
  }

  async updateCandidateJobAlertById(
    id: string,
    data: Partial<DbCandidateJobAlertDto>,
  ): Promise<DbCandidateJobAlertDto | undefined> {
    return candidateJobAlertDaoObj.updateCandidateJobAlertById(id, data);
  }

  async updateBulkCandidateJobAlertByIdsWithDifferentData(
    data: { id: string; updateData: Partial<DbCandidateJobAlertDto> }[],
  ): Promise<boolean> {
    return candidateJobAlertDaoObj.updateBulkCandidateJobAlertByIdsWithDifferentData(
      data,
    );
  }

  async performCreateOrUpdateBulkCandidateJobAlertFromCandParsedCv(
    mapCandParsed: Map<
      string,
      {
        candidate: DbCandidateParsedCvDto;
        distance: number;
      }
    >,
  ):Promise<(boolean | boolean[])[]> {
    if (!mapCandParsed.size) return [false];

    // Extract unique candidate emails
    const candidateEmails: string[] = Array.from(mapCandParsed.values()).map(
      ({ candidate }) => candidate.email.toLowerCase(),
    );

    // Fetch existing alerts for these emails
    const existingAlerts: DbCandidateJobAlertDto[] = await this.getCandidateJobAlertsByIds(candidateEmails);

    // Build a Set of existing emails
    const existingEmailSet: Set<string> = new Set(
      existingAlerts.map((alert: DbCandidateJobAlertDto) =>
        alert.candidateEmail.toLowerCase(),
      ),
    );

    // Prepare new alerts only (skip existing)
    const now: string = dateHelperObj.getISODate();

    const newAlerts: DbCandidateJobAlertDto[] = [];
    const alertsToUpdate: {
      id: string;
      updateData: Partial<DbCandidateJobAlertDto>;
    }[] = [];

    for (const { candidate } of mapCandParsed.values()) {
      const email: string = candidate.email.toLowerCase();

      if (existingEmailSet.has(email)) {
        // Update existing alert
        alertsToUpdate.push({
          id: email,
          updateData: {
            publishedJobRecommendationsCount: FieldValue.increment(1),
            updatedAt: now,
          },
        });
      } else {
        /**
         * @description
         * Scenario:-
         * 1. Two jobs created simultaneously
         * 2. Two Lambdas triggered
         * 3. Same candidate email = john@email.com
         * 4. Check existing → EMPTY
         * 5. Both run batch.set()
         * 6. We Use set(..., { merge: true }) to avoid duplicate emails
         */
        newAlerts.push({
          id: email,
          candidateEmail: email,
          candidateName: candidate.name.toLowerCase(),
          isEmailJobAlertEnabled: true,
          publishedJobRecommendationsCount: FieldValue.increment(1),
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    const results = [];

    if (alertsToUpdate.length) {
      results.push(
        this.updateBulkCandidateJobAlertByIdsWithDifferentData(
          alertsToUpdate,
        ),
      );
    }

    if (newAlerts.length) {
      // Batch insert in chunks of 300
      const batchSize: number = 300;
      const allBatchesPromises: Promise<boolean>[] = [];
      for (let i = 0; i < newAlerts.length; i += batchSize) {
        const batch: DbCandidateJobAlertDto[] = newAlerts.slice(i, i + batchSize);
        allBatchesPromises.push(this.createBulkCandidateJobAlert(batch, { merge: true }));
      }

      results.push(
        Promise.all(allBatchesPromises),
      );
    }

    return Promise.all(results);
  }

  async sendCandJobsMatchEmailCandidateJobAlert(
    toCandidateEmail: string,
    toCandidateName: string,
    jobs: {
      jobTitle: string;
      companyName: string;
      jobUrl: string;

      salaryRange?: SalaryRangeDto;

      experienceRange?: MinMaxRange;

      location?: JobLocationDto;
    }[],
  ) {
    if (!jobs || jobs.length < 1 || jobs.length > 3) {
      global.logger.error(
        "Jobs array must contain minimum 1 and maximum 3 items",
        {
          jobs,
          toCandidateEmail,
          toCandidateName,
        },
      );
      return {
        awsMessageId: null,
        systemLogId: null,
      };
    }

    const jobsHtml: string = jobs
      .map((job) => {
        /* ---------------- EXPERIENCE ---------------- */

        let experienceText = "";

        if (
          job.experienceRange?.min !== undefined &&
          job.experienceRange?.max !== undefined
        ) {
          experienceText = `${job.experienceRange.min}-${job.experienceRange.max} Years`;
        }

        /* ---------------- SALARY ---------------- */

        let salaryText = "";

        if (
          job.salaryRange?.min !== undefined &&
          job.salaryRange?.max !== undefined
        ) {
          salaryText = `₹${job.salaryRange.min}–₹${job.salaryRange.max} LPA`;
        }

        /* ---------------- LOCATION ---------------- */

        let locationText = "";

        if (job.location?.fullLocation?.length) {
          locationText = job.location.fullLocation.join(", ");
        } else if (job.location?.city?.length) {
          locationText = job.location.city.join(", ");
        }

        /* ---------------- DETAILS ---------------- */

        const details: string[] = [];

        if (experienceText) {
          details.push(`<strong>Experience:</strong> ${experienceText}`);
        }

        if (salaryText) {
          details.push(`<strong>CTC:</strong> ${salaryText}`);
        }

        if (locationText) {
          details.push(`<strong>Location:</strong> ${locationText}`);
        }

        const detailsHtml =
          details.length > 0
            ? `<p style="margin:8px 0 12px 0; font-size:14px; color:#555; line-height:20px;">
                ${details.join(" | ")}
              </p>`
            : "";

        /* ---------------- JOB CARD ---------------- */

        return `
  <div style="margin-bottom:20px; padding:18px; border:1px solid #e6e6e6; border-radius:6px;">

  <p style="margin:0; font-size:16px; font-weight:bold;">
  <a href="${job.jobUrl}" style="text-decoration:none; color:#182b45;">
  ${job.jobTitle.toTitleCase()}
  </a>
  </p>

  <p style="margin:4px 0 0 0; font-size:14px; color:#777;">
  ${job.companyName.toTitleCase()}
  </p>

  ${detailsHtml}

  <a href="${job.jobUrl}"
  style="display:inline-block;
  padding:8px 18px;
  background:#182b45;
  color:#ffffff;
  text-decoration:none;
  font-size:14px;
  border-radius:4px;">
  Apply Now
  </a>

  </div>
  `;
      })
      .join("");

    /* ---------------- TEXT VERSION ---------------- */

    const jobsText: string = jobs
      .map((job) => {
        const details: string[] = [];

        if (
          job.experienceRange?.min !== undefined &&
          job.experienceRange?.max !== undefined
        ) {
          details.push(
            `Experience: ${job.experienceRange.min}-${job.experienceRange.max} Years`,
          );
        }

        if (
          job.salaryRange?.min !== undefined &&
          job.salaryRange?.max !== undefined
        ) {
          details.push(
            `CTC: ₹${job.salaryRange.min}-${job.salaryRange.max} LPA`,
          );
        }

        if (job.location?.fullLocation?.length) {
          details.push(`Location: ${job.location.fullLocation.join(", ")}`);
        } else if (job.location?.city?.length) {
          details.push(`Location: ${job.location.city.join(", ")}`);
        }

        const detailText = details.length ? ` | ${details.join(" | ")}` : "";

        return `- ${job.jobTitle.toTitleCase()} | ${job.companyName.toTitleCase()}${detailText} | ${job.jobUrl}`;
      })
      .join("\n");

    /* ---------------- EMAIL ADDRESS ---------------- */

    const toAddress: EmailSourceDestinationAddress = {
      email: toCandidateEmail,
      fullName: toCandidateName.toTitleCase(),
    };

    /* ---------------- PLACEHOLDERS ---------------- */

    const emailPlaceholders: EmailTemplatePlaceholderCAND_JOBS_RECOMMENDATION =
      {
        candidateName: toCandidateName.toTitleCase(),
        jobsHtml,
        jobsText,
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    /* ---------------- SEND EMAIL ---------------- */

    return emailLibrary.sendEmail(
      EmailTemplateEnum.CAND_JOBS_RECOMMENDATION,
      toAddress,
      emailPlaceholders,
    );
  }

  async getAllCandidateJobAlertByFilterOptions(
    filterOptions: CandidateJobAlertListingFilterOptions,
  ) {
    return candidateJobAlertDaoObj.getAllCandidateJobAlertByFilterOptions(
      filterOptions,
    );
  }

  async getCandidateJobAlertForSendEmailsWithoutPagination() {
    let lastKey:
      | {
          gcpFirestoreDocumentId: string;
        }
      | undefined;
    const allCandidateJobAlerts: DbCandidateJobAlertDto[] = [];
    do {
      const result: GcpFirestoreRecordListingResponseDTO<
        DbCandidateJobAlertDto[]
      > = await this.getAllCandidateJobAlertByFilterOptions({
        pageSize: 1000,
        lastKey,
        isEmailJobAlertEnabled: true,
        publishedJobRecommendationsCountGreaterThan: 0,
      });
      const resultLastKey: string | undefined = result.pagination?.lastKey;
      allCandidateJobAlerts.push(...result.data);
      if (resultLastKey) {
        let decodedLastKey:
          | {
              gcpFirestoreDocumentId: string;
            }
          | undefined = gcpFirestoreBase64EncodeStrToLastKey(resultLastKey); // decoding base64 string to original value(possibly array of values)
        if (decodedLastKey) {
          lastKey = decodedLastKey;
        }
      }
    } while (lastKey);
    return allCandidateJobAlerts;
  }

  async retrieveAndSendEmailCandidateJobAlert(): Promise<
    [
      boolean,
      {
        awsMessageId: string | null;
        systemLogId: string | null;
      }[],
    ]
  > {
    const allCandidateJobAlerts: DbCandidateJobAlertDto[] =
      await this.getCandidateJobAlertForSendEmailsWithoutPagination();

    if(!allCandidateJobAlerts.length) {
      return [
        false,
        [
          {
            awsMessageId: null,
            systemLogId: null,
          }
        ]
      ]
    }

    const recommendationsToUpdate: {
      id: string;
      updateData: Partial<DbCandidateJobRecommendationDto>;
    }[] = [];
    const updatedAt: string = dateHelperObj.getISODate();
    const emailPromises: Promise<{
      awsMessageId: string | null;
      systemLogId: string | null;
    }>[] = [];

    // For each candidate retrieve from `candidateJobRecommendations` with pageSize: 3 and sortOrder order desc and send single email with 3 jobs and update "includedInEmailCount" in `candidateJobAlerts`
    for (const candidateJobAlert of allCandidateJobAlerts) {
      const candidateJobRecommendations: GcpFirestoreRecordListingResponseDTO<
        DbCandidateJobRecommendationDto[]
      > =
        await candidateJobRecommendationServiceObj.getAllCandidateJobRecommendationByFilterOptions(
          {
            pageSize: 3,
            sortOrder: GcpFirestoreSortOrderTypeEnum.DESCENDING,
            isIncludedInEmailCountLessThan: 3,
            candidateEmail: candidateJobAlert.candidateEmail,
            isJobPublished: true,
          },
        );

      // If no data found then continue
      if(!candidateJobRecommendations.data.length) continue

      const jobsToNotify: {
        jobTitle: string;
        companyName: string;
        jobUrl: string;
        salaryRange?: SalaryRangeDto;
        experienceRange?: MinMaxRange;
        location?: JobLocationDto;
      }[] = [];
      if (candidateJobRecommendations.data.length) {
        candidateJobRecommendations.data.forEach(
          async (candidateJobRecommendation: DbCandidateJobRecommendationDto) => {
            recommendationsToUpdate.push({
              id: candidateJobRecommendation.id,
              updateData: {
                includedInEmailCount: FieldValue.increment(1),
                updatedAt,
              },
            });
            const jobDetailsOnFireStore: DbGcpFirestoreJobDto | undefined = await gcpFirestoreJobServiceObj.getJobById(candidateJobRecommendation.jobId);
            jobsToNotify.push({
              jobTitle: candidateJobRecommendation.jobTitle,
              companyName: candidateJobRecommendation.companyName,
              jobUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_INTERNAL_JOB_URL.strtr({
                "{companyName}": candidateJobRecommendation.companyName,
                "{jobId}": candidateJobRecommendation.jobId,
              }),
              salaryRange: jobDetailsOnFireStore?.salaryRange,
              experienceRange: jobDetailsOnFireStore?.experienceRange,
              location: jobDetailsOnFireStore?.location,
            });
          },
        );
      }

      emailPromises.push(
        this.sendCandJobsMatchEmailCandidateJobAlert(
          candidateJobAlert.candidateEmail,
          candidateJobAlert.candidateName,
          jobsToNotify,
        ),
      );
    }

    return Promise.all([
      candidateJobRecommendationServiceObj.updateBulkCandidateJobRecommendationByIdsWithDifferentData(
        recommendationsToUpdate,
      ),
      Promise.all(emailPromises),
    ]);
  }

  async performJobStatusCandJobRecommendAlertUpdate(
    jobStatusBeforeUpdate: JobStatusEnum,
    jobId: string
  ): Promise<[boolean, boolean]> {
    const jobDetailsOnFireStore: DbGcpFirestoreJobDto | undefined = await gcpFirestoreJobServiceObj.getJobById(jobId);
    if(!jobDetailsOnFireStore) {
      global.logger.error(`Job details not found in firestore for jobId: ${jobId}`);
      return [false, false];
    }

    if(
      jobStatusBeforeUpdate === jobDetailsOnFireStore.status
    ) {
      global.logger.info(`Job status before and after update is same: "${jobStatusBeforeUpdate}", hence skipping "isJobPublished" field update in "candidateJobRecommendations" collection for jobId: ${jobId}`, {
        jobStatusBeforeUpdate,
        jobStatusAfterUpdate: jobDetailsOnFireStore.status
      });
      return [false, false];
    }

    const candidateJobRecommendations: GcpFirestoreRecordListingResponseDTO<
      DbCandidateJobRecommendationDto[]
    > =
      await candidateJobRecommendationServiceObj.getAllCandidateJobRecommendationByFilterOptions({
        jobId,
        pageSize: 1000,
      });
    if(!candidateJobRecommendations.data.length) {
      global.logger.error(`No "candidateJobRecommendations" found for jobId: ${jobId}`);
      return [false, false];
    }

    const candidateJobRecommendationsToUpdate: {
      id: string;
      updateData: Partial<DbCandidateJobRecommendationDto>;
    }[] = [];
    const candidateJobAlertsToUpdate: {
      id: string;
      updateData: Partial<DbCandidateJobAlertDto>;
    }[] = [];

    const updatedAt: string = dateHelperObj.getISODate();
    let isNowJobPublished: boolean;
    let incrementOrDecrementPublishedJobRecommendationsCount: FieldValue;
    if(
      jobStatusBeforeUpdate !== JobStatusEnum.PUBLISHED &&
      jobDetailsOnFireStore.status === JobStatusEnum.PUBLISHED
    ) {
      global.logger.info(`Update "isJobPublished" to true in "candidateJobRecommendations" for jobId: ${jobId}`);
      isNowJobPublished = true;
      incrementOrDecrementPublishedJobRecommendationsCount = FieldValue.increment(1);
    } else if(
      jobStatusBeforeUpdate === JobStatusEnum.PUBLISHED &&
      jobDetailsOnFireStore.status !== JobStatusEnum.PUBLISHED
    ) {
      global.logger.info(`Update "isJobPublished" to false in "candidateJobRecommendations" for jobId: ${jobId}`);
      isNowJobPublished = false;
      incrementOrDecrementPublishedJobRecommendationsCount = FieldValue.increment(-1);
    }

    candidateJobRecommendations.data.forEach((candidateJobRecommendation: DbCandidateJobRecommendationDto) => {
      candidateJobRecommendationsToUpdate.push({
        id: candidateJobRecommendation.id,
        updateData: {
          updatedAt,
          isJobPublished: isNowJobPublished,
        },
      });

      candidateJobAlertsToUpdate.push({
        id: candidateJobRecommendation.candidateEmail,
        updateData: {
          updatedAt,
          publishedJobRecommendationsCount: incrementOrDecrementPublishedJobRecommendationsCount,
        },
      });
    })

    if(!candidateJobRecommendationsToUpdate.length) {
      global.logger.info(`No candidateJobRecommendationsToUpdate found for jobId: ${jobId}`);
      return [false, false];
    }

    return Promise.all([
      candidateJobRecommendationServiceObj.updateBulkCandidateJobRecommendationByIdsWithDifferentData(candidateJobRecommendationsToUpdate),
      candidateJobAlertServiceObj.updateBulkCandidateJobAlertByIdsWithDifferentData(candidateJobAlertsToUpdate), 
    ]);
  }
}

const candidateJobAlertServiceObj =
  new CandidateJobAlertService();
export {
  candidateJobAlertServiceObj,
  CandidateJobAlertService,
};
