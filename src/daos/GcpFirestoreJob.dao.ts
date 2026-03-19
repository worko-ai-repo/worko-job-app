
// Import firestore package
import { DocumentData, Firestore, Query, QueryDocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";
import { JobListingFilterOptions } from "../dtos/Job.dto";

// Import enums
import { JobDashboardEnum, JobStatusEnum } from "../enums/Job.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import utils
import { gcpFirestoreUtilObj } from "../utils/gcp-firestore.util";

class GcpFirestoreJobDao implements BaseDao {
  databaseName: string = `worko-jobs-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "workoJobs";

  getGcpFirestoreJobModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getGcpFirestoreJobDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createJob(createData: DbGcpFirestoreJobDto): Promise<DbGcpFirestoreJobDto | undefined> {
    return gcpFirestoreLibrary.createDocument<DbGcpFirestoreJobDto>(this.getGcpFirestoreJobModelDetails(), createData);
  }

  async createBulkJobs(bulkJobData: DbGcpFirestoreJobDto[]): Promise<boolean> {
    return gcpFirestoreLibrary.bulkCreateDocument<DbGcpFirestoreJobDto>(this.getGcpFirestoreJobModelDetails(), bulkJobData);
  }

  async getJobById(id: string): Promise<DbGcpFirestoreJobDto | undefined> {
    return gcpFirestoreLibrary.getDocumentById<DbGcpFirestoreJobDto>(this.getGcpFirestoreJobModelDetails(), id);
  }

  async getJobsByIds(ids: string[]): Promise<DbGcpFirestoreJobDto[]> {
    return gcpFirestoreLibrary.getAllDocumentsByIdsWithoutPagination<DbGcpFirestoreJobDto>(this.getGcpFirestoreJobModelDetails(), ids);
  }

  async getAllJobsByFilterOptions(jobListingFilterRequest: JobListingFilterOptions): Promise<GcpFirestoreRecordListingResponseDTO<DbGcpFirestoreJobDto[]>> {
    const db: Firestore = await this.getGcpFirestoreJobDatabase();
    let baseQuery: Query<DocumentData, DocumentData> = db.collection(
      this.collectionName
    );

    const { 
      status,
      sortOrder,
      dashboard,
      userRole,
      corporateRecruiterUserId,
      companyId,
      searchText,
      toDate
    } = jobListingFilterRequest;

    // 1. EQUALITY FILTERS FIRST
    if (companyId) {
      baseQuery = baseQuery.where("companyId", "==", companyId);
    }

    if (searchText) {
      baseQuery = baseQuery.where("jobTitle", "==", searchText.toLowerCase());
    }

    if (status) {
      baseQuery = baseQuery.where("status", "==", status);
    }

    // 2. INEQUALITY FILTERS & MANDATORY ORDERING
    // Rule: If using '!=', you MUST orderBy that field before any other field.
    if (dashboard === JobDashboardEnum.CORPORATE && userRole) {
      if (userRole === CorporateUserTypeEnum.CORPORATE_RECRUITER && corporateRecruiterUserId) {
        // Equality case: No special orderBy required here
        baseQuery = baseQuery.where("createdByCorporateUserId", "==", corporateRecruiterUserId);
      } else if (userRole === CorporateUserTypeEnum.CORPORATE_ADMIN) {
        // Inequality case: MUST orderBy createdByCorporateUserId
        baseQuery = baseQuery
          .where("createdByCorporateUserId", "!=", "")
          .orderBy("createdByCorporateUserId", GcpFirestoreSortOrderTypeEnum.DESCENDING); 
      }
    } else if (dashboard === JobDashboardEnum.ADMIN || dashboard === JobDashboardEnum.USER) {
      // Inequality case: MUST orderBy companyId
      baseQuery = baseQuery
        .where("companyId", "!=", "")
        .orderBy("companyId", GcpFirestoreSortOrderTypeEnum.DESCENDING);
    }

    if(toDate) {
      baseQuery = baseQuery.where("createdAt", "<=", toDate)
                         .orderBy("createdAt", GcpFirestoreSortOrderTypeEnum.DESCENDING);
    }

    // 3. FINAL SORTING
    // If an inequality was used above, this becomes the SECOND sort field in the index.
    if (sortOrder) {
      baseQuery = baseQuery.orderBy("createdAt", sortOrder);
    }

    return gcpFirestoreUtilObj.paginateGcpFirestore<
      JobListingFilterOptions,
      DbGcpFirestoreJobDto
    >(db, this.collectionName, baseQuery, jobListingFilterRequest);
  }

  async getAllOldExternalJobs(deleteOlderThanDays: number, sourcedFrom: JobSourcedFromEnum): Promise<string[]> {
    const db: Firestore = await this.getGcpFirestoreJobDatabase();
    const cutoffDate: string = dateHelperObj.getPastISODate(deleteOlderThanDays);
    
    const query: Query<DocumentData, DocumentData> = db.collection(this.collectionName)
      .where("sourcedFrom", "==", sourcedFrom)
      .where("createdAt", "<", cutoffDate)
      .where("externalJobId", "!=", "")
      .orderBy("externalJobId", GcpFirestoreSortOrderTypeEnum.DESCENDING);
    
    const snapshot: QuerySnapshot<DocumentData, DocumentData> = await gcpFirestoreLibrary.getAllDocumentsWithoutPagination<DbGcpFirestoreJobDto>(
      this.getGcpFirestoreJobModelDetails(),
      query
    );

    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.id);
  }

  async updateJobById(id: string, updateData: Partial<DbGcpFirestoreJobDto>): Promise<DbGcpFirestoreJobDto | undefined> {
    if(updateData?.status) {
      updateData.isDeleted = updateData.status === JobStatusEnum.CLOSED;
    }
    updateData.updatedAt = dateHelperObj.getISODate();
    return gcpFirestoreLibrary.updateDocumentById<Partial<DbGcpFirestoreJobDto>,DbGcpFirestoreJobDto>(this.getGcpFirestoreJobModelDetails(), id, updateData);
  }

  async deleteJobsByIds(ids: string[]): Promise<boolean> {
    return gcpFirestoreLibrary.bulkDeleteDocumentByIds(this.getGcpFirestoreJobModelDetails(), ids);
  }
}

const gcpFirestoreJobDaoObj: GcpFirestoreJobDao = new GcpFirestoreJobDao();
export {
  gcpFirestoreJobDaoObj,
  GcpFirestoreJobDao
};