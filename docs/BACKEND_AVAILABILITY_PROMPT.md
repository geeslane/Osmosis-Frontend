# Backend Prompt: Mentor Availability Schedule

Copy the prompt below into your backend codebase (e.g. paste into Cursor/AI chat) to implement the APIs that power the mentor availability schedule feature on the frontend.

---

## PROMPT (copy everything below this line)

---

Implement the backend APIs for the **Mentor Availability Schedule** feature. The frontend is already built and expects these exact endpoints. Your implementation must match the request/response shapes below so the frontend works without any changes.

### 1. GET /mentor/availability

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

---

### 2. PUT /mentor/availability

**Auth:** Bearer token. User must be a MENTOR.

**Request body (JSON):**
```json
{
  "weeklySchedule": [
    { "day": "monday", "blocks": [{ "start": "09:00", "end": "12:00" }] },
    { "day": "tuesday", "blocks": [] },
    ...
  ],
  "meetingLink": "https://meet.google.com/xyz",
  "googleCalendarSynced": false
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { ...saved availability object },
  "message": "Availability saved successfully"
}
```

Store the availability per mentor. Validate that `day` values are valid and `blocks` have valid start/end times.

---

### 3. POST /mentor/availability/google-calendar/sync

**Auth:** Bearer token. User must be a MENTOR.

**Purpose:** Connect the mentor’s Google Calendar for:
- Conflict checking (slots with existing events are unavailable to mentees)
- Creating events when a call is booked
- Deleting events when a call is cancelled

**Behavior:**
- If the mentor has not yet connected: redirect to Google OAuth consent. Use scope `https://www.googleapis.com/auth/calendar.events` (read + write) so you can create/delete events.
- After consent: store the access and refresh tokens per mentor (encrypted). Set `googleCalendarSynced: true` on their availability record.
- Return 200 with `{ success: true, message: "Google Calendar synced successfully" }`.

**On 401 or OAuth failure:** Return `{ success: false, message: "Google Calendar authorization required" }`.

---

### 4. GET /mentor/:mentorId/available-slots?date=YYYY-MM-DD&duration=30

**Auth:** Bearer token (mentee or any authenticated user).

**Purpose:** Return time slots available for mentees to book a call with a mentor on a given date.

**Query params:**
- `date` (required): `YYYY-MM-DD`
- `duration` (optional): minutes per slot, default 30

**Logic:**
1. Get the mentor’s `weeklySchedule` for the weekday of `date` (e.g. if date is Monday, use monday blocks).
2. For each block, generate slots of `duration` minutes (e.g. 09:00–09:30, 09:30–10:00).
3. If `googleCalendarSynced` is true, fetch the mentor’s Google Calendar events for that date. Remove any slot that overlaps with an event.
4. Remove any slot that overlaps with an already booked mentoring session in your system.
5. Return only the remaining slots.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "slots": [
      { "start": "09:00", "end": "09:30" },
      { "start": "09:30", "end": "10:00" },
      { "start": "10:00", "end": "10:30" }
    ]
  }
}
```

---

### 5. GET /mentor/:id returns mentorshipTopics

The frontend fetches mentor profile via `GET /mentor/:id` to show and edit topics in the availability flow. Ensure the mentor object includes:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "fullName": "...",
    "email": "...",
    "mentorshipTopics": ["react", "typescript"],
    ...
  }
}
```

`mentorshipTopics` must be an array of strings (topic IDs/values from your dropdowns).

---

### 6. PUT /mentor/:id/profile accepts mentorshipTopics

The frontend updates mentor topics when saving in Step 2 of the availability flow. Accept `mentorshipTopics` in the request body (array of strings) and persist it.

---

### 7. Google Calendar: create event on book, delete on cancel

**When a mentee books a call:**
- If the mentor has `googleCalendarSynced: true`, create an event on the mentor’s Google Calendar for the booked slot.
- Include: title (e.g. "Osmosis mentoring session with [mentee name]"), start/end time, meeting link if available.
- Store the Google Calendar event ID in your booking record so you can delete it on cancel.

**When a call is cancelled:**
- Delete the corresponding event from the mentor’s Google Calendar using the stored event ID.

---

### Flow summary

1. Mentor logs in → `GET /mentor/availability` loads their schedule (or 404).
2. Mentor sets weekly blocks → `PUT /mentor/availability` saves.
3. Mentor adds meeting link, topics, syncs calendar → `PUT /mentor/availability`, `PUT /mentor/:id/profile`, `POST /mentor/availability/google-calendar/sync`.
4. Mentee views available slots → `GET /mentor/:mentorId/available-slots?date=YYYY-MM-DD`.
5. Mentee books → your booking API creates the booking and, if synced, creates a Google Calendar event.
6. Call cancelled → your cancel API deletes the Google Calendar event.

---

Implement these endpoints so the frontend mentor availability schedule feature works end-to-end without any hitch.

---

## Mentorship Calls API (Admin & Mentor)

The frontend has a **Mentorship Calls** page for admins and **Call History** for mentors. Implement these endpoints:

### GET /calls

**Auth:** Bearer token. Admin or SUPERADMIN only.

**Query params:**
- `page` (default 1)
- `limit` (default 10)
- `search` (optional): When provided, fetch only calls matching this mentor or mentee name. The backend should filter by name on the server.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "mentorName": "Alex Johnson",
      "menteeName": "Olivia Rhye",
      "date": "12 Dec, 2025",
      "topic": "Hope",
      "callLength": "55m 34s",
      "status": "Completed",
      "comment": "Good",
      "rating": 4
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**When `search` is provided:** Return only calls where the mentor name or mentee name matches the search term. This allows admins to search for a specific mentee and download that mentee's call report.

### GET /mentor/:mentorId/calls

**Auth:** Bearer token. Mentor viewing own history, or Admin.

**Query params:**
- `search` (optional): Filter by mentee name.

**Response:**
Same shape as above. Used when viewing a mentor's call history from the Users section.
