// Load the local daos
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import userSkillDao from "../daos/UserSkill.dao";

// Import models
import { DbUserSkillDto } from "../db/models/UserSkill.model";

class UserSkillService {

  async getUserSkillsByEmail(
    email: string
  ): Promise<QueryResponse<DbUserSkillDto>> {
    // logger
    global.logger.info("Fetching user Skill by email [UserSkillService]", {
      filePath: __filename,
      methodName: this.getUserSkillsByEmail.name,
      email,
    });

    return userSkillDao.getUserSkillsByEmail(email);
  }
}

const userSkillServiceObj = new UserSkillService();

export {
  userSkillServiceObj,
  UserSkillService
};
