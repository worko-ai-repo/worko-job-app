import { Firestore } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";

// Import models
import { DbAgencyUserSubmissionDto } from "../db/gcp-firestore-models/AgencyUserSubmission.model";

class AgencyUserSubmissionDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "agencyUserSubmissions";

  getAgencyUserSubmissionFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  getAgencyUserSubmissionModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  async getAgencyUserSubmissionById(
    id: string
  ): Promise<DbAgencyUserSubmissionDto | undefined> {
    return gcpFirestoreLibrary.getDocumentById<DbAgencyUserSubmissionDto>(
      this.getAgencyUserSubmissionModelDetails(),
      id
    );
  }

  async updateAgencyUserSubmissionById(
    id: string,
    updateData: Partial<DbAgencyUserSubmissionDto>
  ): Promise<DbAgencyUserSubmissionDto | undefined> {
    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbAgencyUserSubmissionDto>,
      DbAgencyUserSubmissionDto
    >(this.getAgencyUserSubmissionModelDetails(), id, updateData);
  }
}

const agencyUserSubmissionDaoObj = new AgencyUserSubmissionDao();
export { agencyUserSubmissionDaoObj, AgencyUserSubmissionDao };
