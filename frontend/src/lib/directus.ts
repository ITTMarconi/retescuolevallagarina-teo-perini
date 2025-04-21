import { createDirectus, rest } from "@directus/sdk";
import { PUBLIC_API_URL } from "astro:env/client";
import type { Schema } from "../types/schema.d.ts";
import type { CustomDirectusTypes } from "../types/directus.d.ts";

export type SiteSettings = {
  site_logo: string;
  site_title: string;
  welcome_message: string;
  contact_email: string;
  homepage_hero_image: string;
  footer_text: string;
  social_media_links: string;
  open_days_intro: string;
};

export type School = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type File = {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
  charset: string | null;
  filesize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  metadata: Record<string, any> | null;
};

type Author = {
  name: string;
};

type Page = {
  title: string;
  content: string;
  slug: string;
};

type Post = {
  image: string;
  title: string;
  author: Author;
  content: string;
  published_date: string;
  slug: string;
};

type Schema1 = {
  site_settings: SiteSettings & Record<string, any>;
  directus_file: File & Record<string, any>;
};

export const client =
  createDirectus<CustomDirectusTypes>(PUBLIC_API_URL).with(rest());

const directus = createDirectus<Schema & Schema1>(PUBLIC_API_URL).with(rest());

export default directus;
