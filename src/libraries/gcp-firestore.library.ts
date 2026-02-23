// Import firestore package
import {
  Firestore,
  Settings,
  DocumentData,
  WriteResult,
  DocumentSnapshot,
  WriteBatch,
  DocumentReference,
  QuerySnapshot,
  QueryDocumentSnapshot,
  Query,
  SetOptions,
} from "@google-cloud/firestore";

// Import sdk configs
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";

// Import dtos
import { GcpFirestoreInteractionDto } from "../dtos/Common.dto";
import { GcpFirestoreSecretResponseDto } from "../dtos/Common.gcp-firestore.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * Firestore overview
 * @see https://docs.cloud.google.com/firestore/native/docs/overview
 */
class GcpFirestoreLibrary {
  constructor() {
    if (
      !process.env.APP_GCP_PROJECT_ID ||
      !process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE
    ) {
      global.logger.error(
        `PROJECT_ID or AWS_SECRETS_MANAGER is not defined in .env file.`,
        {
          projectId: process.env.APP_GCP_PROJECT_ID,
          awsSecretsManager: process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE,
        },
      );
      throw new BaseError(
        "PROJECT_ID or AWS_SECRETS_MANAGER is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500,
      );
    }
  }

  async initFirestoreArguments(databaseId: string): Promise<Settings> {
    const credentials: GcpFirestoreSecretResponseDto =
      await awsClientSecretsManagerLibrary.getParsedSecret<GcpFirestoreSecretResponseDto>(
        process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE as string,
      );

    const settings: Settings = {
      databaseId: databaseId,
      ignoreUndefinedProperties: true,
      projectId: process.env.APP_GCP_PROJECT_ID,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    };

    /**
     * @todo: Implement emulator if running locally
     */

    return settings;
  }

  async getFirestoreDatabase(databaseId: string): Promise<Firestore> {
    const settings: Settings = await this.initFirestoreArguments(databaseId);
    return new Firestore(settings);
  }

  async createDocument<DbEntityDto extends DocumentData>(
    commonDbDetails: GcpFirestoreInteractionDto,
    data: DbEntityDto,
  ): Promise<DbEntityDto | undefined> {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    /*
    Sample response:
    {
      "_writeTime": {
          "_seconds": 1761890072,
          "_nanoseconds": 924397000
      }
    }
    */
    const response: WriteResult = await db
      .collection(commonDbDetails.collectionName)
      .doc(data.id)
      .set({ ...data });

    if (!response) {
      return undefined;
    }

    return data;
  }

  /**
   * Batched writes
   * @see https://docs.cloud.google.com/firestore/native/docs/manage-data/transactions#batched-writes
   */
  async bulkCreateDocument<DbEntityDto extends DocumentData>(
    commonDbDetails: GcpFirestoreInteractionDto,
    documents: DbEntityDto[],
    options?: SetOptions,
  ) {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    // Get a new write batch
    const batch: WriteBatch = db.batch();

    documents.forEach((doc: DbEntityDto) => {
      const docRef: DocumentReference<DocumentData, DocumentData> = db
        .collection(commonDbDetails.collectionName)
        .doc(doc.id);
      if(options) {
        batch.set(docRef, { ...doc }, options);
      } else {
        batch.set(docRef, { ...doc });
      }
    });

    const response: WriteResult[] = await batch.commit();
    global.logger.info("Bulk Create Document Response", {
      responseLength: response.length,
    });

    if (!response || !response.length || response.length !== documents.length) {
      return false;
    }

    return true;
  }

  async getDocumentById<DbEntityDto>(
    commonDbDetails: GcpFirestoreInteractionDto,
    id: string,
  ): Promise<DbEntityDto | undefined> {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );
    const doc: DocumentSnapshot<DocumentData, DocumentData> = await db
      .collection(commonDbDetails.collectionName)
      .doc(id)
      .get();

    if (!doc.exists) {
      return undefined;
    }

