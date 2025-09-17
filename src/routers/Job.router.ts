// Load the npm packages
import { Router } from "express";

// Load controllers
import JobController from "../controllers/Job.controller";

// Create instance of the "JobController" class to read the methods/functions from the same.
const jobController = new JobController();

// Route to hold the routes (CRUD, etc) related to "Job" index
const JobRouter = Router();

/**
 * Create job 
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
JobRouter.post("/", jobController.createJob);

/**
 * Define a POST route for parsing job description
 * 
 * 1. This route is used to accept a job description from the frontend
 * 2. It will call the lambda function to parse the job description 
 * 3. And return the parsed job description to the frontend
 * 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
JobRouter.post("/parsejd", jobController.parseJobDescription);

/**
 * Get job by id
 * 
 * @authorisedRoles ["public"]
 */
JobRouter.get("/:id", jobController.getJobById);

/**
 * Get job by filter options 
 * 
 * @authorisedRoles ["public"]
 */
JobRouter.get("/", jobController.getAllJobsByFilterOptions);

/**
 * Update job by id
 * 
 * @authorisedRoles ["loggedInUser", "admin", "corporate-recruiter", "corporate-admin"]
 */
JobRouter.put("/:id", jobController.updateInternalOrExternalJobById);

/**
 * Delete job by id
 * 
 * @authorisedRoles ["admin", "corporate-admin"]
 */
JobRouter.put("/:jobId/delete", jobController.softDeleteJobById);

/**
 * Update bulk job 
 * 
 * @authorisedRoles ["admin", "corporate-admin", "corporate-recruiter"]
 */
JobRouter.patch("/bulk-update", jobController.updateBulkJob);

// Export the "JobRouter" router
export default JobRouter;