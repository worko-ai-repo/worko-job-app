1. File names
   1. `EntityName`-> `ReferAndEarn`
   2. `EntityName.router.ts` -> `ReferAndEarn.router.ts`
   3. `EntityName.controller.ts` -> `ReferAndEarn.controller.ts`
   4. `EntityName.service.ts` -> `ReferAndEarn.service.ts`
   5. `EntityName.dao.ts` -> `ReferAndEarn.dao.ts`
   6. `EntityName.model.ts` -> `ReferAndEarn.model.ts`

2. Function names:
   1. create
      1. `create{EntityName}` -> `createReferAndEarn`
   2. retrieve
      1. `get{EntityName}` 
      2. `get{EntityName}ById` 
      3. `get{EntityName}ByFilterOptions`  
      4. `get{EntityName}By{AttributeName}`
   3. delete
      1. `delete{EntityName}` 
      2. `delete{EntityName}ById`  
      3. `delete{EntityName}By{AttributeName}`
   4. update
      1. `update{EntityName}` 
      2. `update{EntityName}ById`  

3. Mostly used Utils
   1. HttpStatusCode
   2. RequestValidationError
   3. BaseError
   4. HttpMethodCode

4. Dtos
   1. {EntityName}CreateApiDto -> for api dto
   2. {EntityName}CreateDto -> for internal purpose

5. Joi schemas
   1. {EntityName}CreateApiDtoValidation

6. User imports in alphabetical order and installed libraries at top
ex:-
```ts
// Load the npm packages
import { Request, Response, NextFunction } from "express";

// import dtos
import {UserJobApplicationUpdateApiDTO,} from "../dtos/UserJobApplication.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  RecordListingResponseDTO,
} from "../dtos/Common.dto";

// import enums
import { UserType } from "../enums/User.enum";

// import helpers
import { RequestHelper } from "../helpers/request.helper";
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";

// import models
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbUserDetailDto } from "../db/models/UserDetail.model";

// import services
import { userJobApplicationServiceObj } from "../services/UserJobApplication.service";
import userDetailServiceObj from "../services/UserDetail.service";

// import schemas
import {
  UserCreateJobApplicationDTOValidation,
  userJobApplicationFilterDtoValidation,
  userJobApplicationRequestFeedbackValidation,
  userJobApplicationUpdateValidation,
} from "../schemas/UserJobApplication.schema";

// import types
import { JobApplicationWithUserDetailsType } from "../types/UserJobApplication.type";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { RequestValidationError } from "../utils/errors.util";
```

7. Enums Naming
   `{EntityName}{Attribute}{Enum}` -> `ReferAndEarnStatusEnum`

8. DB Models
```ts
// Example

/**
* createdByUserId
* 
* @description
* @reference `id` attribute of `UserDetail.model.ts`
* @todo 
*/
createdByUserId?: string;
```

9. Js docs for function
```ts

  /**
   * {functionName}
   *
   * {description}
   *
   * @param {type} paramOne - description
   * @param {type} paramTwo - description
   * @param {type} jobApplicationRequestBody - The data required to create a new job application.
   * @throw {BaseError} -
   * @returns {Promise<type>} - A promise that resolves to an object representing the created job application.
   */
```

10. CRUD order in every file

11. Don't use `try-catch` in `dao` and`service`, use in `controller` only

12. Don't use `replace`, always use `strtr`

13. try to avoid hard coded strings
```ts
ReferAndEarnModel.query("PK")
      .eq(this.partitianKey.replace("{primaryEmail}", email))
      .where("SK")
      .beginsWith(this.sortKeys.SK_REFER_AND_EARN_ID.strtr({
        "{id}": ""
      }))
      .exec();
```

14. In dao,service the way of exporting 
```ts
// dao

// `{entityName}DaoObj` 
const referAndEarnDaoObj = new ReferAndEarnDao();
export { referAndEarnDaoObj, ReferAndEarnDao };



// `{entityName}ServiceObj` 
const referAndEarnServiceObj = new ReferAndEarnService();
export { referAndEarnServiceObj, ReferAndEarnService };
```

15. controller function basic layout
16. Version control basic flow:
```sh
Here are the guide for journey of creating a branch, working on it, pushing the changes to remote, and finally raising the PR.
1. Checkout to dev Branch;
    1. > git checkout dev
2. Update dev Branch;
    1. > git pull origin dev
3. Create a New Feature Branch;
    1. > git checkout -b feature-branch-1
4. Work on the Task
5. Add and Commit Your Changes
    1. > git add .
    2. > git commit -m "Descriptive message about what was changed or implemented"
6. Push Changes to Remote
    1. > git push origin feature-branch-1
7. Keep dev Branch Updated
    1. > git checkout dev
    2. > git pull origin dev
8. Merge dev into Your Feature Branch
    1. > git checkout feature-branch-1
    2. > git merge dev
9. Resolve conflict if any
    1. > git add .
    2. > git commit -m "Resolved conflicts with dev branch"
10. Push the Merged Changes
    1. > git push origin feature-branch-1
11. Raise a Pull Request
    1. Create a pull request (PR) on your repository's platform (GitHub, GitLab, Bitbucket, etc.) from feature-branch-1 into dev. Ensure you provide a clear description of the changes and any relevant context or instructions for the reviewers.
```