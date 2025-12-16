// Import libraries
import { GcpAiPlatformLibrary } from "../libraries/gcp-aiplatform.library";
import { GcpFirestoreLibrary } from "../libraries/gcp-firestore.library";

const gcpFirestoreLibrary: GcpFirestoreLibrary = new GcpFirestoreLibrary();
global.logger.info(`The "Gcp Firestore Library" initialized successfully.`);

const gcpAiPlatformLibrary: GcpAiPlatformLibrary = new GcpAiPlatformLibrary();
global.logger.info(`The "Gcp AI Platform Library" initialized successfully.`);

export { gcpFirestoreLibrary, gcpAiPlatformLibrary };
