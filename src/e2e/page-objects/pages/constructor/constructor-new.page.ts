import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {Date} from "../../../framework/elements/date.js";
import {Input} from "../../../framework/elements/input.js";
import {ProlicenseActions} from "../../helpers/enums/prolicense-actions.js";
import {InputData} from "../../helpers/input-data.js";
import {randomInt} from "crypto";
import {NonFilesDoctypes} from "../../helpers/enums/non-files-doctypes.js";
import {ConstructorPage} from "./constructor.page.js";
import {MainMenuOptions} from "../../helpers/enums/main-menu-options.js";
import {Columns} from "../../helpers/enums/columns.js";
import {CriteriaTypes} from "../../helpers/enums/criteriatypes.js";
import {Notifications} from "../../helpers/enums/notifications.js";
import {ProlicStatus} from "../../helpers/enums/prolicstatus.js";
import {DbHelper} from "../../../../db/db-helper.js";

export class ConstructorNewPage extends ConstructorPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * The name of the created prolicense
     */
    public createdProlicName: Locator = Elements.getElement(this.page,"//*[text()='Название пролицензии:']//following-sibling::*")
    /**
     * Field "Season"
     */
    private season: Locator = Elements.getElement(this.page,"//*[contains(@class,'season__control')]")
    /**
     * Field "Document name"
     */
    private docName: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название документа']")
    /**
     * Field "Add document"
     */
    private addDocButton: Locator = Elements.getElement(this.page,"//span[text()='Добавить документ']")
    /**
     * Action call button for prolicense
     */
    private  actionButton: Locator = Elements.getElement(this.page,"//button[@name='proLic_btn_details']")
    /**
     * Field "Criteria group name"
     */
    private grpCrit = Elements.getElement(this.page,"//*[contains(@class,'groupName__placeholder')]")
    /**
     * Values of the drop-down list of the field "Criteria group name"
     */
    private grpCritList: Locator = Elements.getElement(this.page,"//*[contains(@class,'groupName__option')]")
    /**
     * Created criteria groups
     */
    private createdGroups: Locator = Elements.getElement(this.page,"//span[contains(text(),'критерии')]")
    /**
     * Action dropdown values
     */
    private actionsList: Locator = Elements.getElement(this.page,"//*[contains(@class,'ContextMenuLevelCanary-Item')]")
    /**
     * Values of the drop-down list of the "Season" field
     */
    private seasons: Locator = Elements.getElement(this.page,"//*[contains(@class,'season__option')]")
    /**
     * Field "Criteria number"
     */
    private criteriaNumber: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите номер критерия']")
    /**
     * Field "Rank"
     */
    private rankCriteria: Locator = Elements.getElement(this.page,"//*[contains(@class,'category__control')]")
    /**
     * Values of the drop-down list of the field "Rank"
     */
    private rankList: Locator = Elements.getElement(this.page,"//*[contains(@class,'category__option')]")
    /**
     * Field "Criteria name"
     */
    private criteriaName: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название критерия']")
    /**
     * Field "Criteria type"
     */
    private criteriaType: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]")
    /**
     * Values of the drop-down list of the field "Criteria type"
     */
    private criteriaTypeList: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]")
    /**
     * Field "Additional data type"
     */
    private additionalDataType: Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__control')]")
    /**
     * Values of the drop-down list of the field "Additional data type"
     */
    private additionalDataTypeList: Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__option')]")
    /**
     * Button "Publish"
     */
    private publishButton: Locator = Elements.getElement(this.page,"//button[text()='Опубликовать']")
    /**
     * Button "Unpublish"
     */
    private unpublishButton: Locator = Elements.getElement(this.page,"//button[text()='Снять с публикации']")
    /**
     * Field "Document description"
     */
    private docDescription: Locator = Elements.getElement(this.page,"//textarea[@placeholder='Добавьте описание документа']")
    /**
     * Created criteria name
     */
    private createdCriteria: Locator = Elements.getElement(this.page,"//span[contains(text(),'Название')]")
    /**
     * Field "Multiple criteria"
     */
    private multipleCriteria: Locator = Elements.getElement(this.page,"//input[@name='isMulti']")
    /**
     * Field "Minimal amount"
     */
    private minAmount: Locator = Elements.getElement(this.page,"//input[@name='minCount']")
    /**
     * Radio "Finance control"
     */
    private finControl: Locator = Elements.getElement(this.page,"//button[@role='switch']")
    /**
     * Current displayed prolicense status
     */
    private prolicenseStatus(statusValue: string): Locator {
        return Elements.getElement(this.page,`//*[text()='${statusValue}']`);
    }
    /**
     * Open Prolicense constructor
     */
    public async openConstructor(): Promise<void> {
        await Elements.waitForVisible(this.menuOptionByEnum(MainMenuOptions.constructor));
        await this.menuOptionByEnum(MainMenuOptions.constructor).click();
        await this.createProlicButton.click();
    }
    /**
     * Get an action for a prolicense by enum
     */
    private async actionByEnum(enumValue: ProlicenseActions) {
        const actionArray = await this.actionsList.all();
        for (const action of actionArray) {
            if (await action.textContent() == enumValue) return action;
        }
    }
    /**
     * Fill in the fields of the block "General information"
     */
    private async fillBasicInfo(): Promise<void> {
        const prolicName = InputData.randomWord
        await this.name.type(prolicName);
        await this.season.click();
        await this.seasons.last().click();
        await this.licType.click();
        await this.licenseTypes.last().click();
        const allDates = await this.dates.all();
        for (const date of allDates) {
            const index = allDates.indexOf(date);
            if(index == 0) await Date.fillDateInput(date,InputData.date1);
            else if(index == 1) await Date.fillDateInput(date,InputData.date2);
            else await Date.fillDateInput(date,InputData.currentDate);
        }
    }
    /**
     * Change the values in the fields of the "General information" block
     */
    public async changeBasicInfo(): Promise<void> {
        const oldProlicName: string = await this.createdProlicName.innerText();
        await this.editButton.first().click();
        await this.finControl.click();
        await this.name.clear();
        await this.name.type(InputData.randomWord);
        const allDates = await this.dates.all();
        for (const date of allDates) {
            await Date.fillDateInput(date,InputData.futureDate);
        }
        await this.saveButton.click();
        await expect(this.compareProlicName(oldProlicName)).toBeTruthy();
    }
    /**
     * Comparison of the old and new name of the prolicense
     */
    private async compareProlicName(oldProlicName: string): Promise<boolean> {
        const newProlicName: string = await this.createdProlicName.innerText();
        return (oldProlicName != newProlicName) ? true : this.compareProlicName(oldProlicName);
    }
    /**
     * Fill in the fields of the block "Documents for filing an application"
     */
    private async fillDocs(): Promise<void> {
        const docsCount: number = 2;
        for(let i = 1 ; i<=docsCount ; i++) {
            if (i != 1) await this.addDocButton.click();
            await this.docName.last().type(InputData.randomWord);
            await this.docDescription.last().type(InputData.randomWord);
            await Input.uploadFiles(this.templates.last(),"all");
            await Elements.waitForVisible(this.docIcon.last());
            await Elements.waitForVisible(this.xlsxIcon.last());
        }
    }
    /**
     * Create a prolicense
     */
    public async createProlicense(): Promise<void> {
         await this.fillBasicInfo();
         await this.fillDocs();
         await this.saveButton.click();
         await expect(this.createdProlicName).toBeVisible();
    }
    /**
     * Copy a prolicense
     */
    public async cloneProlicense(): Promise<void> {
        const prolicNameBeforeClone: string = await this.createdProlicName.innerText();
        await this.actionButton.click();
        await this.actionsList.filter({hasText: ProlicenseActions.clone}).click();
        await this.name.type(InputData.randomWord);
        await this.saveButton.click();
        await expect(this.compareProlicName(prolicNameBeforeClone)).toBeTruthy();
    }
    /**
     * Publication of a prolicense
     */
    public async publishProlicense(scenario: "lic" | "prolic"): Promise<void> {
        if(scenario == "prolic") {
            await this.filterByColumn(this.filterButtonByEnum(Columns.licName));
            await this.waitForColumnFilter();
            await this.tableRow.click();
        }
        await this.actionButton.click();
        await this.actionsList.filter({hasText: ProlicenseActions.publish}).click();
        await this.publishButton.click();
        if(scenario == "prolic") {
            await this.filterByColumn(this.filterButtonByEnum(Columns.licName));
            await this.waitForColumnFilter();
            await this.tableRow.click();
            await expect(this.prolicenseStatus(ProlicStatus.published)).toBeVisible();
        }
    }
    /**
     * Unpublish of a prolicense
     */
    public async unpublishProlicense(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList.filter({hasText: ProlicenseActions.unpublish}).click();
        await this.unpublishButton.click();
        await expect(this.prolicenseStatus(ProlicStatus.onEditing)).toBeVisible();
    }
    /**
     * Remove a prolicense
     */
    public async deleteProlicense(): Promise<void> {
        await this.actionButton.click();
        const deleteValue = await this.actionByEnum(ProlicenseActions.delete);
        if (deleteValue) {
            await deleteValue.click();
            await this.deleteButton.click();
        }
        await expect(this.notification(Notifications.prolicenseRemoved)).toBeVisible()
    }
    /**
     * Create criteria groups
     */
    public async createGrpCrit(): Promise<void> {
        const groupsCount: number = 2;
        for(let i = 0; i <groupsCount; i++) {
            await Elements.waitForVisible(this.addGrpCritButton);
            await this.addGrpCritButton.click();
            await Elements.waitForVisible(this.grpCrit);
            await this.grpCrit.click();
            await Elements.waitForVisible(this.grpCritList.first());
            await this.grpCritList.first().click();
            await this.experts.click();
            await Elements.waitForVisible(this.expertsList.first());
            const expertsCount = await this.expertsList.count();
            for (let i = 0; i<expertsCount; i++) {
                await this.expertsList.first().click();
            }
            await this.saveButton.click();
            await expect(this.createdGroups.nth(i)).toBeVisible();
        }
        await this.waitForVisibleAllGroups(groupsCount);
    }
    /**
     * Waiting for the visibility of all created criteria groups
     */
    private async waitForVisibleAllGroups(groups: number): Promise<void> {
        const currentGroups: number = await this.createdGroups.count();
        if(groups != currentGroups) await this.waitForVisibleAllGroups(groups);
    }
    /**
     * Fill in the criteria fields
     */
    private async fillCriteriaInfo(index: number, critType: string): Promise<void> {
        await this.plusButton.nth(index).click();
        await this.criteriaNumber.type(InputData.randomWord)
        await this.rankCriteria.click();
        await this.rankList.first().click();
        await this.criteriaName.type(InputData.randomWord)
        await this.description.type(InputData.randomWord)
        await this.criteriaType.click();
        await this.criteriaTypeList.filter({hasText : critType}).click();
        if (critType == CriteriaTypes.ofi || critType == CriteriaTypes.member) {
            await this.multipleCriteria.click();
            await this.minAmount.type(String(randomInt(1,10)));
        }
    }
    /**
     * Fill in the fields of criteria documents
     */
    private async fillCriteriaDocs(): Promise<void> {
        await this.addDocButton.click();
        await this.docName.last().type(InputData.randomWord);
        await this.docDescription.last().type(InputData.randomWord);
        await this.additionalDataType.last().click();
        await Elements.waitForVisible(this.additionalDataTypeList.last());
        const dataTypeCount: number = await this.additionalDataTypeList.count();
        const randomNumb: number = randomInt(0,dataTypeCount);
        await this.additionalDataTypeList.nth(randomNumb).click();
        if (this.checkDocType(randomNumb)) {
            await Input.uploadFiles(this.templates.last(),"all");
            await Elements.waitForVisible(this.docIcon.last());
            await Elements.waitForVisible(this.xlsxIcon.last());
        }
    }
    /**
     * Checking whether to add files to the selected criteria document type
     */
    private checkDocType(randomNumb: number): boolean {
        return (
            randomNumb != NonFilesDoctypes.participantsList &&
            randomNumb != NonFilesDoctypes.organization &&
            randomNumb != NonFilesDoctypes.ofi
        )
    }
    /**
     * Create criterias
     */
    public async createCriteria(): Promise<void> {
        const groupsCount = await this.createdGroups.count();
        const criteriaTypes: string[] = [`${CriteriaTypes.documents}`,`${CriteriaTypes.member}`,`${CriteriaTypes.ofi}`];
        const docCount = 2;
        let createdCriteriaCount: number = 0;
        for(let i = 0; i < groupsCount; i++) {
            for (const type of criteriaTypes) {
                await this.fillCriteriaInfo(i,type);
                for(let c = 0; c < docCount; c++) {
                    await this.fillCriteriaDocs()
                }
                await this.saveButton.click();
                await expect(this.createdCriteria.nth(createdCriteriaCount)).toBeVisible();
                createdCriteriaCount++;
            }
        }
        this.prolicenseName = await this.createdProlicName.innerText();
    }
    /**
     * waiting for the filtered record to be displayed
     */
    private async waitForColumnFilter(): Promise<void> {
        const rowCount: number = await this.tableRow.count();
        if(rowCount > 1) await this.waitForColumnFilter();
        return;
    }
    /**
     * Delete created prolicense from pre-prod database
     */
    public async deleteProdProlicense(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteLicense();
        await dbHelper.deleteProlicense();
        await dbHelper.closeConnect();
    }
}