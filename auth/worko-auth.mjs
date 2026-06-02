/**
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html
 *
 * @see https://github.com/awslabs/aws-jwt-verify
 */

// A simple token-based authorizer example to demonstrate how to use an authorization token
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value,
// the authorizer returns an HTTP 500 status code.
// Note that token values are case-sensitive.
import { CognitoJwtVerifier } from "aws-jwt-verify";
import UrlPattern from "url-pattern";

// Verifier that expects valid access tokens:
/**
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html#amazon-cognito-user-pools-using-tokens-manually-inspect
 *
 * Multiple User Pools
 * @see https://github.com/awslabs/aws-jwt-verify?tab=readme-ov-file#trusting-multiple-user-pools
 */
const verifier = CognitoJwtVerifier.create([
  {
    userPoolId: process.env.WORKO_USER_POOL,
    tokenUse: "access",
    /**
     * @description
     * 1. If we don't specify client id explicitly as null then it will throw below error:
     *    "ParameterValidationError: clientId must be provided or set to null explicitly"
     */
    clientId: null, // Accept tokens from any client in this User Pool
  },
  {
    userPoolId: process.env.WORKO_AGENCY_USER_POOL,
    tokenUse: "access",
    clientId: process.env.WORKO_AGENCY_PASSWORD_LOGIN_CLIENT_ID,
  },
]);

// Constants for HTTP methods
var HttpMethodsConstants = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  ANY: "ANY",
};

/**
 * handler
 *
 * Handles the incoming event by verifying the token and generating the appropriate policy.
 *
 * @param {Object} event - The event object containing the request details.
 * @param {Object} context - The context object containing the execution environment details.
 * @param {Function} callback - The callback function to be called once the handler is complete.
 * @return {Promise<void>} - A promise that resolves when the handler is complete.
 */
