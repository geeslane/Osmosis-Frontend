# Backend Prompt: Dashboard APIs (Calls, Availability, Mentee View, Modules)

Copy the prompt below into your backend codebase (e.g. paste into Cursor/AI chat) to implement the APIs that power the dashboard frontend. This document covers:

- **Calls tab:** Admin Mentorship Calls table, Mentor call history (previous / upcoming / requests), Mentee/teenager call views, call details and modals
- **Availability schedule:** Mentor weekly schedule, meeting link, Google Calendar sync, available slots for booking
- **Mentee view:** List of mentees (for admins and mentors), mentee detail page, module progress list and detail
- **Teenager module progress:** Modules list, module detail (notes, workbook, deliverables), per-teenager progress
- **Live sessions:** List and detail for all roles; mentees view-only (no add/edit/cancel); comments and replies with author name, datetime, picture; notifications for mentees

Your implementation must match the request/response shapes below so the frontend works without changes.

---

## PROMPT (copy everything below this line)

---

## 1. Mentor Availability Schedule

Implement the backend APIs for the **Mentor Availability Schedule** feature. The frontend is already built and expects these exact endpoints.

### 1.1 GET /mentor/availability

**Auth:** Bearer token. User must be a MENTOR. Resolve mentor ID from the authenticated user.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "weeklySchedule": [
      { "day": "monday", "blocks": [{ "start": "09:00", "end": "12:00" }, { "start": "14:00", "end": "17:00" }] },
      { "day": "tuesday", "blocks": [] },
      { "day": "wednesday", "blocks": [{ "start": "10:00", "end": "15:00" }] },
      { "day": "thursday", "blocks": [] },
      { "day": "friday", "blocks": [] },
      { "day": "saturday", "blocks": [] },
      { "day": "sunday", "blocks": [] }
    ],
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "googleCalendarSynced": false
  }
}
```

- `weeklySchedule`: Array of 7 objects, one per day. `day` must be lowercase: monday, tuesday, wednesday, thursday, friday, saturday, sunday.
- `blocks`: Array of `{ start: "HH:mm", end: "HH:mm" }` in 24h format. Times are 6:00–22:00 in 30-min increments.
- `meetingLink`: Required string. URL used for all mentoring sessions (Google Meet, Zoom, etc.).
- `googleCalendarSynced`: Boolean. Whether the mentor has connected Google Calendar.

**Response 404 if no availability configured:** Return 404 or `{ success: true, data: null }`. The frontend handles both.

### 1.2 PUT /mentor/availability

**Auth:** Bearer token. User must be a MENTOR.

**Request body (JSON):**
```json
{
  "weeklySchedule": [
    { "day": "monday", "blocks": [{ "start": "09:00", "end": "12:00" }] },
    { "day": "tuesday", "blocks": [] }
  ],
  "meetingLink": "https://meet.google.com/xyz",
  "googleCalendarSynced": false
}
```

**Response 200:** `{ "success": true, "data": { ...saved availability }, "message": "Availability saved successfully" }`. Validate `day` and block times.

### 1.3 POST /mentor/availability/google-calendar/sync

**Auth:** Bearer token. MENTOR. Connect mentor’s Google Calendar (scope: calendar.events). Store tokens, set `googleCalendarSynced: true`. Return `{ success: true, message: "Google Calendar synced successfully" }` or `{ success: false, message: "..." }` on failure.

### 1.4 GET /mentor/:mentorId/available-slots?date=YYYY-MM-DD&duration=30

**Auth:** Bearer token (mentee or authenticated user). Return time slots available for that date: apply mentor’s weeklySchedule for the weekday, subtract existing calendar events if synced, subtract already-booked sessions. Response: `{ "success": true, "data": { "slots": [{ "start": "09:00", "end": "09:30" }, ...] } }`.

### 1.5 GET /mentor/:id and PUT /mentor/:id/profile

Mentor object must include `mentorshipTopics` (array of strings). PUT must accept and persist `mentorshipTopics`. Used in availability schedule flow.

### 1.5a GET /mentor/me/stats (mentor dashboard)

**Auth:** Bearer token. User must be MENTOR. Returns summary stats for the mentor dashboard.

**Response 200:** `{ "success": true, "data": { "averageRating": 4.2, "totalCalls": 42 } }` — `averageRating` is the mentor’s average rating from mentee feedback; `totalCalls` is the number of calls the mentor has had (completed or total). Used on the dashboard as “Rating” and “Calls had”.

### 1.6 Google Calendar: create event on book, delete on cancel

When a mentee books a call and mentor has `googleCalendarSynced: true`, create a calendar event; store event ID. On cancel, delete the event by ID.

### 1.7 Central mentorship topics (single source of truth)

**Mentorship topics must be the same list everywhere:** mentor registration (signup), mentor availability schedule (topic selection), and mentee “Book a call” (topic dropdown). The frontend uses one source:

- **GET /dropdowns?type=mentorship-topics**

**Response 200:** `{ "success": true, "data": [{ "label": "Career guidance", "value": "career-guidance" }, ...] }`

Use this same list for:
- Mentor signup: mentor selects topic(s) from this list.
- Mentor availability: when configuring schedule, mentor selects topics they offer from this list.
- Mentee book a call: mentee selects one topic; then the app lists mentors who have that topic in their profile.

### 1.8 Mentee book a call flow

**Booking window and mentor notice:** The frontend only shows dates starting **3 days from today** (so mentors get at least 3 days’ notice). When returning available slots (GET /mentor/:mentorId/available-slots) or accepting call requests (POST /call-requests), the backend should treat the bookable window as starting from **today + 3 days** (i.e. do not allow booking for today, tomorrow, or the day after). Reject or omit slots for dates before that window if your business rules require it.

**1. List mentors by topic**

- **GET /mentor?topic=&lt;topic-value&gt;&limit=50&status=ACTIVE** — e.g. `topic=career-guidance` (value from mentorship-topics dropdown).

**Auth:** Bearer token (mentee/teenager or authenticated user).

**Query params:** `topic` (required for this flow – value from mentorship-topics dropdown), `limit` (e.g. 50), `status=ACTIVE`. Return only mentors whose `mentorshipTopics` include the given topic.

**Response:** Same paginated mentor list as existing GET /mentor. Each mentor must include: `id`, `fullName`, `bio`, `linkedinUrl`, `pictureUrl`, `mentorshipTopics` (array), so the mentee can see name, photo, bio, LinkedIn link, and topics.

**2. Create call request (book a slot)**

- **POST /call-requests**

**Auth:** Bearer token. Caller must be a mentee/teenager.

**Request body (JSON):**
```json
{
  "mentorId": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "message": "optional string – what the mentee wants to talk about or questions they have"
}
```

**Response 200:** `{ "success": true, "message": "Request sent" }` (or similar). Create a pending call request; mentor can accept/decline. Optionally create a calendar event if mentor has Google Calendar synced (see 1.6).

**Booking eligibility (teenagers):** A teenager (mentee) must **not** be able to book if:
1. They **already have an upcoming call** (any accepted/scheduled call in the future). Reject **POST /call-requests** with **400** and a message like: `"You already have an upcoming call. You can book another after it."`
2. They **had a call in the past 7 days** (any completed or past call whose date is within the last 7 days). Reject **POST /call-requests** with **400** and a message like: `"You had a call in the last 7 days. You can book again after [date]."`

The frontend also checks these rules (using GET /teenager/me/calls/upcoming and GET /teenager/me/calls/previous) and hides or disables the booking flow when the teen is not eligible. The backend must enforce the same rules so that direct API calls cannot bypass them.

---

## 2. Mentorship Calls (Admin) & Mentee Detail by ID

The **Mentorship Calls** page is for admins (and optionally SUPERADMIN). It shows a table of all calls; row click opens **call details**; clicking a **mentee name** opens a **mentee details** modal loaded by mentee ID.

### 2.1 GET /calls

**Auth:** Bearer token. Admin or SUPERADMIN only.

**Query params:** `page` (default 1), `limit` (default 10), `search` (optional – filter by mentor or mentee name).

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "mentorName": "Alex Johnson",
      "menteeName": "Olivia Rhye",
      "menteeId": "teen-123",
      "date": "12 Dec, 2025",
      "time": "10:00 AM",
      "topic": "Hope",
      "callLength": "55m 34s",
      "status": "Completed",
      "comment": "Good",
      "menteeComment": "Very helpful session.",
      "rating": 4
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

- **menteeId** (required for mentee-name click): Mentee (teenager) user ID. When present, the frontend uses it to call `GET /teenager/:id` and show full mentee details in a modal.
- **time**: Optional. Shown with date in the table and in call detail.
- **menteeComment**: Optional. Mentee’s feedback; shown in call detail modal.
- **comment**: Mentor’s feedback (how the teen is doing / what team or parents should know).

When `search` is provided, filter server-side by mentor or mentee name.

### 2.2 GET /teenager/:id (for mentee details modal)

**Auth:** Bearer token. Used when an admin clicks a mentee name on the Mentorship Calls table (and elsewhere for mentee/teenager profile).

**Response 200:** Standard teenager/mentee profile. The frontend expects the payload under `data.data` (or your standard envelope), with at least:

- `id`, `teenagerFullName`, `teenagerEmail`, `teenagerPhoneNumber`
- `parentFullName`, `parentEmail`, `parentPhoneNumber`
- `address`, `hobbies`, `class`, `gender`, `dateOfBirth`
- `status` (e.g. ACTIVE, INACTIVE, PENDING)
- `pictureUrl` (optional)

---

## 3. Calls Tab – Mentor

Mentors see a **Calls** tab with: **Previous calls**, **Upcoming calls**, and **Call requests**. Each section has a table; row click opens a **detail** view/modal. Previous calls also have an **“Add feedback”** flow (how the teen is doing, what the team or parents should know).

### 3.1 Mentor – Previous calls

**List:** Same shape as call records (id, mentee name, date, time, topic, status). Support search/filter by mentee name if you add query params.

**Detail view:** Single call with mentee name, date/time, topic, and **mentee feedback** (menteeComment). Back button returns to list.

**Add feedback (session feedback):** After a call, mentor can submit feedback that is **not** a report of what was discussed, but: **how the teenager is doing** and **what the Osmosis team or parents should know**. Provide an endpoint such as:

- **PATCH or PUT /calls/:callId/feedback** (or equivalent)  
  **Body:** `{ "comment": "string" }`  
  Store as the mentor’s “session feedback” for that call (exposed as `comment` in GET /calls and in admin call detail).

### 3.2 Mentor – Upcoming calls

**List:** Same call-record shape, plus **notes** (optional string). Frontend shows: mentee name, date & time, topic, **notes** (truncated in table; full on hover and in detail). Row click → **upcoming call detail** (mentee name, date/time, topic, notes, “Join call” CTA).

**API:** e.g. **GET /mentor/me/calls/upcoming** (or equivalent) returning array of calls with `notes` when available.

### 3.3 Mentor – Call requests

**List:** Requests from mentees to book a call. Each row: **name**, **email**, **note** (mentee’s message), **status** (Pending / Accepted / Rejected). Row click → **detail modal** with full note and **Accept** / **Reject** actions.

**APIs:**

- **GET /mentor/me/call-requests** (or equivalent)  
  **Response:** `{ "data": [{ "id", "name", "email", "note", "status" }, ...] }`

- **POST /call-requests/:id/accept**  
  Set status to Accepted and create the booking (and calendar event if synced).

- **POST /call-requests/:id/reject**  
  **Body:** `{ "reason": "string" }` (message shown to mentee). Set status to Rejected.

---

## 4. Calls Tab – Teenager / Mentee

**Important:** Mentees (teenagers) do **not** have a “Call requests” tab. They only see **Previous calls** and **Upcoming calls**. Do not expose a call-requests list for the mentee Calls tab.

**APIs:**

- **GET /teenager/me/calls/previous** – list of past calls (same call record shape: mentor name, date, time, topic, status). Include **status** (e.g. Pending, Completed) so the frontend can show “Mark as completed” when appropriate.
- **GET /teenager/me/calls/upcoming** – list of upcoming calls. The mentee UI does **not** show a notes column in the table (only mentor upcoming shows notes in the table). You may still return notes for the detail view if needed.
- **Mentees do not need “print call history”** – no export/download endpoint is required for mentee call history.

**Mentee: mark call as completed**

- **PATCH /teenager/me/calls/:callId/complete** (or equivalent)  
  **Auth:** Bearer token. User must be the mentee (teenager) associated with the call.  
  **Purpose:** Mentee marks the call as completed after it has happened.  
  **Response 200:** Update the call’s status to Completed and return the updated call or `{ success: true }`.  
  The frontend shows a “Mark as completed” button for calls that are not yet completed; when clicked it will call this endpoint.

Detail views are read-only (no Accept/Reject for mentee).

**Mentee call detail – do not expose mentor’s comment:** When a mentee views a previous call’s detail (e.g. from “My calls” → previous → row click), the UI does **not** show the mentor’s comment (session feedback). The backend should either omit the mentor’s comment/feedback from the response when the caller is the mentee (e.g. GET /teenager/me/calls/previous or call-by-id in mentee context), or the frontend will simply not display it. For consistency and privacy, prefer not returning the mentor’s internal comment to the mentee at all.

**Pending feedback (calls within last 7 days without mentee feedback):** The UI shows a dedicated **"Pending feedback"** section for teenagers when they have one or more **previous calls with a mentor** that (1) took place **within the last 7 days**, and (2) the mentee has **not yet submitted feedback** (rating and/or comment). The frontend uses **GET /teenager/me/calls/previous** to determine this: each call in the response must include a **date** (so the frontend can check "within last 7 days") and either **rating** and **menteeComment** (or an explicit **needsMenteeFeedback** / **menteeFeedbackGiven** boolean). If the mentee has not given feedback, omit or set `rating` and `menteeComment` to null/empty so the frontend can show the pending feedback section and list those calls. The backend must support mentees submitting feedback (e.g. **POST** or **PATCH /teenager/me/calls/:callId/feedback** with `{ "rating": number, "comment": "string" }` or equivalent) and persist it so that once submitted, the call no longer appears as "pending feedback". The "Pending feedback" section links the teenager to the previous-calls list so they can give feedback from there.

---

## 5. Mentee View (Admins & Mentors)

- **Admins:** Users list filtered by role mentee → **GET /teenager** with pagination (page, limit, status, name).
- **Mentors:** Same **GET /teenager** but **filtered by assigned mentor** so they only see their own mentees. Use the authenticated mentor ID.

**Mentee detail page** (shared by admin and mentor):

- **GET /teenager/:id** – full profile (see 2.2). Page shows profile info and a **Module progress** card.
- **“View Modules”** (or “View progress”) links to **module progress for that teenager**: list of modules with per-module progress (e.g. percentage, deliverable status). See section 6.

Mentors must **not** be able to activate/deactivate mentees; hide or forbid those actions when the requester is MENTOR.

---

## 6. Teenager Module Progress & Module Detail

### 6.1 Modules list (admin)

- **GET /module** – list of modules (page, limit, title). Used in admin Modules UI and when building the mentee’s module progress list.

### 6.2 Module detail (admin & mentee view)

- **GET /module/:id** – single module with content: **notes**, **workbook** (e.g. file URL), **deliverables**, **additional resources**. Used on admin module edit and on **mentee module detail** page (teenager view: notes, workbook, deliverables, resources).

### 6.3 Teenager / mentee module progress

The frontend shows **“Module Progress for [Mentee Name]”**: a list of all modules with per-module **progress** (e.g. percentage) and **deliverable status** (Complete / Incomplete). Currently the UI can use placeholder progress if the backend does not expose it yet.

**Recommended API:**

- **GET /teenager/:teenagerId/module-progress**  
  **Response:** `{ "data": [{ "moduleId": "...", "progress": 0–100, "deliverableStatus": "Complete" | "Incomplete" }, ...] }`  
  So the mentee modules list and any progress gauge can show real data. If not implemented, frontend may show placeholder (e.g. 50% per module).

### 6.4 Modules list for mentees: “Mark as completed” checkbox (mentees only)

**UI behaviour:** The module list for **mentees (TEENAGER role) only** shows a **checkbox** per module (no “Mark as completed” label text). Mentees use it to mark a module as completed **when they are done with the module**. The same concept is reinforced on the module detail page: after submitting deliverable answers, a one-line prompt tells them to mark the module as completed when they’re done.

**Backend requirements:**

- **Mark module as completed:** Provide an endpoint such as **PATCH /teenager/me/modules/:moduleId/complete** (or **PUT** with body `{ "completed": true }`). The mentee can mark any module as completed when done; do **not** require the module to have deliverables or the assignment to be submitted. Persist the “completed” state per mentee per module and use it for progress tracking.
- When returning the module list for a mentee (e.g. **GET /module** in mentee context, or **GET /teenager/me/modules**), include per module whether this mentee has marked it completed (e.g. **markedCompleted: boolean** or **completed: boolean**) so the frontend can pre-check the checkbox. Optionally include **assignmentSubmitted: boolean** if you track assignment submission separately for analytics or reporting.
- **Unmark:** Support toggling off (e.g. same PATCH with `completed: false` or a separate DELETE) so the mentee can unmark if they ticked by mistake.

### 6.5 Mentee module detail page & “Mark as completed” prompt

Route like: `/dashboard/modules/:id` for mentees (and `/dashboard/users/mentee/:id/modules/:moduleId` if used). Loads **GET /module/:moduleId** for content and, if available, **GET /teenager/:id/module-progress** for that module’s progress/deliverable status for the given teenager.

**“Mark as completed” prompt (mentees only):** After a mentee submits their deliverable answers, the module detail page shows a **one-line prompt outside the tabs**: “When you’re done with this module, mark it as completed to track your progress.” with a **Mark as completed** button. This is shown only to mentees (TEENAGER). The same completion state is persisted via **PATCH /teenager/me/modules/:moduleId/complete** (see 6.4). The checkbox on the module list (6.4) and this button both reflect the same “completed” state.

---

## 7. GET /mentor/:mentorId/calls (optional)

**Auth:** Bearer token. Mentor viewing own history or Admin.

**Query params:** `search` (optional – filter by mentee name).

**Response:** Same paginated list shape as **GET /calls** (section 2.1). Used when viewing a mentor’s call history from the Users section (e.g. admin viewing a specific mentor).

---

## 8. Live Sessions (all roles) & Mentee comments, replies, notifications

### 8.1 Who can do what

- **Admins / mentors:** Can list live sessions, view detail, **add** new sessions, **edit** sessions, **cancel** sessions, and add/edit session notes & recording. Mentees **cannot** add, edit, or cancel sessions; they can only **view** the list and session detail.
- **Mentees (TEENAGER):** Can **view** the live sessions list and open session detail. They **cannot** see “Add Live Session” or “Cancel” on the list, or “Edit” / “Add notes & recording” on the detail. They **can** add **comments** and **replies** on a session.

### 8.2 Comments and replies

- **Teenagers (mentees)** must see **all** comments and replies on a live session and must be able to **add** their own comments and replies. Do not filter or hide comments/replies for teenagers; the UI shows the full thread and the “Add comment” / “Reply” actions for them.
- **GET /live-sessions/:sessionId/comments** (or equivalent) must return **all** comments (for all roles that can view the session, including teenagers) with, for each comment: **id**, **authorId**, **authorName**, **authorPictureUrl** (optional, for avatar), **text**, **createdAt**, **replies** (array).
- Each **reply** must include: **id**, **authorName**, **authorPictureUrl** (optional; frontend shows name, datetime, and picture for who said the reply), **text**, **createdAt**.
- **POST /live-sessions/:sessionId/comments** – body `{ "text": "..." }` – for adding a comment (teenagers and others who can view the session).
- **POST /live-sessions/:sessionId/comments/:commentId/replies** – body `{ "text": "..." }` – for adding a reply (teenagers and others). Response should include the reply with **authorName**, **createdAt**, and **authorPictureUrl** when available so the UI can show who said the reply, when, and their picture.

### 8.3 Notifications for mentees

- Mentees should **receive notifications** when, for example: someone **replies** to their comment on a live session, or there is a **new comment** on a session they have engaged with. The backend should support storing and delivering these notifications (e.g. in-app list and/or email/push). Exact channel and payload can be decided by the backend; the frontend expects that mentees are notified for relevant activity on live session comments/replies.

---

## 9. Flow summary

1. **Availability:** Mentor logs in → GET /mentor/availability. Saves schedule via PUT /mentor/availability; sets meeting link and topics (PUT /mentor/:id/profile); optionally syncs calendar (POST .../google-calendar/sync). Mentee gets slots via GET /mentor/:mentorId/available-slots?date=...; booking creates calendar event if synced; cancel deletes it. **Central topics:** One list from GET /dropdowns?type=mentorship-topics — used for mentor signup, mentor availability topic selection, and mentee “Book a call” topic dropdown.
2. **Mentee book a call:** Mentee selects topic (from mentorship-topics) → GET /mentor?topic=&lt;value&gt;&limit=50&status=ACTIVE returns mentors for that topic (fullName, bio, linkedinUrl, pictureUrl, mentorshipTopics). Mentee picks a mentor, then a **date** (next 10 days **starting 3 days from today** so mentors get enough notice) and time via GET /mentor/:mentorId/available-slots?date=YYYY-MM-DD&duration=30. Optional message for mentor. Submit via POST /call-requests { mentorId, date, time, message? }. Backend should enforce: (a) bookable dates start from today + 3 days; (b) **reject if mentee already has an upcoming call**; (c) **reject if mentee had a call in the past 7 days** (return 400 with clear message). Frontend uses GET /teenager/me/calls/upcoming and GET /teenager/me/calls/previous to hide the booking flow when not eligible.
3. **Admin calls:** GET /calls with pagination and search. Row click → call detail (with comment, menteeComment, rating). Mentee name click → GET /teenager/:id → mentee details modal.
4. **Mentor calls:** Previous (list + detail + “Add feedback” → PATCH/PUT call feedback). Upcoming (list + detail, with notes). Call requests (list + detail modal + Accept/Reject).
5. **Mentee calls:** **Only** previous and upcoming (no call-requests tab). GET /teenager/me/calls/previous, GET /teenager/me/calls/upcoming. PATCH /teenager/me/calls/:callId/complete for “Mark as completed”. No print-call-history export for mentees. **Do not show mentor’s comment** in mentee call detail (omit from mentee-facing call detail response). **Pending feedback:** UI shows a "Pending feedback" section when there are calls in the last 7 days without mentee feedback; GET /teenager/me/calls/previous must return date, rating, menteeComment (or needsMenteeFeedback) per call; support POST/PATCH /teenager/me/calls/:callId/feedback for mentees to submit rating and comment.
6. **Mentee view:** GET /teenager (filter by mentor when user is MENTOR). GET /teenager/:id for detail; link to module progress. GET /teenager/:id/module-progress for per-module progress.
7. **Modules:** GET /module, GET /module/:id for content; GET /teenager/:id/module-progress for teenager progress. For **mentees only**: module list shows a **checkbox** (no label) per module to mark as completed when done; module detail shows a one-line prompt after deliverable submission: “When you’re done with this module, mark it as completed to track your progress.” Provide PATCH /teenager/me/modules/:moduleId/complete, persist per mentee per module; return **markedCompleted** when serving module list to mentees so the checkbox state can be restored. Mentors cannot activate/deactivate mentees.
8. **Live sessions:** Mentees can **only view** (list + detail); no add, edit, or cancel. Admins/mentors can add, edit, cancel, and manage notes. Session detail loading state uses a **spinner** and the copy **“Loading session details”** (no trailing dots). **Teenagers** must see **all** comments and replies and can add their own comments and replies; backend must not filter comments/replies for teenagers. Comments and replies must return **author name**, **datetime (createdAt)**, and **author picture (authorPictureUrl)**. Mentees should receive **notifications** (e.g. when someone replies to their comment or there is new activity on a session they’ve engaged with).

Implement these endpoints so the frontend dashboard (Calls, Availability, Mentee view, Teenager module progress, Live sessions) works end-to-end without any hitch.
