import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import daos
import { countGlobalDaoObj } from "../daos/CountGlobal.dao";

// Import dtos
import { CountGlobalCandidateEntityUpdateDto, CountGlobalCommonUpdateDto, CountGlobalCompanyJobEntityUpdateDto, CountGlobalCreateDto, CountGlobalReferAndEarnEntityUpdateDto } from "../dtos/CountGlobal.dto";

// Import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

// Import models
import { DbCountGlobalDto } from "../db/models/CountGlobal.model";

class CountGlobalService {
   private async createCountGlobal(
      createData: CountGlobalCreateDto
   ): Promise<DbCountGlobalDto> {
      global.logger.info("Create Count Global [Service]", {
         createData,
      });

      return countGlobalDaoObj.createCountGlobal(createData);
   }

   async getCountGlobalByEntityType(entityType: CountGlobalDbEntityTypeEnum): Promise<QueryResponse<DbCountGlobalDto>> {
      global.logger.info("Get Count Global By Entity Type [Service]", {
         entityType
      });

      return countGlobalDaoObj.getCountGlobalByEntityType(entityType);
   }

   private async updateCountGlobalByEntityType(
      entityType: CountGlobalDbEntityTypeEnum, 
      updateData: Partial<CountGlobalCommonUpdateDto>
   ): Promise<DbCountGlobalDto> {
      global.logger.info("Update Count Global By Entity Type [Service]", {
         entityType,
         updateData
      });

      return countGlobalDaoObj.updateCountGlobalByEntityType(entityType, updateData);
   }

   private async createOrUpdateCountGlobal(
      entityType: CountGlobalDbEntityTypeEnum, 
      updateData: Partial<CountGlobalCommonUpdateDto>,
      isCountGlobalExists: boolean
   ) {
      global.logger.info("Create Or Update Count Global [Service]", {
         entityType,
         updateData,
      });

      if (isCountGlobalExists) {
         return this.updateCountGlobalByEntityType(entityType, updateData);
      } else {
         return this.createCountGlobal({ entityType, ...updateData });
      }
   }

   async createOrUpdateCountGlobalForCandidateEntityType(
      updateData: CountGlobalCandidateEntityUpdateDto,
      isCountGlobalExists: boolean
   ) {
      global.logger.info("Create Or Update Count Global For Candidate Entity Type [Service]", {
         updateData,
      });

      return this.createOrUpdateCountGlobal(
         CountGlobalDbEntityTypeEnum.CANDIDATE, 
         updateData,
         isCountGlobalExists
      );
   }

   async createOrUpdateCountGlobalForCompanyJobEntityType(
      updateData: CountGlobalCompanyJobEntityUpdateDto,
      isCountGlobalExists: boolean
   ) {
      global.logger.info("Create Or Update Count Global For Company Job Entity Type [Service]", {
         updateData,
      });

      return this.createOrUpdateCountGlobal(
         CountGlobalDbEntityTypeEnum.COMPANY_JOB, 
         updateData,
         isCountGlobalExists
      );
   }

   async createOrUpdateCountGlobalForReferAndEarnEntityType(
      updateData: CountGlobalReferAndEarnEntityUpdateDto,
      isCountGlobalExists: boolean
   ) {
      global.logger.info("Create Or Update Count Global For Refer And Earn Entity Type [Service]", {
         updateData,
      });

      return this.createOrUpdateCountGlobal(
         CountGlobalDbEntityTypeEnum.REFER_AND_EARN, 
         updateData,
         isCountGlobalExists
      );
   }
}

const countGlobalServiceObj: CountGlobalService = new CountGlobalService();
export { countGlobalServiceObj, CountGlobalService };