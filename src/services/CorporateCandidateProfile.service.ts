// Import google cloud firestore
import { DocumentData, QuerySnapshot } from "@google-cloud/firestore";

// Import daos
import { corporateCandidateProfileDaoObj } from "../daos/CorporateCandidateProfile.dao";

// Import dtos
import {
  CorporateCandidateProfileDbPhoneNumberDto,
} from "../dtos/CorporateCandidateProfile.dto";

// Import models
import { DbCorporateCandidateProfileDto } from "../db/gcp-firestore-models/CorporateCandidateProfile.model";

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

  async updateCorporateCandidateProfileById(id: string, updateData: Partial<DbCorporateCandidateProfileDto>): Promise<DbCorporateCandidateProfileDto | undefined> {
    return corporateCandidateProfileDaoObj.updateCorporateCandidateProfileById(id, updateData);
  }
}

const corporateCandidateProfileServiceObj =
  new CorporateCandidateProfileService();
export {
  corporateCandidateProfileServiceObj,
  CorporateCandidateProfileService,
};
