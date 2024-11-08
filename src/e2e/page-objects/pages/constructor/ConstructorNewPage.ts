import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {Date} from "../../../framework/elements/Dates.js";
import {Input} from "../../../framework/elements/Input.js";
import {ProlicenseActions} from "../../helpers/enums/ProlicenseActions.js";
import {InputData} from "../../helpers/InputData.js";
import {ConstructorPage} from "./ConstructorPage.js";
import {Notifications} from "../../helpers/enums/Notifications.js";
import {ProlicStatus} from "../../helpers/enums/ProlicStatus.js";
import {ProlicType} from "../../helpers/types/ProlicType";
import {ScenarioType} from "../../helpers/types/ScenarioType";
import {ProlicTypes} from "../../helpers/enums/ProlicTypes.js";
import {MainMenuOptions} from "../../helpers/enums/MainMenuOptions.js";
import {randomInt} from "crypto";

export class ConstructorNewPage extends ConstructorPage {
    public prolicName: string = InputData.randomWord
    private readonly clonedProlicName: string = InputData.randomWord;
    protected readonly minCountValue: number = randomInt(1,5)
    constructor(page: Page) {
        super(page);
    }
    /**
     * Action call button for prolicense
     */
    private prolicenseActionButton: Locator = Elements.getElement(this.page,"//button[@name='proLic_btn_details']")
    /**
     * Button 'Select criteria'
     */
    private selectCriteriaButton: Locator = Elements.getElement(this.page,"//button[text()='Выбрать критерии']")
    /**
     * Action dropdown values
     */
    private prolicenseActionsList: Locator = Elements.getElement(this.page,"//a[contains(@class,'ListItem')]")
    /**
     * Field 'Minimum count'
     */
    private minimumCount: Locator = Elements.getElement(this.page,"//input[@name='minCount']")
    /**
     * Edit button for 'experts' tab
     */
    private expertEditButton: Locator = Elements.getElement(this.page,"//span[text()='Эксперты' or text()='Рабочая группа']//..//following-sibling::*//button")
    /**
     * Edit button for criteria with warning
     */
    private criteriaWarningEditButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'color-typo-warning')]//..//following-sibling::*//button")
    /**
     * Checkboxes for criteria groups
     */
    private criteriaGroupCheckbox: Locator = Elements.getElement(this.page,"//span[not(contains(@class,'checked'))]//input[@type='checkbox']")
    /**
     * Current displayed prolicense status
     */
    private prolicenseStatus(statusValue: string): Locator {
        return Elements.getElement(this.page,`//*[text()='${statusValue}']`);
    }
    /**
     * Table field with Added experts
     */
    private addedExpert(expertName: string): Locator {
        return Elements.getElement(this.page,`//td[contains(text(),'${expertName}')]`);
    }
    /**
     * Field value "Minimum count"
     */
    private minimumCountValue(addedCountValue: string): Locator {
        return Elements.getElement(this.page,`//*[text()='Минимальное количество:']//following-sibling::*[text()='${addedCountValue}']`);
    }
    /**
     * Value of the field "Version of the list of criteria and documents"
     */
    private ruleVersionValue(ruleVersionNumber: string): Locator {
        return Elements.getElement(this.page,`//*[text()='Версия списка критериев и документов:']//following-sibling::*//*[text()='${ruleVersionNumber}']`);
    }
    /**
     * Selected rule version value in the "Version number" field
     */
    private get selectedRuleVersion(): Locator {
        return Elements.getElement(this.page,`//input[@name='version' and @value='${this.createdRuleVersion}']`)
    }
    /**
     * Field with name of the created prolicense
     */
    public prolicNameField(prolicName: string): Locator {
        return Elements.getElement(this.page,`//*[text()='Название пролицензии:']//following-sibling::*[text()='${prolicName}']`)
    }
    /**
     * Fill in the fields of the block "General information"
     */
    private async fillBasicInfo(prolicType: ProlicType): Promise<void> {
        await this.prolicType.click();
        switch (prolicType) {
            case "lic": {
                await Elements.waitForVisible(this.prolicTypeValue(ProlicTypes.licensing));
                await this.prolicTypeValue(ProlicTypes.licensing).click();
                break;
            }
            case "fin": {
                await Elements.waitForVisible(this.prolicTypeValue(ProlicTypes.finControl));
                await this.prolicTypeValue(ProlicTypes.finControl).click();
                break;
            }
            case "cert": {
                await Elements.waitForVisible(this.prolicTypeValue(ProlicTypes.certification));
                await this.prolicTypeValue(ProlicTypes.certification).click();
                break;
            }
        }
        await this.name.fill(this.prolicName);
        await this.season.click();
        await this.seasonValues.last().click();
        await this.licType.click();
        (prolicType != "cert") ? await Elements.waitForVisible(this.rfsWomanLicType) : await Elements.waitForVisible(this.certificateFnlLicType);
        (prolicType != "cert") ? await this.rfsWomanLicType.click() : await this.certificateFnlLicType.click();
        const allDates = await this.dates.all();
        for (const date of allDates) {
            await Date.fillDateInput(date,InputData.currentDate);
        }
    }
    /**
     * Fill in the fields of the block "Documents for filing an application"
     */
    private async fillDocs(): Promise<void> {
        const docsCount: number = 2;
        for(let i = 1; i<=docsCount; i++) {
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
    public async createProlicense(prolicType: ProlicType): Promise<void> {
        await this.breadCrumbMain.click();
        await this.menuOptionByEnum(MainMenuOptions.constructor).click();
        await this.createProlicButton.click();
        await this.fillBasicInfo(prolicType);
        await this.fillDocs();
        await this.saveButton.click();
        await expect(this.prolicNameField(this.prolicName)).toBeVisible();
        this.prolicUrl = this.page.url();
    }
    /**
     * Add rule version for prolicense
     */
    public async addRuleVersionForProlicense(): Promise<void> {
        await this.selectCriteriaButton.click();
        await Elements.waitForVisible(this.selectedRuleVersion);
        await this.nextButton.click();
        while (await this.criteriaGroupCheckbox.first().isVisible()) {
            await this.criteriaGroupCheckbox.first().click();
        }
        await this.selectButton.click();
        await expect(this.ruleVersionValue(String(this.createdRuleVersion))).toBeVisible();
    }
    /**
     * Copy a prolicense
     */
    public async cloneProlicense(): Promise<void> {
        await this.prolicenseActionButton.click();
        await this.prolicenseActionsList.filter({hasText: ProlicenseActions.clone}).click();
        await this.name.fill(this.clonedProlicName);
        await this.saveButton.click();
        await expect(this.prolicNameField(this.clonedProlicName)).toBeVisible();
    }
    /**
     * Publication of a prolicense
     */
    public async publishProlicense(scenario: ScenarioType): Promise<void> {
        if(scenario == "prolic") {
            await this.page.goto(this.prolicUrl);
            await this.page.waitForLoadState("domcontentloaded");
        }
        await this.prolicenseActionButton.click();
        await this.prolicenseActionsList.filter({hasText: ProlicenseActions.publish}).click();
        await this.publishButton.click();
        if(scenario == "prolic") {
            await this.page.goto(this.prolicUrl);
            await this.page.waitForLoadState("domcontentloaded");
            await expect(this.prolicenseStatus(ProlicStatus.published)).toBeVisible();
        }
    }
    /**
     * Unpublish of a prolicense
     */
    public async unpublishProlicense(): Promise<void> {
        await this.prolicenseActionButton.click();
        await this.prolicenseActionsList.filter({hasText: ProlicenseActions.unpublish}).click();
        await this.unpublishButton.click();
        await expect(this.prolicenseStatus(ProlicStatus.onEditing)).toBeVisible();
    }
    /**
     * Remove a prolicense
     */
    public async deleteProlicense(): Promise<void> {
        await this.prolicenseActionButton.click();
        await this.prolicenseActionsList.filter({hasText: ProlicenseActions.delete}).click();
        await this.deleteButton.click();
        await expect(this.notification(Notifications.prolicenseRemoved)).toBeVisible()
    }
    /**
     * Create a rule for testing scenario with prolicense
     */
    public async createRuleForProlicense(): Promise<void> {
        await this.addRule();
        await this.addCriteriaGroups();
        await this.addCriterias();
        await this.publishRule();
    }
    /**
     * Add experts for criteria groups
     */
    public async addExpertsInProlicense(): Promise<void> {
        const criteriaGroupCount: number = await this.criteriaGroupName.count();
        for(let i=0; i<criteriaGroupCount; i++) {
            await this.criteriaGroupName.nth(i).click();
            await this.expertEditButton.nth(i).click();
            await this.experts.click();
            const expertName: string = await this.expertsValues.first().innerText();
            await this.expertsValues.first().click();
            await this.saveButton.click();
            await expect(this.addedExpert(expertName).nth(i)).toBeVisible();
        }
    }
    /**
     * adding a value to the 'Minimum count' field
     */
    public async addMinimumCount(): Promise<void> {
        const criteriaWithWarningCount: number = await this.criteriaWarningEditButton.count();
        for(let i=0; i<criteriaWithWarningCount; i++) {
            await this.criteriaWarningEditButton.first().click();
            try {
                await Elements.waitForVisible(this.minimumCount);
            }
            catch (error) {
                await this.criteriaWarningEditButton.first().click();
            }
            await this.minimumCount.fill(String(this.minCountValue));
            await this.saveButton.click();
            await expect(this.minimumCountValue(String(this.minCountValue))).toBeVisible();
        }
    }
}