export const handler = async function (event, context, callback) {
  // Consoles
  console.log("event: ", event);

  // Define necessary default values
  let access = "allow";
  let username = null;
  let email = null;
  let groups = [];
  // Check if path is not whitelisted then ensure the token is valid.
  if (!checkWhitelistedUrl(event.path, event.requestContext.httpMethod)) {
    // Get the bearerToken from the request header
    let bearerToken = event.headers.authorization;
    if (bearerToken == undefined) {
      bearerToken = event.headers.Authorization;
    }

    if (bearerToken == undefined && event.queryStringParameters) {
      bearerToken =
        event.queryStringParameters?.authorization ||
        event.queryStringParameters?.Authorization;
    }

    const token = bearerToken.split(" ")[1];

    try {
      // Multi-pool verification - automatically detects user pool
      let payload = await verifier.verify(token);

      // Determine user type from verified payload
      const isWorkoAgencyPoolUser = payload.iss.includes(
        process.env.WORKO_AGENCY_USER_POOL
      );

      const isWorkoPoolUser = payload.iss.includes(
        process.env.WORKO_USER_POOL
      );

      if (isWorkoAgencyPoolUser) {
        console.log("Worko Agency user pool detected");

        // Agency user - check if accessing allowed URLs
        const isAgencyAllowedUrl = isAgencyUrl(
          event.path,
          event.requestContext.httpMethod
        );

        if (!isAgencyAllowedUrl) {
          console.log(
            "Agency user trying to access restricted API:",
            event.path
          );
          access = "deny";
          throw new Error("Agency user not allowed to access this API");
        }

        console.log("Agency user verified successfully");
      } else if(isWorkoPoolUser) {
        console.log("Worko user pool detected");

        // check if admin url
        const isAnAdminUrl = isAdminUrl(
          event.path,
          event.requestContext.httpMethod
        );

        // check if corporate admin url
        const isACorporateAdminUrl = isCorporateAdminUrl(
          event.path,
          event.requestContext.httpMethod
        );

        // check if corporate recruiter url
        const isACorporateRecruiterUrl = isCorporateRecruiterUrl(
          event.path,
          event.requestContext.httpMethod
        );

        // check if evaluator url
        const isAnEvaluatorUrl = isEvaluatorUrl(
          event.path,
          event.requestContext.httpMethod
        );

        /**
         * groups (optional): verify that the JWT's cognito:groups claim matches your expectation.
         * Provide a string, or an array of strings to allow multiple groups (i.e. one of these groups must match the JWT).
         */
        if (isAnEvaluatorUrl) {
          // Re-verify with group constraints for corporate users
          payload = await verifier.verify(token, {
            groups: [
              "admin",
              "corporate-admin",
              "corporate-recruiter",
              "evaluator",
            ],
          });
        } else if (isACorporateRecruiterUrl) {
          payload = await verifier.verify(token, {
            groups: ["admin", "corporate-recruiter", "corporate-admin"],
          });
        } else if (isACorporateAdminUrl) {
          payload = await verifier.verify(token, {
            groups: ["admin", "corporate-admin"],
          });
        } else if (isAnAdminUrl) {
          payload = await verifier.verify(token, {
            groups: ["admin"],
          });
        } else {
          payload = await verifier.verify(token);
        }

        console.log("Worko user pool verified successfully");
      } else {
        console.log("Unknown user pool detected");
        access = "deny";
        throw new Error("Unknown user pool");
      }

      /*
      Sample Outputs:- 
      {
        sub: 'b1d35daa-c061-7023-4ae8-22c6c97548a4',
        'cognito:groups': [ 'ap-south-1_xGreJKkNc_LinkedIn' ],
        iss: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_xGreJKkNc',
        version: 2,
        client_id: '16sh5s2bo3169886fdm8gtp0e4',
        origin_jti: '61a9bb42-89e7-4a8b-b99c-11dfbaab4c70',
        token_use: 'access',
        scope: 'phone openid profile email',
        auth_time: 1737110126,
        exp: 1737196526,
        iat: 1737110126,
        jti: 'd1905d55-4ae8-4222-8e04-5876294da3bd',
        username: 'linkedin_6dm2uthdb8'
      }, */
      /*
      {
        sub: '1lql4bdit9k1vrmdfms4cf2fmi',
        token_use: 'access',
        scope: 'default-m2m-resource-server-mzjxgt/read',
        auth_time: 1752843922,
        iss: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_xGreJKkNc',
        exp: 1752847522,
        iat: 1752843922,
        version: 2,
        jti: 'bce38927-7062-4bab-a70a-f9954429e5e6',
        client_id: '1lql4bdit9k1vrmdfms4cf2fmi',
      }
      */
      console.log("payload: ", payload);

      /**
       * @description As of now "Agency" user does not have any cognito user groups,
       * if added in the future, this will need to be updated
       */
      groups = isWorkoAgencyPoolUser ? [] : payload["cognito:groups"] || [];

      username = payload.sub;
      email = payload?.email;

      // Log user pool source
      console.log(
        "User pool source:",
        isWorkoAgencyPoolUser ? "worko agency user pool" : "worko user pool"
      );

      access = "allow";
    } catch (error) {
      console.log("Token is not valid!");
      console.error(error);
      access = "unauthorized";
    }
  }

  switch (access) {
    case "allow":
      callback(
        null,
        generatePolicy(
          "user",
          "Allow",
          event.methodArn,
          username,
          email,
          groups
        )
      );
      break;
    case "deny": // if candidate access employee or admin api
      callback(
        null,
        generatePolicy("user", "Deny", event.methodArn, username, email, groups)
      );
      break;
    case "unauthorized":
      callback("Unauthorized"); // Return a 401 Unauthorized response
      break;
    default:
      callback("Error: Invalid token"); // Return a 500 Invalid token response
  }
};

/**
 * generatePolicy
 *
 * Help function to generate an IAM policy
 * Generates an IAM policy document based on the given parameters.
 *
 * @param {string} principalId - The principal user identifier associated with the token supplied by the client.
 * @param {string} effect - The effect of the policy. Should be either "Allow" or "Deny".
 * @param {string} resource - The resource for which the policy applies.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string[]} groups - The groups the user belongs to.
 *
 * @returns {Object} The generated IAM policy document.
 */
var generatePolicy = function (
  principalId,
  effect,
  resource,
  username,
  email,
  groups
) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    userId: username,
    userEmail: email,

    /**
     * @todo: Need to send userPoolId as well
     */
    // userPoolId

    booleanKey: true,
    groups: JSON.stringify(groups),
  };

  return authResponse;
};

