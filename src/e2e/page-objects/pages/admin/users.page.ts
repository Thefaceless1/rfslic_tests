import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {SearchModalPage} from "../search-modal.page.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {UserTabs} from "../../helpers/enums/usertabs.js";
import {Notifications} from "../../helpers/enums/notifications.js";

export class UsersPage extends MainPage {
    private readonly testedUserId : number = 17500821
    private readonly testedUserRfsId : string = '826252'
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Add" (+)
     */
    private plusAddButton: Locator = Elements.getElement(this.page,"//*[text()='Список пользователей']//following-sibling::button")
    /**
     * Button "Edit a role"
     */
    private editRoleButton: Locator = Elements.getElement(this.page,"//span[text()='Изменить роль']")
    /**
     * Button "Change a role"
     */
    private changeRoleButton: Locator = Elements.getElement(this.page,"//button[text()='Сменить роль']")
    /**
     * Field "Select groups"
     */
    private selectGroups: Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__control')]")
    /**
     * Values of the drop-down list of the field "Select groups"
     */
    private selectGroupsList: Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__option')]")
    /**
     * Get user tab elements by enum
     */
    private userTabsByEnum(tabName: string): Locator {
        return Elements.getElement(this.page,`//button[text()='${tabName}']`);
    }
    /**
     * Add a user
     */
    public async addUser(): Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.plusAddButton.click();
        await Elements.waitForVisible(this.searchDataButton);
        await this.searchDataButton.click();
        await searchModal.search.type(this.testedUserRfsId);
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator.first());
        await searchModal.radio.click();
        await searchModal.selectButton.click();
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.first().click();
        await this.addButton.click();
        await expect(this.notification(Notifications.userAdded)).toBeVisible();
    }
    /**
     * Change a user role
     */
    public async changeUserRole(): Promise<void> {
        await this.editRoleButton.click();
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.last().click();
        await this.saveButton.click();
        await this.changeRoleButton.click();
        await expect(this.notification(Notifications.userRoleChanged)).toBeVisible();
    }
    /**
     * Change criteria groups for a user
     */
    public async changeUserGrpCrit(): Promise<void> {
        await this.userTabsByEnum(UserTabs.grpCriterias).click();
        await this.selectGroups.click();
        await Elements.waitForVisible(this.selectGroupsList.first());
        const iterationCount : number = await this.selectGroupsList.count();
        for (let i = 0; i<iterationCount; i++) {
            await this.selectGroupsList.first().click();
        }
        await this.saveButton.click();
        await expect(this.notification(Notifications.userGroupsChanged)).toBeVisible();
    }
    /**
     * Delete testing user before test run
     */
    public async deleteTestedUser(): Promise<void> {
        const dbHelper = new DbHelper()
        await dbHelper.deleteProdUserData(this.testedUserId);
        await dbHelper.closeConnect();
    }
}