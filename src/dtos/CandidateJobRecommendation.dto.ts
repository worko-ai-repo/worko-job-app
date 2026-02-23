
// Import dtos
import { GcpFirestoreRecordListingFilterOptions } from "./Common.gcp-firestore.dto";

// Import enums
import { JobStatusEnum } from "../enums/Job.enum";

export interface CandidateJobRecommendationListingFilterOptions extends GcpFirestoreRecordListingFilterOptions {
   isIncludedInEmailCountLessThan?: number,
   candidateEmail?: string,
   isJobPublished?: boolean;
   jobId?: string;
}