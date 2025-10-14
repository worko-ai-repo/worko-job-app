// Load the npm packages
import { Router } from "express";

// Load controllers
import CountGlobalController from "../controllers/CountGlobal.controller";

const countGlobalController: CountGlobalController = new CountGlobalController();

const CountGlobalRouter: Router = Router();

/**
 * Get count global by entity type
 *
 * @authorisedRoles ["admin"]
 */
CountGlobalRouter.get(
  "/:entityType/global-count",
  countGlobalController.getCountGlobalByEntityType
);

export default CountGlobalRouter;