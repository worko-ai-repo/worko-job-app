// Load the npm packages
import { Router } from "express";

// Load controllers
import UserMatchingScoreJobController from "../controllers/UserMatchingScoreJob.controller";

// Create instance of the "UserMatchingScoreJobController" class to read the methods/functions from the same.
const userMatchingScoreJobController = new UserMatchingScoreJobController();

// Route to hold the routes (CRUD, etc) related to "UserMatchingScoreJob" model
const UserMatchingScoreJobRouter = Router();

/**
 * createAllUserMatchingScoreJobByUserId
 * 
 * This endpoint is responsible for creating the "UserMatchingScoreJob" model
 * for a specific "userId" and list of "jobIds".
 * 
 * @authorisedRoles ["loggedInUser"]
 */
UserMatchingScoreJobRouter.put("/", userMatchingScoreJobController.createAllUserMatchingScoreJobByUserId);

/**
 * getAllUserMatchingScoreJobByUserId
 * 
 * This endpoint is responsible for getting the "UserMatchingScoreJob" model
 * for a specific "userId".
 * 
 * @authorisedRoles ["loggedInUser"]
 */
UserMatchingScoreJobRouter.get("/", userMatchingScoreJobController.getAllUserMatchingScoreJobByUserId);

// Export the "UserMatchingScoreJobRouter" router
export default UserMatchingScoreJobRouter;