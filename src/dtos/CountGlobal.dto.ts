
export interface CountGlobalCommonJobApplicationDto {
  total: number;
  rejected: number;
  processingInterview: number;
  applied: number;
  hired: number;
}

export interface CountGlobalDbCandidateJobApplicationCountsDto 
   extends CountGlobalCommonJobApplicationDto {}

export interface CountGlobalDbEmployeeJobApplicationCountsDto
  extends CountGlobalCommonJobApplicationDto {}

export interface CountGlobalDbCompanyJobApplicationCountsDto
  extends CountGlobalCommonJobApplicationDto {}

export interface CountGlobalDbReferAndEarnJobApplicationCountsDto  {
   total: number;
   pending: number;
   applied: number;
   hired: number;
   rejected: number;
}; 

export interface CountGlobalDbReferralCountsDto {
   totalReferee: number;
   awaiting: number;
   accepted: number;
   done: number;
   rejected: number;
};

