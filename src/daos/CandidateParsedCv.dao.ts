
// Import firestore package
import { DocumentData, Firestore, QuerySnapshot } from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreVectorPreFilterDto } from "../dtos/Common.gcp-firestore-vector.dto";
import { CandidateParsedCvEmbeddingListingFilterOptions, CandidateSearchPromptParsedResponseDto } from "../dtos/CandidateParsedCv.dto";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import libraries
import { gcpFirestoreVectorLibrary } from "../libraries/gcp-firestore-vector.library";

// Import models
import { DbCandidateParsedCvDto } from "../db/gcp-firestore-models/CandidateParsedCv.model";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CandidateParsedCvDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "candidateParsedCvs";

  getCandidateParsedCvModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getCandidateParsedCvFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async createCandidateParsedCvWithEmbedding(createData: DbCandidateParsedCvDto, embeddingText: string): Promise<DbCandidateParsedCvDto | undefined> {
    global.logger.info(`Create Candidate Parsed CV [DAO]`, {
      methodName: this.createCandidateParsedCvWithEmbedding.name,
    });

    return gcpFirestoreVectorLibrary.createDocumentWithEmbedding<DbCandidateParsedCvDto>(
      this.getCandidateParsedCvModelDetails(),
      createData,
      embeddingText
    );
  }

  async getCandidateParsedCvById(id: string): Promise<DbCandidateParsedCvDto | undefined> {
    return gcpFirestoreLibrary.getDocumentById<DbCandidateParsedCvDto>(
      this.getCandidateParsedCvModelDetails(),
      id
    );
  }

  async getCandidateParsedCvByCompIdAndCandEmail(
    companyId: string,
    candidateEmail: string
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    const db: Firestore = await this.getCandidateParsedCvFirestoreDatabase();

    return db
      .collection(this.collectionName)
      .where("companyId", "==", companyId)
      .where("email", "==", candidateEmail)
      .get();
  }

  async getAllCandidateParsedCvByEmbeddingByWithoutPagination(
    filterOptions: CandidateParsedCvEmbeddingListingFilterOptions,
    distanceThreshold: number,
    searchByPrompt: string,
    parsedPrompt: CandidateSearchPromptParsedResponseDto
  ) {
    if(!searchByPrompt) throw new BaseError("Search by prompt is required.", HttpStatusCode.BAD_REQUEST_400);

    let salaryRange = parsedPrompt.salaryRange;
    let experienceRange = parsedPrompt.experienceRange;

    let preFilters: GcpFirestoreVectorPreFilterDto[] = []

    if(salaryRange) {
      global.logger.info(`salaryRange`, salaryRange);
      if(
        salaryRange?.min
      ) {
        preFilters.push({
          field: "currentCTC",
          operator: ">=",
          value: salaryRange.min
        })
      }

      if(
        salaryRange.max
      ) {
        preFilters.push({
          field: "currentCTC",
          operator: "<=",
          value: salaryRange.max
        })
      }
    }

    if(experienceRange) {
      global.logger.info(`experienceRange`, experienceRange);
      if(
        experienceRange.min
      ) {
        preFilters.push({
          field: "relevantYOE",
          operator: ">=",
          value: experienceRange.min
        })
      }

      if(
        experienceRange.max
      ) {
        preFilters.push({
          field: "relevantYOE",
          operator: "<=",
          value: experienceRange.max
        })
      }
    }

    return gcpFirestoreVectorLibrary.getDocumentsByEmbeddingWithoutPagination(
      this.getCandidateParsedCvModelDetails(),
      searchByPrompt,
      {
        pageSize: filterOptions.pageSize,
        distanceThreshold,
        pageNumber: filterOptions.pageNumber,
        preFilters
      },
    );
  }

  async updateCandidateParsedCvById(id: string, updateData: Partial<DbCandidateParsedCvDto>): Promise<DbCandidateParsedCvDto | undefined> {
    return gcpFirestoreLibrary.updateDocumentById<Partial<DbCandidateParsedCvDto>, DbCandidateParsedCvDto>(
      this.getCandidateParsedCvModelDetails(),
      id,
      updateData
    );
  }

  async updateCandidateParsedCvWithEmbedding(
    id: string,
    updateData: Partial<DbCandidateParsedCvDto>,
    embeddingText: string
  ): Promise<DbCandidateParsedCvDto | undefined> {
    global.logger.info(`Update Candidate Parsed CV with Embedding [DAO]`, {
      methodName: this.updateCandidateParsedCvWithEmbedding.name,
    });

    return gcpFirestoreVectorLibrary.updateDocumentWithEmbedding<
      Partial<DbCandidateParsedCvDto>,
      DbCandidateParsedCvDto
    >(this.getCandidateParsedCvModelDetails(), id, updateData, embeddingText);
  }
}

const candidateParsedCvDaoObj = new CandidateParsedCvDao();
export { candidateParsedCvDaoObj, CandidateParsedCvDao };
