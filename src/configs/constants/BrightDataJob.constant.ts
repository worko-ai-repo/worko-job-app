/**
 * BRIGHT_DATA_JOB_APP_CONSTANTS
 */
const BRIGHT_DATA_JOB_APP_CONSTANTS = {
  // Application stage
  APP_SLS_STAGE: process.env.APP_SLS_STAGE,

  // The stages/environments supported by the application.
  STAGES: {
    LOCAL: "local",
    DEV: "dev",
    PROD: "prod",
  },

  /**
   * AWS_S3_PATH
   * 
   * @refer `File.service.ts`
   */
  AWS_S3_PATH: "bright-data-external-jobs",

  // ENVIRONMENT_RETRIEVAL_LIMIT
  ENVIRONMENT_RETRIEVAL_LIMIT: {
    DEV: 110,
    PROD: 1000,
  },

  FILE_FORMAT: {
    JSON: "json",
    NDJSON: "ndjson",
    JSONLINES: "jsonl",
    CSV: "csv",
  },

  SNAPSHOT_STATUS: {
    RUNNING: "running",
    READY: "ready",
  },

  COMPANIES: [
    "Accel",
    "Amazon",
    "Apna",
    "AppsForBharat",
    "Astrotalk",
    "Bain & Company",
    "Beardo",
    "BharatPe",
    "Bigbasket",
    "Blinkit",
    "BlueStone",
    "Blume Ventures",
    "Boat",
    "BoAt",
    "Boston Consulting Group",
    "CARS24",
    "Chingari",
    "Classplus",
    "CRED",
    "Curefoods",
    "Delhivery",
    "Doubtnut",
    "FamPay",
    "Farmart",
    "FinBox",
    "Flipkart",
    "GlobalBees",
    "Goldman Sachs",
    "Google",
    "Groww",
    "Heads Up For Tails",
    "INDmoney",
    "Instamojo",
    "InterviewBit",
    "JP Morgan Chase",
    "Jupiter",
    "KopyKitab",
    "KPMG",
    "KreditBee",
    "Lenskart",
    "Leverage Edu",
    "Licious",
    "Lightspeed",
    "Mamaearth",
    "Matrix Partners",
    "mCaffeine",
    "McKinsey & Company",
    "Meesho",
    "Mensa Brands",
    "Morgan Stanley",
    "MyGlamm",
    "Mylo",
    "Myntra",
    "Niyo Solutions",
    "Noise",
    "Leaf Wearables",
    "Nykaa",
    "Ola",
    "Ola Electric",
    "Oxyzo",
    "Paytm",
    "Peak XV",
    "Pepper Content",
    "Pharmeasy",
    "PhonePe",
    "PhysicsWallah",
    "Plum Goodness",
    "PolicyBazaar",
    "Porter",
    "Purplle",
    "Rage Coffee",
    "Rapido",
    "Razorpay",
    "Scaler",
    "Sequoia Capital",
    "ShareChat",
    "Simpl",
    "Skillmatics",
    "Sleepycat",
    "Slice",
    "Smallcase",
    "Snabbit",
    "Swiggy",
    "Tata Capital",
    "Testbook",
    "The Good Glamm Group",
    "The Souled Store",
    "Turtlemint",
    "Udaan",
    "Unacademy",
    "upGrad",
    "Urban Company",
    "Vedantu",
    "Xpressbees",
    "Yulu Bikes",
    "Zepto",
    "Zerodha",
    "ZestMoney",
    "Zolve",
    "Zomato",
    "Zopper",
    "Bombay Shaving Co",
    "Bewakoof.com",
    "Wakefit",
    "Pepperfry",
    "Jupitor",
    "Mcaffine",
    "Beast life",
    "Urbancompany",
    "Lumio",
    "Snitch",
    "bear house",
    "Boult",
    "First club",
    "Deloitte",
    "EY",
    "PwC",
    "Urban Ladder",
    "Livspace",
    "Homelane",
  ],

  LOCATIONS: [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Gurgaon/ Gurugram",
    "Noida",
    "Delhi NCR",
    "Pune",
    "Hyderabad",
    "Kolkata",
    "Vijayawada",
    "Goa",
    "Amaravati",
  ],

  CREATE_SNAPSHOT_ID: {
    TYPE: {
      DISCOVER_NEW: "discover_new",
    },
    DISCOVER_BY: {
      KEYWORD: "keyword",
    },
    INCLUDE_ERRORS: {
      TRUE: "true",
      FALSE: "false",
    },
    UNCOMPRESSED_WEBHOOK: {
      TRUE: "true",
      FALSE: "false",
    },
  },

  /**
   * BRIGHT_DATA_JOB_RETRIEVAL_AFTER_X_HOURS
   */
  get BRIGHT_DATA_JOB_RETRIEVAL_AFTER_X_HOURS(): number {
    const PROD_HOURS = 3; // 3 hours
    const DEV_HOURS = 45/60; // 45 minutes in hours

    // return the time based on the environment
    return this.APP_SLS_STAGE === this.STAGES.PROD ? PROD_HOURS : DEV_HOURS;
  },
};

/**
 * BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS
 *
 * This object contains endpoint URLs for various Bright Data Job Cloud API operations.
 * The URLs are parameterized and should be populated with actual values before use.
 */
const BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS = {
  /**
   * CREATE_SNAPSHOT_ID
   *
   * 1. This will create snapshot ID for data collection.
   *
   * @example https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&include_errors=false&type=discover_new&discover_by=keyword&limit_per_input=1000
   */
  CREATE_SNAPSHOT_ID: `{baseUrl}/trigger?dataset_id={datasetId}&include_errors={includeErrors}&type={type}&discover_by={discoverBy}&limit_per_input={limitPerInput}`,

  /**
   * GET_JOBS_BY_SNAPSHOT_ID
   *
   * @example https://api.brightdata.com/datasets/v3/snapshot/s_mcd4quo0171zpx08xn?format=json
   */
  GET_JOBS_BY_SNAPSHOT_ID: `{baseUrl}/snapshot/{snapshotId}?format={fileFormat}`,
};

// export constants
export { BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS, BRIGHT_DATA_JOB_APP_CONSTANTS };
