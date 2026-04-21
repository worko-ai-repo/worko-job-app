// Import npm packages
import { Router } from "express";

// Import controllers
import JobApplicationInterviewController from "../controllers/JobApplicationInterview.controller";

const jobApplicationInterviewController: JobApplicationInterviewController =
  new JobApplicationInterviewController();

const JobApplicationInterviewRouter: Router = Router({ mergeParams: true });

/**
 * Schedule interview round 
 * -applicationId refers to the job application for which the interview round is being scheduled 
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.post(
  "/:applicationId/interviews",
  jobApplicationInterviewController.scheduleUserApplicationInterview,
);

/**
 * List interviews for a job application
 * -applicationId refers to the job application for which the interviews are being listed
 * @authorisedRoles ["loggedInUser", "admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.get(
  "/:applicationId/interviews",
  jobApplicationInterviewController.getScheduledUserApplicationInterviewsByApplicationId,
);

/**
 * Get interview details by id
 * -applicationId refers to the job application for which the interview round is being scheduled
 * @authorisedRoles ["loggedInUser", "admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.get(
  "/:applicationId/interviews/:interviewId",
  jobApplicationInterviewController.getScheduledUserApplicationInterviewById,
);

/**
 * Reschedule interview round
 * -applicationId refers to the job application for which the interview round is being rescheduled
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.patch(
  "/:applicationId/interviews/:interviewId/reschedule",
  jobApplicationInterviewController.rescheduleUserApplicationInterview,
);

/**
 * Cancel interview round
 * -applicationId refers to the job application for which the interview round is being cancelled
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.patch(
  "/:applicationId/interviews/:interviewId/cancel",
  jobApplicationInterviewController.cancelUserApplicationInterview,
);

/**
 * Complete interview round
 * -applicationId refers to the job application for which the interview round is being completed
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin","evaluator"]
 */
JobApplicationInterviewRouter.patch(
  "/:applicationId/interviews/:interviewId/complete",
  jobApplicationInterviewController.completeUserApplicationInterview,
);

export default JobApplicationInterviewRouter;

