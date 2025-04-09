
// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

    
    
/**
 * JobWithCompanyDetails
 */
export type JobWithCompanyDetails = DbJobAwsOpensearchDto & {
companyDetails: DbCompanyDetailDto | undefined;
};

/**
 * JobWithoutCompanyDetails
 */
export type JobWithoutCompanyDetails = DbJobAwsOpensearchDto;

/**
 * FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails
 * 
 * The union operator (|) means "either this type or that type."
 * In the context of `FinalResponseDataWithCompanyDetailsAndWithoutCompanyId`, we are saying that each item in the array can either be a
 * `JobWithCompanyDetails` or a `JobWithoutCompanyDetails`.
 */
export type FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails = (
| JobWithCompanyDetails
| JobWithoutCompanyDetails
)[];