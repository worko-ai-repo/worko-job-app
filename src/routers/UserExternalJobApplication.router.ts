// Load the npm packages
import { Router } from "express";

// Load controllers
import UserExternalJobApplicationController from "../controllers/UserExternalJobApplication.controller";

// Create instance of the "UserExternalJobApplicationController" class to read the methods/functions from the same.
const userExternalJobApplicationController = new UserExternalJobApplicationController();

// Route to hold the routes (CRUD, etc) related to "UserExternalJobApplication" model
const UserExternalJobApplicationRouter = Router();

/**
 * createUserExternalJobApplication
 * 
 * Create user external job application
 * 
 * @authorisedRoles [loggedInUser]
 */
UserExternalJobApplicationRouter.post("/", userExternalJobApplicationController.createUserExternalJobApplication);

/**
 * getByJobIdAndApplicantUserEmail
 * 
 * Get external job application by `jobId` and `applicant user email` 
 * 
 * @authorisedRoles [loggedInUser]
 */
UserExternalJobApplicationRouter.get("/:jobId/:applicantUserEmail", userExternalJobApplicationController.getByJobIdAndApplicantUserEmail);

// Export the "UserExternalJobApplicationRouter" router
export default UserExternalJobApplicationRouter;