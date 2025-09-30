// Import the npm packages
import { ObjectType } from "dynamoose/dist/General";

import { SortOrderTypeEnum } from "../enums/Common.enum";

/**
 * RecordListingFilterOptions
 *
 * It is similar to "RecordListingFilterRequestDTO" but it would be used in the backend to perform business logic.
 */
export interface RecordListingFilterOptions {
  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: number;

  /**
   * lastKey (offset)
   *
   * The "lastKey" property value returned by the "Dynamoose" in the previous "query" response.
   *
   * This will become the parameter for the "startAt" method of Dynamoose in the next query.
   *
   * Sample Value: { SK: 'ID#01HHM4Q0DDH1A5S56HJQ71P82V', PK: 'COMP#' }
   */
  lastKey?: ObjectType;

  // sortOrder means the order in which the records should be sorted. posible values: "ascending" or "descending"
  sortOrder?: SortOrderTypeEnum | undefined;

  // search text
  searchText?: string | undefined;

  /**
   * fromDate
   *
   * The "fromDate" value was returned by backend code internally,
   * after converting it from "string" to "timestamp" format.(check in "request.helper.ts")
   * And type of the "timestamp" is number or undefined.
   *
   * To know more about conversion of "fromDate" from "string" to "timestamp" you can Go to "request.helper.ts" file,
   * and check The "parseFilterOptions" function present in "RequestHelper" class.
   *
   * Sample Value of "fromDate" after converting from "string" to "timestamp": 1661115600000
   */
  fromDate?: number | undefined;

  /**
   * toDate
   *
   * The "toDate" value was returned by backend code internally,
   * after converting it from "string" to "timestamp" format.(check in "request.helper.ts")
   * And type of the "timestamp" is number or undefined.
   *
   * To know more about conversion of "toDate" from "string" to "timestamp" you can Go to "request.helper.ts" file,
   * and check The "parseFilterOptions" function present in "RequestHelper" class.
   *
   * Sample Value of "toDate" after converting from "string" to "timestamp": 1661115600000
   */
  toDate?: number | undefined;
}

/**
 * RecordListingFilterRequestDTO
 *
 * The possible data expected in the request payload if API wants to filter the data.
 */
export interface RecordListingFilterRequestDTO {
  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: string; // The pageSize value will be come from frontend request query params, so it will be a string

  /**
   * lastKey (offset)
   *
   * The "lastKey" property value returned by the "Dynamoose" in the previous "query" response.
   *
   * This will become the parameter for the "startAt" method of Dynamoose in the next query.
   *
   * The "lastKey" property from Dynamoose: { SK: 'ID#01HHM4Q0DDH1A5S56HJQ71P82V', PK: 'COMP#' }
   * Sample Value: eyBTSzogJ0lEIzAxSEhNNFEwRERIMUE1UzU2SEpRNzFQODJWJywgUEs6ICdDT01QIycgfQ==
   */
  lastKey?: string | undefined;

  // sortOrder means the order in which the records should be sorted. posible values: "ascending" or "descending"
  sortOrder?: SortOrderTypeEnum | undefined;

  // search text
  searchText?: string | undefined;

  /**
   * fromDate
   *
   * The "fromDate" value will be come from frontend request payload.
   *
   * Sample Value of "fromDate": "2024-07-01T11:07:42.506Z"
   */
  fromDate?: string | undefined;

  /**
   * toDate
   *
   * The "toDate" value will be come from frontend request payload.
   *
   * Sample Value of "toDate": "2024-07-01T12:07:42.506Z"
   */
  toDate?: string | undefined;
}

/**
 * RecordListingPaginationResponseDTO
 *
 * The representation of the pagination details that would be passed to the API consumer.
 */
export interface RecordListingPaginationResponseDTO {
  // The number of records returned back in the API response.
  count: number;

  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: number;

  /**
   * lastKey (offset)
   *
   * The "lastKey" property value returned by the "Dynamoose" in the "query" response.
   *
   * This will become the parameter for the "startAt" method of Dynamoose in the next query.
   *
   * "lastKey" from Dynamoose: { SK: 'ID#01HHM4Q0DDH1A5S56HJQ71P82V', PK: 'COMP#' }
   * Sample Value: eyBTSzogJ0lEIzAxSEhNNFEwRERIMUE1UzU2SEpRNzFQODJWJywgUEs6ICdDT01QIycgfQ==
   */
  lastKey?: string | undefined;

