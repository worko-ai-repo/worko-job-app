# Interview Scheduler for Job Applications

## Goal
Allow `corporate-admin`, `corporate-recruiter`, and `admin` users to schedule and manage interviews for candidates once a job application reaches `PROCESSING_INTERVIEW`.

This is a sub-flow under existing `UserJobApplication` status handling:
- `PROCESSING_INTERVIEW`: recruiter can schedule/manage interview rounds
- `INTERVIEW_DONE`: recruiter can move only when interview constraints are satisfied

---

## Functional Requirements

### 1) Interview lifecycle states
Interview round status will be:
- `SCHEDULED`
- `RESCHEDULED`
- `CANCELLED`
- `COMPLETED`

Rules:
- `CANCELLED` requires `cancellationReason` (required) and `cancellationFeedback` (optional)
- `COMPLETED` requires organizer `rating` and `feedback`
- evaluator feedback/rating is optional but if provided, validate range (1-5)

### 2) Round constraints
- Only **one active round** per application at a time (`SCHEDULED` or `RESCHEDULED`)
- To create next round, previous round must be `COMPLETED` or `CANCELLED`
- Maximum **5 completed rounds** per job application
- To move application to `INTERVIEW_DONE`, last completed round must contain required organizer feedback/rating

### 3) Eligibility constraints
- Interview scheduling is allowed only when job application status is `PROCESSING_INTERVIEW`
- Only allowed roles can schedule/reschedule/cancel/complete
- Organizer must have interview provider account connected before scheduling

### 4) Participants
- Applicant (required)
- Organizer (required)
- Additional attendees (optional):
  - evaluator (internal user)
  - external attendee (non-worko email)
- Only organizer and evaluator can submit round feedback/rating

### 5) External calendar meeting
- Create meeting link and event in organizer calendar
- Add applicant + attendees to event invite list
- On reschedule/cancel, update/cancel event in provider
- Provider notifications will send mails; backend mail templates optional and can be phase-2

---

## End-to-End Flow

1. Recruiter/admin updates application to `PROCESSING_INTERVIEW` (already exists in codebase)
2. UI enables interview actions for that application
3. On `initialize interview`:
   - validate application + status
   - validate organizer integration token
   - validate active-round + max-round constraints
   - create external calendar event + meeting link
   - persist interview round record
4. On `reschedule`:
   - validate round is active
   - update external event
   - persist status `RESCHEDULED` with change log
5. On `cancel`:
   - validate reason
   - cancel external event
   - persist status `CANCELLED`
6. On `complete`:
   - validate organizer feedback + rating
   - persist status `COMPLETED` and evaluation fields
7. When business criteria met, recruiter moves application to `INTERVIEW_DONE`

---

## Existing Code Reuse (from current backend)

### Reusable architecture patterns
- `src/daos/UserJobApplication.dao.ts`
  - PK/SK/GSI pattern conventions
  - query + pagination approach
- `src/daos/UserInterview.dao.ts`
  - dedicated interview DAO structure
  - id-based fetch by GSI
- `src/helpers/dynamoose.helper.ts`
  - `getPaginatedResultsWithMatchingConditions(...)`
- `src/services/Ulid.service.ts`
  - ULID generation for interview round IDs

### Reusable domain/status integrations
- `src/enums/UserJobApplication.enum.ts`
  - existing statuses include `PROCESSING_INTERVIEW` and `INTERVIEW_DONE`
- `src/dtos/UserJobApplication.dto.ts`
  - include interview details pattern already present (`includeInterviewDetails`)

### Reusable cross-cutting services
- Existing role/auth middleware used by routers/controllers
- Existing logging style (`global.logger.info`)
- Existing response and validation schema patterns (`src/schemas/*`)

---

## Dependencies to Install

### Required
- `googleapis`
  - to create/update/cancel Google Calendar events and conference link via OAuth tokens
  - must follow the bottom section **Walker AI — Meeting Link Creation Flow**
