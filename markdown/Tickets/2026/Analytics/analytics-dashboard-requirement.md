# Corporate Dashboard Analytics - Requirements Document

## Table of Contents
1. [Business Perspective](#business-perspective)
2. [High Level Design (HLD)](#high-level-design-hld)
3. [Low Level Design (LLD)](#low-level-design-lld)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Implementation Considerations](#implementation-considerations)

---

## Business Perspective

### Overview
We need to build a comprehensive **Analytics Dashboard** for Corporate Dashboard that provides insights into job applications, hiring pipeline, and recruitment metrics. This dashboard will serve two primary user types:

1. **Corporate Users** (Corporate Admin/Recruiter): View analytics for their own company only
2. **Worko Admin**: View analytics for all companies with the ability to filter by recruiters

### Business Requirements

#### 1. Analytics Home Page
- **Purpose**: Central hub displaying all analytics metrics
- **Scope**: 
  - For Corporate Users: Show analytics for jobs posted by all recruiters within their company
  - For Admin: Show analytics for all companies with recruiter selection capability
- **Key Metrics to Display**:
  - Total jobs posted
  - Total applications received
  - Applications by status/stage
  - Active vs closed jobs
  - Hiring velocity metrics

#### 2. Job Applications Analytics
- **Purpose**: Detailed analytics for job applications
- **Data Points**:
  - List all jobs with their applications
  - Job poster information (recruiter name)
  - Application status distribution per job
  - Stage-wise breakdown of applications

#### 3. Jobs Listing with Applications
- **Purpose**: Comprehensive view of jobs, their posters, and applicants
- **Data Points**:
  - Job details (title, department, location, etc.)
  - Job poster information (name, email, role)
  - List of applicants for each job
  - Current hiring stage for each applicant
  - Application counts by status

#### 4. Funnel Velocity Analytics
- **Purpose**: Measure time efficiency in hiring process
- **Metric**: Average days spent per stage for all applicants of a job
- **Stages to Track**:
  - APPLIED → ACCEPTED
  - ACCEPTED → UNDER_EVALUATION
  - UNDER_EVALUATION → PROCESSING_INTERVIEW
  - PROCESSING_INTERVIEW → INTERVIEW_DONE
  - INTERVIEW_DONE → HIRING_IN_PROCESS
  - HIRING_IN_PROCESS → DOCUMENT_REQUESTED
  - DOCUMENT_REQUESTED → DOCUMENT_SUBMITTED
  - DOCUMENT_SUBMITTED → DOCUMENT_VERIFIED
  - DOCUMENT_VERIFIED → OFFER_SENT
  - OFFER_SENT → HIRED
  - HIRED → JOINED

#### 5. Onboarding Pipeline Data
- **Purpose**: Track candidates who have been hired
- **Data Points**:
  - List of hired candidates
  - Offer letter details
  - Joining date information
  - Onboarding status (HIRED vs JOINED)
  - Time from HIRED to JOINED

#### 6. Critical Dropoff Data
- **Purpose**: Identify stages where candidates drop off
- **Data Points**:
  - Dropoff rate per stage
  - Jobs with highest dropoff rates
  - Stage-wise rejection reasons
  - Time spent before dropoff

---

## High Level Design (HLD)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Corporate Dashboard)            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Analytics API Endpoints                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Analytics Controller Layer                          │   │
│  └───────────────┬────────────────────────────────────┘   │
│                  │                                           │
│  ┌───────────────▼────────────────────────────────────┐   │
│  │  Analytics Service Layer                            │   │
│  │  - Data Aggregation                                 │   │
│  │  - Business Logic                                   │   │
│  │  - Metric Calculations                              │   │
│  └───────────────┬────────────────────────────────────┘   │
│                  │                                           │
└──────────────────┼───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼──────────┐
│   DynamoDB     │   │   OpenSearch      │
│                │   │                   │
│ - CompanyJob   │   │ - Jobs Index      │
│ - UserJobApp   │   │                   │
│ - CorporateUser│   │                   │
│ - CompanyDetail│   │                   │
│ - UserDetail   │   │                   │
└────────────────┘   └───────────────────┘
```

### Component Breakdown

#### 1. Analytics Controller
- Handles HTTP requests
- Validates input parameters
- Routes to appropriate service methods
- Formats responses

#### 2. Analytics Service
- Aggregates data from multiple sources
- Calculates metrics (velocity, dropoff rates, etc.)
- Applies business logic and filters
- Handles data transformation

#### 3. Data Access Layer
- **Job DAO**: Queries jobs from OpenSearch/DynamoDB
- **UserJobApplication DAO**: Queries applications from DynamoDB
- **CorporateUser DAO**: Fetches recruiter information
- **CompanyDetail DAO**: Fetches company information

### Data Flow

```
User Request
    ↓
Analytics Controller (Validate & Parse)
    ↓
Analytics Service (Business Logic)
    ↓
    ├─→ Job DAO → OpenSearch/DynamoDB
    ├─→ UserJobApplication DAO → DynamoDB
    ├─→ CorporateUser DAO → DynamoDB
    └─→ CompanyDetail DAO → DynamoDB
    ↓
Aggregate & Calculate Metrics
    ↓
Format Response
    ↓
Return to Frontend
```

---

## Low Level Design (LLD)

### 1. Analytics Home Page Endpoint

#### Service Method: `getAnalyticsHomePage()`

**Data Sources:**
- `CompanyJob` table (DynamoDB) - Get all jobs for company/admin
- `UserJobApplication` table (DynamoDB) - Get application counts
- `CorporateUser` table (DynamoDB) - Get recruiter information

**Logic:**
1. Determine user context (Corporate User vs Admin)
2. If Corporate User:
   - Filter jobs by `companyId` from user context
   - Get all recruiters for the company
3. If Admin:
   - Get all companies (or filter by selected recruiter)
   - If recruiter filter applied, filter jobs by `createdByCorporateUserId`
4. Aggregate metrics:
   - Total jobs count
   - Total applications count
   - Applications by status (group by status)
   - Active jobs vs Closed jobs
   - Recent activity (last 7/30 days)

**Response Structure:**
```typescript
{
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  closedJobs: number;
  applicationsByStatus: {
    [status: string]: number;
  };
  recentActivity: {
    jobsPostedLast7Days: number;
    applicationsLast7Days: number;
    applicationsLast30Days: number;
  };
  recruiterOptions?: Array<{
    id: string;
    name: string;
    email: string;
    companyId: string;
  }>;
}
```

### 2. Jobs Listing with Applications Endpoint

#### Service Method: `getJobsWithApplications()`

**Data Sources:**
- `CompanyJob` table (DynamoDB) or OpenSearch Jobs index
- `UserJobApplication` table (DynamoDB) - Get applications per job
- `CorporateUser` table (DynamoDB) - Get job poster details
- `UserDetail` table (DynamoDB) - Get applicant details

**Logic:**
1. Query jobs based on filters (companyId, recruiterId, date range, etc.)
2. For each job:
   - Get job poster details:
     - If `createdByCorporateUserId` exists → Query `CorporateUser` table
     - If `createdByUserId` exists → Query `UserDetail` table
   - Query applications for the job using `jobId` and `companyId`
   - Group applications by status
   - Attach applicant details (if needed)

**Response Structure:**
```typescript
{
  data: Array<{
    jobId: string;
    jobTitle: string;
    companyId: string;
    companyName: string;
    department: string;
    location: JobLocationDto;
    status: JobStatusEnum;
    createdAt: string;
    poster: {
      id: string;
      name: string;
      email: string;
      type: 'corporate-recruiter' | 'corporate-admin' | 'worko-admin';
    };
    applications: {
      total: number;
      byStatus: {
        [status: string]: number;
      };
      applicants?: Array<{
        applicationId: string;
        applicantId: string;
        applicantName: string;
        applicantEmail: string;
        status: JobApplicationStatus;
        appliedDate: string;
        matchingScore?: number;
      }>;
    };
  }>;
  pagination: {
    count: number;
    pageSize: number;
    lastKey?: string;
  };
}
```

### 3. Funnel Velocity Analytics Endpoint

#### Service Method: `getFunnelVelocityByJobId(jobId: string)`

**Data Sources:**
- `UserJobApplication` table (DynamoDB) - Get all applications for job
- `statusTracker` array in each application

**Logic:**
1. Query all applications for the given `jobId`
2. For each application, analyze `statusTracker` array:
   - Extract status transitions with timestamps
   - Calculate time difference between consecutive statuses
3. Aggregate metrics:
   - Average days per stage (across all applicants)
   - Median days per stage
   - Min/Max days per stage
   - Stage-wise breakdown

**Status Transition Stages:**
```
APPLIED → ACCEPTED
ACCEPTED → UNDER_EVALUATION
UNDER_EVALUATION → PROCESSING_INTERVIEW
PROCESSING_INTERVIEW → INTERVIEW_DONE
INTERVIEW_DONE → HIRING_IN_PROCESS
HIRING_IN_PROCESS → DOCUMENT_REQUESTED
DOCUMENT_REQUESTED → DOCUMENT_SUBMITTED
DOCUMENT_SUBMITTED → DOCUMENT_VERIFIED
DOCUMENT_VERIFIED → OFFER_SENT
OFFER_SENT → HIRED
HIRED → JOINED
```

**Response Structure:**
```typescript
{
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  applicationsAnalyzed: number;
  averageDaysPerStage: {
    [stage: string]: {
      average: number;
      median: number;
      min: number;
      max: number;
      sampleSize: number;
    };
  };
  overallAverageDays: number; // Average from APPLIED to current status
  stageBreakdown: Array<{
    fromStatus: JobApplicationStatus;
    toStatus: JobApplicationStatus;
    averageDays: number;
    medianDays: number;
    applicationsCount: number;
  }>;
}
```

### 4. Onboarding Pipeline Data Endpoint

#### Service Method: `getOnboardingPipelineData()`

**Data Sources:**
- `UserJobApplication` table (DynamoDB) - Filter by status HIRED or JOINED
- `offerLetterDetails` array in UserJobApplication
- `joiningDateDetails` array in UserJobApplication

**Logic:**
1. Query applications with status `HIRED` or `JOINED`
2. Filter by companyId (if corporate user) or all companies (if admin)
3. For each hired candidate:
   - Extract offer letter details
   - Extract joining date details
   - Calculate time from HIRED to JOINED (if JOINED)
   - Get candidate details

**Response Structure:**
```typescript
{
  totalHired: number;
  totalJoined: number;
  pendingJoining: number;
  averageDaysToJoin: number; // Average from HIRED to JOINED
  candidates: Array<{
    applicationId: string;
    jobId: string;
    jobTitle: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    hiredDate: string;
    joinedDate?: string;
    daysToJoin?: number;
    offerLetterDetails?: {
      sentDate: string;
      cloudFileName?: string;
      remarks?: string;
    };
    joiningDateDetails?: Array<{
      joiningDate: string;
      hrName?: string;
      hrEmail?: string;
      message?: string;
      actionDate: string;
    }>;
  }>;
}
```

### 5. Critical Dropoff Data Endpoint

#### Service Method: `getCriticalDropoffData()`

**Data Sources:**
- `UserJobApplication` table (DynamoDB)
- `statusTracker` array in each application

**Logic:**
1. Query all applications (filtered by company/job/date range)
2. Analyze `statusTracker` to identify:
   - Applications that reached each stage
   - Applications that dropped off (status changed to REJECTED or ON_HOLD)
   - Last status before dropoff
   - Time spent before dropoff
3. Calculate dropoff rates:
   - Dropoff rate per stage
   - Jobs with highest dropoff rates
   - Common dropoff stages

**Response Structure:**
```typescript
{
  totalApplications: number;
  totalDropoffs: number;
  overallDropoffRate: number; // Percentage
  dropoffByStage: Array<{
    stage: JobApplicationStatus;
    applicationsReached: number;
    dropoffs: number;
    dropoffRate: number;
    averageDaysBeforeDropoff: number;
  }>;
  jobsWithHighestDropoff: Array<{
    jobId: string;
    jobTitle: string;
    totalApplications: number;
    dropoffs: number;
    dropoffRate: number;
    criticalDropoffStage: JobApplicationStatus;
  }>;
}
```

### 6. Recruiter Selection Endpoint (Admin Only)

#### Service Method: `getRecruitersByCompany()`

**Purpose**: Get list of recruiters for admin to filter analytics

**Data Sources:**
- `CorporateUser` table (DynamoDB)
- `CompanyDetail` table (DynamoDB)

**Logic:**
1. Query all corporate users with type `CORPORATE_RECRUITER` or `CORPORATE_ADMIN`
2. Group by company
3. Attach company details

**Response Structure:**
```typescript
{
  recruiters: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
    companyName: string;
    userType: CorporateUserTypeEnum;
    jobsPosted: number; // Count of jobs created by this recruiter
  }>;
}
```

---

## API Endpoints

### Base Path: `/analytics`

### 1. GET `/analytics/home`
**Purpose**: Get analytics home page data

**Query Parameters:**
- `companyId` (optional): Filter by company (for admin)
- `recruiterId` (optional): Filter by recruiter (for admin)
- `dateRange` (optional): Filter by date range (e.g., "7d", "30d", "90d")

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company data
- Worko Admin: Can access all data with filters

**Response**: Analytics home page metrics

---

### 2. GET `/analytics/jobs-with-applications`
**Purpose**: Get jobs listing with their applications and posters

**Query Parameters:**
- `companyId` (optional): Filter by company
- `recruiterId` (optional): Filter by recruiter
- `jobId` (optional): Get specific job
- `status` (optional): Filter jobs by status
- `includeApplicants` (optional, boolean): Include detailed applicant list
- `pageSize` (optional, number): Pagination size
- `lastKey` (optional, string): Pagination token
- `dateRange` (optional): Filter by date range

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company data
- Worko Admin: Can access all data with filters

**Response**: Jobs with applications data

---

### 3. GET `/analytics/funnel-velocity/:jobId`
**Purpose**: Get funnel velocity metrics for a specific job

**Path Parameters:**
- `jobId` (required): Job ID

**Query Parameters:**
- `includeStageBreakdown` (optional, boolean): Include detailed stage breakdown

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company jobs
- Worko Admin: Can access all jobs

**Response**: Funnel velocity metrics

---

### 4. GET `/analytics/funnel-velocity`
**Purpose**: Get funnel velocity metrics aggregated across multiple jobs

**Query Parameters:**
- `companyId` (optional): Filter by company
- `recruiterId` (optional): Filter by recruiter
- `jobIds` (optional, array): Specific job IDs
- `dateRange` (optional): Filter by date range

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company data
- Worko Admin: Can access all data with filters

**Response**: Aggregated funnel velocity metrics

---

### 5. GET `/analytics/onboarding-pipeline`
**Purpose**: Get onboarding pipeline data for hired candidates

**Query Parameters:**
- `companyId` (optional): Filter by company
- `recruiterId` (optional): Filter by recruiter
- `jobId` (optional): Filter by job
- `status` (optional): Filter by status (HIRED or JOINED)
- `includeDetails` (optional, boolean): Include detailed candidate information

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company data
- Worko Admin: Can access all data with filters

**Response**: Onboarding pipeline data

---

### 6. GET `/analytics/dropoff`
**Purpose**: Get critical dropoff data

**Query Parameters:**
- `companyId` (optional): Filter by company
- `recruiterId` (optional): Filter by recruiter
- `jobId` (optional): Filter by job
- `dateRange` (optional): Filter by date range
- `topN` (optional, number): Top N jobs with highest dropoff (default: 10)

**Authorization**: 
- Corporate Admin/Recruiter: Can only access their company data
- Worko Admin: Can access all data with filters

**Response**: Critical dropoff data

---

### 7. GET `/analytics/recruiters` (Admin Only)
**Purpose**: Get list of recruiters for admin to filter analytics

**Query Parameters:**
- `companyId` (optional): Filter by company
- `includeJobCounts` (optional, boolean): Include job counts per recruiter

**Authorization**: Worko Admin only

**Response**: List of recruiters

---

## Data Models

### AnalyticsHomePageResponse
```typescript
interface AnalyticsHomePageResponse {
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  closedJobs: number;
  applicationsByStatus: Record<JobApplicationStatus, number>;
  recentActivity: {
    jobsPostedLast7Days: number;
    applicationsLast7Days: number;
    applicationsLast30Days: number;
  };
  recruiterOptions?: Array<{
    id: string;
    name: string;
    email: string;
    companyId: string;
    companyName: string;
  }>;
}
```

### JobWithApplicationsResponse
```typescript
interface JobWithApplicationsResponse {
  data: Array<{
    jobId: string;
    jobTitle: string;
    companyId: string;
    companyName: string;
    department: string;
    location: JobLocationDto;
    status: JobStatusEnum;
    createdAt: string;
    poster: {
      id: string;
      name: string;
      email: string;
      type: 'corporate-recruiter' | 'corporate-admin' | 'worko-admin';
    };
    applications: {
      total: number;
      byStatus: Record<JobApplicationStatus, number>;
      applicants?: Array<ApplicationDetail>;
    };
  }>;
  pagination: PaginationResponse;
}
```

### FunnelVelocityResponse
```typescript
interface FunnelVelocityResponse {
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  applicationsAnalyzed: number;
  averageDaysPerStage: Record<string, StageMetrics>;
  overallAverageDays: number;
  stageBreakdown: Array<StageBreakdown>;
}

interface StageMetrics {
  average: number;
  median: number;
  min: number;
  max: number;
  sampleSize: number;
}

interface StageBreakdown {
  fromStatus: JobApplicationStatus;
  toStatus: JobApplicationStatus;
  averageDays: number;
  medianDays: number;
  applicationsCount: number;
}
```

### OnboardingPipelineResponse
```typescript
interface OnboardingPipelineResponse {
  totalHired: number;
  totalJoined: number;
  pendingJoining: number;
  averageDaysToJoin: number;
  candidates: Array<OnboardingCandidate>;
}

interface OnboardingCandidate {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  hiredDate: string;
  joinedDate?: string;
  daysToJoin?: number;
  offerLetterDetails?: OfferLetterDetail;
  joiningDateDetails?: Array<JoiningDateDetail>;
}
```

### CriticalDropoffResponse
```typescript
interface CriticalDropoffResponse {
  totalApplications: number;
  totalDropoffs: number;
  overallDropoffRate: number;
  dropoffByStage: Array<DropoffStage>;
  jobsWithHighestDropoff: Array<JobDropoffMetrics>;
}

interface DropoffStage {
  stage: JobApplicationStatus;
  applicationsReached: number;
  dropoffs: number;
  dropoffRate: number;
  averageDaysBeforeDropoff: number;
}

interface JobDropoffMetrics {
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  dropoffs: number;
  dropoffRate: number;
  criticalDropoffStage: JobApplicationStatus;
}
```

---

## Implementation Considerations

### 1. Performance Optimization
- **Caching**: Consider caching frequently accessed analytics data (e.g., home page metrics) for 5-15 minutes
- **Pagination**: Implement pagination for large datasets
- **Batch Queries**: Use batch queries where possible to reduce database calls
- **Indexing**: Ensure proper GSI indexes exist on:
  - `UserJobApplication`: GSI1PK (companyId), GSI1SK (jobId)
  - `CompanyJob`: GSI1PK (companyId), GSI1SK (createdAt)
  - `CorporateUser`: GSI1PK (companyId)

### 2. Data Aggregation Strategy
- **Real-time vs Pre-computed**: 
  - Real-time: For current/filtered data
  - Pre-computed: Consider daily/hourly aggregation jobs for historical metrics
- **Incremental Updates**: For large datasets, consider incremental aggregation

### 3. Authorization & Security
- **Role-based Access**: 
  - Corporate users can only see their company data
  - Admin can see all data with filters
- **Input Validation**: Validate all query parameters
- **Rate Limiting**: Implement rate limiting for analytics endpoints

### 4. Error Handling
- **Graceful Degradation**: Return partial data if some queries fail
- **Logging**: Log all analytics queries for debugging
- **Error Messages**: Provide meaningful error messages

### 5. Scalability
- **Database Queries**: Optimize queries to avoid full table scans
- **Response Size**: Limit response sizes, use pagination
- **Async Processing**: For heavy computations, consider async processing with job queues

### 6. Testing Considerations
- **Unit Tests**: Test metric calculations
- **Integration Tests**: Test end-to-end data flow
- **Performance Tests**: Test with large datasets
- **Edge Cases**: Handle cases with no data, single application, etc.

### 7. Monitoring & Observability
- **Metrics**: Track API response times, error rates
- **Alerts**: Set up alerts for slow queries or high error rates
- **Dashboards**: Create dashboards for analytics API health

---

## Summary of Endpoints

| Endpoint | Method | Purpose | Authorization |
|----------|--------|---------|--------------|
| `/analytics/home` | GET | Analytics home page metrics | Corporate/Admin |
| `/analytics/jobs-with-applications` | GET | Jobs listing with applications | Corporate/Admin |
| `/analytics/funnel-velocity/:jobId` | GET | Funnel velocity for specific job | Corporate/Admin |
| `/analytics/funnel-velocity` | GET | Aggregated funnel velocity | Corporate/Admin |
| `/analytics/onboarding-pipeline` | GET | Onboarding pipeline data | Corporate/Admin |
| `/analytics/dropoff` | GET | Critical dropoff data | Corporate/Admin |
| `/analytics/recruiters` | GET | List recruiters (for admin filtering) | Admin Only |

**Total Endpoints: 7**

---

## Next Steps

1. **Create Analytics Service**: Implement service layer with all methods
2. **Create Analytics Controller**: Implement controller layer
3. **Create Analytics Router**: Set up routes
4. **Create DTOs**: Define request/response DTOs
5. **Create Schemas**: Define validation schemas
6. **Implement DAO Methods**: Add any required DAO methods
7. **Add Authorization Middleware**: Ensure proper access control
8. **Write Unit Tests**: Test business logic
9. **Write Integration Tests**: Test end-to-end flow
10. **Performance Testing**: Optimize queries and add caching if needed

---

## Notes

- All endpoints should support pagination where applicable
- Date ranges should be flexible (last 7 days, 30 days, 90 days, custom range)
- Consider adding export functionality (CSV/Excel) for analytics data
- Future enhancement: Real-time analytics using WebSockets or Server-Sent Events
- Future enhancement: Scheduled reports via email
