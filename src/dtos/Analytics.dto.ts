// Import dtos
import { JobLocationDto, RecordListingPaginationResponseDTO } from "./Common.dto";

// Import enums
import { JobStatusEnum } from "../enums/Job.enum";
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";


/**
 * Funnel velocity analytics DTOs
 */
export interface StageMetrics {
  average: number;
  median: number;
  min: number;
  max: number;
  sampleSize: number;
}

export interface StageBreakdown {
  fromStatus: JobApplicationStatus;
  toStatus: JobApplicationStatus;
  averageDays: number;
  medianDays: number;
  applicationsCount: number;
}

export interface FunnelVelocityResponse {
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  applicationsAnalyzed: number;
  averageDaysPerStage: Record<string, StageMetrics>;
  overallAverageDays: number;
  stageBreakdown: StageBreakdown[];
}

export interface OnboardingCandidate {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  hiredDate: string;
  joinedDate?: string;
  daysToJoin?: number;
}

export interface OnboardingPipelineResponse {
  totalHired: number;
  totalJoined: number;
  pendingJoining: number;
  averageDaysToJoin: number;
  candidates: OnboardingCandidate[];
}

/**
 * Hiring Trend DTOs
 */
export type HiringTrendGranularity = "daily" | "weekly" | "monthly";

export interface HiringTrendPoint {
  periodStart: string;
  periodEnd: string;
  jobsPosted: number;
  applications: number;
  hires: number;
}

export interface HiringTrendResponse {
  granularity: HiringTrendGranularity;
  points: HiringTrendPoint[];

  /**
   * Summary counts for the filtered scope.
   * These respect companyId, recruiterId, dateRange and jobStatus filters.
   */
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
}

/**
 * Critical dropoff DTOs
 */
export interface DropoffStage {
  stage: JobApplicationStatus;
  applicationsReached: number;
  dropoffs: number;
  dropoffRate: number;
  averageDaysBeforeDropoff: number;
}

export interface JobDropoffMetrics {
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  dropoffs: number;
  dropoffRate: number;
  criticalDropoffStage: JobApplicationStatus;
}


export interface CriticalDropoffResponse {
  totalApplications: number;
  totalDropoffs: number;
  overallDropoffRate: number;
  dropoffByStage: DropoffStage[];
  jobsWithHighestDropoff: JobDropoffMetrics[];
}

