// Load npm packages
import { Request, Response, NextFunction } from "express";

// Import dtos
import { PreSignedUrlToUploadFileResponseDto, PreSignedUrlToViewFileResponseDto, UserJobApplicationDocumentPsuToUploadApiDto, UserJobApplicationDocumentPsuToViewApiDto, UserJobApplicationOfferLetterPsuToUploadApiDto, UserJobApplicationOfferLetterPsuToViewApiDto, UserJobApplicationPsuToUploadDocumentResponseDto } from "../dtos/File.dto";

// Import enums
import { FileResourceKeyEnum } from "../enums/File.enum";

// Import services
import { fileServiceObj } from "../services/File.service";

// Import schemas
import { userJobApplicationDocumentPsuToUploadApiDtoValidation, userJobApplicationDocumentPsuToViewApiDtoValidation, userJobApplicationOfferLetterPsuToUploadApiDtoValidation, userJobApplicationOfferLetterPsuToViewApiDtoValidation } from "../schemas/File.schema";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

class FileController {
  generatePsuToUploadUserJobApplicationDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let requestBodyObject: UserJobApplicationDocumentPsuToUploadApiDto =
        req.body;

      const { error } =
        userJobApplicationDocumentPsuToUploadApiDtoValidation.validate(
          requestBodyObject,
          {
            abortEarly: false,
          }
        );
      if (error) {
        throw new RequestValidationError(error);
      }

      const response: UserJobApplicationPsuToUploadDocumentResponseDto[] =
        await fileServiceObj.generatePsuToUploadUserJobApplicationDocument(
          requestBodyObject
        );

      return res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url for file upload. [File Controller]`,
        {
          error,
          methodName: this.generatePsuToUploadUserJobApplicationDocument.name,
        }
      );
      next(error);
    }
  };

  generatePsuToUploadUserJobApplicationOfferLetter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let requestBodyObject: UserJobApplicationOfferLetterPsuToUploadApiDto =
        req.body;

      const { error } =
        userJobApplicationOfferLetterPsuToUploadApiDtoValidation.validate(
          requestBodyObject,
          {
            abortEarly: false,
          }
        );
      if (error) {
        throw new RequestValidationError(error);
      }

      const response: PreSignedUrlToUploadFileResponseDto =
        await fileServiceObj.generatePsuToUploadUserJobApplicationOfferLetter(
          requestBodyObject
        );

      return res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url for offer letter upload. [File Controller]`,
        {
          error,
          methodName:
            this.generatePsuToUploadUserJobApplicationOfferLetter.name,
        }
      );
      next(error);
    }
  };

  generatePreSignedUrlsToUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resourceKey: string = req.params["resourceKey"];

      global.logger.info(
        `Generating pre-signed url to upload file. [File Controller]`,
        {
          resourceKey,
          methodName: this.generatePreSignedUrlsToUpload.name,
        }
      );

      switch (resourceKey) {
        case FileResourceKeyEnum.USER_JOB_APPL_DOC:
          await this.generatePsuToUploadUserJobApplicationDocument(
            req,
            res,
            next
          );
          break;

        case FileResourceKeyEnum.HR_OFFER_LETTER_SENT:
          await this.generatePsuToUploadUserJobApplicationOfferLetter(
            req,
            res,
            next
          );
          break;

        default:
          throw new BaseError(
            "The provided 'resourceKey' is invalid. Please provide a valid 'resourceKey'.",
            HttpStatusCode.BAD_REQUEST_400
          );
      }
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url for file upload. [File Controller]`,
        {
          error,
          methodName: this.generatePreSignedUrlsToUpload.name,
        }
      );
      next(error);
    }
  };

  generatePsuToViewUserJobApplicationDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let requestBodyObject: UserJobApplicationDocumentPsuToViewApiDto =
        req.body;

      const { error } =
        userJobApplicationDocumentPsuToViewApiDtoValidation.validate(
          requestBodyObject,
          {
            abortEarly: false,
          }
        );
      if (error) {
        throw new RequestValidationError(error);
      }

      const response: PreSignedUrlToViewFileResponseDto[] =
        await fileServiceObj.generatePsuToViewUserJobApplicationDocument(
          requestBodyObject
        );

      return res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url to view file. [File Controller]`,
        {
          error,
          methodName: this.generatePsuToViewUserJobApplicationDocument.name,
        }
      );
      next(error);
    }
  };

  generatePsuToViewUserJobApplicationOfferLetter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let requestBodyObject: UserJobApplicationOfferLetterPsuToViewApiDto =
        req.body;

      const { error } =
        userJobApplicationOfferLetterPsuToViewApiDtoValidation.validate(
          requestBodyObject,
          {
            abortEarly: false,
          }
        );
      if (error) {
        throw new RequestValidationError(error);
      }

      const response: PreSignedUrlToViewFileResponseDto =
        await fileServiceObj.generatePsuToViewUserJobApplicationOfferLetter(
          requestBodyObject
        );

      return res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url to view offer letter. [File Controller]`,
        {
          error,
          methodName: this.generatePsuToViewUserJobApplicationOfferLetter.name,
        }
      );
      next(error);
    }
  };

  generatePreSignedUrlsToView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resourceKey: string = req.params["resourceKey"];

      global.logger.info(
        `Generating pre-signed url to view file. [File Controller]`,
        {
          resourceKey,
          methodName: this.generatePreSignedUrlsToView.name,
        }
      );

      switch (resourceKey) {
        case FileResourceKeyEnum.USER_JOB_APPL_DOC:
          await this.generatePsuToViewUserJobApplicationDocument(
            req,
            res,
            next
          );
          break;

        case FileResourceKeyEnum.HR_OFFER_LETTER_SENT:
          await this.generatePsuToViewUserJobApplicationOfferLetter(
            req,
            res,
            next
          );
          break;

        default:
          throw new BaseError(
            "The provided 'resourceKey' is invalid. Please provide a valid 'resourceKey'.",
            HttpStatusCode.BAD_REQUEST_400
          );
      }
    } catch (error) {
      global.logger.error(
        `Error at catch block in while generating pre-signed url to view file. [File Controller]`,
        {
          error,
          methodName: this.generatePreSignedUrlsToView.name,
        }
      );
      next(error);
    }
  };
}

export default FileController;
