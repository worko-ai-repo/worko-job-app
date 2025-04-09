// Load the npm packages
import { Router } from "express";

// Import Controllers
import ScriptController from "../controllers/Script.controller";

// Create Router
const ScriptRouter = Router();

// Initialize the ScriptController
const scriptController = new ScriptController();

/**
 * scriptScheduleJobExternalJobApi
 * 
 * Endpoint to schedule job for external job api 
 * 
 * @authorisedRoles ["admin"]
 */
ScriptRouter.post("/script-schedule-external-job", scriptController.scriptScheduleJobExternalJobApi);

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

export default ScriptRouter;