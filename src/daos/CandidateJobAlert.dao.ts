

// Import firestore package
import { DocumentData, Firestore, Query, SetOptions } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { CandidateJobAlertListingFilterOptions } from "../dtos/CandidateJobAlert.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";

// Import models
import { DbCandidateJobAlertDto } from "../db/gcp-firestore-models/CandidateJobAlert.model";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import { gcpFirestoreUtilObj } from "../utils/gcp-firestore.util";

class CandidateJobAlertDao implements BaseDao {
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
  collectionName: string = "candidateJobAlerts";

  getCandidateJobAlertModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getCandidateJobAlertFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async getCandidateJobAlertsByIds(candidateEmails: string[]) {
    return gcpFirestoreLibrary.getAllDocumentsByIdsWithoutPagination<
      DbCandidateJobAlertDto
    >(
      this.getCandidateJobAlertModelDetails(),
      candidateEmails,
    );
  }

  async getAllCandidateJobAlertByFilterOptions(
    filterOptions: CandidateJobAlertListingFilterOptions
  ) {
    const db: Firestore = await this.getCandidateJobAlertFirestoreDatabase();
    let baseQuery: Query<DocumentData, DocumentData> = db
      .collection(this.collectionName)

    if(filterOptions?.isEmailJobAlertEnabled !== undefined) {
      baseQuery = baseQuery.where("isEmailJobAlertEnabled", "==", filterOptions.isEmailJobAlertEnabled);
    }

    if(filterOptions?.publishedJobRecommendationsCountGreaterThan !== undefined) {
      baseQuery = baseQuery.where("publishedJobRecommendationsCount", ">", filterOptions.publishedJobRecommendationsCountGreaterThan)
                           .orderBy("publishedJobRecommendationsCount", GcpFirestoreSortOrderTypeEnum.DESCENDING);
    }

    return gcpFirestoreUtilObj.paginateGcpFirestore<
      CandidateJobAlertListingFilterOptions,
      DbCandidateJobAlertDto
    >(db, this.collectionName, baseQuery, filterOptions);
  }

  async createBulkCandidateJobAlert(data: DbCandidateJobAlertDto[], options?: SetOptions) {
    return gcpFirestoreLibrary.bulkCreateDocument<DbCandidateJobAlertDto>(
      this.getCandidateJobAlertModelDetails(),
      data,
      options
    );
  }

  async updateCandidateJobAlertById(id: string, data: Partial<DbCandidateJobAlertDto>) {
    return gcpFirestoreLibrary.updateDocumentById<Partial<DbCandidateJobAlertDto>,DbCandidateJobAlertDto>(this.getCandidateJobAlertModelDetails(), id, data);
  }

  async updateBulkCandidateJobAlertByIdsWithDifferentData(data: { id: string; updateData: Partial<DbCandidateJobAlertDto> }[]) {
    return gcpFirestoreLibrary.bulkUpdateDocumentByIdsWithDifferentData<Partial<DbCandidateJobAlertDto>>(this.getCandidateJobAlertModelDetails(), data);
  }
}

const candidateJobAlertDaoObj = new CandidateJobAlertDao();
export { candidateJobAlertDaoObj, CandidateJobAlertDao };