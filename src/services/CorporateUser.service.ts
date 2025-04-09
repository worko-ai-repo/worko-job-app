// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";

// import uuidToULID from ulidx
import { uuidToULID } from "ulidx";

// import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import DTOs
import {
  CorporateUserLisitngFilterOptions,
  CorporateUserUpdateApiDto,
  CorporateUserUpdateDto,
} from "../dtos/CorporateUser.dto";
import { PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Import daos
import {
  CorporateUserDao,
  corporateUserDaoObj,
} from "../daos/CorporateUser.dao";

// Import helpers
import { attachCompanyDetails } from "../helpers/companyDetailsInjector.helper";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCorporateUserDto } from "../db/models/CorporateUser.model";

// Import Utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CorporateUserService {
  /**
   * updateCorpUserById
   *
   * Update the details of a Corporate User
   *
   * @param {CorporateUserUpdateApiDto} - The details of the Corporate User to be updated
   * @param {string} userId - The id of the Corporate User to be updated
   * @returns {Promise<DbCorporateUserDto>} - The details of the Corporate User that was updated
   */
  async updateCorpUserById(
    corporateUserUpdateApiDto: CorporateUserUpdateApiDto,
    userId: string
  ): Promise<DbCorporateUserDto> {
    // Logger
    global.logger.info(
      "Processing request to update Corporate User. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.updateCorpUserById.name,
      }
    );

    const cognitoUserGroups: string[] =
      global.requestLocalContext.cognitoUserGroups;
    const cognitoUserId: string = global.requestLocalContext.userId;

    // Check if the user exists and throw an error if not exists
    const existingUser: QueryResponse<DbCorporateUserDto> =
      await corporateUserDaoObj.getById(userId);
    if (!existingUser.count) {
      throw new BaseError("User does not exist", HttpStatusCode.NOT_FOUND_404);
    }

    let updatedByUserId: string | undefined;
    let updatedByCorporateUserId: string | undefined;

    // If the user is a corporate user then set the `updatedByCorporateUserId` else set the `updatedByUserId`
    if (
      cognitoUserGroups.includes(
        APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_ADMIN
      ) ||
      cognitoUserGroups.includes(
        APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_RECRUITER
      )
    ) {
      updatedByCorporateUserId = uuidToULID(cognitoUserId);
      global.logger.info(
        `User is a corporate recruiter/admin with ID: ${updatedByCorporateUserId}. [service]`
      );
    } else {
      updatedByUserId = cognitoUserId;
      global.logger.info(
        `User is a worko admin with ID: ${updatedByUserId}. [service]`
      );
    }

    // Update the corporateUserUpdateDto
    const corporateUserUpdateDto: CorporateUserUpdateDto = {
      ...corporateUserUpdateApiDto,
      updatedByUserId: updatedByUserId,
      updatedByCorporateUserId: updatedByCorporateUserId,
      email: existingUser[0].email,
      companyId: existingUser[0].companyId,
    };

    // Update the details of the Corporate User
    return corporateUserDaoObj.updateCorpUserById(corporateUserUpdateDto, userId);
  }

  /**
   * deleteCorpUserById
   *
   * Delete a Corporate User
   *
   * @param {string} userId - The ID of the Corporate User to be deleted
   * @param {string} deletedByUserId - The ID of the user who is deleting this Corporate User
   * @param {string} deletedByCorporateUserId - The ID of the corporate user who is deleting this Corporate User
   * @throws {BaseError} - If the user does not exist or if the user is trying to delete its own account
   * @returns {Promise<DbCorporateUserDto>} - The deleted Corporate User details
   */
  async deleteCorpUserById(
    userId: string,
    deletedByUserId?: string,
    deletedByCorporateUserId?: string
  ): Promise<DbCorporateUserDto> {
    // Logger
    global.logger.info(
      "Processing request to delete Corporate User. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.deleteCorpUserById.name,
      }
    );

    // Revoke user from deleting its own account
    if (deletedByUserId === userId) {
      throw new BaseError(
        "You cannot delete your own account",
        HttpStatusCode.FORBIDDEN_403
      );
    }

    // Check if the user exists and throw an error if not exists
    const existingUser: QueryResponse<DbCorporateUserDto> =
      await corporateUserDaoObj.getById(userId);
    if (!existingUser.count) {
      throw new BaseError("User does not exist", HttpStatusCode.NOT_FOUND_404);
    }

    // Construct the userData
    const userData: CorporateUserUpdateDto = {
      email: existingUser[0].email,
      companyId: existingUser[0].companyId,

      deletedByUserId: deletedByUserId,
      deletedByCorporateUserId: deletedByCorporateUserId,
    };

    // Delete the Corporate User
    return corporateUserDaoObj.deleteCorpUserById(userData, userId);
  }

  /**
   * getAllCorpUsers
   *
   * Get all the Users for a Corporate User
   *
   * @param {CorporateUserLisitngFilterOptions} filterOptions - The filter options for the Corporate User
   *
   * @returns { Promise<PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>>} - The details of all the Corporate Users
   */
  async getAllCorpUsers(
    filterOptions: CorporateUserLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>
  > {
    // Logger
    global.logger.info(
      "Processing request to get all Corporate Users. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.getAllCorpUsers.name,
      }
    );

    // Get all the Corporate Users
    return corporateUserDaoObj.getAllCorpUsers(filterOptions);
  }

  /**
   * getAllCorpUsersWithCompanyDetails
   *
   * Get all the Users for a Corporate User with company Details
   *
   * @param {CorporateUserLisitngFilterOptions} filterOptions - The filter options for the Corporate User
   * @returns {Promise<PaginatedResultsWithMatchingConditionsInternalResponse<(DbCorporateUserDto & {companyDetails: DbCompanyDetailDto | undefined;})[]>>}
   */
  async getAllCorpUsersWithCompanyDetails(
    filterOptions: CorporateUserLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsInternalResponse<
      (DbCorporateUserDto & {
        companyDetails: DbCompanyDetailDto | undefined;
      })[]
    >
  > {
    // Logger
    global.logger.info(
      "Processing request to get all Corporate Users. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.getAllCorpUsersWithCompanyDetails.name,
      }
    );

    // Fetch all the user Details
    const corporateDetails: PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto> =
      await this.getAllCorpUsers(filterOptions);

    // Extract the count, timesQueried,lastKey and other details from the response
    const { lastKey, count, timesQueried, queriedCount, ...corporateUserData } =
      corporateDetails;

    // Convert the data to an array
    const userArray: DbCorporateUserDto[] = Object.values(corporateUserData);

    // Enrich the data with company details
    const corporateUsersWithCompanyDetails: (DbCorporateUserDto & {
      companyDetails: DbCompanyDetailDto | undefined;
    })[] = await attachCompanyDetails<DbCorporateUserDto>(userArray);

    // return the corporate Users with company details
    const response: PaginatedResultsWithMatchingConditionsInternalResponse<
      (DbCorporateUserDto & {
        companyDetails: DbCompanyDetailDto | undefined;
      })[]
    > = {
      data: corporateUsersWithCompanyDetails,
      lastKey: lastKey,
      count: count,
      timesQueried: timesQueried,
      queriedCount: queriedCount,
    };

    return response;
  }

  /**
   * getAllCorporateUsersWithoutPagination
   *
   * This method fetches all the corporate users without pagination. This method is used internally by the service.
   *
   * @param {string} [companyId] - The ID of the company from which the corporate users are to be fetched (defaults to undefined).
   * @returns {Promise<DbCorporateUserDto[]>} - A Promise that resolves to an array of all the corporate users in the database.
   */
  async getAllCorporateUsersWithoutPagination(
    companyId?: string
  ): Promise<DbCorporateUserDto[]> {
    global.logger.info(
      `Processing request to get all Corporate Users Without Pagination. [SERVICE]`,
      {
        filePath: __filename,
        methodName: this.getAllCorporateUsersWithoutPagination.name,
        companyId: companyId
      }
    );

    let lastKeyInternal: ObjectType | undefined = undefined;
    let pageSizeInternal = 50;
    let allCorporateUsersWithoutPagination: DbCorporateUserDto[] = [];

    // Continue fetching the data until all the data is fetched
    do {
      const filterOptions: CorporateUserLisitngFilterOptions = {
        companyId: companyId,
        lastKey: lastKeyInternal,
        pageSize: pageSizeInternal,
      };

      // Get a batch of corporate users by filter options
      const corporateUsersResponse: PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto> =
        await corporateUserDaoObj.getAllCorpUsers(filterOptions);

      const {
        lastKey,
        count,
        timesQueried,
        queriedCount,
        ...corporateUserData
      } = corporateUsersResponse;

      // Convert the data to an array
      const corporateUserArray: DbCorporateUserDto[] =
        Object.values(corporateUserData);

      // Add all the corporate users to the array
      allCorporateUsersWithoutPagination =
        allCorporateUsersWithoutPagination.concat(corporateUserArray);

      lastKeyInternal = lastKey ?? undefined;
    } while (lastKeyInternal);

    return allCorporateUsersWithoutPagination;
  }

  /**
   * scriptGetAllCorporateUsersWithoutPagination
   *
   * This method fetches all the corporate users without pagination. This method is used internally by the service.
   * 
   * @returns {Promise<DbCorporateUserDto[]>} - A Promise that resolves to an array of all the corporate users in the database.
   */
  static async scriptGetAllCorporateUsersWithoutPagination(): Promise<DbCorporateUserDto[]> {
    global.logger.info(
      `script of Processing request to get all Corporate Users Without Pagination. [SERVICE]`,
      {
        filePath: __filename,
        methodName: this.scriptGetAllCorporateUsersWithoutPagination.name,
      }
    );

    let lastKeyInternal: ObjectType | undefined = undefined;
    let pageSizeInternal = 50;
    let allCorporateUsersWithoutPagination: DbCorporateUserDto[] = [];

    // Continue fetching the data until all the data is fetched
    do {
      const filterOptions: CorporateUserLisitngFilterOptions = {
        lastKey: lastKeyInternal,
        pageSize: pageSizeInternal,
      };

      // Get a batch of corporate users by filter options
      const corporateUsersResponse: PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto> =
        await CorporateUserDao.scriptGetAllCorpUsers(filterOptions);

      const {
        lastKey,
        count,
        timesQueried,
        queriedCount,
        ...corporateUserData
      } = corporateUsersResponse;

      // Convert the data to an array
      const corporateUserArray: DbCorporateUserDto[] =
        Object.values(corporateUserData);

      // Add all the corporate users to the array
      allCorporateUsersWithoutPagination =
        allCorporateUsersWithoutPagination.concat(corporateUserArray);

      lastKeyInternal = lastKey ?? undefined;
    } while (lastKeyInternal);

    return allCorporateUsersWithoutPagination;
  }

  /**
   * getCorpUserById
   *
   * Get a Corporate User by the ID of the User
   *
   * @param {string} userId - The ID of the Corporate User
   *
   * @returns {Promise<QueryResponse<DbCorporateUserDto>>} - The details of the Corporate User that was fetched
   */
  async getCorpUserById(
    userId: string
  ): Promise<QueryResponse<DbCorporateUserDto>> {
    // Logger
    global.logger.info(
      "Processing request to get Corporate User by ID. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.getCorpUserById.name,
      }
    );

    // Get the Corporate User by the ID
    return corporateUserDaoObj.getById(userId);
  }

  /**
   * getCorpUserByIds
   *
   * Retrieves the details of Corporate Users by their IDs.
   *
   * @param {string[]} ids - The IDs of the Corporate Users.
   * @returns {Promise<DbCorporateUserDto[]>} - The details of the Corporate Users.
   */
  async getCorpUserByIds(ids: string[]): Promise<DbCorporateUserDto[]> {
    // Logger
    global.logger.info(
      "Processing request to get Corporate User by IDs. [SERVICE]",
      {
        filePath: __filename,
        methodName: this.getCorpUserByIds.name,
      }
    );
    
    // Get the Corporate User by the IDs
    return Promise.all(
      ids.map(async (userId: string): Promise<DbCorporateUserDto> => {
        return (await corporateUserServiceObj.getCorpUserById(userId))[0];
      })
    );
  }

  /**
   * getCorpUserByIdWithParsing
   *
   * Retrieves the details of a Corporate User by their ID and parses the result.
   *
   * @param {string} userId - The ID of the Corporate User.
   * @throws {BaseError} - If the Corporate User does not exist with the given ID.
   * @returns {Promise<DbCorporateUserDto>} - The details of the Corporate User.
   */
  async getCorpUserByIdWithParsing(
    userId: string
  ): Promise<DbCorporateUserDto> {
    // Get the Corporate User by the ID
    const corporateUserDetails: QueryResponse<DbCorporateUserDto> =
      await this.getCorpUserById(userId);

    // If the user does not exist, throw an error
    if (!corporateUserDetails.count) {
      throw new BaseError(
        `Corporate User does not exist with the given ID: ${userId}`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return corporateUserDetails[0];
  }
}

// Export the CorporateUserService class
const corporateUserServiceObj = new CorporateUserService();

// Export the CorporateUserService class
export { corporateUserServiceObj, CorporateUserService };
