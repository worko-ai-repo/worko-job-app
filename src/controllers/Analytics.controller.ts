// Import express types
import { Request, Response, NextFunction } from "express";

// Import enums
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";

// Import dtos
import {
  FunnelVelocityResponse,
  OnboardingPipelineResponse,
  CriticalDropoffResponse,
} from "../dtos/Analytics.dto";
import {
  RequestEvaluationListingFilterOptions,
  RequestEvaluationListingFilterRequestDTO,
} from "../dtos/RequestEvaluation.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  RecordListingResponseDTO,
} from "../dtos/Common.dto";

// Import schemas
import {
  analyticsFunnelVelocityAggregateQueryValidation,
  analyticsOnboardingPipelineQueryValidation,
  analyticsDropoffQueryValidation,
  analyticsHiringTrendQueryValidation,
  analyticsRequestEvaluationCompanyFilterValidation,
} from "../schemas/Analytics.schema";

// Import services
import { analyticsServiceObj } from "../services/Analytics.service";

// Import utils
import APP_CONSTANTS from "../configs/constants.config";
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { DbRequestEvaluationDto } from "../db/models/RequestEvaluation.model";

// Import helpers
import { resolveUserContext, mapDateRangeToDays } from "../helpers/Analytics.helper";
import { RequestHelper } from "../helpers/request.helper";
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";

/**
 * AnalyticsController
 *
 * Controller for handling analytics related endpoints.
 */
