/**
 * objectToQueryString
 * 
 * Convert 1D JSON object to Query String.
 * 
 * @params {any} object JSON object from which you want prepare the query string
 * @returns {string}
 */
export function objectToQueryString(object: any): string {
    return (new URLSearchParams(<any>object)).toString()
}

/**
 * objectIsEmpty
 * 
 * Check if the provided object is empty
 * 
 * @params {any} object - plain object
 * @returns {boolean}
 */
export function objectIsEmpty(object: any): boolean {
    return Object.keys(object).length === 0;
}