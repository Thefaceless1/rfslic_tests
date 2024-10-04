import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {Date} from "../../../framework/elements/Dates.js";
import {InputData} from "../../helpers/InputData.js";
import {SearchModalPage} from "../SearchModalPage.js";
import {randomInt} from "crypto";
import {TableColumn} from "../../helpers/enums/TableColumn.js";
import {ProlicType} from "../../helpers/types/ProlicType.js";
import {CommissionTypes} from "../../helpers/enums/CommissionTypes.js";
import {LicStates} from "../../helpers/enums/LicStates.js";
import {ConstructorNewPage} from "../constructor/ConstructorNewPage.js";

export class CommissionPage extends ConstructorNewPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Create a commission"
     */
    private createMeetingButton: Locator = Elements.getElement(this.page,"//button[text()='Создать заседание']")
    /**
     * Button "Approve"
     */
    private approveButton: Locator = Elements.getElement(this.page,"//button[text()='Утвердить']")
    /**
     * Button "Add requests"
     */
    private approvalSanctionButton: Locator = Elements.getElement(this.page,"//button[text()='Утверждение санкций']")
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
    private editDecisionButton: Locator = Elements.getElement(this.page,"//*[contains(@class,'CommissionLicensesTab-module_endStateWrapper')]//button")
    /**
     * Field "Select a decision"
     */
    private selectDecision: Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__control')]")
    /**
     * Field "Commission name"
     */
    private commissionName: Locator = Elements.getElement(this.page,"//*[contains(@class,'Text_weight_semibold') and contains(text(),'Заседание')]")
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
     * Get accepted decision locator in the table by name
     */
    protected acceptedDecisionByName(name: LicStates): Locator {
        return Elements.getElement(this.page,`//td[7]//*[contains(@class,'Badge_view_filled') and text()='${name}']`)
    }
    /**
     * Get value of the drop-down list for selecting solutions for the application by name
     */
    private decisionByName(name: LicStates): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'newLicState__option') and text()='${name}']`)
    }
    /**
     * Create a meeting
     */
    public async createMeeting(prolicType: ProlicType,isChangeRequest: boolean): Promise<void> {
        await this.createMeetingButton.click();
        await this.commissionType.click();
        if(isChangeRequest) {
            await Elements.waitForVisible(this.commissionTypeValue(CommissionTypes.change));
            await this.commissionTypeValue(CommissionTypes.change).click();
        }
        else {
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
                }
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
        await this.filterByColumn(this.filterButtonByEnum(TableColumn.licName).last(),this.prolicName);
        await this.checkbox.first().check();
        await searchModal.selectButton.click();
        await Elements.waitForVisible(this.tableRow.first());
    }
    /**
     * Add decision on requests
     */
    public async addRequestDecision(prolicType: ProlicType, isChangeRequest: boolean): Promise<void> {
        await this.editDecisionButton.click();
        await this.selectDecision.click();
        if(prolicType == "fin") await this.decisionByName(LicStates.passed).click();
        else if(isChangeRequest) await this.decisionByName(LicStates.accepted).click();
        else await this.decisionByName(LicStates.issued).click();
        await this.comment.type(InputData.randomWord);
        await this.approvalSanctionButton.click();
        await this.editFineAmount();
        await this.approveButton.click();
        await this.saveButton.click();
        if(prolicType == "fin") await expect(this.acceptedDecisionByName(LicStates.passed)).toBeVisible();
        else if(isChangeRequest) await expect(this.acceptedDecisionByName(LicStates.accepted)).toBeVisible();
        else await expect(this.acceptedDecisionByName(LicStates.issued)).toBeVisible();
        if(prolicType == "cert")
            (isChangeRequest) ?
            await this.acceptedDecisionByName(LicStates.accepted).click({clickCount: 2}) :
            await this.acceptedDecisionByName(LicStates.issued).click({clickCount: 2});
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