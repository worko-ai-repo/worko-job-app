export enum CorporateCandidateProfileDbRefereeTypeEnum {
  /**
   * @description
   *  1. We will give example email: `retrieveuserprofiles@worko.ai` to a company(ex: `amazon`), if anyone sends candidate's
   * `cv` to `retrieveuserprofiles@worko.ai` email for `amazon` company then we need to retrieve that `cv` and check duplicacy
   * and if not duplicate we will parse user cv and store user info against `amazon` company under `Referral` source type
   */
  REFERRAL = "REFERRAL",

  /**
   * @description
   * 1. Whenever a `corporate` or `worko-admin` uploads bulk cv's against particular `companyJob` for screening
   * 2. Whenever a `corporate` uploads bulk cv's against his particular `company`
   * 3. Whenever a `worko-admin` uploads bulk cv's
   */
  INTERNAL = "INTERNAL",

  /**
   * @description
   * 1. Whenever an `agency` upload `candidate's cv` for particular `companyJob`
   */
  AGENCY = "AGENCY",

  /**
   * @description
   * 1. Whenever a `registered candidate` apply `companyJob` at `worko` job portal
   */
  WORKO = "WORKO",
}
