// Load dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import { userJobApplicationAuthorNoteDaoObj } from "../daos/UserJobApplicationAuthorNote.dao";

// import dtos
import {
  UserJobApplicationAuthorDbNoteDetail,
  UserJobApplicationAuthorNoteCommonUpdateDto,
  UserJobApplicationAuthorNoteCreateApiDTO,
  UserJobApplicationAuthorNoteCreateDTO,
  UserJobApplicationAuthorNoteUpdateApiDTO,
} from "../dtos/UserJobApplicationAuthorNote.dto";

// import helpers
import { getActionByUserId } from "../helpers/user.helper";

// import models
import { DbUserJobApplicationAuthorNoteDto } from "../db/models/UserJobApplicationAuthorNote.model";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import { dateHelperObj } from "../helpers/date.helper";

/**
 * UserJobApplicationAuthorNoteService
 * 
 * Service class for handling job application note operations
 */
class UserJobApplicationAuthorNoteService {
  async getNotesByJobApplicationIdAndAuthorId(
    jobApplicationId: string,
    authorId: string
  ): Promise<QueryResponse<DbUserJobApplicationAuthorNoteDto>> {
    global.logger.info(
      `Get Notes By Job Application Id And Author Id [Service]`,
      {
        methodName: this.getNotesByJobApplicationIdAndAuthorId.name,
        jobApplicationId,
        authorId,
      }
    );

    return userJobApplicationAuthorNoteDaoObj.getNotesByJobApplicationIdAndAuthorId(
      jobApplicationId,
      authorId
    );
  }

  async performCreateUserJobApplicationAuthorNoteActivities(
    noteData: UserJobApplicationAuthorNoteCreateApiDTO
  ): Promise<DbUserJobApplicationAuthorNoteDto> {
    global.logger.info(
      `Perform Create User Job Application Author Note Activities [Service]`,
      {
        methodName:
          this.performCreateUserJobApplicationAuthorNoteActivities.name,
      }
    );

    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    let finalAuthorId: string;
    if (actionByUserId) {
      finalAuthorId = actionByUserId;
    } else if (actionByCorporateUserId) {
      finalAuthorId = actionByCorporateUserId;
    } else {
      throw new BaseError(
        "Author ID not found",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const currentIsoDateString: string = dateHelperObj.getISODate();

    // iterate over each noteDetail object and attach each noteDetails object with `createdAt` as currentIsoDateString
    noteData.noteDetails.forEach(
      (noteDetail: UserJobApplicationAuthorDbNoteDetail) => {
        noteDetail.createdAt = currentIsoDateString;
      }
    );

    const noteCreateData: UserJobApplicationAuthorNoteCreateDTO = {
      ...noteData,
      authorId: finalAuthorId,
      createdByUserId: actionByUserId,
      createdByCorporateUserId: actionByCorporateUserId,
    };

    const existingNoteDetails: QueryResponse<DbUserJobApplicationAuthorNoteDto> =
      await this.getNotesByJobApplicationIdAndAuthorId(
        noteData.jobApplicationId,
        finalAuthorId
      );

    if (existingNoteDetails.count) {
      throw new BaseError(
        "Note for this job application already exists",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    return this.createUserJobApplicationAuthorNote(noteCreateData);
  }

  async createUserJobApplicationAuthorNote(
    noteCreateData: UserJobApplicationAuthorNoteCreateDTO
  ): Promise<DbUserJobApplicationAuthorNoteDto> {
    global.logger.info(`Create User Job Application Author Note [Service]`, {
      methodName: this.createUserJobApplicationAuthorNote.name,
      noteCreateData,
    });

    return userJobApplicationAuthorNoteDaoObj.createUserJobApplicationAuthorNote(
      noteCreateData
    );
  }

  async getUserJobApplicationAuthorNote(
    jobApplicationId: string,
    authorId: string,
    dynamodbNoteItemId: string
  ): Promise<QueryResponse<DbUserJobApplicationAuthorNoteDto>> {
    global.logger.info(`Get User Job Application Author Note [Service]`, {
      methodName: this.getUserJobApplicationAuthorNote.name,
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
    });

    return userJobApplicationAuthorNoteDaoObj.getUserJobApplicationAuthorNote(
      jobApplicationId,
      authorId,
      dynamodbNoteItemId
    );
  }

  async updateCommonUserJobApplicationAuthorNote(
    jobApplicationId: string,
    authorId: string,
    dynamodbNoteItemId: string,
    noteUpdateData: Partial<UserJobApplicationAuthorNoteCommonUpdateDto>
  ): Promise<DbUserJobApplicationAuthorNoteDto> {

    global.logger.info(`Update Common User Job Application Author Note [Service]`, {
      methodName: this.updateCommonUserJobApplicationAuthorNote.name,
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
      noteUpdateData,
    })

    return userJobApplicationAuthorNoteDaoObj.updateCommonUserJobApplicationAuthorNote(
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
      noteUpdateData
    )
  }

  async performUpdateUserJobApplicationAuthorNoteActivities(
    jobApplicationId: string,
    dynamodbNoteItemId: string,
    noteUpdateData: UserJobApplicationAuthorNoteUpdateApiDTO,
  ): Promise<DbUserJobApplicationAuthorNoteDto> {
    global.logger.info(
      `Perform Update User Job Application Author Note Activities [Service]`,
      {
        methodName:
          this.performUpdateUserJobApplicationAuthorNoteActivities.name,
        noteUpdateData,
      }
    );
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    let authorId: string;
    if (actionByUserId) {
      authorId = actionByUserId;
    } else if (actionByCorporateUserId) {
      authorId = actionByCorporateUserId;
    } else {
      throw new BaseError(
        "Author ID not found",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const existingNoteDetails: QueryResponse<DbUserJobApplicationAuthorNoteDto> =
      await this.getUserJobApplicationAuthorNote(
        jobApplicationId,
        authorId,
        dynamodbNoteItemId
      );
    if(!existingNoteDetails.count) {
      throw new BaseError(
        "Note for this job application does not exist",
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const existingNoteData: DbUserJobApplicationAuthorNoteDto = existingNoteDetails[0];

    // Not authorized to update this note
    if(existingNoteData.authorId !== authorId) {
      throw new BaseError(
        "Not authorized to update this note",
        HttpStatusCode.FORBIDDEN_403
      );
    }


    const currentIsoDateString: string = dateHelperObj.getISODate();

    // iterate over each noteDetail object and attach each noteDetails object with `createdAt` as currentIsoDateString
    noteUpdateData.noteDetails.forEach(
      (noteDetail: UserJobApplicationAuthorDbNoteDetail) => {
        noteDetail.updatedAt = currentIsoDateString;
      }
    );

    const noteUpdateDataFinal: Partial<UserJobApplicationAuthorNoteCommonUpdateDto> = {
      ...noteUpdateData,
      updatedByUserId: actionByUserId,
      updatedByCorporateUserId: actionByCorporateUserId,
    };

    return this.updateCommonUserJobApplicationAuthorNote(
      jobApplicationId,
      authorId,
      dynamodbNoteItemId,
      noteUpdateDataFinal,
    )
  }
}

export const userJobApplicationAuthorNoteServiceObj = new UserJobApplicationAuthorNoteService();
export default UserJobApplicationAuthorNoteService;