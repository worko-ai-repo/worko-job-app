
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { interviewDaoObj } from "../daos/UserInterview.dao";
import { InterviewFilterOptions } from "../dtos/UserInterview.dto";
import { DbInterviewDto } from "../db/models/UserInterview.model";

class InterviewService {
  /**
   * listUserInterviewByEmail
   * Returns paginated list of interviews based on filters.
   */
  async listUserInterviewByEmail(filter: InterviewFilterOptions) {
    global.logger.info("List Interviews by Email [service]", {
      methodName: this.listUserInterviewByEmail.name,
    });
    return interviewDaoObj.getAllUserInterviewsByFilterOptions(filter);
  }

  /**
   * listUserInterviewDetailsById
   * Returns interview details by id (via GSI1).
   */
  async listUserInterviewDetailsById(interviewId: string) {
    global.logger.info("Get Interview Details [service]", {
      methodName: this.listUserInterviewDetailsById.name,
    });
    return interviewDaoObj.getUserInterviewById(interviewId);
  }

  /**
   * getUserInterviewsByEmailIds
   *
   * Retrieves interview details for multiple email IDs in batch.
   * This method fetches all interviews for the given email IDs and returns
   * a map of email to interviews array for easy lookup.
   *
   * @param {string[]} emailIds - Array of email IDs to fetch interviews for
   * @returns {Promise<Map<string, DbInterviewDto[]>>} A map where keys are email IDs and values are arrays of interview details
   */
  async getUserInterviewsByEmailIds(
    emailIds: string[]
  ): Promise<Map<string, DbInterviewDto[]>> {
    global.logger.info("Get User Interviews by Email IDs [service]", {
      methodName: this.getUserInterviewsByEmailIds.name,
      emailIdsCount: emailIds.length,
    });

    // Fetch interviews for all email IDs in parallel
    const interviewPromises: Promise<QueryResponse<DbInterviewDto>>[] =
      emailIds.map((emailId: string) =>
        interviewDaoObj.getUserInterviewByEmail(emailId)
      );

    const interviewResults: QueryResponse<DbInterviewDto>[] =
      await Promise.all(interviewPromises);

    // Create a map of email to interviews array
    const interviewMap: Map<string, DbInterviewDto[]> = new Map();

    interviewResults.forEach((interviewResponse: QueryResponse<DbInterviewDto>, index: number) => {
      const emailId: string = emailIds[index];
      const interviews: DbInterviewDto[] = interviewResponse.count
        ? Array.from(interviewResponse)
        : [];
      interviewMap.set(emailId, interviews);
    });

    return interviewMap;
  }
}

const interviewServiceObj = new InterviewService();
export { interviewServiceObj, InterviewService };
