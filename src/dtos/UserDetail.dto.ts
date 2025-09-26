export interface UserDetailDTO {
  name: string;
  emailList: { [key: string]: string };
  number: string;
  userType: string[];
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  isSubscribed: boolean;
  referralCount: number;
  location?: string;
  about?: string;
  CTC?: number;
  ECTC?: number;
  noticePeriod?: number;
  YOE?: number;
  CV?: string;
  coverLetter?: string;
  lastAccessedDash: string;
  profileImage?: string;
  country?: string;
  isCandidateFresher: boolean;
  candidateExperience?: {
    companyId?: string;
    companyName: string;
    designation: string;
    department: string;
  };

  /**
   * isWhatsappNotificationEnabled
   *
   * This field is used to enable/disable the whatsapp notification.
   * @type {boolean}
   *
   * Note: For example, if a user logs in as an employee and wants to disable WhatsApp notifications on the employee dashboard while keeping them enabled on the candidate dashboard, 
   * this `isWhatsappNotificationEnabled` setting won't work that way.
   * When `isWhatsappNotificationEnabled` is set to `false` on the employee dashboard, 
   * it will also be `false` on the candidate dashboard, applying globally across all user roles.
   */
  isWhatsappNotificationEnabled?: boolean;
}

export interface UserDetailDbCandidateExperienceDto {
  companyId?: string;
  companyName: string;
  designation: string;
  department: string;
  YOE?: number;
  startDate?: string;

  /**
   * endDate
   *
   * @description if endDate is not provided or empty string, it will be considered as ongoing experience
   */
  endDate?: string;
};