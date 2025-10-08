// Load the npm packages
import { Router } from "express";

// Load controllers
import EvaluatorDetailController from "../controllers/EvaluatorDetail.controller";

// Create instance of the "EvaluatorDetailController" class
const evaluatorDetailController: EvaluatorDetailController = new EvaluatorDetailController();

// Route to hold the routes related to "EvaluatorDetail" model
const EvaluatorDetailRouter: Router = Router();

/**
 * Route to create a new evaluator
 * @authorisedRoles ["evaluator"]
 */
EvaluatorDetailRouter.post("/", evaluatorDetailController.createEvaluatorDetail);

/**
 * Route to get evaluator details by id
 * @authorisedRoles ["evaluator"]
 */
EvaluatorDetailRouter.get("/:id", evaluatorDetailController.getEvaluatorDetailById);

/**
 * Route to get evaluator details by email id
 * @authorisedRoles ["evaluator"]
 */
EvaluatorDetailRouter.get("/:emailId/email", evaluatorDetailController.getEvaluatorDetailByEmail);

// Export the "EvaluatorDetailRouter" router
export default EvaluatorDetailRouter;