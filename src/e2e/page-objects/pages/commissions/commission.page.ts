import {MainPage} from "../main.page.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/elements.js";
import {Date} from "../../../framework/elements/date.js";
import {InputData} from "../../helpers/input-data.js";
import {SearchModalPage} from "../search-modal.page.js";
import {randomInt} from "crypto";
import {LicStatus} from "../../helpers/enums/licstatus.js";
import {Input} from "../../../framework/elements/input.js";
import {MainMenuOptions} from "../../helpers/enums/main-menu-options.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {FileReader} from "../../helpers/file-reader.js";
import {Columns} from "../../helpers/enums/columns.js";
import {ProlicType} from "../../helpers/types/prolic.type";

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
     * Get the drop-down list values of the 'Select a decision' field
     */
    private selectDecisionList: Locator = Elements.getElement(this.page,"//*[contains(@class,'newLicState__option')]")
    /**
     * Button "Materials"
     */
    private materialsButton: Locator = Elements.getElement(this.page,"//button[text()='Материалы']")
    /**
     * Field "Report type"
     */
    private reportType: Locator = Elements.getElement(this.page,"//*[contains(@class,'reportType__control')]")
    /**
     * Get the drop-down list values of the 'Report type' field
     */
    private reportTypeList: Locator = Elements.getElement(this.page,"//*[contains(@class,'reportType__option')]")
    /**
     * Field "Commission name"
     */
    private commissionName: Locator = Elements.getElement(this.page,"//*[contains(@class,'Text_weight_semibold') and contains(text(),'Заседание')]")
    /**
     * Field "Requests"
     */
    private requests: Locator = Elements.getElement(this.page,"//*[contains(@class,'requests__control')]")
    /**
     * Get the drop-down list values of the 'Requests' field
     */
    private requestsList: Locator = Elements.getElement(this.page,"//*[contains(@class,'requests__option')]")
    /**
     * Button "Form"
     */
    private formButton: Locator = Elements.getElement(this.page,"//button[text()='Сформировать']")
    /**
     * Accepted decision in the table
     */
    private acceptedDecision: Locator = Elements.getElement(this.page,"//td[7]//*[contains(@class,'Badge_view_filled')]")
    /**
     * Report name
     */
    private report: Locator = Elements.getElement(this.page,"//span[contains(text(),'Отчет по')]")
    /**
     * Protocol name
     */
    private protocol(fileName: string): Locator {
        return Elements.getElement(this.page,`//span[text()='${fileName}']`);
    }
    /**
     * Create a meeting
     */
    public async createMeeting(prolicType: ProlicType): Promise<void> {
        await this.createMeetingButton.click();
        await this.licType.click();
        await Elements.waitForVisible(this.licenseTypes.first());
        (prolicType == "lic") ? await this.licenseTypes.first().click() : await this.licenseTypes.last().click();
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
    public async addRequestDecision(): Promise<void> {
        await Elements.waitForVisible(this.editDecisionButton.first());
        const requestCount: number = await this.editDecisionButton.count();
        for(let i = 0; i < requestCount; i++) {
            await this.editDecisionButton.nth(i).click();
            await this.selectDecision.click();
            await Elements.waitForVisible(this.selectDecisionList.first());
            const decisionCount: number = await this.selectDecisionList.count();
            const randomNumb: number = randomInt(0,decisionCount);
            const selectedDecisionName: string = await this.selectDecisionList.nth(randomNumb).innerText();
            await this.selectDecisionList.nth(randomNumb).click();
            if(selectedDecisionName == LicStatus.issuedWithConditions || selectedDecisionName == LicStatus.returnForRevision) {
                await Date.fillDateInput(this.dates,InputData.futureDate);
            }
            await this.comment.type(InputData.randomWord);
            await this.saveButton.click();
            if(selectedDecisionName == LicStatus.returnForRevision) {
                await this.checkbox.first().click();
                await this.saveButton.last().click();
            }
            await expect(this.acceptedDecision.nth(i)).toBeVisible();
        }
    }
    /**
     * Add protocol and report for commission
     */
    public async addReport(): Promise<void> {
        await this.materialsButton.click();
        const plusButtonCount: number = await this.plusButton.count();
        const fileName: string = FileReader.getTestFiles[0].match(/\w+\.\w+/g)![0];
        for(let i = 0; i < plusButtonCount; i++) {
            await this.plusButton.nth(i).click();
            if(i == 0) {
                await this.reportType.click();
                await Elements.waitForVisible(this.reportTypeList.first());
                await this.reportTypeList.first().click();
                await this.licType.click();
                await Elements.waitForVisible(this.licenseTypes.first());
                await this.licenseTypes.last().click();
                await this.requests.click()
                await Elements.waitForVisible(this.requestsList.first());
                const requestCount: number = await this.requestsList.count();
                for(let c = 0; c<requestCount; c++) {
                    await this.requestsList.first().click()
                }
                await this.formButton.click();
            }
            else {
                await Input.uploadFiles(this.templates,"one");
                await Elements.waitForVisible(this.docIcon);
                await this.saveButton.click();
            }
            (i == 0) ? await expect(this.report).toBeVisible() : await expect(this.protocol(fileName)).toBeVisible();
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
}