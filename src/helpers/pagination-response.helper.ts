// import dynamoose packages and types
import { ObjectType } from "dynamoose/dist/General";

// import dtos
import {
  RecordListingResponseDTO,
  RecordListingFilterOptions,
  EntityDetailsPaginationData,
} from "../dtos/Common.dto";

// import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";

// import helpers
import { lastKeyToBase64EncodeStr } from "./dynamoose.helper"
/**
 * PaginationResponseHelper
 * 
 * Helper class for generating the pagination response structure.
 * 
 * REFERENCE TUTORIAL[Typescript Generics]: 
 * @see https://youtu.be/EcCTIExsqmI?si=3g9M7sVRUeoL3dj7
 */
class PaginationResponseHelper {
  /**
   * customizedPaginationRecordListingResponse
   *
   * It generates the response structure for the entity listing end points.
   * Entity examples: Company, Subscription, User, Referral, SupportRequest etc.
   *
   * @param {EntityDetails} customizedData - The data which contains the records.
   * @param {EntityListingFilterOptions} filterRequest - The filter options which contains the pageSize and sortOrder.
   * @param {number} customizedCount - The count of items returned in the response.
   * @param {number} customizedTimesQueried - The number of requests made to AWS DynamoDB to fulfill the query response.
   * @param {ObjectType | undefined} customizedLastKey - The last key for pagination.
   * @param {number | undefined} customizedQueriedCount - The total number of items DynamoDB looked at before applying any filters.
   * @returns {RecordListingResponseDTO<any>} The response structure which contains the data and pagination details.
   */
  customizedPaginationRecordListingResponse<
    EntityDetails,
    EntityListingFilterOptions extends RecordListingFilterOptions
  >(
    customizedData: EntityDetails,
    filterRequest: EntityListingFilterOptions,
    customizedCount: number,
    customizedTimesQueried: number,
    customizedLastKey?: ObjectType | undefined,
    customizedQueriedCount?: number | undefined
  ): RecordListingResponseDTO<EntityDetails> {
    return {
      data: customizedData,
      pagination: {
        count: customizedCount,
        pageSize: filterRequest.pageSize,
        lastKey: lastKeyToBase64EncodeStr(customizedLastKey),
        sortOrder: filterRequest.sortOrder ?? SortOrderTypeEnum.DESCENDING,
        timesQueried: customizedTimesQueried,
        queriedCount: customizedQueriedCount,
      },
    };
  }

  /**
   * paginationRecordListingResponse
   *
   * NOTE: `paginationRecordListingResponse` is the old response structure for returning the pagination data,
   * we will be using `customizedPaginationRecordListingResponse` for all new pagination response apis.
   *
   * It generates the response structure for the entity listing end points.
   * Entity examples: Company, Subscription, User, Referral, SupportRequest etc.
   *
   * @param {EntityDetails} data - The data which contains the records, count, queriedCount, lastKey.
   * @param {EntityListingFilterOptions} filterRequest - The filter options which contains the pageSize and sortOrder.
   * @return {RecordListingResponseDTO<EntityDetails>} The response structure which contains the data and pagination details.
   */
  paginationRecordListingResponse<
    EntityDetails extends EntityDetailsPaginationData,
    EntityListingFilterOptions extends RecordListingFilterOptions
  >(
    data: EntityDetails,
    filterRequest: EntityListingFilterOptions
  ): RecordListingResponseDTO<EntityDetails> {
    return {
      data,
      pagination: {
        count: data.count,
        pageSize: filterRequest.pageSize,
        lastKey: lastKeyToBase64EncodeStr(data.lastKey),
        sortOrder: filterRequest.sortOrder ?? SortOrderTypeEnum.DESCENDING,
        timesQueried: data.timesQueried,
        queriedCount: data.queriedCount,
      },
    };
  }
}

// create an instance of the pagination helper
const paginationResponseHelperObj = new PaginationResponseHelper();

// export the helper instance and class
export { paginationResponseHelperObj, PaginationResponseHelper };