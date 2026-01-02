// Import firestore package
import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@google-cloud/firestore";

// Import dtos
import {
  GcpFirestoreRecordListingFilterOptions,
  GcpFirestoreRecordListingResponseDTO,
} from "../dtos/Common.gcp-firestore.dto";

// Import helpers
import { gcpFirestorelastKeyToBase64EncodeStr } from "../helpers/gcp-firestore.helper";

class GcpFirestoreUtil {
  async paginateGcpFirestore<
    EntityListingFilterOptions extends GcpFirestoreRecordListingFilterOptions,
    DbEntityDto
  >(
    db: Firestore,
    collectionName: string,
    baseQuery: Query<DocumentData, DocumentData>,
    options: EntityListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<DbEntityDto[]>> {
    const { lastKey, pageSize } = options;
    let query: Query<DocumentData, DocumentData> = baseQuery;

    if (lastKey) {
      const { gcpFirestoreDocumentId } = lastKey;
      const docSnapshot: DocumentSnapshot<DocumentData, DocumentData> = await db
        .collection(collectionName)
        .doc(gcpFirestoreDocumentId)
        .get();
      /**
       * @see https://docs.cloud.google.com/firestore/native/docs/query-data/query-cursors#add_a_simple_cursor_to_a_query
       */
      query = query.startAfter(docSnapshot);
    }

    if (pageSize) {
      query = query.limit(pageSize);
    }

    /**
     * Get multiple documents from a collection
     * @see https://docs.cloud.google.com/firestore/native/docs/query-data/get-data#get_multiple_documents_from_a_collection
     */
    const querySnapshot: QuerySnapshot<DocumentData, DocumentData> =
      await query.get();
    let finalData: DbEntityDto[] = [];
    querySnapshot.forEach(
      (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
        finalData.push(doc.data() as DbEntityDto);
      }
    );

    const lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> =
      querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      data: finalData,
      pagination: {
        count: finalData.length,
        pageSize: pageSize,
        lastKey:
          finalData.length === pageSize
            ? gcpFirestorelastKeyToBase64EncodeStr({
                gcpFirestoreDocumentId: lastDoc.data().id,
              })
            : undefined,
      },
    };
  }
}

const gcpFirestoreUtilObj: GcpFirestoreUtil = new GcpFirestoreUtil();
export { gcpFirestoreUtilObj, GcpFirestoreUtil };
