/**
 * BaseDao
 *
 * This is BaseDao having the default structure for any bDTO we would creating.
 */
export default interface BaseDao {
  /**
   * modelName
   *
   * The model associated with this name would be used for performing the CRUD operations.
   */
  modelName: string;

  /**
   * partitianKey
   *
   * Partitian key from the DynamoDB
   *
   * @todo: The current spelling `partitianKey` does not align with DynamoDB terminology.
   * The correct spelling should be `partitionKey`. This has been used across our backend codebase,
   * but we should consider updating it in the future after discussing with the team lead.
   */
  partitianKey: string;

  /**
   * sortKeys
   *
   * Example: {
   *  SK_ID: "ID#{uuid}",
   *  SK_ROLE: "ROLE#",
   * }
   */
  sortKeys: { [key: string]: string };

  /**
   * GSI1 partitianKey
   *
   * GSI1 Partitian key from the DynamoDB
   */
  GSI1PK?: string;

  /**
   * GSI1 sortKeys
   *
   * GSI1 sortKeys from the DynamoDB
   */
  GSI1SK?: string;
}
