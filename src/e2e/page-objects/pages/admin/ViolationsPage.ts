import {MainPage} from "../MainPage.js";
import {Locator, expect} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";

export class ViolationsPage extends MainPage {
    private violationName: string = InputData.randomWord
    /**
     * Field 'Enter violation name'
     */
    private enterViolationName: Locator = Elements.getElement(this.page,"//input[@name='name']")
    /**
     * Field 'Text for violation'
     */
    private violationText: Locator = Elements.getElement(this.page,"//textarea[@name='text']")
    /**
     * Tab 'Violations'
     */
    private violationsTab: Locator = Elements.getElement(this.page,"//button[text()='Нарушения']")
    /**
     * Field 'Event description'
     */
    private eventDescription: Locator = Elements.getElement(this.page,"//textarea[@name='eventDescription']")
    /**
     * Field 'Violation name' in the table
     */
    private violation(violationName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${violationName}']`);
    }
    /**
     * Edit button for selected violation
     */
    private editViolationButton(violationName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${violationName}']//following-sibling::td[contains(@class,'editWrapperCell')]//*//*//span[contains(@class,'IconEdit')]`);
    }
    /**
     * Delete button for selected violation
     */
    private deleteViolationButton(violationName: string): Locator {
        return Elements.getElement(this.page,`//td[text()='${violationName}']//following-sibling::td[contains(@class,'editWrapperCell')]//*//*[contains(@class,'deleteWrapper')]//span`);
    }
    /**
     * Add a violation
     */
    public async addViolation(): Promise<void> {
        await this.adminMenuByEnum(AdminOptions.sanctionConstructor).click();
        await this.violationsTab.click();
        await this.addButton.click();
        await this.enterViolationName.type(this.violationName);
        await this.violationText.type(InputData.randomWord);
        await this.eventDescription.type(InputData.randomWord);
        await this.saveButton.click();
        await expect(this.violation(this.violationName)).toBeVisible();
    }
    /**
     * Change a violation
     */
    public async changeViolation(): Promise<void> {
        await this.editViolationButton(this.violationName).click();
        this.violationName = InputData.randomWord;
        await this.enterViolationName.fill(this.violationName);
        await this.saveButton.click();
        await expect(this.violation(this.violationName)).toBeVisible();
    }
    /**
     * Delete a violation
     */
    public async deleteViolation(): Promise<void> {
        await this.deleteViolationButton(this.violationName).click();
        await this.deleteButton.click();
        await this.page.reload({waitUntil: "load"});
        await expect(this.violation(this.violationName)).not.toBeVisible();
    }
    /**
     * Delete violations from database
     */
    public async deleteViolations(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteViolations();
        await dbHelper.closeConnect();
    }
}