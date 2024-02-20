import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {Date} from "../../../framework/elements/date.js";
import {InputData} from "../../helpers/input-data.js";
import {SearchModalPage} from "../search-modal.page.js";
import {randomInt} from "crypto";
import {MainMenuOptions} from "../../helpers/enums/main-menu-options.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {Columns} from "../../helpers/enums/columns.js";
import {ProlicType} from "../../helpers/types/prolic.type";
import {CommissionTypes} from "../../helpers/enums/CommissionTypes.js";

export class CommissionPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Create a commission"
     */
    private createMeetingButton: Locator = Elements.getElement(this.page,"//button[text()='Создать заседание']")
    /**
     * Button "Create"
     */
    private createButton: Locator = Elements.getElement(this.page,"//button[text()='Создать']")
    /**
     * Button "Next"
     */
    private nextButton: Locator = Elements.getElement(this.page,"//button[text()='Далее']")
    /**
     * Button "Approve"
     */
    private approveButton: Locator = Elements.getElement(this.page,"//button[text()='Утвердить']")
    /**
     * Button "Add requests"
     */
    private approvalSanctionButton: Locator = Elements.getElement(this.page,"//button[text()='Утверждение санкций']")
    /**
     * Field with the fine amount for editing
     */
    private fineAmountFieldEdition: Locator = Elements.getElement(this.page,"//input[@name='fine']")
    /**
     * Field 'Fine amount'
     */
    private fineAmount: Locator = Elements.getElement(this.page,"//td[contains(@class,'ant-table-selection-column')]//following-sibling::td[contains(@class,'RequestSanctions_fineWrapper')]")
    /**
     * Button "Add requests"
     */
    private addRequestsButton: Locator = Elements.getElement(this.page,"//button[text()='Добавить заявки']")
    /**
     * Button "Edit decision"
     */
    private editDecisionButton: Locator = Elements.getElement(this.page,"//*[contains(@class,'CommissionLicensesTab_endStateWrapper')]//button")
    /**
     * Field "Select a decision"
     */
    private selectDecision: Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__control')]")
    /**
     * Value of the drop-down list for selecting solutions for the application "license issued"
     */
    private licenseIssuedDecision: Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__option') and text()='Выдана']")
    /**
     * Value of the drop-down list for selecting solutions for the application "passed"
     */
    private passedDecision: Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__option') and text()='Пройден']")
    /**
     * Field "Commission name"
     */
    private commissionName: Locator = Elements.getElement(this.page,"//*[contains(@class,'Text_weight_semibold') and contains(text(),'Заседание')]")
    /**
     * Accepted decision in the table
     */
    protected acceptedDecision: Locator = Elements.getElement(this.page,"//td[7]//*[contains(@class,'Badge_view_filled')]")
    /**
     * Field 'Commission type'
     */
    private commissionType: Locator = Elements.getElement(this.page,"//*[contains(@class,'type__control')]")
    /**
     * Edit buttons for sanctions with fine
     */
    private sanctionFineEditButton: Locator = Elements.getElement(this.page,"//td[contains(@class,'RequestSanctions_fine') and text()!='-']//following-sibling::td//following-sibling::td//div//div[contains(@class,'RequestSanctions_editWrapper')]")
    /**
     * Selected drop down value of field 'Commission type'
     */
    private commissionTypeValue(selectedValue: CommissionTypes): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'type__option') and text()='${selectedValue}']`);
    }
    /**
     * Create a meeting
     */
    public async createMeeting(prolicType: ProlicType): Promise<void> {
        await this.createMeetingButton.click();
        await this.commissionType.click();
        switch (prolicType) {
            case "lic": {
                await Elements.waitForVisible(this.commissionTypeValue(CommissionTypes.licensing));
                await this.commissionTypeValue(CommissionTypes.licensing).click();
                break;
            }
            case "fin": {
                await Elements.waitForVisible(this.commissionTypeValue(CommissionTypes.finControl));
                await this.commissionTypeValue(CommissionTypes.finControl).click();
                break;
            }
            case "cert": {
                await Elements.waitForVisible(this.commissionTypeValue(CommissionTypes.certification));
                await this.commissionTypeValue(CommissionTypes.certification).click();
                break;
            }
        }
        await Date.fillDateInput(this.dates,InputData.currentDate);
        await this.name.type(InputData.randomWord);
        await this.createButton.click();
        await expect(this.commissionName).toBeVisible();
    }
    /**
     * Add requests to a meeting
     */
    public async addRequestToMeeting(): Promise<void> {
        await this.addRequestsButton.click();
        const searchModal = new SearchModalPage(this.page);
        await Elements.waitForHidden(searchModal.loadIndicator);
        await this.filterByColumn(this.filterButtonByEnum(Columns.licName).last());
        await this.checkbox.first().check();
        await searchModal.selectButton.click();
        await Elements.waitForVisible(this.tableRow.first());
    }
    /**
     * Add decision on requests
     */
    public async addRequestDecision(prolicType: ProlicType): Promise<void> {
        await Elements.waitForVisible(this.editDecisionButton.first());
        const requestCount: number = await this.editDecisionButton.count();
        for(let i = 0; i < requestCount; i++) {
            await this.editDecisionButton.nth(i).click();
            await this.selectDecision.click();
            if(prolicType == "fin") {
                await Elements.waitForVisible(this.passedDecision);
                await this.passedDecision.click();
            }
            else {
                await Elements.waitForVisible(this.licenseIssuedDecision);
                await this.licenseIssuedDecision.click();
            }
            await this.comment.type(InputData.randomWord);
            await this.approvalSanctionButton.click();
            await this.editFineAmount();
            await this.approveButton.click();
            await this.saveButton.click();
            await expect(this.acceptedDecision.nth(i)).toBeVisible();
        }
    }
    /**
     * Set status "Wait for a commission solution" for licenses
     */
    public async changeLicensesStatus(): Promise<void> {
        const dbHelper = new DbHelper();
        const waitForCommissionStatusId: number = 4;
        await this.menuOptionByEnum(MainMenuOptions.workWithRequest).click();
        await Elements.waitForVisible(this.numberLicenseColumn.first());
        let licIds: string[] | number[] = await this.numberLicenseColumn.allTextContents();
        licIds = licIds.map(licId => Number(licId));
        for(const licId of licIds) {
            await dbHelper.updateLicenseStatus(licId,waitForCommissionStatusId);
        }
        await dbHelper.closeConnect();
        await this.page.goBack();
    }
    /**
     * Edit fine amount
     */
    private async editFineAmount(): Promise<void> {
        const sanctionWithFineCount: number = await this.sanctionFineEditButton.count();
        if(sanctionWithFineCount == 0) return;
        else {
            (sanctionWithFineCount == 1) ? await this.sanctionFineEditButton.click() : await this.sanctionFineEditButton.first().click();
            await Elements.waitForVisible(this.fineAmountFieldEdition);
            const currentFineAmount: string | null = await this.fineAmountFieldEdition.getAttribute("value");
            if(!currentFineAmount) return;
            else {
                const randomFine: string = String(randomInt(1,+currentFineAmount));
                await this.fineAmountFieldEdition.fill(randomFine);
                await this.nextButton.click();
                const actualFine: string = (sanctionWithFineCount == 1) ?
                    await this.fineAmount.innerText().then(result => result.split(" ").join("")) :
                    await this.fineAmount.first().innerText().then(result => result.split(" ").join(""));
                expect(actualFine).toBe(randomFine);
            }
        }
    }
}