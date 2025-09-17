// Load the base DAO
import BaseDao from "./Base.dao";

// Load the UlidService for generating ULID IDs
import UlidService from "../services/Ulid.service";

// Load the local DTOs
import {
  ScheduleJobCreateDto,
  ScheduleJobInternalUpdateDto,
  ScheduleJobUpdateDto,
} from "../dtos/ScheduleJob.dto";

// Load the local models
import {
  DbScheduleJobDto,
  ScheduleJobModel,
} from "../db/models/ScheduleJob.model";

// Class definition for ScheduleJobDao implementing BaseDao
class ScheduleJobDao implements BaseDao {
  // Model name for the Schedule Job
  modelName = "ScheduleJob";

  // Partition key for the Schedule Job
  partitianKey = "SCHD#JOB#";

  // Sort key patterns for the Schedule Job
  sortKeys = {
    SK_SUBS: "SCHD#JOB#ID#{ID}",
  };

  /**
   * Creates a new schedule job in the database.
   *
   * @param {ScheduleJobCreateDto} scheduleJobDto - Data Transfer Object containing the details of the schedule job to be created.
   * @return {Promise<DbScheduleJobDto>} A promise that resolves to the created schedule job object.
   */
  async create(
    scheduleJobDto: ScheduleJobCreateDto
  ): Promise<DbScheduleJobDto> {
    global.logger.info("Creating new schedule job in DAO", { scheduleJobDto });

    // Generate a new ULID ID for the new schedule job
    let id = UlidService.getUlidId();

    // Prepare the data object for the new schedule job
    const newScheduleJobDto = {
      ...scheduleJobDto,
      PK: this.partitianKey,
      SK: this.sortKeys.SK_SUBS.replace("{ID}", id),
      id: id,
    };

    // Create the new schedule job in the database using the ScheduleJobModel
    return ScheduleJobModel.create(newScheduleJobDto);
  }

  /**
   * Updates an existing schedule job in the database.
   *
   * @param {string} id - The ID of the schedule job to be updated.
   * @param {ScheduleJobUpdateDto} scheduleJobDto - Data Transfer Object containing the updated details of the schedule job.
   * @return {Promise<DbScheduleJobDto>} A promise that resolves to the updated schedule job object.
   */
  async update(
    id: string,
    scheduleJobDto: ScheduleJobUpdateDto
  ): Promise<DbScheduleJobDto> {
    global.logger.info("Updating schedule job in DAO", { id, scheduleJobDto });

    // Prepare the keys for updating the schedule job based on the ID
    let keys = {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_SUBS.replace("{ID}", id),
    };

    // Update the existing schedule job in the database
    return ScheduleJobModel.update(keys, scheduleJobDto);
  }

  /**
   * Retrieves a schedule job from the database by its ID.
   *
   * @param {string} id - The ID of the schedule job to retrieve.
   * @return {Promise<DbScheduleJobDto>} A promise that resolves to the retrieved schedule job object.
   */
  async getById(id: string): Promise<DbScheduleJobDto> {
    global.logger.info("Retrieving schedule job from DAO", { id });

    // Prepare the keys for retrieving the schedule job based on the ID
    let keys = {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_SUBS.replace("{ID}", id),
    };

    // Retrieve the schedule job from the database
    return ScheduleJobModel.get(keys);
  }

  /**
   * updateScheduleJobById
   * 
   * Updates an existing schedule job by id in the database.
   *
   * @param {string} id - The ID of the schedule job to be updated.
   * @param {Partial<ScheduleJobInternalUpdateDto>} scheduleJobUpdateDto - Data Transfer Object containing the updated details of the schedule job.
   * @return {Promise<DbScheduleJobDto>} A promise that resolves to the updated schedule job object.
   */
  async updateScheduleJobById(
    id: string,
    scheduleJobUpdateDto: Partial<ScheduleJobInternalUpdateDto>
  ): Promise<DbScheduleJobDto> {
    global.logger.info("Updating schedule job by id in DAO", { id, scheduleJobUpdateDto });

    // Prepare the keys for updating the schedule job based on the ID
    let keys = {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_SUBS.strtr({ "{ID}": id }),
    };

    // Update the existing schedule job in the database
    return ScheduleJobModel.update(keys, scheduleJobUpdateDto);
  }
}

// Export an instance of ScheduleJobDao to be used elsewhere in the application
const scheduleJobDaoObj = new ScheduleJobDao();

export { ScheduleJobDao, scheduleJobDaoObj };
