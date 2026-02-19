import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countCompanyDaoObj } from "../daos/CountCompany.dao";

// Import dtos
import {
  CountCompanyCommonUpdateDto,
  CountCompanyCreateDto,
  CountCompanyJobApplicationEntityUpdateDto,
  CountCompanyJobEntityUpdateDto,
} from "../dtos/CountCompany.dto";

// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";
import { JobStatusEnum } from "../enums/Job.enum";

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

    return this.createOrUpdateCountCompany(
      companyId,
      CountCompanyDbEntityTypeEnum.JOB_APPLICATION,
      updateData,
      isCountCompanyExist
    );
  }

  /**
   * createOrUpdateCountCompanyForJobEntityType
   *
   * Creates or updates the count company record for COMPANY_JOB entity type.
   * This is used to track job status counts (published, closed, archived, draft) for a company.
   *
   * @param {string} companyId - The company identifier
   * @param {CountCompanyJobEntityUpdateDto} updateData - The job status counts to update
   * @param {boolean} isCountCompanyExist - Whether the count company record already exists
   * @returns {Promise<DbCountCompanyDto>} The created or updated count company record
   */
  async createOrUpdateCountCompanyForJobEntityType(
    companyId: string,
    updateData: CountCompanyJobEntityUpdateDto,
    isCountCompanyExist: boolean
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Create Or Update Count Company For Job Entity Type [Service]", {
      companyId,
      updateData,
      isCountCompanyExist,
    });

    return this.createOrUpdateCountCompany(
      companyId,
      CountCompanyDbEntityTypeEnum.COMPANY_JOB,
      updateData,
      isCountCompanyExist
    );
  }

  /**
   * incrementCompanyJobStatusCount
   *
   * Increments the count for a specific job status in the company's job status counts.
   * Used when a job transitions to a new status or a new job is created.
   *
   * @param {string} companyId - The company identifier
   * @param {JobStatusEnum} jobStatus - The job status to increment (PUBLISHED, CLOSED, ARCHIVED, DRAFT)
   * @returns {Promise<DbCountCompanyDto>} The updated count company record
   */
  async incrementCompanyJobStatusCount(
    companyId: string,
    jobStatus: JobStatusEnum
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Increment Company Job Status Count [Service]", {
      companyId,
      jobStatus,
    });

    // Get existing count company record
    const existingCountCompany: QueryResponse<DbCountCompanyDto> =
      await this.getCountCompanyByCompanyIdAndEntityType(
        companyId,
        CountCompanyDbEntityTypeEnum.COMPANY_JOB
      );

    const isCountCompanyExist = existingCountCompany.count > 0;

    // Initialize counts
    const currentCounts = isCountCompanyExist
      ? existingCountCompany[0].allCompanyJobStatusCounts
      : { published: 0, closed: 0, archived: 0, draft: 0 };

    // Increment the appropriate counter
    const updatedCounts = { ...currentCounts };
    switch (jobStatus) {
      case JobStatusEnum.PUBLISHED:
        updatedCounts.published = (currentCounts?.published || 0) + 1;
        break;
      case JobStatusEnum.CLOSED:
        updatedCounts.closed = (currentCounts?.closed || 0) + 1;
        break;
      case JobStatusEnum.ARCHIVED:
        updatedCounts.archived = (currentCounts?.archived || 0) + 1;
        break;
      case JobStatusEnum.DRAFT:
        updatedCounts.draft = (currentCounts?.draft || 0) + 1;
        break;
    }

    return this.createOrUpdateCountCompanyForJobEntityType(
      companyId,
      { allCompanyJobStatusCounts: updatedCounts },
      isCountCompanyExist
    );
  }

  /**
   * decrementCompanyJobStatusCount
   *
   * Decrements the count for a specific job status in the company's job status counts.
   * Used when a job is deleted or transitions away from a status.
   *
   * @param {string} companyId - The company identifier
   * @param {JobStatusEnum} jobStatus - The job status to decrement (PUBLISHED, CLOSED, ARCHIVED, DRAFT)
   * @returns {Promise<DbCountCompanyDto>} The updated count company record
   */
  async decrementCompanyJobStatusCount(
    companyId: string,
    jobStatus: JobStatusEnum
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Decrement Company Job Status Count [Service]", {
      companyId,
      jobStatus,
    });

    // Get existing count company record
    const existingCountCompany: QueryResponse<DbCountCompanyDto> =
      await this.getCountCompanyByCompanyIdAndEntityType(
        companyId,
        CountCompanyDbEntityTypeEnum.COMPANY_JOB
      );

    if (!existingCountCompany.count) {
      global.logger.warn("Count Company record does not exist for decrement operation", {
        companyId,
        jobStatus,
      });
      throw new BaseError("Count Company record does not exist.", HttpStatusCode.NOT_FOUND_404);
    }

    const currentCounts = existingCountCompany[0].allCompanyJobStatusCounts || {
      published: 0,
      closed: 0,
      archived: 0,
      draft: 0,
    };

    // Decrement the appropriate counter (ensure it doesn't go below 0)
    const updatedCounts = { ...currentCounts };
    switch (jobStatus) {
      case JobStatusEnum.PUBLISHED:
        updatedCounts.published = Math.max((currentCounts.published || 0) - 1, 0);
        break;
      case JobStatusEnum.CLOSED:
        updatedCounts.closed = Math.max((currentCounts.closed || 0) - 1, 0);
        break;
      case JobStatusEnum.ARCHIVED:
        updatedCounts.archived = Math.max((currentCounts.archived || 0) - 1, 0);
        break;
      case JobStatusEnum.DRAFT:
        updatedCounts.draft = Math.max((currentCounts.draft || 0) - 1, 0);
        break;
    }

    return this.createOrUpdateCountCompanyForJobEntityType(
      companyId,
      { allCompanyJobStatusCounts: updatedCounts },
      true
    );
  }

  /**
   * updateCompanyJobStatusCountOnStatusChange
   *
   * Updates the company job status counts when a job's status changes.
   * Decrements the old status count and increments the new status count.
   *
   * @param {string} companyId - The company identifier
   * @param {JobStatusEnum} oldStatus - The previous job status
   * @param {JobStatusEnum} newStatus - The new job status
   * @returns {Promise<DbCountCompanyDto>} The updated count company record
   */
  async updateCompanyJobStatusCountOnStatusChange(
    companyId: string,
    oldStatus: JobStatusEnum,
    newStatus: JobStatusEnum
  ): Promise<DbCountCompanyDto> {
    global.logger.info("Update Company Job Status Count On Status Change [Service]", {
      companyId,
      oldStatus,
      newStatus,
    });

    // If status hasn't changed, no update needed
    if (oldStatus === newStatus) {
      global.logger.info("Job status unchanged, skipping count update", {
        companyId,
        status: oldStatus,
      });
      const existingCountCompany: QueryResponse<DbCountCompanyDto> =
        await this.getCountCompanyByCompanyIdAndEntityType(
          companyId,
          CountCompanyDbEntityTypeEnum.COMPANY_JOB
        );
      return existingCountCompany[0];
    }

    // Get existing count company record
    const existingCountCompany: QueryResponse<DbCountCompanyDto> =
      await this.getCountCompanyByCompanyIdAndEntityType(
        companyId,
        CountCompanyDbEntityTypeEnum.COMPANY_JOB
      );

    const isCountCompanyExist = existingCountCompany.count > 0;
    const currentCounts = isCountCompanyExist
      ? existingCountCompany[0].allCompanyJobStatusCounts
      : { published: 0, closed: 0, archived: 0, draft: 0 };

    // Update counts: decrement old status, increment new status
    const updatedCounts = { ...currentCounts };

    // Decrement old status
    switch (oldStatus) {
      case JobStatusEnum.PUBLISHED:
        updatedCounts.published = Math.max((currentCounts?.published || 0) - 1, 0);
        break;
      case JobStatusEnum.CLOSED:
        updatedCounts.closed = Math.max((currentCounts?.closed || 0) - 1, 0);
        break;
      case JobStatusEnum.ARCHIVED:
        updatedCounts.archived = Math.max((currentCounts?.archived || 0) - 1, 0);
        break;
      case JobStatusEnum.DRAFT:
        updatedCounts.draft = Math.max((currentCounts?.draft || 0) - 1, 0);
        break;
    }

    // Increment new status
    switch (newStatus) {
      case JobStatusEnum.PUBLISHED:
        updatedCounts.published = (updatedCounts.published || 0) + 1;
        break;
      case JobStatusEnum.CLOSED:
        updatedCounts.closed = (updatedCounts.closed || 0) + 1;
        break;
      case JobStatusEnum.ARCHIVED:
        updatedCounts.archived = (updatedCounts.archived || 0) + 1;
        break;
      case JobStatusEnum.DRAFT:
        updatedCounts.draft = (updatedCounts.draft || 0) + 1;
        break;
    }

    return this.createOrUpdateCountCompanyForJobEntityType(
      companyId,
      { allCompanyJobStatusCounts: updatedCounts },
      isCountCompanyExist
    );
  }
}

const countCompanyServiceObj: CountCompanyService = new CountCompanyService();
export { countCompanyServiceObj, CountCompanyService };
