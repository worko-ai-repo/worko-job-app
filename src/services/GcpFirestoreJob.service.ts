
// Import daos
import { gcpFirestoreJobDaoObj } from "../daos/GcpFirestoreJob.dao";

// Import dtos
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";
import { MinMaxRange } from "../dtos/Common.dto";
import { JobListingFilterOptions } from "../dtos/Job.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";

// Import enums
import { JobSourcedFromEnum } from "../enums/Common.enum";
import { JobStatusEnum } from "../enums/Job.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

class GcpFirestoreJobService {
   async createJob(
      createData: DbGcpFirestoreJobDto
   ): Promise<DbGcpFirestoreJobDto | undefined> {
      return gcpFirestoreJobDaoObj.createJob(createData);
   }

   async createBulkJobs(bulkJobData: DbGcpFirestoreJobDto[]): Promise<boolean> {
      return gcpFirestoreJobDaoObj.createBulkJobs(bulkJobData);
   }

   async getJobById(id: string): Promise<DbGcpFirestoreJobDto | undefined> {
      return gcpFirestoreJobDaoObj.getJobById(id);
   }

   async getJobsByIds(ids: string[]): Promise<DbGcpFirestoreJobDto[]> {
      return gcpFirestoreJobDaoObj.getJobsByIds(ids);
   }

    async getAllJobsByFilterOptions(jobListingFilterRequest: JobListingFilterOptions): Promise<
      GcpFirestoreRecordListingResponseDTO<DbGcpFirestoreJobDto[]>
    > {
      return gcpFirestoreJobDaoObj.getAllJobsByFilterOptions(jobListingFilterRequest);
    }

   async updateJobById(id: string, updateData: Partial<DbGcpFirestoreJobDto>): Promise<DbGcpFirestoreJobDto | undefined> {
      return gcpFirestoreJobDaoObj.updateJobById(id, updateData);
   }

  transformBrightDataJobToGcpFirestoreJobDto(
    ulidId: string,
    externalJob: BrightDataJobApiResponse
  ): DbGcpFirestoreJobDto {
    const {
      job_posting_id,
      job_posted_date,
      job_description_formatted,
      job_title,
      job_employment_type,
      job_location,
      job_summary,
      url,
      company_name,
      company_url,
      company_logo,
      job_function,
      base_salary,
      job_poster,
      job_industries,
      job_seniority_level,
    } = externalJob;

    const jobLocation: string[] = job_location ? [job_location.toLowerCase()] : [];

    let salaryRange: MinMaxRange | undefined;
    if(base_salary?.min_amount && base_salary?.max_amount) {
      salaryRange = {
        min: base_salary.min_amount,
        max: base_salary.max_amount,
      };
    } else if (base_salary?.min_amount) {
      salaryRange = {
        min: base_salary.min_amount,
      };
    } else if (base_salary?.max_amount) {
      salaryRange = {
        max: base_salary.max_amount,
      };
    } else {
      salaryRange = undefined;
    }

    const dbJobDto: DbGcpFirestoreJobDto = {
      id: ulidId,
      externalJobId: job_posting_id ?? ulidId,
      sourcedFrom: JobSourcedFromEnum.BRIGHT_DATA_JOB,
      createdAt: dateHelperObj.getISODate(),
      updatedAt: dateHelperObj.getISODate(),
      jobTitle: job_title ? job_title.toLowerCase() : "",
      typeofEmployment: job_employment_type ?? undefined,
      location: {
        city: jobLocation,
        state: jobLocation,
        country: jobLocation,
        fullLocation: jobLocation,
      },
      jobDescription: job_summary ?? undefined,
      htmlJobDescription: job_description_formatted ?? undefined,
      jobPostedDate: job_posted_date ?? undefined,
      jobUrl: url ?? undefined,
      status: JobStatusEnum.PUBLISHED,
      companyName: company_name ? company_name.toUpperCase() : undefined,
      companyUrl: company_url ?? undefined,
      companyLogoUrl: company_logo ?? undefined,
      isDeleted: false,
      department: job_function ?? undefined,
      salaryRange: salaryRange,
      brightDataJobPoster: job_poster ?? undefined,
      industry: job_industries ?? undefined,
      brightDataJobSeniorityLevel: job_seniority_level ?? undefined,
    };

    return dbJobDto;
  }

  async getAllOldExternalJobs(deleteOlderThanDays: number, sourcedFrom: JobSourcedFromEnum): Promise<string[]> {
    return gcpFirestoreJobDaoObj.getAllOldExternalJobs(deleteOlderThanDays, sourcedFrom);
  }

  async deleteJobsByIds(
    ids: string[]
  ): Promise<boolean> {
    global.logger.info("Delete jobs by ids [Service]", {
      methodName: this.deleteJobsByIds.name,
    });

    return gcpFirestoreJobDaoObj.deleteJobsByIds(ids);
  }

}

const gcpFirestoreJobServiceObj = new GcpFirestoreJobService();
export {
   gcpFirestoreJobServiceObj,
   GcpFirestoreJobService
}