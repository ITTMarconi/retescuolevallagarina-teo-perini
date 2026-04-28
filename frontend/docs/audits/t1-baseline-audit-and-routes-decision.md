# T1 — Baseline audit and `/routes` behavior decision

> Produced manually to unblock the forge execution pipeline after worker failure.

---

## 1. Field usage matrix — per page/component

### 1.1 `/istituti` (`src/pages/istituti.astro`)

| What's rendered | Directus field(s) needed |
|---|---|
| School list item card | `id`, `name`, `logo.id`, `logo.title` |
| Client-side shuffle (JS) | (no extra fields) |
| Filter (currently client-side) | `main_campus` → move to `filter` query param |

**Minimal fields:**
```ts
fields: ["id", "name", "main_campus", "logo.id", "logo.title"]
```

---

### 1.2 `/openday` (`src/pages/openday.astro` + `src/components/OpenDaysList.astro`)

**Page template uses from schools:**
| What's rendered | Directus field(s) needed |
|---|---|
| School section header (`<a href="/sede/${id}">`) | `id`, `name` |
| `OpenDaysList` per school | `events: [...]` — see below |

**`OpenDaysList` uses from each event:**
| What's rendered | Directus field(s) needed |
|---|---|
| Event date badge | `start_date` |
| Event title | `title` |
| Event time | `start_date`, `end_date` |
| Event description (HTML) | `description` |
| Past/future class | `start_date` (for Date comparison) |

**`OpenDaysList.astro` does NOT reference `event.school` at all** — it iterates within the school loop already. The only nested relation required is `events` itself.

**QUERY 2 (`ALL_OPENDAYS`) — CONFIRMED DEAD CODE. Never referenced in template or component.**

**Minimal fields for schools query:**
```ts
fields: ["id", "name", "events.id", "events.title", "events.start_date", "events.end_date", "events.description"]
```

---

### 1.3 `/calendar` (`src/pages/calendar.astro` + `src/components/InteractiveCalendar.astro`)

**`InteractiveCalendar` uses from events:**
| What's rendered | Directus field(s) needed |
|---|---|
| Calendar day badge | `start_date`, `end_date` |
| Event item text | `title`, `school.short_name` |
| Modal: title | `title` |
| Modal: school link | `school.id`, `school.name` |
| Modal: description | `description` |
| Modal: start/end formatted | `start_date`, `end_date` |
| Modal: location | `location` |

**Minimal fields:**
```ts
fields: ["id", "title", "description", "start_date", "end_date", "location", "school.id", "school.name", "school.short_name"]
```

---

### 1.4 `/map` (`src/pages/map.astro`)

| What's rendered | Directus field(s) needed |
|---|---|
| Marker position | `position` (GeoJSON Point) |
| Popup: logo | `logo.id`, `logo.title` |
| Popup: school name + link | `id`, `name` |
| Popup: indirizzi list | `edu_links.name`, `edu_links.link_url` |

**Minimal fields:**
```ts
fields: ["id", "name", "position", "logo.id", "logo.title", "edu_links.name", "edu_links.link_url"]
```

---

### 1.5 `/sede/[id]` (`src/pages/sede/[id].astro`)

Heaviest page — renders logo, metadata, videos, educational paths, branch schools, events, emails, phones.

| What's rendered | Directus field(s) needed |
|---|---|
| Header: logo | `logo.id`, `logo.title` |
| Header: name | `name` |
| Header: website | `website_url` |
| Header: address | `address` |
| Header: responsabile | `responsabile_orientamento` |
| Videos grid | `videos.id`, `videos.title`, `videos.video_file.id`, `videos.youtube_id`, `videos.description` |
| Indirizzi list | `edu_links.id`, `edu_links.name`, `edu_links.link_url` |
| Branch schools / parent | `main_campus`, `branch_schools.id`, `branch_schools.name`, `parent_school.id`, `parent_school.name` |
| Open days section | `events.id`, `events.title`, `events.start_date`, `events.end_date`, `events.description` |
| Emails table | `school_emails.id`, `school_emails.label`, `school_emails.email` |
| Phones table | `school_phones.id`, `school_phones.label`, `school_phones.number` |

**Minimal fields for `readItem`:**
```ts
fields: [
  "id", "name", "logo.id", "logo.title",
  "website_url", "address", "responsabile_orientamento",
  "videos.id", "videos.title", "videos.video_file.id", "videos.youtube_id", "videos.description",
  "edu_links.id", "edu_links.name", "edu_links.link_url",
  "main_campus",
  "branch_schools.id", "branch_schools.name",
  "parent_school.id", "parent_school.name",
  "events.id", "events.title", "events.start_date", "events.end_date", "events.description",
  "school_emails.id", "school_emails.label", "school_emails.email",
  "school_phones.id", "school_phones.label", "school_phones.number"
]
```

