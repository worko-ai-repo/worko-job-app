// Import QueryResponse
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

// Convert UUID to ULID
import { uuidToULID } from "ulidx";

// Import DTOs
import { CorporateUserCreateDto, CorporateUserLisitngFilterOptions, CorporateUserUpdateDto } from "../dtos/CorporateUser.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Import daos
import BaseDao from "./Base.dao";

// Import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";

// Import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// Import Models
import { CorporateUserModel, DbCorporateUserDto } from "../db/models/CorporateUser.model";

/**
 * CorporateUserDao
 * 
 * This is the DAO class for the Corporate User
 * 
 * @implements {BaseDao} - The BaseDao Interface
 */
class CorporateUserDao implements BaseDao {
  // Declareing the BaseDao as a property
  modelName: string = "CorporateUser";
  partitianKey: string = "COMP#ID#{companyId}";
  sortKeys: { SK_INIT: string } = { SK_INIT: "CORP#USR#REG#{email}#ID#{id}" };
  GSI1PK: string = "CORP#USR#REG#";
  GSI1SK = "ID#{id}";

  /**
   * getUserByCompanyIdAndUserEmail
   *
   * Get the details of a Corporate User
   *
   * @param {string} email - The email of the Corporate User
   * @param {string} companyId - The company id of the Corporate User
   *
   * @returns {Promise<QueryResponse<DbCorporateUserDto>>} - The details of the Corporate User
   */
  async getUserByCompanyIdAndUserEmail(
    email: string,
    companyId: string
  ): Promise<QueryResponse<DbCorporateUserDto>> {
    // log the details
    global.logger.info("Getting the details of a Corporate User [DAO]", {
      filePath: __filename,
      methodName: this.getUserByCompanyIdAndUserEmail.name,
    });

    // prepare sort Key
    const SK: { SK_INIT: string } = { SK_INIT: "CORP#USR#REG#{email}#ID#" };

    // return the details of the Corporate User
    return CorporateUserModel.query("PK")
      .eq(this.partitianKey.strtr({ "{companyId}": companyId }))
      .where("SK")
      .beginsWith(SK.SK_INIT.strtr({ "{email}": email }))
      .exec();
  }

  /**
   * getById
   *
   * Get the details of a Corporate User by Id
   *
   * @param {string} userId - The id of the Corporate User
   *
   * @return {Promise<QueryResponse<DbCorporateUserDto>>} - The details of the Corporate User
   */
  async getById(userId: string): Promise<QueryResponse<DbCorporateUserDto>> {
    global.logger.info("Getting the details of a Corporate User by Id [DAO]", {
      filePath: __filename,
      methodName: this.getById.name,
    });

    // return the details of the Corporate User
    return CorporateUserModel.query("GSI1PK")
      .eq(this.GSI1PK)
      .where("GSI1SK")
      .eq(this.GSI1SK.strtr({ "{id}": userId }))
      .exec();
  }

