// Import configs
import { awsS3ClientLibrary } from "../configs/aws-sdk.config";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  PreSignedUrlToUploadFileResponseDto,
  PreSignedUrlToViewFileResponseDto,
  UserJobApplicationDocumentPsuToUploadApiDto,
  UserJobApplicationDocumentPsuToViewApiDto,
  UserJobApplicationOfferLetterPsuToUploadApiDto,
  UserJobApplicationOfferLetterPsuToViewApiDto,
  UserJobApplicationPsuToUploadDocumentResponseDto,
} from "../dtos/File.dto";

// Import services
import userDetailServiceObj from "./UserDetail.service";
import UlidService from "./Ulid.service";
import { userJobApplicationServiceObj } from "./UserJobApplication.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class FileService {
  private async generateFileUploadPsu(
    bucketName: string,
    fileName: string,
    fileMimeType: string,
    fileUploadPath: string
  ): Promise<PreSignedUrlToUploadFileResponseDto> {
    const fileExtension: string = fileName.split(".").pop() as string;

    const cloudFileName: string = `${UlidService.getUlidId()}.${fileExtension}`;

    const fileSignedUrl: string =
      await awsS3ClientLibrary.getSignedUrlForUploadingObject(
        bucketName,
        `${fileUploadPath}/${cloudFileName}`,
        APP_CONSTANTS.AWS_S3_SIGNED_URL_TO_UPLOAD_FILE_EXPIRY_IN_SECONDS,
        {
          ContentType: fileMimeType,
        }
      );

    return {
      userFileName: fileName,
      cloudFileName: cloudFileName,
      fileMimeType: fileMimeType,
      fileExtension: fileExtension,
      awsS3SignedUrl: fileSignedUrl,
    };
  }

  private checkCorporateAuthorization(): void {
    const cognitoUserGroups: string[] =
      global.requestLocalContext.cognitoUserGroups;

    const { ADMIN, CORPORATE_ADMIN, CORPORATE_RECRUITER } =
      APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS;

    // If any one of admin, corporate-admin or corporate-recruiter is not present in cognitoUserGroups then throw error
    if (
      !cognitoUserGroups.includes(ADMIN) &&
      !cognitoUserGroups.includes(CORPORATE_ADMIN) &&
      !cognitoUserGroups.includes(CORPORATE_RECRUITER)
    ) {
      throw new BaseError("Unauthorized", HttpStatusCode.UNAUTHORIZED_401);
    }
  }

  private async checkApplicantAuthorization(userId: string): Promise<void> {
    const expectedUserId: string = global.requestLocalContext.userId;

    if (userId !== expectedUserId) {
      throw new BaseError("Unauthorized", HttpStatusCode.UNAUTHORIZED_401);
    }

    // Check whether user exists or not and throw error if not exists
    await userDetailServiceObj.getUserByIdOne(userId);
  }

  async generatePsuToUploadUserJobApplicationDocument(
    requestBodyObject: UserJobApplicationDocumentPsuToUploadApiDto
  ): Promise<UserJobApplicationPsuToUploadDocumentResponseDto[]> {
    const { userId, jobApplicationId, fileDetails } = requestBodyObject;

    // Check whether user exists or not and throw error if not exists
    await this.checkApplicantAuthorization(userId);

    // Check whether user job application id exists or not and throw error if not exists
    await userJobApplicationServiceObj.getJobApplicationById(jobApplicationId);

    const fileUploadPath: string =
      APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_JOB_APPL_DOC.strtr({
        "{userId}": userId,
        "{jobApplicationId}": jobApplicationId,
      });

    let response: UserJobApplicationPsuToUploadDocumentResponseDto[] = [];

    for (const eachFileDetail of fileDetails) {
      const responseObject: PreSignedUrlToUploadFileResponseDto =
        await this.generateFileUploadPsu(
          process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
          eachFileDetail.fileName,
          eachFileDetail.fileMimeType,
          fileUploadPath
        );

      const modifiedResponse: UserJobApplicationPsuToUploadDocumentResponseDto =
        {
          ...responseObject,
          corporateRequestedFileName: eachFileDetail.corporateRequestedFileName,
        };

      response.push(modifiedResponse);
    }

    return response;
  }

  async generatePsuToViewUserJobApplicationDocument(
    requestBodyObject: UserJobApplicationDocumentPsuToViewApiDto
  ): Promise<PreSignedUrlToViewFileResponseDto[]> {

    const { userId, jobApplicationId, cloudFileNames } = requestBodyObject;

    const filePath: string =
      APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_JOB_APPL_DOC.strtr({
        "{userId}": userId,
        "{jobApplicationId}": jobApplicationId,
      });

    let response: PreSignedUrlToViewFileResponseDto[] = [];

    for (const eachCloudFileName of cloudFileNames) {
      const objectUrl: string = await awsS3ClientLibrary.generateObjectUrl(
        process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
        `${filePath}/${eachCloudFileName}`
      );

      response.push({
        objectUrl: objectUrl,
      });
    }

    return response;
  }

  async generatePsuToUploadUserJobApplicationOfferLetter(
    requestBodyObject: UserJobApplicationOfferLetterPsuToUploadApiDto
  ): Promise<PreSignedUrlToUploadFileResponseDto> {
    this.checkCorporateAuthorization();

    const { userId, jobApplicationId, fileMimeType, fileName } =
      requestBodyObject;

    // Check whether user exists or not and throw error if not exists
    await userDetailServiceObj.getUserByIdOne(userId);

    // Check whether user job application id exists or not and throw error if not exists
    await userJobApplicationServiceObj.getJobApplicationById(jobApplicationId);

    const fileUploadPath: string =
      APP_CONSTANTS.AWS_S3_DIR_PATHS.HR_OFFER_LETTER_SENT.strtr({
        "{userId}": userId,
        "{jobApplicationId}": jobApplicationId,
      });

    return this.generateFileUploadPsu(
      process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
      fileName,
      fileMimeType,
      fileUploadPath
    );
  }

  async generatePsuToViewUserJobApplicationOfferLetter(
    requestBodyObject: UserJobApplicationOfferLetterPsuToViewApiDto
  ): Promise<PreSignedUrlToViewFileResponseDto> {
    const { userId, jobApplicationId, cloudFileName } = requestBodyObject;

    const filePath: string =
      APP_CONSTANTS.AWS_S3_DIR_PATHS.HR_OFFER_LETTER_SENT.strtr({
        "{userId}": userId,
        "{jobApplicationId}": jobApplicationId,
      });

    const objectUrl: string = await awsS3ClientLibrary.generateObjectUrl(
      process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
      `${filePath}/${cloudFileName}`
    );

    return {
      objectUrl: objectUrl,
    };
  }
}

const fileServiceObj: FileService = new FileService();
export { fileServiceObj, FileService };
