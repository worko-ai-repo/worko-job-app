// Import dtos
import { CentralCandidateProfileDbPhoneNumberDto } from "../../dtos/CentralCandidateProfile.dto";

// Import enums
import { CentralCandidateProfileDbRefereeTypeEnum } from "../../enums/CentralCandidateProfile.enum";

// Import models
import { BaseFirestoreModel } from "./Base.model";

interface DbCentralCandidateProfileDto extends BaseFirestoreModel {
  candidateName?: string;
  candidateEmail: string;

  phoneNumberDetails: CentralCandidateProfileDbPhoneNumberDto;

  refereeType: CentralCandidateProfileDbRefereeTypeEnum;

  /**
   * @reference "id" attribute of "UserDetail.model.ts" from "AWS Dynamodb"
   * @description
   *  1. If the candidate is registered in "worko" job portal then "userDetailId" will be available
   */
  userDetailId?: string;

  candidateProfileInCompanies?: {
    companyId: string;
    jobIds?: string[];
    companyName: string;
  }[]; // Company names where profile exists, ex:- "Swiggy", "Zomato"
  candidateProfileInCompaniesList?: string[];

  coolingPeriodCompanies?: {
    companyId: string;
    companyName: string;
  }[];

  /**
   * @reference "id" field of "CorporateCandidateProfile.model.ts"
   */
  corporateCandidateProfileIds?: string[];

  /**
   * @reference "id" field of "CandidateParsedCv.model.ts"
   */
  candidateParsedCvIds: string[];

  /**
   * @reference "id" field of "CandidateParsedCv.model.ts"
   */
  latestCandidateParsedCvId: string;
}

export { DbCentralCandidateProfileDto };
