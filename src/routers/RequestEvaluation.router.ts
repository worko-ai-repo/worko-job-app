// Load the npm packages
import { Router } from "express";

// Load controllers
import RequestEvaluationController from "../controllers/RequestEvaluation.controller";

// Create instance of the "RequestEvaluationController" class
const requestEvaluationController: RequestEvaluationController = new RequestEvaluationController();

// Route to hold the routes related to "RequestEvaluation" model
const RequestEvaluationRouter: Router = Router();

/**
 * Create request evaluation
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
RequestEvaluationRouter.post("/",requestEvaluationController.createRequestEvaluation);

/**
 * Bulk Create request evaluation
 * 
 * This api is used when `worko-admin` or `corporate-admin` selects a list 
 * of job applications for a single job and sends it to single evalautor
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
RequestEvaluationRouter.post("/bulk",requestEvaluationController.createBulkRequestEvaluation);

/**
 * Get request evaluations by filter options
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */
RequestEvaluationRouter.get("/", requestEvaluationController.getRequestEvaluationsByFilterOptions);

/**
 * Get request evaluation by id
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */

RequestEvaluationRouter.get("/company/:companyId",requestEvaluationController.getEvaluationsByCompanyId);

RequestEvaluationRouter.get("/:jobApplicationId/:evaluationRequestId", requestEvaluationController.getRequestEvaluationByJobApplIdAndEvaluationReqId);

// Export the "RequestEvaluationRouter" router
export default RequestEvaluationRouter;