interface BaseFirestoreModel {
  /**
   * @description It should be same as the "document ID" of the firestore document.
   */
  id: string;
  createdAt: string;
  updatedAt: string;
}

export { BaseFirestoreModel };
