import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countCompanyJobDaoObj } from "../daos/CountCompanyJob.dao";

// Import dtos
import { CountCompanyJobCommonUpdateDto, CountCompanyJobCreateDto, CountCompanyJobJobApplicationEntityUpdateDto } from "../dtos/CountCompanyJob.dto";

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
  private async createCountCompanyJob(
    createData: CountCompanyJobCreateDto
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Create Count Company Job [Service]", {
      createData,
    });

    return countCompanyJobDaoObj.createCountCompany(createData);
  }

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

  async getBatchCountCompanyJobByInputKeys(
    inputKeys: {
      PK: string;
      SK: string;
    }[]
  ) {
    global.logger.info("Get Batch Count Company Job By Input Keys [Service]", {
      methodName: this.getBatchCountCompanyJobByInputKeys.name,
      inputKeysLength: inputKeys.length,
    });
    return countCompanyJobDaoObj.getBatchCountCompanyJobByInputKeys(inputKeys);
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

  private async updateCountCompanyJob(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum,
    updateData: Partial<CountCompanyJobCommonUpdateDto>
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Update Count Company Job [Service]", {
      companyId,
      jobId,
      entityType,
      updateData,
    });

    return countCompanyJobDaoObj.updateCountCompanyJob(
      companyId,
      jobId,
      entityType,
      updateData
    );
  }

  private async createOrUpdateCountCompanyJob(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum,
    updateData: Partial<CountCompanyJobCommonUpdateDto>,
    isCountCompanyJobExists: boolean
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Create Or Update Count Company Job [Service]", {
      companyId,
      jobId,
      entityType,
      updateData,
    });

    if (isCountCompanyJobExists) {
      return this.updateCountCompanyJob(companyId, jobId, entityType, updateData);
    } else {
      return this.createCountCompanyJob({ companyId, jobId, entityType, ...updateData });
    }
  }

  async createOrUpdateCountCompanyJobForJobApplicationEntityType(
    companyId: string,
    jobId: string,
    updateData: CountCompanyJobJobApplicationEntityUpdateDto,
    isCountCompanyJobExists: boolean
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Create Or Update Count Company Job For Job Application Entity Type [Service]", {
      companyId,
      jobId,
      updateData,
    });

    return this.createOrUpdateCountCompanyJob(companyId, jobId, CountCompanyJobDbEntityTypeEnum.JOB_APPLICATION, updateData, isCountCompanyJobExists);
  }
}

const countCompanyJobServiceObj: CountCompanyJobService =
  new CountCompanyJobService();
export { countCompanyJobServiceObj, CountCompanyJobService };
