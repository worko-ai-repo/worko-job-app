/**
 * Constants related to the table, including table name, primary key and sort key definitions,
 * schema options.
 */
const DB_CONSTANTS = {
  // Defines the primary key (PK) and sort key (SK)
  WORKO_PK_SK: {
    PK: { type: String, hashKey: true },
    SK: { type: String, rangeKey: true },
  },

  // Schema options 
  WORKO_MODEL_SCHEMA_OPTIONS: {
    create: false,
    waitForActive: false,
    saveUnknown: true,
    timestamps: true,
  },

  // Table names of worko
  WORKO_TABLE_NAMES: {
    workoJobAppTableName: "worko-job-app",
    workoTableName: "worko",
    workoCountTableName: "worko-count",
  },
};

// Exports the DB_CONSTANTS object containing constants 
export { DB_CONSTANTS };
