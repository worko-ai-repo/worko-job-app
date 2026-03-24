

// Import daos
import { agencyUserInviteDaoObj } from "../daos/AgencyUserInvite.dao";

// Import models
import { DbAgencyUserInviteDto } from "../db/gcp-firestore-models/AgencyUserInvite.model";

class AgencyUserInviteService {
  async getAgencyUserInviteById(
    id: string,
  ): Promise<DbAgencyUserInviteDto | undefined> {
    global.logger.info(`Get Agency User Invite [Service]`, {
      methodName: this.getAgencyUserInviteById.name,
    });

    return agencyUserInviteDaoObj.getAgencyUserInviteById(id);
  }

  async updateAgencyUserInviteById(
    id: string,
    data: Partial<DbAgencyUserInviteDto>,
  ): Promise<DbAgencyUserInviteDto | undefined> {
    global.logger.info("Update Agency User Invite By Id [Service]");

    return agencyUserInviteDaoObj.updateAgencyUserInviteById(id, data);
  }
}

const agencyUserInviteServiceObj = new AgencyUserInviteService();
export { agencyUserInviteServiceObj, AgencyUserInviteService };
