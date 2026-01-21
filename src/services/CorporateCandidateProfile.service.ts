// Import google cloud firestore
import { DocumentData, QuerySnapshot } from "@google-cloud/firestore";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { corporateCandidateProfileDaoObj } from "../daos/CorporateCandidateProfile.dao";

// Import dtos
import {
  CorporateCandidateProfileDbPhoneNumberDto,
} from "../dtos/CorporateCandidateProfile.dto";
import { EmailTemplatePlaceholderCAND_COOLING_PERIOD_END_NOTIFICATION } from "../dtos/EmailTemplatePlaceholder.dto";

// Import enums
import { HiringEligibilityStatusEnum } from "../enums/Common.enum";
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import libraries
import { emailLibrary, EmailSourceDestinationAddress } from "../libraries/email.library";

// Import models
import { DbCentralCandidateProfileDto } from "../db/gcp-firestore-models/CentralCandidateProfile.model";

// Import services
import { centralCandidateProfileServiceObj } from "./CentralCandidateProfile.service";
import UserDetailService from "./UserDetail.service";

// Import models
import { DbCorporateCandidateProfileDto } from "../db/gcp-firestore-models/CorporateCandidateProfile.model";
import { DbUserDetailDto } from "../db/models/UserDetail.model";


class CorporateCandidateProfileService {
  async createCorporateCandidateProfile(
    createData: DbCorporateCandidateProfileDto
  ): Promise<DbCorporateCandidateProfileDto | undefined> {
    global.logger.info(`Create Corporate Candidate Profile [Service]`, {
      methodName: this.createCorporateCandidateProfile.name,
    });

    return corporateCandidateProfileDaoObj.createCorporateCandidateProfile(
      createData
    );
  }

  async getDuplicateCorporateCandidateProfile(
    companyId: string,
    candidateEmailId: string,
    phoneNumberDetails: CorporateCandidateProfileDbPhoneNumberDto
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    global.logger.info(`Get Duplicate Corporate Candidate Profile [Service]`, {
      methodName: this.getDuplicateCorporateCandidateProfile.name,
    });

    return corporateCandidateProfileDaoObj.getDuplicateCorporateCandidateProfile(
      companyId,
      candidateEmailId,
      phoneNumberDetails
    );
  }

  async getCorporateCandidateProfileByCompIdAndCandEmail(
    companyId: string,
    candidateEmail: string,
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    return corporateCandidateProfileDaoObj.getCorporateCandidateProfileByCompIdAndCandEmail(companyId, candidateEmail);
  }

  async getCorporateCandidateProfileById(id: string): Promise<DbCorporateCandidateProfileDto | undefined> {
    return corporateCandidateProfileDaoObj.getCorporateCandidateProfileById(id);
  }

  async updateCorporateCandidateProfileById(id: string, updateData: Partial<DbCorporateCandidateProfileDto>): Promise<DbCorporateCandidateProfileDto | undefined> {
    return corporateCandidateProfileDaoObj.updateCorporateCandidateProfileById(id, updateData);
  }

  async sendEmailToCandidateOnCoolingPeriodCompletion(
    corporateCandidateProfile: DbCorporateCandidateProfileDto,
    companyName: string
  ) {
    const {
      candidateEmail,
    } = corporateCandidateProfile;

    const candidateDetails: QueryResponse<DbUserDetailDto> = await UserDetailService.get(candidateEmail);
    const candidateName: string = candidateDetails[0].name;

    // Construct the email address object
    const toAddress: EmailSourceDestinationAddress = {
      email: candidateEmail,
      fullName: candidateName.toTitleCase(),
    };

    // Construct the email placeholders object
    const emailPlaceholders: EmailTemplatePlaceholderCAND_COOLING_PERIOD_END_NOTIFICATION =
      {
        candidateName: candidateName.toTitleCase(),
        companyName: companyName.toTitleCase(),
        companyCareersUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_JOBS_LISTING_PAGE,
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    // Send email to the corporate user
    return emailLibrary.sendEmail(
      EmailTemplateEnum.CAND_COOLING_PERIOD_END_NOTIFICATION,
      toAddress,
      emailPlaceholders,
    );
  }

  async performCorporateCandidateProfileCoolingPeriodCompletion(
    corporateCandidateProfileId: string,
    companyName: string,
  ) {
    const existingCorpCandProfile: DbCorporateCandidateProfileDto | undefined = await this.getCorporateCandidateProfileById(corporateCandidateProfileId);
    if(!existingCorpCandProfile) return false;

    const updateCorpCandProfile: DbCorporateCandidateProfileDto | undefined = await this.updateCorporateCandidateProfileById(
      corporateCandidateProfileId,
      {
        hiringEligibilityStatus: HiringEligibilityStatusEnum.ACTIVE,
        updatedAt: dateHelperObj.getISODate(),
      }
    );
    if(!updateCorpCandProfile) return false;

    const centralCandProfile: DbCentralCandidateProfileDto | undefined = await centralCandidateProfileServiceObj.getCentralCandidateProfileById(updateCorpCandProfile.candidateEmail);
    if(!centralCandProfile) {
      global.logger.error(`Failed to update under cooling period for user job application.`, {
        methodName: this.performCorporateCandidateProfileCoolingPeriodCompletion.name,
        centralCandProfile
      });
      return false;
    }

    const updateCentralCandProfile: DbCentralCandidateProfileDto | undefined =
      await centralCandidateProfileServiceObj.updateCentralCandidateProfileById(
        updateCorpCandProfile.candidateEmail,
        {
          updatedAt: dateHelperObj.getISODate(),

          // Remove this specific company from the cooling period companies
          coolingPeriodCompanies: centralCandProfile.coolingPeriodCompanies?.filter((coolingPeriodCompany) => coolingPeriodCompany.companyId !== updateCorpCandProfile.companyId),
        },
      );

    /**
     * Send email to candidate that cooling period is turned off for this company
     */
    const isEmailSent: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await this.sendEmailToCandidateOnCoolingPeriodCompletion(
      updateCorpCandProfile,
      companyName
    );

    if(!isEmailSent.awsMessageId) return false;

    return true;
  }
}

const corporateCandidateProfileServiceObj =
  new CorporateCandidateProfileService();
export {
  corporateCandidateProfileServiceObj,
  CorporateCandidateProfileService,
};
