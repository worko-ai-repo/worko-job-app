
// Import firestore package
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";

// Import daos
import { candidateParsedCvDaoObj } from "../daos/CandidateParsedCv.dao";

// Import dtos
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";
import { CandidateParsedCvEmbeddingListingFilterOptions } from "../dtos/CandidateParsedCv.dto";

// Import models
import { DbCandidateParsedCvDto } from "../db/gcp-firestore-models/CandidateParsedCv.model";
import { DbCandidateJobAlertDto } from "../db/gcp-firestore-models/CandidateJobAlert.model";

// Import services
import { candidateJobRecommendationServiceObj } from "./CandidateJobRecommendation.service";
import { candidateJobAlertServiceObj } from "./CandidateJobAlert.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CandidateParsedCvService {
  /**
   * Formats a list of skills into a string with the given label.
   * If the skills list is empty, an empty string is returned.
   * @param {object[]} skills - List of skills objects with skillName and years properties.
   * @param {string} label - Label to be prepended to the formatted skills string.
   * @returns {string} - Formatted string with the given label and skills list.
   */
  private formatSkillsList(skills: { skillName: string; years: number }[], label: string): string {
    if (!skills?.length) return "";
    const skillsText: string = skills.map(skill => `${skill.skillName} (${skill.years} years)`).join(", ");
    return `${label}: ${skillsText}`;
  }

  /**
   * Formats a list of strings into a string with the given label.
   * If the items list is empty, an empty string is returned.
   * @param {string[]} items - List of strings to be formatted.
   * @param {string} label - Label to be prepended to the formatted items string.
   * @returns {string} - Formatted string with the given label and items list.
   */
  private formatStringArray(items: string[], label: string): string {
    if (!items?.length) return "";
    return `${label}: ${items.join(", ")}`;
  }

  private createSearchOptimizedCandidateParsedCvEmbeddingText(createData: DbCandidateParsedCvDto): string {
    const embeddingParts: string[] = [];

    if (createData.companyId) {
      embeddingParts.push(`Company ID: ${createData.companyId}`);
    }

    if (createData.currentCompany) {
      embeddingParts.push(`Current Company: ${createData.currentCompany}`);
    }

    if (createData.currentDesignation) {
      embeddingParts.push(`Current Designation: ${createData.currentDesignation}`);
    }

    if (createData.totalYOE) {
      embeddingParts.push(`Total Experience: ${createData.totalYOE} years`);
    }

    if (createData.relevantYOE) {
      embeddingParts.push(`Relevant Experience: ${createData.relevantYOE} years`);
    }

    if (createData.currentCTC) {
      embeddingParts.push(`Current CTC: ${createData.currentCTC} LPA`);
    }

    if (createData.expectedCTC) {
      embeddingParts.push(`Expected CTC: ${createData.expectedCTC} LPA`);
    }

    if (createData.noticePeriod) {
      embeddingParts.push(`Notice Period: ${createData.noticePeriod} days`);
    }

    if (createData.isNoticePeriodNegotiable) {
      const negotiable: "Yes" | "No" = createData.isNoticePeriodNegotiable ? "Yes" : "No";
      embeddingParts.push(`Notice Period Negotiable: ${negotiable}`);
    }

    if (createData.location) {
      embeddingParts.push(`Current Location: ${createData.location}`);
    }

    if (createData.readyToRelocate) {
      const relocate: "Yes" | "No" = createData.readyToRelocate ? "Yes" : "No";
      embeddingParts.push(`Ready to Relocate: ${relocate}`);
    }

    if (createData.coreSkills) {
      const coreSkillsText: string = this.formatSkillsList(createData.coreSkills, "Core Skills");
      if (coreSkillsText) {
        embeddingParts.push(coreSkillsText);
      }
    }

    if (createData.technicalSkills) {
      const techSkillsText: string = this.formatSkillsList(createData.technicalSkills, "Technical Skills");
      if (techSkillsText) {
        embeddingParts.push(techSkillsText);
      }
    }

    if (createData.userPreferredDepartments) {
      const deptText: string = this.formatStringArray(createData.userPreferredDepartments, "Preferred Departments");
      if (deptText) {
        embeddingParts.push(deptText);
      }
    }

    if (createData.userPreferredIndustries) {
      const industryText: string = this.formatStringArray(createData.userPreferredIndustries, "Preferred Industries");
      if (industryText) {
        embeddingParts.push(industryText);
      }
    }

    if (createData.userPreferredRoles) {
      const rolesText: string = this.formatStringArray(createData.userPreferredRoles, "Preferred Roles");
      if (rolesText) {
        embeddingParts.push(rolesText);
      }
    }

    if (createData.userPreferredlocations) {
      const locationsText: string = this.formatStringArray(createData.userPreferredlocations, "Preferred Locations");
      if (locationsText) {
        embeddingParts.push(locationsText);
      }
    }

    return embeddingParts.join(" | ");
  }

  async createCandidateParsedCvWithEmbedding(
    createData: DbCandidateParsedCvDto
  ): Promise<DbCandidateParsedCvDto | undefined> {
    global.logger.info(`Create Candidate Parsed CV [Service]`, {
      methodName: this.createCandidateParsedCvWithEmbedding.name,
    });

    return candidateParsedCvDaoObj.createCandidateParsedCvWithEmbedding(
      createData,
      this.createSearchOptimizedCandidateParsedCvEmbeddingText(createData)
    );
  }

  async getCandidateParsedCvById(id: string): Promise<DbCandidateParsedCvDto | undefined> {
    return candidateParsedCvDaoObj.getCandidateParsedCvById(id);
  }

  async getCandidateParsedCvByCompIdAndCandEmail(
    companyId: string,
    candidateEmail: string
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    return candidateParsedCvDaoObj.getCandidateParsedCvByCompIdAndCandEmail(
      companyId,
      candidateEmail
    );
  }

  async getAllCandidateParsedCvByEmbeddingByWithoutPagination(
    filterOptions: CandidateParsedCvEmbeddingListingFilterOptions,
    distanceThreshold: number,
  ): Promise<
    GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]>
  > {
    return candidateParsedCvDaoObj.getAllCandidateParsedCvByEmbeddingByWithoutPagination(
      filterOptions,
      distanceThreshold,
      filterOptions.searchByJobDescription
    );
  }

  async updateCandidateParsedCvById(id: string, updateData: Partial<DbCandidateParsedCvDto>): Promise<DbCandidateParsedCvDto | undefined> {
    return candidateParsedCvDaoObj.updateCandidateParsedCvById(id, updateData);
  }

  async updateCandidateParsedCvWithEmbedding(
    id: string,
    updateData: Partial<DbCandidateParsedCvDto>
  ): Promise<DbCandidateParsedCvDto | undefined> {
    global.logger.info(`Update Candidate Parsed CV with Embedding [Service]`, {
      methodName: this.updateCandidateParsedCvWithEmbedding.name,
    });

    const existingData: DbCandidateParsedCvDto | undefined = await candidateParsedCvDaoObj.getCandidateParsedCvById(id);
    if (!existingData) {
      throw new BaseError(
        "Candidate Parsed CV does not exist",
        HttpStatusCode.NOT_FOUND_404
      )
    };

    const mergedData: DbCandidateParsedCvDto = { ...existingData, ...updateData };
    const embeddingText: string = this.createSearchOptimizedCandidateParsedCvEmbeddingText(mergedData);

    return candidateParsedCvDaoObj.updateCandidateParsedCvWithEmbedding(id, updateData, embeddingText);
  }

  async processNewCompanyJobCandMatchCandidateParsedCv(
    jobId: string,
    companyId: string,
    jobDescription: string,
    jobTitle: string,
    companyName: string
  ): Promise<(boolean | boolean[])[][]> {
    // Find matching candidates (embedding 0-0.4)
    const matchedCandidates: GcpFirestoreRecordListingResponseDTO<QueryDocumentSnapshot<DocumentData, DocumentData>[]> = 
      await this.getAllCandidateParsedCvByEmbeddingByWithoutPagination({ 
        searchByJobDescription: jobDescription,
        pageNumber: 1,
        pageSize: 1000,
      }, 0.4);
    if(!matchedCandidates.data.length) return [

    ];

    // Deduplicate by email - keep best match (lowest distance)
    // We may get same candidate multiple times because same candidate may present in multiple corporate companies.
    const uniqueCandidatesMap = new Map<string, {
      candidate: DbCandidateParsedCvDto;
      distance: number;
    }>();

    for (const doc of matchedCandidates.data) {
      const distance: number = doc.data().embeddingVectorDistance;
      const candidate = doc.data() as DbCandidateParsedCvDto;

      const candidateEmail: string = candidate.email?.toLowerCase();
      if (!candidateEmail) {
        global.logger.error(`Candidate Parsed CV has no email`, { candidate });
        continue;
      }
      
      const existing = uniqueCandidatesMap.get(candidateEmail);
      
      // Keep the one with lowest distance (best match)
      if (!existing || distance < existing.distance) {
        uniqueCandidatesMap.set(candidateEmail, { candidate, distance });
      }
    }

    const candJobMatches: Promise<(boolean | boolean[])[]>[] = [
      candidateJobRecommendationServiceObj.performCreateBulkCandidateJobRecommendationFromCandParsedCv(jobId, companyId, jobTitle, companyName, uniqueCandidatesMap),
      candidateJobAlertServiceObj.performCreateOrUpdateBulkCandidateJobAlertFromCandParsedCv(uniqueCandidatesMap)
    ];

    return Promise.all(candJobMatches);
  }
}

const candidateParsedCvServiceObj = new CandidateParsedCvService();
export { candidateParsedCvServiceObj, CandidateParsedCvService };
