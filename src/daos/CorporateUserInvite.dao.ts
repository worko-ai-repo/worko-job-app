// import Aws QueryResponse
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

// import luxon library for date formatting
import { DateTime } from "luxon";

// import BaseDao
import BaseDao from "./Base.dao";

// import Constants
import APP_CONSTANTS from "../configs/constants.config";

// import dtos
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";
import {
    CorporateUserInviteLisitngFilterOptions,
    CorporateUserInviteUpdateDto,
} from "../dtos/CorporateUserInvite.dto";

// Import Enums
import { SortOrderTypeEnum } from "../enums/Common.enum";
import { CorpInviteStatusEnum } from "../enums/CorporateUserInvite.enum";

// import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// Import Models
import {
    CorporateUserInviteModel,
    DbCorporateUserInviteDto
} from "../db/models/CorporateUserInvite.model";

/**
 * CorporateInviteDao
 * 
 * This class is used to interact with the database for the corporate invite requests.
 * 
 * @implements {BaseDao} - The base dao interface for all DAO.
 */
class CorporateInviteDao implements BaseDao {
  // Prepare the Keys for DB Operations
  modelName: string = "CorporateInvite";

  partitianKey: string = "COMP#ID#{companyId}";
  sortKeys: { SK_INIT: string } = { SK_INIT: "CORP#USR#INVT#{email}#ID#{id}" };
  GSI1PK: string = "CORP#USR#INVT#";
  GSI1SK = "ID#{id}";

  /**
   * getInvitesByCompanyId
   *
   * This method is used to get the list of corporate invites from the database for a specific company.
   *
   * @param {string} companyId - The company ID for which the invites are to be fetched.
   *
   * @returns {Promise<QueryResponse<DbCorporateUserInviteDto>>} - The list of corporate invites.
   *
   * @see CorporateUserInviteModel - The model used to interact with the database.
   */
  async getInvitesByCompanyId(
    companyId: string
  ): Promise<QueryResponse<DbCorporateUserInviteDto>> {
    global.logger.info("Fetching Corporate Invite list. [DAO]", {
      filePath: __filename,
      methodName: this.getInvitesByCompanyId.name,
    });

    // Return the list of corporate invites for the company
    return CorporateUserInviteModel.query("PK")
      .eq(this.partitianKey.strtr({ companyId: companyId }))
      .where("SK")
      .beginsWith("CORP#USR#INVT#")
      .exec();
  }

