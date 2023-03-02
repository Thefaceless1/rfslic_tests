import {MainPage} from "../main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {InputData} from "../../helpers/input-data.js";

export class GroupsClassifierPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Field "Enter group name"
     */
    private enterGroupName : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название группы']");
    /**
     * Add a group
     */
    public async addGroup() : Promise<void> {
        await this.addGrpCritButton.click();
        await this.enterGroupName.type(InputData.randomWord);
        await this.saveButton.click();
    }
    /**
     * Change a group
     */
    public async changeGroup() : Promise<void> {
        await Elements.waitForVisible(this.editTableButton.first());
        await this.editTableButton.last().click();
        await this.enterGroupName.clear();
        await this.enterGroupName.type(InputData.randomWord);
        await this.checkbox.click();
        await this.saveButton.click();
    }
    /**
     * Delete a group
     */
    public async deleteGroup() : Promise<void> {
        await Elements.waitForVisible(this.deleteTableButton.first());
        await this.deleteTableButton.last().click();
        await this.deleteButton.click();
    }
}