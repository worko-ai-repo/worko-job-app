// NPM packages
import {
  SchedulerClient,
  CreateScheduleCommand,
  DeleteScheduleCommand,
  GetScheduleCommand,
  type SchedulerClientConfig,
  type CreateScheduleCommandInput,
  type CreateScheduleCommandOutput,
  type DeleteScheduleCommandInput,
  type DeleteScheduleCommandOutput,
  type GetScheduleCommandInput,
  type GetScheduleCommandOutput,
} from "@aws-sdk/client-scheduler";

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
  private scheduler: SchedulerClient;

  /**
   * constructor
   *
   * Initializes the AWS Scheduler client with the provided configuration.
   *
   * @param {SchedulerClientConfig} config - Configuration options for the AWS Scheduler client.
   */
  constructor(private config: SchedulerClientConfig) {
    this.scheduler = new SchedulerClient(this.config);

    // Log message indicating successful initialization of the class
    console.log(`The '${AwsSchedulerLibrary.name}' is initialised.`, {
      filePath: __filename,
    });
  }


  async getScheduleById(
    params: GetScheduleCommandInput
  ): Promise<GetScheduleCommandOutput> {
    // Logger message for the getScheduleById method call
    global.logger.info("Fetching schedule by ID (data).", {
      filePath: __filename,
      methodName: this.getScheduleById.name,
      params: params,
    });

    // Fetch and return the schedule details
    return this.scheduler.send(new GetScheduleCommand(params));
  }

  /**
   * updateConfig
   *
   * Update the AWS Scheduler configuration
   *
   * @param {AWS.Scheduler.ClientConfiguration} config
   * @returns {void}
   */
  updateConfig(config: SchedulerClientConfig): void {
    this.config = config;
    this.scheduler = new SchedulerClient(config);
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
    params: CreateScheduleCommandInput
  ): Promise<CreateScheduleCommandOutput> {
    // Logger message for the createSchedule method call
    global.logger.info("Creating new schedule (data).", {
      filePath: __filename,
      methodName: this.createSchedule.name,
      params: params,
    });

    // Create the schedule and return the result
    return this.scheduler.send(new CreateScheduleCommand(params));
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
    params: DeleteScheduleCommandInput
  ): Promise<DeleteScheduleCommandOutput> {
    // Logger message for the deleteSchedule method call
    global.logger.info("Deleting schedule (data).", {
      filePath: __filename,
      methodName: this.deleteSchedule.name,
      params: params,
    });

    // Delete the schedule and return the result
    return this.scheduler.send(new DeleteScheduleCommand(params));
  }
}

export { AwsSchedulerLibrary };
