import { Page } from "@playwright/test";
export class LoginPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto("/");
    }

    async login(email: string, password: string) {
        await this.page
            .getByLabel("E-Mail-Adresse")
            .fill(email);

        await this.page
            .getByLabel("Passwort")
            .fill(password);

        await this.page
            .getByRole("button", { name: "Anmelden" })
            .click();
    }

}