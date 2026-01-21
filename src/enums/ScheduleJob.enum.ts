/**
 * ScheduleJobType
 * 
 * @enum {string}
 * @description Enumeration for different types of scheduled jobs. These jobs are typically used to automate reminders and notifications within the system.
 */
export enum ScheduleJobType {
  /**
   * FANTASTIC_JOB_TWENTY_FOUR_HOURS
   *
   * This schedule job type is used to automatically every certain hours.
   * When this schedule job is triggered we need to retrieve the `24` hour jobs using
   * external job api and store in the database.
   */
  FANTASTIC_JOB_TWENTY_FOUR_HOURS = "FANTASTIC_JOB_TWENTY_FOUR_HOURS",

  /**
   * FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS
   * 
   * When this schedule job is triggered we need to hard and soft delete old unapplied fantastic jobs.
   */
  FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS = "FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS",

  /**
   * USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED
   *
   * Whenever a user applies for a job, even though the matching score is low, then at that time we initially make
   * user job application status as `APPLIED` but after `24` hours we update the status to `REJECTED`.
   */
  USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED = "USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED",

  /**
   * BRIGHT_DATA_JOB_TO_CREATE_SNAPSHOT
   * 
   * This is used to create a bright data snapshot and schedule a job to retrieve the data from the snapshot after certain hours.
   */
  BRIGHT_DATA_JOB_TO_CREATE_SNAPSHOT = "BRIGHT_DATA_JOB_TO_CREATE_SNAPSHOT",

  /**
   * BRIGHT_DATA_JOB_TO_RETRIEVE
   */
  BRIGHT_DATA_JOB_TO_RETRIEVE = "BRIGHT_DATA_JOB_TO_RETRIEVE",

  /**
   * BRIGHT_DATA_JOB_HARD_DELETE_OLD_JOBS
   *
   * When this schedule job is triggered we need to hard and soft delete old unapplied bright data jobs.
   */
  BRIGHT_DATA_JOB_HARD_DELETE_OLD_JOBS = "BRIGHT_DATA_JOB_HARD_DELETE_OLD_JOBS",

  /**
   * BLACK_LISTED_USER_JOB_APPLICATION_STATUS_UPDATE
   * 
   * Whenever thr `corporate` mark candidate as `BLACK_LISTED` for his company
   * And at that time whenever candidate applies a job for corporate's company, then
   * we allow candidate to apply job and after few hours we update the status to `REJECTED` by 
   * using this schedule job
   */
  BLACK_LISTED_USER_JOB_APPLICATION_STATUS_UPDATE = "BLACK_LISTED_USER_JOB_APPLICATION_STATUS_UPDATE",

  /**
   * This schedule job is used to turn off cooling period after certain months.
   */
  COOLING_PERIOD_COMPLETION_CORPORATE_CANDIDATE_PROFILE_UPDATE = "COOLING_PERIOD_COMPLETION_CORPORATE_CANDIDATE_PROFILE_UPDATE",
}

/**
 * ScheduleJobStatus
 * 
 * @enum {string}
 * @description Enumeration for the status of scheduled jobs. These statuses reflect the current state of a scheduled job, from scheduling to completion or failure.
 */
export enum ScheduleJobStatus {
  /**
   * @description Indicates that the job has been successfully scheduled and is awaiting execution. The job is in the queue and will be triggered at the specified time.
   */
  SCHEDULED = "SCHEDULED",

  /**
   * @description Indicates that the job's trigger process has successfully started. This means the scheduled job has begun execution as intended.
   */
  TRIGGER_PROCESS_SUCCESS = "TRIGGER_PROCESS_SUCCESS",

  /**
   * @description Indicates that the job's trigger process failed to start. This could be due to system errors or issues in the job's configuration, requiring intervention to retry or reschedule.
   */
  TRIGGER_PROCESS_FAILED = "TRIGGER_PROCESS_FAILED",

  /**
   * @description Indicates that the job has failed during its execution. The failure could be due to various reasons such as network issues, system errors, or invalid job parameters.
   */
  FAILED = "FAILED",

  /**
   * @description Indicates that the job has been completed successfully. The job has executed all its tasks and processes as expected without errors.
   */
  COMPLETED = "COMPLETED"
}
