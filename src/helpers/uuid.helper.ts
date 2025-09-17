import UlidService from "../services/Ulid.service";

/**
 * Helper class for managing uuid in data objects.
 */
export class UuidHelper {
  /**
   * Adds `uuid` to each item in the category array if not present.
   * @param category - The array of items to add uuid to.
   */
  /* static addUuid(category: any[]): void {
    category.forEach((item) => {
      if (!item.priceId) {
        // If priceId not present, add 'uuid'.
        item.priceId = UlidService.getUlidId();
      }
    });
  } */

  /**
   * Adds `uuid` to the specified field in each item in the category array if not present.
   * @param category - The array of items to add uuid to.
   * @param fieldName - The name of the field to check and update.
   */
  static addUuid(category: any[], fieldName: string): void {
    category.forEach((item) => {
      if (!item[fieldName]) {
        // If the specified field is not present, add 'uuid'.
        item[fieldName] = UlidService.getUlidId();
      }
    });
  }
}
