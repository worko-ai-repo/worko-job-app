// Load the npm packages
import { Router } from "express";

// Load controllers
import UserJobApplicationController from "../controllers/UserJobApplication.controller";

// Create instance of the "UserJobApplicationController" class to read the methods/functions from the same.
const userJobApplicationController = new UserJobApplicationController();

// Route to hold the routes (CRUD, etc) related to "UserJobApplication" model
const UserJobApplicationRouter = Router();

/**
 * Create job application
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.post("/", userJobApplicationController.createJobApplication);

/**
 * Get matching Score for job application
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.get("/:id/score", userJobApplicationController.getJobApplicationScore);

/**
 * Get job application by id
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.get("/:id", userJobApplicationController.getJobApplicationById);

/**
 * Get job applications by filter options 
 * @authorisedRoles ["loggedInUser"] 
 */
UserJobApplicationRouter.get("/", userJobApplicationController.getJobApplicationsByFilterOptions);

/**
 * Update job application based on the provided parameters in route
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationRouter.patch("/:id/corp-action", userJobApplicationController.updateJobApplicationByCorpUser);

/**
 * Request feedback by candidate
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.patch("/:id/request-feedback", userJobApplicationController.updateJobApplicationRequestFeedback);

/**
 * Delete job application by id
 * @authorisedRoles ["admin"]
 */
UserJobApplicationRouter.delete("/:id", userJobApplicationController.deleteUserJobApplicationById);

// Export the "UserJobApplicationRouter" router
export default UserJobApplicationRouter;