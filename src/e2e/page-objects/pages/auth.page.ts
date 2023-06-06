import {Locator, Page} from "@playwright/test";
import {BasePage} from "./base.page.js";
import {Elements} from "../../framework/elements/elements.js";
import {DbHelper} from "../../../db/db-helper.js";
import {operationsLog, workUsers} from "../../../db/tables.js";
import {Api} from "../helpers/enums/api.js";
import {Roles} from "../helpers/enums/roles.js";
import twoFactor from "node-2fa";
import * as Process from "process";

export class AuthPage extends BasePage {
    private readonly userMail : string = "sync-license@rfs.ru"
    private readonly userPassword : string = "RfsTest2023"
    private readonly userNumber : number = 0;
    protected userId : number = 0;
    constructor(page : Page) {
        super(page)
    }
    /**
     * Picture to call the authorization menu
     */
    private authAvatar : Locator = Elements.getElement(this.page,"//*[contains(@class,'login_avatar')]");
    /**
     * 'Check user' button
     */
    private selectUserButton : Locator = Elements.getElement(this.page,"//*[text()='Выбрать пользователя']");
    /**
     * 'Check user' menu
     */
    private selectUserMenu : Locator = Elements.getElement(this.page,"//*[contains(@class,'user__control')]");
    /**
     * 'Check user' menu dropdown values
     */
    private selectUserMenuList : Locator = Elements.getElement(this.page,"//*[contains(@class,'user__option')]");
    /**
     * Field "E-mail"
     */
    private email : Locator = Elements.getElement(this.page,"//input[@placeholder='E-mail']");
    /**
     * Field "Password"
     */
    private password : Locator = Elements.getElement(this.page,"//input[@name='password']");
    /**
     * Field "Confirmation code"
     */
    private confirmationCode : Locator = Elements.getElement(this.page,"//input[@placeholder='Код подтверждения']");
    /**
     * Button "Confirm"
     */
    private confirmButton : Locator = Elements.getElement(this.page,"//button[text()='ПОДТВЕРДИТЬ']");
    /**
     * Button "Enter"
     */
    private enterButton : Locator = Elements.getElement(this.page,"//button[text()='ВОЙТИ']");
    /**
     * Message "Verification code entered incorrectly"
     */
    private invalidCodeMessage : Locator = Elements.getElement(this.page,"//p[text()='Неверно введён проверочный код']");
    /**
     * Create a user with 'Administrator' role
     */
    public async createUser() : Promise<void> {
        const dbHelper = new DbHelper();
        const response = await this.page.request.get(Api.users);
        const userId : number = await response.json().then(value => value.data[this.userNumber].id);
        this.userId = userId;
        const dbUserData  = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,userId);
        if (dbUserData[0][workUsers.columns.roleId] == Roles.admin) return;
        else {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,userId);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,userId);
            await dbHelper.insertUser(userId);
            await dbHelper.insertUserRights(userId);
            await dbHelper.closeConnect();
        }
    }
    /**
     * Log in to the system
     */
    public async login() : Promise<void> {
        await this.page.goto("");
        if (Process.env.BRANCH == "prod") {
            await Elements.waitForVisible(this.email);
            await this.email.type(this.userMail);
            await this.password.type(this.userPassword);
            await this.enterButton.click();
            await Elements.waitForVisible(this.confirmationCode);
            await this.setConfirmationCode();
        }
        else {
            await Elements.waitForVisible(this.authAvatar);
            await this.checkSelectUserButton();
            await this.selectUserButton.click();
            await Elements.waitForVisible(this.selectUserMenu);
            await this.selectUserMenu.click();
            await Elements.waitForVisible(this.selectUserMenuList.first());
            await this.selectUserMenuList.nth(this.userNumber).click();
            await this.saveButton.click();
        }
    }
    /**
     * Check for the 'Select user' button
     */
    private async checkSelectUserButton() : Promise<void> {
        await this.authAvatar.click();
        if(await this.selectUserButton.isVisible()) return;
        else setTimeout(() =>this.checkSelectUserButton(),500);
    }
    /**
     * Get 2FA code
     */
    private get get2FaToken() : string {
        const token = twoFactor.generateToken("MFEONTQDSEYUEMWYXWJMPJY6QZSYO2U7");
        return (token) ? token.token : this.get2FaToken;
    }
    /**
     * Enter confirmation code
     */
    private async setConfirmationCode() : Promise<void> {
        await this.confirmationCode.clear();
        await this.confirmationCode.type(this.get2FaToken);
        await this.confirmButton.click();
        if (await this.invalidCodeMessage.isVisible({timeout:500})) await this.setConfirmationCode();
    }
}