    return doc.data() as DbEntityDto;
  }

  async getAllDocumentsByIdsWithoutPagination<DbEntityDto>(
    commonDbDetails: GcpFirestoreInteractionDto,
    ids: string[],
  ): Promise<DbEntityDto[]> {
    if (!ids.length) return [];

    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    // Chunk IDs into groups of 10 (Firestore 'in' limit)
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) {
      chunks.push(ids.slice(i, i + 10));
    }

    // Execute all queries in parallel
    const queryPromises: Promise<QuerySnapshot<DocumentData, DocumentData>>[] =
      chunks.map((chunk: string[]) =>
        db
          .collection(commonDbDetails.collectionName)
          .where("id", "in", chunk)
          .get(),
      );

    const querySnapshots: QuerySnapshot<DocumentData, DocumentData>[] =
      await Promise.all(queryPromises);

    // Flatten results
    return querySnapshots.flatMap(
      (snapshot: QuerySnapshot<DocumentData, DocumentData>) =>
        snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) =>
            doc.data() as DbEntityDto,
        ),
    );
  }

  async updateDocumentById<UpdateEntityDto extends DocumentData, DbEntityDto>(
    commonDbDetails: GcpFirestoreInteractionDto,
    id: string,
    data: UpdateEntityDto,
  ): Promise<DbEntityDto | undefined> {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    const response: WriteResult = await db
      .collection(commonDbDetails.collectionName)
      .doc(id)
      .update(data);

    if (!response) {
      return undefined;
    }

    // Fetch the updated document
    const updatedDoc: DocumentSnapshot<DocumentData, DocumentData> = await db
      .collection(commonDbDetails.collectionName)
      .doc(id)
      .get();

    if (!updatedDoc.exists) {
      return undefined;
    }

    return updatedDoc.data() as DbEntityDto;
  }

  /**
   * Batched writes
   * @see https://docs.cloud.google.com/firestore/native/docs/manage-data/transactions#batched-writes
   */
  async bulkUpdateDocumentByIds<UpdateEntityDto extends DocumentData>(
    commonDbDetails: GcpFirestoreInteractionDto,
    ids: string[],
    updateData: UpdateEntityDto,
  ) {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    // Get a new write batch
    const batch: WriteBatch = db.batch();

    ids.forEach((id: string) => {
      const docRef: DocumentReference<DocumentData, DocumentData> = db
        .collection(commonDbDetails.collectionName)
        .doc(id);
      batch.update(docRef, updateData);
    });

    // Commit the batch
    const response: WriteResult[] = await batch.commit();
    global.logger.info("Bulk Update Document Response", {
      responseLength: response.length,
      idsLength: ids.length,
    });

    if (!response || !response.length || response.length !== ids.length) {
      global.logger.error("Bulk Update Document Response", {
        response,
        responseLength: response.length,
        idsLength: ids.length,
      });
      return false;
    }

    return true;
  }

  async bulkUpdateDocumentByIdsWithDifferentData<
    UpdateEntityDto extends DocumentData
  >(
    commonDbDetails: GcpFirestoreInteractionDto,
    updates: {
      id: string;
      updateData: UpdateEntityDto;
    }[],
  ) {
    if (!updates.length) return true;

    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    const chunks: typeof updates[] = [];

    let batchLimit: number = 300;
    for (let i = 0; i < updates.length; i += batchLimit) {
      chunks.push(updates.slice(i, i + batchLimit));
    }

    for (const chunk of chunks) {
      const batch: WriteBatch = db.batch();

      chunk.forEach(({ id, updateData }) => {
        if (!id) return;

        const docRef: DocumentReference<DocumentData, DocumentData> = db
          .collection(commonDbDetails.collectionName)
          .doc(id);

        batch.update(docRef, updateData);
      });

      const response: WriteResult[] = await batch.commit();

      global.logger.info("Bulk Update (Different Data) Response", {
        responseLength: response.length,
        chunkLength: chunk.length,
      });

      if (!response || response.length !== chunk.length) {
        global.logger.error("Bulk Update Failed", {
          responseLength: response?.length,
          expected: chunk.length,
        });
        return false;
      }
    }

    return true;
  }

  async getAllDocumentsWithoutPagination<DbEntityDto>(
    commonDbDetails: GcpFirestoreInteractionDto,
    query: Query<DocumentData, DocumentData>,
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    /**
     * @note
     *  1. We are returnig snapshot because it can be feasible for use differently for different use cases.
     *  2. If you want to parse the data use below piece of code:
     *     const docs: DbEntityDto[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data() as DbEntityDto);
     *  3. If you want to use only list of document ids use below piece of code:
     *     const ids: string[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.id);
     */
    return query.get();
  }

  async bulkDeleteDocumentByIds(
    commonDbDetails: GcpFirestoreInteractionDto,
    ids: string[],
  ) {
    const db: Firestore = await this.getFirestoreDatabase(
      commonDbDetails.databaseName,
    );

    const BATCH_SIZE: number = 500; // Firestore's max batch size
    let totalDeleted: number = 0;

    // Process in chunks
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const chunk: string[] = ids.slice(i, i + BATCH_SIZE);
      const batch: WriteBatch = db.batch();

      chunk.forEach((id: string) => {
        const docRef: DocumentReference<DocumentData, DocumentData> = db
          .collection(commonDbDetails.collectionName)
          .doc(id);
        batch.delete(docRef);
      });

      const response: WriteResult[] = await batch.commit();
      totalDeleted += response.length;

      global.logger.info(`Bulk Delete Document Chunk Response`, {
        chunkSize: chunk.length,
        responseLength: response.length,
        totalProcessed: totalDeleted,
        totalIds: ids.length,
      });
    }

    if (totalDeleted !== ids.length) {
      global.logger.error("Bulk Delete Document Response", {
        totalDeleted,
        expectedDeleted: ids.length,
      });
      return false;
    }

    return true;
  }
}

export { GcpFirestoreLibrary };
