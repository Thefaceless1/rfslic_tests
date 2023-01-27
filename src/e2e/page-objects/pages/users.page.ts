import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {SearchModalPage} from "./search-modal.page.js";
import {Pages} from "../helpers/enums/pages.js";
import {DbHelper} from "../../framework/db/db-helper.js";
import {operationsLog, workUsers} from "../../framework/db/tables.js";
import {UserTabs} from "../helpers/enums/usertabs.js";

export class UsersPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить" (+)
     */
    private plusAddButton : Locator = Elements.getElement(this.page,"//*[text()='Список пользователей']//following-sibling::button");
    /**
     * Кнопка "Изменить роль"
     */
    private editRoleButton : Locator = Elements.getElement(this.page,"//span[text()='Изменить роль']");
    /**
     * Кнопка "Изменить роль"
     */
    private changeRoleButton : Locator = Elements.getElement(this.page,"//button[text()='Сменить роль']");
    /**
     * Поле "Выберите группы"
     */
    private selectGroups : Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__control')]");
    /**
     * Значения выпадающего списка поля "Выберите группы"
     */
    private selectGroupsList : Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__option')]");
    /**
     * Получить элемента табов пользователя по enum
     */
    private userTabsByEnum(tabName : string) : Locator {
        return Elements.getElement(this.page,`//button[text()='${tabName}']`);
    }
    /**
     * Добавить пользователя
     */
    public async addUser() : Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.plusAddButton.click();
        await Elements.waitForVisible(this.searchDataButton);
        await this.searchDataButton.click();
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator.first());
        await searchModal.radio.first().click();
        await searchModal.selectButton.click();
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.first().click();
        await this.addButton.click();
    }
    /**
     * Изменить роль пользоваетеля
     */
    public async changeUserRole() : Promise<void> {
        await this.editRoleButton.click();
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.last().click();
        await this.saveButton.click();
        await this.changeRoleButton.click();
    }
    /**
     * Изменить группы критериев для пользователя
     */
    public async changeUserGrpCrit() : Promise<void> {
        await this.userTabsByEnum(UserTabs.grpCriterias).click();
        await this.selectGroups.click();
        await Elements.waitForVisible(this.selectGroupsList.first());
        const iterationCount : number = await this.selectGroupsList.count();
        for (let i = 0; i<iterationCount; i++) {
            await this.selectGroupsList.first().click();
        }
        await this.saveButton.click();
    }
    /**
     * Удалить первую запись найденного списка пользователей из БД
     */
    public async deleteFirstUser() : Promise<void> {
        const response = await this.page.request.get(Pages.clubWorkers);
        const firstUserId : number  = await response.json().then(value => value.data[0].id);
        const dbHelper = new DbHelper()
        await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,firstUserId);
        await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,firstUserId);
    }
}