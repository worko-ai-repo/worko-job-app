// Load the npm packages
import { Router } from "express";

// Load controllers
import UserExternalJobApplicationController from "../controllers/UserExternalJobApplication.controller";

// Create instance of the "UserExternalJobApplicationController" class to read the methods/functions from the same.
const userExternalJobApplicationController = new UserExternalJobApplicationController();

// Route to hold the routes (CRUD, etc) related to "UserExternalJobApplication" model
const UserExternalJobApplicationRouter = Router();

/**
 * Create user external job application
 * 
 * @authorisedRoles [loggedInUser]
 */
UserExternalJobApplicationRouter.post("/", userExternalJobApplicationController.createUserExternalJobApplication);

// Export the "UserExternalJobApplicationRouter" router
export default UserExternalJobApplicationRouter;