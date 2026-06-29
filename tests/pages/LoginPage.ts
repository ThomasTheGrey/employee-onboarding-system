import { expect, Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto("/");
    }
/*
    async login(email: string, password: string) {

        const emailInput =
            this.page.getByLabel("E-Mail-Adresse");

        const passwordInput =
            this.page.getByLabel("Passwort");

        await emailInput.fill(email);

        await expect(emailInput).toHaveValue(email);

        await passwordInput.fill(password);

        await expect(passwordInput).toHaveValue(password);

        await this.page
            .getByRole("button", { name: "Anmelden" })
            .click();
    } */
     // neue Variante
    async loginLikeHuman(email: string, password: string) {

        const emailInput =
            this.page.getByLabel("E-Mail-Adresse");

        const passwordInput =
            this.page.getByLabel("Passwort");

        const loginButton =
            this.page.getByRole("button", {
                name: "Anmelden",
            });

        // Benutzer klickt ins erste Feld
        await emailInput.click();

        // tippt langsam
        await emailInput.pressSequentially(email, {
            delay: 50,
        });

        // Browser hat Zeit zu reagieren
        await expect(emailInput).toHaveValue(email);

        await this.page.waitForTimeout(250);

        // TAB ins Passwortfeld
        await this.page.keyboard.press("Tab");

        // Passwort tippen
        await passwordInput.pressSequentially(password, {
            delay: 50,
        });

        await expect(passwordInput).toHaveValue(password);

        await this.page.waitForTimeout(250);

        // TAB auf den Button
        await this.page.keyboard.press("Tab");

        await this.page.waitForTimeout(150);

        // ENTER
        await this.page.keyboard.press("Enter");

        // alternativ:
        // await loginButton.click();
    }
}