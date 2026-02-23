

// Import firestore package
import { DocumentData, FieldPath, Firestore, Query } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { CandidateJobRecommendationListingFilterOptions } from "../dtos/CandidateJobRecommendation.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";

// Import models
import { DbCandidateJobRecommendationDto } from "../db/gcp-firestore-models/CandidateJobRecommendation.model";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import { gcpFirestoreUtilObj } from "../utils/gcp-firestore.util";

class CandidateJobRecommendationDao implements BaseDao {
  constructor() {
    if (!process.env.APP_STAGE)
      throw new BaseError(
        "APP_STAGE is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500,
      );
  }

  databaseName: string =
    APP_CONSTANTS.STAGES.PROD === process.env.APP_STAGE
      ? "worko-corp-db-prod"
      : "worko-corp-db-dev";
  collectionName: string = "candidateJobRecommendations";

  getCandidateJobRecommendationModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getCandidateJobRecommendationFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createBulkCandidateJobRecommendation(bulkJobData: DbCandidateJobRecommendationDto[]): Promise<boolean> {
    return gcpFirestoreLibrary.bulkCreateDocument<DbCandidateJobRecommendationDto>(
      this.getCandidateJobRecommendationModelDetails(),
      bulkJobData,
    );
  }

  async getAllCandidateJobRecommendationByFilterOptions(
    filterOptions: CandidateJobRecommendationListingFilterOptions
  ) {
    const db: Firestore = await this.getCandidateJobRecommendationFirestoreDatabase();
    let baseQuery: Query<DocumentData, DocumentData> = db
      .collection(this.collectionName)

    if(filterOptions?.jobId) {
      baseQuery = baseQuery.where("jobId", "==", filterOptions.jobId);
    }

    if((filterOptions?.candidateEmail)) {
      baseQuery = baseQuery.where("candidateEmail", "==", filterOptions.candidateEmail);
    }

    if(filterOptions?.isJobPublished !== undefined) {
      baseQuery = baseQuery.where("isJobPublished", "==", filterOptions.isJobPublished);
    }

    if(filterOptions?.isIncludedInEmailCountLessThan !== undefined) {
      baseQuery = baseQuery.where("includedInEmailCount", "<", filterOptions.isIncludedInEmailCountLessThan)
                           .orderBy("includedInEmailCount", GcpFirestoreSortOrderTypeEnum.DESCENDING);;
    }
    
    if(filterOptions?.sortOrder) {
      baseQuery = baseQuery.orderBy(FieldPath.documentId(), filterOptions.sortOrder);
    }

    return gcpFirestoreUtilObj.paginateGcpFirestore<
      CandidateJobRecommendationListingFilterOptions,
      DbCandidateJobRecommendationDto
    >(db, this.collectionName, baseQuery, filterOptions);
  }

  async updateBulkCandidateJobRecommendationByIdsWithDifferentData(data: { id: string; updateData: Partial<DbCandidateJobRecommendationDto> }[]) {
    return gcpFirestoreLibrary.bulkUpdateDocumentByIdsWithDifferentData<Partial<DbCandidateJobRecommendationDto>>(this.getCandidateJobRecommendationModelDetails(), data);
  }
}

const candidateJobRecommendationDaoObj = new CandidateJobRecommendationDao();
export { candidateJobRecommendationDaoObj, CandidateJobRecommendationDao };