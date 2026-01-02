// Import dtos
import { AwsS3VectorJobMatchingScoreDto } from "../dtos/AwsS3VectorJob.dto";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

export type JobsWithOrWithoutEntityDetails = (DbGcpFirestoreJobDto & {
  companyDetails?: DbCompanyDetailDto;
} & {
  initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
} & {
  countCompanyJob?: DbCountCompanyJobDto;
})[];