- `ics`
  - generate `.ics` attachment embedding Meet link (as in bottom flow)

### Already present (reuse, no install)
- `axios` (already in `package.json`)
- `dynamoose` (already in `package.json`)
- `luxon` (already in `package.json`)
- `joi` (already in `package.json`)
- `@aws-sdk/client-ses` (already in `package.json`) for branded invite email with ICS attachment

### Note (conference requestId)
- Bottom flow uses `uuidv4()` for `conferenceData.createRequest.requestId`
- In this backend we can use `UlidService.getUlidId()` for the same purpose (any unique string works)

---

## Data Model and Storage

We are using **GCP Firestore** for the new interview partition/collection.
Existing `UserJobApplication` remains in DynamoDB unchanged.

## A) Existing partition affected (UPDATED)
1. `UserJobApplication` (DynamoDB, `src/db/models/UserJobApplication.model.ts`)
- No mandatory schema field addition required for MVP, but optional denormalized fields can be added:
  - `latestInterviewRoundId?: string`
  - `interviewRoundCount?: number`
  - `activeInterviewRoundId?: string`

## B) Existing partition likely affected (UPDATED)
2. `User` / `CorporateUser` integration storage
- Current `User.model.ts` is generic schema; token storage may exist in shared/common user records.
- Add provider token object in appropriate identity entity (final choice after product decision):
  - `hasGoogleInterviewAccountDetails: { accessToken, refreshToken, expiryDate?, scope? }`

> Note: choose one source of truth for organizer token (recommended: corporate-user level, not candidate user).

## C) New collection to create (CREATED)
3. `jobApplicationInterviews` (Firestore collection, separate from existing `UserInterview`)

Firestore document id:
- `interviewId`: ULID (`UlidService.getUlidId()`)

Recommended query fields (to support dashboards):
- `applicationId`, `jobId`, `companyId`
- `applicantId`, `applicantEmail`
- `organizerId`, `organizerEmail`, `organizerRole`
- `attendees[]`: `{ type: EVALUATOR|EXTERNAL, email, name?, userId? }`
- `evaluatorAttendeeIds[]`: array of evaluator user ids (for evaluator dashboard filtering)
- `roundNumber`, `status`
- `scheduledAt`, `endAt`, `durationMinutes`, `timezone`
- `meetingProvider: GOOGLE_MEET`, `meetingLink`, `providerEventId`
- `cancellationReason?`, `cancellationFeedback?`
- `completion`:
  - `organizer`: `{ rating, feedback, submittedAt, submittedById }`
  - `evaluator`: `{ rating?, feedback?, submittedAt?, submittedById? }`
- `feedbackRequest`:
  - `status: NOT_REQUESTED | REQUESTED | SUBMITTED`
  - `requestedById`, `requestedAt`
  - `allowedEvaluatorIds[]`

Suggested attributes:
- `id`, `applicationId`, `jobId`
- `applicantId`, `applicantEmail`
- `organizerId`, `organizerEmail`, `organizerRole`
- `roundNumber`, `status`
- `scheduledAt`, `durationMinutes`, `timezone`
- `meetingProvider`, `meetingLink`, 
- `attendees[]` (evaluator/external)
- `cancellationReason?`, `cancellationFeedback?`
- `completionFeedback?` , `completionRating`, 
- `audit`: createdBy/updatedBy and timestamps

Attendee:
    `email`,`name`,`type :  evaluator , misc`, 
    `id :if evaluator present`,`feedback`,`rating`

---

## API Surface (proposed)

Base path under job application:
- `POST /user-job-applications/:id/interviews` -> schedule round
- `PATCH /user-job-applications/:id/interviews/:interviewId/reschedule`
- `PATCH /user-job-applications/:id/interviews/:interviewId/cancel`
- `PATCH /user-job-applications/:id/interviews/:interviewId/complete` -> organizer completes; can request evaluator feedback
- `GET /user-job-applications/:id/interviews`
- `GET /user-job-applications/:id/interviews/:interviewId`

