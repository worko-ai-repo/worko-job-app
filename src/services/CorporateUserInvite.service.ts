// Import  QueryResponse
import { QueryResponse } from 'dynamoose/dist/ItemRetriever';
import { ObjectType } from 'dynamoose/dist/General';

// Import Luxon
import { DateTime } from 'luxon';

// Import Constants
import APP_CONSTANTS from '../configs/constants.config';

// Import DTO
import { CorporateUserInviteUpdateDto, CorporateUserInviteLisitngFilterOptions } from '../dtos/CorporateUserInvite.dto';
import { PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse } from '../dtos/Common.dto';

// Import DAO
import { corporateInviteDaoObj } from '../daos/CorporateUserInvite.dao';

// Import Enums
import { CorpInviteStatusEnum } from '../enums/CorporateUserInvite.enum';

// Import Helpers
import { attachCompanyDetails } from '../helpers/companyDetailsInjector.helper';

// Import Models
import { DbCompanyDetailDto } from '../db/models/CompanyDetail.model';
import { DbCorporateUserInviteDto } from '../db/models/CorporateUserInvite.model';

// Import Services
import companyServiceObj from '../services/Company.service';

// Import utils
import { BaseError } from '../utils/errors.util';
import HttpStatusCode from '../utils/http-codes.util';

/**
 * CorporateInviteService
 * 
 * This is a service class responsible for handling corporate-related operations from the admin side.
 */