/**
 * checkMatchingPattern
 *
 * This function checks if a given URL matches any patterns in the provided list
 * and if the HTTP method is allowed for that URL pattern. It iterates through the
 * list of URL patterns and uses the UrlPattern library to determine if the given
 * URL matches any pattern. It also checks if the HTTP method matches the allowed
 * method for the URL pattern.
 *
 * @param {string} url - The URL to be checked.
 * @param {Array} urlList - The list of URL patterns and methods to check against.
 * @param {string} httpMethod - The HTTP method to check against.
 * @returns {boolean} - True if the URL and HTTP method match any pattern in the list, else false.
 */
var checkMatchingPattern = function (url, urlList, httpMethod) {
  let result = false;

  for (let i = 0; i < urlList.length; i++) {
    var pattern = new UrlPattern(urlList[i].path);
    const matchResult = pattern.match(url);

    if (
      matchResult != null &&
      (urlList[i].method === httpMethod ||
        urlList[i].method === HttpMethodsConstants.ANY)
    ) {
      result = true;
      break;
    }
  }

  return result;
};

/**
 * checkWhitelistedUrl
 *
 * Checks if a given URL is whitelisted and matches the given HTTP method.
 *
 * @param {string} url The URL to check.
 * @param {string} httpMethod The HTTP method to check against.
 * @returns {boolean} True if the URL is whitelisted and matches the given HTTP method, false otherwise.
 */
var checkWhitelistedUrl = function (url, httpMethod) {
  const urlList = [
    //sitemap
    {path: '/sitemap/sitemap.xml*', method: HttpMethodsConstants.GET },
    
    // company routes
    { path: "/company*", method: HttpMethodsConstants.GET },
    { path: "/company/:beginsWith", method: HttpMethodsConstants.GET },
    { path: "/company/request", method: HttpMethodsConstants.POST },

    // blog routes
    { path: "/blog*", method: HttpMethodsConstants.GET },

    // user routes
    { path: "/user/register/candidate", method: HttpMethodsConstants.ANY },
    { path: "/user/register/employee", method: HttpMethodsConstants.ANY },
    { path: "/user/:email(*)/cv", method: HttpMethodsConstants.ANY },
    { path: "/user/request-otp/force-change-password", method: HttpMethodsConstants.POST },
    { path: "/user/verify-otp/force-change-password", method: HttpMethodsConstants.POST },

    // file routes
    { path: "/file/gsu2u/USER_RESUME", method: HttpMethodsConstants.ANY },
    { path: "/file/gsu2u/CAREER_RESUME", method: HttpMethodsConstants.ANY },
    { path: "/file/gsu2u/CAND_SUBMIT_CV_JOB", method: HttpMethodsConstants.POST },

    // career routes
    { path: "/career", method: HttpMethodsConstants.ANY },

    // corporate routes
    { path: "/corporate", method: HttpMethodsConstants.ANY },
    {
      path: "/corporate/:email(*)/verify-otp",
      method: HttpMethodsConstants.ANY,
    },
    {
      path: "/corporate/:email(*)/request-otp",
      method: HttpMethodsConstants.ANY,
    },

    // corporate user routes
    { path: "/corporate-user/", method: HttpMethodsConstants.POST },

    // corporate invite routes
    { path: "/corporate-invite/:id", method: HttpMethodsConstants.GET },

    // request evaluation routes
    {
      path: "/request-evaluation/:jobApplicationId/:evaluationRequestId",
      method: HttpMethodsConstants.GET,
    },

    // job routes
    { path: "/job/:id", method: HttpMethodsConstants.GET },
    { path: "/job/", method: HttpMethodsConstants.GET },
    { path: "/job", method: HttpMethodsConstants.GET },

    // Agency User Invite Routers
    { path: "/agency-invite/:id", method: HttpMethodsConstants.GET },

    // Candidate Parsed Cv Routers
    { path: "/candidate-parsed-cv/parse/submit-form", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/create/submit-form", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/move-to-applicant/submit-form", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/reset-temporary-credentials", method: HttpMethodsConstants.POST }
  ];

  const result = checkMatchingPattern(url, urlList, httpMethod);

  return result;
};

/**
 * isEvaluatorUrl
 *
 * Checks if a given URL is an Evaluator URL and matches the given HTTP method.
 *
 * @param {string} url - The URL to check.
 * @param {string} httpMethod - The HTTP method to check against.
 * @returns {boolean} - True if the URL and HTTP method match any pattern in the
 *                      Evaluator URL list, otherwise false.
 */
var isEvaluatorUrl = function (url, httpMethod) {
  const urlList = [
    //job application interview schedular
    { path: "/user-job-interview/*", method: HttpMethodsConstants.ANY },
    
    // Request evaluation routers
    { path: "/request-evaluation*", method: HttpMethodsConstants.GET },

    // Response evaluation routers
    { path: "/response-evaluation/", method: HttpMethodsConstants.POST },
    { path: "/response-evaluation*", method: HttpMethodsConstants.GET },

    // Evaluator detail routers
    { path: "/evaluator-detail*", method: HttpMethodsConstants.GET },

    // User Interview Routers
    {
      path: "/user/interview/request",
      method: HttpMethodsConstants.POST,
    },

    // Candidate parsed cv routers
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.GET },

    // File routers
    {
      path: "/file/gsu2v/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_REFERRAL_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CAND_SUBMIT_CV_JOB",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/ADMIN_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/:id/:cloudFileName/BULK_CVS*",
      method: HttpMethodsConstants.GET,
    },
  ];

  const result = checkMatchingPattern(url, urlList, httpMethod);
  return result;
};

