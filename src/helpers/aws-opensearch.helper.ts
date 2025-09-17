

/**
 * awsOpensearchlastKeyToBase64EncodeStr
 * 
 * Encode the provided value into "Base64Encoded" string
 * 
 * @description
 * This function takes the provided value and encodes it into a Base64 string. If the input is null, undefined, or an invalid array of values, it returns undefined.
 * 
 * @example
 * const encodedValue = awsOpensearchlastKeyToBase64EncodeStr([ 1740396641431, '1430704032' ]); // returns "WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ"
 * 
 * @param {Array<any> | null | undefined} value - The value to encode. If not provided or invalid, returns undefined.
 * @returns {undefined | string} - The encoded value, or undefined if encoding fails or input is invalid.
 */
export function awsOpensearchlastKeyToBase64EncodeStr(value?: Array<any>): undefined | string {
  try {
    // If the provided value is `undefined` then return `undefined`
    if (!value) {
     return undefined;
    }

    // Return the encoded value
    return Buffer.from(JSON.stringify(value)).toString("base64"); 
  } catch (error:any) {
    // Logger message
    global.logger.error("Unable to perform Base64Encode.", {
      filePath: __filename,
      methodName: "awsOpensearchlastKeyToBase64EncodeStr",
      message: error.message,
    });
    return undefined;
  }
};

/**
 * awsOpensearchBase64EncodeStrToLastKey
 * 
 * Decodes a Base64 encoded string and returns the resulting value.
 * 
 * @description 
 * This function attempts to decode a Base64 encoded string into its original value. If the input is null, 
 * undefined, or an invalid Base64 string, it returns undefined. Errors during decoding are logged with 
 * the global logger.
 * 
 * @example
 * const decodedValue = awsOpensearchBase64EncodeStrToLastKey("WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ"); // Output:- [ 1740396641431, '1430704032' ]
 *
 * @param {string} str - The Base64 encoded string to decode. If not provided or invalid, returns undefined.
 * @returns {undefined | Array<any>} - The decoded value, or undefined if decoding fails or input is invalid.
 */
export function awsOpensearchBase64EncodeStrToLastKey(str?: string): undefined | Array<any>  {
  try {
    // If the provided value is null, undefined, etc
    if (!str) {
      return undefined;
    }

    return JSON.parse(
        Buffer
          .from(str, 'base64')
          .toString("utf-8") 
    );
  } catch (error: any) {
      // Logger message
    global.logger.error("Unable to perform Base64Decode.", {
      filePath: __filename,
      methodName: "awsOpensearchBase64EncodeStrToLastKey",
      str: str,
      message: error.message,
    });
    return undefined;
  }
};