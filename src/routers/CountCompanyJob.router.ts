// Load the npm packages
import { Router } from "express";

// Load controllers
import CountCompanyJobController from "../controllers/CountCompanyJob.controller";

const countCompanyJobController = new CountCompanyJobController();

const CountCompanyJobRouter: Router = Router();

/**
 * Get count by company id, job id and entity type
 *
 * @authorisedRoles ["admin", "corporate-admin", "corporate-recruiter"]
 */
CountCompanyJobRouter.get(
  "/:companyId/:jobId/:entityType/company-job",
  countCompanyJobController.getCountCompanyJobByCompanyIdJobIdAndEntityType
);

export default CountCompanyJobRouter;