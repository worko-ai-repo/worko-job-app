
// Import dtos
import { CommonPhoneNumberDto, MinMaxRange } from "./Common.dto";
import { GcpFirestoreRecordListingFilterOptions } from "./Common.gcp-firestore.dto";
import { SalaryRangeDto } from "./Job.dto";

// Import enums
import { CandidateParsedCvAwsS3ResourceTypeEnum } from "../enums/CandidateParsedCv.enum";

export interface CandidateParsedCvDbPhoneNumberDto extends CommonPhoneNumberDto {}

export interface CandidateParsedCvAwsS3FileTrackerDto {
  /**
   * @example 2024-12-17T11:36:46.753+00:00
   */
  actionDate: string;

  resourceType: CandidateParsedCvAwsS3ResourceTypeEnum;

  /**
   * @example
   *  1. "worko-app-dev"
   *  2. "worko-corporate-dev"
   */
  bucketName: string;

  /**
   * @example
   *  1. "/agencies/{agencyUserId}/companies/{companyId}/jobs/{jobId}/user-profiles"
   *  2. "/users/{userId}/resumes"
   *  3. "/companies/{companyId}/bulk-cvs/{corporateBulkJdId}"
   */
  filePath: string;

  /**
   * @description
   *  1. Name of the aws s3 file
   *
   * @example "01K8TPT1PT2W5DTRSFPWTB92GH.pdf"
   */
  fileName?: string;
};

export interface CandidateParsedCvEmbeddingListingFilterOptions extends GcpFirestoreRecordListingFilterOptions {
  pageNumber: number,
}

export interface CandidateSearchPromptParsedResponseDto {
  jobTitle: string;

  salaryRange?: SalaryRangeDto;
  experienceRange?: MinMaxRange;

  numberOfOpenings?: number;
  workMode?: string;
  location?: string;
  noticePeriod?: number;
  typeOfEmployment?: string;

  // readyToRelocate??: "Yes" | "No";

  department?: string;
  industry?: string;
  role?: string;

  coreSkills?: string[];
  softSkills?: string[];
  technicalSkills?: string[];
  goodToHaveSkills?: string[];
  mustHaveSkills?: string[];

  mandatoryRequirements?: string[];
  preferredRequirements?: string[];
}