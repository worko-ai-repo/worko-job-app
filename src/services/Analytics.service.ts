// Import dtos
import {
  CriticalDropoffResponse,
  FunnelVelocityResponse,
  OnboardingCandidate,
  OnboardingPipelineResponse,
  HiringTrendGranularity,
  HiringTrendResponse,
  HiringTrendPoint,
} from "../dtos/Analytics.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  PaginatedResultsWithMatchingConditionsResponse,
} from "../dtos/Common.dto";
import { UserJobApplicationListingFilterOptions } from "../dtos/UserJobApplication.dto";
import { CompanyJobListingFilterOptions } from "../dtos/CompanyJob.dto";
import { RequestEvaluationListingFilterOptions } from "../dtos/RequestEvaluation.dto";

// Import enums
import { JobStatusEnum } from "../enums/Job.enum";
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { SortOrderTypeEnum } from "../enums/Common.enum";

// Import daos
import { companyJobDaoObj } from "../daos/CompanyJob.dao";
import { userJobApplicationDao } from "../daos/UserJobApplication.dao";
import { requestEvaluationDao } from "../daos/RequestEvaluation.dao";

// Import services
import { gcpFirestoreJobServiceObj } from "./GcpFirestoreJob.service";

// Import models
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbRequestEvaluationDto } from "../db/models/RequestEvaluation.model";

// Import utils
import APP_CONSTANTS from "../configs/constants.config";
import userDetailServiceObj from "./UserDetail.service";
import { UserDetailProfileInfoType } from "../types/UserDetail.type";
import {
  computeDropoffFunnel,
  computeStats,
  getBucketRange,
  getEntityCreatedAt,
  extractApplicantEmailFromPk,
  resolveDateRange,
  computeFunnelMetricsFromApplications,
  paginateThroughResults,
} from "../helpers/Analytics.helper";

/**
 * AnalyticsService
 *
 * Service layer responsible for aggregating analytics metrics
 * across jobs and job applications.
 */
class AnalyticsService {
  // Private constants for analytics configuration
  private readonly DEFAULT_DATE_RANGE_DAYS = 30;
  private readonly DEFAULT_HIRING_TREND_RANGE_DAYS = 365;
  private readonly ADMIN_JOB_LIMIT = 500;
  private readonly ADMIN_APPLICATION_LIMIT = 2000;

  async getRequestEvaluationsByFilterOptionsForCompany(
    filterOptions: RequestEvaluationListingFilterOptions
  ): Promise<PaginatedResultsWithMatchingConditionsInternalResponse<DbRequestEvaluationDto[]>> {
    global.logger.info("Get Request Evaluations By Filter Options [Service]", {
      filePath: __filename,
      methodName: this.getRequestEvaluationsByFilterOptionsForCompany.name,
    });

    const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsResponse<DbRequestEvaluationDto> =
      await requestEvaluationDao.getRequestEvaluationsByFilterOptionsForCompany(filterOptions);

    const { lastKey, count, timesQueried, queriedCount, ...requestEvaluationData } =
      requestEvaluationDetails;

    const requestEvaluationArray: DbRequestEvaluationDto[] = Object.values(requestEvaluationData);

    return {
      data: requestEvaluationArray,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };
  }

