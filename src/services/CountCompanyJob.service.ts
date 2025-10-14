import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countCompanyJobDaoObj } from "../daos/CountCompanyJob.dao";

// Import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

// Import models
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

// Import services
import { companyDetailServiceObj } from "./CompanyDetail.service";
import { jobServiceObj } from "./Job.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CountCompanyJobService {
  async getCountCompanyJobByCompanyIdJobIdAndEntityType(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyJobDto>> {
    global.logger.info(
      "Get Count Company Job By Company Id, Job Id And Entity Type [Service]",
      {
        companyId,
        jobId,
        entityType,
      }
    );

    return countCompanyJobDaoObj.getCountCompanyJobByCompanyIdJobIdAndEntityType(
      companyId,
      jobId,
      entityType
    );
  }

  async validateAndGetCountCompanyJobByCompanyIdJobIdAndEntityType(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyJobDto>> {
    global.logger.info(
      "Validate And Get Count Company Job By Company Id, Job Id And Entity Type [Service]",
      {
        companyId,
        jobId,
        entityType,
      }
    );

    const companyDetailQueryResponse: QueryResponse<DbCompanyDetailDto> = await companyDetailServiceObj.getCompanyDetailById(
      companyId
    );
    if(!companyDetailQueryResponse.count) {
      throw new BaseError(
         "Company Details does not exist.",
         HttpStatusCode.NOT_FOUND_404
      )
    }

    const companyData: DbCompanyDetailDto = companyDetailQueryResponse[0];

    const jobDetailsFromOpensearch: DbJobAwsOpensearchDto | undefined = await jobServiceObj.getJobByIdFromAwsOpensearch(
      jobId
    );
    if(!jobDetailsFromOpensearch) {
      throw new BaseError(
         "Job details not found.",
         HttpStatusCode.NOT_FOUND_404
      )
    }

    if(jobDetailsFromOpensearch.companyId !== companyData.id) {
      throw new BaseError(
         "Job does not belong to this particular company.",
         HttpStatusCode.NOT_FOUND_404
      )
    }

    return this.getCountCompanyJobByCompanyIdJobIdAndEntityType(
      companyId,
      jobId,
      entityType
    );
  }
}

const countCompanyJobServiceObj: CountCompanyJobService =
  new CountCompanyJobService();
export { countCompanyJobServiceObj, CountCompanyJobService };
