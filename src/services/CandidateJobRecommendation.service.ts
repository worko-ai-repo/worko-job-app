
// Import daos
import { candidateJobRecommendationDaoObj } from "../daos/CandidateJobRecommendation.dao";

// Import dtos
import { CandidateJobRecommendationListingFilterOptions } from "../dtos/CandidateJobRecommendation.dto";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbCandidateJobRecommendationDto } from "../db/gcp-firestore-models/CandidateJobRecommendation.model";
import { DbCandidateParsedCvDto } from "../db/gcp-firestore-models/CandidateParsedCv.model";

// Import services
import UlidService from "./Ulid.service";

class CandidateJobRecommendationService {
  async performCreateBulkCandidateJobRecommendationFromCandParsedCv(
    jobId: string,
    companyId: string,
    jobTitle: string,
    companyName: string,
    mapCandParsed: Map<
      string,
      {
        candidate: DbCandidateParsedCvDto;
        distance: number;
      }
    >,
  ): Promise<boolean[]> {
    const recommendations: DbCandidateJobRecommendationDto[] = [];
    const date: string = dateHelperObj.getISODate();
    // Build recommendation documents
    for (const [email, { candidate, distance }] of mapCandParsed) {
      const docId: string = UlidService.getUlidId();
      
      recommendations.push({
        id: docId,
        candidateEmail: email.toLowerCase(),
        jobId,
        companyId,
        jobTitle: jobTitle.toLowerCase(),
        companyName: companyName.toUpperCase(),
        embeddingVectorDistance: distance,
        includedInEmailCount: 0,
        createdAt: date,
        updatedAt: date,
        isJobPublished: true,
      });
    }

    // Batch insert in chunks of 300
    const batchSize: number = 300;
    const allBatchesPromises: Promise<boolean>[] = [];
    for (let i = 0; i < recommendations.length; i += batchSize) {
      const batch: DbCandidateJobRecommendationDto[] = recommendations.slice(i, i + batchSize);
      allBatchesPromises.push(this.createBulkCandidateJobRecommendation(batch));
    }

    return Promise.all(allBatchesPromises);
  }

  async createBulkCandidateJobRecommendation(
    bulkData: DbCandidateJobRecommendationDto[],
  ): Promise<boolean> {
    return candidateJobRecommendationDaoObj.createBulkCandidateJobRecommendation(
      bulkData,
    );
  }

  async getAllCandidateJobRecommendationByFilterOptions(filterOptions: CandidateJobRecommendationListingFilterOptions) {
    return candidateJobRecommendationDaoObj.getAllCandidateJobRecommendationByFilterOptions(filterOptions);
  }
  async updateBulkCandidateJobRecommendationByIdsWithDifferentData(
    data: { id: string; updateData: Partial<DbCandidateJobRecommendationDto> }[],
  ): Promise<boolean> {
    return candidateJobRecommendationDaoObj.updateBulkCandidateJobRecommendationByIdsWithDifferentData(data);
  }
}

const candidateJobRecommendationServiceObj =
  new CandidateJobRecommendationService();
export {
  candidateJobRecommendationServiceObj,
  CandidateJobRecommendationService,
};

