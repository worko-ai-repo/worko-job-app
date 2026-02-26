import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import {
  DropoffStage,
  JobDropoffMetrics,
} from "../dtos/Analytics.dto";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { uuidToULID } from "ulidx";
import APP_CONSTANTS from "../configs/constants.config";
import { corporateUserServiceObj } from "../services/CorporateUser.service";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

/**
 * Fixed funnel stage order (excluding REJECTED / ON_HOLD and other outcomes).
 * This represents the ideal hiring pipeline.
 */
export const FUNNEL_STAGES: JobApplicationStatus[] = [
  JobApplicationStatus.APPLIED,
  JobApplicationStatus.CV_DOWNLOADED,
  JobApplicationStatus.ACCEPTED,
  JobApplicationStatus.UNDER_EVALUATION,
  JobApplicationStatus.PROCESSING_INTERVIEW,
  JobApplicationStatus.INTERVIEW_DONE,
  JobApplicationStatus.HIRING_IN_PROCESS,
  JobApplicationStatus.DOCUMENT_REQUESTED,
  JobApplicationStatus.DOCUMENT_SUBMITTED,
  JobApplicationStatus.DOCUMENT_VERIFIED,
  JobApplicationStatus.OFFER_SENT,
  JobApplicationStatus.HIRED,
  JobApplicationStatus.JOINED,
];

/**
 * paginateThroughResults
 *
 * Generic pagination helper that iterates through paginated DAO results
 * and accumulates all items across pages.
 *
 * @param fetchPage - Callback function that accepts lastKey and returns a paginated response
 * @param maxItems - Optional maximum number of items to fetch (stops pagination when reached)
 * @returns Array of all accumulated items
 */
export async function paginateThroughResults<T>(
  fetchPage: (lastKey: any) => Promise<PaginatedResultsWithMatchingConditionsResponse<T>>,
  maxItems?: number
): Promise<T[]> {
  let lastKeyInternal: any | undefined = undefined;
  const allItems: T[] = [];

  do {
    const page = await fetchPage(lastKeyInternal);

    const {
      lastKey,
      count,
      timesQueried,
      queriedCount,
      ...itemsData
    } = page;

    const pageItems: T[] = Object.values(itemsData);
    allItems.push(...pageItems);

    lastKeyInternal = lastKey ?? undefined;

    // Stop if maxItems limit is reached
    if (maxItems && allItems.length >= maxItems) {
      break;
    }
  } while (lastKeyInternal && (!maxItems || allItems.length < maxItems));

  return maxItems ? allItems.slice(0, maxItems) : allItems;
}

/**
 * resolveDateRange
 *
 * Converts a date range in days (e.g. 7, 30, 90, 180) into
 * numeric fromDate / toDate timestamps.
 * Defaults to last 30 days when not provided.
 */
export function resolveDateRange(
  dateRangeInDays?: number
): { fromDate?: number; toDate?: number } {
  if (!dateRangeInDays || dateRangeInDays <= 0) {
    dateRangeInDays = 30;
  }
  const now: number = Date.now();
  const fromDate: number =
    now - dateRangeInDays * 24 * 60 * 60 * 1000;
  return {
    fromDate,
    toDate: now,
  };
}

/**
 * getEntityCreatedAt
 *
 * Extracts createdAt timestamp (in ms) from a Dynamoose entity.
 */
export function getEntityCreatedAt(entity: {
  createdAt?: any;
  timestamps?: { createdAt: string };
}): number | undefined {
  const raw =
    (entity as any).createdAt ??
    (entity.timestamps ? entity.timestamps.createdAt : undefined);
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  const ms = date.getTime();
  return Number.isNaN(ms) ? undefined : ms;
}

/**
 * extractApplicantEmailFromPk
 *
 * Extracts applicant email from DynamoDB PK of format `USR#EML#{primaryEmail}`.
 */
export function extractApplicantEmailFromPk(PK: string): string {
  try {
    const parts = PK.split("#");
    return parts[2] ?? "";
  } catch {
    return "";
  }
}

/**
 * computeStats
 *
 * Computes basic statistics for a numeric sample.
 */
export function computeStats(values: number[]): {
  average: number;
  median: number;
  min: number;
  max: number;
  sampleSize: number;
} {
  if (!values.length) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      sampleSize: 0,
    };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const average = sum / sorted.length;
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  return {
    average,
    median,
    min,
    max,
    sampleSize: sorted.length,
  };
}

/**
 * getBucketRange
 *
 * Returns start, end and a stable key representing the bucket for the given timestamp.
 * Used for hiring trend aggregation.
 */
