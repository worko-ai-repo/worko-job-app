// Import dynamoose packages
import { ObjectType } from "dynamoose/dist/General";
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import local dtos
import { PaginatedResultsWithMatchingConditionsResponse, RecordListingFilterOptions } from "../dtos/Common.dto";

/**
 * lastKeyToBase64EncodeStr
 * 
 * Encode the provided "object" into "Base64Encoded" string
 * 
 * @param {ObjectType} object [OPTIONAL]
 * @returns {undefined | string}
 */
export function lastKeyToBase64EncodeStr(object?: ObjectType): undefined | string {
    // If the provided value is null, undefined, etc
    if (!object) {
        return undefined;
    }

    return Buffer.from(
        JSON.stringify(object)
    )
    .toString("base64");
};

/**
 * base64EncodeStrToLastKey
 * 
 * Decode the provided Base64Encoded string and pass it back.
 * 
 * @param {string} str [OPTIONAL]
 * @returns {undefined | any}
 */
export function base64EncodeStrToLastKey(str?: string): undefined | ObjectType  {
    try {
        // If the provided value is null, undefined, etc
        if (!str) {
            return undefined;
        }

        return JSON.parse(
            Buffer
                .from(str, 'base64')
                .toString("utf-8")
        );
    } catch (error: any) {
        // Logger message
        global.logger.error("Unable to perform Base64Decode.", {
            filePath: __filename,
            methodName: "base64EncodeStrToLastKey",
            str: str,
            message: error.message,
        });
        return undefined;
    }
};

/**
 * getPaginatedResultsWithMatchingConditions
 * 
 * DynamoDB paginates the results from Query operations, dividing the results into pages where each page 
 * can contain up to 1 MB of data or less. An application can process the first page, then move on to the 
 * second page, and so on, ensuring that the entire result set is processed efficiently.
 * 
 * ## Pagination Details:
 * - **Single Query Limit:** A single query can only return results that fit within the 1 MB size limit.
 *   If the result set exceeds 1 MB, it is paginated.
 * - **Processing Pages:** Each page contains a subset of results. To retrieve the next set of results, 
 *   you can use the `lastKey` to start from where the previous page left off.
 * 
 * ## Problem Addressed:
 * When a frontend requests a specific `pageSize` (e.g., 25) but only receives fewer results (e.g., 16), 
 * this can cause issues by under-serving the user.
 * 
 * ## Solution:
 * The **`getPaginatedResultsWithMatchingConditions`** function is designed to handle such cases where the 
 * results may not fully match the requested page size. The function:
 * - Ensures that when fewer results are returned, the query continues to retrieve additional results 
 *   until the `pageSize` is met (or until all data is fetched).
 * - Uses a `do-while` loop to paginate the query and adjust the query parameters (`startAt` and `limit`) 
 *   dynamically, ensuring efficient processing of the results.
 * - Ensures the correct handling of both small and large datasets, providing a consistent experience for 
 *   the frontend, even if DynamoDB returns fewer items than requested.
 * 
 * ## Example Flow:
 * - If a query returns fewer than the requested `pageSize`, the function continues querying until it 
 *   fills the page size or reaches the last available result.
 * 
 * # Paginating table query results in DynamoDB:
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html
 * 
 * # REFERENCE TUTORIAL[Typescript Generics]:
 * @see https://youtu.be/EcCTIExsqmI?si=3g9M7sVRUeoL3dj7
 * 
 * # TypeScript do while
 * @see https://www.typescripttutorial.net/typescript-tutorial/typescript-do-while/
 *
 * # Programming Amazon DynamoDB with JavaScript (Pagination)
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/programming-with-javascript.html#programming-with-javascript-pagination
 * 
 * @param {Query<DbEntityDto>} query - The Dynamoose query object to execute.
 * @param {EntityListingFilterOptions} entityRecordListingFilterRequest - The filter options including pagination settings.
 * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbEntityDto>>} - The paginated results with matching conditions.
 */
export async function getPaginatedResultsWithMatchingConditions<
    DbEntityDto,
    EntityListingFilterOptions extends RecordListingFilterOptions
