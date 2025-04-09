// import dynamoose libraries
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Load the local daos
import companyDetailDao from "../daos/CompanyDetail.dao";

// Load the local dto
import { CompanyDTO, CompanyListingFilterOptions } from "../dtos/Company.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

//Load models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

/**
 * CompanyService class responsible for managing company-related operations.
 */
class CompanyService {

  /**
   * getCompanyDetailById
   *
   * Retrieves the details of a company based on the provided company ID.
   *
   * @param {string} companyId - The ID of the company to retrieve details for.
   * @return {Promise<QueryResponse<DbCompanyDetailDto>>} A promise that resolves with the query response containing the company details.
   */
  async getCompanyDetailById(
    companyId: string
  ): Promise<QueryResponse<DbCompanyDetailDto>> {
    return companyDetailDao.getCompanyDetailById(companyId);
  }

  /**
   * getCompanyByName
   *
   * Retrieves a list of existing companies that have names starting with the given string.
   *
   * @param {string} name - The prefix of the company name to search.
   * @returns {Promise<QueryResponse<DbCompanyDetailDto>>} A promise that resolves with the query response containing the company details that match the prefix.
   */
  async getCompanyByName(name: string) {
    return companyDetailDao.getByBeginsith(name);
  }

  /**
   * getCompanyList
   *
   * Retrieves a list of companies based on the provided filter options.
   *
   * @param {CompanyListingFilterOptions} filterOptions - The filter options to apply to the query.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCompanyDetailDto>>} A promise that resolves with the paginated results containing the company details that match the filter options.
   */
  async getCompanyList(
    filterOptions: CompanyListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCompanyDetailDto>
  > {
    return companyDetailDao.companyList(filterOptions);
  }

  /**
   *
   * @param ids
   * Returns the list of companies having the InputKeys
   */
  async getCompanyDetailsByIds(ids: string[]) {
    return companyDetailDao.getCompanyDetailsByIds(ids);
  }

  /**
   *
   * Retrieves a list of existing companies.
   *
   * @returns
   */
  async getByBeginsWith(beginsWith: string) {
    return companyDetailDao.getByBeginsith(beginsWith);
  }

  async getAllCompanyNames() {
    return companyDetailDao.getAllCompanyNames();
  }

  /**
   * addNewCompany
   *
   * Adds a new company to the database using the provided company DTO.
   *
   * @param {CompanyDTO} companyDto - The data transfer object containing the details of the company to be added.
   * @returns {Promise<DbCompanyDetailDto>} A promise that resolves with the details of the added company.
   */
  async addNewCompany(companyDto: CompanyDTO): Promise<DbCompanyDetailDto> {
    return companyDetailDao.add(companyDto);
  }
}

// Export an instance of the CompanyService class
export default new CompanyService();
