// Load Service for generating ULID (Universally Unique Lexicographically Sortable Identifier).
import { ulid, uuidToULID } from "ulidx";

/**
 * UlidService
 *
 * Service for generating ULID (Universally Unique Lexicographically Sortable Identifier).
 */
class UlidService {
  /**
   * getUlidId
   * 
   * Generates a new ULID (Universally Unique Lexicographically Sortable Identifier).
   *
   * @returns {string} A newly generated ULID.
   */
  getUlidId(): string {
    return ulid();
  }

  /**
   * convertUuidToUlid
   * 
   * Converts a UUID to a ULID.
   *
   * This method takes a UUID (Universally Unique Identifier) and converts it
   * into a ULID (Universally Unique Lexicographically Sortable Identifier),
   * maintaining uniqueness while providing a lexicographically sortable format.
   *
   * @param {string} uuid - The UUID to be converted.
   * @returns {string} The converted ULID.
   */
  convertUuidToUlid(uuid: string): string {
    return uuidToULID(uuid);
  }
}

export default new UlidService();
