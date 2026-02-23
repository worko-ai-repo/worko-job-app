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

  /**
   * getPastISODate
   * 
   * Gets the ISO date string for a given number of days ago.
   *
   * @param {number} daysAgo - The number of days ago to get the ISO date string for.
   * @returns {string} The ISO date string for the given days ago, @example: "2025-04-12T02:59:22.932+00:00".
   */
  getPastISODate(daysAgo: number): string {
    return DateTime.now()
      .minus({ days: daysAgo })
      .toISO();
  }

  /**
   * getCurrentDayMonthYearFormattedDate
   * 
   * Gets the current date formatted as "dd-MM-yyyy".
   *
   * This function fetches the current date and formats it into a string 
   * representation using the "day-month-year" format, where the day and 
   * month are zero-padded to two digits.
   *
   * @returns {string} The current date formatted as "dd-MM-yyyy".
   */
  getCurrentDayMonthYearFormattedDate(): string {
    return DateTime.now().toFormat("dd-MM-yyyy");
  }

  /**
   * getISODate
   * 
   * Gets the current date and time as an ISO 8601 string in the format
   * "YYYY-MM-DDTHH:mm:ss.sssZ".
   *
   * @returns {string} The current date and time as an ISO 8601 string.
   */
  getISODate(): string {
    return DateTime.now().toISO();
  }

  /**
   * getISODatePlusHours
   * 
   * Gets the current date and time plus the specified hours as an ISO 8601 string.
   *
   * @param {number} hours - The number of hours to add to the current date.
   * @returns {string} The future date and time as an ISO 8601 string.
   */
  getISODatePlusHours(hours: number): string {
    return DateTime.now().plus({ hours }).toISO();
  }

  getISODateMinusDays(days: number): string {
    return DateTime.now().minus({ days }).toISO();
  }

  getISODateToTimestamp(isoDate: string): number {
    return DateTime.fromISO(isoDate).toMillis();
  }

  /**
   * formatISODateToDDMMYYYY
   * 
   * Formats an ISO date string to dd-MM-YYYY format.
   *
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} The formatted date string in dd-MM-YYYY format.
   */
  formatISODateToDDMMYYYY(isoDate: string): string {
    return DateTime.fromISO(isoDate).toFormat("dd-MM-yyyy");
  }
}

const dateHelperObj = new DateHelper();
export { dateHelperObj, DateHelper };
