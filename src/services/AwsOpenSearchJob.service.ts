import { awsOpenSearchJobDaoObj } from "../daos/AwsOpenSearchJob.dao";

class AwsOpenSearchJobService {
  /**
   * getIndexName
   *
   * Retrieves the index name used for job data storage.
   *
   * @returns {string} - The name of the index.
   */
  getIndexName(): string {
    return awsOpenSearchJobDaoObj.IndexName;
  }

  /*
  private async attachOpensearchJobsWithCompanyDetails(
    jobListingResponse: AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    >,
    jobListingFilterRequest: JobListingFilterOptions,
  ): Promise<AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>> {
    if (!jobListingFilterRequest.includeCompanyDetails) {
      return jobListingResponse as AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>;
    }

    // Destructure the response
    const { pagination, data: jobsData } = jobListingResponse;

    if(!jobsData.length) {
      return jobListingResponse as AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>
    }

    // Partition jobs by companyId in a single iteration
    const jobsWithCompanyId: DbJobAwsOpensearchDto[] = [];
    const jobsWithoutCompanyId: DbJobAwsOpensearchDto[] = [];

    jobsData.forEach((job: DbJobAwsOpensearchDto) => {
      if (job.companyId) {
        jobsWithCompanyId.push(job);
      } else {
        jobsWithoutCompanyId.push(job);
      }
    });

    // Attach company details
    const jobsWithCompanyDetails: (DbJobAwsOpensearchDto & {
      companyDetails: DbCompanyDetailDto | undefined;
    })[] = await attachCompanyDetails<DbJobAwsOpensearchDto>(jobsWithCompanyId);

    const finalResponseWithPagination: AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails> =
      {
        data: [...jobsWithCompanyDetails, ...jobsWithoutCompanyId],
        pagination: pagination,
      };

    return finalResponseWithPagination;
  }

  async getAllJobsFromS3VectorAndOpensearchByFilterOptions(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>> {
    global.logger.info("Get All Jobs from S3 Vector and Opensearch [Service]", {
      methodName: this.getAllJobsFromS3VectorAndOpensearchByFilterOptions.name,
    });

    const s3VectorFilterOptions: AwsS3VectorJobListingFilterOptions = {
      ...jobListingFilterRequest,
    }

    const s3VectorMatchingJobs: AwsS3VectorJobGetParsedResponseDto = await awsS3VectorJobServiceObj.getAllAwsS3VectorJobsByFilterOptions(s3VectorFilterOptions);

    if (!s3VectorMatchingJobs?.jobs?.length) {
      global.logger.warn("No Jobs found in S3 Vector", {
        methodName:
          this.getAllJobsFromS3VectorAndOpensearchByFilterOptions.name,
      });

      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: jobListingFilterRequest.pageSize,
          lastKey: undefined,
          // sortOrder: jobListingFilterRequest.sortOrder,
          timesQueried: 0,
          queriedCount: 0,
        },
      };
    }

    const s3VectorJobIds: string[] = s3VectorMatchingJobs.jobs.map(
      (
        job: AwsS3VectorJobMatchingScoreDto
      ) => job.jobId
    );

    const jobListingResponse: AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    > = await awsOpenSearchJobDaoObj.getAllJobsByListOfS3VectorJobIds(
      s3VectorJobIds,
      jobListingFilterRequest,
    );

    const finalResponse: AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails> = await this.attachOpensearchJobsWithCompanyDetails(
      jobListingResponse,
      jobListingFilterRequest,
    )

    // attach matching score details to jobs
    finalResponse.data = finalResponse.data.map((job: DbJobAwsOpensearchDto) => {
      return {
        ...job,
        initialMatchingScoreDetails: s3VectorMatchingJobs.jobs.find(
          (s3VectorJob: AwsS3VectorJobMatchingScoreDto) => s3VectorJob.jobId === job.id
        ),
      };
    });

    finalResponse.pagination.s3VectorLastKey = s3VectorMatchingJobs.s3VectorLastKey;
    return finalResponse;
  }

  async createBulkJobs(
    bulkJobData: (
      DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ): Promise<boolean> {
    // global logger
    global.logger.debug(`Create bulk jobs [SERVICE]`, {
      filePath: __filename,
      methodName: this.createBulkJobs.name,
    });

    return awsOpenSearchJobDaoObj.createBulkJobs(bulkJobData);
  }

  transformFantasticJobToAwsOpensearchJobDto(
    ulidId: string,
    externalJob: FantasticJobApiResponse
  ): DbJobAwsOpensearchDto {
    const dbJobDto: DbJobAwsOpensearchDto = {
      id: ulidId,
      externalJobId: externalJob.id,
      sourcedFrom: JobSourcedFromEnum.FANTASTIC_JOB,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      jobTitle: externalJob.title.toLowerCase(),
      typeofEmployment: (Array.isArray(externalJob.employment_type) && externalJob.employment_type.length)
        ? externalJob.employment_type.join(", ").toUpperCase()
        : undefined,
      location: {
        city: externalJob?.cities_derived?.toLowerCaseArray() ?? [],
        state: externalJob?.regions_derived?.toLowerCaseArray() ?? [],
        country: externalJob?.countries_derived?.toLowerCaseArray() ?? [],
        fullLocation: externalJob?.locations_derived?.toLowerCaseArray() ?? [],
      },
      jobDescription: externalJob.description_html
        ? htmlToTextHelperObj.htmlToText(externalJob.description_html)
        : externalJob.description_text,
      htmlJobDescription: externalJob.description_html,
      jobPostedDate: externalJob.date_posted,
      jobCreatedDate: externalJob.date_created,
      jobUrl: externalJob.url,
      status: JobStatusEnum.PUBLISHED,
      workMode: externalJob.remote_derived
        ? JobWorkModeEnum.WFH
        : JobWorkModeEnum.WFO,
      companyName: externalJob.organization.toUpperCase() ?? undefined,
      companyUrl: externalJob.organization_url ?? undefined,
      companyLogoUrl: externalJob.organization_logo ?? undefined,
      isDeleted: false,
    };

    return dbJobDto;
  }

  transformBrightDataJobToAwsOpensearchJobDto(
    ulidId: string,
    externalJob: BrightDataJobApiResponse
  ): DbJobAwsOpensearchDto {
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

    const dbJobDto: DbJobAwsOpensearchDto = {
      id: ulidId,
      externalJobId: job_posting_id ?? ulidId,
      sourcedFrom: JobSourcedFromEnum.BRIGHT_DATA_JOB,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
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

  async getAllJobsByFilterOptions(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>
  > {
    global.logger.info("Get All Jobs by Filter Options [Service]", {
      methodName: this.getAllJobsByFilterOptions.name,
    });

    const jobListingResponse: AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    > = await awsOpenSearchJobDaoObj.getAllJobsByFilterOptions(
        jobListingFilterRequest
      );

    const jobListingResponseWithCompanyDetails: AwsOpensearchRecordListingResponseDTO<JobsWithOrWithoutEntityDetails> = await this.attachOpensearchJobsWithCompanyDetails(
      jobListingResponse,
      jobListingFilterRequest
    );

    if(jobListingFilterRequest.includeCountCompanyJobEntityJobApplication) {
      const jobsWithCompanyDetails = jobListingResponseWithCompanyDetails.data;
      const jobsWithCountCompanyJobDetails = await injectCountCompanyJobByEntityTypeDetailsHelper<(
        DbJobAwsOpensearchDto
      )>(
        CountCompanyJobDbEntityTypeEnum.JOB_APPLICATION,
        jobsWithCompanyDetails
      );

      return {
        data: jobsWithCountCompanyJobDetails,
        pagination: jobListingResponseWithCompanyDetails.pagination,
      }
    }

    return jobListingResponseWithCompanyDetails;
  }

  async scriptBulkUploadJobs(
    formattedJobListingArray: (
      | DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ) {
    global.logger.info("Bulk upload jobs [Service]", {
      methodName: this.scriptBulkUploadJobs.name,
    });

    return awsOpenSearchJobDaoObj.createBulkJobs(formattedJobListingArray);
  }

  async deleteOldUnappliedExternalJobs(
    jobIds: string[]
  ): Promise<DeleteByQuery_Response> {
    global.logger.info("Delete old unapplied external jobs [Service]", {
      methodName: this.deleteOldUnappliedExternalJobs.name,
    });

    return awsOpenSearchJobDaoObj.deleteOldUnappliedExternalJobByIds(jobIds);
  }

  async softDeleteOldAppliedExternalJobs(    
    deleteOlderThanDays: number,
    sourcedFrom: JobSourcedFromEnum
  ): Promise<UpdateByQuery_Response> {
    global.logger.info("Soft delete old applied external jobs [Service]", {
      methodName: this.softDeleteOldAppliedExternalJobs.name,
    });

    // Prepare Update Object
    const updateObject: Partial<JobUpdateInternalDto> = {
      isDeleted: true,
      status: JobStatusEnum.CLOSED,
    };

    return awsOpenSearchJobDaoObj.softDeleteOldAppliedExternalJobs(updateObject, deleteOlderThanDays, sourcedFrom);
  }

  async updateJobByIdOnAwsOpensearch(
    id: string,
    updateDto: Partial<JobUpdateInternalDto>
  ): Promise<Update_Response> {
    // logger
    global.logger.info(`Update Job By Id From aws opensearch [Service]`, {
      methodName: this.updateJobByIdOnAwsOpensearch.name,
    });

    return awsOpenSearchJobDaoObj.updateJobById(id, updateDto);
  }
  */
}

const awsOpenSearchJobServiceObj = new AwsOpenSearchJobService();
export { awsOpenSearchJobServiceObj, AwsOpenSearchJobService };
