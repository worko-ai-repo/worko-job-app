
// Import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

export interface CountGlobalCommonJobApplicationDto {
  total?: number;
  rejected?: number;
  processingInterview?: number;
  applied?: number;
  hired?: number;
}

export interface CountGlobalDbUserJobApplicationCountsDto 
   extends CountGlobalCommonJobApplicationDto {}

export interface CountGlobalDbCompanyJobApplicationCountsDto
  extends CountGlobalCommonJobApplicationDto {}

export interface CountGlobalDbReferAndEarnJobApplicationCountsDto  {
   total?: number;
   pending?: number;
   applied?: number;
   hired?: number;
   rejected?: number;
}; 

export interface CountGlobalDbReferralCountsDto {
   totalReferee?: number;
   awaiting?: number;
   accepted?: number;
   done?: number;
   rejected?: number;
};

export interface CountGlobalCreateDto {
  entityType: CountGlobalDbEntityTypeEnum;

  candidateJobApplicationCounts?: CountGlobalDbUserJobApplicationCountsDto;

  companyJobApplicationCounts?: CountGlobalDbCompanyJobApplicationCountsDto;

  referralCounts?: CountGlobalDbReferralCountsDto;

  referAndEarnJobApplicationCounts?: CountGlobalDbReferAndEarnJobApplicationCountsDto;
}

export interface CountGlobalCommonUpdateDto {
  candidateJobApplicationCounts: CountGlobalDbUserJobApplicationCountsDto;

  companyJobApplicationCounts: CountGlobalDbCompanyJobApplicationCountsDto;

  referralCounts: CountGlobalDbReferralCountsDto;

  referAndEarnJobApplicationCounts: CountGlobalDbReferAndEarnJobApplicationCountsDto;
}

export interface CountGlobalCandidateEntityUpdateDto {
  candidateJobApplicationCounts: CountGlobalDbUserJobApplicationCountsDto;
}

export interface CountGlobalCompanyJobEntityUpdateDto {
  companyJobApplicationCounts: CountGlobalDbCompanyJobApplicationCountsDto;
}

export interface CountGlobalReferAndEarnEntityUpdateDto {
  referAndEarnJobApplicationCounts: CountGlobalDbReferAndEarnJobApplicationCountsDto;
}