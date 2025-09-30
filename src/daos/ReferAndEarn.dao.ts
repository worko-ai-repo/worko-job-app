// Import dynamoose types
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";
import { Condition } from "dynamoose/dist/Condition";

// Import luxon
import { DateTime } from "luxon";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import BaseDao from "./Base.dao";

// Import dtos
import {
  ReferAndEarnCreateDto,
  ReferAndEarnFilterOptions,
  ReferAndEarnStatusTrackerDto,
  ReferAndEarnUpdateDto,
  UpdateReferAndEarnInternalDto,
} from "../dtos/ReferAndEarn.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";
import {
  ReferAndEarnJobApplicationStatusEnum,
  ReferAndEarnStatusEnum,
} from "../enums/ReferAndEarn.enum";

// Import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// Import models
import {
  DbReferAndEarnDto,
  ReferAndEarnModel,
} from "../db/models/ReferAndEarn.model";

// Import services
import UlidService from "../services/Ulid.service";

/**
 * ReferAndEarnDao
 */
class ReferAndEarnDao implements BaseDao {
  // Define the model name, partition key, and sort keys for the ReferAndEarn table
  modelName = "ReferAndEarn";
  partitianKey = "USR#EML#{primaryEmail}"; // referrer email: "primaryEmail" is the `referrerEmail`
  sortKeys = { SK_REFER_AND_EARN_ID: "REF#EARN#ID#{id}" };
  GSI1PK = "JOBS#REF#EARN#";
  GSI1SK = "ID#{id}";
  GSI2PK = "COMP#ID#{companyId}#REF#EARN#";
  GSI2SK = "ID#{id}";

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} primaryEmail - The primary email of the user.
   * @param {string} id - The id of the refer and earn.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    primaryEmail: string,
    id: string
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{primaryEmail}": primaryEmail,
      }),
      SK: this.sortKeys.SK_REFER_AND_EARN_ID.strtr({
        "{id}": id,
      }),
    };
  }

  /**
   * createReferAndEarn
   *
   * Creates a new refer and earn record in the database.
   *
   * @param {string} referrerEmail - The email of the referrer.
   * @param {ReferAndEarnCreateDto} referAndEarnData - The refer and earn data to be created.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the newly created refer and earn data.
   */
  async createReferAndEarn(
    referrerEmail: string,
    referAndEarnData: ReferAndEarnCreateDto
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Create Refer and earn [Dao]", {
      filePath: __filename,
    });

    // Generate ulid id
    const ulidId: string = UlidService.getUlidId();

    // Get current date
    const currentDateTime: string = DateTime.now().toISO();

    // Prepare status tracker data
    const statusTrackerData: ReferAndEarnStatusTrackerDto[] = [
      {
        oldStatus: undefined,
        newStatus: ReferAndEarnStatusEnum.NOT_ACHIEVED_YET,
        actionDate: currentDateTime,
        actionByUserId: referAndEarnData.createdByUserId,
        description: undefined
      },
    ];

    // Prepare refer and earn create data
    const referAndEarnCreateData = {
      ...referAndEarnData,
      id: ulidId,
      PK: this.partitianKey.strtr({
        "{primaryEmail}": referrerEmail,
      }),
      SK: this.sortKeys.SK_REFER_AND_EARN_ID.strtr({
        "{id}": ulidId,
      }),
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": ulidId,
      }),
      GSI2PK: this.GSI2PK.strtr({
        "{companyId}": referAndEarnData.companyDetails.id,
      }),
      GSI2SK: this.GSI2SK.strtr({
        "{id}": ulidId,
      }),
      status: ReferAndEarnStatusEnum.NOT_ACHIEVED_YET,
      statusTracker: statusTrackerData,
      jobApplicationStatus: ReferAndEarnJobApplicationStatusEnum.PENDING,
      commissionAmount: APP_CONSTANTS.REFER_AND_EARN_COMMISION_AMOUNT.DEFAULT,
      referredDate: currentDateTime,
    };

    // Create refer and earn entry and return
    return ReferAndEarnModel.create(referAndEarnCreateData);
  }

  /**
   * getReferAndEarnDetailsByCompanyIdWithRecipientEmailAndJobId
   *
   * Retrieves refer and earn entries filtered by company ID, recipient email, and job ID.
   *
   * This function logs the retrieval attempt and executes a complex database query
   * that filters records by company ID using a global secondary index (GSI2PK),
   * and additionally filters by recipient email and job ID fields to find matching records.
   *
   * @param {string} companyId - The unique identifier of the company.
   * @param {string} recipientEmail - The email address of the referral recipient.
   * @param {string} jobId - The unique identifier of the job position.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves to the
   *   query response containing matching refer and earn entries.
   */
  async getReferAndEarnDetailsByCompanyIdWithRecipientEmailAndJobId(
    companyId: string,
    recipientEmail: string,
    jobId: string
  ): Promise<QueryResponse<DbReferAndEarnDto>> {
    global.logger.info(
      "Get Refer and earn by company id with recipient email and job id [DAO]",
      {
        filePath: __filename,
        methodName:
          this.getReferAndEarnDetailsByCompanyIdWithRecipientEmailAndJobId.name,
        companyId,
        recipientEmail,
        jobId,
      }
    );

    return ReferAndEarnModel.query("GSI2PK")
      .eq(
        this.GSI2PK.strtr({
          "{companyId}": companyId,
        })
      )
      .where("GSI2SK")
      .beginsWith(
        this.GSI2SK.strtr({
          "{id}": "",
        })
      )
      .where("recipientDetails.email")
      .eq(recipientEmail)
      .where("jobDetails.id")
      .eq(jobId)
      .exec();
  }

  /**
   * getReferAndEarnDetailsByPrimaryEmailWithRecipientEmailAndJobId
   *
   * Retrieves refer and earn entries filtered by primary email, recipient email, and job ID.
   *
   * This function logs the retrieval attempt and performs a database query using the
   * primary key (PK) to filter records by primary email. It also applies additional
   * filters for recipient email and job ID to find matching entries.
   *
   * @param {string} primaryEmail - The primary email address of the referrer.
   * @param {string} recipientEmail - The email address of the referral recipient.
   * @param {string} jobId - The unique identifier of the job position.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves to the
   *   query response containing matching refer and earn entries.
   */
  async getReferAndEarnDetailsByPrimaryEmailWithRecipientEmailAndJobId(
    primaryEmail: string,
    recipientEmail: string,
    jobId: string
  ): Promise<QueryResponse<DbReferAndEarnDto>> {
    // logger
    global.logger.info(
      "Get Refer and earn by primary email with recipient email and job id [DAO]",
      {
        filePath: __filename,
        methodName:
          this.getReferAndEarnDetailsByPrimaryEmailWithRecipientEmailAndJobId
            .name,
      }
    );

    // query and return
    return ReferAndEarnModel.query("PK")
      .eq(
        this.partitianKey.strtr({
          "{primaryEmail}": primaryEmail,
        })
      )
      .where("SK")
      .beginsWith(
        this.sortKeys.SK_REFER_AND_EARN_ID.strtr({
          "{id}": "",
        })
      )
      .where("recipientDetails.email")
      .eq(recipientEmail)
      .where("jobDetails.id")
      .eq(jobId)
      .exec();
  }

  /**
   * getReferAndEarnById
   *
   * Retrieves a specific refer and earn entry by its unique identifier.
   *
   * This function logs the retrieval attempt and executes a database query using the
   * Global Secondary Index 1 (GSI1) to look up a record by its ID. It also logs the
   * query result for debugging purposes.
   *
   * @param {string} id - The unique identifier of the refer and earn entry to retrieve.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves to the
   *   query response containing the refer and earn entry if found.
   */
  async getReferAndEarnById(
    id: string
  ): Promise<QueryResponse<DbReferAndEarnDto>> {
    global.logger.info("Get Refer and earn by id [DAO]", {
      filePath: __filename,
      methodName: this.getReferAndEarnById.name,
    });

    return ReferAndEarnModel.query("GSI1PK")
      .eq(this.GSI1PK)
      .where("GSI1SK")
      .eq(this.GSI1SK.strtr({ "{id}": id }))
      .exec();
  }

  /**
   * getReferAndEarnByReferrerEmailAndId
   *
   * Retrieves a refer and earn entry based on referrer email and entry ID.
   *
   * This function logs the retrieval attempt and constructs a query using
   * the primary key (PK) and sort key (SK) to find a matching refer and earn
   * entry in the database. The query execution result is returned as a promise.
   *
   * @param {string} referrerEmail - The email address of the referrer.
   * @param {string} id - The unique identifier of the refer and earn entry.
   * @returns {Promise<QueryResponse<DbReferAndEarnDto>>} A promise that resolves
   *   to the query response containing the refer and earn entry if found.
   */
  async getReferAndEarnByReferrerEmailAndId(referrerEmail: string, id: string): Promise<QueryResponse<DbReferAndEarnDto>> {
    // logger
    global.logger.info(
      "Get Refer and earn by referrer email and id [DAO]",
      {
        filePath: __filename,
        methodName: this.getReferAndEarnByReferrerEmailAndId.name,
        referrerEmail,
        id,
      }
    );

    // Prepare PK and SK
    const { PK, SK } = this.preparePKAndSKForQuery(referrerEmail, id);

    // Query and return
    return ReferAndEarnModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK)
      .exec();
  }

  /**
   * getReferAndEarnByFilterOptions
   *
   * Retrieves refer and earn records based on the provided filter options.
   *
   * This method allows for the querying of referrals using various
   * filter criteria such as status, date range, and search text.
   * The results are sorted according to the specified sort order and
   * paginated using the provided pagination helper.
   *
   * @param {ReferralFilterOptions} referralRequestBody - The filter options for querying referrals.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbReferralDto>>}
   *          A promise that resolves to the paginated results of referrals matching the filter conditions.
   */
  async getReferAndEarnByFilterOptions(
    referAndEarnRequestBody: ReferAndEarnFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbReferAndEarnDto>
  > {
    global.logger.info(`Get Refer And Earn By filter options [DAO]`, {
      filePath: __filename,
      methodName: "getReferAndEarnByFilterOptions",
      referAndEarnRequestBody,
    });

    let query: Query<DbReferAndEarnDto>;

    // If `companyId` is given then retrieve all the refer and earn records for that company
    if (referAndEarnRequestBody.companyId) {
      query = ReferAndEarnModel.query("GSI2PK")
        .eq(
          this.GSI2PK.strtr({
            "{companyId}": referAndEarnRequestBody.companyId,
          })
        )
        .where("GSI2SK")
        .beginsWith(this.GSI2SK.strtr({ "{id}": "" }));
    }
    // If `referrerEmail` is given then retrieve all the refer and earn records for that referrer
    else if (referAndEarnRequestBody.referrerEmail) {
      query = ReferAndEarnModel.query("PK")
        .eq(
          this.partitianKey.strtr({
            "{primaryEmail}": referAndEarnRequestBody.referrerEmail,
          })
        )
        .where("SK")
        .beginsWith(this.sortKeys.SK_REFER_AND_EARN_ID.strtr({ "{id}": "" }));
    } else {
      query = ReferAndEarnModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith(this.GSI1SK.strtr({ "{id}": "" }));
    }

    // Sort the results based on the provided sort order
    query = query.sort(
      referAndEarnRequestBody.sortOrder ?? SortOrderTypeEnum.DESCENDING
    );

    // Apply status filter if provided
    if (referAndEarnRequestBody.status) {
      query = query.where("status").eq(referAndEarnRequestBody.status);
    }

    // Apply jobId filter if provided
    if (referAndEarnRequestBody.jobId) {
      query = query.where("jobDetails.id").eq(referAndEarnRequestBody.jobId);
    }

    // Apply userJobApplicationId filter if provided
    if (referAndEarnRequestBody.userJobApplicationId) {
      query = query
        .where("userJobApplicationId")
        .eq(referAndEarnRequestBody.userJobApplicationId);
    }

    // Apply jobApplicationStatus filter if provided
    if (referAndEarnRequestBody.jobApplicationStatus) {
      query = query
        .where("jobApplicationStatus")
        .eq(referAndEarnRequestBody.jobApplicationStatus);
    }

    // Apply date range filter if provided
    if (referAndEarnRequestBody.fromDate || referAndEarnRequestBody.toDate) {
      query = query.and().parenthesis((condition) => {
        if (referAndEarnRequestBody.fromDate) {
          condition = condition
            .where("createdAt")
            .ge(referAndEarnRequestBody.fromDate);
        }
        if (referAndEarnRequestBody.toDate) {
          condition = condition
            .where("createdAt")
            .le(referAndEarnRequestBody.toDate);
        }
        return condition;
      });
    }

    // Apply search text filter if provided
    if (referAndEarnRequestBody.searchText) {
      // Remove trailing and leading spaces from the search text
      const searchTextValue: string = referAndEarnRequestBody.searchText;

      global.logger.debug("Search text value", { searchTextValue });

      query = query.and().parenthesis((condition: Condition) => {
        let searchCondition: Condition = condition
          .where("recipientDetails.email")
          .contains(searchTextValue.toLowerCase())
          .or()
          .where("recipientDetails.name")
          .contains(searchTextValue.toLowerCase())
          .or()
          .where("recipientDetails.phoneNumber")
          .contains(searchTextValue)
          .or()
          .where("status")
          .contains(searchTextValue.toUpperCase())
          .or()
          .where("jobApplicationStatus")
          .contains(searchTextValue.toUpperCase())
          .or()
          .where("companyDetails.name")
          .contains(searchTextValue.toUpperCase())
          .or()
          .where("jobDetails.title")
          .contains(searchTextValue.toLowerCase())
          .or()
          .where("referrerDetails.name")
          .contains(searchTextValue.toLowerCase())
          .or()
          .where("referrerDetails.phoneNumber")
          .contains(searchTextValue);

        if(!referAndEarnRequestBody.referrerEmail) {
          searchCondition = searchCondition
            .or()
            .where("PK")
            .contains(`USR#EML#${searchTextValue.toLowerCase()}`); // Search by referrer email
        }

        return searchCondition;
      });
    }

    // Execute the query by applying the pagination helper and return the results
    return getPaginatedResultsWithMatchingConditions<
      DbReferAndEarnDto,
      ReferAndEarnFilterOptions
    >(query, referAndEarnRequestBody);
  }

  /**
   * updateReferAndEarnInternalByIdAndEmail
   *
   * Updates specific fields of an existing refer and earn record.
   *
   * This function logs the update attempt and executes a database update operation
   * using the provided keys and update data. It includes error handling to capture
   * and propagate any failures during the update process.
   *
   * @param {string} id - The unique identifier of the refer and earn ticket to update.
   * @param {string} primaryEmail - The email address associated with the referral.
   * @param {Partial<UpdateReferAndEarnInternalDto>} updateDto - Object containing the fields to update
   *   and their new values.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the updated refer and earn
   *   record if the update was successful.
   * @throws {BaseError} Throws a 500 error if the update operation fails.
   */
  async updateReferAndEarnInternalByIdAndEmail(
    id: string,
    primaryEmail: string,
    updateDto: Partial<UpdateReferAndEarnInternalDto>
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Update Refer And Earn [DAO]", {
      filePath: __filename,
      methodName: this.updateReferAndEarnInternalByIdAndEmail.name,
      updateDto,
    });

    // Prepare PK and SK
    const { PK, SK } = this.preparePKAndSKForQuery(primaryEmail, id);

    return ReferAndEarnModel.update({ PK: PK, SK: SK }, updateDto);
  }

  /**
   * updateReferAndEarnByPkAndSk
   *
   * Updates specific fields of an existing refer and earn record using its primary key (PK) and sort key (SK).
   *
   * This function logs the update attempt and executes a database update operation
   * using the provided keys and update data. It includes error handling to capture
   * and propagate any failures during the update process.
   *
   * @param {string} PK - The primary key of the refer and earn ticket to update.
   * @param {string} SK - The sort key of the refer and earn ticket to update.
   * @param {ReferAndEarnUpdateDto} updateReferAndEarnDto - Object containing the fields to update
   *   and their new values.
   * @returns {Promise<DbReferAndEarnDto>} A promise that resolves to the updated refer and earn
   *   record if the update was successful.
   * @throws {BaseError} Throws a 500 error if the update operation fails.
   */
  async updateReferAndEarnByPkAndSk(
    PK: string,
    SK: string,
    updateReferAndEarnDto: ReferAndEarnUpdateDto
  ): Promise<DbReferAndEarnDto> {
    global.logger.info("Update Refer and earn by pk and sk [DAO]", {
      filePath: __filename,
      methodName: this.updateReferAndEarnByPkAndSk.name,
    });

    return ReferAndEarnModel.update({ PK: PK, SK: SK }, updateReferAndEarnDto);
  }
}

const referAndEarnDaoObj = new ReferAndEarnDao();
export { referAndEarnDaoObj, ReferAndEarnDao };