Evaluator dashboard:
- `GET /evaluator/interviews`
- `GET /evaluator/interviews/:interviewId`
- `POST /evaluator/interviews/:interviewId/feedback`

---

## File Touch Matrix (Created / Updated + Purpose)

## Model/DTO/Enum/Schema layer
- `src/db/gcp-firestore-models/JobApplicationInterview.model.ts` - **Created**
  - Firestore document type + collection mapping (new partition in GCP)
- `src/dtos/JobApplicationInterview.dto.ts` - **Created**
  - Request/response DTOs for schedule/reschedule/cancel/complete/list APIs
- `src/enums/JobApplicationInterview.enum.ts` - **Created**
  - interview statuses, participant types, provider enum
- `src/schemas/JobApplicationInterview.schema.ts` - **Created**
  - Joi validations for all interview actions

## DAO/Service/Controller/Router layer
- `src/daos/JobApplicationInterview.firestore.dao.ts` - **Created**
  - Firestore CRUD/query + constraint checks (active round, max completed count)
- `src/services/JobApplicationInterview.service.ts` - **Created**
  - business logic + integration orchestration + status validations (includes evaluator feedback gating)
- `src/controllers/JobApplicationInterview.controller.ts` - **Created**
  - request handling and service mapping
- `src/routers/JobApplicationInterview.router.ts` - **Created**
  - route definitions + role guards
- `src/controllers/EvaluatorInterview.controller.ts` - **Created**
  - evaluator dashboard: list/get + submit feedback
- `src/routers/EvaluatorInterview.router.ts` - **Created**
  - evaluator dashboard routes
- `src/routers/UserJobApplication.router.ts` - **Updated**
  - mount interview sub-routes under application resource

## Integration layer
- `src/libraries/google-calendar.library.ts` - **Created**
  - create/update/cancel event APIs and meet link extraction (per bottom Walker AI flow)
- `src/libraries/ics-invite.library.ts` - **Created**
  - generate `.ics` content embedding meet link (per bottom Walker AI flow)
- `src/services/InterviewInviteEmail.service.ts` - **Created**
  - send branded email via SES raw MIME with `.ics` attachment (per bottom Walker AI flow)
- `src/services/OAuthInterviewIntegration.service.ts` - **Created/Updated**
  - organizer token retrieval/refresh logic and provider checks

## Existing feature integration
- `src/services/UserJobApplication.service.ts` - **Updated**
  - enforce transition constraints between `PROCESSING_INTERVIEW` and `INTERVIEW_DONE`
  - optionally include interview summary in listing/details when requested
- `src/dtos/UserJobApplication.dto.ts` - **Updated**
  - add interview summary type if embedded response is needed
- `src/enums/UserJobApplication.enum.ts` - **Updated (if needed)**
  - only if additional transition validation enum entries are introduced

## Optional identity model updates
- `src/db/models/CorporateUser.model.ts` or token source model - **Updated**
  - store interview provider token metadata for organizer
- `src/dtos/CorporateUser.dto.ts` (or relevant DTO file) - **Updated**
  - type definitions for token object

---

## Validation Rules Checklist
- application exists and belongs to valid company/job context
- application status must be `PROCESSING_INTERVIEW` for scheduling actions
- organizer role must be `admin` / `corporate-admin` / `corporate-recruiter`
- organizer token must exist and be valid (or refreshable)
- only one active round at a time
- max 5 completed rounds
- cancel requires reason
- complete requires organizer feedback + rating
- evaluator rating/feedback allowed only for evaluator attendee
- evaluator feedback submission allowed only when:
  - interview is `COMPLETED` by organizer
  - `feedbackRequest.status === REQUESTED`
  - evaluator id is in `feedbackRequest.allowedEvaluatorIds[]`

