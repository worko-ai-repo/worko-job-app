import { ScheduleJobStatus, ScheduleJobType } from "../enums/ScheduleJob.enum";

/**
 * ScheduledEventDto
 * 
 * @reference Currently `ScheduledEventDto` is used as parameter for `handler` function in `app-scheduler-external-jobs.ts`.
 */
export interface ScheduledEventDto {
  scheduleJob: {
    type: ScheduleJobType;
  };
}

/**
 * ScheduleJobCreateDto
 *
 * This interface defines the structure of a schedule job data transfer object, representing a schedule job with additional fields.
 */
export interface ScheduleJobCreateDto {
  /**
   * id
   * 
   * A unique identifier for the schedule job. This is an optional field as it is auto-generated upon creation.
   * 
   * @type {string}
   */
  id?: string;

  /**
   * type
   * 
   * The type of the schedule job, which determines the nature of the task to be scheduled.
   * 
   * @type {ScheduleJobType}
   */
  type: ScheduleJobType;

  /**
   * scheduleTime
   * 
   * The time at which the schedule job is set to execute. This should be in ISO 8601 date format.
   * 
   * @example "2017-04-20T11:32:00.000-04:00"
   * @type {string}
   */
  scheduleTime: string;

  /**
   * input
   * 
   * The input data for the schedule job. This should be an object containing the necessary data for the job execution.
   * 
   * @type {object}
   */
  input: object;

  /**
   * desc
   * 
   * A description of the schedule job, which can include details about the job’s purpose or functionality.
   * 
   * @type {string}
   */
  desc: string;

  /**
   * status
   * 
   * The current status of the schedule job. This indicates whether the job is pending, in progress, or completed.
   * 
   * @type {ScheduleJobStatus}
   */
  status: ScheduleJobStatus;
}

/**
 * ScheduleJobUpdateDto
 *
 * This interface defines the structure of the data that can be used to update an existing schedule job.
 */
export interface ScheduleJobUpdateDto {
  /**
   * type
   * 
   * The type of the schedule job, which determines the nature of the task to be scheduled. This field is optional.
   * 
   * @type {ScheduleJobType}
   */
  type?: ScheduleJobType;

  /**
   * scheduleTime
   * 
   * The new time at which the schedule job is set to execute. This should be in ISO 8601 date format. This field is optional.
   * 
   * @example "2017-04-20T11:32:00.000-04:00"
   * @type {string}
   */
  scheduleTime?: string;

  /**
   * input
   * 
   * The new input data for the schedule job. This should be an object containing the necessary data for the job execution. This field is optional.
   * 
   * @type {object}
   */
  input?: object;

  /**
   * desc
   * 
   * The new description of the schedule job, which can include details about the job’s purpose or functionality. This field is optional.
   * 
   * @type {string}
   */
  desc?: string;

  /**
   * status
   * 
   * The new status of the schedule job. This indicates whether the job is pending, in progress, or completed. This field is optional.
   * 
   * @type {ScheduleJobStatus}
   */
  status?: ScheduleJobStatus;
}

/**
 * ScheduleJobFantasticJobTwentyFourHourInputDto
 */
export interface ScheduleJobFantasticJobTwentyFourHourInputDto {

}

/**
 * ScheduleUserJobApplicationStatusUpdateToRejectedInputDto
 */
export interface ScheduleUserJobApplicationStatusUpdateToRejectedInputDto {
  userJobApplicationId: string;
  userEmail: string;
  userId: string;
}

/**
 * ScheduleUserJobApplicationStatusUpdateToRejectedInputDto
 */
export interface ScheduleBrightDataJobToRetrieveInputDto {
  snapshotId: string;

  /**
   * @reference `id` attribute of `ScheduleJob.model.ts`
   */
  scheduleJobId?: string;
}

/**
 * ScheduleJobInternalUpdateDto
 * 
 * This dto is used as reusable for updating `ScheduleJob.model.ts` by using `Partial` typescript feature
 */
export interface ScheduleJobInternalUpdateDto {
  status: ScheduleJobStatus;
}