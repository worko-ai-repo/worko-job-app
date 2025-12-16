
// Import daos
import { centralCandidateProfileDaoObj } from "../daos/CentralCandidateProfile.dao";

// Import models
import { DbCentralCandidateProfileDto } from "../db/gcp-firestore-models/CentralCandidateProfile.model";

class CentralCandidateProfileService {
  async createCentralCandidateProfile(
    createData: DbCentralCandidateProfileDto
  ): Promise<DbCentralCandidateProfileDto | undefined> {
    global.logger.info(`Create Central Candidate Profile [Service]`, {
      methodName: this.createCentralCandidateProfile.name,
    });

    return centralCandidateProfileDaoObj.createCentralCandidateProfile(
      createData
    );
  }

  async getCentralCandidateProfileById(
    id: string // candidate email
  ): Promise<DbCentralCandidateProfileDto | undefined> {
    return centralCandidateProfileDaoObj.getCentralCandidateProfileById(id);
  }

  async updateCentralCandidateProfileById(
    id: string, // candidate email
    updateData: Partial<DbCentralCandidateProfileDto>
  ): Promise<DbCentralCandidateProfileDto | undefined> {
    return centralCandidateProfileDaoObj.updateCentralCandidateProfileById(
      id,
      updateData
    );
  }
}

const centralCandidateProfileServiceObj = new CentralCandidateProfileService();
export { centralCandidateProfileServiceObj, CentralCandidateProfileService };