---

## Error Cases
- organizer account not connected to calendar provider
- scheduling attempted when application not in `PROCESSING_INTERVIEW`
- trying to create next round while previous still active
- trying to mark `INTERVIEW_DONE` without required completed round feedback
- provider API failure while event create/update/cancel

---

## Testing Plan

### Unit
- DAO query filters and active/completed round counters
- status transition validation
- participant permission checks

### Integration
- schedule -> reschedule -> cancel flow
- schedule -> complete -> next round flow
- max 5 completed rounds enforcement
- application move to `INTERVIEW_DONE` guard behavior

### Regression
- existing `UserJobApplication` endpoints remain backward compatible
- `includeInterviewDetails` behavior unchanged for clients not using new feature

---

## Non-Goals (MVP)
- multi-provider calendar support (Google only first)
- custom email templates for each event action (use provider notification initially)
- interviewer availability optimization engine

---

## Implementation Notes
- Keep this partition separate from existing `UserInterview` (practice/mock interview module).
- Avoid changing existing status names in `UserJobApplication`; only enforce new constraints around current statuses.
- Prefer idempotent API behavior for schedule/reschedule/cancel to reduce duplicate event creation risk.

>>>
# Walker AI — Meeting Link Creation Flow

## Overview

When a user schedules an interview on Walker AI, the platform:
1. Creates a Google Meet link via the **Google Calendar API** (using an OAuth2 client)
2. Generates an **.ics** calendar file embedding the Meet link
3. Sends a **branded email** to all attendees via **AWS SES** with the ICS attached
4. Returns the **meetLink** back in the API response

---

## Request Body

```json
POST /schedule

{
  "title": "Technical Interview",
  "description": "Backend round",
  "startTime": "2026-04-02T10:00:00Z",
  "endTime": "2026-04-02T10:30:00Z",
  "attendees": [
    "candidate@email.com",
    "hr@company.com"
  ]
}
```

---

## End-to-End Flow

```
Walker AI Client
      |
      | POST /schedule
      v
 Express API
      |
      |-- 1. Validate request body (title, times, attendees[])
      |
      |-- 2. Create OAuth2 Calendar Client
      |       - google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET)
      |       - auth.setCredentials({ refresh_token })
      |       - google.calendar({ version: 'v3', auth })
      |
      |-- 3. Insert Calendar Event
      |       - conferenceDataVersion: 1        ← triggers Meet link
      |       - sendUpdates: 'none'             ← Google stays silent
      |       - returns hangoutLink
      |
      |-- 4. Generate ICS File
      |       - embed hangoutLink as location
      |       - include title, start, end, attendees
      |
      |-- 5. Send via AWS SES
      |       - raw MIME email
      |       - branded HTML template
      |       - .ics attached
      |       - sent to all attendees[]
      |
      | res.json({ meetLink, eventId })
      v
Walker AI Client  ←  receives meetLink in response
```

---

## Step-by-Step Implementation

### Step 1 — Validate request body

```js
const { title, description, startTime, endTime, attendees } = req.body;

if (!title || !startTime || !endTime || !attendees?.length) {
  return res.status(400).json({ error: 'Missing required fields' });
}
```

---

### Step 2 — Create OAuth2 Calendar Client

Initialize once at server startup, not per-request.

```js
const { google } = require('googleapis');

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

auth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN   // stored from one-time OAuth flow
});

const calendarClient = google.calendar({ version: 'v3', auth });
```

> **One-time setup:** Run the OAuth consent flow once to obtain a `refresh_token`. Save it in your `.env`. The client handles token refresh automatically from then on.

---

### Step 3 — Insert Calendar Event (Meet link)

