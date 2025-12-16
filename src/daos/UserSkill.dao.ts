// Import the dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

//Load the base dao
import BaseDao from "./Base.dao";

//Load the local model
import { DbUserSkillDto, UserSkillModel } from "../db/models/UserSkill.model";

// UserSkillDao class implementing the BaseDao interface
class UserSkillDao implements BaseDao {
  modelName = "UserSkill";
  partitianKey = "USR#EML#{primaryEmail}"; // Partition key structure for user emails
  sortKeys = { SK_ID: "SKILL#" }; // Sort key structure using unique IDs

  async getUserSkillsByEmail(email: string): Promise<QueryResponse<DbUserSkillDto>> {
    logger.info("Fetching user Skill by email [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    return UserSkillModel.query("PK").eq(PK).where("SK").eq(this.sortKeys.SK_ID).exec();
  }
}

const userSkillDao = new UserSkillDao();

export default userSkillDao;
