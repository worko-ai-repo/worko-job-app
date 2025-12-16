// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { userPreferenceDaoObj } from "../daos/UserPreference.dao";

// Import models
import { DbUserPreferenceDto } from "../db/models/UserPreference.model";

class UserPreferenceService {
  async getUserPreferenceByEmail(
    email: string
  ): Promise<QueryResponse<DbUserPreferenceDto>> {
    global.logger.info("Get user preference [Service]");
    return userPreferenceDaoObj.getUserPreferenceByEmail(email);
  }
}

const userPreferenceServiceObj: UserPreferenceService =
  new UserPreferenceService();
export { userPreferenceServiceObj, UserPreferenceService };
