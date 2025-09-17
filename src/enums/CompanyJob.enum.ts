/**
 * CompanyJobWorkModeEnum
 * 
 * Enum representing the work mode for a job.
 */
export enum CompanyJobWorkModeEnum {
  // Work from Home
  WFH = 'WFH',

  // Work from Office
  WFO = 'WFO',

  // HYBRID
  HYBRID = 'HYBRID',

}

/**
 * CompanyJobEmploymentTypeEnum
 * 
 * Enum representing the type of employment.
 */
export enum CompanyJobEmploymentTypeEnum {
  // Full-time
  FULL_TIME = 'FULL_TIME',

  // Part-time
  PART_TIME = 'PART_TIME',

  // Contract
  CONTRACT = 'CONTRACT',

  // Internship
  INTERNSHIP = 'INTERNSHIP',
}

/**
 * CompanyJobStatusEnum
 * 
 * Enum representing the status of a job.
 */
export enum CompanyJobStatusEnum {
  // JOB IS NOT CREATED YET AND SAVED IN DRAFT  
  DRAFT = 'DRAFT',

  // JOB IS ARCHIVED WHERE ADMIN WANT TO HIDE THE JOB 
  ARCHIVED = 'ARCHIVED',

  // JOB IS CREATED AND ACTIVE 
  PUBLISHED = 'PUBLISHED',

  // JOB IS CLOSED 
  CLOSED = 'CLOSED',
}

export enum UserCompanyJobListingStatusEnum {
  // JOB IS CREATED AND ACTIVE 
  PUBLISHED = 'PUBLISHED',
}