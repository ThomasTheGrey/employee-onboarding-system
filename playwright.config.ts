import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

    webServer: {
        command: "npm run dev",
        url: "http://localhost:8080",
        reuseExistingServer: true,
    },

  use: {
    baseURL: "http://localhost:8080",
    headless: false,
  },
});