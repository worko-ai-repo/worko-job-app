// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import DTOs
import {
  GcpFirestoreRecordListingFilterOptions,
  GcpFirestoreRecordListingFilterRequestDTO,
} from "../dtos/Common.gcp-firestore.dto";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";

// Import helper
import { gcpFirestoreBase64EncodeStrToLastKey } from "./gcp-firestore.helper";

/**
 * GcpFirestoreRequestHelper
 *
 * Helper to help with parsing/processing the request payloads.
 */
class GcpFirestoreRequestHelper {
  /**
   * parseFilterOptions
   *
   * Parses the filter options for a given entity(Company,Subscription,User,Referral.. etc) listing request.
   *
   * It reads the "filterOptions" received from the request and parses it in a way we/backend is expecting it to be.
   *
   * @param {EntityListingFilterRequestDTO} filterOptions - The filter options for the entity listing request.
   * @return {EntityListingFilterOptions} The parsed filter options.
   */
  static parseFilterOptions<
    EntityListingFilterRequestDTO extends GcpFirestoreRecordListingFilterRequestDTO,
    EntityListingFilterOptions extends GcpFirestoreRecordListingFilterOptions
  >(filterOptions: EntityListingFilterRequestDTO): EntityListingFilterOptions {
    // pageSize
    let pageSize: number = parseInt(
      filterOptions.pageSize as unknown as string
    );

    // if pageSize is not present in one of PAGE_LENGTH_OPTIONS, then set pageSize to PAGE_LENGTH_DEFAULT
    if (APP_CONSTANTS.PAGE_LENGTH_OPTIONS.indexOf(pageSize) === -1) {
      pageSize = APP_CONSTANTS.PAGE_LENGTH_DEFAULT;
    }

    // lastKey
    let lastKey = undefined;
    if (filterOptions?.lastKey && filterOptions.lastKey !== "undefined") {
      global.logger.info(`LastKey exists: `, {
        filterOptionsLastKey: filterOptions.lastKey,
      });
      let decodedLastKey:
        | {
            gcpFirestoreDocumentId: string;
          }
        | undefined = gcpFirestoreBase64EncodeStrToLastKey(
        filterOptions.lastKey
      ); // decoding base64 string to original value(possibly array of values)
      global.logger.info(`Decoded Firestore LastKey: `, { decodedLastKey });
      if (decodedLastKey) {
        lastKey = decodedLastKey;
      }
    }

    // If sortOrder is undefined, then set sortOrder to descending order by default
    if (!filterOptions?.sortOrder) {
      filterOptions.sortOrder = GcpFirestoreSortOrderTypeEnum.DESCENDING;
    }

    if (filterOptions.searchText) {
      filterOptions.searchText = filterOptions.searchText.trim();
    }

    let newFilterOptions: EntityListingFilterOptions = filterOptions as any;
    newFilterOptions = {
      ...newFilterOptions,
      ...{
        pageSize: pageSize,
        lastKey: lastKey,
        searchText: filterOptions.searchText,
      },
    };
    return newFilterOptions;
  }
}

export { GcpFirestoreRequestHelper };
