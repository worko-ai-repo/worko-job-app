// Load the npm packages
import { Router } from "express";

// Import Controllers
import ScriptController from "../controllers/Script.controller";

// Create Router
const ScriptRouter = Router();

// Initialize the ScriptController
const scriptController = new ScriptController();

/**
 * scriptSampleEntityTest 
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-schedule-external-job", scriptController.scriptSampleEntityTest);

/**
 * scriptWorkoDdbToWorkoJobsOpensearch
 * 
 * Endpoint to tranfer internal jobs from worko-ddb to worko-jobs-opensearch
 * 
 * worko-ddb model:-
 *    modelName: string = "CompanyJob";
 *    partitianKey: string = "COMP#ID#{companyId}#";
 *    sortKeys: { SK_INIT: string } = { SK_INIT: "JOBS#ID#{id}" };
 *    GSI1PK: string = "JOBS#";
 *    GSI1SK = "ID#{id}";
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-worko-ddb-to-worko-jobs-opensearch", scriptController.scriptWorkoDdbToWorkoJobsOpensearch);

/**
 * scriptInternalJobsWorkoDdbToWorkoJobAppDdb
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-internal-jobs-worko-ddb-to-worko-job-app-ddb", scriptController.scriptInternalJobsWorkoDdbToWorkoJobAppDdb);

/**
 * scriptInternalJobsWorkoDdbToWorkoJobAppDdb
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-internal-user-job-applications-worko-ddb-to-worko-job-app-ddb", scriptController.scriptInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb);

/**
 * scriptGetAwsScheduleById
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.get("/:id/script-get-aws-schedule", scriptController.scriptGetAwsScheduleById);

/**
 * scriptGetAwsScheduleById
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.delete("/:id/script-delete-aws-schedule", scriptController.scriptDeleteAwsScheduleById);

/**
 * scriptToUploadBatchInferenceFilesToS3
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-to-upload-batch-inference-files-to-s3", scriptController.scriptToUploadBatchInferenceFilesToS3);

/**
 * scriptToUploadBatchInferenceFilesToS3
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-to-restore-internal-jobs-to-opensearch", scriptController.scriptToRevertInternalJobsToOpensearch);

/**
 * scriptToAddGsi3ToJobApplications
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-to-add-gsi3-to-job-applications", scriptController.scriptToAddGsi3ToJobApplications);

ScriptRouter.post(
  "/script-migrate-jobs-aws-opensearch-to-gcp-firestore",
  scriptController.scriptMigrateJobsAwsOpensearchToGcpFirestore
);

/**
 * scriptSeedCompanyJobStatusCounts
 *
 * Endpoint to seed the CountCompany table with existing job status counts for all companies.
 * This script fetches all jobs from GCP Firestore, groups them by companyId,
 * and aggregates the counts by job status (published, closed, archived, draft).
 *
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post(
  "/script-seed-company-job-status-counts",
  scriptController.scriptSeedCompanyJobStatusCounts
);

ScriptRouter.post("/script-old-jobs-cand-alert-recommend", scriptController.scriptOldJobsCandAlertRecommend);

export default ScriptRouter;