// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import BaseDao from "./Base.dao";

// Import models
import {
  DbUserPreferenceDto,
  UserPreferenceModel,
} from "../db/models/UserPreference.model";

// Import services
import UlidService from "../services/Ulid.service";

class UserPreferenceDao implements BaseDao {
  modelName: string = "UserPreference";
  partitianKey: string = "USR#EML#{primaryEmail}";
  sortKeys: {
    SK_ID: string;
  } = {
    SK_ID: "PREF#",
  };

  preparePKAndSKForQuery(primaryEmail: string): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{primaryEmail}": primaryEmail,
      }),
      SK: this.sortKeys.SK_ID,
    };
  }

  async getUserPreferenceByEmail(
    email: string
  ): Promise<QueryResponse<DbUserPreferenceDto>> {
    global.logger.info("Get user preference [DAO]");
    const { PK, SK } = this.preparePKAndSKForQuery(email);
    return UserPreferenceModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }
}

const userPreferenceDaoObj: UserPreferenceDao = new UserPreferenceDao();
export { userPreferenceDaoObj, UserPreferenceDao };
