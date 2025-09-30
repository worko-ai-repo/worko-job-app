
/**
 * FilePsuToUploadDto
 */
export interface FilePsuToUploadDto {
   /**
    * fileName
    * 
    * @example "InternshipCertificate.pdf"
    */
   fileName: string;

   /**
    * fileMimeType
    * 
    * @example "application/pdf"
    */
   fileMimeType: string;
};

/**
 * UserJobApplicationDocumentDetailDto
 */
export interface UserJobApplicationDocumentDetailDto extends FilePsuToUploadDto {
  corporateRequestedFileName: string;
}

/**
 * UserJobApplicationDocumentPsuToUploadApiDto
 */
export interface UserJobApplicationDocumentPsuToUploadApiDto {
  /**
   * jobApplicationId
   *
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  jobApplicationId: string;

  /**
   * userId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  userId: string;

  fileDetails: UserJobApplicationDocumentDetailDto[];
};

/**
 * PreSignedUrlToUploadFileResponseDto
 */
export interface PreSignedUrlToUploadFileResponseDto {
  /**
   * fileName
   *
   * @example "InternshipCertificate.pdf"
   */
  userFileName: string;

  /**
   * cloudFileName
   *
   * 1. File name which is stored in AWS S3 bucket
   */
  cloudFileName: string;

  /**
   * fileMimeType
   *
   * @example "application/pdf"
   */
  fileMimeType: string;

  /**
   * fileExtension
   *
   * @example "pdf"
   */
  fileExtension: string;

  /**
   * awsS3SignedUrl
   * 
   * AWS S3 Signed Url used to upload the file to AWS S3
   */
  awsS3SignedUrl: string;
}

export interface UserJobApplicationPsuToUploadDocumentResponseDto extends PreSignedUrlToUploadFileResponseDto {
  /**
   * corporateRequestedFileName
   *
   * @example "InternshipCertificate.pdf"
   */
  corporateRequestedFileName: string;
}

/**
 * UserJobApplicationDocumentPsuToViewApiDto
 */
export interface UserJobApplicationDocumentPsuToViewApiDto {
  /**
   * jobApplicationId
   *
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  jobApplicationId: string;

  /**
   * userId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  userId: string;

  /**
   * cloudFileNames
   * 
   * @example ["{ulidId}.pdf", "{ulidId}.docx"]
   */
  cloudFileNames: string[];
}

/**
 * PreSignedUrlToViewFileResponseDto
 */
export interface PreSignedUrlToViewFileResponseDto {
  objectUrl: string;
}

/**
 * UserJobApplicationOfferLetterPsuToUploadApiDto
 */
export interface UserJobApplicationOfferLetterPsuToUploadApiDto extends FilePsuToUploadDto {
  /**
   * jobApplicationId
   *
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  jobApplicationId: string;

  /**
   * userId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  userId: string;
}

/**
 * UserJobApplicationOfferLetterPsuToViewApiDto
 */
export interface UserJobApplicationOfferLetterPsuToViewApiDto {
  /**
   * jobApplicationId
   *
   * @reference `id` attribute of `UserJobApplication.model.ts`
   */
  jobApplicationId: string;

  /**
   * userId
   *
   * @reference `id` attribute of `UserDetail.model.ts`
   */
  userId: string;

  /**
   * cloudFileName
   *
   * @example
   *  1. "{ulidId}.pdf"
   *  2. "{ulidId}.docx"
   */
  cloudFileName: string;
}