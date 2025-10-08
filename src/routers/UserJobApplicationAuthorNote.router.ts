// Load the npm packages
import { Router } from "express";

// Load controllers
import UserJobApplicationAuthorNoteController from "../controllers/UserJobApplicationAuthorNote.controller";

// Create instance of the "UserJobApplicationAuthorNoteController" class to read the methods/functions from the same.
const userJobApplicationAuthorNoteController = new UserJobApplicationAuthorNoteController();

// Route to hold the routes (CRUD, etc) related to "UserJobApplicationAuthorNote" model
const UserJobApplicationAuthorNoteRouter: Router = Router();

/**
 * Create job application note
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationAuthorNoteRouter.post("/", userJobApplicationAuthorNoteController.createUserJobApplicationAuthorNote);

/**
 * Get job application note by id
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationAuthorNoteRouter.get("/:jobApplicationId/:authorId", userJobApplicationAuthorNoteController.getUserJobApplicationAuthorNote);

/**
 * Update job application note by id
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
UserJobApplicationAuthorNoteRouter.patch("/:jobApplicationId/:noteId", userJobApplicationAuthorNoteController.updateUserJobApplicationAuthorNote);

// Export the "UserJobApplicationAuthorNoteRouter" router
export default UserJobApplicationAuthorNoteRouter;