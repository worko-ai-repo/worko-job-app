import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countCompanyDaoObj } from "../daos/CountCompany.dao";

// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";

// Import models
import { DbCountCompanyDto } from "../db/models/CountCompany.model";
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

// Import services
import { companyDetailServiceObj } from "./CompanyDetail.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CountCompanyService {
  async getCountCompanyByCompanyIdAndEntityType(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyDto>> {
    global.logger.info(
      "Get Count Company By Company Id And Entity Type [Service]",
      {
        companyId,
        entityType,
      }
    );

    return countCompanyDaoObj.getCountCompanyByCompanyIdAndEntityType(
      companyId,
      entityType
    );
  }

  async validateAndGetCountCompanyByCompanyIdAndEntityType(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum
  ): Promise<QueryResponse<DbCountCompanyDto>> {
    global.logger.info(
      "Validate And Get Count Company By Company Id And Entity Type [Service]",
      {
        companyId,
        entityType,
      }
    );

    const companyDetailQueryResponse: QueryResponse<DbCompanyDetailDto> =
      await companyDetailServiceObj.getCompanyDetailById(companyId);
    if (!companyDetailQueryResponse.count) {
      throw new BaseError(
        "Company Details does not exist.",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    return this.getCountCompanyByCompanyIdAndEntityType(
      companyId,
      entityType
    );
  }
}

const countCompanyServiceObj: CountCompanyService =
  new CountCompanyService();
export { countCompanyServiceObj, CountCompanyService };
