// Load the npm packages
import { Router } from "express";

// Load controllers
import AnalyticsController from "../controllers/Analytics.controller";

// Create instance of the "AnalyticsController" class to read the methods/functions from the same.
const analyticsController = new AnalyticsController();

// Route to hold the routes related to Analytics dashboard
const AnalyticsRouter = Router();

/**
 * Get Aggregated Funnel Velocity
 *
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
AnalyticsRouter.get(
  "/funnel-velocity",
  analyticsController.getFunnelVelocityAggregate
);

/**
 * Get Onboarding Pipeline Data
 *
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
AnalyticsRouter.get(
  "/onboarding-pipeline",
  analyticsController.getOnboardingPipelineData
);

/**
 * Get Critical Dropoff Data
 *
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
AnalyticsRouter.get(
  "/dropoff",
  analyticsController.getCriticalDropoffData
);

/**
 * Get Hiring Trend
 *
 * @authorisedRoles ["admin", "corporate-recruiter", "corporate-admin"]
 */
AnalyticsRouter.get(
  "/hiring-trend",
  analyticsController.getHiringTrend
);

// Export the "AnalyticsRouter" router
export default AnalyticsRouter;

