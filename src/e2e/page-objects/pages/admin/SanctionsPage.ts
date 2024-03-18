import {MainPage} from "../MainPage.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {Locator,expect} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {ProlicTypes} from "../../helpers/enums/ProlicTypes.js";
import {randomInt} from "crypto";
import {Notifications} from "../../helpers/enums/Notifications.js";

export class SanctionsPage extends MainPage {
    /**
     * Tab 'Sanctions'
     */
    private sanctionsTab: Locator = Elements.getElement(this.page,"//button[text()='Санкции']")
    /**
     * Field 'Max fine'
     */
    private maxFine: Locator = Elements.getElement(this.page,"//input[@name='maxFine']")
    /**
     * Field 'Select sanction type'
     */
    private selectSanctionType: Locator = Elements.getElement(this.page,"//*[contains(@class,'sanctionType__control')]")
    /**
     * Field 'Select violation'
     */
    private selectViolation: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__control')]")
    /**
     * Violation with 'autotest'
     */
    private autotestViolation: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__option') and contains(text(),'автотест')]")
    /**
     * Edit button for created sanction
     */
    private createdSanctionEditButton(): Locator {
        return Elements.getElement(this.page,`//td[.//*[contains(text(),'автотест')]]//following-sibling::td[contains(@class,'editWrapperCell')]//*//*[contains(@class,'editWrapper')]`);
    }
    /**
     * Delete button for created sanction
     */
    private createdSanctionDeleteButton(): Locator {
        return Elements.getElement(this.page,`//td[.//*[contains(text(),'автотест')]]//following-sibling::td[contains(@class,'editWrapperCell')]//*//*[contains(@class,'deleteWrapper')]`);
    }
    /**
     * Fine sanction type
     */
    private async fineSanctionType(): Promise<Locator> {
        return Elements.getElement(this.page,`//*[contains(@class,'sanctionType__option') and (text()='${await this.fineSanctionTypeName()}')]`);
    }
    /**
     * Insert violation in database
     */
    public async createViolation(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.insertViolation();
        await dbHelper.closeConnect();
    }
    /**
     * Getting name of fine sanction type
     */
    private async fineSanctionTypeName(): Promise<string> {
        const dbHelper = new DbHelper();
        const fineSanctionTypeName: string = await dbHelper.getFineSanctionTypeName();
        await dbHelper.closeConnect();
        return fineSanctionTypeName;
    }
    /**
     * Delete violations, sanction types and sanction from database
     */
    public async deleteViolationAndSanctionFromDatabase(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteSanctions();
        await dbHelper.deleteViolations();
        await dbHelper.closeConnect();
    }
    /**
     * Add a sanction
     */
    public async addSanction(): Promise<void> {
        await this.sanctionsTab.click();
        await this.addButton.click();
        await this.prolicType.click();
        await Elements.waitForVisible(this.prolicTypeValue(ProlicTypes.licensing));
        await this.prolicTypeValue(ProlicTypes.licensing).click();
        await this.licType.click();
        await Elements.waitForVisible(this.rfsWomanLicType);
        await this.rfsWomanLicType.click();
        await this.selectViolation.click();
        await Elements.waitForVisible(this.autotestViolation);
        await this.autotestViolation.click();
        await this.selectSanctionType.click();
        await Elements.waitForVisible(await this.fineSanctionType());
        await this.fineSanctionType().then(fineSanctionTypeLocator => fineSanctionTypeLocator.click());
        await this.fineAmountFieldEdition.type(String(randomInt(1,10000000)));
        await this.maxFine.type(String(randomInt(1,10000000)));
        await this.saveButton.click();
        await expect(this.notification(Notifications.sanctionSaved)).toBeVisible()
    }
    /**
     * Change fine amount for sanction
     */
    public async changeFineAmount(): Promise<void> {
        await Elements.waitForVisible(this.forwardButton.first());
        while(!await this.createdSanctionEditButton().isVisible()) {
            await this.forwardButton.first().click()
            await this.page.waitForTimeout(1000);
        }
        await this.createdSanctionEditButton().click();
        await this.fineAmountFieldEdition.fill(String(randomInt(1,10000000)));
        await this.maxFine.fill(String(randomInt(1,10000000)));
        await this.saveButton.click();
        await expect(this.notification(Notifications.sanctionSaved)).toBeVisible()
    }
    /**
     * Delete a sanction
     */
    public async deleteSanction(): Promise<void> {
        await this.createdSanctionDeleteButton().click();
        await this.deleteButton.click();
        await expect(this.notification(Notifications.entryDeleted)).toBeVisible()
    }
}