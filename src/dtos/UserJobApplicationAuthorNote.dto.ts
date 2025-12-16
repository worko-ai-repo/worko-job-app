// import enums
import { UserJobApplicationAuthorNoteCognitoUserGroupEnum } from "../enums/UserJobApplicationAuthorNote.enum";

/**
 * UserJobApplicationAuthorDbNoteDetail
 * 
 * Interface for individual note detail
 */
export interface UserJobApplicationAuthorDbNoteDetail {
  title: string;
  detailedDescription?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * UserJobApplicationAuthorNoteCreateApiDTO
 * 
 * DTO for creating a job application note via API
 */
export interface UserJobApplicationAuthorNoteCreateApiDTO {
  jobApplicationId: string;
  authorCognitoUserGroup: UserJobApplicationAuthorNoteCognitoUserGroupEnum;
  noteDetails: UserJobApplicationAuthorDbNoteDetail[];
}

export interface UserJobApplicationAuthorNoteCreateDTO extends UserJobApplicationAuthorNoteCreateApiDTO {
  authorId: string;
  createdByUserId?: string;
  createdByCorporateUserId?: string;
}

/**
 * UserJobApplicationAuthorNoteUpdateApiDTO
 * 
 * DTO for updating a job application note via API
 */
export interface UserJobApplicationAuthorNoteUpdateApiDTO {
  noteDetails: UserJobApplicationAuthorDbNoteDetail[];
}

export interface UserJobApplicationAuthorNoteCommonUpdateDto {
  noteDetails: UserJobApplicationAuthorDbNoteDetail[];
  updatedByUserId: string;
  updatedByCorporateUserId: string;
}