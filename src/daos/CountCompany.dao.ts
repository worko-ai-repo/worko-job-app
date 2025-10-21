// Import query response
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// Import dtos
import { CountCompanyCommonUpdateDto, CountCompanyCreateDto } from "../dtos/CountCompany.dto";

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

  prepareGsi1PkAndGsi1SkForQuery(
    entityType: CountCompanyDbEntityTypeEnum
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

  async createCountCompany(createData: CountCompanyCreateDto): Promise<DbCountCompanyDto> {
    global.logger.info("Create Count Company [DAO]", {
      createData,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      createData.companyId,
      createData.entityType
    );
    const { GSI1PK, GSI1SK } = this.prepareGsi1PkAndGsi1SkForQuery(
      createData.entityType
    );

    return CountCompanyModel.create({
      ...createData,
      PK: PK,
      SK: SK,
      GSI1PK: GSI1PK,
      GSI1SK: GSI1SK,
    });
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

  async updateCountCompany(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum,
    updateData: Partial<CountCompanyCommonUpdateDto>
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Update Count Company [DAO]", {
      companyId,
      entityType,
      updateData,
    });

    return CountCompanyModel.update(
      this.preparePKAndSKForQuery(companyId, entityType),
      updateData
    );
  }
}

const countCompanyDaoObj: CountCompanyDao = new CountCompanyDao();
export { countCompanyDaoObj, CountCompanyDao };
