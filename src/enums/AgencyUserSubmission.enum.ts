export enum AgencyUserSubmissionDbJobApplicationStatusEnum {
  /**
   * @description
   *  1. If "admin" or "corporate-admin/recruiter" reject the candidate's cv for particular `companyJob` then it will be in `REJECTED`
   */
  REJECTED = "REJECTED",

  /**
   * @description
   *  1. In "All Candidates" page in "Agency" Page of "Admin" or "Corporate" dashboard,
   *     If "admin" or "corporate-admin/recruiter" clicks on "Accept and Move to Applicants" then the candidate's job application status will be in `ACCEPTED`
   */
  ACCEPTED = "ACCEPTED",

  /**
   * @description
   *  1. In "All Candidates" page in "Agency" Page of "Admin" or "Corporate" dashboard,
   *     If "admin" or "corporate-admin/recruiter" sends candidate for evaluation then the candidate's job application status will be in `UNDER_EVALUATION`
   */
  UNDER_EVALUATION = "UNDER_EVALUATION",

  /**
   * @description
   *  1. In "Applicants" page of "Admin" or "Corporate" dashboard,
   *     If "admin" or "corporate-admin/recruiter" updates to `PROCESSING_INTERVIEW` then the candidate's job application status will be in `PROCESSING_INTERVIEW`
   */
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",

  /**
   * @description
   *  1. In "Applicants" page of "Admin" or "Corporate" dashboard,
   *     If "admin" or "corporate-admin/recruiter" hires the candidate then the candidate's job application status will be in `HIRED`
   *  2. In "Jobs" page of "Candidate" dashboard,
   *     If "candidate" accepts offer letter then the candidate's job application status will be in `HIRED`
   */
  HIRED = "HIRED",

  /**
   * @description
   *  1. In "Applicants" page of "Admin" or "Corporate" dashboard,
   *     If "admin" or "corporate-admin/recruiter" make Joined the candidate then the candidate's job application status will be in `JOINED`
   *  2. In "Jobs" page of "Candidate" dashboard,
   *     If "candidate" submits joining date then the candidate's job application status will be in `JOINED`
   */
  JOINED = "JOINED",
}
