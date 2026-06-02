// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";


export interface CountCompanyDbAllJobApplicationCountsDto {
  total?: number;
  applied?: number;
  processingInterview?: number;
  hired?: number;
  rejected?: number;
}

export interface CountCompanyDbAllCompanyJobStatusCountsDto {
  published?: number;
  closed?: number;
  archived?: number;
  draft?: number;
}

export interface CountCompanyCreateDto {
  entityType: CountCompanyDbEntityTypeEnum;
  companyId: string;
  allJobApplicationCounts?: CountCompanyDbAllJobApplicationCountsDto;
  allCompanyJobStatusCounts?: CountCompanyDbAllCompanyJobStatusCountsDto;
}

export interface CountCompanyCommonUpdateDto {
  allJobApplicationCounts?: CountCompanyDbAllJobApplicationCountsDto;
  allCompanyJobStatusCounts?: CountCompanyDbAllCompanyJobStatusCountsDto;
}

export interface CountCompanyJobApplicationEntityUpdateDto {
  allJobApplicationCounts: CountCompanyDbAllJobApplicationCountsDto;
}

export interface CountCompanyJobEntityUpdateDto {
  allCompanyJobStatusCounts: CountCompanyDbAllCompanyJobStatusCountsDto;
}
