// Load the npm packages
import { Router } from "express";

// Load controllers
import CountCompanyController from "../controllers/CountCompany.controller";

// Load middlewares
import { countCompanyMiddlewareObj } from "../middlewares/CountCompany.middleware";

const countCompanyController = new CountCompanyController();

const CountCompanyRouter: Router = Router();

/**
 * Get count by company id and entity type
 *
 * @authorisedRoles ["corporate-admin", "corporate-recruiter"]
 */
CountCompanyRouter.get(
  "/:companyId/:entityType/company",
  countCompanyMiddlewareObj.validateGetCountCompany,
  countCompanyController.getCountCompanyByCompanyIdAndEntityType
);

/**
 * Get company job status counts (published, closed, archived, draft)
 *
 * @route GET /count-company/:companyId/job-status-counts
 * @authorisedRoles ["corporate-admin", "corporate-recruiter"]
 */
CountCompanyRouter.get(
  "/:companyId/job-status-counts",
  countCompanyMiddlewareObj.validateGetCountCompany,
  countCompanyController.getCompanyJobStatusCounts
);

export default CountCompanyRouter;