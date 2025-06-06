/**
 * Array extension
 */
interface Array<T> {
  toLowerCaseArray(): string[]; // Method to converts an array of all strings to lowercase

  toUpperCaseArray(): string[]; // Method to converts an array of all strings to uppercase
}

/**
 * toLowerCaseArray
 * 
 * Converts an array of all strings to lowercase.
 *
 * @returns {string[]} The array of strings with all elements converted to lowercase.
 */
Array.prototype.toLowerCaseArray = function (): string[] {
  return this.map((item: string) => item.toLowerCase());
};

/**
 * toUpperCaseArray
 * 
 * Converts an array of all strings to uppercase.
 *
 * @returns {string[]} The array of strings with all elements converted to uppercase.
 */
Array.prototype.toUpperCaseArray = function (): string[] {
  return this.map((item: string) => item.toUpperCase());
};