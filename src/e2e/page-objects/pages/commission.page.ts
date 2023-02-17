import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Date} from "../../framework/elements/date.js";
import {InputData} from "../helpers/input-data.js";
import {SearchModalPage} from "./search-modal.page.js";
import {randomInt} from "crypto";
import {LicStatus} from "../helpers/enums/licstatus.js";

export class CommissionPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Button "Create a commission"
     */
    private createMeetingButton : Locator = Elements.getElement(this.page,"//button[text()='Создать заседание']");
    /**
     * Button "Create"
     */
    private createButton : Locator = Elements.getElement(this.page,"//button[text()='Создать']");
    /**
     * Button "Add requests"
     */
    private addRequestsButton : Locator = Elements.getElement(this.page,"//button[text()='Добавить заявки']");
    /**
     * Button "Edit decision"
     */
    private editDecisionButton : Locator = Elements.getElement(this.page,"//*[contains(@class,'CommissionLicensesTab_endStateWrapper')]//button");
    /**
     * Field "Select a decision"
     */
    private selectDecision : Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__control')]");
    /**
     * Get the drop-down list value of the 'Select a decision' field
     */
    private selectDecisionList : Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__option')]");
    /**
     * Button "Delete meeting"
     */
    private deleteMeeting : Locator = Elements.getElement(this.page,"//button[text()='Удалить заседание']");
    /**
     * Create a meeting
     */
    public async createMeeting() : Promise<void> {
        await this.createMeetingButton.click();
        await this.licType.click();
        await Elements.waitForVisible(this.licenseTypes.first());
        await this.licenseTypes.first().click();
        await Date.fillDateInput(this.dates,InputData.currentDate);
        await this.name.type(InputData.randomWord);
        await this.createButton.click();
    }
    /**
     * Add requests to a meeting
     */
    public async addRequestsToMeeting() : Promise<void> {
        await this.addRequestsButton.click();
        const searchModal = new SearchModalPage(this.page);
        await Elements.waitForHidden(searchModal.loadIndicator);
        await this.checkbox.first().check();
        await searchModal.selectButton.click();
    }
    /**
     * add decision on requests
     */
    public async addRequestDecision() : Promise<void> {
        await Elements.waitForVisible(this.editDecisionButton.first());
        const requestCount : number = await this.editDecisionButton.count();
        for(let i = 0; i < requestCount; i++) {
            await this.editDecisionButton.nth(i).click();
            await this.selectDecision.click();
            await Elements.waitForVisible(this.selectDecisionList.first());
            const decisionCount : number = await this.selectDecisionList.count();
            const randomNumb : number = randomInt(0,decisionCount);
            const selectedDecisionName : string = await this.selectDecisionList.nth(randomNumb).innerText();
            await this.selectDecisionList.nth(randomNumb).click();
            if(selectedDecisionName == LicStatus.issuedWithConditions) {
                await Date.fillDateInput(this.dates,InputData.futureDate);
            }
            await this.comment.type(InputData.randomWord);
            await this.saveButton.click();
        }
    }
}