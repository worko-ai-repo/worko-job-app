
// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import enums
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";

// Import models
import { CountUserModel, DbCountUserDto } from "../db/models/CountUser.model";

class CountUserDao implements BaseDao {
  modelName = "CountUser";
  partitianKey = "USR#EML#{primaryEmail}";
  sortKeys = { SK_ID: "MET#ENT#{entityType}" };
  GSI1PK = "USR#MET#";
  GSI1SK = "ENT#{entityType}";

  preparePKAndSKForQuery(
    primaryEmail: string,
    entityType: CountUserDbEntityTypeEnum
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{primaryEmail}": primaryEmail,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{entityType}": entityType,
      }),
    };
  }

  async getCountUserByRegisteredEmailAndEntityType(
    registeredEmail: string,
    entityType: CountUserDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountUserDto>> {
    global.logger.info(
      "Get Count User By Registered Email And Entity Type [DAO]",
      {
        registeredEmail,
        entityType,
        methodName: this.getCountUserByRegisteredEmailAndEntityType.name,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(registeredEmail, entityType);
    return CountUserModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }
}

const countUserDaoObj: CountUserDao = new CountUserDao();
export { countUserDaoObj, CountUserDao };
