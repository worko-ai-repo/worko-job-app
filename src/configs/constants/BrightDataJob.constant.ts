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
    "Apna",
    "Astrotalk",
    "Beardo",
    "BharatPe",
    "bigbasket",
    "Blinkit",
    "BlueStone",
    "boAt",
    "Chingari",
    "Classplus",
    "CRED",
    "Curefoods",
    "Delhivery",
    "Doubtnut",
    "FamPay",
    "Farmart",
    "FinBox",
    "GlobalBees",
    "Groww",
    "Heads Up For Tails",
    "INDmoney",
    "Instamojo",
    "Jupiter",
    "KopyKitab",
    "KreditBee",
    "Lenskart.com",
    "Leverage",
    "Licious",
    "Mamaearth",
    "mCaffeine",
    "Mensa Brands",
    "MyGlamm",
    "Myntra",
    "Niyo Solutions Inc.",
    "Noise",
    "Nykaa",
    "Ola",
    "Oxyzo",
    "Paytm",
    "Pepper Content",
    "Pharmeasy",
    "PhonePe",
    "PhysicsWallah",
    "Plum",
    "PolicyBazaar",
    "Purplle",
    "Rage Coffee",
    "Razorpay",
    "Scaler",
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
    "Vedantu",
    "Xpressbees",
    "Yulu",
    "Zepto",
    "Zerodha",
    "ZestMoney",
    "Zolve",
    "Zomato",
    "Zopper",
    "Bombay Shaving Company",
    "Bewakoof.com",
    "Wakefit",
    "Ola Electric",
    "Pepperfry",
    "Jupitor Technologies llc",
    "Beast Life",
    "Urban Company",
    "Lumio",
    "Snitch",
    "The Bear House",
    "Boult",
    "First Club",
    "Livspace",
    "Homelane",
    "Park+",
    "The sleep Company",
    "Sirona Hygiene",
    "Swish",
    "Supertails",
    "Betterhalf",
    "Whatfix",
    "FlickTV",
    "CleverTAp",
    "Easemytrip",
    "Eloelo",
    "1mg",
    "Aakash Educational Services (AESL)",
    "Accenture",
    "Acuity Knowledge Partners",
    "Amadeus",
    "AMD",
    "AO Smith",
    "Acko",
    "Arzooo",
    "Ashok Leyland",
    "Asian Paints",
    "Audi",
    "Axis Bank",
    "Bajaj Finserv",
    "Bajaj Capital",
    "Bajaj Electricals",
    "Bankbazaar",
    "BCG",
    "Airtel",
    "Apple",
    "Britannia",
    "BYJUS",
    "Cadeploy Engineering",
    "Cafe Coffee Day (CCD)",
    "Cargill",
    "BillDesk",
    "Cashfree Payments",
    "CDS",
    "Chai Point",
    "Chalo",
    "Cheil - Samsung",
    "CISCO",
    "Classteacher",
    "Clear",
    "Colgate Palmolive",
    "Blackbuck",
    "Croma",
    "Crompton Greaves",
    "Cuemath",
    "Dabur",
    "Dalmia Cement",
    "DBS Bank",
    "DCB Bank",
    "CarDekho",
    "DesignCafe",
    "DTDC Express",
    "DXC Technology",
    "Easemytrip",
    "Edelweiss Broking",
    "Ellevate K 12",
    "Enphase Energy",
    "Exide",
    "EXL",
    "Fashinza",
    "FICO",
    "Cashify",
    "Franchise India Holdings",
    "Gamooz Interactive Solutions",
    "Genpact",
    "Godrej",
    "Godrej Industries",
    "Grant Thornton",
    "Haier",
    "Happay",
    "Hatch",
    "Havells",
    "HCLTech",
    "HDB Financial Services",
    "HDFC Bank",
    "Hdfc Securities",
    "Hidesign",
    "Hindustan Wellness",
    "Hitachi",
    "Honeywell",
    "Hotstar",
    "Unilever",
    "Hyundai Motor",
    "IBM",
    "ICICI Bank",
    "Incred",
    "IndiaMart",
    "Indifi Technologies",
    "IndusInd Bank",
    "Innoviti Payment Solutions",
    "Darwinbox",
    "ITC",
    "Jacobs",
    "Jain Irrigation Systems",
    "Jaro Education",
    "Jio",
    "JK Lakshmi Cement",
    "Justdial",
    "KEC International",
    "Kent",
    "Khatabook",
    "Kimberly Clark",
    "Kotak Mahindra Bank",
    "Lambdatest",
    "EY",
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
    const PROD_HOURS = 4; // 4 hours
    const DEV_HOURS = 45 / 60; // 45 minutes in hours

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
