
// Import firestore types
import { FieldValue } from "@google-cloud/firestore";

// Import enums
import { JobStatusEnum } from "../../enums/Job.enum";

// Import models
import { BaseFirestoreModel } from "./Base.model";

interface DbCandidateJobRecommendationDto extends BaseFirestoreModel {
  candidateEmail: string;
  companyId: string;
  jobId: string;
  includedInEmailCount: number | FieldValue; // How many times this job was sent in an email to the candidate

  companyName: string;
  jobTitle: string;

  /**
   * @description When we search with vector embeddings in "candidateParsedCvs" firestore's collection,
   * we will recieve the computed distance for the document, that we will set to "embeddingVectorDistance" field
   */
  embeddingVectorDistance: number;

  /**
   * @description 
   *  1. If "status" field of "GcpFirestoreJob.model.ts" is "PUBLISHED" then this field will be "true" otherwise "false".
   */
  isJobPublished: boolean;
}

export { DbCandidateJobRecommendationDto };