  /**
   * getFunnelVelocityAggregate
   *
   * Computes funnel velocity metrics aggregated across multiple jobs.
   * If `jobIds` are provided, aggregation is limited to those jobs;
   * otherwise it is computed across all jobs in the company (or all companies when companyId is omitted).
   */
  async getFunnelVelocityAggregate(params: {
    companyId?: string;
    corporateRecruiterUserId?: string;
    jobIds?: string[];
    dateRangeInDays?: number;
    jobStatusFilter?: "ALL" | "PUBLISHED";
  }): Promise<FunnelVelocityResponse> {
    global.logger.info("Get Funnel Velocity Aggregate [Service]", {
      filePath: __filename,
      methodName: this.getFunnelVelocityAggregate.name,
      params,
    });

    const rangeInDays: number = params.dateRangeInDays ?? this.DEFAULT_DATE_RANGE_DAYS;
    const { fromDate, toDate } = resolveDateRange(rangeInDays);

    global.logger.info("Date range calculated [Service]", {
      methodName: this.getFunnelVelocityAggregate.name,
      rangeInDays,
      fromDate: new Date(fromDate!).toISOString(),
      toDate: new Date(toDate!).toISOString(),
    });

    // Add admin query limits
    const isAdminQuery = !params.companyId;
    const applicationLimit = isAdminQuery ? this.ADMIN_APPLICATION_LIMIT : undefined;

    global.logger.info("Fetching funnel velocity data [Service]", {
      methodName: this.getFunnelVelocityAggregate.name,
      isAdminQuery,
      applicationLimit,
      companyId: params.companyId,
      jobIdsProvided: params.jobIds?.length ?? 0,
    });

    let applications: DbUserJobApplicationDto[] = [];

    try {
      if (params.jobIds && params.jobIds.length) {
        // Sequential fetching for specific jobs
        global.logger.info("Fetching applications for specific jobs [Service]", {
          methodName: this.getFunnelVelocityAggregate.name,
          jobCount: params.jobIds.length,
        });
        const startTime = Date.now();

        for (const jobId of params.jobIds) {
          const appsForJob = await this.getAllApplicationsForJob(jobId, {
            fromDate: fromDate!,
            toDate: toDate!,
          });
          applications.push(...appsForJob);

          // Small delay between jobs for admin queries
          if (isAdminQuery && params.jobIds.length > 5) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        global.logger.info("Applications for specific jobs fetched [Service]", {
          methodName: this.getFunnelVelocityAggregate.name,
          count: applications.length,
          durationMs: Date.now() - startTime,
        });
      } else {
        // Fetch all applications for company with limit
        global.logger.info("Fetching all applications for company [Service]", {
          methodName: this.getFunnelVelocityAggregate.name,
        });
        const startTime = Date.now();

        applications = await this.getAllApplicationsForCompany(
          {
            companyId: params.companyId,
            corporateRecruiterUserId: params.corporateRecruiterUserId,
            fromDate: fromDate!,
            toDate: toDate!,
          },
          applicationLimit
        );

        global.logger.info("Applications fetched [Service]", {
          methodName: this.getFunnelVelocityAggregate.name,
          count: applications.length,
          dateRange: params.dateRangeInDays,
          durationMs: Date.now() - startTime,
          limitReached: applicationLimit && applications.length >= applicationLimit,
        });
      }
    } catch (error) {
      global.logger.error("Error fetching funnel velocity data [Service]", {
        methodName: this.getFunnelVelocityAggregate.name,
        error,
        applicationsFetched: applications.length,
      });
      throw error;
    }

    const { averageDaysPerStage, overallAverageDays, stageBreakdown, applicationsAnalyzed } =
      computeFunnelMetricsFromApplications(applications, true);

    return {
      jobId: "aggregate",
      jobTitle: "Aggregate",
      totalApplications: applications.length,
      applicationsAnalyzed,
      averageDaysPerStage,
      overallAverageDays,
      stageBreakdown,
    };
  }

  /**
   * getOnboardingPipelineData
   *
   * Returns onboarding pipeline metrics for HIRED / JOINED candidates.
   */
  async getOnboardingPipelineData(params: {
    companyId?: string;
    corporateRecruiterUserId?: string;
    jobId?: string;
    status?: JobApplicationStatus; // HIRED or JOINED
    includeDetails?: boolean;
    dateRangeInDays?: number;
  }): Promise<OnboardingPipelineResponse> {
    global.logger.info("Get Onboarding Pipeline Data [Service]", {
      filePath: __filename,
      methodName: this.getOnboardingPipelineData.name,
      params,
    });

    const { fromDate, toDate } = resolveDateRange(params.dateRangeInDays);

    const applications = await this.getOnboardingApplications({
      companyId: params.companyId,
      corporateRecruiterUserId: params.corporateRecruiterUserId,
      jobId: params.jobId,
      status: params.status,
      fromDate,
      toDate,
    });

    let totalHired = 0;
    let totalJoined = 0;
    let totalDaysToJoin = 0;
    let daysToJoinCount = 0;

    // Pre-compute joined applications only (for the list the UI needs)
    const joinedApplications: DbUserJobApplicationDto[] = [];

    for (const app of applications) {
      const hired = app.status === JobApplicationStatus.HIRED;
      const joined = app.status === JobApplicationStatus.JOINED;

      if (hired || joined) {
        totalHired++;
      }
      if (joined) {
        totalJoined++;
        joinedApplications.push(app);
      }

      let hiredDate: string | undefined;
      let joinedDate: string | undefined;

      // Derive hired / joined dates from statusTracker
      if (Array.isArray(app.statusTracker)) {
        for (const tracker of app.statusTracker) {
          if (
            tracker.newStatus === JobApplicationStatus.HIRED &&
            tracker.actionDate &&
            !hiredDate
          ) {
            hiredDate = tracker.actionDate;
          }
          if (
            tracker.newStatus === JobApplicationStatus.JOINED &&
            tracker.actionDate &&
            !joinedDate
          ) {
            joinedDate = tracker.actionDate;
          }
        }
      }

      if (hiredDate && joinedDate) {
        const diffMs = new Date(joinedDate).getTime() - new Date(hiredDate).getTime();
        if (!Number.isNaN(diffMs) && diffMs >= 0) {
          const daysToJoin = diffMs / (24 * 60 * 60 * 1000);
          totalDaysToJoin += daysToJoin;
          daysToJoinCount++;
        }
      }
    }

    const candidates: OnboardingCandidate[] = [];

    if (params.includeDetails && joinedApplications.length) {
      // Build email and jobId sets for enrichment
      const emailSet: Set<string> = new Set();
      const jobIdSet: Set<string> = new Set();

      for (const app of joinedApplications) {
        const email = extractApplicantEmailFromPk(app.PK);
        if (email) {
          emailSet.add(email);
        }
        if (app.jobId) {
          jobIdSet.add(app.jobId);
        }
      }

      // Fetch candidate names
      const emailList: string[] = Array.from(emailSet);
      const userProfiles: UserDetailProfileInfoType[] =
        await userDetailServiceObj.getUserDetailsByEmailIds(emailList);
      const emailToNameMap: Map<string, string> = new Map();
      userProfiles.forEach((profile) => {
        const emailFromProfile: string =
          profile.userDetails?.emailList?.primary ??
          Object.values(profile.userDetails?.emailList ?? {})[0] ??
          "";
        if (emailFromProfile) {
          emailToNameMap.set(emailFromProfile, profile.userDetails.name);
        }
      });

      // Fetch job titles
      const jobIdList: string[] = Array.from(jobIdSet);
      const jobIdToTitleMap: Map<string, string> = new Map();
      await Promise.all(
        jobIdList.map(async (jobId: string) => {
          try {
            const job = await gcpFirestoreJobServiceObj.getJobById(jobId);
            if (job) {
              jobIdToTitleMap.set(jobId, job.jobTitle);
            }
          } catch {
            // Ignore missing jobs for analytics summary
          }
        })
      );

      // Build candidate list with joined details
      for (const app of joinedApplications) {
        let joinedDate: string | undefined;

        if (Array.isArray(app.statusTracker)) {
          for (const tracker of app.statusTracker) {
            if (tracker.newStatus === JobApplicationStatus.JOINED && tracker.actionDate) {
              joinedDate = tracker.actionDate;
              break;
            }
          }
        }

        const applicantEmail = extractApplicantEmailFromPk(app.PK);
        const applicantName = emailToNameMap.get(applicantEmail) ?? "";

        const jobTitle = jobIdToTitleMap.get(app.jobId) ?? "";

        candidates.push({
          applicationId: app.id,
          jobId: app.jobId,
          jobTitle,
          applicantId: "",
          applicantName,
          applicantEmail,
          hiredDate: "", // Focus on joined details for onboarding UI
          joinedDate: joinedDate ?? "",
          daysToJoin: undefined,
        });
      }
    }

    const pendingJoining = totalHired - totalJoined;
    const averageDaysToJoin = daysToJoinCount > 0 ? totalDaysToJoin / daysToJoinCount : 0;

    return {
      totalHired,
      totalJoined,
      pendingJoining,
      averageDaysToJoin,
      candidates,
    };
  }

  /**
   * getCriticalDropoffData
   *
   * Analyses status tracker to identify stages and jobs with highest dropoffs.
   */
  async getCriticalDropoffData(params: {
    companyId?: string;
    corporateRecruiterUserId?: string;
    jobId?: string;
    dateRangeInDays?: number;
    topN?: number;
  }): Promise<CriticalDropoffResponse> {
    global.logger.info("Get Critical Dropoff Data [Service]", {
      filePath: __filename,
      methodName: this.getCriticalDropoffData.name,
      params,
    });

    const { fromDate, toDate } = resolveDateRange(params.dateRangeInDays);

    const applications = await this.getApplicationsForDropoffAnalytics({
      companyId: params.companyId,
      jobId: params.jobId,
      fromDate,
      toDate,
    });

    const {
      dropoffByStage,
      jobsWithHighestDropoff,
      totalApplications,
      totalDropoffs,
      overallDropoffRate,
    } = computeDropoffFunnel(applications);

    return {
      totalApplications,
      totalDropoffs,
      overallDropoffRate,
      dropoffByStage,
      jobsWithHighestDropoff: jobsWithHighestDropoff.slice(0, params.topN ?? 10),
    };
  }

  /**
   * getHiringTrend
   *
   * Computes hiring trend metrics (jobs posted, applications received, hires)
   * grouped by the requested granularity for a given time range.
   */
  async getHiringTrend(params: {
    companyId?: string;
    corporateRecruiterUserId?: string;
    granularity: HiringTrendGranularity;
    dateRangeInDays?: number;
    jobStatusFilter?: "ALL" | "PUBLISHED";
  }): Promise<HiringTrendResponse> {
    global.logger.info("Get Hiring Trend [Service]", {
      filePath: __filename,
      methodName: this.getHiringTrend.name,
      params,
    });

    const rangeInDays: number = params.dateRangeInDays ?? this.DEFAULT_HIRING_TREND_RANGE_DAYS;
    const { fromDate, toDate } = resolveDateRange(rangeInDays);

    // Add admin query limits
    const isAdminQuery = !params.companyId;
    const jobLimit = isAdminQuery ? this.ADMIN_JOB_LIMIT : undefined;
    const applicationLimit = isAdminQuery ? this.ADMIN_APPLICATION_LIMIT : undefined;
    global.logger.info("Date range calculated [Service]", {
      methodName: this.getHiringTrend.name,
      rangeInDays,
      fromDate: new Date(fromDate!).toISOString(),
      toDate: new Date(toDate!).toISOString(),
    });

    global.logger.info("Fetching hiring trend data", {
      methodName: this.getHiringTrend.name,
      isAdminQuery,
      jobLimit,
      applicationLimit,
      companyId: params.companyId,
      dateRange: rangeInDays,
    });

    let jobs: DbCompanyJobDto[] = [];
    let applications: DbUserJobApplicationDto[] = [];
    let applicationsForHires: DbUserJobApplicationDto[] = [];

    try {
      //OPTIMIZATION: Sequential fetching - Fetch jobs FIRST
      global.logger.info("Fetching jobs for hiring trend [Service]", {
        methodName: this.getHiringTrend.name,
      });
      const jobsStartTime = Date.now();

      jobs = await this.getAllJobsForAnalytics(
        {
          companyId: params.companyId,
          corporateRecruiterUserId: params.corporateRecruiterUserId,
          fromDate: fromDate!,
          toDate: toDate!,
          jobStatusFilter: params.jobStatusFilter,
        },
        jobLimit //Pass the limit
      );

      global.logger.info("Jobs fetched [Service]", {
        methodName: this.getHiringTrend.name,
        count: jobs.length,
        durationMs: Date.now() - jobsStartTime,
        limitReached: jobLimit && jobs.length >= jobLimit,
      });

      // Small delay to spread out RCU consumption for admin queries
      if (isAdminQuery && jobs.length > 100) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // OPTIMIZATION: Fetch applications SECOND
      global.logger.info("Fetching applications for hiring trend [Service]", {
        methodName: this.getHiringTrend.name,
      });
      const appsStartTime = Date.now();

      // Applications by createdAt for "applications" trend
      applications = await this.getAllApplicationsForCompany(
        {
          companyId: params.companyId,
          corporateRecruiterUserId: params.corporateRecruiterUserId,
          fromDate: fromDate!,
          toDate: toDate!,
        },
        applicationLimit // Pass the limit
      );

      global.logger.info("Applications fetched [Service]", {
        methodName: this.getHiringTrend.name,
        count: applications.length,
        durationMs: Date.now() - appsStartTime,
        limitReached: applicationLimit && applications.length >= applicationLimit,
      });

      // Applications by updatedAt for "hires/joined" trend
      global.logger.info("Fetching applications for hires trend [Service]", {
        methodName: this.getHiringTrend.name,
      });
      const hiresAppsStartTime = Date.now();

      applicationsForHires = await this.getAllApplicationsForCompany(
        {
          companyId: params.companyId,
          corporateRecruiterUserId: params.corporateRecruiterUserId,
          updatedAtFromDate: fromDate!,
          updatedAtToDate: toDate!,
        },
        applicationLimit // Pass the limit
      );

      global.logger.info("Applications for hires fetched [Service]", {
        methodName: this.getHiringTrend.name,
        count: applicationsForHires.length,
        durationMs: Date.now() - hiresAppsStartTime,
      });
    } catch (error) {
      global.logger.error("Error fetching hiring trend data [Service]", {
        methodName: this.getHiringTrend.name,
        error,
        jobsFetched: jobs.length,
        applicationsFetched: applications.length,
      });
      throw error;
    }

    const bucketMap: Map<string, HiringTrendPoint> = new Map();

    const addToBucket = (timestampMs: number, updater: (point: HiringTrendPoint) => void) => {
      if (timestampMs < fromDate! || timestampMs > toDate!) {
        return;
      }

      const { start, end, key } = getBucketRange(timestampMs, params.granularity);

      let point = bucketMap.get(key);
      if (!point) {
        point = {
          periodStart: new Date(start).toISOString(),
          periodEnd: new Date(end).toISOString(),
          jobsPosted: 0,
          applications: 0,
          hires: 0,
        };
        bucketMap.set(key, point);
      }

      updater(point);
    };

    // Jobs posted per period
    for (const job of jobs) {
      const createdAtMs = getEntityCreatedAt(job);
      if (createdAtMs === undefined) continue;
      addToBucket(createdAtMs, (point) => {
        point.jobsPosted += 1;
      });
    }

    // Applications per period (bucketed by createdAt)
    for (const app of applications) {
      const createdAtMs = getEntityCreatedAt(app);
      if (createdAtMs === undefined) continue;

      addToBucket(createdAtMs, (point) => {
        point.applications += 1;
      });
    }

    // Hires / joined per period (bucketed by updatedAt)
    for (const app of applicationsForHires) {
      const updatedAtRaw = (app as any).updatedAt;
      if (!updatedAtRaw) {
        continue;
      }
      const updatedAtMs = new Date(updatedAtRaw).getTime();
      if (Number.isNaN(updatedAtMs)) {
        continue;
      }

      if (app.status === JobApplicationStatus.HIRED || app.status === JobApplicationStatus.JOINED) {
        addToBucket(updatedAtMs, (point) => {
          point.hires += 1;
        });
      }
    }

    const points: HiringTrendPoint[] = Array.from(bucketMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([, point]) => point);

    // Summary counts for top-level cards
    const totalJobs = jobs.length;
    let activeJobs = 0;
    let closedJobs = 0;

    for (const job of jobs) {
      if (job.status === JobStatusEnum.PUBLISHED) {
        activeJobs++;
      } else if (job.status === JobStatusEnum.CLOSED || job.status === JobStatusEnum.ARCHIVED) {
        closedJobs++;
      }
    }

    return {
      granularity: params.granularity,
      points,
      totalJobs,
      activeJobs,
      closedJobs,
    };
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * getAllJobsForAnalytics
   *
   * Fetches all jobs for the given company / recruiter by iterating
   * through paginated DAO results.
   *
   * OPTIMIZED: Now accepts maxItems parameter for admin query limits
   */
  private async getAllJobsForAnalytics(
    params: {
      companyId?: string;
      corporateRecruiterUserId?: string;
      fromDate?: number;
      toDate?: number;
      jobStatusFilter?: "ALL" | "PUBLISHED";
    },
    maxItems?: number // NEW: Optional limit
  ): Promise<DbCompanyJobDto[]> {
    return paginateThroughResults<DbCompanyJobDto>(
      async (lastKey) => {
        const filterOptions: CompanyJobListingFilterOptions = {
          companyId: params.companyId,
          pageSize: APP_CONSTANTS.PAGE_LENGTH_DEFAULT,
          lastKey,
          sortOrder: SortOrderTypeEnum.DESCENDING,
          fromDate: params.fromDate,
          toDate: params.toDate,
        };

        if (params.jobStatusFilter === "PUBLISHED") {
          filterOptions.status = JobStatusEnum.PUBLISHED;
        }

        if (params.corporateRecruiterUserId) {
          filterOptions.dashboard = undefined;
          filterOptions.userRole = CorporateUserTypeEnum.CORPORATE_RECRUITER;
          filterOptions.corporateRecruiterUserId = params.corporateRecruiterUserId;
        }

        return await companyJobDaoObj.getCompanyJobsByFilterOptions(filterOptions);
      },
      maxItems // Pass the limit
    );
  }

  /**
   * getAllApplicationsForCompany
   *
   * Fetches all applications for a company by iterating
   * through paginated DAO results.
   *
   * OPTIMIZED: Now accepts maxItems parameter for admin query limits
   */
  private async getAllApplicationsForCompany(
    params: {
      companyId?: string;
      corporateRecruiterUserId?: string;
      fromDate?: number;
      toDate?: number;
      updatedAtFromDate?: number;
      updatedAtToDate?: number;
    },
    maxItems?: number // NEW: Optional limit
  ): Promise<DbUserJobApplicationDto[]> {
    // Use provided maxItems or default to 10000
    const effectiveMaxItems = maxItems ?? 10000;

    return paginateThroughResults<DbUserJobApplicationDto>(
      async (lastKey) => {
        const filter: UserJobApplicationListingFilterOptions = {
          companyId: params.companyId,
          pageSize: APP_CONSTANTS.PAGE_LENGTH_DEFAULT,
          lastKey,
          sortOrder: SortOrderTypeEnum.DESCENDING,
          fromDate: params.fromDate,
          toDate: params.toDate,
          updatedAtFromDate: params.updatedAtFromDate,
          updatedAtToDate: params.updatedAtToDate,
        };

        // Note: corporateRecruiterUserId filtering is not directly supported by UserJobApplicationListingFilterOptions
        // If needed, this would require filtering after fetch or updating the DTO interface

        return await userJobApplicationDao.getJobApplicationsByFilterOptions(filter);
      },
      effectiveMaxItems // Pass the limit
    );
  }

  /**
   * getAllApplicationsForJob
   *
   * Fetches all applications for a given job.
   */
  private async getAllApplicationsForJob(
    jobId: string,
    params?: {
      fromDate?: number;
      toDate?: number;
      updatedAtFromDate?: number;
      updatedAtToDate?: number;
    }
  ): Promise<DbUserJobApplicationDto[]> {
    return paginateThroughResults<DbUserJobApplicationDto>(async (lastKey) => {
      const filter: UserJobApplicationListingFilterOptions = {
        jobId,
        pageSize: APP_CONSTANTS.PAGE_LENGTH_DEFAULT,
        lastKey,
        sortOrder: SortOrderTypeEnum.DESCENDING,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        updatedAtFromDate: params?.updatedAtFromDate,
        updatedAtToDate: params?.updatedAtToDate,
      };

      return await userJobApplicationDao.getJobApplicationsByFilterOptions(filter);
    });
  }

  /**
   * getOnboardingApplications
   *
   * Fetches applications for onboarding analytics (HIRED / JOINED).
   */
  private async getOnboardingApplications(params: {
    companyId?: string;
    corporateRecruiterUserId?: string;
    jobId?: string;
    status?: JobApplicationStatus;
    fromDate?: number;
    toDate?: number;
  }): Promise<DbUserJobApplicationDto[]> {
    const allApplications = await paginateThroughResults<DbUserJobApplicationDto>(
      async (lastKey) => {
        const filter: UserJobApplicationListingFilterOptions = {
          companyId: params.companyId,
          jobId: params.jobId,
          status: params.status ?? JobApplicationStatus.JOINED,
          pageSize: APP_CONSTANTS.PAGE_LENGTH_DEFAULT,
          lastKey,
          sortOrder: SortOrderTypeEnum.DESCENDING,
          updatedAtFromDate: params.fromDate,
          updatedAtToDate: params.toDate,
        };
        return await userJobApplicationDao.getJobApplicationsByFilterOptions(filter);
      }
    );

    // Filter statuses to HIRED / JOINED
    return allApplications.filter(
      (app) =>
        app.status === JobApplicationStatus.HIRED || app.status === JobApplicationStatus.JOINED
    );
  }

  /**
   * getApplicationsForDropoffAnalytics
   *
   * Fetches applications for dropoff analytics, optionally scoped by company / job.
   */
  private async getApplicationsForDropoffAnalytics(params: {
    companyId?: string;
    jobId?: string;
    fromDate?: number;
    toDate?: number;
    jobStatusFilter?: "ALL" | "PUBLISHED";
  }): Promise<DbUserJobApplicationDto[]> {
    return paginateThroughResults<DbUserJobApplicationDto>(async (lastKey) => {
      const filter: UserJobApplicationListingFilterOptions = {
        companyId: params.companyId,
        jobId: params.jobId,
        pageSize: APP_CONSTANTS.PAGE_LENGTH_DEFAULT,
        lastKey,
        sortOrder: SortOrderTypeEnum.DESCENDING,
        fromDate: params.fromDate,
        toDate: params.toDate,
      };

      return await userJobApplicationDao.getJobApplicationsByFilterOptions(filter);
    });
  }
}

const analyticsServiceObj: AnalyticsService = new AnalyticsService();
export { analyticsServiceObj, AnalyticsService };
