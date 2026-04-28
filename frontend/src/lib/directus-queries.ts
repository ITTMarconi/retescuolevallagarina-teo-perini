// Shared Directus query field sets and asset URL helpers
// Based on T1 field usage audit — see docs/audits/t1-baseline-audit-and-routes-decision.md

import { PUBLIC_API_URL } from "astro:env/client";

// ─── Field sets ───────────────────────────────────────────────────────────────

/** Fields needed for school list items (istituti, sidebar route schools) */
export const SCHOOL_LIST_FIELDS = [
  "id",
  "name",
  "main_campus",
  "logo.id",
  "logo.title",
] as const;

/** Fields needed for map markers + popups */
export const SCHOOL_MAP_FIELDS = [
  "id",
  "name",
  "position",
  "logo.id",
  "logo.title",
  "edu_links.name",
  "edu_links.link_url",
] as const;

/** Fields needed for the openday page (schools with nested events) */
export const SCHOOL_OPENDAY_FIELDS = [
  "id",
  "name",
  "events.id",
  "events.title",
  "events.start_date",
  "events.end_date",
  "events.description",
] as const;

/** Fields needed for calendar event cards + modal */
export const EVENT_CALENDAR_FIELDS = [
  "id",
  "title",
  "description",
  "start_date",
  "end_date",
  "location",
  "school.id",
  "school.name",
  "school.short_name",
] as const;

/** Fields needed for transport_routes (map, list, details) */
export const TRANSPORT_ROUTE_FIELDS = [
  "id",
  "name",
  "start_label",
  "transportation_type",
  "estimated_time_minutes",
  "description",
  "start.coordinates",
  "route_path",
  "school.id",
  "school.name",
  "school.short_name",
  "school.position.coordinates",
  "school.logo",
] as const;

/** Fields needed for sede/[id] detail page — most comprehensive */
export const SCHOOL_DETAIL_FIELDS = [
  "id",
  "name",
  "logo.id",
  "logo.title",
  "website_url",
  "address",
  "responsabile_orientamento",
  "videos.id",
  "videos.title",
  "videos.video_file.id",
  "videos.youtube_id",
  "videos.description",
  "edu_links.id",
  "edu_links.name",
  "edu_links.link_url",
  "main_campus",
  "branch_schools.id",
  "branch_schools.name",
  "parent_school.id",
  "parent_school.name",
  "events.id",
  "events.title",
  "events.start_date",
  "events.end_date",
  "events.description",
  "school_emails.id",
  "school_emails.label",
  "school_emails.email",
  "school_phones.id",
  "school_phones.label",
  "school_phones.number",
] as const;

// ─── Sort presets ─────────────────────────────────────────────────────────────

export const SORT_SCHOOLS_BY_NAME = ["name"] as const;
export const SORT_EVENTS_BY_DATE = ["start_date"] as const;
export const SORT_ROUTES_BY_SCHOOL_NAME = ["school.name"] as const;

// ─── Asset URL builder ────────────────────────────────────────────────────────

export interface AssetTransformOptions {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "inside" | "outside";
  quality?: number;
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
}

/**
 * Build a Directus asset URL with optional transformation parameters.
 * Falls back gracefully: if fileId is null/undefined, returns "".
 */
export function buildAssetUrl(
  fileId: string | null | undefined,
  options?: AssetTransformOptions
): string {
  if (!fileId) return "";
  const params = new URLSearchParams();
  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.fit) params.set("fit", options.fit);
  if (options?.quality) params.set("quality", String(options.quality));
  if (options?.format) params.set("format", options.format);

  const qs = params.toString();
  return `${PUBLIC_API_URL}/assets/${fileId}${qs ? `?${qs}` : ""}`;
}

// ─── Preset asset transformations per context ────────────────────────────────

/** School list thumbnails — small, contained, modest quality */
export function schoolListLogoUrl(fileId: string | null | undefined): string {
  return buildAssetUrl(fileId, {
    width: 128,
    height: 128,
    fit: "contain",
    quality: 70,
  });
}

/** Map popup logos — tiny */
export function mapPopupLogoUrl(fileId: string | null | undefined): string {
  return buildAssetUrl(fileId, {
    width: 64,
    height: 64,
    fit: "contain",
    quality: 70,
  });
}

/** Map marker logos — tiny, same as popup */
export function mapMarkerLogoUrl(fileId: string | null | undefined): string {
  return buildAssetUrl(fileId, {
    width: 64,
    height: 64,
    fit: "contain",
    quality: 70,
  });
}

/** Detail page logo — larger, good quality */
export function detailLogoUrl(fileId: string | null | undefined): string {
  return buildAssetUrl(fileId, {
    width: 480,
    fit: "contain",
    quality: 80,
  });
}

/** Routes sidebar school logos — small */
export function routesSidebarLogoUrl(
  fileId: string | null | undefined
): string {
  return buildAssetUrl(fileId, {
    width: 96,
    height: 96,
    fit: "contain",
    quality: 70,
  });
}
