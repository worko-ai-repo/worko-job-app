// Load the npm packages
import { Router } from "express";

// Import the routes
import JobRouter from "./routers/Job.router";
import ScriptRouter from "./routers/Script.router";
import UserExternalJobApplicationRouter from "./routers/UserExternalJobApplication.router";
import UserJobApplicationRouter from "./routers/UserJobApplication.router";
import UserMatchingScoreJobRouter from "./routers/UserMatchingScoreJob.router";

// Router that contains all the routes/endpoints in the application
const router = Router();

/**
 * AUTHORISATION ROLES DESCRIPTION
 * 
 * Custom Roles
 *    "public" - Any user can access these routes even if they are not logged in
 *    "loggedInUser" - Only logged in users can access these routes
 * 
 * Cognito User Groups
 *    "admin" - Only worko admin users can access these routes
 *    "corporate-recruiter" - Only corporate recruiters can access these routes
 *    "corporate-admin" - Only corporate admin users can access these routes
 */

/**
 * JOB ROUTERS
 * 
 * Regitser the "Job CRUD" routers
 * 
 * @authorisedRoles ["public", "loggedInUser", "admin", "corporate-recruiter", "corporate-admin"]
 */
router.use("/job", JobRouter);

/**
 * SCRIPT ROUTERS
 * 
 * Register the "Script" routers
 * 
 * @authorisedRoles ["admin"]
 */
router.use("/script", ScriptRouter);

/**
 * USER EXTERNAL JOB APPLICATION ROUTERS
 * 
 * Regitser the "UserExternalJobApplication CRUD" routers
 * 
 * @authorisedRoles ["loggedInUser"]
 */
router.use("/external-job-application", UserExternalJobApplicationRouter);

/**
 * USER JOB APPLICATION ROUTERS
 * 
 * Regitser the "UserJobApplication CRUD" routers
 * 
 * @authorisedRoles ["loggedInUser", "admin", "corporate-recruiter", "corporate-admin"]
 */
router.use("/job-application", UserJobApplicationRouter);

/**
 * User Matching Score Job Router
 * 
 * @authorisedRoles ["loggedInUser"]
 */
router.use("/user-matching-score-job", UserMatchingScoreJobRouter);

export default router;