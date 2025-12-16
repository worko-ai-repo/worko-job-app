
// Import AWS SDK
import { CreateScheduleCommandOutput, DeleteScheduleCommandOutput } from "@aws-sdk/client-scheduler";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import DAOs
import { awsSchedulerClientLibrary } from "../configs/aws-sdk.config";
import { scheduleJobDaoObj } from "../daos/ScheduleJob.dao";

// Import models
import { DbScheduleJobDto } from "../db/models/ScheduleJob.model";

// Import DTOs
import { ScheduleJobCreateDto, ScheduleJobInternalUpdateDto } from "../dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobStatus } from "../enums/ScheduleJob.enum";

// Import error handling utilities
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class ScheduleJobService {
  private readonly schedulerRoleArn: string;

  constructor() {
    this.schedulerRoleArn = APP_CONSTANTS.AWS_EVENT_BRIDGE_SCHEDULER_ARNS.ROLE_ARN;

    if (!this.schedulerRoleArn) {
      // Log the error
      global.logger.error('Scheduler ARNs are not properly configured', {
        schedulerRoleArn: this.schedulerRoleArn,
      });

      // Throw an error
      throw new BaseError('Scheduler ARNs are not properly configured', HttpStatusCode.INTERNAL_SERVER_ERROR_500);
    }
  }

  /**
  * Creates a new schedule job and schedules it with AWS Scheduler.
  *
  * @param {ScheduleJobCreateDto} scheduleBody - The schedule job creation DTO.
  * @param {string} schedulerLambdaArn - The ARN of the scheduler Lambda function.
  * @return {Promise<DbScheduleJobDto>} The created schedule job DTO.
  * @throws {BaseError} If the job creation fails or if an unsupported job type is provided.
  */
  async createScheduleJob(scheduleBody: ScheduleJobCreateDto, schedulerLambdaArn: string): Promise<DbScheduleJobDto> {
    // Log the attempt to create a new schedule job
    global.logger.info("Creating new scheduler job [ScheduleJob Service].", { scheduleBody });

    // Initialize the created job variable
    let createdJob: DbScheduleJobDto | null = null;

    try {
      let schedulerLambdaRoleArn: string = this.schedulerRoleArn;

      // Create the schedule job in the database
      createdJob = await scheduleJobDaoObj.create(scheduleBody);
      if (!createdJob) {
        throw new BaseError("Failed to create scheduler job in database", HttpStatusCode.BAD_REQUEST_400);
      }
      global.logger.info("Created job in database:", createdJob);

      // Create the schedule in AWS Scheduler
     let response: CreateScheduleCommandOutput = await awsSchedulerClientLibrary.createSchedule({
        Name: createdJob.id,
        ScheduleExpression: `at(${scheduleBody.scheduleTime})`,
        FlexibleTimeWindow: {
          Mode: "OFF",
        },
        Target: {
          Arn: schedulerLambdaArn,
          RoleArn: schedulerLambdaRoleArn,
          Input: JSON.stringify({ scheduleJobId: createdJob.id, ...scheduleBody.input }),
        },
      });

      global.logger.info("Created schedule in AWS Scheduler:", { response: JSON.stringify(response) });
      return createdJob;

    } catch (error: any) {
      // Update the job status to FAILED if an error occurs during creation
      if (createdJob) {
        await scheduleJobDaoObj.update(createdJob.id, { status: ScheduleJobStatus.FAILED });
      }

      // Throw a BaseError with details about the failure
      throw new BaseError(
        `Failed to create AWS scheduler for job ${createdJob?.id}: ${error.message}`,
        error.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * Completes the schedule job and deletes it from AWS Scheduler.
   *
   * @param {string} id - The ID of the schedule job to complete.
   * @return {Promise<boolean>}
   */
  async completeScheduleJob(id: string): Promise<boolean> {
    // Update the schedule job status to COMPLETED in the database
    await scheduleJobDaoObj.update(id, { status: ScheduleJobStatus.COMPLETED });
    global.logger.info("Marked scheduler job as completed in database:", id);

    // Delete the schedule from AWS Scheduler
    const deleteResponse: DeleteScheduleCommandOutput = await awsSchedulerClientLibrary.deleteSchedule({ Name: id });
    global.logger.info("Deleted scheduler job from AWS:", {
      response: JSON.stringify(deleteResponse),
      deleteResponse: deleteResponse,
      id,
    });

    return true;
  }

  /**
   * Retrieves a schedule job by its ID.
   *
   * @param {string} id - The ID of the schedule job to retrieve.
   * @return {Promise<DbScheduleJobDto>} The retrieved schedule job DTO.
   */
  async getScheduleJobById(id: string): Promise<DbScheduleJobDto> {
    // Retrieve the schedule job from the database by its ID
    return scheduleJobDaoObj.getById(id);
  }

  /**
   * updateScheduleJobById
   * 
   * Updates a schedule job by its ID.
   *
   * @param {string} id - The ID of the schedule job to retrieve.
   * @param {Partial<ScheduleJobInternalUpdateDto>} updateData - Data Transfer Object containing the updated details of the schedule job.
   * @return {Promise<DbScheduleJobDto>} The retrieved schedule job DTO.
   */
  async updateScheduleJobById(id: string, updateData: Partial<ScheduleJobInternalUpdateDto>): Promise<DbScheduleJobDto> {
    global.logger.info("Update schedule job by id [ScheduleJob Service].", {
      methodName: this.updateScheduleJobById.name,
      id,
    });

    // Update the schedule job from the database by its ID
    return scheduleJobDaoObj.updateScheduleJobById(id, updateData);
  }
}

export default new ScheduleJobService();
