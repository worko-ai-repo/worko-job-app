// Load the npm packages
import { Router } from "express";

// Import the routes
import JobRouter from "./routers/Job.router";
import ReferAndEarnRouter from "./routers/ReferAndEarn.router";
import RequestEvaluationRouter from "./routers/RequestEvaluation.router";
import ScriptRouter from "./routers/Script.router";
import UserExternalJobApplicationRouter from "./routers/UserExternalJobApplication.router";
import UserJobApplicationRouter from "./routers/UserJobApplication.router";
import UserJobApplicationAuthorNoteRouter from "./routers/UserJobApplicationAuthorNote.router";
import ResponseEvaluationRouter from "./routers/ResponseEvaluation.router";
import EvaluatorDetailRouter from "./routers/EvaluatorDetail.router";
import FileRouter from "./routers/File.router";

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
 *    "evaluator" - Only evaluators can access these routes 
 */

/**
 * Evaluator detail routers
 * 
 * @authorisedRoles ["evaluator"]
 */
router.use("/evaluator-detail", EvaluatorDetailRouter);

/**
 * FILE ROUTERS 
 * 
 * Regitser the "File" router
 * 
 * @authorisedRoles ["loggedInUser"] 
 */
router.use("/file", FileRouter);

/**
 * JOB ROUTERS
 * 
 * Regitser the "Job CRUD" routers
 * 
 * @authorisedRoles ["public", "loggedInUser", "admin", "corporate-recruiter", "corporate-admin"]
 */
router.use("/job", JobRouter);

/**
 * REFER AND EARN ROUTES
 * 
 * Register the 'ReferAndEarn' routers
 * 
 * @authorisedRoles ["loggedInUser", "admin"]
 */
router.use('/refer-and-earn', ReferAndEarnRouter);

/**
 * REQUEST EVALUATION ROUTES
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */
router.use("/request-evaluation", RequestEvaluationRouter);

/**
 * RESPONSE EVALUATION ROUTES
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */
router.use("/response-evaluation", ResponseEvaluationRouter);

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
 * USER JOB APPLICATION AUTHOR NOTE ROUTERS
 * 
 * Register the "UserJobApplicationAuthorNote CRUD" routers
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
router.use("/job-application-author-note", UserJobApplicationAuthorNoteRouter);

/**
 * User Matching Score Job Router
 * 
 * @authorisedRoles ["loggedInUser"]
 */
// router.use("/user-matching-score-job", UserMatchingScoreJobRouter);

export default router;