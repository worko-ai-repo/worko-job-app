import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countCompanyDaoObj } from "../daos/CountCompany.dao";

// Import dtos
import { CountCompanyCommonUpdateDto, CountCompanyCreateDto, CountCompanyJobApplicationEntityUpdateDto } from "../dtos/CountCompany.dto";

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

  private async createCountCompany(createData: CountCompanyCreateDto): Promise<DbCountCompanyDto> {
    global.logger.info("Create Count Company [Service]", {
      createData,
    });

    return countCompanyDaoObj.createCountCompany(createData);
  }

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

  private async updateCountCompany(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum,
    updateData: Partial<CountCompanyCommonUpdateDto>
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Update Count Company [Service]", {
      companyId,
      entityType,
      updateData,
    });

    return countCompanyDaoObj.updateCountCompany(
      companyId,
      entityType,
      updateData
    );
  }

  private async createOrUpdateCountCompany(
    companyId: string,
    entityType: CountCompanyDbEntityTypeEnum,
    updateData: Partial<CountCompanyCommonUpdateDto>,
    isCountCompanyExist: boolean
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Create Or Update Count Company [Service]", {
      companyId,
      entityType,
      updateData,
      isCountCompanyExist,
    });

    if (isCountCompanyExist) {
      return this.updateCountCompany(companyId, entityType, updateData);
    } else {
      return this.createCountCompany({ companyId, entityType, ...updateData });
    }
  }

  async createOrUpdateCountCompanyForJobApplicationEntityType(
    companyId: string,
    updateData: CountCompanyJobApplicationEntityUpdateDto,
    isCountCompanyExist: boolean
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Create Or Update Count Company For Job Application Entity Type [Service]", {
      companyId,
      updateData,
    });

    return this.createOrUpdateCountCompany(companyId, CountCompanyDbEntityTypeEnum.JOB_APPLICATION, updateData, isCountCompanyExist);
  }
}

const countCompanyServiceObj: CountCompanyService =
  new CountCompanyService();
export { countCompanyServiceObj, CountCompanyService };
