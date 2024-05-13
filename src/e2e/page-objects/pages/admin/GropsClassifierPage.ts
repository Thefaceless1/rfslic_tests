import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";
import {Notifications} from "../../helpers/enums/Notifications.js";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";
import {DbHelper} from "../../../../db/db-helper.js";

export class GroupsClassifierPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Field "Enter group name"
     */
    private enterGroupName: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название группы']")
    /**
     * Add a group
     */
    public async addGroup(): Promise<void> {
        await this.adminMenuByEnum(AdminOptions.groupsClassifier).click();
        await this.addCriteriaGroupButton.click();
        await this.enterGroupName.fill(InputData.randomWord);
        await this.saveButton.click();
        await expect(this.notification(Notifications.groupAdded)).toBeVisible()
    }
    /**
     * Change a group
     */
    public async changeGroup(): Promise<void> {
        await Elements.waitForVisible(this.editTableButton.first());
        await this.editTableButton.last().click();
        await this.enterGroupName.fill(InputData.randomWord);
        await this.checkbox.click();
        await this.saveButton.click();
        await expect(this.notification(Notifications.groupChanged)).toBeVisible();
    }
    /**
     * Delete a group
     */
    public async deleteGroup(): Promise<void> {
        await Elements.waitForVisible(this.deleteTableButton.first());
        await this.deleteTableButton.last().click();
        await this.deleteButton.click();
        await expect(this.notification(Notifications.groupDeleted)).toBeVisible();
    }
    /**
     * Delete criteria groups
     */
    public async deleteCriteriaGroups(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteCriteriaGroups();
        await dbHelper.closeConnect();
    }
}