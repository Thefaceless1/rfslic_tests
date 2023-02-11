import {RequestNewPage} from "./request-new.page.js";
import {Locator, Page} from "@playwright/test";
import {RequestSections} from "../helpers/enums/RequestSections.js";
import {Elements} from "../../framework/elements/elements.js";
import {SearchModalPage} from "./search-modal.page.js";
import {InputData} from "../helpers/input-data.js";
import {randomInt} from "crypto";
import {Pages} from "../helpers/enums/pages.js";
import {LicStatus} from "../helpers/enums/licstatus.js";
import {Columns} from "../helpers/enums/columns.js";

export class RequestPage extends RequestNewPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Tabs with criteria groups
     */
    private criteriaGroups : Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]");
    /**
     * List of selected club workers or OFI or organizations
     */
    private selectedData : Locator = Elements.getElement(this.page,"//*[contains(@class,'multi-value__label')]");
    /**
     * Criteria information field
     */
    private criteriaInfo : Locator = Elements.getElement(this.page,"//span[contains(@class,'CriteriasInfoItem_collapse_title')]");
    /**
     * Document status confirmation button
     */
    private checkButton : Locator = Elements.getElement(this.page,"//button[.//span[contains(@class,'IconCheck')]]");
    /**
     * Document status selection field
     */
    private docStates : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__control')]");
    /**
     * Drop-down list values in the "Document Decision" field
     */
    private docStatesList : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__option')]");
    /**
     * Selected status near the document name
     */
    private statusNearDoc : Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo')]//*[contains(@class,'Badge_view_filled')]");
    /**
     * Selected status in the "Document Decision" field
     */
    private selectedStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__single-value')]");
    /**
     * Expert comment
     */
    private reviewComment : Locator = Elements.getElement(this.page,"//textarea[@name='reviewComment']");
    /**
     * Field "License decision"
     */
    private selectLicStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'requestState__control')]");
    /**
     * Button "Confirm"
     */
    private submitButton : Locator = Elements.getElement(this.page,"//button[text()='Подтвердить']");
    /**
     * Field "Conclusion"
     */
    private conclusion : Locator = Elements.getElement(this.page,"//textarea[@name='conclusion']");
    /**
     * Field "Recommendation"
     */
    private recommendation : Locator = Elements.getElement(this.page,"//textarea[@name='recommendation']");
    /**
     * Button "Create a report"
     */
    private createReport : Locator = Elements.getElement(this.page,"//button[text()='Сформировать отчет эксперта']");
    /**
     * Get the drop-down list value of the 'License decision' field by enum
     */
    private licStatusByEnum(statusValue : LicStatus ) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'requestState__option') and text()='${statusValue}']`);
    }
    /**
     * Get a cell with the name of the prolicense in the table by the name of the prolicense
     */
    private licenseRow(prolicName : string) : Locator {
        return Elements.getElement(this.page,`//td[text()='${prolicName}']`);
    }
    /**
     * Get tabs by enum
     */
    private sectionByEnum(section : RequestSections) : Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Open published license
     */
    public async openPublishedLic() : Promise<void> {
        await this.goto(Pages.requestPage);
        await this.filterByColumn(this.filterButtonByEnum(Columns.licName));
        await this.licenseRow(this.prolicenseName).click();
    }
    /**
     * Fill in experts and club workers for criteria groups
     */
    public async addExperts() : Promise<void> {
        await this.sectionByEnum(RequestSections.criterias).click();
        await Elements.waitForVisible(this.criteriaGroups.last());
        const groupsCount = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount; i++) {
            if(i != 0) await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.editButton.last());
            const editCount = await this.editButton.count();
            for(let c = 0;c<editCount; c++) {
                await this.editButton.nth(c).click();
                if(c == 0) {
                    await this.fillExperts();
                }
                else {
                    await this.fillSearchModalData();
                }
            }
        }
    }
    /**
     * Add experts to a criteria group
     */
    private async fillExperts() : Promise<void> {
        await this.experts.click();
        await Elements.waitForVisible(this.expertsList.last());
        await this.expertsList.first().click();
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Add data from the modal search window for club workers, organizations, ofi
     */
    private async fillSearchModalData () : Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.searchDataButton.click();
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator);
        await this.checkbox.last().check();
        await searchModal.selectButton.click();
        await Elements.waitForVisible(this.selectedData);
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Add criteria documents
     */
    public async addCritDocs () : Promise<void> {
        const groupsCount = await this.criteriaGroups.count();
        for(let i = groupsCount-1; i>=0; i--) {
            await this.criteriaGroups.nth(i).click();
            await this.criteriaInfo.click();
            await Elements.waitForVisible(this.checkButton.last());
            const docsCount : number = await this.checkButton.count();
            for(let c = 0;c<docsCount; c++) {
                await this.plusButton.nth(c).click();
                await Elements.waitForVisible(this.cancelButton);
                if(await this.searchDataButton.isVisible()) {
                    await this.fillSearchModalData();
                }
                else {
                    await this.fillDocsAndComment();
                }
            }
        }
    }
    /**
     * Fill in the fields "Comment" and "Decision on the document"
     */
    private async fillStatusAndComment (iterationCount : number) : Promise<void> {
        for (let i = 0; i <iterationCount; i++) {
            await this.reviewComment.nth(i).type(InputData.randomWord);
            await this.docStates.nth(i).click();
            await Elements.waitForVisible(this.docStatesList.last());
            const randomStateNumb = randomInt(0,await this.docStatesList.count());
            await this.docStatesList.nth(randomStateNumb).click();
            await this.checkButton.nth(i).click()
            await this.waitForDisplayStatus(i);
        }
    }
    /**
     * Add comments and put down statuses to documents
     */
    public async addExpertInfo () : Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        let docsCount : number = await this.checkButton.count();
        await this.fillStatusAndComment(docsCount);
        await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount : number = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount;i++) {
            await this.criteriaGroups.nth(i).click();
            await this.criteriaInfo.click();
            await Elements.waitForVisible(this.checkButton.last());
            docsCount = await this.checkButton.count();
            await this.fillStatusAndComment(docsCount);
            await this.fillExpertSolution();
        }
    }
    /**
     * Waiting for a status update near the document name in accordance with the selected status
     */
    private async waitForDisplayStatus (statusNumb : number) : Promise<void> {
        const selectedStatusText : string = await this.selectedStatus.nth(statusNumb).innerText();
        const nearDocStatusText : string = await this.statusNearDoc.nth(statusNumb).innerText();
        if (selectedStatusText.toLowerCase() != nearDocStatusText.toLowerCase()) await this.waitForDisplayStatus(statusNumb);
    }
    /**
     * Make a decision on the request
     */
    public async chooseLicStatus () : Promise<void> {
        await this.sectionByEnum(RequestSections.commissions).click()
        await this.selectLicStatus.click();
        await Elements.waitForVisible(this.licStatusByEnum(LicStatus.issued));
        await this.licStatusByEnum(LicStatus.issued).click();
        await this.submitButton.click();
    }
    /**
     * Add an expert report
     */
    private async fillExpertSolution() : Promise<void> {
        await this.conclusion.type(InputData.randomWord);
        await this.recommendation.type(InputData.randomWord);
        await this.createReport.click();
        await Elements.waitForVisible(this.createReport);
    }
}