import { test, expect } from "@playwright/test";

test("Startseite lässt sich öffnen", async ({ page }) => {

  await page.goto("/");

  await expect(page).toHaveTitle(/Onboarding/i);

});