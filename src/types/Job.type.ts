// Import dtos
import { AwsS3VectorJobMatchingScoreDto } from "../dtos/AwsS3VectorJob.dto";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";

export type JobsWithOrWithoutEntityDetails = (DbJobAwsOpensearchDto & {
  companyDetails?: DbCompanyDetailDto;
} & {
  initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
} & {
  countCompanyJob?: DbCountCompanyJobDto;
})[];
