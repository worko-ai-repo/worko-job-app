
// Import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

export interface CountCompanyJobDbAllJobApplicationCountsDto {
  total?: number;
  applied?: number;
  processingInterview?: number;
  hired?: number;
  rejected?: number;
}


export interface CountCompanyJobCreateDto {
  entityType: CountCompanyJobDbEntityTypeEnum;
  companyId: string;
  jobId: string;
  allJobApplicationCounts?: CountCompanyJobDbAllJobApplicationCountsDto;
}

export interface CountCompanyJobCommonUpdateDto {
  allJobApplicationCounts: CountCompanyJobDbAllJobApplicationCountsDto;
}

export interface CountCompanyJobJobApplicationEntityUpdateDto {
  allJobApplicationCounts: CountCompanyJobDbAllJobApplicationCountsDto;
}