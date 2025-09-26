// Load the npm packages
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import dtos
import { UserJobApplicationAuthorNoteCommonUpdateDto, UserJobApplicationAuthorNoteCreateDTO } from "../dtos/UserJobApplicationAuthorNote.dto";

// import models
import { DbUserJobApplicationAuthorNoteDto, UserJobApplicationAuthorNoteModel } from "../db/models/UserJobApplicationAuthorNote.model";
import UlidService from "../services/Ulid.service";


class UserJobApplicationAuthorNoteDao {
  /**
   * "AUTHOR" can be `corporate-admin/recruiter` or `worko-admin` as of now
   * "authorId" can be `id` attribute of  `CorporateUser.model.ts`
   * "authorId" can be `id` attribute of  `UserDetail.model.ts`
   */
  modelName = "UserJobApplicationAuthorNote";
  partitianKey = "JOB#APP#ID#{jobApplicationId}";
  sortKeys = { SK_INIT: "NOTE#AUTHOR#{authorId}#ID#{id}" };

  preparePKAndSKForQuery(
    jobApplicationId: string,
    authorId: string,
    itemId: string
  ): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey.strtr({
        "{jobApplicationId}": jobApplicationId,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{authorId}": authorId,
        "{id}": itemId,
      }),
    };
  }

  async createUserJobApplicationAuthorNote(
    noteCreateData: UserJobApplicationAuthorNoteCreateDTO
  ): Promise<DbUserJobApplicationAuthorNoteDto> {
    global.logger.info(`Create User Job Application Author Note [Dao]`, {
      methodName: this.createUserJobApplicationAuthorNote.name,
      noteCreateData,
    });

    const dynamodbItemId: string = UlidService.getUlidId();

    const { PK, SK } = this.preparePKAndSKForQuery(
      noteCreateData.jobApplicationId,
      noteCreateData.authorId,
      dynamodbItemId
    );

    return UserJobApplicationAuthorNoteModel.create({
      ...noteCreateData,
      id: dynamodbItemId,
      PK,
      SK,
    });
  }

  async getNotesByJobApplicationIdAndAuthorId(
    jobApplicationId: string,
    authorId: string
  ): Promise<QueryResponse<DbUserJobApplicationAuthorNoteDto>> {
    global.logger.info(`Get Notes By Job Application Id And Author Id [Dao]`, {
      methodName: this.getNotesByJobApplicationIdAndAuthorId.name,
      jobApplicationId,
      authorId,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      jobApplicationId,
      authorId,
      ""
    );

    return UserJobApplicationAuthorNoteModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK)
      .exec();
  }

  async getUserJobApplicationAuthorNote(
    jobApplicationId: string,
    authorId: string,
    dynamodbNoteItemId: string
  ): Promise<QueryResponse<DbUserJobApplicationAuthorNoteDto>> {
    global.logger.info(`Get User Job Application Author Note [Dao]`, {
      methodName: this.getUserJobApplicationAuthorNote.name,
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      jobApplicationId,
      authorId,
      dynamodbNoteItemId
    );

    return UserJobApplicationAuthorNoteModel.query("PK")
      .eq(PK)
      .where("SK")
      .eq(SK)
      .exec();
  }

  async updateCommonUserJobApplicationAuthorNote(
    jobApplicationId: string,
    authorId: string,
    dynamodbNoteItemId: string,
    noteUpdateData: Partial<UserJobApplicationAuthorNoteCommonUpdateDto>
  ): Promise<DbUserJobApplicationAuthorNoteDto> {
    global.logger.info(`Update Common User Job Application Author Note [Dao]`, {
      methodName: this.updateCommonUserJobApplicationAuthorNote.name,
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
      noteUpdateData,
    });

    return UserJobApplicationAuthorNoteModel.update(
      this.preparePKAndSKForQuery(
        jobApplicationId,
        authorId,
        dynamodbNoteItemId
      ),
      noteUpdateData
    );
  }
}

const userJobApplicationAuthorNoteDaoObj: UserJobApplicationAuthorNoteDao = new UserJobApplicationAuthorNoteDao();
export {
  userJobApplicationAuthorNoteDaoObj,
  UserJobApplicationAuthorNoteDao
}