

export interface AwsS3VectorRecordListingFilterOptions {
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
  sortOrder?: string;

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