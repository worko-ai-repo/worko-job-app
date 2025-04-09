/**
 * EmailLogStatusEnum
 *
 * Possible statuses for Email Log
 */
export enum EmailLogStatusEnum {
  QUEUED = "QUEUED", // The email has been queued for sending
  SENT = "SENT", // The email has been sent
  FAILED = "FAILED", // The email has failed to be sent
}
