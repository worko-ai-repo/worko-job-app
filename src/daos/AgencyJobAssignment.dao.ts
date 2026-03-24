// Import firestore package
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
} from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import models
import { DbAgencyJobAssignmentDto } from "../db/gcp-firestore-models/AgencyJobAssignment.model";

class AgencyJobAssignmentDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "agencyJobAssignments";

  getAgencyJobAssignmentModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getAgencyJobAssignmentFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async updateAgencyJobAssignmentById(
    id: string,
    updateData: Partial<DbAgencyJobAssignmentDto>,
  ): Promise<DbAgencyJobAssignmentDto | undefined> {
    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbAgencyJobAssignmentDto>,
      DbAgencyJobAssignmentDto
    >(this.getAgencyJobAssignmentModelDetails(), id, updateData);
  }
}

const agencyJobAssignmentDaoObj = new AgencyJobAssignmentDao();
export { agencyJobAssignmentDaoObj, AgencyJobAssignmentDao };
