// Import npm packages
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import DTOs
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";
import { JobApplicationInterviewListFilterOptions } from "../dtos/JobApplicationInterview.dto";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";

// Import models
import { DbJobApplicationInterviewDto } from "../db/gcp-firestore-models/JobApplicationInterview.model";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import utils
import { gcpFirestoreUtilObj } from "../utils/gcp-firestore.util";

class JobApplicationInterviewFirestoreDao implements BaseDao {
  /**
   * databaseName
   *
   * Firestore database name for corporate data.
   */
  databaseName: string = `worko-jobs-db-${process.env.APP_SLS_STAGE}`;
  /**
   * collectionName
   *
   * Firestore collection storing job application interview rounds.
   */
  collectionName: string = APP_CONSTANTS.JOB_APPLICATION_INTERVIEW_CONSTANTS.COLLECTION_NAME;

  /**
   * getModelDetails
   *
   * Returns collection and database details.
   *
   * @returns {GcpFirestoreInteractionDto}
   */
  getModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  /**
   * createUserApplicationInterview
   *
   * Creates an interview document.
   *
   * @param {DbJobApplicationInterviewDto} createData - Interview create payload.
   * @returns {Promise<DbJobApplicationInterviewDto | undefined>}
   */
  async createUserApplicationInterview(
    createData: DbJobApplicationInterviewDto,
  ): Promise<DbJobApplicationInterviewDto | undefined> {
    return gcpFirestoreLibrary.createDocument<DbJobApplicationInterviewDto>(
      this.getModelDetails(),
      createData,
    );
  }

  /**
   * getUserApplicationInterviewById
   *
   * Fetches interview by id.
   *
   * @param {string} interviewId - Interview id.
   * @returns {Promise<DbJobApplicationInterviewDto | undefined>}
   */
  async getUserApplicationInterviewById(
    interviewId: string,
  ): Promise<DbJobApplicationInterviewDto | undefined> {
    return gcpFirestoreLibrary.getDocumentById<DbJobApplicationInterviewDto>(
      this.getModelDetails(),
      interviewId,
    );
  }

  /**
   * updateUserApplicationInterviewById
   *
   * Updates interview by id.
   *
   * @param {string} interviewId - Interview id.
   * @param {Partial<DbJobApplicationInterviewDto>} updateData - Partial update payload.
   * @returns {Promise<DbJobApplicationInterviewDto | undefined>}
   */
  async updateUserApplicationInterviewById(
    interviewId: string,
    updateData: Partial<DbJobApplicationInterviewDto>,
  ): Promise<DbJobApplicationInterviewDto | undefined> {
    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbJobApplicationInterviewDto>,
      DbJobApplicationInterviewDto
    >(this.getModelDetails(), interviewId, updateData);
  }

  /**
   * getUserApplicationInterviewsByApplicationId
   *
   * Returns paginated interviews for application id.
   *
   * @param {string} applicationId - Job application id.
   * @param {JobApplicationInterviewListFilterOptions} filterOptions - Listing filters.
   * @returns {Promise<GcpFirestoreRecordListingResponseDTO<DbJobApplicationInterviewDto[]>>}
   */
  async getUserApplicationInterviewsByApplicationId(
    applicationId: string,
    filterOptions: JobApplicationInterviewListFilterOptions,
  ): Promise<GcpFirestoreRecordListingResponseDTO<DbJobApplicationInterviewDto[]>> {
    const db: Firestore = await gcpFirestoreLibrary.getFirestoreDatabase(
      this.databaseName,
    );

    let baseQuery: Query<DocumentData, DocumentData> = db
      .collection(this.collectionName)
      .where("applicationId", "==", applicationId);

    if (filterOptions.status) {
      baseQuery = baseQuery.where("status", "==", filterOptions.status);
    }

    baseQuery = baseQuery.orderBy(
      "scheduledAt",
      filterOptions.sortOrder ?? GcpFirestoreSortOrderTypeEnum.DESCENDING,
    );

    return gcpFirestoreUtilObj.paginateGcpFirestore<
      JobApplicationInterviewListFilterOptions,
      DbJobApplicationInterviewDto
    >(db, this.collectionName, baseQuery, filterOptions);
  }

  /**
   * getAllUserApplicationInterviewsByApplicationId
   *
   * Returns all interviews for application id.
   *
   * @param {string} applicationId - Job application id.
   * @returns {Promise<DbJobApplicationInterviewDto[]>}
   */
  async getAllUserApplicationInterviewsByApplicationId(
    applicationId: string,
  ): Promise<DbJobApplicationInterviewDto[]> {
    const db: Firestore = await gcpFirestoreLibrary.getFirestoreDatabase(
      this.databaseName,
    );

    const snapshot: QuerySnapshot<DocumentData, DocumentData> = await db
      .collection(this.collectionName)
      .where("applicationId", "==", applicationId)
      .get();

    return snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) =>
        doc.data() as DbJobApplicationInterviewDto,
    );
  }
}

const jobApplicationInterviewFirestoreDaoObj =
  new JobApplicationInterviewFirestoreDao();

export {
  jobApplicationInterviewFirestoreDaoObj,
  JobApplicationInterviewFirestoreDao,
};

