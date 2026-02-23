
// Import firestore package
import { WhereFilterOp } from "@google-cloud/firestore";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";


export interface VectorQueryResult<T> {
  document: T;
  distance: number; // Lower is better (0 = identical, 1 = completely different)
  score?: number; // Higher is better (0-100, 100 = perfect match)
}


export interface GcpFirestoreVectorRecordListingFilterOptions {
  /**
   * @note Requires composite vector index
   *
   * Pre-filter documents
   * @see https://firebase.google.com/docs/firestore/vector-search#pre-filter-documents
   */
  preFilters?: {
    field: string;
    operator: WhereFilterOp;

    /**
     * @note As of now we are only allowing string data type for value attribute
     * If use case requires other data types, we can extend this interface to support them
     * @description
     *  1. As of now "companyId" is being used in corporate dashboard this value should be a string
     */
    value: string;
  }[];

  /**
   * pageSize (limit)
   *
   * The maximum number of records that should be returned in the API response.
   */
  pageSize: number;

  pageNumber: number;

  /**
   * lastKey
   */
  hasMore?: boolean;

  // sortOrder means the order in which the records should be sorted.
  sortOrder?: GcpFirestoreSortOrderTypeEnum;

  distanceThreshold: number;
}