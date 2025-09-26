// Load the npm packages
import { Request, Response, NextFunction } from "express";

class UserJobApplicationMiddleware {
  validateUserJobApplicationUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}

const userJobApplicationMiddleware: UserJobApplicationMiddleware =
  new UserJobApplicationMiddleware();
export default userJobApplicationMiddleware;