>(query: Query<DbEntityDto>, entityRecordListingFilterRequest: EntityListingFilterOptions): Promise<PaginatedResultsWithMatchingConditionsResponse<DbEntityDto>> {
  /**
   * The `pageSize` will come from the request payload,
   * if no `pageSize` is provided from the request payload,
   * then default page size will be `25` which we are setting in backend internally(Refer `request.helper.ts` file)
   */
  const requestedPageSize: number = entityRecordListingFilterRequest.pageSize;

  // The `lastKeyInternal` is the `lastKey` that will be used for the next batch
  let lastKeyInternal: ObjectType | undefined = entityRecordListingFilterRequest.lastKey;
  
  // The `timesQueriedInternal` is the number of requests made to AWS DynamoDB to fulfill the query response.
  let timesQueriedInternal: number = 0;
  
  // The `queriedCountInternal` is the number of items queried in AWS DynamoDB to fulfill the query response.
  let queriedCountInternal: number = 0;

  // The `remainingPageSize` will be used to limit the number of items expected to be returned in the next batch
  let remainingPageSize: number = entityRecordListingFilterRequest.pageSize;

  // The `results` will be used to store the results of the query response from DynamoDB
  let results: DbEntityDto[] = [];

  // The `responseLastKey` is the final `lastKey` that will be returned in the response to the Frontend
  let responseLastKey: ObjectType | undefined;

  // Using Do while loop to paginate the query response from DynamoDB
  do {
    // Update the query to start at the new lastKey for the next batch
    if (lastKeyInternal) {
      query = query.startAt(lastKeyInternal);
    }

    // Update the query to limit the number of items returned in the next batch
    if (remainingPageSize > 0) {
      query = query.limit(remainingPageSize);
    }

    // Execute the query
    /*****
      SAMPLE OUTPUT OF `entityResponse`, when you log `entityResponse` in the console using `console.log(entityResponse);`:
      [
        UserDetail {...},
        UserDetail {...},
        UserDetail {...},
        .
        .
        .
        lastKey: {
          SK: 'ID#swapnaJunnuAppala',
          PK: 'USR#EML#swapnaAppalaMrudula@gmail.com',
          GSI1PK: 'USR#',
          GSI1SK: 'ID#swapnaJunnuAppala'
        },
        count: 10,
        queriedCount: undefined,
        timesQueried: 1,
        populate: [Function: PopulateItems],
        toJSON: [Function: itemToJSON]
      ]
      *****/
    const entityResponse: QueryResponse<DbEntityDto> = await query.exec();

    /**
     * It updates timesQueriedInternal by adding entityResponse.timesQueried,
     * If entityResponse.timesQueried is `null` or `undefined`, the `??` (nullish coalescing operator) ensures that 0 is used instead.
     */
    timesQueriedInternal += entityResponse.timesQueried ?? 0;

    /**
     * It updates queriedCountInternal by adding entityResponse.timesQueried,
     * If entityResponse.timesQueried is `null` or `undefined`, the `??` (nullish coalescing operator) ensures that 0 is used instead.
     */
    queriedCountInternal += entityResponse.queriedCount ?? 0;

    // Add the results to the `results` array
    /*****
      SAMPLE OUTPUT OF `results`, when you log `results` in the console  using `console.log(results)`:
      [
        UserDetail {...},
        UserDetail {...},
        UserDetail {...},
        .
        .
      ]
      *****/
    results.push(...entityResponse);

    // If the number of results is equal to the page size or lastKey doesn't exist, then update the `lastKeyInternal` and `remainingPageSize`
    if (!entityResponse.lastKey || results.length === requestedPageSize) {
      lastKeyInternal = undefined;
      remainingPageSize = 0;
      responseLastKey = entityResponse.lastKey;

      // Break the do while loop and return the results of the query
      break;
    }

    // If the number of results is less than the page size and lastKey exists, then update the `lastKeyInternal` and `remainingPageSize`
    if (results.length < requestedPageSize && entityResponse.lastKey) {
      // Update the `lastKeyInternal` for the next batch
      lastKeyInternal = entityResponse.lastKey;

      // Update the `remainingPageSize` by subtracting the number of results to limit the number of items returned in the next batch
      remainingPageSize = requestedPageSize - results.length;
    }

    // Update the `responseLastKey`
    responseLastKey = entityResponse.lastKey;
  } while (lastKeyInternal && results.length < requestedPageSize);

  // Create the final results of the paginated response
  /*****
    SAMPLE OUTPUT OF `finalResults` when you log `finalResults` in the console using `console.log(finalResults);`:
    {
        '0': UserDetail {...},
        '1': UserDetail {...},
        '2': UserDetail {...},
        .
        .
        lastKey: {
            SK: 'ID#swapnaJunnuAppala',
            PK: 'USR#EML#swapnaAppalaMrudula@gmail.com',
            GSI1PK: 'USR#',
            GSI1SK: 'ID#swapnaJunnuAppala'
        },
        count: 10,
        timesQueried: 1,
        queriedCount: 0
    }
    *****/
  const finalResults: PaginatedResultsWithMatchingConditionsResponse<DbEntityDto> =
    {
      ...results,
      lastKey: responseLastKey,
      count: results.length,
      timesQueried: timesQueriedInternal,
      queriedCount: queriedCountInternal,
    };
  
  global.logger.debug(`pagination details`, {
    filePath: __filename,
    methodName: getPaginatedResultsWithMatchingConditions.name
  });

  // Return the final results of the paginated response
  return finalResults;
};