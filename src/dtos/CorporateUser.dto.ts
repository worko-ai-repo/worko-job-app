// Import Dtos
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";

// Import Enums
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

/**
 * CorporateUserCreateApiDto
 * 
 * This is the dto used for as the request body for the create corporate user Create Api.
 * 
 * @enum {CorporateUserTypeEnum} role - The role of the corporate user
 */
export interface CorporateUserCreateApiDto {
    companyId: string;
    cognitoUserId : string; // This is the cognito id of the user
    email: string;
    inviteId: string;
    corporateUserType: CorporateUserTypeEnum ;
    firstName: string;
    lastName: string;
}

/**
 * CorporateUserCreateDto
 * 
 * This is the dto used for as the request body for the create corporate user Create Api.This will be used By Backend
 * 
 * @extends {CorporateUserCreateApiDto} - The role of the corporate user
*/
export interface CorporateUserCreateDto extends CorporateUserCreateApiDto {
    // Miscelaneous attributes
    isDeleted: boolean;
}

/**
 * CorporateUserUpdateApiDto
 * 
 * This is the dto used for as the request body for the update corporate user Create Api.
 */
export interface CorporateUserUpdateApiDto {
    firstName? : string;
    lastName? : string;
}

/**
 * CorporateUserUpdateDto
 * 
 * This is the dto used for as the request body for the update corporate user Create Api.This will be used By Backend
 */
export interface CorporateUserUpdateDto extends CorporateUserUpdateApiDto {
    // Keys
    email: string;
    companyId: string;
    
    updatedByUserId?: string;
    deletedByUserId?: string;

    updatedByCorporateUserId?: string;
    deletedByCorporateUserId?: string;
}

/**
 * CorporateUserLisitngFilterOptionsDTO
 * 
 * The DTO that will be used to keep the request query params for the Corporate Invite Listing.
 *  * 
 * @extends RecordListingFilterRequestDTO - The base DTO for the record listing filter used by backend team.
 * 
 * @see {CorporateUserTypeEnum}  - The type of access the user is requesting.
 */
export interface CorporateUserLisitngFilterOptionsDTO extends RecordListingFilterRequestDTO{
    cognitoUserId?:string;
    id?:string;
    firstName?: string;  
    lastName?: string;
    companyId?: string;
    email?: string;
    corporateUserType?: CorporateUserTypeEnum;
}

/**
 * CorporateUserLisitngFilterOptions
 * 
 * This is the dto used for as the request body for the update corporate user Create Api.This will be used By Backend
 * 
 * @extends RecordListingFilterOptions - The base DTO for the record listing filter used by backend team.
 *
 * @see {CorporateUserTypeEnum}  - The type of access the user is requesting.
 */
export interface CorporateUserLisitngFilterOptions extends RecordListingFilterOptions{
    cognitoUserId?:string;
    id?:string;
    firstName?: string;  
    lastName?: string;
    companyId?: string;
    email?: string;
    corporateUserType?: CorporateUserTypeEnum;
}