class CorporateIserInviteService {
  /**
   * getAllInvites
   *
   * This method is used to get all the access requests for the company.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto>>}
   */
  async getAllInvites(
    filterOptions: CorporateUserInviteLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto>
  > {
    global.logger.info("Fetching all corporate invites. [service]", {
      filePath: __filename,
      methodName: this.getAllInvites.name,
    });

    // Get the list of corporate invites from the database
    return corporateInviteDaoObj.getAllInvites(filterOptions);
  }

  /**
   * getAllInvitesWithCompanyDetails
   *
   * This method is used to get all the corporate invites from the database. It also checks if the request is past the Expiry Date or not and if yes then updates the status to Expired.
   * The method also enriches the data with company details.
   *
   * @param {CorporateUserInviteLisitngFilterOptions} filterOptions - The filter options to be applied to the query.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsInternalResponse<(DbCorporateUserInviteDto & { companyDetails: DbCompanyDetailDto | undefined; })[]>>}
   *
   * @see {CorporateUserInviteLisitngFilterOptions} - The filter options used by the service.
   * @see {PaginatedResultsWithMatchingConditionsResponse} - The response structure of the method.
   * @see {DbCorporateUserInviteDto} - The DTO used to interact with the database.
   * @see {DbCompanyDetailDto} - The DTO used to interact with the database.
   */
  async getAllInvitesWithCompanyDetails(
    filterOptions: CorporateUserInviteLisitngFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsInternalResponse<
      (DbCorporateUserInviteDto & {
        companyDetails: DbCompanyDetailDto | undefined;
      })[]
    >
  > {
    global.logger.info("Fetching all corporate invites. [service]", {
      filePath: __filename,
      methodName: this.getAllInvitesWithCompanyDetails.name,
    });

    // Get the list of corporate invites from the database
    const allInviteData: PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto> =
      await this.getAllInvites(filterOptions);

    // Extract the count, timesQueried,lastKey and other details from the response
    const { lastKey, count, timesQueried, queriedCount, ...userInviteData } =
      allInviteData;

    // Extract the array of user details from corporateDetails.
    const userInviteArray: DbCorporateUserInviteDto[] =
      Object.values(userInviteData);

    // Check if the request is past the Expiry Date or not if yes then update the status to Expired
    let updatedInvite: DbCorporateUserInviteDto[] =
      await this.accessRequestExpiryCheck(userInviteArray);

    // Enrich the data with company details
    const invitesWithCompanyDetails: (DbCorporateUserInviteDto & {
      companyDetails: DbCompanyDetailDto | undefined;
    })[] = await attachCompanyDetails<DbCorporateUserInviteDto>(updatedInvite);

    // Return all the invites with company details
    const allInviteDataWithCompanyDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
      (DbCorporateUserInviteDto & {
        companyDetails: DbCompanyDetailDto | undefined;
      })[]
    > = {
      data: invitesWithCompanyDetails,
      lastKey: lastKey,
      count: count,
      timesQueried: timesQueried,
      queriedCount: queriedCount,
    };

    return allInviteDataWithCompanyDetails;
  }

  /**
   * getInviteById
   *
   * This method is used to fetch the Invite Request Invitations by ID
   *
   * @param {string} inviteId - The ID of the Invite Request to be fetched.
   *
   * @returns {Promise<QueryResponse<DbCorporateUserInviteDto>>} - The Invite Request with the specified ID.
   */
  async getInviteById(
    inviteId: string
  ): Promise<QueryResponse<DbCorporateUserInviteDto>> {
    global.logger.info("Fetching Corporate Invite By Id [service]", {
      filePath: __filename,
      methodName: this.getInviteById.name,
    });

    // Get the list of corporate invites from the database
    return corporateInviteDaoObj.getInviteById(inviteId);
  }

  /**
   * getInviteByIdWithCompanyName
   *
   * This method fetches the corporate invite details by the given invite ID and
   * enriches it with the associated company name. It checks whether the invite
   * request is past its expiry date and updates the status to expired if necessary.
   * If the invite or company details are not found, it throws an appropriate error.
   *
   * @param {string} inviteId - The ID of the invite to be fetched with company details.
   * @throws {BaseError} - Throws an error if the invite request or company details are not found.
   * @returns {Promise<Partial<DbCorporateUserInviteDto> & { companyName: string }>}
   *          - The invite details along with the company name.
   */
  async getInviteByIdWithCompanyName(inviteId: string): Promise<
    Partial<DbCorporateUserInviteDto> & {
      companyName: string;
    }
  > {
    global.logger.info("Fetching Corporate Invite By Id with Company Details", {
      filePath: __filename,
      methodName: this.getInviteByIdWithCompanyName.name,
    });

    // Get the invite details by ID and throw an error if not found
    let InviteDetailsById: QueryResponse<DbCorporateUserInviteDto> =
      await this.getInviteById(inviteId);
    if (!InviteDetailsById.count) {
      // Throw an error if the Invite Request is not found
      throw new BaseError(
        `Invite Request with ID: ${inviteId} not found`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Check if the request is past the Expiry Date or not if yes then update the status to Expired
    let updatedInvite: DbCorporateUserInviteDto[] =
      await this.accessRequestExpiryCheck(InviteDetailsById);

    // Get the company details and throw an error if not found
    let companyDetails: QueryResponse<DbCompanyDetailDto> =
      await companyServiceObj.getCompanyDetailById(updatedInvite[0].companyId);
    if (!companyDetails.count) {
      throw new BaseError(
        "Company details not found",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Extract the invite details
    const inviteDetails: DbCorporateUserInviteDto = InviteDetailsById[0];

    // Attach the company name
    const finalInviteDetails: Partial<DbCorporateUserInviteDto> & {
      companyName: string;
    } = {
      ...inviteDetails,
      companyName: companyDetails[0].name, // Attach the company name
    };

    // Return the updated InviteDetails
    return finalInviteDetails;
  }

  /**
   * updateInviteById
   *
   * This method is used to update the corporate invite request by its ID.
   * The method first checks if the invite request exists and throws an error if not found.
   * Then it updates the invite request using the provided fields.
   *
   * @param {string} inviteId - The ID of the invite request to be updated.
   * @param {Partial<CorporateUserInviteUpdateDto>} corporateUserInviteDto - The DTO containing the fields to be updated.
   * @returns {Promise<DbCorporateUserInviteDto>} - The updated corporate invite.
   * @throws {BaseError} - Throws an error if the invite request is not found.
   */
  async updateInviteById(
    inviteId: string,
    corporateUserInviteDto: Partial<CorporateUserInviteUpdateDto>
  ): Promise<DbCorporateUserInviteDto> {
    global.logger.info("Updating Corporate Invite Request. [service]", {
      filePath: __filename,
      methodName: this.updateInviteById.name,
    });

    // Get the invite details by ID and throw an error if not found
    let existingInvite: QueryResponse<DbCorporateUserInviteDto> =
      await this.getInviteById(inviteId);
    if (!existingInvite.count) {
      // Throw an error if the Invite Request is not found
      throw new BaseError(
        `Invite Request Details Not Found`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    corporateUserInviteDto.companyId = existingInvite[0].companyId;
    corporateUserInviteDto.email = existingInvite[0].email;

    // Update the Invite Request in the database
    const updatedInvite = corporateInviteDaoObj.updateInviteById(
      existingInvite[0],
      corporateUserInviteDto
    );

    return updatedInvite;
  }

  /**
   * softDeleteInvite
   *
   * This method is used to soft delete the corporate invite by ID.
   * It checks if the invite request exists and throws an error if not found.
   * It then updates the Invite Request in the database and marks it as deleted.
   *
   * @param {string} inviteId - The ID of the invite to be deleted.
   * @param {string} deletedByUserId - The ID of the user who is deleting this invite.
   * @param {string} deletedByCorporateUserId - The ID of the corporate user who is deleting this invite.
   * @throws {BaseError} - Throws an error if the invite request is not found.
   * @returns {Promise<DbCorporateUserInviteDto>} - The deleted corporate invite.
   */
  async softDeleteInvite(
    inviteId: string,
    deletedByUserId?: string,
    deletedByCorporateUserId?: string
  ): Promise<DbCorporateUserInviteDto> {
    global.logger.info("Deleting Corporate Invite Request. [service]", {
      filePath: __filename,
      methodName: this.softDeleteInvite.name,
    });

    // Find if the Invite Request exists
    let existingInvite: QueryResponse<DbCorporateUserInviteDto> =
      await this.getInviteById(inviteId);
    if (!existingInvite.count) {
      // Throw an error if the Invite Request is not found
      throw new BaseError(
        `Invite Request Not Found`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Update the email and companyId in the inviteUpdateRequestDto
    let inviteUpdateRequestDto: CorporateUserInviteUpdateDto = {
      email: existingInvite[0].email,
      companyId: existingInvite[0].companyId,

      deletedByUserId: deletedByUserId,
      deletedByCorporateUserId: deletedByCorporateUserId,
    };

    // Delete the Invite Request from the database
    return corporateInviteDaoObj.softDeleteInvite(
      inviteId,
      inviteUpdateRequestDto
    );
  }

  /**
   * accessRequestExpiryCheck
   *
   * This method is used to check if the Invite Requests are expired or not and update the status to Expired if they are.
   *
   * @param {DbCorporateUserInviteDto[]} invitesDetails - The array of Invite Requests to be checked.
   * @returns {Promise<DbCorporateUserInviteDto[]>} - The updated array of Invite Requests.
   */
  async accessRequestExpiryCheck(
    invitesDetails: DbCorporateUserInviteDto[]
  ): Promise<DbCorporateUserInviteDto[]> {
    const updatePromises: Promise<DbCorporateUserInviteDto>[] =
      invitesDetails.map(async (invite: DbCorporateUserInviteDto) => {
        // If the invite status is already deleted, do not update it
        if (
          invite.isDeleted ||
          invite.inviteStatus === CorpInviteStatusEnum.EXPIRED ||
          invite.inviteStatus === CorpInviteStatusEnum.DELETED
        ) {
          return invite;
        }

        // Convert expiresAt to a Luxon DateTime object
        const expirationDate: DateTime<true> | DateTime<false> =
          DateTime.fromJSDate(invite.expiresAt);

        // If the current date is greater than the expiration date, then that means the invite has expired, so update the invite status to `EXPIRED`
        if (
          DateTime.now().setZone(APP_CONSTANTS.APP_DEFAULT_TIMEZONE) >
          expirationDate
        ) {
          const inviteUpdateRequestDto: CorporateUserInviteUpdateDto = {
            inviteStatus: CorpInviteStatusEnum.EXPIRED,
            email: invite.email,
            companyId: invite.companyId,
          };

          global.logger.debug(`Updating expired Invite Request`, {
            filePath: __filename,
            methodName: this.accessRequestExpiryCheck.name,
            companyId: invite.companyId,
            inviteId: invite.id,
            email: invite.email,
          });

          // Update the Invite Request in the database
          return await corporateInviteDaoObj.updateInviteById(
            invite,
            inviteUpdateRequestDto
          );
        } else {
          return invite;
        }
      });

    // Wait for all update operations to complete
    const updatedInvites: DbCorporateUserInviteDto[] = await Promise.all(
      updatePromises
    );

    // Filter out any undefined values (in case some requests were not updated)
    return updatedInvites.filter((invite) => invite !== undefined);
  }

  /**
   * getAllCorporateUserInvitesWithoutPagination
   *
   * This method fetches all the corporate user Invites without pagination. This method is used internally by the service.
   *
   * @returns {Promise<DbCorporateUserInviteDto[]>} - A Promise that resolves to an array of all the corporate user Invites in the database.
   */
  async getAllCorporateUserInvitesWithoutPagination(): Promise<DbCorporateUserInviteDto[]> {
    global.logger.info(
      `Processing request to get all Corporate User Invites Without Pagination. [SERVICE]`,
      {
        filePath: __filename,
        methodName: this.getAllCorporateUserInvitesWithoutPagination.name,
      }
    );

    let lastKeyInternal: ObjectType | undefined = undefined;
    let pageSizeInternal = 50;
    let allCorporateUserInvitesWithoutPagination: DbCorporateUserInviteDto[] = [];

    // Continue fetching the data until all the data is fetched
    do {
      const filterOptions: CorporateUserInviteLisitngFilterOptions = {
        lastKey: lastKeyInternal,
        pageSize: pageSizeInternal,
      };

      // Get a batch of corporate user invites by filter options
      const corporateUserInvitesResponse: PaginatedResultsWithMatchingConditionsResponse<DbCorporateUserInviteDto> =
        await corporateInviteDaoObj.getAllInvites(filterOptions);

      const {
        lastKey,
        count,
        timesQueried,
        queriedCount,
        ...corporateUserInvitesData
      } = corporateUserInvitesResponse;

      // Convert the data to an array
      const corporateUserInvitesArray: DbCorporateUserInviteDto[] =
        Object.values(corporateUserInvitesData);

      // Add all the corporate users to the array
      allCorporateUserInvitesWithoutPagination =
        allCorporateUserInvitesWithoutPagination.concat(
          corporateUserInvitesArray
        );

      lastKeyInternal = lastKey ?? undefined;
    } while (lastKeyInternal);

    return allCorporateUserInvitesWithoutPagination;
  }
}

// Create a single instance of this class
const corporateUserInviteServiceObj = new CorporateIserInviteService();

// Export the instance and the class
export { CorporateIserInviteService, corporateUserInviteServiceObj };