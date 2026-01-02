
// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";


export interface AwsS3VectorRecordListingFilterOptions {
  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: number;

  /**
   * lastKey
   */
  lastKey?: {
    /**
     * @reference The "id" field of the firestore document
     * @example "01K8TPT1PT2W5DTRSFPWTB92GH"
     */
    gcpFirestoreDocumentId: string;
  };

  // sortOrder means the order in which the records should be sorted.
  sortOrder?: GcpFirestoreSortOrderTypeEnum;

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