---

### 1.6 `/routes` (`src/pages/routes.astro` + React components)

**`SchoolRoutesContainer.jsx` uses from schools:**
| What's rendered | Directus field(s) needed |
|---|---|
| Sidebar button | `id`, `name` |
| School logo | `logo.id`, `logo.title` |

**`RoutesView.jsx` uses from transport_routes:**
| What's rendered | Directus field(s) needed |
|---|---|
| Route list item | `id`, `name`, `start_label`, `transportation_type`, `estimated_time_minutes`, `school.short_name` |
| Details box | `description` |
| Route click → MapComponent | full route with geometries |

**`MapComponent.jsx` uses from transport_routes:**
| What's rendered | Directus field(s) needed |
|---|---|
| Polyline rendering | `route_path` (GeometryCollection or LineString) |
| Start marker | `start.coordinates`, `start_label` |
| School marker | `school.id`, `school.name`, `school.position.coordinates`, `school.logo` |
| Popup info | `name`, `description`, `transportation_type`, `estimated_time_minutes`, `school.name` |

**NOTE:** `MapComponent` accesses `school.logo` (a string/file ID) directly from the nested school relation — it does NOT access `school.logo.id` pattern, it uses `school.logo` directly as a file ID. This is worth noting but matches the current code pattern.

**Minimal fields for transport_routes:**
```ts
fields: [
  "id", "name", "start_label", "transportation_type", "estimated_time_minutes", "description",
  "start.coordinates",
  "route_path",
  "school.id", "school.name", "school.short_name", "school.position.coordinates", "school.logo"
]
```

**Schools query in `/routes`** is used ONLY to filter schools that have routes. This is a client-side join. Better approach: derive school list from `transport_routes` data itself (the route already contains `school.id`, `school.name`, `school.logo`). This would eliminate the second query entirely.

**Decision (T8):** Remove the separate schools query; derive unique schools from the transport_routes response.

---

## 2. `/routes` public status decision

### Findings
- Navbar (`Navbar.astro:50`) links to `/routes/` with `current_view="routes"` support
- Index (`index.astro:50`) links to `/routes/`
- The page is a full SSR + React client island with real components
- No environment variable, feature flag, or `astro:env` setting gates the page

### Decision: **Active optimized path**

The codebase treats `/routes` as an active public page. There is **no existing gating mechanism** (no env var, no config flag, no commented-out links).

**Implementation for T8:**
- Keep `/routes` active and public
- Optimize both queries (explicit fields, sort, limit)
- Eliminate the redundant `schools` query by deriving unique schools from `transport_routes` response
- If stakeholders later want to disable `/routes`, they must add a feature flag first — that's out of scope for this optimization

---

## 3. Limit strategy per collection

| Collection | Current cardinality (est.) | Strategy | Rationale |
|---|---|---|---|
| `schools` (istituti) | ~10–30 | `limit: -1` | Small dataset, must be complete for main_campus list |
| `schools` (map) | ~10–30 | `limit: -1` | All schools should appear on map |
| `schools` (openday) | ~10–30 | `limit: -1` | All schools with events must be listed |
| `events` (calendar) | ~50–200 | `limit: -1` with sort | Manageable dataset; calendar must show all events; if dataset grows beyond 500, consider year-based filtering |
| `events` (openday, nested) | ~5–30 per school | `limit: -1` (inherited from schools query) | Controlled by parent schools limit |
| `transport_routes` (routes) | ~20–100 | `limit: -1` | Manageable dataset; derive schools from this response |
| `schools` (sede/[id]) | 1 (readItem) | N/A | Single record by ID |

**Default limit policy:** Use `limit: -1` for all current collections since they are small datasets. If any collection is expected to grow beyond 500 records, a follow-up should introduce pagination.

---

## 4. Acceptance criteria mapping for T1

| AC | Status |
|---|---|
| Written mapping from rendered UI fields to Directus fields | ✅ This document |
| `/routes` implementation path explicitly chosen | ✅ Active optimized path (Section 2) |
| Each list query target has documented explicit limit strategy | ✅ Section 3 |

---

## 5. Handoff notes for downstream tasks

- **T2**: Use the field sets from Section 1.1–1.6 as the basis for `src/lib/directus-queries.ts` constants
- **T3**: `/istituti` → server-side filter, sort: `["name"]`
- **T4**: `/calendar` → sort: `["start_date"]`
- **T5**: `/openday` → remove `ALL_OPENDAYS` query; minimize events fields
- **T6**: `/map` → add image transforms; sort: `["name"]`
- **T7**: `/sede/[id]` → largest query, most fields, but all explicit
- **T8**: `/routes` → eliminate schools query; derive from transport_routes
- **T9**: run compliance grep; cross-check all pages
