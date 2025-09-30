// Load the npm packages
import { Router } from "express";

// Load controllers
import ResponseEvaluationController from "../controllers/ResponseEvaluation.controller";

// Load middlewares
import { responseEvaluationMiddlewareObj } from "../middlewares/ResponseEvaluation.middleware";

// Create instance of the "ResponseEvaluationController" class
const responseEvaluationController: ResponseEvaluationController = new ResponseEvaluationController();

// Route to hold the routes related to "ResponseEvaluation" model
const ResponseEvaluationRouter: Router = Router();

/**
 * Create response evaluation
 * @authorisedRoles ["evaluator"]
 */
ResponseEvaluationRouter.post(
  "/",
  responseEvaluationMiddlewareObj.validateCreateResponseEvaluation,
  responseEvaluationController.createResponseEvaluation
);

/**
 * Get response evaluations by filter options
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */
ResponseEvaluationRouter.get("/", responseEvaluationController.getResponseEvaluationsByFilterOptions);

/**
 * Get response evaluation by job application ID and ID
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin", "evaluator"]
 */
ResponseEvaluationRouter.get("/:jobApplicationId/:id", responseEvaluationController.getResponseEvaluationByJobApplicationIdAndId);

// Export the "ResponseEvaluationRouter" router
export default ResponseEvaluationRouter;