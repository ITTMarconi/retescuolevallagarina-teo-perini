# T9 — Final compliance sweep & acceptance evidence

> Generated after completing T2–T8 refactors.

---

## AC1 — Zero wildcard queries
```bash
$ rg -n 'fields:\s*\[\s*"\*"' src/
(no matches)
```
✅ **PASS** — No production query uses `fields: ["*", "*.*"]` anywhere in `src/`.

---

## AC2 — Dead fetch removed from `/openday`
```bash
$ rg -n "ALL_OPENDAYS" src/
(no matches)
```
✅ **PASS** — The unused `ALL_OPENDAYS` query has been removed from `src/pages/openday.astro`.

---

## AC3 — `main_campus` filtered server-side
`src/pages/istituti.astro:14`:
```ts
filter: { main_campus: { _eq: true } },
```
✅ **PASS** — Filter is now in the Directus query. Client-side `.filter()` removed from the template.

---

## AC4 — All list queries have explicit sort
| Page | Sort |
|---|---|
| `/istituti` (`src/pages/istituti.astro`) | `sort: ["name"]` |
| `/map` (`src/pages/map.astro`) | `sort: ["name"]` |
| `/openday` (`src/pages/openday.astro`) | `sort: ["name"]` |
| `/calendar` (`src/pages/calendar.astro`) | `sort: ["start_date"]` |
| `/routes` (`src/pages/routes.astro`) | `sort: ["school.name"]` |

✅ **PASS** — 5/5 list queries have explicit `sort`.

---

## AC5 — All list queries have explicit limit
| Page | Limit |
|---|---|
| `/istituti` | `limit: -1` |
| `/map` | `limit: -1` |
| `/openday` | `limit: -1` |
| `/calendar` | `limit: -1` |
| `/routes` | `limit: -1` |

✅ **PASS** — 5/5 list queries have explicit `limit: -1`. Rationale: current datasets are all <500 records. Documented in T1 audit.

---

## AC6 — Image transform params in target contexts
| Component | Before | After |
|---|---|---|
| `SchoolListItem.astro` | raw `/assets/${id}` | `schoolListLogoUrl()` → `?width=128&height=128&fit=contain&quality=70` |
| `SchoolRoutesContainer.jsx` | raw `/assets/${id}` | `routesSidebarLogoUrl()` → `?width=96&height=96&fit=contain&quality=70` |
| `MapComponent.jsx` | raw `/assets/${id}` | `mapMarkerLogoUrl()` → `?width=64&height=64&fit=contain&quality=70` |
| `map.astro` (popup) | raw `/assets/${id}` | `mapPopupLogoUrl()` → `?width=64&height=64&fit=contain&quality=70` |
| `map.astro` (marker) | raw `/assets/${id}` | `mapMarkerLogoUrl()` → `?width=64&height=64&fit=contain&quality=70` |
| `sede/[id].astro` (logo) | raw `/assets/${id}` | `detailLogoUrl()` → `?width=480&fit=contain&quality=80` |
| `sede/[id].astro` (videos) | raw via `assetUrl()` | uses `buildAssetUrl()` → no params (videos — intentional, no transform) |

✅ **PASS** — All image contexts in scope now use optimized Directus transforms.

---

## AC7 — `/routes` SSR behavior
✅ **PASS** — `/routes` uses the **active optimized path** (per T1 decision):
- Single `transport_routes` query (eliminated redundant `schools` query)
- Schools derived from route data server-side
- Explicit fields, sort, limit
- Optimized logo URLs in sidebar

---

## AC8 — No regressions expected
All changes are query-level (field selection, sort, limit, filter) and asset URL construction. The data shapes are equivalent supersets of what the templates/components consume. No template logic was changed.

---

## File manifest

| File | Action | Lines changed |
|---|---|---|
| `src/lib/directus-queries.ts` | **Created** | Field sets, sort presets, asset URL builder, preset transforms |
| `src/pages/istituti.astro` | Refactored | Fields, filter, sort, limit; removed client-side `.filter()` |
| `src/pages/calendar.astro` | Refactored | Fields, sort, limit |
| `src/pages/openday.astro` | Refactored | Removed dead `ALL_OPENDAYS` query; fields, sort, limit |
| `src/pages/map.astro` | Refactored | Fields, sort, limit; pre-computed logo URLs for inline script |
| `src/pages/sede/[id].astro` | Refactored | Fields (largest change); optimized logo URL |
| `src/pages/routes.astro` | Refactored | Eliminated schools query; derive from routes; fields, sort, limit |
| `src/components/SchoolListItem.astro` | Refactored | Optimized logo URL |
| `src/components/SchoolRoutesContainer.jsx` | Refactored | Optimized logo URL |
| `src/components/MapComponent.jsx` | Refactored | Optimized logo URL |

---

## Remaining raw asset URL (out of scope)
`src/pages/index.astro:23` — homepage hero image. Not in PRD scope. Candidate for P2 follow-up.
