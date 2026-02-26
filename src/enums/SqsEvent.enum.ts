/**
 * Enum representing the different types of SQS message events.
 *
 * @enum {SqsMsgEventEnum}
 */
export enum SqsMsgEventEnum {
 /**
  * JOB_APPLICATION_VALIDATE_MATCHING_SCORE
  * 
  * Event type for validating the matching score of a job application.
  *
  * when `candidate` apply a job from mini job portal and after the matching score is calculated in `worko-jd-resume-matching-dev` lambda function on aws, then
  * `JOB_APPLICATION_VALIDATE_MATCHING_SCORE` event will be triggered and perform required process accordingly.
  */
 JOB_APPLICATION_VALIDATE_MATCHING_SCORE = "JOB_APPLICATION_VALIDATE_MATCHING_SCORE",
}