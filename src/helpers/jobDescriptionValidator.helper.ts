/**
 * JobDescriptionValidator
 */
class JobDescriptionValidatorHelper {
  keywords: string[] = [
    "experience",
    "education",
    "skills",
    "certifications",
    "Preferred Skills",
    "job description",
    "responsibilities",
    "role",
    "Employment",
    "Department",
  ];

  /**
   * isValidDescription
   * 
   * Checks if the given description is valid by ensuring it is not empty
   * and has at least 5 of the predefined keywords.
   * 
   * @param description The job description string to be validated.
   * @returns A boolean indicating whether the description is valid.
   */
  isValidDescription(description: string): boolean {
    return description.trim() !== "" && this.countKeywords(description) >= 5;
  }

  /**
   * countKeywords
   * 
   * Returns the number of keywords found in the given text by using a regex
   * pattern to match the keywords.
   * 
   * @param text The text to search for the keywords.
   * @returns Number of keywords found in the text.
   */
  countKeywords(text: string): number {
    const regex: RegExp = new RegExp(
      `\\b(${this.keywords.join("|")})\\b`,
      "ig"
    );
    const matches: RegExpMatchArray | null = text.match(regex);
    return matches ? matches.length : 0;
  }
}

const jobDescriptionValidatorHelperObj = new JobDescriptionValidatorHelper();
export { jobDescriptionValidatorHelperObj, JobDescriptionValidatorHelper };