  /**
   * createCorporateUser
   *
   * Create a new Corporate User
   *
   * @param {CorporateUserCreateDto} userDetails - The details of the Corporate User to be created
   *
   * @returns {Promise<DbCorporateUserDto>} - The details of the Corporate User that was created
   */
  async createCorporateUser(
    userDetails: CorporateUserCreateDto
  ): Promise<DbCorporateUserDto> {
    global.logger.info("Creating a new Corporate User [DAO]", {
      filePath: __filename,
      methodName: this.createCorporateUser.name,
      cognitoUserId: userDetails.cognitoUserId,
      email: userDetails.email,
      companyId: userDetails.companyId,
    });

    // Convert the UUID to ULID
    let userIdInUlid: string = uuidToULID(userDetails.cognitoUserId);

    // Create a new Corporate User
    const fullUserdetails = {
      ...userDetails,

      PK: this.partitianKey.strtr({
        "{companyId}": userDetails.companyId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{email}": userDetails.email,
        "{id}": userIdInUlid,
      }),
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": userIdInUlid,
      }),
      id: userIdInUlid,
    };

    // This will create a user with the details provided for the corporate.
    return CorporateUserModel.create(fullUserdetails);
  }

  /**
   * updateCorpUserById
   *
   * Updates the details of a Corporate User in the database.
   *
   * @param {CorporateUserUpdateDto} userDetails - The DTO containing the updated details of the Corporate User.
   * @param {string} userId - The unique identifier of the Corporate User to be updated.
   *
   * @returns {Promise<DbCorporateUserDto>} - A promise that resolves to the updated Corporate User details.
   */
  async updateCorpUserById(
    userDetails: CorporateUserUpdateDto,
    userId: string
  ): Promise<DbCorporateUserDto> {
    global.logger.info("Updating the details of a Corporate User [DAO]", {
      filePath: __filename,
      methodName: this.updateCorpUserById.name,
    });
    // Construct the keys
    const keys = {
      PK: this.partitianKey.strtr({ "{companyId}": userDetails.companyId }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{email}": userDetails.email,
        "{id}": userId,
      }),
    };

    // Destruct the details that need to be updated
    const { email, companyId, ...updateObject } = userDetails;

    // Update the details of the Corporate User
    return CorporateUserModel.update(keys, updateObject);
  }

  /**
   * deleteCorpUserById
   *
   * Delete a Corporate User
   *
   * @param {string} userId - The id of the Corporate User to be deleted
   * @param {CorporateUserUpdateDto} - The details of the Corporate User that was deleted
   */
  async deleteCorpUserById(
    userDetails: CorporateUserUpdateDto,
    userId: string
  ): Promise<DbCorporateUserDto> {
    global.logger.info("Deleting a Corporate User [DAO]", {
      filePath: __filename,
      methodName: this.deleteCorpUserById.name,
    });

    // Construct the keys
    const keys = {
      PK: this.partitianKey.strtr({ "{companyId}": userDetails.companyId }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{email}": userDetails.email,
        "{id}": userId,
      }),
    };

    // Delete the Corporate User
    return CorporateUserModel.update(keys, {
      isDeleted: true,
      deletedByUserId: userDetails.deletedByUserId,
      deletedByCorporateUserId: userDetails.deletedByCorporateUserId,
    });
  }

  /**
   * getAllCorpUsers
   *
   * Get all Corporate Users
   *
   * @param {CorporateUserLisitngFilterOptions} filterOptions - The filter options for the Corporate User
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>>} - The details of all Corporate Users
   */
  async getAllCorpUsers(
    filterOptions: CorporateUserLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>
  > {
    global.logger.info("Getting all Corporate Users [DAO]", {
      filePath: __filename,
      methodName: this.getAllCorpUsers.name,
    });

    // Construct the query
    let query: Query<DbCorporateUserDto>;

    // If the company ID is provided, then get the list of corporate user from the database
    if (filterOptions.companyId) {
      query = CorporateUserModel.query("PK")
        .eq(this.partitianKey.strtr({ "{companyId}": filterOptions.companyId }))
        .where("SK")
        .beginsWith("CORP#USR#REG#");
    } else {
      // If the company ID is not provided, then get the list of corporate user from the database
      query = CorporateUserModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith("ID#");
    }

    // Apply status filter
    if (filterOptions.cognitoUserId) {
      query = query.where("cognitoUserId").eq(filterOptions.cognitoUserId);
    }

    // Apply company ID filter to filterByCompanyId
    if (filterOptions.corporateUserType?.length) {
      query = query
        .where("corporateUserType")
        .contains(filterOptions.corporateUserType);
    }

    // Apply search filter
    if (filterOptions.searchText) {
      // Logger message
      global.logger.info("Fetching All Users With Search. [DAO]", {
        filePath: __filename,
        methodName: this.getAllCorpUsers.name,
        searchTextValue: filterOptions.searchText,
      });

      // Remove trailing and leading spaces
      let searchTextValue = filterOptions.searchText.toLowerCase();

      query = query.and().parenthesis((condition) => {
        condition
          .where("firstName")
          .contains(searchTextValue)
          .or()
          .where("lastName")
          .contains(searchTextValue)
          .or()
          .where("email")
          .contains(searchTextValue)
          .or()
          .where("id")
          .contains(searchTextValue);

        return condition;
      });
    }

    // When you use the sort() method in Dynamoose, it sorts the items based on the sort key of the index you're querying.
    query = query.sort(filterOptions.sortOrder as SortOrderTypeEnum);

    // Execute the query and return the result
    return getPaginatedResultsWithMatchingConditions<
      DbCorporateUserDto,
      CorporateUserLisitngFilterOptions
    >(query, filterOptions); // passed args
  }

  /**
   * scriptGetAllCorpUsers
   *
   * script to Get all old Corporate Users
   *
   * @param {CorporateUserLisitngFilterOptions} filterOptions - The filter options for the Corporate User
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>>} - The details of all Corporate Users
   */
  static async scriptGetAllCorpUsers(
    filterOptions: CorporateUserLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserDto>
  > {
    global.logger.info("script to Get all old Corporate Users [DAO]", {
      filePath: __filename,
      methodName: this.scriptGetAllCorpUsers.name,
    });
    // If the company ID is not provided, then get the list of corporate user from the database
    let query = CorporateUserModel.query("GSI1PK")
      .eq("CORP#USR#") // old GSI1SK
      .where("GSI1SK")
      .beginsWith("ID#");

    // When you use the sort() method in Dynamoose, it sorts the items based on the sort key of the index you're querying.
    query = query.sort(filterOptions.sortOrder as SortOrderTypeEnum);

    // Execute the query and return the result
    return getPaginatedResultsWithMatchingConditions<
      DbCorporateUserDto,
      CorporateUserLisitngFilterOptions
    >(query, filterOptions); // passed args
  }
}

// Creating a new instance of the CorporateUserDao class
const corporateUserDaoObj = new CorporateUserDao();

// Exporting the CorporateUserDao class
export { corporateUserDaoObj, CorporateUserDao };