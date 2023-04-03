import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {InputData} from "../../helpers/input-data.js";
import {Notifications} from "../../helpers/enums/notifications.js";

export class RolesPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Button "Save as"
     */
    private saveAsButton : Locator = Elements.getElement(this.page,"//button[text()='Сохранить как...']");
    /**
     * Field "Role name"
     */
    private enterRole : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название роли']");
    /**
     * Field "Role description"
     */
    private roleDescription : Locator = Elements.getElement(this.page,"//textarea[@placeholder='Введите описание роли']");
    /**
     * Displayed role
     */
    private displayedRole : Locator = Elements.getElement(this.page,"//*[contains(@class,'role__single-value')]");
    /**
     * Add a role
     */
    public async addRole() : Promise<void> {
        const roleName : string = InputData.randomWord;
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.first().click();
        await Elements.waitForVisible(this.saveAsButton);
        await this.saveAsButton.click();
        await Elements.waitForVisible(this.enterRole);
        await this.enterRole.clear();
        await this.enterRole.type(roleName);
        await this.roleDescription.clear()
        await this.roleDescription.type(InputData.randomWord);
        await this.saveButton.last().click();
        await expect(await this.compareRoleNames(roleName)).toBeTruthy();
    }
    /**
     * Comparison of expected and actual role name
     */
    private async compareRoleNames(expectedName : string) : Promise<boolean> {
        const actualRoleName : string = await this.displayedRole.innerText();
        return (expectedName == actualRoleName) ? true : await this.compareRoleNames(expectedName);
    }
    /**
     * Delete a role
     */
    public async deleteRole() : Promise<void> {
        await this.deleteButton.click();
        await this.deleteButton.last().click();
        await expect(this.notification(Notifications.roleDeleted)).toBeVisible();
    }
}