import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countUserDaoObj } from "../daos/CountUser.dao";

// Import enums
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";

// Import models
import { DbCountUserDto } from "../db/models/CountUser.model";


class CountUserService {
   async getCountUserByRegisteredEmailAndEntityType(registeredEmail: string, entityType: CountUserDbEntityTypeEnum): Promise<QueryResponse<DbCountUserDto>> {
      global.logger.info("Get Count User By Registered Email And Entity Type [Service]", {
         registeredEmail,
         entityType
      });

      return countUserDaoObj.getCountUserByRegisteredEmailAndEntityType(registeredEmail, entityType);
   }
}

const countUserServiceObj: CountUserService = new CountUserService();
export { countUserServiceObj, CountUserService };