```js
const { v4: uuidv4 } = require('uuid');

const event = {
  summary: title,
  description,
  start: { dateTime: startTime },
  end:   { dateTime: endTime },
  attendees: attendees.map(email => ({ email })),
  conferenceData: {
    createRequest: {
      requestId: uuidv4(),
      conferenceSolutionKey: { type: 'hangoutsMeet' },
    },
  },
};

const response = await calendarClient.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,   // required — triggers Meet link generation
  sendUpdates: 'none',        // Google does NOT send any emails
  requestBody: event,
});

const meetLink = response.data.hangoutLink;
const eventId  = response.data.id;
```

---

### Step 4 — Generate ICS File

```bash
npm install ics
```

```js
const ics = require('ics');

function generateICS({ title, description, startTime, endTime, meetLink }) {
  const start = new Date(startTime);
  const end   = new Date(endTime);

  const { value } = ics.createEvent({
    title,
    description: `${description}\n\nJoin Meet: ${meetLink}`,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(),
            start.getHours(), start.getMinutes()],
    end:   [end.getFullYear(),   end.getMonth() + 1,   end.getDate(),
            end.getHours(),      end.getMinutes()],
    location: meetLink,
    url: meetLink,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  });

  return value;
}
```

---

### Step 5 — Send via AWS SES

```bash
npm install @aws-sdk/client-ses
```

```js
const { SESClient, SendRawEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION });

async function sendInviteEmail({ attendees, title, meetLink, icsContent }) {
  const boundary = 'walker_ai_boundary';

  const htmlBody = `
    <h2>You have been invited: ${title}</h2>
    <p><a href="${meetLink}">Join Google Meet</a></p>
    <p>Open the attached .ics file to add this event to your calendar.</p>
  `;

  const rawEmail = [
    `From: Walker AI <noreply@walkerai.com>`,
    `To: ${attendees.join(', ')}`,
    `Subject: Interview Invite: ${title}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/calendar; method=REQUEST; name="invite.ics"`,
    `Content-Disposition: attachment; filename="invite.ics"`,
    ``,
    icsContent,
    `--${boundary}--`,
  ].join('\r\n');

  await ses.send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(rawEmail) },
  }));
}
```

---

### Final Route

```js
app.post('/schedule', async (req, res) => {
  try {
    const { title, description, startTime, endTime, attendees } = req.body;

    // Step 3 — Get Meet link
    const response = await calendarClient.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'none',
      requestBody: {
        summary: title,
        description,
        start: { dateTime: startTime },
        end:   { dateTime: endTime },
        attendees: attendees.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = response.data.hangoutLink;
    const eventId  = response.data.id;

    // Step 4 — Generate ICS
    const icsContent = generateICS({ title, description, startTime, endTime, meetLink });

    // Step 5 — Send branded email via SES
    await sendInviteEmail({ attendees, title, meetLink, icsContent });

    // Return meetLink to client
    res.json({ meetLink, eventId, message: 'Invites sent to all attendees' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});
```

---

## Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_REFRESH_TOKEN=your_refresh_token_from_oauth_flow

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## What Each Attendee Receives

| | Value |
|---|---|
| Sender | `noreply@walkerai.com` (your SES domain) |
| Subject | `Interview Invite: <title>` |
| Body | Branded HTML with Join Meet button |
| Attachment | `invite.ics` — works in Google Calendar, Outlook, Apple Calendar |
| Google sends | Nothing — `sendUpdates: 'none'` |

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| OAuth2 client over service account | Simpler setup, acts as a real user account, no credential file needed |
| `sendUpdates: 'none'` | Prevents Google from sending its own plain invite email |
| SES raw MIME | Required for ICS attachment — SES simple send does not support attachments |
| ICS location = meetLink | Ensures all calendar apps (Outlook, Apple) surface the Meet link prominently |
| `refresh_token` in env | One-time OAuth flow, client auto-refreshes — no per-request auth overhead |

---

## Frontend Endpoint Contract (method / query / body / response)

