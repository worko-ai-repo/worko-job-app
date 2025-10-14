// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

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
}

const countCompanyJobDaoObj: CountCompanyJobDao = new CountCompanyJobDao();
export { countCompanyJobDaoObj, CountCompanyJobDao };