export function getBucketRange(
  timestampMs: number,
  granularity: "daily" | "weekly" | "monthly"
): { start: number; end: number; key: string } {
  const date = new Date(timestampMs);

  if (granularity === "daily") {
    const start = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0
    );
    const end = start + 24 * 60 * 60 * 1000 - 1;
    return { start, end, key: `D:${start}` };
  }

  if (granularity === "weekly") {
    // ISO week: weeks start on Monday
    const day = date.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day; // Monday=1
    const monday = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + diffToMonday,
        0,
        0,
        0,
        0
      )
    );
    const start = monday.getTime();
    const end = start + 7 * 24 * 60 * 60 * 1000 - 1;
    return { start, end, key: `W:${start}` };
  }

  // monthly
  const start = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endMonth = date.getUTCMonth() + 1;
  const endYear = date.getUTCFullYear() + (endMonth > 11 ? 1 : 0);
  const endMonthIndex = endMonth % 12;
  const end =
    Date.UTC(endYear, endMonthIndex, 1, 0, 0, 0, 0) - 1;
  return { start, end, key: `M:${start}` };
}

/**
 * computeDropoffFunnel
 *
 * Computes drop-off metrics based on real funnel stages only.
 * - Only considers statuses in FUNNEL_STAGES
 * - REJECTED and ON_HOLD are treated as outcomes, not funnel stages
 * - Drop-off at a stage = reached(current) - reached(next)
 * - Each candidate counted at most once per stage
 * - Overall drop-off rate is bounded to [0, 100]
 */
export function computeDropoffFunnel(
  applications: DbUserJobApplicationDto[]
): {
  dropoffByStage: DropoffStage[];
  jobsWithHighestDropoff: JobDropoffMetrics[];
  totalApplications: number;
  totalDropoffs: number;
  overallDropoffRate: number;
} {
  const totalApplications = applications.length;

  // Global reached counts per stage
  const reachedCounts: number[] = new Array(FUNNEL_STAGES.length).fill(0);

  // Per-job reached counts per stage
  const jobReachedCounts: Map<string, number[]> = new Map();

  // Build per-application earliest stage times
  for (const app of applications) {
    if (!Array.isArray(app.statusTracker) || !app.statusTracker.length) {
      continue;
    }

    const firstStageTime: (number | undefined)[] = new Array(
      FUNNEL_STAGES.length
    ).fill(undefined);

    for (const tracker of app.statusTracker) {
      const idx = FUNNEL_STAGES.indexOf(tracker.newStatus);
      if (idx === -1) continue;
      if (!tracker.actionDate) continue;

      const t = new Date(tracker.actionDate).getTime();
      if (Number.isNaN(t)) continue;

      if (
        firstStageTime[idx] === undefined ||
        t < (firstStageTime[idx] as number)
      ) {
        firstStageTime[idx] = t;
      }
    }

    // Mark global reached counts
    firstStageTime.forEach((time, idx) => {
      if (time !== undefined) {
        reachedCounts[idx] += 1;
      }
    });

    // Mark per-job reached counts
    const jobId = app.jobId;
    if (!jobReachedCounts.has(jobId)) {
      jobReachedCounts.set(
        jobId,
        new Array(FUNNEL_STAGES.length).fill(0)
      );
    }
    const jobCounts = jobReachedCounts.get(jobId)!;
    firstStageTime.forEach((time, idx) => {
      if (time !== undefined) {
        jobCounts[idx] += 1;
      }
    });
  }

  // Enforce monotonicity: later stages cannot have more reached than earlier ones
  for (let i = 1; i < reachedCounts.length; i++) {
    if (reachedCounts[i] > reachedCounts[i - 1]) {
      reachedCounts[i] = reachedCounts[i - 1];
    }
  }
  for (const [, counts] of jobReachedCounts.entries()) {
    for (let i = 1; i < counts.length; i++) {
      if (counts[i] > counts[i - 1]) {
        counts[i] = counts[i - 1];
      }
    }
  }

  // Compute global drop-offs between consecutive stages
  const dropoffByStage: DropoffStage[] = [];
  let totalDropoffs = 0;

  for (let i = 0; i < FUNNEL_STAGES.length; i++) {
    const stage = FUNNEL_STAGES[i];
    const reachedCurrent = reachedCounts[i];
    const reachedNext =
      i < FUNNEL_STAGES.length - 1 ? reachedCounts[i + 1] : reachedCounts[i];

    const dropoffs = Math.max(reachedCurrent - reachedNext, 0);
    totalDropoffs += dropoffs;

    const dropoffRate =
      reachedCurrent > 0 ? (dropoffs / reachedCurrent) * 100 : 0;

    dropoffByStage.push({
      stage,
      applicationsReached: reachedCurrent,
      dropoffs,
      dropoffRate,
      averageDaysBeforeDropoff: 0, // Not computed at stage-level in current version
    });
  }

  // Compute per-job drop-off metrics
  const jobsWithHighestDropoff: JobDropoffMetrics[] = [];

  for (const [jobId, counts] of jobReachedCounts.entries()) {
    const jobReaches = counts;
    let jobTotalDropoffs = 0;
    let criticalStageIndex = 0;
    let criticalStageDrop = 0;

    for (let i = 0; i < FUNNEL_STAGES.length; i++) {
      const reachedCurrent = jobReaches[i];
      const reachedNext =
        i < FUNNEL_STAGES.length - 1 ? jobReaches[i + 1] : jobReaches[i];
      const drop = Math.max(reachedCurrent - reachedNext, 0);
      jobTotalDropoffs += drop;
      if (drop > criticalStageDrop) {
        criticalStageDrop = drop;
        criticalStageIndex = i;
      }
    }

    const totalJobApplications = jobReaches[0] ?? 0;
    const dropoffRate =
      totalJobApplications > 0
        ? (jobTotalDropoffs / totalJobApplications) * 100
        : 0;

    jobsWithHighestDropoff.push({
      jobId,
      jobTitle: "",
      totalApplications: totalJobApplications,
      dropoffs: jobTotalDropoffs,
      dropoffRate,
      criticalDropoffStage: FUNNEL_STAGES[criticalStageIndex],
    });
  }

  jobsWithHighestDropoff.sort((a, b) => b.dropoffRate - a.dropoffRate);

  // Overall dropoff rate (bounded to [0, 100])
  const totalReachedAtStart = reachedCounts[0] ?? 0;
  const overallDropoffs =
    totalReachedAtStart > 0
      ? Math.max(totalReachedAtStart - (reachedCounts[reachedCounts.length - 1] ?? 0), 0)
      : 0;
  let overallDropoffRate =
    totalReachedAtStart > 0
      ? (overallDropoffs / totalReachedAtStart) * 100
      : 0;
  if (overallDropoffRate > 100) overallDropoffRate = 100;
  if (overallDropoffRate < 0) overallDropoffRate = 0;

  return {
    dropoffByStage,
    jobsWithHighestDropoff,
    totalApplications,
    totalDropoffs: overallDropoffs,
    overallDropoffRate,
  };
}

