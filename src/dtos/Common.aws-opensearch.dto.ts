
// Import enums
import { AwsOpensearchSortOrderTypeEnum } from "../enums/Common.aws-opensearch.enum";

/**
 * AwsOpensearchRecordListingFilterOptions
 *
 * It is similar to "AwsOpensearchRecordListingFilterRequestDTO" but it would be used in the backend to perform business logic.
 */
export interface AwsOpensearchRecordListingFilterOptions {
  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: number;

  /**
   * lastKey (offset)
   *
   * Sample Value of "lastKey": [ 1740396641431, '1430704032' ]
   */
  lastKey?: Array<any>;

  // sortOrder means the order in which the records should be sorted.
  sortOrder?: AwsOpensearchSortOrderTypeEnum;

  // search text
  searchText?: string;

  /**
   * fromDate
   *
   * The "fromDate" value will be come from frontend request payload.
   *
   * Sample Value of "fromDate": "2024-07-01T11:07:42.506Z"
   */
  fromDate?: string;

  /**
   * toDate
   *
   * The "toDate" value will be come from frontend request payload.
   *
   * Sample Value of "toDate": "2024-07-01T12:07:42.506Z"
   */
  toDate?: string;
}

/**
 * AwsOpensearchRecordListingFilterRequestDTO
 *
 * The possible data expected in the request payload if API wants to filter the data.
 */
export interface AwsOpensearchRecordListingFilterRequestDTO {
  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: string; // The pageSize value will be come from frontend request query params, so it will be a string

  /**
   * lastKey (offset)
   *
   * Sample Value: "WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ"
   */
  lastKey?: string;

  // sortOrder means the order in which the records should be sorted.
  sortOrder?: AwsOpensearchSortOrderTypeEnum;

  // search text
  searchText?: string;

  /**
   * fromDate
   *
   * The "fromDate" value will be come from frontend request payload.
   *
   * Sample Value of "fromDate": "2024-07-01T11:07:42.506Z"
   */
  fromDate?: string;

  /**
   * toDate
   *
   * The "toDate" value will be come from frontend request payload.
   *
   * Sample Value of "toDate": "2024-07-01T12:07:42.506Z"
   */
  toDate?: string;
}

/**
 * AwsOpensearchRecordListingPaginationResponseDTO
 *
 * The representation of the pagination details that would be passed to the API consumer.
 */
export interface AwsOpensearchRecordListingPaginationResponseDTO {
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
   * Sample Value: "WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ"
   */
  lastKey?: string;

  /**
   * @description This is the last key from `s3 vector`, whenever we list records from s3 vector and
   * use those ids to fetch from opensearch.
   * 
   * @todo: This is not the best way to use in this interface, need to think and optimize the readability.
   */
  s3VectorLastKey?: boolean;

  // sortOrder means the order in which the records should be sorted.
  sortOrder?: AwsOpensearchSortOrderTypeEnum;

  // The `timesQueried` is the number of requests made to AWS Opensearch to fulfill the query response.
  timesQueried?: number;

  // If filter is applied then the filtered record count from the all records. Otherwise it would be undefined.
  queriedCount?: number;
}

/**
 * AwsOpensearchRecordListingResponseDTO
 *
 * The main response would be retruend back in the API response. It would include the pagination details and records.
 */
export interface AwsOpensearchRecordListingResponseDTO<EntityDetails> {
  data: EntityDetails;
  pagination: AwsOpensearchRecordListingPaginationResponseDTO;
}