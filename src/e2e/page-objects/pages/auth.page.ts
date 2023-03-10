import {Locator, Page} from "@playwright/test";
import {BasePage} from "./base.page.js";
import {Elements} from "../../framework/elements/elements.js";
import {DbHelper} from "../../../db/db-helper.js";
import {operationsLog, workUsers} from "../../../db/tables.js";
import {Api} from "../helpers/enums/api.js";
import {Roles} from "../helpers/enums/roles.js";

export class AuthPage extends BasePage {
    private readonly userNumber : number = 0;
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
     * Create a user with 'Administrator' role
     */
    public async createUser() : Promise<void> {
        const dbHelper = new DbHelper();
        const response = await this.page.request.get(Api.users);
        const userId : number = await response.json().then(value => value.data[this.userNumber].id);
        const dbUserData  = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,userId);
        if (dbUserData[0][workUsers.columns.roleId] == Roles.admin) return;
        else {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,userId);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,userId);
            await dbHelper.insertUser(userId);
            await dbHelper.insertUserRights(userId);
            await dbHelper.sql.end();
        }
    }
    /**
     * Log in to the system
     */
    public async login() : Promise<void> {
        await this.page.goto("");
        await Elements.waitForVisible(this.authAvatar);
        await this.checkSelectUserButton();
        await this.selectUserButton.click();
        await Elements.waitForVisible(this.selectUserMenu);
        await this.selectUserMenu.click();
        await Elements.waitForVisible(this.selectUserMenuList.first());
        await this.selectUserMenuList.nth(this.userNumber).click();
        await this.saveButton.click();
    }
    /**
     * Check for the 'Select user' button
     */
    private async checkSelectUserButton() : Promise<void> {
        await this.authAvatar.click();
        if(await this.selectUserButton.isVisible()) return;
        else setTimeout(() =>this.checkSelectUserButton(),500);
    }
}