/**
 * resolveUserContext
 *
 * Determines whether the current user is admin or corporate,
 * and when corporate, derives the companyId from CorporateUser model.
 */
export async function resolveUserContext(): Promise<{
  isAdmin: boolean;
  isCorporateUser: boolean;
  corporateCompanyId?: string;
  corporateUserId?: string;
  corporateUserType?: CorporateUserTypeEnum;
}> {
  const cognitoUserId: string = global.requestLocalContext.userId;
  const cognitoUserGroups: string[] =
    global.requestLocalContext.cognitoUserGroups;

  const isAdmin: boolean = cognitoUserGroups.includes(
    APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.ADMIN
  );
  const isCorporateUser: boolean =
    cognitoUserGroups.includes(
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_ADMIN
    ) ||
    cognitoUserGroups.includes(
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_RECRUITER
    );

  let corporateCompanyId: string | undefined;
  let corporateUserId: string | undefined;
  let corporateUserType: CorporateUserTypeEnum | undefined;

  if (isCorporateUser) {
    const corporateUserIdInUlid: string = uuidToULID(cognitoUserId);
    const corporateUser =
      await corporateUserServiceObj.getCorpUserByIdWithParsing(
        corporateUserIdInUlid
      );
    corporateCompanyId = corporateUser.companyId;
    corporateUserId = corporateUser.id;
    corporateUserType = corporateUser.corporateUserType;
  }

  return {
    isAdmin,
    isCorporateUser,
    corporateCompanyId,
    corporateUserId,
    corporateUserType,
  };
}

/**
 * mapDateRangeToDays
 *
 * Maps string dateRange (e.g. "7d", "30d", "90d", "180d") to numeric number of days.
 */
export function mapDateRangeToDays(
  dateRange?: string
): number | undefined {
  if (!dateRange) {
    return undefined;
  }

  switch (dateRange) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "180d":
      return 180;
    default:
      return undefined;
  }
}

/**
 * computeFunnelMetricsFromApplications
 *
 * Analyses statusTracker for each application and computes
 * per-stage and overall velocity metrics focusing only on the
 * major funnel stages:
 * APPLIED -> ACCEPTED -> UNDER_EVALUATION -> PROCESSING_INTERVIEW -> OFFER_SENT -> JOINED
 */
