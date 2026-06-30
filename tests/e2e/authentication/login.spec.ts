import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test("TC-001 Benutzer kann sich erfolgreich anmelden", async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();
  
        
    await loginPage.loginLikeHuman(
        "herrschmidt@gmx.de",
        "Pass123"
    );

    
    await expect(
        page.getByRole("heading", {
            name: "Meine Aufgaben",
        })
    ).toBeVisible();
});