import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test("TC-AUTH-001 Standard user cannot see the admin area", async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.loginLikeHuman(
        "test@test.de",
        "Test"
    );

    // Dashboard wurde erfolgreich geladen
    await expect(
        page.getByRole("heading", {
            name: "Meine Aufgaben",
        })
    ).toBeVisible();

    // Der Adminbereich wird für normale Benutzer nicht gerendert
    await expect(
        page.getByRole("heading", {
            name: "Adminbereich",
        })
    ).toHaveCount(0);

});