
/**
 * UrlHelper
 * 
 * Class for encoding the string of a given URL
 */
class UrlHelper {
  /**
   * encodeQueryString
   * 
   * Encodes the query string of a given URL
   * @param {string} url - The original URL
   * @returns {string} - The encoded URL with encoded query parameters
   */
   encodeQueryString(url: string): string {
     global.logger.debug(`Original URL: ${url}`,{
       filePath: __filename,
       methodName: this.encodeQueryString.name
     });

     // Separate the base URL and query parameters
     const [baseUrl, queryString] = url.split("?");
     global.logger.debug(`Base URL: ${baseUrl}`, {
       filePath: __filename,
       methodName: this.encodeQueryString.name,
     });
     global.logger.debug(`Query String: ${queryString}`, {
       filePath: __filename,
       methodName: this.encodeQueryString.name,
     });

     /**
      * encodedQueryString
      *
      * Encode only the query parameters
      *
      * encodeURIComponent(uriComponent: string | number | boolean): string
      * A value representing an unencoded URI component
      * Encodes a text string as a valid component of a Uniform Resource Identifier (URI).
      *
      * Use ?? if you want to fall back only when a value is explicitly null or undefined.
      */
     const encodedQueryString: string = encodeURIComponent(queryString ?? "");
     global.logger.debug(`Encoded Query String: ${encodedQueryString}`, {
       filePath: __filename,
       methodName: this.encodeQueryString.name,
     });

     // Recombine the base URL with the encoded query string
     const encodedUrl: string = `${baseUrl}?${encodedQueryString}`;
     global.logger.debug(`Encoded URL: ${encodedUrl}`, {
       filePath: __filename,
       methodName: this.encodeQueryString.name,
     });

     return encodedUrl;
   }
}

const urlHelperObj = new UrlHelper();

export { urlHelperObj, UrlHelper };