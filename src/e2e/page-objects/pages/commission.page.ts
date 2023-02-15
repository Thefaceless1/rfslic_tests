import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {Date} from "../../framework/elements/date.js";
import {InputData} from "../helpers/input-data.js";
import {SearchModalPage} from "./search-modal.page.js";

export class CommissionPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Button "Create a commission"
     */
    private createCommissionButton : Locator = Elements.getElement(this.page,"//button[text()='Создать заседание']");
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
     * Create a commission
     */
    public async createCommission() : Promise<void> {
        await this.createCommissionButton.click();
        await this.licType.click();
        await Elements.waitForVisible(this.licenseTypes.first());
        await this.licenseTypes.first().click();
        await Date.fillDateInput(this.dates,InputData.currentDate);
        await this.name.type(InputData.randomWord);
        await this.createButton.click();
    }
    /**
     * Add requests to a commission
     */
    public async addRequestsToCommission() : Promise<void> {
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

    }
}