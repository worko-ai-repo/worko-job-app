// NPM packages
import AWS from "aws-sdk";

/**
 * AwsSchedulerLibrary
 *
 * This library is a wrapper around the AWS Scheduler service, providing methods to manage scheduling tasks.
 * It includes methods for creating and deleting schedules.
 * Feel free to enhance this class as needed.
 */
class AwsSchedulerLibrary {
  /**
   * scheduler
   *
   * AWS Scheduler object to perform scheduling related operations.
   */
  private scheduler: AWS.Scheduler;

  /**
   * constructor
   *
   * Initializes the AWS Scheduler client with the provided configuration.
   *
   * @param {AWS.Scheduler.ClientConfiguration} config - Configuration options for the AWS Scheduler client.
   */
  constructor(private config: AWS.Scheduler.ClientConfiguration) {
    this.scheduler = new AWS.Scheduler(this.config);

    // Log message indicating successful initialization of the class
    console.log(`The '${AwsSchedulerLibrary.name}' is initialised.`, {
      filePath: __filename,
    });
  }

  /**
   * updateConfig
   *
   * Update the AWS Scheduler configuration
   *
   * @param {AWS.Scheduler.ClientConfiguration} config
   * @returns {void}
   */
  updateConfig(config: AWS.Scheduler.ClientConfiguration): void {
    this.config = config;
    this.scheduler = new AWS.Scheduler(config);
  }
  /**
   * createSchedule
   *
   * Creates a new schedule in AWS Scheduler based on the parameters provided.
   *
   * @param {AWS.Scheduler.CreateScheduleInput} params - Parameters required to create the schedule.
   * @returns {Promise<AWS.Scheduler.CreateScheduleOutput>} - A promise that resolves to the output of the create schedule operation.
   */
  async createSchedule(
    params: AWS.Scheduler.CreateScheduleInput
  ): Promise<AWS.Scheduler.CreateScheduleOutput> {
    // Logger message for the createSchedule method call
    global.logger.info("Creating new schedule (data).", {
      filePath: __filename,
      methodName: this.createSchedule.name,
      params: params,
    });

    // Create the schedule and return the result
    return this.scheduler.createSchedule(params).promise();
  }

  /**
   * deleteSchedule
   *
   * Deletes a schedule from AWS Scheduler based on the parameters provided.
   *
   * @param {AWS.Scheduler.DeleteScheduleInput} params - Parameters required to delete the schedule.
   * @returns {Promise<AWS.Scheduler.DeleteScheduleOutput>} - A promise that resolves to the output of the delete schedule operation.
   */
  async deleteSchedule(
    params: AWS.Scheduler.DeleteScheduleInput
  ): Promise<AWS.Scheduler.DeleteScheduleOutput> {
    // Logger message for the deleteSchedule method call
    global.logger.info("Deleting schedule (data).", {
      filePath: __filename,
      methodName: this.deleteSchedule.name,
      params: params,
    });

    // Delete the schedule and return the result
    return this.scheduler.deleteSchedule(params).promise();
  }
}

export { AwsSchedulerLibrary };
