
// Import enums
import { BatchInferenceLogDbJobStatusEnum } from "../../enums/GcpFirestoreBatchInferenceLog.enum";

// Import models
import { BaseFirestoreModel } from "./Base.model";

/**
 * @description
 *    1. This db interface is used to store logs of batch inference activity,
 *       whether its happen in different cloud platforms, as of now we are only
 *       storing the logs of batch inference activity in "Gcp vertex ai batch inference",
 *       In near future if we migrate to another cloud platform batch inference then we can use this
 *       interface to store logs of batch inference activity.
 */
interface DbGcpFirestoreBatchInferenceLogDto<
  CreateBatchInferenceJobInputDto,
  CreateBatchInferenceJobOutputDto
> extends BaseFirestoreModel {
  /**
    * @reference
    * 1. "Name" in "Vertex AI > Batch Inference" and this "id" will be same
    */
  id: string;

  createBatchInferenceJobInput: CreateBatchInferenceJobInputDto;

  createBatchInferenceJobOutput?: CreateBatchInferenceJobOutputDto;

  createBatchInferenceJobStatus: BatchInferenceLogDbJobStatusEnum,

  errorDetails?: object;
}

export { DbGcpFirestoreBatchInferenceLogDto };