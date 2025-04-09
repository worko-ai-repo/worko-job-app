import {
  RecordListingFilterOptions,
  RecordListingFilterRequestDTO,
} from "./Common.dto";

/**
 * CompanyRequestPageFlagApiDto
 * 
 * This interface defines the structure for the request flag for company requests.
 */
export interface CompanyRequestPageFlagApiDto {
  companyRequestPageFlag: string; // Sample values: "true" or "false"
}

/**
 * CompanyRequestDTO
 */
export interface CompanyRequestDTO {
  name: string; 
  industry: string; 
  teamSize: number; 
  carrierPage: string; 
  linkedIn: string; 
  logoUrl?: string; 
  logo:  string;  
  aboutCompany?: string;
  website?: string;
}

/**
 * CompanyDTO
 */
export interface CompanyDTO {
  // Represents the data structure for creating or updating a company.
  // Should be used in requests where a new company needs to be created or an existing one updated.
  name: string; // Company name
  industry: string; // Industry the company belongs to
  teamSize: number; // Size of the company's team
  carrierPage: string; // Carrier page URL
  linkedIn: string; // LinkedIn page URL
  logoUrl?: string; // URL of the company's logo
  logo:  string;  // logo name
  isVerified: boolean;
  aboutCompany?: string;
  website?: string;
}

/**
 * CompanyUpdateApiDto
 * 
 * This interface is reused for updating
 * both company details(`CompanyDetail.model.ts`) and company requests(`CompanyRequest.model.ts`).
 * 
 * if `isCompanyRequestPageFlag` is set to `false`, then the details are updated in `CompanyDetail.model.ts`.
 * If `isCompanyRequestPageFlag` is set to `true`, then the details are updated in `CompanyRequest.model.ts`
 * 
 * NOTE: We should not use same interface for both different models, As this `Company` related
 * interfaces are old code, so that's why it followed old conventions, For now, we will keep it as it is,
 * but we should follow new conventions for new features.
 */
export interface CompanyUpdateApiDto {
  name: string;
  industry: string;
  teamSize: number;
  carrierPage: string;
  linkedIn: string;
  logoUrl?: string;
  logo: string;
  aboutCompany?: string;
  website?: string;

  /**
   * In `Worko Admin` Dashboard, 
   * 
   * if the `worko admin` is updating the company details from the `Company Listing` page,
   * then `isCompanyRequestPageFlag` will be set to `false`.
   * 
   * If the `worko admin` is updating the company details from the `Company Request` page,
   * then `isCompanyRequestPageFlag` will be set to `true`.
   */
  isCompanyRequestPageFlag: boolean;
}

/**
 * CompanyUpdateDto
 */
export interface CompanyUpdateDto extends CompanyUpdateApiDto {
  /**
   * In `Admin` Dashboard, if the `worko admin` is updating the company details from the `Company Listing` page,
   * then `isVerified` should be set to `undefined` in backend internally, because
   * the `isVerified` field is already set to `true` in the `Company Listing` page, So we should not update the `isVerified` field
   * again.
   *
   * If the `worko admin` is updating the company details from the `Company Request` page,
   * then `isVerified` should be set to `true` in backend internally, because
   * the `isVerified` field is already set to `false` in the `Company Request` page, So we should update the `isVerified` field
   * to `true`.
   */
  isVerified?: boolean;
}

interface CompanyObject {
  name: string;
  industry: string;
  teamSize: number;
  carrierPage: string;
  linkedIn: string;
  logoUrl: string;
  logo: string;
}

export enum UserType {
  EMP = "EMP", // Employee user type
  CAND = "CAND", // Candidate user type
}

export enum Status {
  NEW = "new", // New status
  APPROVED = "approved", // Approved status
  DENIED = "denied", // Denied status
}

export interface AddCompanyDTO {
  // Represents the data structure for adding a new company.
  // Should be used when creating a new company request.
  userType: UserType; // Type of user adding the company
  companyDetail: CompanyObject; // Details of the company to be added
  status: Status; // Status of the company request
  userEmail: string;
  userContactNumber : string;
}

interface Company {
  teamSize: number;
  SK: string;
  name: string;
  industry: string;
  linkedIn: string;
  logoUrl: string;
  carrierPage: string;
}

export interface CompanyListResponseDto {
  // Represents the response structure for a list of companies.
  // Should be used when retrieving a list of companies.
  companies: Company[]; // Array of companies
  count: number; // Total count of companies
}

/**
 * CompanyListingFilterOptions
 *
 * It is similar to "RecordListingFilterRequestDTO" but it would be used in the backend to perform business logic.
 */
export interface CompanyListingFilterOptions extends RecordListingFilterOptions {
  // Represents the filter options for querying companies.
  // Should be used when filtering company records.
  companyName?: string; // Filter by company name
  industryName: string; // Filter by industry name
  teamSize?: string; // Filter by team size
  isVerified?: number | null; // Filter by verification status
}

/**
 * CompanyListingFilterRequestDTO
 *
 * It is similar to "RecordListingFilterRequestDTO" but it would be used in the backend to perform business logic.
 */
export interface CompanyListingFilterRequestDTO extends RecordListingFilterRequestDTO {
  // Represents the filter request DTO for querying companies.
  // Should be used when requesting to filter company records.
  companyName?: string; // Filter by company name
  industryName: string; // Filter by industry name
  teamSize?: string; // Filter by team size
  isVerified?: number | null; // Filter by verification status
}
