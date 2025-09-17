/**
 * Helper class for managing timestamps in data objects.
 */
export class TimestampHelper {
  /**
   * Adds a 'createdAt' timestamp to each item in the category array if not present.
   * @param category - The array of items to add timestamps to.
   */
  static addTimestampsWithOutUpdatedAt(category: any[]): void {
    const currentTimestamp = new Date().toISOString();

    category.forEach((item) => {
      if (!item.timestamps) {
        // If timestamps not present, add 'createdAt'.
        item.timestamps = {
          createdAt: currentTimestamp,
        };
      }
    });
  }

  /**
   * Updates an 'UpdatedAt' timestamp for each item in the category array if not present.
   * @param category - The array of items to add timestamps to.
   */
  static updateTimestampsForUpdatedAt(category: any[]): void {
    const currentTimestamp = new Date().toISOString();

    category.forEach((item) => {
      if (item.timestamps) {
        // If timestamps is present, update 'UpdatedAt'.
        item.timestamps.UpdatedAt = currentTimestamp;
      }
    });
  }

  /**
   * Adds or updates 'createdAt' and 'updatedAt' timestamps for each item in the category array.
   * @param category - The array of items to add or update timestamps for.
   */
  static addTimestamps(category: any[]): void {
    const currentTimestamp = new Date().toISOString();

    category.forEach((item) => {
      if (!item.timestamps) {
        // If timestamps not present, add 'createdAt' and 'updatedAt'.
        item.timestamps = {
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        };
      } else {
        //@todo Added below 2 lines cause 'createAt' is throwing error to convert to ISO even though it's in ISO. We need to investigate the error and remove this code
        let createAtISO = new Date(item.timestamps.createdAt);
        item.timestamps.createdAt = createAtISO.toISOString();
        // If timestamps present, update 'updatedAt'.
        item.timestamps.updatedAt = currentTimestamp;
      }
    });
  }

  /**
   * Adds or updates 'createdAt' and 'updatedAt' timestamps for each item in the category array.
   * @param category - The array of items to add or update timestamps for.
   */
  static addCreatedAtAndUpdatedAt(category: any[]): void {
    const currentTimestamp = new Date().toISOString();

    category.forEach((item) => {
      if (!item.createdAt) {
        // If createdAt not present, add 'createdAt' and 'updatedAt'.
        item.createdAt = currentTimestamp;
        item.updatedAt = currentTimestamp;
        console.log(
          "new createAtISO: -",
          item.createdAt,
          "new updatedAt: -",
          item.updatedAt
        );
      } else {
        //@todo Added below 2 lines cause 'createAt' is throwing error to convert to ISO even though it's in ISO. We need to investigate the error and remove this code
        let createAtISO = new Date(item.createdAt);
        item.createdAt = createAtISO.toISOString();
        // If createdAt present, update 'updatedAt'.
        item.updatedAt = currentTimestamp;
        console.log(
          "createAtISO: -",
          item.createdAt,
          "updatedAt: -",
          item.updatedAt
        );
      }
    });
  }

  /**
   * Adds a 'createdAt' timestamp to each item in the category array if not present.
   * @param category - The array of items to add timestamps to.
   */
  static addCreatedAt(category: any[]): void {
    const currentTimestamp = new Date().toISOString();

    category.forEach((item) => {
      if (!item.createdAt) {
        // If createdAt not present, add 'createdAt'.
        item.createdAt = currentTimestamp;
      }
    });
  }
}
