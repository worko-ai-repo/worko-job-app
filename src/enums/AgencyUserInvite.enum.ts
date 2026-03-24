export enum AgencyUserInviteDbStatusEnum {
  AWAITING = "AWAITING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum AgencyUserInviteDbActionEnum {
  /*
  1. Whenever `corporate` pause particular agency invite, then:
    1. In `agency` dashboard:-
        1. We can list old job assignments by `corporate`, but if `agency` tries to upload candidate
        `cv` then we should not allow him to upload
        2. We can list old agency user submissions in `Agency-Applicants` page
    2. In `corporate` dashboard:-
        1. Whenever `agency invite` is `paused` state and `corporate` tries to assign jobs to that `agency invite`
        then we should not allow `corporate` to assign jobs and show popup with message:- `Resume the agency invite to assign new jobs`
  */
  PAUSE = "PAUSE",

  /*
  1. `corporate` can only `resume` particular agency invite only from `pause` state but not from `delete` state, then:
    1. In `agency` dashboard:-
        1. We can list all job assignments by `corporate`, and we allow `agency` to upload candidate
        `cv` 
        2. We can list all agency user submissions in `Agency-Applicants` page
    2. In `corporate` dashboard:-
        1. Whenever `agency invite` is `resume` state and `corporate` tries to assign jobs to that `agency invite`
        then we should allow `corporate` to assign jobs 
   */
  RESUME = "RESUME",

  /*
  1. Whenever `corporate` delete particular agency invite, then:
    1. In `agency` dashboard:-
        1. We can list old job assignments by `corporate` only up to `3` months, but if `agency` tries to upload candidate `cv` then we should not allow him to upload
        2. We can list old agency user submissions in `Agency-Applicants` page only up to `3` months
    2. In `corporate` dashboard:-
        1. Whenever `agency invite` is `deleted` state and `corporate` tries to assign jobs to that `agency invite`
        then we should not allow `corporate` to assign jobs and show popup with message:- `Re-invite the agency to assign new jobs`
   */
  DELETE = "DELETE",
}

/**
 * @reference "agencyUserInviteAgencyUpdateApiValidationDto" in "AgencyUserInvite.schema.ts"
 */
export enum AgencyUserInviteAllowedAgencyAllowedStatusEnum {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
