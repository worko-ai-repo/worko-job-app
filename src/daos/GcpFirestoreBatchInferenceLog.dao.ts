// Import firestore package
import { Firestore } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";

// Import models
import { DbGcpFirestoreBatchInferenceLogDto } from "../db/gcp-firestore-models/GcpFirestoreBatchInferenceLog.model";

class GcpFirestoreBatchInferenceLogDao implements BaseDao {
  databaseName: string = `worko-jobs-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "batchInferenceLogs";

  getGcpFirestoreBatchInferenceLogModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getGcpFirestoreBatchInferenceLogDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createBatchInferenceLog<
    CreateBatchInferenceJobInputDto,
    CreateBatchInferenceJobOutputDto
  >(
    createBatchInferenceJobInput: DbGcpFirestoreBatchInferenceLogDto<
      CreateBatchInferenceJobInputDto,
      CreateBatchInferenceJobOutputDto
    >
  ): Promise<
    | DbGcpFirestoreBatchInferenceLogDto<
        CreateBatchInferenceJobInputDto,
        CreateBatchInferenceJobOutputDto
      >
    | undefined
  > {
    return gcpFirestoreLibrary.createDocument<
      DbGcpFirestoreBatchInferenceLogDto<
        CreateBatchInferenceJobInputDto,
        CreateBatchInferenceJobOutputDto
      >
    >(
      this.getGcpFirestoreBatchInferenceLogModelDetails(),
      createBatchInferenceJobInput
    );
  }
}

const gcpFirestoreBatchInferenceLogDaoObj = new GcpFirestoreBatchInferenceLogDao();
export { gcpFirestoreBatchInferenceLogDaoObj, GcpFirestoreBatchInferenceLogDao };