// Load the npm packages
import { Router } from "express";

// Load controllers
import CountUserController from "../controllers/CountUser.controller";

const countUserController = new CountUserController();

const CountUserRouter: Router = Router();

/**
 * Get count by registered email and entity type
 *
 * @authorisedRoles ["CAND","admin"]
 */
CountUserRouter.get("/:registeredEmail/:entityType/user", countUserController.getCountUserByRegisteredEmailAndEntityType);

export default CountUserRouter;