  // sortOrder means the order in which the records should be sorted. posible values: "ascending" or "descending"
  sortOrder?: SortOrderTypeEnum | undefined;

  // The `timesQueried` is the number of requests made to AWS DynamoDB to fulfill the query response.
  timesQueried?: number | undefined;

  // If filter is applied then the filtered record count from the all records. Otherwise it would be undefined.
  queriedCount?: number | undefined;
}

/**
 * RecordListingResponseDTO
 *
 * The main response would be retruend back in the API response. It would include the pagination details and records.
 */
export interface RecordListingResponseDTO<EntityDetails> {
  data: EntityDetails;
  pagination: RecordListingPaginationResponseDTO;
}

/**
 * These are used in the "paginationRecordListingResponse" function present in "pagination-response.helper.ts"
 * which generates the response structure for the entity listing end points.
 *
 * Interface representing pagination-related data for entity listings.
 */
export interface EntityDetailsPaginationData {
  count: number;
  lastKey?: ObjectType | undefined;
  timesQueried?: number | undefined;
  queriedCount?: number | undefined;
}

/**
 * PaginatedResultsWithMatchingConditionsResponse
 *
 * 1. `lastKey`: The `lastKey` property from Dynamoose:
 * lastKey Example: {
 *  SK: 'ID#swapnaJunnuAppala', PK: 'USR#EML#swapnaAppalaMrudula@gmail.com',
 *  GSI1PK: 'USR#',
 *  GSI1SK: 'ID#swapnaJunnuAppala'
 * }
 * 2. `count`: Represents the number of items in the DynamoDB table that match the filter criteria in the query.
 * This is the count of items after any filters are applied,
 * which means it’s the count of items that actually meet the conditions specified.
 * 3. `timesQueried`: The `timesQueried` is the number of requests made to AWS DynamoDB to fulfill the query response.
 *
 * @file { dynamoose.helper.ts } - This is one of the helper file, we are using this interface.
 * @template DbEntityDto - The type of the entity to be returned in the response,
 *                         Ex: `DbUserDetailDto`, `DbUserReferralDto` etc.
 *
 * NOTE: Use this interface for only key value pairs of `DbEntityDto`.
 */
export interface PaginatedResultsWithMatchingConditionsResponse<DbEntityDto> {
  /**
   * Index Signatures:- Sometimes you don’t know all the names of a type’s properties ahead of time, 
   * but you do know the shape of the values. In those cases you can use an index signature to describe the types of possible values
   * @see https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
   */
  [key: number]: DbEntityDto;

  lastKey: ObjectType | undefined;
  count: number;
  timesQueried: number;
  queriedCount: number;
}

/**
 * PaginatedResultsWithMatchingConditionsInternalResponse
 *
 * NOTE: Use this interface for the type which it's being returned internally.
 */
export interface PaginatedResultsWithMatchingConditionsInternalResponse<
  DbEntityDto
> {
  data: DbEntityDto;
  lastKey: ObjectType | undefined;
  count: number;
  timesQueried: number;
  queriedCount: number;
}

/**
 * RequestLocalContextDto
 *
 * This `RequestLocalContextDto` object  can be accessed globally in the application.
 * This was set from the authorizer context i.e. from `authorizer-context.middleware.ts`,
 * This would be used in the backend to perform api security.
 */
export interface RequestLocalContextDto {
  userId: string;
  userEmail: string;
  cognitoUserGroups: string[];
}

/**
 * MinMaxRange
 */
export interface MinMaxRange {
  min?: number;
  max?: number;
}

/**
 * JobLocationDto
 *
 * This is the location dto.
 */
export interface JobLocationDto {
  city?: string[]; // ["Bangalore"]
  state?: string[]; // ["Karnataka"]
  country?: string[]; // ["India"]
  fullLocation?: string[]; // ["Bangalore, Karnataka, India"]
}

/**
 * EntityBulkUpdateCountDto
 */
export interface EntityBulkUpdateCountDto {
  count: number;
  primaryIds?: string[];
}

/**
 * EntityBulkUpdateMetricDto
 */
export interface EntityBulkUpdateMetricDto {
  success: EntityBulkUpdateCountDto;
  failure: EntityBulkUpdateCountDto;
}