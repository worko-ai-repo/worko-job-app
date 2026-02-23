
// Import dtos
import { GcpFirestoreRecordListingFilterOptions } from "./Common.gcp-firestore.dto";

export interface CandidateJobAlertListingFilterOptions extends GcpFirestoreRecordListingFilterOptions {
  isEmailJobAlertEnabled?: boolean;
  publishedJobRecommendationsCountGreaterThan?: number;
}