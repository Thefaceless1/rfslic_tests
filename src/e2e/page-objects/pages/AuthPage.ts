import {Locator, Page} from "@playwright/test";
import {BasePage} from "./BasePage.js";
import {Elements} from "../../framework/elements/Elements.js";
import {DbHelper} from "../../../db/db-helper.js";
import twoFactor from "node-2fa";
import * as Process from "process";
import {logger} from "../../../logger/logger.js";

export class AuthPage extends BasePage {
    private readonly userId: number = (Process.env.BRANCH == "prod") ? 17513354 : 11310620
    private readonly userName: string = "Авклоноке Гевиенй"
    private loginAttempts: number = 3
    constructor(page: Page) {
        super(page)
    }
    /**
     * Picture to call the authorization menu
     */
    private authAvatar: Locator = Elements.getElement(this.page,"//*[contains(@class,'login_avatar')]")
    /**
     * 'Check user' button
     */
    private selectUserButton: Locator = Elements.getElement(this.page,"//*[text()='Выбрать пользователя']")
    /**
     * 'Check user' menu
     */
    private selectUserMenu: Locator = Elements.getElement(this.page,"//*[contains(@class,'user__indicators')]")
    /**
     * 'Check user' menu dropdown values
     */
    private selectedUser: Locator = Elements.getElement(this.page,`//*[contains(@class,'user__option') and contains(text(),'${this.userName}')]`)
    /**
     * Field "E-mail"
     */
    private email: Locator = Elements.getElement(this.page,"//input[@placeholder='E-mail']")
    /**
     * Field "Password"
     */
    private password: Locator = Elements.getElement(this.page,"//input[@name='password']")
    /**
     * Field "Confirmation code"
     */
    private confirmationCode: Locator = Elements.getElement(this.page,"//input[@placeholder='Код подтверждения']")
    /**
     * Button "Confirm"
     */
    private confirmButton: Locator = Elements.getElement(this.page,"//button[text()='ПОДТВЕРДИТЬ']")
    /**
     * Button "Enter"
     */
    private enterButton: Locator = Elements.getElement(this.page,"//button[text()='ВОЙТИ']")
    /**
     * Message "Verification code entered incorrectly"
     */
    private invalidCodeMessage: Locator = Elements.getElement(this.page,"//p[text()='Неверно введён проверочный код']")
    /**
     * Close button for invalid code message
     */
    private closeInvalidCodeMessageButton: Locator = Elements.getElement(this.page,"//button[contains(@class,'inline-flex')]")
    /**
     * Create a user with 'Administrator' role
     */
    public async createUser(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.insertUser(this.userId);
        await dbHelper.insertUserRights(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Log in to the system
     */
    public async login(): Promise<void> {
        await this.page.goto("");
        if (Process.env.BRANCH == "prod") {
            await Elements.waitForVisible(this.email);
            await this.email.fill(process.env.USER_LOGIN + "@rfs.ru");
            await this.password.fill(process.env.USER_PASS!);
            await this.enterButton.click();
            await Elements.waitForVisible(this.confirmationCode);
            await this.setConfirmationCode();
        }
        else {
            await Elements.waitForVisible(this.authAvatar);
            await this.checkSelectUserButton();
            await this.selectUserButton.click();
            await Elements.waitForVisible(this.selectUserMenu);
            await this.page.waitForTimeout(1000)
            await this.selectUserMenu.click();
            await Elements.waitForVisible(this.selectedUser);
            await this.selectedUser.click();
            await this.saveButton.click();
        }
    }
    /**
     * Delete user from pre-prod database
     */
    public async deleteUser(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteUserData(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Check for the 'Select user' button
     */
    private async checkSelectUserButton(): Promise<void> {
        await this.authAvatar.click();
        if(await this.selectUserButton.isVisible()) return;
        else setTimeout(() => this.checkSelectUserButton(),500);
    }
    /**
     * Get 2FA code
     */
    private get get2FaToken(): string {
        const token = twoFactor.generateToken("MFEONTQDSEYUEMWYXWJMPJY6QZSYO2U7");
        return (token) ? token.token : this.get2FaToken;
    }
    /**
     * Enter confirmation code
     */
    private async setConfirmationCode(): Promise<void> {
        if(this.loginAttempts == 0) throw new Error("Не осталось попыток входа в систему");
        const twoFaToken: string = this.get2FaToken;
        await this.confirmationCode.fill(twoFaToken);
        await this.confirmButton.click();
        await this.page.waitForTimeout(1000);
        if(await this.invalidCodeMessage.isVisible()) {
            logger.warn("Неверный код подтверждения. Ожидание генерации нового кода...");
            await this.closeInvalidCodeMessageButton.click();
            await this.waitForGenerateNewToken(twoFaToken);
            this.loginAttempts--;
            if(this.loginAttempts > 0) logger.info(`Вход в систему c новым кодом подтверждения. Осталось попыток: ${this.loginAttempts}`);
            await this.setConfirmationCode();
        }
    }
    /**
     * Waiting for generation new 2fa token
     */
    private async waitForGenerateNewToken(twoFaCode: string): Promise<void> {
        while (twoFaCode == this.get2FaToken) {
            await this.page.waitForTimeout(1000);
        }
    }
}