// Import firestore package
import {
  DocumentData,
  FieldPath,
  Filter,
  Firestore,
  Query,
  QuerySnapshot,
} from "@google-cloud/firestore";

// Import configs
import { gcpFirestoreLibrary } from "../configs/gcp-sdk.config";

// Import daos
import BaseDao from "./BaseGcpFirestore.dao";

// Import dtos
import {
  AgencyUserInviteCreateApiDto,
  AgencyUserInviteCreateDto,
  AgencyUserInviteDbPhoneNumberDto,
  AgencyUserInviteListingFilterOptions,
} from "../dtos/AgencyUserInvite.dto";
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbAgencyUserInviteDto } from "../db/gcp-firestore-models/AgencyUserInvite.model";

// Import services
import UlidService from "../services/Ulid.service";

// Import utils
import { gcpFirestoreUtilObj } from "../utils/gcp-firestore.util";

class AgencyUserInviteDao implements BaseDao {
  databaseName: string = `worko-corp-db-${process.env.APP_SLS_STAGE}`;
  collectionName: string = "agencyUserInvites";

  getAgencyUserInviteModelDetails(): GcpFirestoreInteractionDto {
    return {
      databaseName: this.databaseName,
      collectionName: this.collectionName,
    };
  }

  getAgencyUserInviteFirestoreDatabase(): Promise<Firestore> {
    return gcpFirestoreLibrary.getFirestoreDatabase(this.databaseName);
  }

  async getAgencyUserInviteById(
    id: string,
  ): Promise<DbAgencyUserInviteDto | undefined> {
    global.logger.info("Get Agency User Invite [DAO]", {
      methodName: this.getAgencyUserInviteById.name,
      id,
    });

    return gcpFirestoreLibrary.getDocumentById<DbAgencyUserInviteDto>(
      this.getAgencyUserInviteModelDetails(),
      id,
    );
  }

  async updateAgencyUserInviteById(
    id: string,
    data: Partial<DbAgencyUserInviteDto>,
  ): Promise<DbAgencyUserInviteDto | undefined> {
    global.logger.info("Update Agency User Invite By Id [DAO]", {
      methodName: this.updateAgencyUserInviteById.name,
      id,
      data,
    });

    return gcpFirestoreLibrary.updateDocumentById<
      Partial<DbAgencyUserInviteDto>,
      DbAgencyUserInviteDto
    >(this.getAgencyUserInviteModelDetails(), id, data);
  }
}

const agencyUserInviteDaoObj = new AgencyUserInviteDao();
export { agencyUserInviteDaoObj, AgencyUserInviteDao };
