/**
 * sleep
 * 
 * Sleep/wait for the provided duration and do nothing.
 * 
 * @param {number} ms
 * @returns {Promise}
 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * range
 * 
 * Returns the numeric array containing values starting from "start" to "stop" with provided "step" interval.
 * 
 * @param {number} start 
 * @param {number} stop 
 * @param {number} step [DEFAULT: 1]
 * @returns {number[]}
 */
export const range = (start: number, stop: number, step: number = 1): number[] => {
    return [...Array((stop + 1) - start).keys()]
        .filter(i => !(i % Math.round(step)))
        .map(v => start + v)
}

/**
 * isFalsyOrEmpty
 * 
 * Checks if a value is falsy or empty.
 * 
 * Falsy values include `null`, `undefined`, `0`, `false`, and `""` (empty string).
 * We are also considering Empty arrays and objects as empty for the use case.
 * 
 * @param value - The value to check.
 * @returns `true` if the value is falsy or empty, `false` otherwise.
 */
export function isFalsyOrEmpty(value: any): boolean {
    // Check for falsy values like `null`, `undefined`, `0`, `false`, `""` (empty string)
    if (!value) return true;

    // Check for empty arrays and objects
    if (Array.isArray(value) && value.length === 0){
      return true;
    } 
    if (typeof value === "object" && Object.keys(value).length === 0){
      return true;
    }

    // If it passes all checks, it's not empty
    return false;
}

/**
 * formatCurrency
 *
 * Formats a given amount of currency according to the locale's rules for formatting currency.
 * The amount can be a number or a string.
 *
 * @param {number | string} amount - The amount of currency to format.
 * @param {string} currency - The currency code to use for formatting. Example: 'USD'.
 * @param {string} locale - The locale to use for formatting. Example: 'en-US'.
 * @param {number} [fractionDigits=0] - The number of fractional digits to display. If not specified, it will be 0.
 * @return {string} The formatted currency string.
 */
export const formatCurrency = (amount: number | string, currency: string, locale: string, fractionDigits: number = 0): string => {
  return Number(amount).toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
