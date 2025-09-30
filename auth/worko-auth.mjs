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
 */
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL,
  tokenUse: "access",

  /**
   * @description
   * 1. If we don't specify client id explicitly as null then it will throw below error:
   *    "ParameterValidationError: clientId must be provided or set to null explicitly"
   */
  clientId: null, // Accept tokens from any client in this User Pool
});

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

      let payload = {};
      if (isAnEvaluatorUrl) {
        // Verify the token with group admin
        payload = await verifier.verify(token, {
          /**
           * groups (optional): verify that the JWT's cognito:groups claim matches your expectation.
           * Provide a string, or an array of strings to allow multiple groups (i.e. one of these groups must match the JWT).
           */
          groups: [
            "admin",
            "corporate-admin",
            "corporate-recruiter",
            "evaluator",
          ],
        });
      } else if (isACorporateRecruiterUrl) {
        // Verify the token with group admin
        payload = await verifier.verify(token, {
          /**
           * groups (optional): verify that the JWT's cognito:groups claim matches your expectation.
           * Provide a string, or an array of strings to allow multiple groups (i.e. one of these groups must match the JWT).
           */
          groups: ["admin", "corporate-recruiter", "corporate-admin"],
        });
      } else if (isACorporateAdminUrl) {
        // Verify the token with group admin
        payload = await verifier.verify(token, {
          /**
           * groups (optional): verify that the JWT's cognito:groups claim matches your expectation.
           * Provide a string, or an array of strings to allow multiple groups (i.e. one of these groups must match the JWT).
           */
          groups: ["admin", "corporate-admin"],
        });
      } else if (isAnAdminUrl) {
        // Verify the token with group admin
        payload = await verifier.verify(token, {
          /**
           * groups (optional): verify that the JWT's cognito:groups claim matches your expectation.
           * Provide a string, or an array of strings to allow multiple groups (i.e. one of these groups must match the JWT).
           */
          groups: ["admin"],
        });
      } else {
        // Verify the token
        payload = await verifier.verify(token);
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
      console.log("payload:", {
        payload,
      });

      // get groups from token
      groups = payload["cognito:groups"] || [];

      username = payload.sub;
      email = payload?.email;

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

    // file routes
    { path: "/file/gsu2u/USER_RESUME", method: HttpMethodsConstants.ANY },
    { path: "/file/gsu2u/CAREER_RESUME", method: HttpMethodsConstants.ANY },

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
    // Request evaluation routers
    { path: "/request-evaluation*", method: HttpMethodsConstants.GET },

    // Response evaluation routers
    { path: "/response-evaluation/", method: HttpMethodsConstants.POST },
    { path: "/response-evaluation*", method: HttpMethodsConstants.GET },

    // Evaluator detail routers
    { path: "/evaluator-detail*", method: HttpMethodsConstants.GET },
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
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },
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
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },
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
      path: "/job-application-author-note/:jobApplicationId/:authorId",
      method: HttpMethodsConstants.GET,
    },
    {
      path: "/job-application-author-note/:jobApplicationId/:noteId",
      method: HttpMethodsConstants.PATCH,
    },
  ];

  const result = checkMatchingPattern(url, adminUrlList, httpMethod);

  return result;
};
