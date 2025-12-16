// import models
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";

// import services
import { companyJobServiceObj } from "../services/CompanyJob.service";

/**
 * injectCompanyJobDetails
 *
 * This function takes an array of entity DTOs and injects the companyJob details
 * into each entity DTO. It first gets the unique companyJob IDs from the entity
 * DTOs, then gets the companyJob details using the service. It creates a map of
 * companyJob IDs to companyJob details and finally adds the companyJob details
 * to each entity DTO.
 *
 * @param {EntityDto[]} entityDto - The array of entity DTOs to inject companyJob
 *   details into.
 * @returns {Promise<(EntityDto & { jobUrl: string | undefined; jobTitle: string | undefined; jdExtracted: string | undefined; })[]>} - A promise that resolves to the array of entity DTOs with companyJob details injected.
 */
export async function injectCompanyJobDetails<
  EntityDto extends {
    jobId: string;
  }
>(
  entityDto: EntityDto[]
): Promise<
  (EntityDto & {
    jobUrl: string | undefined;
    jobTitle: string | undefined;
    jdExtracted: string | undefined;
    jobCreatedByUserId: string | undefined;
    jobCreatedByCorporateUserId: string | undefined;
  })[]
> {
  // logger
  global.logger.info(`Inject company job details with the given entity`, {
    filePath: __filename,
    methodName: "injectCompanyJobDetails",
  });

  // Get unique companyJob IDs
  let uniqueCompanyJobIds: string[] = Array.from(
    new Set(entityDto.map((item: EntityDto) => item.jobId))
  );

  // Get company job details for each unique companyJob ID
  const companyJobDetails: DbCompanyJobDto[] =
    await companyJobServiceObj.getJobByIds(uniqueCompanyJobIds);

  // Create a map of companyJob IDs to companyJob details
  const companyJobDetailsMap: Map<string, DbCompanyJobDto> = new Map(
    companyJobDetails
      .filter((eachCompanyJobDetail: DbCompanyJobDto) => eachCompanyJobDetail?.id)
      .map((eachCompanyJobDetail: DbCompanyJobDto) => [
        eachCompanyJobDetail.id,
        eachCompanyJobDetail,
      ])
  );

  // Add companyJob details to each entity
  const entityWithCompanyJobDetailsResponse = await Promise.all(
    entityDto.map((eachEntityDto: EntityDto) => {
      const eachCompanyJobDetail: DbCompanyJobDto | undefined =
        companyJobDetailsMap.get(eachEntityDto.jobId);

      // Add companyJob details to each entity
      const entityWithCompanyJobDetails = {
        ...eachEntityDto,
        jobUrl: eachCompanyJobDetail?.jobUrl,
        jobTitle: eachCompanyJobDetail?.jobTitle,
        jdExtracted: eachCompanyJobDetail?.jobDescription,
        jobCreatedByUserId: eachCompanyJobDetail?.createdByUserId,
        jobCreatedByCorporateUserId: eachCompanyJobDetail?.createdByCorporateUserId,
      };

      // Return the entity with companyJob details
      return entityWithCompanyJobDetails;
    })
  );

  // return the entity with companyJob details
  return entityWithCompanyJobDetailsResponse;
}
