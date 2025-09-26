// Import helpers
import { jobDescriptionValidatorHelperObj } from "./jobDescriptionValidator.helper";

class BrightDataJobValidateHelper {
  validateBrightDataJobDescription(
    jobDescription: string | undefined | null
  ): boolean {
    if (!jobDescription) {
      return false;
    }

    const isValidDescription: boolean | "" | null | undefined =
      jobDescription &&
      jobDescriptionValidatorHelperObj.isValidDescription(jobDescription);

    if (!isValidDescription) {
      return false;
    }

    return true;
  }

  validateBrightDataJobCompanyName(
   companyName: string | undefined | null,
  ): boolean {

   // If company name is empty string or null or undefined then return false
   if (!companyName) {
     return false;
   }

   return true;
  }
}

const brightDataJobValidateHelperObj: BrightDataJobValidateHelper =
  new BrightDataJobValidateHelper();
export { brightDataJobValidateHelperObj, BrightDataJobValidateHelper };
