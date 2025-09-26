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
 * getByJobIdAndApplicantUserEmail
 * 
 * Get user job application by `jobId` and `applicant user email` 
 * 
 * @authorisedRoles [loggedInUser]
 */
UserJobApplicationRouter.get("/:jobId/:applicantUserEmail", userJobApplicationController.getUserJobApplicationByEmailIdAndJobId);

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
 * Update job application by applicant
 * 
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.patch("/:id/applicant-action", userJobApplicationController.updateJobApplicationByApplicant);

/**
 * Request feedback by candidate
 * @authorisedRoles ["loggedInUser"]
 */
UserJobApplicationRouter.patch("/:id/request-feedback", userJobApplicationController.updateJobApplicationRequestFeedback);

/**
 * Send to recruiter by admin
 * @authorisedRoles ["admin"]
 */
UserJobApplicationRouter.patch("/:id/display-to-corporate", userJobApplicationController.updateJobApplicationDisplayToCorporate);

/**
 * Bulk update job applications
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationRouter.patch("/bulk-update", userJobApplicationController.updateBulkJobApplication);

/**
 * Update job application based on the provided parameters in route
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationRouter.put("/:id/hired-from-other-portal", userJobApplicationController.updateUserJobApplicationHiredFromOtherPortalDetails);

// Export the "UserJobApplicationRouter" router
export default UserJobApplicationRouter;