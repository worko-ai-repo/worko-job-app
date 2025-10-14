// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";

// Import models
import {
  CountCompanyModel,
  DbCountCompanyDto,
} from "../db/models/CountCompany.model";

class CountCompanyDao implements BaseDao {
  modelName = "CountCompany";
  partitianKey = "COMP#ID#{companyId}";
  sortKeys = { SK_ID: "MET#ENT#{entityType}" };
  GSI1PK = "COMP#MET#";
  GSI1SK = "ENT#{entityType}";

  preparePKAndSKForQuery(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{companyId}": companyId,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{entityType}": entityType,
      }),
    };
  }

  async getCountCompanyByCompanyIdAndEntityType(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyDto>> {
    global.logger.info(
      "Get Count Company Job By Company Id And Entity Type [DAO]",
      {
        companyId,
        entityType,
        methodName: this.getCountCompanyByCompanyIdAndEntityType.name,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(
      companyId,
      entityType
    );
    return CountCompanyModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }
}

const countCompanyDaoObj: CountCompanyDao = new CountCompanyDao();
export { countCompanyDaoObj, CountCompanyDao };
