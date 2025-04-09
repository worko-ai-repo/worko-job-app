import crypto from "crypto";

/**
 * Utility class for calculating hash.
 */
export class HashCalculator {
  /**
   * Calculates the MD5 hash of a given string.
   *
   * @param input - The input string to calculate the MD5 hash for.
   * @returns The MD5 hash of the input string.
   */
  static md5Hash(input: string): undefined | string {
    // If the provided value is null, undefined, etc
    if (!input) {
      return undefined;
    }

    // Create a new hash object using MD5 algorithm
    const md5Hash = crypto.createHash("md5");

    // Update the hash object with the input string
    const hashedString = md5Hash.update(input).digest("hex");

    // Return the MD5 hash as a hexadecimal string
    return hashedString;
  }
}