### Common
- **Auth**: required for all endpoints (based on existing authorizer + roles)
- **Role access**:
  - organizer actions: `admin`, `corporate-admin`, `corporate-recruiter`
  - evaluator dashboard: `evaluator` (and must be assigned to the interview)

---

### 1) Schedule interview round (organizer)
**Method**: `POST`  
**Path**: `/user-job-applications/:applicationId/interviews`  
**Query params**: none  
**Request body**:
```json
{
  "title": "Technical Interview",
  "description": "Backend round",
  "startTime": "2026-04-02T10:00:00Z",
  "endTime": "2026-04-02T10:30:00Z",
  "timezone": "UTC",
  "attendees": [
    { "type": "EVALUATOR", "userId": "01JEVAL...ULID", "email": "eval@worko.ai", "name": "Eva L" },
    { "type": "EXTERNAL", "email": "observer@company.com", "name": "Observer" }
  ]
}
```
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "applicationId": "01JAPP...ULID",
  "roundNumber": 1,
  "status": "SCHEDULED",
  "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
  "providerEventId": "google_event_id",
  "scheduledAt": "2026-04-02T10:00:00Z",
  "endAt": "2026-04-02T10:30:00Z",
  "message": "Invites sent to all attendees"
}
```

---

### 2) List interviews for a job application (organizer/corp/admin)
**Method**: `GET`  
**Path**: `/user-job-applications/:applicationId/interviews`  
**Query params**:
- `limit` (number, optional)
- `cursor` (string, optional)
**Request body**: none  
**Response (200)**:
```json
{
  "items": [
    {
      "interviewId": "01JINT...ULID",
      "roundNumber": 1,
      "status": "SCHEDULED",
      "scheduledAt": "2026-04-02T10:00:00Z",
      "endAt": "2026-04-02T10:30:00Z",
      "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
      "attendees": [
        { "type": "EVALUATOR", "userId": "01JEVAL...ULID", "email": "eval@worko.ai", "name": "Eva L" }
      ],
      "feedbackRequest": { "status": "NOT_REQUESTED" }
    }
  ],
  "nextCursor": null
}
```

---

### 3) Get interview details (organizer/corp/admin)
**Method**: `GET`  
**Path**: `/user-job-applications/:applicationId/interviews/:interviewId`  
**Query params**: none  
**Request body**: none  
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "applicationId": "01JAPP...ULID",
  "jobId": "01JJOB...ULID",
  "roundNumber": 1,
  "status": "SCHEDULED",
  "scheduledAt": "2026-04-02T10:00:00Z",
  "endAt": "2026-04-02T10:30:00Z",
  "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
  "providerEventId": "google_event_id",
  "attendees": [],
  "completion": null,
  "feedbackRequest": { "status": "NOT_REQUESTED" }
}
```

---

### 4) Reschedule interview (organizer)
**Method**: `PATCH`  
**Path**: `/user-job-applications/:applicationId/interviews/:interviewId/reschedule`  
**Query params**: none  
**Request body**:
```json
{
  "title": "Technical Interview (Rescheduled)",
  "description": "Backend round",
  "startTime": "2026-04-03T10:00:00Z",
  "endTime": "2026-04-03T10:30:00Z",
  "timezone": "UTC"
}
```
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "status": "RESCHEDULED",
  "scheduledAt": "2026-04-03T10:00:00Z",
  "endAt": "2026-04-03T10:30:00Z",
  "meetLink": "https://meet.google.com/xxx-xxxx-xxx"
}
```

---

### 5) Cancel interview (organizer)
**Method**: `PATCH`  
**Path**: `/user-job-applications/:applicationId/interviews/:interviewId/cancel`  
**Query params**: none  
**Request body**:
```json
{
  "cancellationReason": "Candidate requested change",
  "cancellationFeedback": "Rescheduling in next week"
}
```
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "status": "CANCELLED"
}
```

---

