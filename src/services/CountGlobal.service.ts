import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countGlobalDaoObj } from "../daos/CountGlobal.dao";

// Import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

// Import models
import { DbCountGlobalDto } from "../db/models/CountGlobal.model";

class CountGlobalService {
   async getCountUserByEntityType(entityType: CountGlobalDbEntityTypeEnum): Promise<QueryResponse<DbCountGlobalDto>> {
      global.logger.info("Get Count Global By Entity Type [Service]", {
         entityType
      });

      return countGlobalDaoObj.getCountGlobalByEntityType(entityType);
   }
}

const countGlobalServiceObj: CountGlobalService = new CountGlobalService();
export { countGlobalServiceObj, CountGlobalService };