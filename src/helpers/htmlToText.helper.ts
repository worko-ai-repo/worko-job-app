
// Import html-to-text
import { convert } from "html-to-text";

/**
 * HtmlToTextHelper
 */
class HtmlToTextHelper {
  /**
   * htmlToText
   * 
   * Converts an HTML job description to plain text.
   *
   * @param {string} htmlJobDescription - The HTML content of the job description to be converted.
   * @returns {string} The plain text representation of the provided HTML job description.
   */
  htmlToText(htmlJobDescription: string): string {
    const text: string = convert(htmlJobDescription);

    return text;
  }
}

const htmlToTextHelperObj = new HtmlToTextHelper();
export { htmlToTextHelperObj, HtmlToTextHelper };