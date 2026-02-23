
// Import firestore packages
import { FieldValue } from "@google-cloud/firestore";

// Import models
import { BaseFirestoreModel } from "./Base.model";

interface DbCandidateJobAlertDto extends BaseFirestoreModel {
  candidateEmail: string;
  candidateName: string;

  /**
   * @description
   * 1. If this is true only then "send email to candidate every week with job matches" every week, otherwise don't send.
   */
  isEmailJobAlertEnabled: boolean;
  publishedJobRecommendationsCount: number | FieldValue;
}

export { DbCandidateJobAlertDto };
