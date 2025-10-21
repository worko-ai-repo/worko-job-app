// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import dtos
import { CountCompanyJobCommonUpdateDto, CountCompanyJobCreateDto } from "../dtos/CountCompanyJob.dto";

// Import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

// Import models
import {
  CountCompanyJobModel,
  DbCountCompanyJobDto,
} from "../db/models/CountCompanyJob.model";

class CountCompanyJobDao implements BaseDao {
  modelName = "CountCompanyJob";
  partitianKey = "COMP#ID#{companyId}#";
  sortKeys = { SK_ID: "JOB#{jobId}#MET#ENT#{entityType}" };
  GSI1PK = "JOB#{jobId}#MET#";
  GSI1SK = "ENT#{entityType}";

  preparePKAndSKForQuery(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{companyId}": companyId,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{jobId}": jobId,
        "{entityType}": entityType,
      }),
    };
  }

  prepareGsi1PkAndGsi1SkForQuery(
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum
  ) {
    return {
      GSI1PK: this.GSI1PK.strtr({
        "{jobId}": jobId,
      }),
      GSI1SK: this.GSI1SK.strtr({
        "{entityType}": entityType,
      }),
    };
  }

  async createCountCompany(
    createData: CountCompanyJobCreateDto
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Create Count Company Job [DAO]", {
      createData,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      createData.companyId,
      createData.jobId,
      createData.entityType
    );
    const { GSI1PK, GSI1SK } = this.prepareGsi1PkAndGsi1SkForQuery(
      createData.jobId,
      createData.entityType
    );

    return CountCompanyJobModel.create({
      ...createData,
      PK: PK,
      SK: SK,
      GSI1PK: GSI1PK,
      GSI1SK: GSI1SK,
    });
  }

  async getCountCompanyJobByCompanyIdJobIdAndEntityType(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyJobDto>> {
    global.logger.info(
      "Get Count Company Job By Company Id, Job Id And Entity Type [DAO]",
      {
        companyId,
        jobId,
        entityType,
        methodName: this.getCountCompanyJobByCompanyIdJobIdAndEntityType.name,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(
      companyId,
      jobId,
      entityType
    );
    return CountCompanyJobModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }

  async updateCountCompanyJob(
    companyId: string,
    jobId: string,
    entityType: CountCompanyJobDbEntityTypeEnum,
    updateData: Partial<CountCompanyJobCommonUpdateDto>
  ): Promise<DbCountCompanyJobDto> {
    global.logger.info("Update Count Company Job [DAO]", {
      companyId,
      jobId,
      entityType,
      updateData,
    });

    return CountCompanyJobModel.update(
      this.preparePKAndSKForQuery(companyId,jobId, entityType),
      updateData
    );
  }
}

const countCompanyJobDaoObj: CountCompanyJobDao = new CountCompanyJobDao();
export { countCompanyJobDaoObj, CountCompanyJobDao };
