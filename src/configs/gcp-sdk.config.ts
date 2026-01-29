// Import libraries
import { GcpAiPlatformBatchInferenceLibrary } from "../libraries/gcp-aiplatform-batch-inference.library";
import { GcpAiPlatformEmbeddingLibrary } from "../libraries/gcp-aiplatform-embedding.library";
import { GcpFirestoreLibrary } from "../libraries/gcp-firestore.library";
import { GcpStorageLibrary } from "../libraries/gcp-storage.library";

const gcpFirestoreLibrary: GcpFirestoreLibrary = new GcpFirestoreLibrary();
global.logger.info(`The "Gcp Firestore Library" initialized successfully.`);

const gcpAiPlatformEmbeddingLibrary: GcpAiPlatformEmbeddingLibrary = new GcpAiPlatformEmbeddingLibrary();
global.logger.info(`The "Gcp AI Platform Embedding Library" initialized successfully.`);

const gcpAiPlatformBatchInferenceLibrary: GcpAiPlatformBatchInferenceLibrary = new GcpAiPlatformBatchInferenceLibrary();
global.logger.info(`The "Gcp AI Platform BatchInference Library" initialized successfully.`);

const gcpStorageLibrary: GcpStorageLibrary = new GcpStorageLibrary();
global.logger.info(`The "Gcp Storage Library" initialized successfully.`);

export { 
   gcpFirestoreLibrary, 
   gcpAiPlatformEmbeddingLibrary,
   gcpAiPlatformBatchInferenceLibrary,
   gcpStorageLibrary
};
