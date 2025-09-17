import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import configs
import APP_CONSTANTS from "../configs/constants.config";
import { awsS3ClientLibrary } from "../configs/aws-sdk.config";

// Load the local daos
import userDetailDao from "../daos/UserDetail.dao";

// Load the local dtos
import { UserDetailDTO } from "../dtos/UserDetail.dto";

// Load the local models
import { DbUserDetailDto } from "../db/models/UserDetail.model";

// Load the local types
import { UserDetailProfileInfoType } from "../types/UserDetail.type";

// Inport local utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

// @todo all methods from everything (Dao, Service, etc) should return the response,
// it will help the caller to know what happed with the action and what is the response.

/**
 *  UserDetailService class responsible for managing user-related operations.
 */
class UserDetailService {
  /**
   * Retrieves user details by email id.
   *
   * @param {string} email - Email of the user
   * @returns {Promise<QueryResponse<DbUserDetailDto>>} - Details of the user
   */
  async get(email: string): Promise<QueryResponse<DbUserDetailDto>> {
    // logger
    global.logger.info("Get user detail by email [service]", {
      filePath: __filename,
      methodName: this.get.name,
      email
    });
    
    // Return the user details
    return userDetailDao.get(email);
  }

  /**
   * getUserDetailsByEmail
   *
   * Retrieves user details by email id and parses the result.
   *
   * @param email - Email of the user
   * @returns {Promise<DbUserDetailDto>} - Details of the user
   * @throws {BaseError} If the user details are not found
   */
  async getUserDetailsByEmail(
    email: string
  ): Promise<DbUserDetailDto> {
    // get candidate details by candidateEmailId and throw error if not found
    const candidateDetails: QueryResponse<DbUserDetailDto> =
      await userDetailDao.get(email);
    if (!candidateDetails.count) {
      throw new BaseError(
        `Candidate details not found with candidate EmailId ${email}. Please check the information and try again.`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return candidateDetails[0];
  }


  /**
   * getUserDetailsByEmailIds
   *
   * Retrieves user details by given email id list.
   *
   * @param emailIds - List of email ids of the users
   * @returns {Promise<UserDetailProfileInfoType[]>} - List of user details
   */
  async getUserDetailsByEmailIds(emailIds: string[]): Promise<UserDetailProfileInfoType[]> {
    // Log the action
    global.logger.info("Get user details by ids [service]",{
      filePath: __filename,
      methodName: this.getUserDetailsByEmailIds.name
    });

    // Get user details by email
    const userDetailsArray: Promise<UserDetailProfileInfoType>[] = emailIds.map((emailId: string) => {
      return this.getUserProfileDetailsByEmail(emailId);
    })

    // Return the user details
    return Promise.all(userDetailsArray);
  }

  /**
   * Retrieves user profile details by email id.
   *
   * @param email - Email of the user
   * @returns {Promise<UserDetailProfileInfoType>} - Details of the user including
   *  - userDetails: DbUserDetailDto
   *  - cvAwsS3SignedUrl: string | null - Signed URL to download the CV
   *  - profileImageAwsS3SignedUrl: string | null - Signed URL to view the Profile
   * @throws {BaseError} If the user details are not found
   */
  async getUserProfileDetailsByEmail(email: string): Promise<UserDetailProfileInfoType> {
    global.logger.info("Get user profile details by email [service]");

    // Get user details by email
    const userDetails: DbUserDetailDto = await this.getUserDetailsByEmail(email);

    // Prepare the user id
    let userId: string = userDetails.SK?.split("#").pop() ?? "";
    global.logger.debug(`userId to get user profile details : `,{
      userId
    });

    let cvAwsS3SignedUrl = null;
    let profileImageAwsS3SignedUrl = null;

    // Check if CV is present
    if (userDetails.CV) {
      // Construct the file path in the cloud storage
      const filePath: string = APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_RESUME.strtr({
        "{userId}": userId,
      });

      // Assume that you have a method to generate the object URL
      cvAwsS3SignedUrl = await awsS3ClientLibrary.generateObjectUrl(
        process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
        filePath + "/" + userDetails.CV
      );

      global.logger.debug(`CV details: `,{
        filePath,
        cvAwsS3SignedUrl,
      });
    }

    // Gnereta e signed url to view the Profile
    if (userDetails.profileImage) {
      // Construct the file path in the cloud storage
      const filePath: string = APP_CONSTANTS.AWS_S3_DIR_PATHS.USER_PROFILE_PIC.strtr({
        "{userId}": userId,
      });

      // Assume that you have a method to generate the object URL
      profileImageAwsS3SignedUrl = await awsS3ClientLibrary.generateObjectUrl(
        process.env.APP_AWS_S3_BUCKET_WORKO_APP as string,
        filePath + "/" + userDetails.profileImage
      );

      global.logger.debug(`profileImage details: `,{
        filePath,
        profileImageAwsS3SignedUrl,
      })
    }

    const userProfileDetails: UserDetailProfileInfoType = {
      userDetails,
      cvAwsS3SignedUrl,
      profileImageAwsS3SignedUrl,
    }; 
    global.logger.debug(`userProfileDetails: `,{
      userProfileDetails
    })

    return userProfileDetails;
  }

  /**
   * Retrieves user details by user id.
   *
   * @param userId - ID of the user
   * @returns {Promise<QueryResponse<DbUserDetailDto>>>} - Details of the user
   */
  async getUserById(userId: string): Promise<QueryResponse<DbUserDetailDto>> {
    console.log("Get user detail by userId [service]");
    return userDetailDao.getUserById(userId);
  }

  /**
   * getUserByIds
   *
   * Retrieves user details for a list of user IDs.
   *
   * @param {string[]} userIds - The list of user IDs.
   * @returns {Promise<DbUserDetailDto[]>} - A promise that resolves to an array of user details.
   */
  async getUserByIds(userIds: string[]): Promise<DbUserDetailDto[]> {
    // Log the action
    global.logger.info("Get user details by ids [service]", {
      filePath: __filename,
      methodName: this.getUserByIds.name,
    });

    // return all user details by ids
    return Promise.all(
      userIds.map(async (userId: string): Promise<DbUserDetailDto> => {
        return (await userDetailDao.getUserById(userId))[0];
      })
    ); 
  }

  /**
   * getUserByIdOne
   *
   * Retrieves user details by user id and parses the result.
   *
   * @param userId - ID of the user
   * @throws {BaseError} If the user details are not found
   * @returns {Promise<DbUserDetailDto>} - Details of the user
   */
  async getUserByIdOne(userId: string): Promise<DbUserDetailDto> {
    global.logger.info(`Get user detail by userId with parsing [service]`,{
      filePath: __filename,
      methodName: this.getUserByIdOne.name,
      userId
    });

    // Get the user details by userId and throw error if not found
    const userDetail: QueryResponse<DbUserDetailDto> =
      await userDetailDao.getUserById(userId);
    if (!userDetail.count) {
      throw new BaseError(
        `User Details Not Found`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Return the parsed user details
    return userDetail[0];
  }

  /**
   * Updates an existing user Detail.
   *
   * @param email - Email of the user
   * @param userDetailDTO - Data Transfer Object containing updated user Detail details
   * @returns {Promise<any>} - A Promise that resolves when the Detail is successfully updated
   */
  async update(
    email: string,
    SK: string,
    userDetailDTO: Partial<UserDetailDTO>
  ): Promise<any> {
    // Logging the action of updating user Detail in the service layer
    logger.info("Updating user Detail [UserDetailService]");

    return userDetailDao.update(email, SK, userDetailDTO);
  }

  /**
   * updateLastAccessedDash
   *
   * Updates the last accessed dashboard for a user
   *
   * @param email - Email of the user
   * @param userlastAccessedDash - User's Last Accessed Dashboard
   */
  async updateLastAccessedDash(email: string, userLastAccessedDash: string) {
    // Fetch the User Details .
    let userDetails = await this.get(email);

    // Throw BaseError if user not present
    if (!userDetails.count) {
      throw new BaseError(
        `The user details not found for the provided email "${email}" address.`
      );
    }

    // Prepare the details required to be updated for the user
    let userModifiedDetails: Partial<UserDetailDTO> = {
      lastAccessedDash: userLastAccessedDash,
    };

    // Check if userType exists or does not exist
    const updatedUserType = userDetails[0].userType || [];

    // If the userType is not present then add it.
    if (!updatedUserType.includes(userLastAccessedDash)) {
      // Push the user type as it is not present
      updatedUserType.push(userLastAccessedDash);

      // Update the user type
      userModifiedDetails.userType = updatedUserType;
    }

    // Update the user details
    return this.update(email, userDetails[0].SK, userModifiedDetails);
  }
}

// Export an instance of the UserService class
export default new UserDetailService();
