
// Import daos
import { agencyUserSubmissionDaoObj } from "../daos/AgencyUserSubmission.dao";

// Import models
import { DbAgencyUserSubmissionDto } from "../db/gcp-firestore-models/AgencyUserSubmission.model";

class AgencyUserSubmissionService {
  async getAgencyUserSubmissionById(
    id: string
  ): Promise<DbAgencyUserSubmissionDto | undefined> {
    return agencyUserSubmissionDaoObj.getAgencyUserSubmissionById(id);
  }

  async updateAgencyUserSubmissionById(
    id: string,
    updateData: Partial<DbAgencyUserSubmissionDto>
  ): Promise<DbAgencyUserSubmissionDto | undefined> {
    return agencyUserSubmissionDaoObj.updateAgencyUserSubmissionById(
      id,
      updateData
    );
  }
}

const agencyUserSubmissionServiceObj = new AgencyUserSubmissionService();
export { agencyUserSubmissionServiceObj, AgencyUserSubmissionService };
