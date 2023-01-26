import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {SearchModalPage} from "./search-modal.page.js";
import {Pages} from "../helpers/enums/pages.js";
import {DbHelper} from "../../framework/db/db-helper.js";
import {operationsLog, workUsers} from "../../framework/db/tables.js";

export class UsersPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить" (+)
     */
    private plusAddButton : Locator = Elements.getElement(this.page,"//*[text()='Список пользователей']//following-sibling::button");
    public async addUser() : Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.plusAddButton.click();
        await Elements.waitForVisible(this.searchDataButton);
        await this.searchDataButton.click();
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator.first());
    }
    public async deleteFirstUser() : Promise<void> {
        const response = await this.page.request.get(Pages.clubWorkers);
        const firstUserId : number  = await response.json().then(value => value.data[0].id);
        const dbHelper = new DbHelper()
        await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,firstUserId);
        await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,firstUserId);
    }
}