
export interface CountUserCommonJobApplicationDto {
  applied: number;
  hired: number;
  rejected: number;
}

export interface CountUserDbUserJobApplicationDto extends CountUserCommonJobApplicationDto {
   total: number;
   underEvaluation: number;
}

export interface CountUserDbReferAndEarnJobApplicationDto extends CountUserCommonJobApplicationDto {
  total: number;
  pending: number;
}

export interface CountUserCommonReferralDto {
  total: number;
  accepted: number;
  awaiting: number;
  rejected: number;
  done: number;
}

export interface CountUserDbCandidateReferralDto extends CountUserCommonReferralDto {}

export interface CountUserDbEmployeeReferralDto extends CountUserCommonReferralDto {}
