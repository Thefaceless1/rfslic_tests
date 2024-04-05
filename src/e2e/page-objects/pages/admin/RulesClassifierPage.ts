import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";
import {RuleActions} from "../../helpers/enums/RuleActions.js";
import {RuleStates} from "../../helpers/enums/RuleStates.js";
import {DbHelper} from "../../../../db/db-helper.js";

export class RulesClassifierPage extends MainPage {
    private ruleName: string = InputData.randomWord
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
     * Action dropdown values
     */
    private actionsList(ruleAction: RuleActions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'ListItem') and text()='${ruleAction}']`);
    }
    /**
     * Rule displayed name
     */
    private get displayedRuleName(): Locator {
        return Elements.getElement(this.page,`//*[text()='Название Правил:']//following-sibling::*[text()='${this.ruleName}']`);
    }
    /**
     * Name of the rule in the rule list table
     */
    private get ruleNameInTable(): Locator {
        return Elements.getElement(this.page,`//td[text()='${this.ruleName}']`);
    }
    /**
     * Rule displayed state
     */
    private displayedRuleState(ruleState: RuleStates): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'Badge_status') and text()='${ruleState}']`);
    }
    /**
     * Add a rule
     */
    public async addRule(): Promise<void> {
        await this.addButton.click();
        await this.ruleNameField.fill(this.ruleName);
        await Elements.waitForVisible(this.seasonValue);
        await this.saveButton.click();
        await expect(this.displayedRuleName).toBeVisible();
    }
    /**
     * Edit a rule
     */
    public async editRule(): Promise<void> {
        this.ruleName = InputData.randomWord;
        await this.editButton.click();
        await this.ruleNameField.fill(this.ruleName);
        await this.season.click();
        await this.seasons.first().click();
        await this.saveButton.click();
        await expect(this.displayedRuleName).toBeVisible();
    }
    /**
     * Publish a rule
     */
    public async publishRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.publish).click();
        await this.publishButton.click();
        await expect(this.displayedRuleState(RuleStates.published)).toBeVisible();
    }
    /**
     * Unpublish a rule
     */
    public async unpublishRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.unpublish).click();
        await this.unpublishButton.click();
        await expect(this.displayedRuleState(RuleStates.inEditing)).toBeVisible();
    }
    /**
     * Create a version of the rules based on the sample
     */
    public async cloneRule(): Promise<void> {
        this.ruleName = InputData.randomWord;
        await this.actionButton.click();
        await this.actionsList(RuleActions.clone).click();
        await this.ruleNameField.fill(this.ruleName);
        await Elements.waitForVisible(this.seasonValue);
        await this.createButton.click();
        await expect(this.displayedRuleName).toBeVisible();
    }
    /**
     * Delete a rule
     */
    public async deleteRule(): Promise<void> {
        await this.actionButton.click();
        await this.actionsList(RuleActions.delete).click();
        await this.deleteButton.click();
        await expect(this.ruleNameInTable).not.toBeVisible();
    }
    /**
     * Delete rules from database
     */
    public async deleteRulesFromDatabase(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteRules();
        await dbHelper.closeConnect();
    }
}