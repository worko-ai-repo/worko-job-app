
import { Router } from "express";

// Import controllers
import FileController from "../controllers/File.controller";

const fileController: FileController = new FileController();

const FileRouter: Router = Router();

/**
 * Generate pre-signed url to upload the file to aws s3
 *
 * @authorisedRoles ["loggedInUser"]
 */
FileRouter.post(
  "/gsu2u/:resourceKey",
  fileController.generatePreSignedUrlsToUpload
);

/**
 * Generate pre-signed url to view the file in aws s3
 *
 * @authorisedRoles ["loggedInUser"]
 */
FileRouter.post(
  "/gsu2v/:resourceKey",
  fileController.generatePreSignedUrlsToView
);

export default FileRouter;