### 6) Complete interview + request evaluator feedback (organizer)
**Method**: `PATCH`  
**Path**: `/user-job-applications/:applicationId/interviews/:interviewId/complete`  
**Query params**: none  
**Request body**:
```json
{
  "organizer": { "rating": 4, "feedback": "Strong fundamentals" },
  "requestEvaluatorFeedback": true,
  "allowedEvaluatorIds": ["01JEVAL...ULID"]
}
```
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "status": "COMPLETED",
  "completion": {
    "organizer": { "rating": 4, "feedback": "Strong fundamentals" },
    "evaluator": null
  },
  "feedbackRequest": {
    "status": "REQUESTED",
    "allowedEvaluatorIds": ["01JEVAL...ULID"]
  }
}
```

---

### 7) Evaluator dashboard — list interviews requiring feedback (evaluator)
**Method**: `GET`  
**Path**: `/evaluator/interviews`  
**Query params**:
- `status` (optional; default: `REQUESTED`)  
- `limit` (number, optional)
- `cursor` (string, optional)
**Request body**: none  
**Response (200)**:
```json
{
  "items": [
    {
      "interviewId": "01JINT...ULID",
      "applicationId": "01JAPP...ULID",
      "roundNumber": 1,
      "scheduledAt": "2026-04-02T10:00:00Z",
      "status": "COMPLETED",
      "feedbackRequest": { "status": "REQUESTED" }
    }
  ],
  "nextCursor": null
}
```

---

### 8) Evaluator dashboard — get interview detail (evaluator)
**Method**: `GET`  
**Path**: `/evaluator/interviews/:interviewId`  
**Query params**: none  
**Request body**: none  
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "applicationId": "01JAPP...ULID",
  "roundNumber": 1,
  "scheduledAt": "2026-04-02T10:00:00Z",
  "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
  "completion": {
    "organizer": { "rating": 4, "feedback": "Strong fundamentals" },
    "evaluator": null
  },
  "feedbackRequest": { "status": "REQUESTED" }
}
```

---

### 9) Evaluator dashboard — submit feedback (evaluator)
**Method**: `POST`  
**Path**: `/evaluator/interviews/:interviewId/feedback`  
**Query params**: none  
**Request body**:
```json
{
  "rating": 5,
  "feedback": "Excellent communication and system design"
}
```
**Response (200)**:
```json
{
  "interviewId": "01JINT...ULID",
  "feedbackRequest": { "status": "SUBMITTED" },
  "completion": {
    "organizer": { "rating": 4, "feedback": "Strong fundamentals" },
    "evaluator": { "rating": 5, "feedback": "Excellent communication and system design" }
  }
}
```


Implemented the interview scheduler APIs end-to-end in project convention style (JSDoc, controller/service/dao/dto/schema/model layering, router wiring, Firestore usage, existing email flow).

What I added
New interview domain types

src/enums/JobApplicationInterview.enum.ts
src/db/gcp-firestore-models/JobApplicationInterview.model.ts
src/dtos/JobApplicationInterview.dto.ts
src/schemas/JobApplicationInterview.schema.ts
Firestore DAO

src/daos/JobApplicationInterview.firestore.dao.ts
Uses existing gcpFirestoreLibrary + gcpFirestoreUtilObj.paginateGcpFirestore
Business service

src/services/JobApplicationInterview.service.ts
Implements:
schedule
list by application
get by id
reschedule
cancel
complete (organizer rating/feedback mandatory)
evaluator list
evaluator submit feedback
Enforces key constraints:
application must be in PROCESSING_INTERVIEW
only one active round
max 5 completed rounds
evaluator feedback only when feedback request is REQUESTED and evaluator is allowed
Google Meet creation/update/cancel via Calendar API
Email sending via existing emailLibrary.sendEmail(...) and template enums/placeholders (no direct SES client usage)
Controllers + routers

src/controllers/JobApplicationInterview.controller.ts
src/controllers/EvaluatorInterview.controller.ts
src/routers/JobApplicationInterview.router.ts