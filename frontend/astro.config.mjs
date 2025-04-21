// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  env: {
    schema: {
      PUBLIC_API_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://api.retescuolevallagarina.it",
      }),
      PORT: envField.number({
        context: "server",
        access: "public",
        default: 4321,
      }),
      API_SECRET: envField.string({ context: "server", access: "secret" }),
    },
  },
  server: {
    allowedHosts: ["directus.retescuolevallagarina.it"],
    host: "0.0.0.0", // Essential for containerized environments
  },
  adapter: node({
    mode: "standalone",
  }),
});
