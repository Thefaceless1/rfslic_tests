import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";
import {RuleActions} from "../../helpers/enums/RuleActions.js";
import {RuleStates} from "../../helpers/enums/RuleStates.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {CriteriaType} from "../../helpers/enums/CriteriaType.js";
import {Input} from "../../../framework/elements/Input.js";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";
import {Notifications} from "../../helpers/enums/Notifications.js";

export class RulesClassifierPage extends MainPage {
    public createdRuleVersion: number = 0
    constructor(page: Page) {
        super(page);
    }
    /**
     * Field 'Rule name'
     */
    private ruleNameField: Locator = Elements.getElement(this.page,"//input[@name='name']")
    /**
     * 'Season' field value
     */
    private seasonValue: Locator = Elements.getElement(this.page,"//*[contains(@class,'season__single-value')]")
    /**
     * Action call button for rules
     */
    private  actionButton: Locator = Elements.getElement(this.page,"//button[@name='ruleVersion_btn_details']")
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
     * Field "Multiple criteria"
     */
    private multipleCriteria: Locator = Elements.getElement(this.page,"//input[@name='isMulti']")
    /**
     * Field "Additional data type"
     */
    private additionalDataType: Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__control')]")
    /**
     * Values of the drop-down list of the field "Additional data type"
     */
    private additionalDataTypeValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'additionalDocType__option')]")
    /**
     * Publish date field
     */
    private publishDate: Locator = Elements.getElement(this.page,"//*[text()='Дата публикации:']//following-sibling::*")
    /**
     * Values of the drop-down list of the field "Criteria type"
     */
    private criteriaTypeValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__option')]")
    /**
     * 'Document name' table cell
     */
    private documentNameTableCell: Locator = Elements.getElement(this.page,"//td[contains(@class,'RuleVersionCriteriaView-module_infoWrapperCell')]//following-sibling::td[1]")
    /**
     * Button "Add" (+)
     */
    protected addCriteria: Locator = Elements.getElement(this.page,"//button[contains(@class,'Button_view_secondary')][.//span[contains(@class,'IconAdd')]]")
    /**
     * Field with criteria name, rank and description
     */
    private criteriaInfo: Locator = Elements.getElement(this.page,"//div[@class='Collapse-LabelText']//span[contains(text(),'автотест')]")
    /**
     * Values of the drop-down list of the field "Criteria group name"
     */
    private criteriaGroupValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'groupName__option') or contains(@class,'group__option')]")
    /**
     * Field "Criteria group name"
     */
    private criteriaGroups = Elements.getElement(this.page,"//*[contains(@class,'groupName__indicators') or contains(@class,'group__indicators')]")
    /**
     * Action dropdown values
     */
    private actionsList(ruleAction: RuleActions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'ListItem') and text()='${ruleAction}']`);
    }
    /**
     * Rule displayed state
     */
    private displayedRuleState(ruleState: RuleStates): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'Badge_status') and text()='${ruleState}']`);
    }
    /**
     * Rule version column value
     */
    private ruleVersionColumnValue(): Locator {
        return Elements.getElement(this.page,`//td[text()='${this.createdRuleVersion}']`);
    }
    /**
     * Rule version field
     */
    private ruleVersion(versionNumber?: number): Locator {
        return (versionNumber) ?
            Elements.getElement(this.page,`//*[text()='Версия:']//following-sibling::*[text()='${versionNumber}']`) :
            Elements.getElement(this.page,"//*[text()='Версия:']//following-sibling::*");
    }
    /**
     * Add a rule
     */
    public async addRule(): Promise<void> {
        await this.adminMenuByEnum(AdminOptions.rulesClassifier).click();
        await this.addButton.click();
        await this.ruleNameField.fill(InputData.randomWord);
        await Elements.waitForVisible(this.seasonValue);
        await this.saveButton.click();
        await expect(this.ruleVersion()).toBeVisible();
        this.createdRuleVersion = +await this.ruleVersion().innerText();
    }
    /**
     * Edit a rule
     */
    public async editRule(): Promise<void> {
        await this.editButton.click();
        await this.ruleNameField.fill(InputData.randomWord);
        await this.season.click();
        await this.seasonValues.first().click();
        await this.saveButton.click();
        await expect(this.notification(Notifications.ruleSaved)).toBeVisible();
    }
    /**
     * Publish a rule
     */
    public async publishRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.publish).click();
        await this.publishButton.click();
        await expect(this.displayedRuleState(RuleStates.published)).toBeVisible();
        expect(await this.publishDate.innerText()).not.toBe("-");
    }
    /**
     * Unpublish a rule
     */
    public async unpublishRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.unpublish).click();
        await this.unpublishButton.click();
        await expect(this.displayedRuleState(RuleStates.inEditing)).toBeVisible();
        expect(await this.publishDate.innerText()).toBe("-");
    }
    /**
     * Create a version of the rules based on the sample
     */
    public async cloneRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.clone).click();
        await this.ruleNameField.fill(InputData.randomWord);
        await Elements.waitForVisible(this.seasonValue);
        await this.createButton.click();
        await Elements.waitForHidden(this.ruleVersion(this.createdRuleVersion));
        const clonedRuleVersion: number = +await this.ruleVersion().innerText();
        expect(clonedRuleVersion).toBe(this.createdRuleVersion + 1);
    }
    /**
     * Delete a rule
     */
    public async deleteRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.delete).click();
        await this.deleteButton.click();
        await expect(this.ruleVersionColumnValue()).not.toBeVisible();
    }
    /**
     * Delete rules from database
     */
    public async deleteRules(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteRules();
        await dbHelper.closeConnect();
    }
    /**
     * Add criteria groups to a rule
     */
    public async addCriteriaGroups(): Promise<void> {
        const totalGroupCount: number = 1;
        for(let i = 0; i < totalGroupCount; i++) {
            await Elements.waitForVisible(this.addCriteriaGroupButton);
            await this.addCriteriaGroupButton.click();
            await Elements.waitForVisible(this.criteriaGroups);
            await this.criteriaGroups.click();
            await Elements.waitForVisible(this.criteriaGroupValues.first());
            await this.criteriaGroupValues.first().click();
            await this.saveButton.click();
        }
        await expect(this.criteriaGroupName.nth(totalGroupCount - 1)).toBeVisible();
    }
    /**
     * Add criterias
     */
    public async addCriterias(): Promise<void> {
        const groupsCount: number = await this.criteriaGroupName.count();
        const criteriaTypes: string[] = Object.values(CriteriaType);
        const docsCountForCriteria: number = 2;
        const totalDocsCount: number = groupsCount * criteriaTypes.length * docsCountForCriteria - 1;
        const totalCriteriaCount: number = groupsCount * criteriaTypes.length - 1;
        for(let i = 0; i < groupsCount; i++) {
            for (const type of criteriaTypes) {
                const currentCriteriaIndex: number = criteriaTypes.indexOf(type);
                await this.fillCriteriaInfo(i,type,currentCriteriaIndex);
                for(let c = 0; c < docsCountForCriteria; c++) {
                    await this.fillCriteriaDocs(c)
                }
                await this.saveButton.click();
                try {
                    await Elements.waitForHidden(this.saveButton)
                }
                catch (error) {
                    await this.saveButton.click();
                }
            }
        }
        await expect(this.criteriaInfo.nth(totalCriteriaCount)).toBeVisible();
        await expect(this.documentNameTableCell.nth(totalDocsCount)).toBeVisible();
    }
    /**
     * Fill in the criteria fields
     */
    private async fillCriteriaInfo(index: number, critType: string, criteriaIndex: number): Promise<void> {
        await this.addCriteria.nth(index).click();
        try {
            await this.criteriaNumber.fill(String(criteriaIndex+1));
        }
        catch (error) {
            await this.addCriteria.nth(index).click();
            await this.criteriaNumber.fill(String(criteriaIndex+1))
        }
        await this.rankCriteria.click();
        await this.rankList.first().click();
        await this.criteriaName.fill(InputData.testName("criteria",critType));
        await this.description.type(InputData.randomWord);
        await this.criteriaType.click();
        await this.criteriaTypeValues.filter({hasText: critType}).click();
        if (critType == CriteriaType.ofi || critType == CriteriaType.member) {
            await this.multipleCriteria.click();
        }
    }
    /**
     * Fill in the fields of criteria documents
     */
    private async fillCriteriaDocs(docNumber: number): Promise<void> {
        await this.addDocButton.click();
        await this.docName.last().type(InputData.testName("document",String(docNumber+1)));
        await this.docDescription.last().type(InputData.randomWord);
        await this.additionalDataType.last().click();
        await this.additionalDataTypeValues.click();
        await Input.uploadFiles(this.templates.last(),"all");
        await Elements.waitForVisible(this.docIcon.last());
        await Elements.waitForVisible(this.xlsxIcon.last());
    }
}