// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { countCompanyJobDaoObj } from "../daos/CountCompanyJob.dao";

// Import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

// Import models
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";

// Import services
import { countCompanyJobServiceObj } from "../services/CountCompanyJob.service";

export async function injectCountCompanyJobByEntityTypeDetailsHelper<
  EntityDto extends {
    id: string;
    companyId?: string;
  }
>(
  entityType: CountCompanyJobDbEntityTypeEnum,
  entityDto: EntityDto[]
): Promise<
  (EntityDto & {
    countCompanyJob?: DbCountCompanyJobDto;
  })[]
> {
  global.logger.info(`Inject count company job details with the given entity`, {
    methodName: injectCountCompanyJobByEntityTypeDetailsHelper.name,
  });

  if (!entityDto.length) {
    global.logger.warn(
      `Cannot inject count company job details to an invalid data set [HELPER]`,
      {
        methodName: injectCountCompanyJobByEntityTypeDetailsHelper.name,
        entityDtoLength: entityDto.length,
      }
    );

    return [];
  }

  const inputKeys: { PK: string; SK: string }[] = entityDto.map(
    (entity: EntityDto) => {
      if(!entity.id || !entity.companyId) {
        global.logger.warn(
          `Cannot inject count company job details to an invalid entity [HELPER]`,
          {
            methodName: injectCountCompanyJobByEntityTypeDetailsHelper.name,
            entity,
          }
        );
        
        return {
          PK: "",
          SK: "",
        };
      }

      return countCompanyJobDaoObj.preparePKAndSKForQuery(
        entity.companyId,
        entity.id,
        entityType
      );
    }
  );

  // Fetch count company job details in batches (DynamoDB limit: 100 items per batch)
  const batchSize: number = APP_CONSTANTS.AWS_DYNAMODB_BATCH_ACTION_LIMIT.GET;
  const countCompanyJobDetails: DbCountCompanyJobDto[] = [];

  for (let i = 0; i < inputKeys.length; i += batchSize) {
    const batch: {
      PK: string;
      SK: string;
    }[] = inputKeys.slice(i, i + batchSize);
    const batchResults =
      await countCompanyJobServiceObj.getBatchCountCompanyJobByInputKeys(batch);
    countCompanyJobDetails.push(...batchResults);
  }

  // Create a map for O(1) lookups
  const countCompanyJobMap: Map<string, DbCountCompanyJobDto> = new Map(
    countCompanyJobDetails.map((countCompanyJob: DbCountCompanyJobDto) => [
      countCompanyJob.jobId,
      countCompanyJob,
    ])
  );

  // Attach count company job details to the entity
  return entityDto.map((entity: EntityDto) => {
    const countCompanyJob: DbCountCompanyJobDto | undefined =
      countCompanyJobMap.get(entity.id);

    return {
      ...entity,
      countCompanyJob,
    };
  });
}
