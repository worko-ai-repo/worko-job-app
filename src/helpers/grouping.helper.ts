// Define constants for SK types
const SK_TYPES = {
  ID: "ID",
  REF: "REF",
  SRVC: "SRVC",
  // Add other SK types as needed
};

// Define an interface to represent the structure of the grouped result
interface GroupedResult {
  userDetails: any;
  userReferrals: any[];
  userServices: any[];
}

/**
 * Helper class for grouping user data based on SK (Sort Key) types.
 */
export class GroupingHelper {
  /**
   * Groups an array of users based on their SK type.
   * @param users - Array of users to be grouped.
   * @returns Grouped result containing user details, referrals, and services.
   */
  static groupBySK(users: any[]): GroupedResult {
    // Initialize an empty grouped result object
    const groupedResult: GroupedResult = {
      userDetails: {},
      userReferrals: [],
      userServices: [],
    };

    // Iterate through each user in the input array
    users.forEach((user) => {
      // Extract the SK type from the user's SK property
      const skType = user.SK.split("#")[0];

      // Determine the SK type and organize the user accordingly
      switch (skType) {
        case SK_TYPES.ID:
          // If the SK type is 'ID', treat it as user details
          groupedResult.userDetails = {
            ...user,
            // Convert userType Set to an array for consistent structure
            userType: user.userType ? Array.from(user.userType) : [],
          };
          break;
        case SK_TYPES.REF:
          // If the SK type is 'REF', add it to the user referrals array
          groupedResult.userReferrals.push(user);
          break;
        case SK_TYPES.SRVC:
          // If the SK type is 'SRVC', add it to the user services array
          groupedResult.userServices.push(user);
          break;
        // Handle any other SK types if necessary
      }
    });

    // Return the final grouped result
    return groupedResult;
  }
}
