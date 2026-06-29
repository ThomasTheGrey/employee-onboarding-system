import { expect, Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto("/");
    }

    async login(email: string, password: string) {

        const emailInput =
            this.page.getByLabel("E-Mail-Adresse");

        const passwordInput =
            this.page.getByLabel("Passwort");

        await emailInput.fill(email);

        console.log(
            "CHECK EMAIL NACH FILL:",
            await emailInput.inputValue()
        );

        await expect(emailInput).toHaveValue(email);

        await passwordInput.fill(password);

        console.log(
            "CHECK EMAIL NACH PASSWORT:",
            await emailInput.inputValue()
        );

        console.log(
            "CHECK PASSWORT:",
            await passwordInput.inputValue()
        );

        await expect(passwordInput).toHaveValue(password);

        console.log("CHECK INPUTS:", {
            email: await emailInput.inputValue(),
            password: await passwordInput.inputValue(),
        });

        await this.page
            .getByRole("button", { name: "Anmelden" })
            .click();
    }
}