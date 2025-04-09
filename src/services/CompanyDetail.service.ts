
// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import companyDetailDao from "../daos/CompanyDetail.dao";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

/**
 * CompanyDetailService
 */
class CompanyDetailService {
  /**
   * getCompanyDetailById
   *
   * Retrieves company details based on the provided company ID.
   *
   * @param {string} id - The ID of the company to retrieve company details.
   * @returns {Promise<QueryResponse<DbCompanyDetailDto>>} A promise that resolves with the query response containing the company details.
   */
  async getCompanyDetailById(
    id: string
  ): Promise<QueryResponse<DbCompanyDetailDto>> {
    // logger
    global.logger.info(`Get company details by id`, {
      methodName: this.getCompanyDetailById.name,
    });

    return companyDetailDao.getCompanyDetailById(id);
  }
}

const companyDetailServiceObj = new CompanyDetailService();

export {
   companyDetailServiceObj,
   CompanyDetailService
}