// Load the npm packages
import { Router } from "express";

// Load controllers
import ReferAndEarnController from "../controllers/ReferAndEarn.controller";

// Create instance of the "JobController" class to read the methods/functions from the same.
const referAndEarnController = new ReferAndEarnController();

const ReferAndEarnRouter = Router();

/**
 * Create new ReferAndEarn
 *
 * @authorisedRoles ["loggedInUser"]
 */
ReferAndEarnRouter.post("/", referAndEarnController.createReferAndEarn);

/**
 * Get existing ReferAndEarn by id
 *
 * @authorisedRoles ["loggedInUser"]
 */
ReferAndEarnRouter.get("/:id", referAndEarnController.getReferAndEarnById);

/**
 * Get all ReferAndEarn
 *
 * @authorisedRoles ["loggedInUser"]
 */
ReferAndEarnRouter.get("/", referAndEarnController.getReferAndEarnByFilterOptions);

/**
 * Update existing ReferAndEarn by given parameters
 *
 * @authorisedRoles ["admin"]
 */
ReferAndEarnRouter.patch("/:id", referAndEarnController.updateReferAndEarnById);

/**
 * updateReferAndEarnRequestWithdrawal
 * 
 * Whenever the `referrer` requests a withdrawal a popup will be shown to the `referrer`
 * and `referrer` will fill his bank details and clicks submit button then
 * this endpoint will be called and In this endpoint we will update the `ReferAndEarn` model
 * and send email to the `worko admin` with bank details of the `referrer`
 * 
 * @authorisedRoles ["loggedInUser"]
 */
ReferAndEarnRouter.patch("/:id/request-withdrawal", referAndEarnController.updateReferAndEarnRequestWithdrawal);

export default ReferAndEarnRouter;