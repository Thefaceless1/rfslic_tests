import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";
import {Elements} from "../../../framework/elements/Elements.js";

export class FinalDocumentsGroupsPage extends MainPage {
    private finalDocumentTypeName: string = ""
    constructor(page: Page) {
        super(page);
    }
    /**
     * Dictionary entry in table
     */
    private tableDictionaryEntry: Locator = Elements.getElement(this.page,"//tr[contains(@class,'ant-table-row')]")
    /**
     * Field 'New request criteria groups'
     */
    private newRequestCriteriaGroups: Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__indicators')]")
    /**
     * Field 'New request criteria groups' values
     */
    private newRequestCriteriaGroupsValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'groups__option')]")
    /**
     * Field 'Types of resulting documents from which inheritance is possible'
     */
    private origLicTypes: Locator = Elements.getElement(this.page,"//*[contains(@class,'origLicTypes__dropdown-indicator')]")
    /**
     * Field 'Types of resulting documents from which inheritance is possible' values
     */
    private origLicTypesValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'origLicTypes__option')]")
    /**
     * Added entry in dictionary table
     */
    private addedEntryInTable(): Locator {
        return Elements.getElement(this.page,`//td[text()='${this.finalDocumentTypeName}']`);
    }
    /**
     * Delete button for created entry
     */
    private addedEntryDeleteButton(): Locator {
        return Elements.getElement(this.page,`//td[text()='${this.finalDocumentTypeName}']//following-sibling::td[contains(@class,'editWrapperCell')]//*//*[contains(@class,'deleteWrapper')]`);
    }
    /**
     * Add an entry to dictionary
     */
    public async addFinalDocumentGroup(): Promise<void> {
        await this.addButton.click();
        await this.licType.click();
        await Elements.waitForVisible(this.licTypeValues.first());
        this.finalDocumentTypeName = await this.licTypeValues.first().innerText();
        await this.licTypeValues.first().click();
        await this.newRequestCriteriaGroups.click();
        await Elements.waitForVisible(this.newRequestCriteriaGroupsValues.first());
        while (await this.newRequestCriteriaGroupsValues.count() > 0) await this.newRequestCriteriaGroupsValues.first().click();
        await this.origLicTypes.click();
        await Elements.waitForVisible(this.origLicTypesValues.first());
        while (await this.origLicTypesValues.count() > 0) await this.origLicTypesValues.first().click();
        await this.saveButton.click();
        await expect(this.addedEntryInTable()).toBeVisible();
    }
    /**
     * Checking whether it is possible to add an entry to the dictionary
     */
    public async canAddEntry(): Promise<boolean> {
        await this.adminMenuByEnum(AdminOptions.licenseText).click();
        await this.licType.click()
        await Elements.waitForVisible(this.licTypeValues.first());
        const maxEntryCount: number = await this.licTypeValues.count();
        await this.page.goBack();
        await this.adminMenuByEnum(AdminOptions.finalDocumentsGroups).click();
        await Elements.waitForVisible(this.tableDictionaryEntry.first());
        const addedEntriesCount: number = await this.tableDictionaryEntry.count();
        return maxEntryCount != addedEntriesCount;
    }
    /**
     * Delete an entry from dictionary
     */
    public async deleteFinalDocumentGroup(): Promise<void> {
        await this.addedEntryDeleteButton().click();
        await this.deleteButton.click();
        await Elements.waitForHidden(this.deleteButton);
        await expect(this.addedEntryInTable()).not.toBeVisible();
    }
}