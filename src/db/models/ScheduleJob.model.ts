// Load the npm packages
import * as dynamoose from "dynamoose";

// Load the models
import { BaseDbDto } from "./Base.model";

// Load the constants
import { DB_CONSTANTS } from "../DB.constants";

// Load the enums
import { ScheduleJobStatus, ScheduleJobType } from "../../enums/ScheduleJob.enum";

class DbScheduleJobDto extends BaseDbDto{
    id!: string;
    type!: ScheduleJobType;
    desc?: string;
    scheduleTime!: string;
    status!: ScheduleJobStatus;
    input!: object
}

// Define the schema for the support model using DynamoDB
const DbScheduleJobSchema = new dynamoose.Schema(
    {
        ...DB_CONSTANTS.WORKO_PK_SK,
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        scheduleTime: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        input: {
            type: Object,
            required: true
        }
    },
    {
        ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
    }
);

// Create the SupportModel using the defined schema
const ScheduleJobModel = dynamoose.model<DbScheduleJobDto>(
    "ScheduleJob",
    DbScheduleJobSchema
);

// Export the SupportModel
export { ScheduleJobModel, DbScheduleJobDto };