/**
 * isCorporateRecruiterUrl
 *
 * This function checks if a given URL is a Corporate Recruiter URL and matches
 * the given HTTP method. It uses a predefined list of URL patterns and methods
 * to determine if the specified URL should bypass token validation/verification.
 *
 * @param {string} url - The URL to be checked.
 * @param {string} httpMethod - The HTTP method to check against.
 * @returns {boolean} - True if the URL and HTTP method match any pattern in the
 *                      Corporate Recruiter URL list, otherwise false.
 */
var isCorporateRecruiterUrl = function (url, httpMethod) {
  const urlList = [
    //job application interview schedular
    { path: "/user-job-interview/*", method: HttpMethodsConstants.ANY },

    // internal job application routes
    {
      path: "/job-application/:id/corp-action",
      method: HttpMethodsConstants.PATCH,
    },
    {
      path: "/job-application/:id/hired-from-other-portal",
      method: HttpMethodsConstants.PUT,
    },
    {
      path: "/job-application/bulk-update",
      method: HttpMethodsConstants.PATCH,
    },

    // job routes
    { path: "/job/", method: HttpMethodsConstants.POST },
    { path: "/job/parsejd", method: HttpMethodsConstants.POST },
    { path: "/job/bulk-update", method: HttpMethodsConstants.PATCH },

    // corporate user routes
    { path: "/corporate-user/*", method: HttpMethodsConstants.GET },

    // corporate invite routes
    { path: "/corporate-invite/", method: HttpMethodsConstants.POST },
    { path: "/corporate-invite/*", method: HttpMethodsConstants.GET },
    // { path: "/corporate-invite/*", method: HttpMethodsConstants.PATCH },

    // corporate bulk jd routes
    { path: "/corporate-bulk-jd/*", method: HttpMethodsConstants.ANY },

    // corporate bulk jd resume routes
    { path: "/corporate-bulk-jd-resume/*", method: HttpMethodsConstants.ANY },

    // Request evaluation routers
    { path: "/request-evaluation/", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation*", method: HttpMethodsConstants.GET },

    // Response evaluation routers
    { path: "/response-evaluation*", method: HttpMethodsConstants.GET },

    // Evaluator detail routers
    { path: "/evaluator-detail*", method: HttpMethodsConstants.GET },

    // User Job Application Author Note Routers
    {
      path: "/job-application-author-note/",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application/find-matching-score",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },

    // Count Company Job routers
    {
      path: "/counts/:companyId/:jobId/:entityType/company-job",
      method: HttpMethodsConstants.GET,
    },

    // Count Company Routers
    {
      path: "/counts/:companyId/:entityType/company",
      method: HttpMethodsConstants.GET,
    },

    // Agency User Invite Routers
    { path: "/agency-invite/", method: HttpMethodsConstants.POST },
    { path: "/agency-invite*", method: HttpMethodsConstants.GET },
    { path: "/agency-invite/corp-action", method: HttpMethodsConstants.PATCH },
    { path: "/agency-invite/action-type", method: HttpMethodsConstants.PATCH },

    // Agency Job Assignment Routers
    { path: "/agency-job-assignment/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-job-assignment/bulk/remove-jobs", method: HttpMethodsConstants.PATCH },
    { path: "/agency-job-assignment*", method: HttpMethodsConstants.GET },

    // File routers
    {
      path: "/file/gsu2u/AGENCY_INVITE_CONTRACT_COPY",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_INVITE_CONTRACT_COPY",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2u/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CAND_SUBMIT_CV_JOB",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_REFERRAL_CV",
      method: HttpMethodsConstants.POST,
    },

    // Agency User Submission Routers
    { path: "/agency-user-submission*", method: HttpMethodsConstants.GET },
    { path: "/agency-user-submission/:id", method: HttpMethodsConstants.GET },
    { path: "/agency-user-submission/find-matching-score", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/reject-applicant", method: HttpMethodsConstants.PATCH },
    { path: "/agency-user-submission/reject-applicant/bulk", method: HttpMethodsConstants.PATCH },

    // User Interview Routers
    {
      path: "/user/interview/request",
      method: HttpMethodsConstants.POST,
    },

    // Corporate Candidate Profile Routers
    { path: "/corporate-candidate-profile*", method: HttpMethodsConstants.GET },
    { path: "/corporate-candidate-profile/resumes", method: HttpMethodsConstants.POST },

    // Candidate Parsed Cv Routers
    { path: "/candidate-parsed-cv/search-in-db/corp-action*", method: HttpMethodsConstants.GET },
    { path: "/candidate-parsed-cv/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.PATCH },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.GET },
    { path: "/candidate-parsed-cv/refresh", method: HttpMethodsConstants.POST },

    // Bulk source type resume routers
    { path: "/bulk-source-type-resume/", method: HttpMethodsConstants.POST },

    // Candidate Job Matching Routers
    { path: "/candidate-job-matching/:id", method: HttpMethodsConstants.GET },
    { path: "/candidate-job-matching*", method: HttpMethodsConstants.GET },
  ];

  const result = checkMatchingPattern(url, urlList, httpMethod);
  return result;
};

/**
 * isCorporateAdminUrl
 *
 * Checks if a given URL is a Corporate Admin URL and matches the given HTTP method.
 *
 * @param {string} url The URL to check.
 * @param {string} httpMethod The HTTP method to check against.
 * @returns {boolean} True if the URL is a Corporate Admin URL and matches the given HTTP method, false otherwise.
 */
var isCorporateAdminUrl = function (url, httpMethod) {
  const urlList = [
    //job application interview schedular
    { path: "/user-job-interview/*", method: HttpMethodsConstants.ANY },

    // job application routes
    {
      path: "/job-application/:id/corp-action",
      method: HttpMethodsConstants.PATCH,
    },
    {
      path: "/job-application/:id/hired-from-other-portal",
      method: HttpMethodsConstants.PUT,
    },
    {
      path: "/job-application/bulk-update",
      method: HttpMethodsConstants.PATCH,
    },

    // job routes
    { path: "/job/:jobId/delete", method: HttpMethodsConstants.PUT },
    { path: "/job/", method: HttpMethodsConstants.POST },
    { path: "/job/parsejd", method: HttpMethodsConstants.POST },
    { path: "/job/bulk-update", method: HttpMethodsConstants.PATCH },
    { path: "/job/bulk-close", method: HttpMethodsConstants.PATCH },

    // corporate user routes
    { path: "/corporate-user/*", method: HttpMethodsConstants.GET },
    { path: "/corporate-user/:id/delete", method: HttpMethodsConstants.PATCH },
    { path: "/corporate-user/request-otp/referral-sourcetype", method: HttpMethodsConstants.POST },
    { path: "/corporate-user/verify-otp/referral-sourcetype", method: HttpMethodsConstants.POST },

    // corporate invite routes
    { path: "/corporate-invite/", method: HttpMethodsConstants.POST },
    { path: "/corporate-invite/*", method: HttpMethodsConstants.GET },
    { path: "/corporate-invite/*", method: HttpMethodsConstants.PATCH },

    // corporate bulk jd routes
    { path: "/corporate-bulk-jd/*", method: HttpMethodsConstants.ANY },

    // corporate bulk jd resume routes
    { path: "/corporate-bulk-jd-resume/*", method: HttpMethodsConstants.ANY },

    // Request evaluation routers
    { path: "/request-evaluation/", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation*", method: HttpMethodsConstants.GET },

    // Response evaluation routers
    { path: "/response-evaluation*", method: HttpMethodsConstants.GET },

    // Evaluator detail routers
    { path: "/evaluator-detail*", method: HttpMethodsConstants.GET },

    // User Job Application Author Note Routers
    {
      path: "/job-application-author-note/",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application/find-matching-score",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },

    // Count Company Job routers
    {
      path: "/counts/:companyId/:jobId/:entityType/company-job",
      method: HttpMethodsConstants.GET,
    },

    // Count Company Routers
    {
      path: "/counts/:companyId/:entityType/company",
      method: HttpMethodsConstants.GET,
    },

    // Agency User Invite Routers
    { path: "/agency-invite/", method: HttpMethodsConstants.POST },
    { path: "/agency-invite*", method: HttpMethodsConstants.GET },
    { path: "/agency-invite/corp-action", method: HttpMethodsConstants.PATCH },
    { path: "/agency-invite/action-type", method: HttpMethodsConstants.PATCH },

    // Agency Job Assignment Routers
    { path: "/agency-job-assignment/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-job-assignment/bulk/remove-jobs", method: HttpMethodsConstants.PATCH },
    { path: "/agency-job-assignment*", method: HttpMethodsConstants.GET },

    // File routers
    {
      path: "/file/gsu2u/AGENCY_INVITE_CONTRACT_COPY",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_INVITE_CONTRACT_COPY",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2u/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CAND_SUBMIT_CV_JOB",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_REFERRAL_CV",
      method: HttpMethodsConstants.POST,
    },

    // User Interview Routers
    {
      path: "/user/interview/request",
      method: HttpMethodsConstants.POST,
    },

    // Agency User Submission Routers
    { path: "/agency-user-submission*", method: HttpMethodsConstants.GET },
    { path: "/agency-user-submission/:id", method: HttpMethodsConstants.GET },
    { path: "/agency-user-submission/find-matching-score", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/reject-applicant", method: HttpMethodsConstants.PATCH },
    { path: "/agency-user-submission/reject-applicant/bulk", method: HttpMethodsConstants.PATCH },

    // Corporate Candidate Profile Routers
    { path: "/corporate-candidate-profile*", method: HttpMethodsConstants.GET },
    { path: "/corporate-candidate-profile/resumes", method: HttpMethodsConstants.POST },

    // Candidate Parsed Cv Routers
    { path: "/candidate-parsed-cv/search-in-db/corp-action*", method: HttpMethodsConstants.GET },
    { path: "/candidate-parsed-cv/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.PATCH },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.GET },
    { path: "/candidate-parsed-cv/refresh", method: HttpMethodsConstants.POST },

    // Candidate Job Matching Routers
    { path: "/candidate-job-matching/:id", method: HttpMethodsConstants.GET },
    { path: "/candidate-job-matching*", method: HttpMethodsConstants.GET },

    // Bulk source type resume routers
    { path: "/bulk-source-type-resume/", method: HttpMethodsConstants.POST },

    // Referral Source Type Activation Routers
    { path: "/referral-sourcetype-activation/", method: HttpMethodsConstants.POST },
    { path: "/referral-sourcetype-activation/company/:companyId", method: HttpMethodsConstants.GET },

    // Corporate subscription Pricing config routers
    { path: "/corporate-subscription-pricing-config/*", method: HttpMethodsConstants.GET },
  ];

  const result = checkMatchingPattern(url, urlList, httpMethod);

  return result;
};

/**
 * isAgencyUrl
 *
 * Checks if a given URL is allowed for Agency users and matches the given HTTP method.
 *
 * @param {string} url - The URL to check.
 * @param {string} httpMethod - The HTTP method to check against.
 * @returns {boolean} - True if the URL and HTTP method match any pattern in the
 *                      Agency allowed URL list, otherwise false.
 */
var isAgencyUrl = function (url, httpMethod) {
  const urlList = [
    // Agency User Invite Routers
    { path: "/agency-invite*", method: HttpMethodsConstants.GET },
    { path: "/agency-invite/agency-action", method: HttpMethodsConstants.PATCH },

    // Agency User Routers
    { path: "/agency-user/", method: HttpMethodsConstants.POST },
    { path: "/agency-user/:id", method: HttpMethodsConstants.GET },
    { path: "/agency-user/:id/cognito", method: HttpMethodsConstants.GET },

    // Agency Job Assignment Routers
    { path: "/agency-job-assignment*", method: HttpMethodsConstants.GET },

    // File routers
    {
      path: "/file/gsu2u/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/AGENCY_BULK_CVS",
      method: HttpMethodsConstants.POST,
    },

    // Agency User Submission Routers
    { path: "/agency-user-submission/candidate-parse-cv", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission*", method: HttpMethodsConstants.GET },

    // Job routers
    { path: "/job/parsejd", method: HttpMethodsConstants.POST },

    // Corporate Candidate Profile Routers
    { path: "/corporate-candidate-profile/duplicate", method: HttpMethodsConstants.GET },

    // Agency Bulk Jd Routers
    { path: "/agency-bulk-jd*", method: HttpMethodsConstants.ANY },

    // Agency Bulk Jd Resume Routers
    { path: "/agency-bulk-jd-resume*", method: HttpMethodsConstants.ANY },

    // Agency Cv Recharge Package routers
    { path: "/agency-cv-recharge-package*", method: HttpMethodsConstants.GET },

    { path: "/agency-cv-recharge-order/create", method: HttpMethodsConstants.POST },
    { path: "/agency-cv-recharge-order/verify-payment", method: HttpMethodsConstants.POST },

    // Agency Cv Wallet Routers
    { path: "/agency-cv-wallet/:agencyUserId", method: HttpMethodsConstants.GET },

    // Agency cv credit transaction routers
    { path: "/agency-cv-credit-transaction*", method: HttpMethodsConstants.GET },

    // Agency Cv Debit Transaction Routers
    { path: "/agency-cv-debit-transaction*", method: HttpMethodsConstants.GET },
  ];

  const result = checkMatchingPattern(url, urlList, httpMethod);
  return result;
};

/**
 * isAdminUrl
 *
 * Checks if a given URL is an Admin URL and matches the given HTTP method.
 *
 * @param {string} url - The URL to check.
 * @param {string} httpMethod - The HTTP method to check against.
 * @returns {boolean} - True if the URL and HTTP method match any pattern in the
 *                      Admin URL list, otherwise false.
 */
var isAdminUrl = function (url, httpMethod) {
  const adminUrlList = [
    //job application interview schedular
    { path: "/user-job-interview/*", method: HttpMethodsConstants.ANY },

    // admin routes
    { path: "/admin", method: HttpMethodsConstants.ANY },
    { path: "/admin/*", method: HttpMethodsConstants.ANY },

    // job application routes
    {
      path: "/job-application/:id/corp-action",
      method: HttpMethodsConstants.PATCH,
    },
    {
      path: "/job-application/:id",
      method: HttpMethodsConstants.DELETE,
    },
    {
      path: "/job-application/:id/hired-from-other-portal",
      method: HttpMethodsConstants.PUT,
    },
    {
      path: "/job-application/:id/display-to-corporate",
      method: HttpMethodsConstants.PATCH,
    },
    {
      path: "/job-application/bulk-update",
      method: HttpMethodsConstants.PATCH,
    },

    // job routes
    { path: "/job/", method: HttpMethodsConstants.POST },
    { path: "/job/:jobId/delete", method: HttpMethodsConstants.PUT },
    { path: "/job/parsejd", method: HttpMethodsConstants.POST },
    { path: "/job/bulk-update", method: HttpMethodsConstants.PATCH },
    { path: "/job/bulk-close", method: HttpMethodsConstants.PATCH },
    
    // corporate user routes
    { path: "/corporate-user/*", method: HttpMethodsConstants.GET },
    { path: "/corporate-user/:id/delete", method: HttpMethodsConstants.PATCH },

    // corporate invite routes
    { path: "/corporate-invite/", method: HttpMethodsConstants.POST },
    { path: "/corporate-invite/*", method: HttpMethodsConstants.GET },
    { path: "/corporate-invite/*", method: HttpMethodsConstants.PATCH },

    // corporate bulk jd routes
    { path: "/corporate-bulk-jd/*", method: HttpMethodsConstants.ANY },

    // corporate bulk jd resume routes
    { path: "/corporate-bulk-jd-resume/*", method: HttpMethodsConstants.ANY },

    // script routes
    { path: "/script*", method: HttpMethodsConstants.ANY },

    // company routes
    { path: "/company/", method: HttpMethodsConstants.POST },
    { path: "/company/:id", method: HttpMethodsConstants.DELETE },
    { path: "/company/:id/request", method: HttpMethodsConstants.DELETE },
    { path: "/company/request/list/*", method: HttpMethodsConstants.GET },
    { path: "/company/:id*", method: HttpMethodsConstants.PUT },
    { path: "/company/:id/company-logo", method: HttpMethodsConstants.PATCH },

    // User Matching Score Job Routers
    {
      path: "/user-matching-score-job/:id",
      method: HttpMethodsConstants.DELETE,
    },

    // Refer and Earn Routers
    { path: "/refer-and-earn/:id", method: HttpMethodsConstants.PATCH },

    // Blog routers
    { path: "/blog/", method: HttpMethodsConstants.POST },
    { path: "/blog/:id", method: HttpMethodsConstants.PATCH },

    // File routers
    { path: "/file/gsu2u/COMPANY_LOGO", method: HttpMethodsConstants.POST },
    { path: "/file/gsu2u/BLOG_COVER_IMAGE", method: HttpMethodsConstants.POST },
    {
      path: "/file/gsu2v/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2u/AGENCY_SUBMIT_USER_CV",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CAND_SUBMIT_CV_JOB",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/ADMIN_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_BULK_CV_UPLOAD",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/file/gsu2v/CORP_CAND_REFERRAL_CV",
      method: HttpMethodsConstants.POST,
    },

    // Request evaluation routers
    { path: "/request-evaluation/", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/request-evaluation*", method: HttpMethodsConstants.GET },

    // Response evaluation routers
    { path: "/response-evaluation*", method: HttpMethodsConstants.GET },

    // Evaluator detail routers
    { path: "/evaluator-detail*", method: HttpMethodsConstants.GET },

    // Guidance Request routers
    {
      path: "/user/guidance-request/:id/WORKO_ADMIN_ACTION",
      method: HttpMethodsConstants.PATCH,
    },

    // User Job Application Author Note Routers
    {
      path: "/job-application-author-note/",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application/find-matching-score",
      method: HttpMethodsConstants.POST,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },

    // Count global routers
    {
      path: "/counts/:entityType/global-count",
      method: HttpMethodsConstants.GET,
    },

    // Count Company Job routers
    {
      path: "/counts/:companyId/:jobId/:entityType/company-job",
      method: HttpMethodsConstants.GET,
    },

    // Agency User Invite Routers
    { path: "/agency-invite*", method: HttpMethodsConstants.GET },

    // Agency Job Assignment Routers
    { path: "/agency-job-assignment/bulk", method: HttpMethodsConstants.POST },

    // Agency User Submission Routers
    { path: "/agency-user-submission*", method: HttpMethodsConstants.GET },
    { path: "/agency-user-submission/:id", method: HttpMethodsConstants.GET },
    {
      path: "/agency-user-submission/find-matching-score",
      method: HttpMethodsConstants.POST,
    },
    { path: "/agency-user-submission/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/send-for-evaluation/bulk", method: HttpMethodsConstants.POST },
    { path: "/agency-user-submission/reject-applicant", method: HttpMethodsConstants.PATCH },
    { path: "/agency-user-submission/reject-applicant/bulk", method: HttpMethodsConstants.PATCH },

    // User Interview Routers
    {
      path: "/user/interview/request",
      method: HttpMethodsConstants.POST,
    },

    // Central Candidate Profile Routers
    {
      path: "/central-candidate-profile*",
      method: HttpMethodsConstants.GET,
    },
    { path: "/central-candidate-profile/resumes", method: HttpMethodsConstants.POST },

    // Candidate parsed cvs
    { path: "/candidate-parsed-cv/search-in-db/admin-action*", method: HttpMethodsConstants.GET },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.PATCH },
    { path: "/candidate-parsed-cv/move-to-applicant", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/duplicate-job-appl/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/move-to-applicant/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/find-matching-score/bulk", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/refresh", method: HttpMethodsConstants.POST },
    { path: "/candidate-parsed-cv/:id", method: HttpMethodsConstants.GET },

    // Agency Cv Recharge Package routers
    { path: "/agency-cv-recharge-package*", method: HttpMethodsConstants.ANY },

    { path: "/candidate-job-matching*", method: HttpMethodsConstants.GET },

    // Bulk source type resume routers
    { path: "/bulk-source-type-resume/", method: HttpMethodsConstants.POST },

    // Corporate subscription Pricing config routers
    { path: "/corporate-subscription-pricing-config/*", method: HttpMethodsConstants.ANY },
  ];

  const result = checkMatchingPattern(url, adminUrlList, httpMethod);

  return result;
};
