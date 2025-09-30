// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import {
  UserJobApplicationAuthorNoteCreateApiDTO,
  UserJobApplicationAuthorNoteUpdateApiDTO,
} from "../dtos/UserJobApplicationAuthorNote.dto";

// Import helpers
import { getActionByUserId } from "../helpers/user.helper";

// import models
import { DbUserJobApplicationAuthorNoteDto } from "../db/models/UserJobApplicationAuthorNote.model";

// import services
import { userJobApplicationAuthorNoteServiceObj } from "../services/UserJobApplicationAuthorNote.service";

// import schemas
import {
  userJobApplicationAuthorNoteCreateValidation,
  userJobApplicationAuthorNoteUpdateValidation,
} from "../schemas/UserJobApplicationAuthorNote.schema";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

/**
 * UserJobApplicationAuthorNoteController
 *
 * Controller for handling user job application author note-related operations
 */
class UserJobApplicationAuthorNoteController {
  /**
   * createUserJobApplicationAuthorNote
   *
   * Controller for creating a new job application note
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object used to send back the API response
   * @param {NextFunction} next - Express next function for error handling
   */
  createUserJobApplicationAuthorNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create Job Application Note [Controller]`, {
        methodName: this.createUserJobApplicationAuthorNote.name,
      });

      // Extract and validate the note data from request body
      const reqBody: UserJobApplicationAuthorNoteCreateApiDTO = req.body;
      const { error: reqBodyError, value: noteRequestBody } =
        userJobApplicationAuthorNoteCreateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Create the note using the service
      const newNoteDetails: DbUserJobApplicationAuthorNoteDto =
        await userJobApplicationAuthorNoteServiceObj.performCreateUserJobApplicationAuthorNoteActivities(
          noteRequestBody
        );

      res.status(HttpStatusCode.CREATED_201).json(newNoteDetails);
    } catch (error) {
      global.logger.error(
        `Error in Catch block of Create Job Application Note [Controller]`,
        {
          methodName: this.createUserJobApplicationAuthorNote.name,
          error,
        }
      );
      next(error);
    }
  };

  getUserJobApplicationAuthorNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jobApplicationId: string = req.params.jobApplicationId;
      const authorId: string = req.params.authorId;
      const { actionByUserId, actionByCorporateUserId } = getActionByUserId();


      /**
       * @todo in `worko-auth.mjs` the username and cognito groups are getting as `null`, neeed to debug this
       */
      /*
      let authorId: string;
      if (actionByUserId) {
        authorId = actionByUserId;
      } else if (actionByCorporateUserId) {
        authorId = actionByCorporateUserId;
      } else {
        throw new BaseError(
          "Author ID not found",
          HttpStatusCode.BAD_REQUEST_400
        );
      }
      */

      global.logger.info(`Get Job Application Note [Controller]`, {
        methodName: this.getUserJobApplicationAuthorNote.name,
        jobApplicationId,
        authorId,
      });

      const noteDetails: QueryResponse<DbUserJobApplicationAuthorNoteDto> =
        await userJobApplicationAuthorNoteServiceObj.getNotesByJobApplicationIdAndAuthorId(
          jobApplicationId,
          authorId
        );
      if (!noteDetails.count) {
        throw new BaseError("Note not found", HttpStatusCode.NOT_FOUND_404);
      }

      res.status(HttpStatusCode.OK_200).json(noteDetails[0]);
    } catch (error) {
      global.logger.error(
        `Error in Catch block of Get Job Application Note [Controller]`,
        {
          methodName: this.getUserJobApplicationAuthorNote.name,
          error,
        }
      );
      next(error);
    }
  };

  updateUserJobApplicationAuthorNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Update Job Application Note [Controller]`, {
        methodName: this.updateUserJobApplicationAuthorNote.name,
      });

      const jobApplicationId: string = req.params.jobApplicationId;
      const dynamodbNoteItemId: string = req.params.noteId;

      // Extract and validate the note data from request body
      const reqBody: UserJobApplicationAuthorNoteUpdateApiDTO = req.body;
      const { error: reqBodyError, value: noteRequestBody } =
        userJobApplicationAuthorNoteUpdateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Update the note using the service
      const updatedNoteDetails: DbUserJobApplicationAuthorNoteDto =
        await userJobApplicationAuthorNoteServiceObj.performUpdateUserJobApplicationAuthorNoteActivities(
          jobApplicationId,
          dynamodbNoteItemId,
          noteRequestBody
        );

      res.status(HttpStatusCode.OK_200).json(updatedNoteDetails);
    } catch (error) {
      global.logger.error(
        `Error in Catch block of Update Job Application Note [Controller]`,
        {
          methodName: this.updateUserJobApplicationAuthorNote.name,
          error,
        }
      );
      next(error);
    }
  };
}

export default UserJobApplicationAuthorNoteController;