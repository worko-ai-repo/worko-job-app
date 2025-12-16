// Import firestore package
import {
  Firestore,
} from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import models
import { DbCentralCandidateProfileDto } from "../db/gcp-firestore-models/CentralCandidateProfile.model";

class CentralCandidateProfileDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "centralCandidateProfiles";

  getCentralCandidateProfileModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getCentralCandidateProfileFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createCentralCandidateProfile(
    createData: DbCentralCandidateProfileDto
  ): Promise<DbCentralCandidateProfileDto | undefined> {
    return gcpFirestoreLibrary.createDocument<DbCentralCandidateProfileDto>(
      this.getCentralCandidateProfileModelDetails(),
      createData
    );
  }

  async getCentralCandidateProfileById(
    id: string
  ): Promise<DbCentralCandidateProfileDto | undefined> {
    return gcpFirestoreLibrary.getDocumentById<DbCentralCandidateProfileDto>(
      this.getCentralCandidateProfileModelDetails(),
      id
    );
  }

  async updateCentralCandidateProfileById(
    id: string, // candidate email
    updateData: Partial<DbCentralCandidateProfileDto>
  ) {
    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbCentralCandidateProfileDto>,
      DbCentralCandidateProfileDto
    >(this.getCentralCandidateProfileModelDetails(), id, updateData);
  }
}

const centralCandidateProfileDaoObj = new CentralCandidateProfileDao();
export { centralCandidateProfileDaoObj, CentralCandidateProfileDao };
