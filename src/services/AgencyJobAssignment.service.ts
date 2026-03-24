
// Import dtos
import { agencyJobAssignmentDaoObj } from "../daos/AgencyJobAssignment.dao";

// Import models
import { DbAgencyJobAssignmentDto } from "../db/gcp-firestore-models/AgencyJobAssignment.model";

class AgencyJobAssignmentService {
  async updateAgencyJobAssignmentById(
    id: string,
    updateData: Partial<DbAgencyJobAssignmentDto>,
  ): Promise<DbAgencyJobAssignmentDto | undefined> {
    return agencyJobAssignmentDaoObj.updateAgencyJobAssignmentById(
      id,
      updateData,
    );
  }
}

const agencyJobAssignmentServiceObj = new AgencyJobAssignmentService();
export { agencyJobAssignmentServiceObj, AgencyJobAssignmentService };
