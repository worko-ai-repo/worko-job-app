// Import necessary types from dynamoose library
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

//Load the base dao
import BaseDao from "./Base.dao";

//Load the local enums
import { SortOrderTypeEnum } from "../enums/Common.enum";

//Load the local models
import { CompanyDetailModel, DbCompanyDetailDto } from "../db/models/CompanyDetail.model";

//Load the local dtos
import { CompanyDTO, CompanyListingFilterOptions, CompanyUpdateDto } from "../dtos/Company.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Load the local helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

//Load UlidService for generating ULID IDs
import UlidService from "../services/Ulid.service";


// DAO class for handling Company details
class CompanyDetailDao implements BaseDao {
  modelName = "Company"; // Model name for Company
  partitianKey = "COMP#"; // Partition key for Company
  sortKeys = { SK_INIT: "ID#{companyId}" }; // Sort keys for Company

  // @todo : As we have supporting multiple industries for companies considering the same
  // attaching indutsry to GSI1PK will not work we need to update teh GSI1PK value appropiately
  GSI1PK = "COMP#INDS#{industryName}";
  GSI1SK = "ID#{companyId}";

  /**
   * getCompanyDetailById
   *
   * Retrieves company details based on the provided company ID.
   *
   * @param {string} companyId - The ID of the company to retrieve company details.
   * @return {Promise<QueryResponse<DbCompanyDetailDto>>} A promise that resolves with the query response containing the company details.
   */
  async getCompanyDetailById(
    companyId: string
  ): Promise<QueryResponse<DbCompanyDetailDto>> {
    // Log the action of fetching company details in the dao
    global.logger.info("company details [dao]");

    // replace the placeholders in the sort keys
    const SK = this.sortKeys.SK_INIT.strtr({
      "{companyId}": companyId,
    });

    // return the query response from the model to get the company details
    return CompanyDetailModel.query("PK")
      .eq(this.partitianKey)
      .where("SK")
      .eq(SK)
      .exec();
  }

