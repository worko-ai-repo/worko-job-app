// // Extend the String interface
// declare global {
//   interface String {
//     strtr(replacePairs: Record<string, string>): string;
//     toTitleCase(): string;
//   }
// }

interface String {
  strtr(replacePairs: Record<string, string>): string;
  toTitleCase(): string; // Method to convert a string to Title Case
}


/**
 * strtr
 *
 * This (strtr) is equivalent of php "strtr" function which essentially replaces the text from string with the provided replacement text
 *
 * @link https://www.php.net/manual/en/function.strtr.php
 * @params {Record<string, string>} replacePairs
 * @returns {string}
 */
String.prototype.strtr = function (
  replacePairs: Record<string, string>
): string {
  const search = Object.keys(replacePairs)
    .map((str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special characters
    })
    .join("|");
  const regex = new RegExp(search, "g");
  return this.replace(regex, (match) => replacePairs[match]);
};

/**
 * toTitleCase
 *
 * Converts a string to Title Case.
 *
 * This method converts entire string to lowercase first, then
 * splits string by spaces into an array of words, capitalizes first letter of each word,
 * and finally joins words back into a single string.
 *
 * @returns {string}
 */
String.prototype.toTitleCase = function (): string {
  return this.toLowerCase() // Convert entire string to lowercase first
    .split(" ") // Split string by spaces into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join words back into a single string
};
