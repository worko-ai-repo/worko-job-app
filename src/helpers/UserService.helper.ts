// interface for MasterService data
interface DbMasterServiceDto {
  SK: string;
  name: string;
  // ... other properties
}

// interface for UserService data
interface UserService {
  mentorLevel: number;
  masterServiceId?: string;
  createdAt: Date;
  serviceName?: string; // Added to replace masterServiceId
  // ... other properties
}

// Helper class for handling service-related operations
class ServiceHelper {
  // Private static method to create a map of SK to serviceName for quick lookup
  private static getServicePlansMap(
    servicePlans: DbMasterServiceDto[]
  ): Record<string, string> {
    // Use Object.fromEntries to convert the array of key-value pairs into an object
    return Object.fromEntries(
      servicePlans.map((plan: DbMasterServiceDto) => [plan.SK, plan.name])
    );
  }

  // Static method to update service names in the given result array
  static updateServiceNames(
    result: UserService[],
    servicePlans: DbMasterServiceDto[]
  ): void {
    // Get the servicePlansMap for quick lookup
    const servicePlansMap = ServiceHelper.getServicePlansMap(servicePlans);

    // Iterate over each item in the result array
    result.forEach((userService: UserService) => {
      // Check if the item has a masterServiceId and the corresponding serviceName exists
      if (
        userService.masterServiceId &&
        servicePlansMap[userService.masterServiceId]
      ) {
        // Replace masterServiceId with serviceName in the result
        userService.serviceName = servicePlansMap[userService.masterServiceId];
        delete userService.masterServiceId;
      }
    });
  }
}

export default ServiceHelper;
