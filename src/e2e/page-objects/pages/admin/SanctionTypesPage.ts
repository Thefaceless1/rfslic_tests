import {MainPage} from "../MainPage.js";
import {Locator,expect} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";

export class SanctionTypesPage extends MainPage {
    private sanctionTypeName: string = InputData.randomWord
    /**
     * Field 'Sanction type text'
     */
    private sanctionTypeText: Locator = Elements.getElement(this.page,"//input[@name='text']")
    /**
     * Tab 'Sanction types'
     */
    private sanctionTypesTab: Locator = Elements.getElement(this.page,"//button[text()='Виды санкций']")
    /**
     * Field 'Sanction type' in the table
     */
    private sanctionType(sanctionName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${sanctionName}']`);
    }
    /**
     * Edit button for the selected type of sanction
     */
    private sanctionTypeEditButton(sanctionName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${sanctionName}']//following-sibling::td//*//*//span[contains(@class,'IconEdit')]`);
    }
    /**
     * Edit button for the selected type of sanction
     */
    private sanctionTypeDeleteButton(sanctionName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${sanctionName}']//following-sibling::td//*//*[contains(@class,'deleteWrapper')]//span`);
    }
    /**
     * Add a sanction type
     */
    public async addSanctionType(): Promise<void> {
        await this.adminMenuByEnum(AdminOptions.sanctionConstructor).click();
        await this.sanctionTypesTab.click();
        await this.addButton.click();
        await this.sanctionTypeText.type(this.sanctionTypeName);
        await this.saveButton.click();
        await expect(this.sanctionType(this.sanctionTypeName)).toBeVisible();
    }
    /**
     * Change a sanction type
     */
    public async changeSanctionType(): Promise<void> {
        await this.sanctionTypeEditButton(this.sanctionTypeName).click();
        this.sanctionTypeName = InputData.randomWord;
        await this.sanctionTypeText.fill(this.sanctionTypeName);
        await this.saveButton.click();
        await expect(this.sanctionType(this.sanctionTypeName)).toBeVisible();
    }
    /**
     * Delete a sanction type
     */
    public async deleteSanctionType(): Promise<void> {
        await this.sanctionTypeDeleteButton(this.sanctionTypeName).click();
        await this.deleteButton.click();
        await this.page.reload({waitUntil: "load"});
        await expect(this.sanctionType(this.sanctionTypeName)).not.toBeVisible();
    }
    /**
     * Delete sanction types from database
     */
    public async deleteSanctionTypes(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteSanctionTypes();
        await dbHelper.closeConnect();
    }
}