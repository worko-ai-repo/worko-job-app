
// Import dtos
import { AwsS3VectorJobMatchingScoreDto } from "../dtos/AwsS3VectorJob.dto";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

    
/**
 * JobWithCompanyDetails
 */
export type JobWithCompanyDetails = DbJobAwsOpensearchDto & {
companyDetails: DbCompanyDetailDto | undefined;
} & {
   initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
};

/**
 * JobWithoutCompanyDetails
 */
export type JobWithoutCompanyDetails = DbJobAwsOpensearchDto & {
   initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
};

/**
 * JobsWithAndWithoutCompanyDetails
 * 
 * The union operator (|) means "either this type or that type."
 * In the context of `FinalResponseDataWithCompanyDetailsAndWithoutCompanyId`, we are saying that each item in the array can either be a
 * `JobWithCompanyDetails` or a `JobWithoutCompanyDetails`.
 */
export type JobsWithAndWithoutCompanyDetails = (
| JobWithCompanyDetails
| JobWithoutCompanyDetails
)[];