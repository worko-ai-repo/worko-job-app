// import luxon
import { DateTime } from "luxon";

/**
 * DateHelper
 *
 * @todo: In near future we will move this code to common library
 */
class DateHelper {
  /**
   * Formats an ISO date string to a readable format "DayMonthYear".
   * 
   * Converts the given date from ISO string format to a human-readable format 
   * with the day, full month name, and year. The function also appends the 
   * appropriate ordinal suffix to the day.
   *
   * @param {string} dateISO - The date string in ISO format to be formatted.
   * @returns {string} The formatted date string in "DayMonthYear" format with ordinal suffix.
   */

  formatDateToDayMonthYear(dateISO: string): string {
    const date: DateTime<true> | DateTime<false> = DateTime.fromISO(dateISO);
    const day: number = date.day;
    const month: string = date.toFormat("LLLL"); // Full month name
    const year: number = date.year;

    /**
     * Returns the ordinal suffix for a given number.
     * The function handles numbers greater than 3 and less than 21 with a "th" suffix.
     * For other numbers, it calculates the suffix based on the last digit.
     *
     * @param {number} n - The number to determine the ordinal suffix for.
     * @returns {string} The ordinal suffix ("st", "nd", "rd", or "th") for the given number.
     */
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}.`;
  }
}

const dateHelperObj = new DateHelper();
export { dateHelperObj, DateHelper };
