
// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import dtos
import { CountUserCommonUpdateDto, CountUserCreateDto } from "../dtos/CountUser.dto";

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

  prepareGsi1PkAndGsi1SkForQuery(
    entityType: CountUserDbEntityTypeEnum
  ): {
    GSI1PK: string;
    GSI1SK: string;
  } {
    return {
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{entityType}": entityType,
      }),
    };
  }

   async createCountUser(
      createData: CountUserCreateDto
   ): Promise<DbCountUserDto> {
      global.logger.info("Create Count User [DAO]", {
         createData,
      });

      const { PK, SK } = this.preparePKAndSKForQuery(createData.email, createData.entityType); 
      const { GSI1PK, GSI1SK } = this.prepareGsi1PkAndGsi1SkForQuery(createData.entityType);

      return CountUserModel.create({
        ...createData,
        PK: PK,
        SK: SK,
        GSI1PK: GSI1PK,
        GSI1SK: GSI1SK,
      });
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

   async updateCountUserByRegisteredEmailAndEntityType(
      registeredEmail: string, 
      entityType: CountUserDbEntityTypeEnum, 
      updateData: Partial<CountUserCommonUpdateDto>
   ): Promise<DbCountUserDto> {
      global.logger.info("Update Count User By Registered Email And Entity Type [DAO]", {
         registeredEmail,
         entityType,
         updateData
      });

      return CountUserModel.update(this.preparePKAndSKForQuery(registeredEmail, entityType), updateData);
   }
}

const countUserDaoObj: CountUserDao = new CountUserDao();
export { countUserDaoObj, CountUserDao };