class AnalyticsController {
  getRequestEvaluationsByFilterOptionsForCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get Request Evaluations By Filter Options [Controller]`, {
        methodName: this.getRequestEvaluationsByFilterOptionsForCompany.name,
      });

      const {isAdmin, isCorporateUser, corporateCompanyId, corporateUserId, corporateUserType,} = await resolveUserContext();

      if (!isAdmin && !isCorporateUser) {
        throw new BaseError(
          "You are not allowed to access analytics.",
          HttpStatusCode.FORBIDDEN_403
        );
      }
      const filterOptions: RequestEvaluationListingFilterOptions = RequestHelper.parseFilterOptions<
        RequestEvaluationListingFilterRequestDTO,
        RequestEvaluationListingFilterOptions
      >(req.query as unknown as RequestEvaluationListingFilterRequestDTO);

      const { error: reqBodyError, value: validatedFilterOptions } =
        analyticsRequestEvaluationCompanyFilterValidation.validate(filterOptions, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
        DbRequestEvaluationDto[]
      > = await analyticsServiceObj.getRequestEvaluationsByFilterOptionsForCompany(
        validatedFilterOptions
      );

      const { lastKey, count, timesQueried, queriedCount, data } = requestEvaluationDetails;

      const response: RecordListingResponseDTO<DbRequestEvaluationDto[]> =
        paginationResponseHelperObj.customizedPaginationRecordListingResponse<
          DbRequestEvaluationDto[],
          RequestEvaluationListingFilterOptions
        >(data, filterOptions, count, timesQueried, lastKey, queriedCount);

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getFunnelVelocityAggregate
   *
   * Controller for `/analytics/funnel-velocity` aggregate endpoint.
   */
  getFunnelVelocityAggregate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Get Funnel Velocity Aggregate [Controller]`, {
        filePath: __filename,
        methodName: this.getFunnelVelocityAggregate.name,
        query: req.query,
      });

      const { error, value: validatedQuery } =
        analyticsFunnelVelocityAggregateQueryValidation.validate(req.query, {
          abortEarly: false,
        });
      if (error) {
        throw new RequestValidationError(error);
      }

      const {
        companyId: requestedCompanyId,
        recruiterId,
        jobIds,
        dateRange,
        jobStatus,
      } = validatedQuery as {
        companyId?: string;
        recruiterId?: string;
        jobIds?: string[] | string;
        dateRange?: string;
        jobStatus?: "ALL" | "PUBLISHED";
      };

      const { isAdmin, isCorporateUser, corporateCompanyId, corporateUserId, corporateUserType } =
        await resolveUserContext();

      if (!isAdmin && !isCorporateUser) {
        throw new BaseError(
          "You are not allowed to access analytics.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const effectiveCompanyId: string | undefined = isCorporateUser
        ? corporateCompanyId
        : requestedCompanyId;

      // Warn about admin queries without companyId
      if (isAdmin && !effectiveCompanyId) {
        global.logger.warn("Admin analytics query without companyId - using limits [Controller]", {
          methodName: this.getFunnelVelocityAggregate.name,
          userId: corporateUserId,
          endpoint: "/analytics/funnel-velocity",
          query: req.query,
        });
      }

      let normalizedJobIds: string[] | undefined;
      if (Array.isArray(jobIds)) {
        normalizedJobIds = jobIds;
      } else if (typeof jobIds === "string" && jobIds.trim().length) {
        normalizedJobIds = jobIds.split(",").map((id) => id.trim());
      }

      const dateRangeInDays: number | undefined = mapDateRangeToDays(dateRange);

      const effectiveRecruiterId: string | undefined =
        recruiterId ??
        (corporateUserType === CorporateUserTypeEnum.CORPORATE_RECRUITER
          ? corporateUserId
          : undefined);

      const response: FunnelVelocityResponse = await analyticsServiceObj.getFunnelVelocityAggregate(
        {
          companyId: effectiveCompanyId,
          corporateRecruiterUserId: effectiveRecruiterId,
          jobIds: normalizedJobIds,
          dateRangeInDays,
          jobStatusFilter: jobStatus ?? "ALL",
        }
      );

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getOnboardingPipelineData
   *
   * Controller for `/analytics/onboarding-pipeline` endpoint.
   */
  getOnboardingPipelineData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Get Onboarding Pipeline Data [Controller]`, {
        filePath: __filename,
        methodName: this.getOnboardingPipelineData.name,
        query: req.query,
      });

      const { error, value: validatedQuery } = analyticsOnboardingPipelineQueryValidation.validate(
        req.query,
        {
          abortEarly: false,
        }
      );
      if (error) {
        throw new RequestValidationError(error);
      }

      const {
        companyId: requestedCompanyId,
        recruiterId,
        jobId,
        status,
        includeDetails,
        dateRange,
        jobStatus,
      } = validatedQuery as {
        companyId?: string;
        recruiterId?: string;
        jobId?: string;
        status?: JobApplicationStatus;
        includeDetails?: boolean;
        dateRange?: string;
        jobStatus?: "ALL" | "PUBLISHED";
      };

      const { isAdmin, isCorporateUser, corporateCompanyId, corporateUserId, corporateUserType } =
        await resolveUserContext();

      if (!isAdmin && !isCorporateUser) {
        throw new BaseError(
          "You are not allowed to access analytics.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const effectiveCompanyId: string | undefined = isCorporateUser
        ? corporateCompanyId
        : requestedCompanyId;

      // Warn about admin queries without companyId
      if (isAdmin && !effectiveCompanyId) {
        global.logger.warn("Admin analytics query without companyId - using limits [Controller]", {
          methodName: this.getOnboardingPipelineData.name,
          userId: corporateUserId,
          endpoint: "/analytics/onboarding-pipeline",
          query: req.query,
        });
      }

      const effectiveRecruiterId: string | undefined =
        recruiterId ??
        (corporateUserType === CorporateUserTypeEnum.CORPORATE_RECRUITER
          ? corporateUserId
          : undefined);

      const dateRangeInDays: number | undefined = mapDateRangeToDays(dateRange);

      const response: OnboardingPipelineResponse =
        await analyticsServiceObj.getOnboardingPipelineData({
          companyId: effectiveCompanyId,
          corporateRecruiterUserId: effectiveRecruiterId,
          jobId,
          status,
          includeDetails,
        });

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getCriticalDropoffData
   *
   * Controller for `/analytics/dropoff` endpoint.
   */
  getCriticalDropoffData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Get Critical Dropoff Data [Controller]`, {
        filePath: __filename,
        methodName: this.getCriticalDropoffData.name,
        query: req.query,
      });

      const { error, value: validatedQuery } = analyticsDropoffQueryValidation.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        throw new RequestValidationError(error);
      }

      const {
        companyId: requestedCompanyId,
        recruiterId,
        jobId,
        dateRange,
        jobStatus,
        topN,
      } = validatedQuery as {
        companyId?: string;
        recruiterId?: string;
        jobId?: string;
        dateRange?: string;
        jobStatus?: "ALL" | "PUBLISHED";
        topN?: number;
      };

      const { isAdmin, isCorporateUser, corporateCompanyId, corporateUserId, corporateUserType } =
        await resolveUserContext();

      if (!isAdmin && !isCorporateUser) {
        throw new BaseError(
          "You are not allowed to access analytics.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const effectiveCompanyId: string | undefined = isCorporateUser
        ? corporateCompanyId
        : requestedCompanyId;

      // Warn about admin queries without companyId
      if (isAdmin && !effectiveCompanyId) {
        global.logger.warn("Admin analytics query without companyId - using limits [Controller]", {
          methodName: this.getCriticalDropoffData.name,
          userId: corporateUserId,
          endpoint: "/analytics/dropoff",
          query: req.query,
        });
      }

      const dateRangeInDays: number | undefined = mapDateRangeToDays(dateRange);

      const effectiveRecruiterId: string | undefined =
        recruiterId ??
        (corporateUserType === CorporateUserTypeEnum.CORPORATE_RECRUITER
          ? corporateUserId
          : undefined);

      const response: CriticalDropoffResponse = await analyticsServiceObj.getCriticalDropoffData({
        companyId: effectiveCompanyId,
        corporateRecruiterUserId: effectiveRecruiterId,
        jobId,
        dateRangeInDays,
        topN,
      });

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getHiringTrend
   *
   * Controller for `/analytics/hiring-trend` endpoint.
   */
  getHiringTrend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Get Hiring Trend [Controller]`, {
        filePath: __filename,
        methodName: this.getHiringTrend.name,
        query: req.query,
      });

      const { error, value: validatedQuery } = analyticsHiringTrendQueryValidation.validate(
        req.query,
        {
          abortEarly: false,
        }
      );
      if (error) {
        throw new RequestValidationError(error);
      }

      const {
        companyId: requestedCompanyId,
        recruiterId,
        granularity,
        dateRange,
        jobStatus,
      } = validatedQuery as {
        companyId?: string;
        recruiterId?: string;
        granularity?: "daily" | "weekly" | "monthly";
        dateRange?: string;
        jobStatus?: "ALL" | "PUBLISHED";
      };

      const { isAdmin, isCorporateUser, corporateCompanyId, corporateUserId, corporateUserType } =
        await resolveUserContext();

      if (!isAdmin && !isCorporateUser) {
        throw new BaseError(
          "You are not allowed to access analytics.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const effectiveCompanyId: string | undefined = isCorporateUser
        ? corporateCompanyId
        : requestedCompanyId;

      // Warn about admin queries without companyId
      if (isAdmin && !effectiveCompanyId) {
        global.logger.warn("Admin analytics query without companyId - using limits [Controller]", {
          methodName: this.getHiringTrend.name,
          userId: corporateUserId,
          endpoint: "/analytics/hiring-trend",
          query: req.query,
        });
      }

      const dateRangeInDays: number | undefined = mapDateRangeToDays(dateRange);

      const effectiveRecruiterId: string | undefined =
        recruiterId ??
        (corporateUserType === CorporateUserTypeEnum.CORPORATE_RECRUITER
          ? corporateUserId
          : undefined);

      const response = await analyticsServiceObj.getHiringTrend({
        companyId: effectiveCompanyId,
        corporateRecruiterUserId: effectiveRecruiterId,
        granularity: granularity ?? "monthly",
        dateRangeInDays,
        jobStatusFilter: jobStatus ?? "ALL",
      });

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default AnalyticsController;