  /**
   * getCompanyList
   *
   * Retrieves a list of companies based on the provided filter options.
   *
   * @param {CompanyListingFilterOptions} filterOptions - The filter options to apply to the query.
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbCompanyDetailDto>>} A promise that resolves with the paginated results containing the company details that match the filter options.
   */
  async companyList(
    filterOptions: CompanyListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbCompanyDetailDto>
  > {
    // Log the action of fetching company details in the dao
    global.logger.info("Get all company details [dao]", {
      filePath: __filename,
      methodName: this.companyList.name,
    });

    let query: Query<DbCompanyDetailDto>;
    query = CompanyDetailModel.query("PK")
      .eq(this.partitianKey)
      .where("SK")
      .beginsWith(
        this.sortKeys.SK_INIT.strtr({
          "{companyId}": "",
        })
      )
      .sort(filterOptions.sortOrder ?? SortOrderTypeEnum.DESCENDING);

    // Construct the query based on filter options
    if (filterOptions.companyName) {
      // If company name filter is provided, construct a query to search for companies by name
      let companyName: string = filterOptions.companyName.toUpperCase();
      query = query.where("name").contains(companyName);
    }

    // search for industry name if provided.
    if (filterOptions.industryName) {
      // Log the original industry name input for debugging
      global.logger.info(
        "searching for industry name is :" + filterOptions.industryName
      );

      // Split the industry name by '/', convert to lowercase, and trim each term
      let industryTerms = filterOptions.industryName
        .toLowerCase()
        .split("/")
        .map((term) => term.trim());

      // Add a parenthesized condition to the query for industry filtering
      query = query.and().parenthesis((condition) => {
        let subCondition = condition;

        // Iterate through each industry term
        industryTerms.forEach((term, index) => {
          if (index === 0) {
            // For the first term, start the condition chain
            subCondition = subCondition.where("industry").contains(term);
          } else {
            // For subsequent terms, add OR conditions
            subCondition = subCondition.or().where("industry").contains(term);
          }
        });

        // Return the built subcondition
        return subCondition;
      });
    }

    // Get TeamSize filter from filterOptions
    if (filterOptions.teamSize) {
      // If teamSize filter is provided, filter the companies by teamSize range
      let teamSizeRange = filterOptions.teamSize.split("-");
      if (teamSizeRange.length === 2) {
        // If range has two values, filter the companies within the range
        let minRange = parseInt(teamSizeRange[0]);
        let maxRange = parseInt(teamSizeRange[1]);
        query.where("teamSize").between(minRange, maxRange);
      } else if (teamSizeRange.length === 1) {
        // If range has only one value (single value), filter companies with teamSize equal to that value
        let singleTeamSize = parseInt(teamSizeRange[0]);
        query.where("teamSize").eq(singleTeamSize);
      }
    }

    // Add isVerified filter if provided
    if (
      filterOptions.isVerified !== undefined &&
      filterOptions.isVerified !== null
    ) {
      if (filterOptions.isVerified === 1) {
        query = query.where("isVerified").eq(true);
      } else if (filterOptions.isVerified === 0) {
        query = query.where("isVerified").eq(false);
      }
    }

    // Apply date range filter if provided
    if (filterOptions.fromDate || filterOptions.toDate) {
      query = query.and().parenthesis((condition) => {
        if (filterOptions.fromDate) {
          condition.where("createdAt").ge(filterOptions.fromDate);
        }
        if (filterOptions.toDate) {
          condition.where("createdAt").le(filterOptions.toDate);
        }
        return condition;
      });
    }

    // search by searchText if provided
    if (filterOptions.searchText) {
      // remove trailing and leading spaces from the search text
      let searchTextValue = filterOptions.searchText;

      /* 
      The and() method initiates a condition block where all conditions within it must be satisfied.
      The parenthesis() method allows grouping of conditions for complex queries.
      */
      query = query.and().parenthesis((condition) => {
        condition
        .where("name")
        .contains(searchTextValue.toUpperCase())
        .or()
        .where("industry")
        .contains(searchTextValue.toLowerCase())

        // Return the built condition
        return condition;
      });
    }

    // Execute the query by applying the paginateQuery helper and return the results
    return getPaginatedResultsWithMatchingConditions<
      DbCompanyDetailDto,
      CompanyListingFilterOptions
    >(query, filterOptions);
  }

  /**
   * deleteCompany
   * 
   * Deletes a company from the database.
   *
   * @param {DbCompanyDetailDto} companyDetails - The company details to be deleted.
   * @returns {Promise<void>} A promise that resolves when the company is deleted.
   */
  async deleteCompany(companyDetails: DbCompanyDetailDto): Promise<void> {
    global.logger.info(`Delete Company Details [DAO]`, {
      filePath: __filename,
      methodName: this.deleteCompany.name,
      PK: companyDetails.PK,
      SK: companyDetails.SK,
    });

    // delete company details
    return companyDetails.delete();
  }

  /**
   * softDeleteCompanyByPkAndSk
   *
   * Soft deletes a company by updating the `isDeleted` field to true based on 
   * the provided primary key and sort key.
   *
   * @param {string} PK - The primary key of the company to be soft deleted.
   * @param {string} SK - The sort key of the company to be soft deleted.
   * @returns {Promise<DbCompanyDetailDto>} A promise that resolves with the updated company details.
   */
  async softDeleteCompanyByPkAndSk(PK: string, SK: string): Promise<DbCompanyDetailDto> {
    global.logger.info(`Soft Delete Company Details [DAO]`, {
      filePath: __filename,
      methodName: this.softDeleteCompanyByPkAndSk.name,
      PK: PK,
      SK: SK,
    });

    return CompanyDetailModel.update({ PK: PK, SK: SK }, { isDeleted: true });
  }

  /**
   *
   * @param ids
   * Returns the list of companies having the InputKeys
   */
  getCompanyDetailsByIds(ids: string[]) {
    let inputKeys = ids.map((id) => {
      return {
        PK: this.partitianKey,
        SK: this.sortKeys.SK_INIT.strtr({
          "{companyId}": id,
        }),
      };
    });
    return CompanyDetailModel.batchGet(inputKeys);
  }

  /**
   * getByBeginsith
   *
   * Retrieves a list of existing companies that have names starting with the given string.
   *
   * @param {string} beginsWith - The prefix of the company name to search.
   * @returns {Promise<QueryResponse<DbCompanyDetailDto>>} A promise that resolves with the query response containing the company details that match the prefix.
   */
  async getByBeginsith(beginsWith: string): Promise<QueryResponse<DbCompanyDetailDto>> {
    return CompanyDetailModel.query("PK")
      .eq(this.partitianKey)
      .where("name")
      .contains(beginsWith.toUpperCase())
      .attributes(["name", "SK"])
      .exec();
  }

  async getAllCompanyNames() {
    return CompanyDetailModel.query("PK")
      .eq(this.partitianKey)
      .attributes(["name"])
      .exec();
  }

  /**
   * add
   *
   * Creates a new company with the provided details.
   *
   * @param companyDto - Data for the Company to be created.
   * @returns {Promise<DbCompanyDetailDto>} - Return the type of DbCompanyDetailDto Response.
   *
   * @see {CompanyDetailModel} - The model used to interact with the database
   */
  async add(companyDto: CompanyDTO): Promise<DbCompanyDetailDto> {
    // Generate ULID id for company
    let id = UlidService.getUlidId();

    // Prepare the PK SK the company
    const SK = this.sortKeys.SK_INIT.strtr({
      "{companyId}": id,
    });

    // store the detalis with alphabetic cases
    companyDto.name = companyDto.name.toUpperCase();
    companyDto.industry = companyDto.industry.toLowerCase();

    // Prepare the data required to create a new company
    const newCompanyDto = {
      ...companyDto,
      PK: this.partitianKey,
      SK: SK,
      GSI1PK: this.GSI1PK.strtr({
        "{industryName}": companyDto.industry,
      }),
      GSI1SK: SK,
      id: id,
    };

    // Create the company with the above data
    return CompanyDetailModel.create(newCompanyDto);
  }

  /**
   * update
   *
   * Updates an existing company in the database using the provided company update DTO and company ID.
   *
   * @param {CompanyUpdateDto} companyUpdateDto - The data transfer object containing the updated details of the company.
   * @param {string} companyId - The ID of the company to be updated.
   * @returns {Promise<DbCompanyDetailDto>} A promise that resolves with the updated company details.
   */
  async update(companyUpdateDto: CompanyUpdateDto, companyId: string): Promise<DbCompanyDetailDto> {
    global.logger.info("Update company [dao]", {
      filePath: __filename,
      methodName: this.update.name,
      companyId: companyId,
      isVerified: companyUpdateDto.isVerified,
      isCompanyRequestPageFlag: companyUpdateDto.isCompanyRequestPageFlag
    });

    // Prepare the data required to update a company
    const { isCompanyRequestPageFlag ,...companyDto } = companyUpdateDto;

    // Log the details {
    const updateCompanyDto = {
      ...companyDto,
      id: companyId, // adding id if its not present
      GSI1PK: this.GSI1PK.strtr({
        "{industryName}": companyDto.industry,
      }),
    };

    // Update the company with the above data
    return CompanyDetailModel.update(
      {
        PK: this.partitianKey,
        SK: this.sortKeys.SK_INIT.strtr({
          "{companyId}": companyId,
        }),
      },
      updateCompanyDto
    );
  }
}

// Export an instance of the CompanyDetailDao class
const companyDetailDao = new CompanyDetailDao();

export default companyDetailDao;