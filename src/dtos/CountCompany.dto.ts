
// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";


export interface CountCompanyDbAllJobApplicationCountsDto {
  total?: number;
  applied?: number;
  processingInterview?: number;
  hired?: number;
  rejected?: number;
}

export interface CountCompanyCreateDto {
  entityType: CountCompanyDbEntityTypeEnum;
  companyId: string;
  allJobApplicationCounts?: CountCompanyDbAllJobApplicationCountsDto;
}

export interface CountCompanyCommonUpdateDto {
  allJobApplicationCounts: CountCompanyDbAllJobApplicationCountsDto;
}

export interface CountCompanyJobApplicationEntityUpdateDto {
  allJobApplicationCounts: CountCompanyDbAllJobApplicationCountsDto;
}