// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

// Import models
import { CountGlobalModel, DbCountGlobalDto } from "../db/models/CountGlobal.model";

class CountGlobalDao implements BaseDao {
  modelName = "CountGlobal";
  partitianKey = "GLBL#COUNT";
  sortKeys = { SK_ID: "MET#ENT#{entityType}" };

  preparePKAndSKForQuery(
    entityType: CountGlobalDbEntityTypeEnum
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_ID.strtr({
        "{entityType}": entityType,
      }),
    };
  }

  async getCountGlobalByEntityType(
    entityType: CountGlobalDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountGlobalDto>> {
    global.logger.info(
      "Get Count Global By Entity Type [DAO]",
      {
        entityType,
        methodName: this.getCountGlobalByEntityType.name,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(entityType);
    return CountGlobalModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }
}

const countGlobalDaoObj: CountGlobalDao = new CountGlobalDao();
export { countGlobalDaoObj, CountGlobalDao };