  /**
   * getInviteByUserEmailAndCompanyId
   *
   * This method is used to fetch the corporate invite for a user by email and company id.
   *
   * @param {string} companyId - The company ID for which the invite is to be fetched.
   * @param {string} email - The email of the user for which the invite is to be fetched.
   *
   * @returns {Promise<QueryResponse<DbCorporateUserInviteDto>>} - The corporate invite for the user.
   *
   * @see CorporateUserInviteModel - The model used to interact with the database.
   */
  async getInviteByUserEmailAndCompanyId(
    companyId: string,
    email: string
  ): Promise<QueryResponse<DbCorporateUserInviteDto>> {
    // log the details
    global.logger.info(
      `Fetching Corporate Invite By User Email and Company Id. [DAO]`,
      {
        filePath: __filename,
        methodName: this.getInviteByUserEmailAndCompanyId.name,
        companyId: companyId,
        email: email,
      }
    );

    // prepare Partition Key
    const PK: string = this.partitianKey.strtr({
      "{companyId}": companyId,
    });

    // Use sortKeys.SK_INIT with dynamic replacements
    const SK_BEGINS_WITH: string = this.sortKeys.SK_INIT.strtr({
      "{email}": email || "", // Replace with empty string if email is not provided
      "{id}": "", // Replace with empty string or other default value if needed
    });
    
    global.logger.debug(`PK: ${PK}, SK_BEGINS_WITH: ${SK_BEGINS_WITH}`);
    // return the invite
    return CorporateUserInviteModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK_BEGINS_WITH)
      .exec();
  }

  /**
   * getAllInvites
   *
   * This method is used to get all the corporate invite requests from the database.
   *
   * @param {CorporateUserInviteLisitngFilterOptions} filterOptions - The filter options to be applied to the query.
   *
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto>>} - The list of corporate invites.
   *
   * @see {DbCorporateUserInviteDto} - The DTO used to interact with the database.
   */
  async getAllInvites(
    filterOptions: CorporateUserInviteLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto>
  > {
    global.logger.info("Fetching all corporate invites. [DAO]", {
      filePath: __filename,
      methodName: this.getAllInvites.name,
    });

    // Initialize the query
    let query: Query<DbCorporateUserInviteDto>;

    // Apply company id filter
    if (filterOptions.companyId) {
      global.logger.info(`company id is given, so use PK & SK`)
      query = CorporateUserInviteModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{companyId}": filterOptions.companyId,
          })
        )
        .where("SK")
        .beginsWith("CORP#USR#INVT#");
    } else {
      // If no company id is provided, fetch all invites
      query = CorporateUserInviteModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith("ID#");
    }

    // Apply corporateUserType filter if provided
    if (filterOptions.corporateUserType?.length) {
      query = query
        .where("corporateUserType")
        .contains(filterOptions.corporateUserType);
    }

    // Apply inviteStatus filter
    if (filterOptions.inviteStatus) {
      query = query.where("inviteStatus").eq(filterOptions.inviteStatus);
    }

    // Apply search options on the jobs
    if (filterOptions.searchText) {
      // set the search text
      let searchTextValue: string = filterOptions.searchText.toLowerCase();

      // Add the search text to the query
      query = query.and().parenthesis((condition) => {
        condition
          .where("firstName")
          .contains(searchTextValue)
          .or()
          .where("lastName")
          .contains(searchTextValue)
          .or()
          .where("email")
          .contains(searchTextValue);

        return condition;
      });
    }

    // When you use the sort() method in Dynamoose, it sorts the items based on the sort key of the index you're querying.
    query = query.sort(filterOptions.sortOrder as SortOrderTypeEnum);

    // Execute the query and return the result
    return getPaginatedResultsWithMatchingConditions<
      DbCorporateUserInviteDto,
      CorporateUserInviteLisitngFilterOptions
    >(query, filterOptions);
  }

  /**
   * getInviteById
   *
   * This method is used to fetch the Access Request Invitations by ID
   *
   * @param {string} inviteId - The ID of the invite to be fetched.
   *
   * @returns {Promise<QueryResponse<DbCorporateUserInviteDto>>} - The corporate invite.
   *
   * @see {DbCorporateUserInviteDto} - The DTO used to interact with the database.
   */
  async getInviteById(
    inviteId: string
  ): Promise<QueryResponse<DbCorporateUserInviteDto>> {
    global.logger.info("Fetching Corporate Invite By Id [DAO]", {
      filePath: __filename,
      methodName: this.getInviteById.name,
    });

    // Get the list of corporate invites from the database
    return CorporateUserInviteModel.query("GSI1PK")
      .eq(this.GSI1PK)
      .where("GSI1SK")
      .eq(this.GSI1SK.strtr({ "{id}": inviteId }))
      .exec();
  }

  /**
   * updateInviteById
   *
   * This method is used to update the corporate invite request by its ID.
   *
   * @param {DbCorporateUserInviteDto} existingInvite - The full record of an existing invite that needs to be updated.
   * @param {CorporateUserInviteUpdateDto} corporateUserInviteUpdateDto - The DTO containing the fields to be updated.
   *
   * @returns {Promise<DbCorporateUserInviteDto>} - The updated corporate invite.
   */
  async updateInviteById(
    existingInvite: DbCorporateUserInviteDto,
    corporateUserInviteUpdateDto: Partial<CorporateUserInviteUpdateDto>
  ): Promise<DbCorporateUserInviteDto> {
    global.logger.info("Updating Corporate Invite Request. [DAO]", {
      filePath: __filename,
      methodName: this.updateInviteById.name,
    });

    // Destructure CompanyId and email from the update DTO
    const { companyId, email, ...inviteData } = corporateUserInviteUpdateDto;
    const keys = {
      PK: this.partitianKey.strtr({
        "{companyId}": corporateUserInviteUpdateDto.companyId as string,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{email}": corporateUserInviteUpdateDto.email as string,
        "{id}": existingInvite.id,
      }),
    };

    // Create the expiration date for the invite 15 days from now
    const creationDate: Date = DateTime.now()
      .plus({ days: APP_CONSTANTS.CORPORATE_USER_INVITE_DATE_EXPIRATION })
      .setZone(APP_CONSTANTS.APP_DEFAULT_TIMEZONE)
      .toJSDate();

    // If we want to change the status to awaiting
    if (
      corporateUserInviteUpdateDto.inviteStatus ===
      CorpInviteStatusEnum.AWAITING
    ) {
      // CASE 1: And if the invite is deleted
      if (existingInvite.isDeleted === true) {
        return CorporateUserInviteModel.update(keys, {
          ...inviteData,
          isDeleted: false,
          expiresAt: creationDate,
        });
      }

      // CASE2: If the inviteStatus is expired then simply update the expiresAt field and status
      return CorporateUserInviteModel.update(keys, {
        ...inviteData,
        expiresAt: creationDate,
      });
    }
    // Update the Corporate Invite in the database for all other cases
    return CorporateUserInviteModel.update(keys, inviteData);
  }

  /**
   * softDeleteInvite
   *
   * This method is used to delete the corporate invite request by its ID.
   *
   * @param {string} inviteId - The Id of the invite to be deleted.
   * @params {CorporateUserInviteUpdateDto} corporateUserInviteUpdateDto - The DTO containing the fields to be updated.
   */
  async softDeleteInvite(
    inviteId: string,
    corporateUserInviteUpdateDto: CorporateUserInviteUpdateDto
  ) {
    global.logger.info("Deleting Corporate Invite Request. [DAO]", {
      filePath: __filename,
      methodName: this.softDeleteInvite.name,
    });

    const keys = {
      PK: this.partitianKey.strtr({
        "{companyId}": corporateUserInviteUpdateDto.companyId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{email}": corporateUserInviteUpdateDto.email,
        "{id}": inviteId,
      }),
    };

    // Delete the access request in the database
    return CorporateUserInviteModel.update(keys, {
      isDeleted: true,
      inviteStatus: CorpInviteStatusEnum.DELETED,
      deletedByUserId: corporateUserInviteUpdateDto.deletedByUserId,
      deletedByCorporateUserId:
        corporateUserInviteUpdateDto.deletedByCorporateUserId,
    });
  }
}

const corporateInviteDaoObj = new CorporateInviteDao();

export { CorporateInviteDao, corporateInviteDaoObj };