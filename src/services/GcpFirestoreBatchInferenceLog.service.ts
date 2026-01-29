// Import daos
import { gcpFirestoreBatchInferenceLogDaoObj } from "../daos/GcpFirestoreBatchInferenceLog.dao";

// Import models
import { DbGcpFirestoreBatchInferenceLogDto } from "../db/gcp-firestore-models/GcpFirestoreBatchInferenceLog.model";

class GcpFirestoreBatchInferenceLogService {
  async createBatchInferenceLog<CreateBatchInferenceJobInputDto, CreateBatchInferenceJobOutputDto>(
    createBatchInferenceJobInput: DbGcpFirestoreBatchInferenceLogDto<
      CreateBatchInferenceJobInputDto,
      CreateBatchInferenceJobOutputDto
    >
  ) {
    return gcpFirestoreBatchInferenceLogDaoObj.createBatchInferenceLog(
      createBatchInferenceJobInput
    );
  }
}

const gcpFirestoreBatchInferenceLogServiceObj = new GcpFirestoreBatchInferenceLogService();
export { gcpFirestoreBatchInferenceLogServiceObj, GcpFirestoreBatchInferenceLogService };