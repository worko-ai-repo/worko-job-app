
// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import services
import CompanyService from "../services/Company.service";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

/**
 * attachCompanyDetails
 * 
 * This helper function is used to attach company details to the existing data set.
 * It takes an array of objects which should contain a companyId property and returns the same array with an additional companyDetails property for each object.
 * The companyDetails property will be either undefined or a DbCompanyDetailDto.
 * 
 * @template T - `T` is a generic type parameter that represents the type of the data set to which company details should be attached.
 *                Sample types for `T` are `DbCorporateUserInviteDto`, `DbCompanyJobDto` etc.
 * 
 * @param {T[]} data - The data set to which company details should be attached.
 * @returns {(T & { companyDetails: DbCompanyDetailDto | undefined })[]} The modified data set with company details attached.
 */
export async function attachCompanyDetails<T extends { companyId?: string }>(data: T[]): Promise<(T & { companyDetails: DbCompanyDetailDto | undefined })[]> {
    // Logger
    global.logger.warn('Attaching Company details to the data set. [HELPER]', {
        filePath: __filename,
        methodName: attachCompanyDetails.name,
    });
    // Validate input
    if (!data.length || !data[0]?.companyId){
        global.logger.warn('Cannot inject company details to an invalid data set [HELPER]', {
            filePath: __filename,
            methodName: attachCompanyDetails.name,
        });

        // return existing data without company details
        return data as (T & { companyDetails: DbCompanyDetailDto | undefined })[];
    }
    // Get unique company IDs
    const uniqueCompanyIds: string[] = Array.from(new Set(data.map(item => item.companyId!)));

    // Fetch company details in batches (DynamoDB limit: 100 items per batch)
    const batchSize: number = APP_CONSTANTS.AWS_DYNAMODB_BATCH_ACTION_LIMIT.GET;
    const companiesDetails: DbCompanyDetailDto[] = [];
    
    for (let i = 0; i < uniqueCompanyIds.length; i += batchSize) {
        const batch: string[] = uniqueCompanyIds.slice(i, i + batchSize);
        const batchResults = await CompanyService.getCompanyDetailsByIds(batch);
        companiesDetails.push(...batchResults);
    }

    // Convert company details to a Map for easy access
    const companiesMap: Map<string, DbCompanyDetailDto> = new Map(companiesDetails.map((company: DbCompanyDetailDto) => [company.id, company]));

    // Map over data to attach company details
    return data.map(item => {
        // Get company details
        const companyDetails: DbCompanyDetailDto | undefined = companiesMap.get(item.companyId!);

        // if company details are not found then return the item with company details as undefined
        if (!companyDetails) {
            // Log a warning if company details are not found
            global.logger.warn(`Company details not found for companyId: ${item.companyId} [HELPER]`, {
                filePath: __filename,
                methodName: attachCompanyDetails.name,
                companyId: item.companyId,
            });

            // Return the item with company details as undefined
            return {
                ...item,
                companyDetails: undefined
            } 
        }
        // Attach company details to the item and return the final object
        return {
            ...item,
            companyDetails: companyDetails
        };
    });
}