export function computeFunnelMetricsFromApplications(
  applications: DbUserJobApplicationDto[],
  includeStageBreakdown: boolean
): {
  averageDaysPerStage: Record<string, {
    average: number;
    median: number;
    min: number;
    max: number;
    sampleSize: number;
  }>;
  overallAverageDays: number;
  stageBreakdown: {
    fromStatus: JobApplicationStatus;
    toStatus: JobApplicationStatus;
    averageDays: number;
    medianDays: number;
    applicationsCount: number;
  }[];
  applicationsAnalyzed: number;
} {
  /**
   * Major funnel statuses (in order) we care about for velocity:
   * APPLIED -> ACCEPTED -> UNDER_EVALUATION -> PROCESSING_INTERVIEW -> OFFER_SENT -> JOINED
   */
  const FUNNEL_STATUSES: JobApplicationStatus[] = [
    JobApplicationStatus.APPLIED,
    JobApplicationStatus.ACCEPTED,
    JobApplicationStatus.UNDER_EVALUATION,
    JobApplicationStatus.PROCESSING_INTERVIEW,
    JobApplicationStatus.OFFER_SENT,
    JobApplicationStatus.JOINED,
  ];

  const transitions: Map<string, number[]> = new Map();
  const overallDurations: number[] = [];
  let applicationsAnalyzed = 0;

  for (const app of applications) {
    if (!Array.isArray(app.statusTracker) || !app.statusTracker.length) {
      continue;
    }

    const sortedTracker = [...app.statusTracker].sort((a, b) => {
      const aTime = a.actionDate ? new Date(a.actionDate).getTime() : 0;
      const bTime = b.actionDate ? new Date(b.actionDate).getTime() : 0;
      return aTime - bTime;
    });

    // Track the first time each major funnel status was reached
    const firstStatusTime: Partial<Record<JobApplicationStatus, number>> = {};

    for (const tracker of sortedTracker) {
      if (!tracker.actionDate) {
        continue;
      }
      const current = new Date(tracker.actionDate).getTime();
      if (Number.isNaN(current)) {
        continue;
      }

      if (FUNNEL_STATUSES.includes(tracker.newStatus)) {
        if (firstStatusTime[tracker.newStatus] === undefined) {
          firstStatusTime[tracker.newStatus] = current;
        }
      }
    }

    const appliedAt = firstStatusTime[JobApplicationStatus.APPLIED];
    if (appliedAt === undefined) {
      continue;
    }

    // Compute per-stage durations between consecutive major funnel statuses
    let lastStageTime: number = appliedAt;
    let lastStageName: JobApplicationStatus = JobApplicationStatus.APPLIED;

    for (let i = 1; i < FUNNEL_STATUSES.length; i++) {
      const nextStage = FUNNEL_STATUSES[i];
      const nextTime = firstStatusTime[nextStage];
      if (nextTime === undefined) {
        // Application has not reached this stage; stop further transitions
        break;
      }

      const diffDays =
        (nextTime - lastStageTime) / (24 * 60 * 60 * 1000);
      if (diffDays >= 0) {
        const key = `${lastStageName}->${nextStage}`;
        const arr = transitions.get(key) ?? [];
        arr.push(diffDays);
        transitions.set(key, arr);
      }

      lastStageTime = nextTime;
      lastStageName = nextStage;
    }

    // Overall duration: from APPLIED to the last major stage this application reached
    if (lastStageTime > appliedAt) {
      const overallDiffDays =
        (lastStageTime - appliedAt) / (24 * 60 * 60 * 1000);
      if (overallDiffDays >= 0) {
        overallDurations.push(overallDiffDays);
        applicationsAnalyzed++;
      }
    }
  }

  const averageDaysPerStage: Record<
    string,
    {
      average: number;
      median: number;
      min: number;
      max: number;
      sampleSize: number;
    }
  > = {};

  const stageBreakdown: {
    fromStatus: JobApplicationStatus;
    toStatus: JobApplicationStatus;
    averageDays: number;
    medianDays: number;
    applicationsCount: number;
  }[] = [];

  transitions.forEach((durations, key) => {
    const stats = computeStats(durations);
    averageDaysPerStage[key] = stats;

    if (includeStageBreakdown) {
      const [fromStatusStr, toStatusStr] = key.split("->");
      stageBreakdown.push({
        fromStatus: fromStatusStr as JobApplicationStatus,
        toStatus: toStatusStr as JobApplicationStatus,
        averageDays: stats.average,
        medianDays: stats.median,
        applicationsCount: stats.sampleSize,
      });
    }
  });

  return {
    averageDaysPerStage,
    overallAverageDays: computeStats(overallDurations).average,
    stageBreakdown,
    applicationsAnalyzed,
  };
}

