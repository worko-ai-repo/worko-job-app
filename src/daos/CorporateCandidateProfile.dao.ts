// Import firestore package
import {
  DocumentData,
  Filter,
  Firestore,
  QuerySnapshot,
} from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import dtos
import {
  CorporateCandidateProfileDbPhoneNumberDto,
} from "../dtos/CorporateCandidateProfile.dto";

// Import models
import { DbCorporateCandidateProfileDto } from "../db/gcp-firestore-models/CorporateCandidateProfile.model";

class CorporateCandidateProfileDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "corporateCandidateProfiles";

  getCorporateCandidateProfileModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getCorporateCandidateProfileFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createCorporateCandidateProfile(
    createData: DbCorporateCandidateProfileDto
  ): Promise<DbCorporateCandidateProfileDto | undefined> {
    return gcpFirestoreLibrary.createDocument<DbCorporateCandidateProfileDto>(
      this.getCorporateCandidateProfileModelDetails(),
      createData
    );
  }

  async getDuplicateCorporateCandidateProfile(
    companyId: string,
    candidateEmailId: string,
    phoneNumberDetails: CorporateCandidateProfileDbPhoneNumberDto
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    const db: Firestore = await this.getCorporateCandidateProfileFirestoreDatabase();

    return db
      .collection(this.collectionName)
      .where("companyId", "==", companyId)
      .where(
        Filter.or(
          Filter.where("candidateEmail", "==", candidateEmailId),
          Filter.and(
            Filter.where(
              "phoneNumberDetails.number",
              "==",
              phoneNumberDetails.number
            ),
            Filter.where(
              "phoneNumberDetails.countryCode",
              "==",
              phoneNumberDetails.countryCode
            )
          )
        )
      )
      .get();
  }

  async updateCorporateCandidateProfileById(id: string, updateData: Partial<DbCorporateCandidateProfileDto>): Promise<DbCorporateCandidateProfileDto | undefined> {
    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbCorporateCandidateProfileDto>,
      DbCorporateCandidateProfileDto
    >(this.getCorporateCandidateProfileModelDetails(), id, updateData);
  }
}

const corporateCandidateProfileDaoObj = new CorporateCandidateProfileDao();
export { corporateCandidateProfileDaoObj, CorporateCandidateProfileDao };
