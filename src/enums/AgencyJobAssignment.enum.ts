export enum AgencyJobAssignmentDbStatusEnum {
  /**
   * @description
   *    1. If the job is assigned by "corporate-admin/recruiter" then the status will be "ACTIVE"
   */
  ACTIVE = "ACTIVE",

  /**
   * @description
   *    1. If the job is removed by "corporate-admin/recruiter" then the status will be "INACTIVE"
   */
  INACTIVE = "INACTIVE",
}
