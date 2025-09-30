// Import dynamoose library
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

//Load the base dao
import BaseDao from "./Base.dao";

//Load the local model
import {
  DbUserDetailDto,
  UserDetailModel,
} from "../db/models/UserDetail.model";

//Load the local dtos
import {
  NewUserCandSignUpDTO,
  NewUserEmpSignUpDTO,
  UserSubscriptionDetailsUpdateDto,
} from "../dtos/User.dto";
import { UserDetailDTO } from "../dtos/UserDetail.dto";

// UserDetailDao class implementing the BaseDao interface
class UserDetailDao implements BaseDao {
  modelName: string = "UserDetail";
  partitianKey: string = "USR#EML#{primaryEmail}"; // Partition key structure for user emails
  sortKeys = {
    SK_ID: "ID#{userId}", // where userId is cognito provided userId for registered user
  };
  GSI1PK: string = "USR#";
  GSI1SK: string = "ID#{userId}"; // where userId is cognito provided userId for registered user
  GSI2PK: string = "USR#";

  /**
   * GSI2SK
   * const isoString = new Date().toISOString(); //[LOG]: "2025-06-11T16:15:36.0678Z"
   */
  GSI2SK: string = "{createdAt}";

  /**
   * get
   *
   * Retrieves user details based on the provided email.
   *
   * @param {string} email - Email of the user
   * @returns {Promise<QueryResponse<DbUserDetailDto>>} A promise that resolves with the query response containing the user's details.
   */
  async get(email: string): Promise<QueryResponse<DbUserDetailDto>> {
    global.logger.info("Get user detail by email [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    return UserDetailModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(this.sortKeys.SK_ID.strtr({ "{userId}": "" }))
      .exec();
  }

  /**
   * getUserById
   *
   * Fetches user details based on the provided email.
   * @param userId - userId  of the user
   * @returns User details corresponding to the email
   */
  async getUserById(userId: string) {
    global.logger.info("Get user getByUserId id [DAO]");
    const GSI1PK = this.GSI1PK;
    const GSI1SK = this.GSI1SK.strtr({
      "{userId}": userId,
    });
    // return UserDetailModel.get({ GSI1PK: GSI1PK, GSI1SK: GSI1SK })
    return UserDetailModel.query("GSI1PK")
      .eq(GSI1PK)
      .where("GSI1SK")
      .eq(GSI1SK)
      .exec();
  }

  /**
   * Fetches user details based on the provided email.
   * @param email - Email address of the user
   * @returns User details corresponding to the email
   */
  async getUserDetails(email: string, SK: string) {
    global.logger.info("Get user detail by id [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });
    return UserDetailModel.query("PK").eq(PK).where("SK").eq(SK).exec();
  }

  /**
   * Fetches user Subscription status based on the provided PK and SK.
   * @param email - Email address of the user
   * @returns User Subscription-Status corresponding to the email and SK
   */
  async getUserSubscriptionStatus(email: string, SK: string) {
    global.logger.info("Get user Subscription-Status [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });
    return UserDetailModel.query("PK")
      .eq(PK)
      .where("SK")
      .eq(SK)
      .attributes(["isSubscribed", "referralCount"])
      .exec();
  }

  async getUserDetailSK(email: string) {
    global.logger.info("get UserDetail SK [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    // @todo we should never use the await in DTO unless extremly required. Kindly have await in controller;
    // Or in service if the value is required there.
    const user = await UserDetailModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith("ID#")
      .exec();

    return user[0].SK;
  }

  /**
   * add
   *
   * Adds a new user by creating a user sign-up DTO and saving it.
   *
   * @param userSignUpDTO - User sign-up data transfer object
   */
  async add(
    userSignUpDTO: NewUserCandSignUpDTO | NewUserEmpSignUpDTO
  ): Promise<DbUserDetailDto> {
    global.logger.info("Create candidate/employee [DAO]");
    /* if (!userSignUpDTO.CV) {
        userSignUpDTO.CV = "";
      } */

    const newUserSignUpDTO = {
      ...userSignUpDTO,
      PK: this.partitianKey.strtr({
        "{primaryEmail}": userSignUpDTO.email,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{userId}": userSignUpDTO.id,
      }),
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{userId}": userSignUpDTO.id,
      }),
      GSI2PK: this.GSI2PK,
      GSI2SK: new Date().toISOString(), // Sample value: "2025-06-11T16:15:36.0678Z"
    };
    return UserDetailModel.create(newUserSignUpDTO);
  }

  /**
   *
   * @param email
   * @returns
   */
  async update(
    email: string,
    SK: string,
    userDetailDTO: Partial<UserDetailDTO>
  ) {
    global.logger.info("Update user Detail [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    return UserDetailModel.update({ PK: PK, SK: SK }, userDetailDTO);
  }

  /**
   *
   * @param email
   * @returns
   */
  async updateEmailVerify(SK: String, email: string) {
    global.logger.info("Update user primary email status to true [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });
    return UserDetailModel.update(
      { PK: PK, SK: SK },
      { isEmailVerified: true }
    );
  }

  /**
   *
   * @param SK
   * @param email
   * @param resume
   * @returns
   */
  async updateCv(SK: String, email: string, resume: string) {
    global.logger.info("Update user resume [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });
    return UserDetailModel.update({ PK: PK, SK: SK }, { CV: resume });
  }

  /**
   * updateReferralCount
   *
   * Updates the referral count for a user.
   *
   * @param id - The user's unique identifier.
   * @param email - The user's email address.
   * @param updateBodyObject - Object containing the updated user subscription details.
   * @returns A promise that resolves to the updated user details.
   */
  async updateReferralCount(
    id: string,
    email: string,
    updateBodyObject: UserSubscriptionDetailsUpdateDto
  ): Promise<DbUserDetailDto> {
    global.logger.info("Calculate referral count [DAO]");

    // Generate the partition key using the user's email
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });

    // Generate the sort key using the user's ID
    const SK = this.sortKeys.SK_ID.strtr({
      "{userId}": id,
    });

    // Update the user's details in the database
    return UserDetailModel.update({ PK: PK, SK: SK }, updateBodyObject);
  }

  /**
   *
   * @param SK
   * @param email
   * @param status
   * @returns
   */
  async updateIsSubscribedStatus(SK: string, email: string, status: boolean) {
    global.logger.info("update subscription status [DAO]");
    const PK = this.partitianKey.strtr({
      "{primaryEmail}": email,
    });
    return UserDetailModel.update({ PK: PK, SK: SK }, { isSubscribed: status });
  }

  async scriptUpdateUsersToLowerCase(): Promise<boolean> {
    global.logger.info("update user details to lower case [DAO]");

    // Query the table to get all user details
    const allUsers: QueryResponse<DbUserDetailDto> =
      await UserDetailModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith("ID#")
        .exec();

    // Array to store the update operations (promise)
    const updateOperations = [];

    // Loop through all the users and update their name to lowercase
    for (const user of allUsers) {
      const originalName = user.name;
      const lowercasedName = originalName.toLowerCase();

      // Save the updated user back to the database
      updateOperations.push(
        UserDetailModel.update(
          { PK: user.PK, SK: user.SK },
          {
            name: lowercasedName,
          }
        )
      );
    }

    // Execute the update operations in parallel
    await Promise.all(updateOperations);

    return true;
  }
}

// Create an instance of the UserDetailDao
const userDetailDao = new UserDetailDao();

// Export the instance for use in other modules
export default userDetailDao;
