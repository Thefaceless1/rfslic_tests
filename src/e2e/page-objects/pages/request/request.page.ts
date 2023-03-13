import {RequestNewPage} from "./request-new.page.js";
import {Locator, Page} from "@playwright/test";
import {RequestSections} from "../../helpers/enums/RequestSections.js";
import {Elements} from "../../../framework/elements/elements.js";
import {SearchModalPage} from "../search-modal.page.js";
import {InputData} from "../../helpers/input-data.js";
import {randomInt} from "crypto";
import {Pages} from "../../helpers/enums/pages.js";
import {LicStatus} from "../../helpers/enums/licstatus.js";
import {Columns} from "../../helpers/enums/columns.js";
import {CriteriaTypes} from "../../helpers/enums/criteriatypes.js";
import {DocStatus} from "../../helpers/enums/docstatus.js";

export class RequestPage extends RequestNewPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Tabs with criteria groups
     */
    private criteriaGroups : Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]");
    /**
     * Criteria information field
     */
    private criteriaInfo : Locator = Elements.getElement(this.page,"//span[contains(@class,'CriteriasInfoItem_collapse_title')]");
    /**
     * Member criteria information field
     */
    private memberCriteriaInfo : Locator = Elements.getElement(this.page,"//*[text()='ФИО Участника:']");
    /**
     * OFI criteria information field
     */
    private ofiCriteriaInfo : Locator = Elements.getElement(this.page,"//*[text()='Наименование ОФИ:']");
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
    private selectedStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__single-value') or contains(@class,'docState__placeholder')]");
    /**
     * Expert comment
     */
    private reviewComment : Locator = Elements.getElement(this.page,"//textarea[@name='reviewComment']");
    /**
     * Field "License decision"
     */
    private selectLicStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'requestState__control')]");
    /**
     * Field "Conclusion"
     */
    private conclusion : Locator = Elements.getElement(this.page,"//textarea[@name='conclusion']");
    /**
     * Field "Recommendation"
     */
    private recommendation : Locator = Elements.getElement(this.page,"//textarea[@name='recommendation']");
    /**
     * Field "RPS criterias"
     */
    private rplCriterias : Locator = Elements.getElement(this.page,"//textarea[@name='rplCriterias']");
    /**
     * Button "Create a report"
     */
    private createReport : Locator = Elements.getElement(this.page,"//button[text()='Сформировать отчет эксперта']");
    /**
     * Button "Edit license status"
     */
    private licEditButton : Locator = Elements.getElement(this.page,"//span[contains(@class,'iconEditReqStatus')]");
    /**
     * "Criteria type" field value
     */
    private critTypeValue : Locator = Elements.getElement(this.page,"//*[text()='Тип критерия:']//following-sibling::*");
    /**
     * Field "Club worker comment"
     */
    private clubWorkerComment : Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo') and contains(@class,'hyphens')]");
    /**
     * Button "submit a document for review"
     */
    private submitReviewButton : Locator = Elements.getElement(this.page,"//span[contains(@class,'IconSendMessage')]");
    /**
     * Button "Edit OFI"
     */
    private editOfiButton : Locator = Elements.getElement(this.page,"//button[@name='editButtonOfi']");
    /**
     * Document tooltip
     */
    private docTooltip : Locator = Elements.getElement(this.page,"//span[contains(@class,'IconInfo')]");
    /**
     * Button "Edit Member"
     */
    private editMemberButton : Locator = Elements.getElement(this.page,"//button[@name='editButtonMember']");
    /**
     * Get a cell with the name of the prolicense in the table by the name of the prolicense
     */
    private licenseRow(prolicName : string) : Locator {
        return Elements.getElement(this.page,`//td[text()='${prolicName}']`);
    }
    /**
     * Get the drop-down list value of the 'License decision' field by enum
     */
    private licStatusByEnum(statusValue : LicStatus ) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'requestState__option') and text()='${statusValue}']`);
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
                await this.fillExperts();
            }
        }
    }
    /**
     * Add experts to a criteria group
     */
    private async fillExperts() : Promise<void> {
        await this.experts.click();
        await Elements.waitForVisible(this.expertsList.first());
        await this.expertsList.first().click();
        await this.saveButton.click();
        await this.closeNotifications("last");
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
        await searchModal.radio.first().click();
        await searchModal.selectButton.click();
        await this.saveButton.click();
        await this.closeNotifications("last");
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Add ofi and participants to criterias and fill criteria documents
     */
    public async addCritInfo () : Promise<void> {
        const groupsCount = await this.criteriaGroups.count();
        for(let i = groupsCount-1; i >= 0; i--) {
            await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.criteriaInfo.first())
            const criteriaCount : number = await this.criteriaInfo.count();
            let currMaxDocNumb : number = await this.checkButton.count()/criteriaCount;
            const step : number = currMaxDocNumb;
            let currDocNumb : number = 0;
            for (let x = 0; x < criteriaCount; x++) {
                await this.criteriaInfo.nth(x).click();
                await Elements.waitForVisible(this.critTypeValue.nth(x));
                const critTypeName : string = await this.critTypeValue.nth(x).innerText();
                switch (critTypeName) {
                    case CriteriaTypes.documents : {
                        await this.sendForVerification(currDocNumb,currMaxDocNumb);
                        currDocNumb+=step;
                        currMaxDocNumb+=step;
                        break;
                    }
                    default : {
                        (critTypeName == CriteriaTypes.member) ? await this.editMemberButton.click() : await this.editOfiButton.click();
                        await this.fillSearchModalData();
                        await this.sendForVerification(currDocNumb,currMaxDocNumb);
                        currDocNumb+=step;
                        currMaxDocNumb+=step;
                    }
                }
            }
        }
        await this.editLicStatus(LicStatus.checkExpert);
    }
    /**
     * Edit license status by enum
     */
    private async editLicStatus(statusValue: LicStatus) : Promise<void> {
        await this.licEditButton.click();
        await this.selectLicStatus.click();
        await Elements.waitForVisible(this.licStatusByEnum(statusValue));
        await this.licStatusByEnum(statusValue).click();
        await this.saveButton.click()
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
            await this.checkButton.nth(i).click();
            await this.closeNotifications("last");
            await this.waitForDisplayStatus(i);
        }
    }
    /**
     * Add comments and statuses for documents
     */
    public async addExpertInfo() : Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        let docsCount : number = await this.checkButton.count();
        await this.fillStatusAndComment(docsCount);
        await this.fillGeneralInfo();
        await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount : number = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount;i++) {
            await this.criteriaGroups.nth(i).click();
            const criteriaCount : number = await this.criteriaInfo.count();
            for(let c = 0; c < criteriaCount; c++) {
                await this.criteriaInfo.nth(c).click();
                const criteriaType : string = await this.critTypeValue.nth(c).innerText();
                if(criteriaType == CriteriaTypes.member) await this.memberCriteriaInfo.click();
                else if(criteriaType == CriteriaTypes.ofi) await this.ofiCriteriaInfo.click();
            }
            docsCount = await this.checkButton.count();
            await this.fillStatusAndComment(docsCount);
            await this.fillExpertSolution();
        }
    }
    /**
     * Fill the fields "Conclusion of the RFS manager", "Recommendations on sanctions", "RPL criterias"
     */
    private async fillGeneralInfo() : Promise<void> {
        await this.conclusion.type(InputData.randomWord);
        await this.recommendation.type(InputData.randomWord);
        await this.rplCriterias.type(InputData.randomWord);
        await this.saveButton.click();
    }
    /**
     * Waiting for a status update near the document name in accordance with the selected status
     */
    private async waitForDisplayStatus (statusNumb : number) : Promise<void> {
        const selectedStatusText : string = await this.selectedStatus.nth(statusNumb).innerText();
        const nearDocStatusText : string = await this.statusNearDoc.nth(statusNumb).innerText();
        if ((selectedStatusText == DocStatus.selectSolution && nearDocStatusText.toLowerCase() != DocStatus.underReview.toLowerCase()) ||
            (selectedStatusText.toLowerCase() != nearDocStatusText.toLowerCase() && selectedStatusText != DocStatus.selectSolution)) {
            await this.waitForDisplayStatus(statusNumb);
        }
    }
    /**
     * Add an expert report
     */
    private async fillExpertSolution() : Promise<void> {
        await this.recommendation.type(InputData.randomWord);
        await this.createReport.click();
        await Elements.waitForVisible(this.createReport);
    }
    /**
     * Send documents for verification
     */
    private async sendForVerification(currDocNumb : number,currMaxDocNumb : number) : Promise<void> {
        for(let c = currDocNumb;c < currMaxDocNumb; c++) {
            await this.docTooltip.nth(c).click();
            await this.plusButton.nth(c).click();
            await Elements.waitForVisible(this.cancelButton);
            await this.fillDocsAndComment();
            await this.checkCommentValue(c);
            await this.submitReviewButton.nth(c).click();
            await this.closeNotifications("last");
            await this.waitForDisplayStatus(c);
        }
    }
    /**
     * Check entered comment value
     */
    private async checkCommentValue(commentNumber : number) : Promise<void> {
        const currentComment : string = await this.clubWorkerComment.nth(commentNumber).innerText();
        if(currentComment == "-") await this.checkCommentValue(commentNumber);
    }
}