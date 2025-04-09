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