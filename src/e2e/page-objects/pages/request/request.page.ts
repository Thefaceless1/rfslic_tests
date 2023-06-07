import {expect} from "@playwright/test";
import {Locator, Page} from "@playwright/test";
import {RequestSections} from "../../helpers/enums/request-sections.js";
import {Elements} from "../../../framework/elements/elements.js";
import {SearchModalPage} from "../search-modal.page.js";
import {InputData} from "../../helpers/input-data.js";
import {randomInt} from "crypto";
import {LicStatus} from "../../helpers/enums/licstatus.js";
import {CriteriaTypes} from "../../helpers/enums/criteriatypes.js";
import {DocStatus} from "../../helpers/enums/docstatus.js";
import {ConstructorNewPage} from "../constructor/constructor-new.page.js";
import {Input} from "../../../framework/elements/input.js";
import {Notifications} from "../../helpers/enums/notifications.js";
import {Pages} from "../../helpers/enums/pages.js";
import {CommissionPage} from "../commissions/commission.page.js";
import * as Process from "process";

export class RequestPage extends CommissionPage {
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
    private statusNearDoc : Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo')]//*[contains(@class,'Badge_view')]");
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
     * Button "->" in the left corner of the table
     */
    private arrow  : Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]");

    /**
     * Button "Go to request"
     */
    private goToRequest : Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']");
    /**
     * Button "Publish a request"
     */
    private publishReqButton : Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']");
    /**
     * Field "Select a club"
     */
    private selectClub : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__control')]");
    /**
     * Values of the drop-down list of the field "Select a club"
     */
    private selectClubList : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__option')]");
    /**
     * License title
     */
    private licTitle : Locator = Elements.getElement(this.page,"//*[text()='Заявка на лицензирование клуба']");
    /**
     * Name of the expert report file
     */
    private expertReportFile : Locator = Elements.getElement(this.page,"//span[contains(text(),'Отчет эксперта')]");
    /**
     * Currently displayed license status
     */
    private currentLicStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'requestStateBadgeWrapper')]//*[contains(@class,'Badge_view_filled')]");
    /**
     * File attached to the document
     */
    private attachedFile : Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo_file_wrapper')][1]");
    /**
     * Title of the modal window "Change ticket status"
     */
    private changeLicStatusTitle : Locator = Elements.getElement(this.page,"//*[contains(@class,'ChangeRequestStatusModal_modal_titleWrapper')]");
    /**
     * Get the drop-down list value of the 'License decision' field by enum
     */
    private selectLicStatusByEnum(statusValue : LicStatus ) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'requestState__option') and text()='${statusValue}']`);
    }
    /**
     * Get license status by enum
     */
    private licStatusByEnum(statusValue : LicStatus ) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'Badge_status_normal') and text()='${statusValue}']`);
    }
    /**
     * Get tabs by enum
     */
    private sectionByEnum(section : RequestSections) : Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Fill in experts and club workers for criteria groups
     */
    public async addExperts() : Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState();
        await Elements.waitForVisible(this.sectionByEnum(RequestSections.criterias));
        await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount; i++) {
            if(i != 0) await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.editButton.last());
            const editCount = (Process.env.BRANCH == "prod") ? 1 : await this.editButton.count();
            for(let c = 0;c<editCount; c++) {
                await this.editButton.nth(c).click();
                await this.fillExperts();
                await expect(this.tableRow.nth(c)).toBeVisible();
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
    public async addDocInfo () : Promise<void> {
        const groupsCount = await this.criteriaGroups.count();
        for(let i = groupsCount-1; i >= 0; i--) {
            await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.criteriaInfo.first())
            const criteriaCount : number = await this.criteriaInfo.count();
            for(let m = 0; m < criteriaCount;m++) {
                await this.criteriaInfo.nth(m).click();
                await Elements.waitForVisible(this.critTypeValue.nth(m));
            }
            let currMaxDocNumb : number = await this.submitReviewButton.count()/criteriaCount;
            const step : number = currMaxDocNumb;
            let currDocNumb : number = 0;
            for (let x = 0; x < criteriaCount; x++) {
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
        await this.addGeneralDocInfo();
    }
    /**
     * Fill criteria documents in general info
     */
    private async addGeneralDocInfo() : Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await Elements.waitForVisible(this.plusButton.last());
        const docsCount : number = await this.plusButton.count();
        await this.sendForVerification(0,docsCount);
    }
    /**
     * Edit license status by enum
     */
    public async editLicStatus(statusValue: LicStatus) : Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState();
        await this.licEditButton.click();
        await this.selectLicStatus.click();
        await Elements.waitForVisible(this.selectLicStatusByEnum(statusValue));
        await this.selectLicStatusByEnum(statusValue).click();
        await this.saveButton.last().click();
        await Elements.waitForHidden(this.changeLicStatusTitle);
        const licStatusValue : string = await this.currentLicStatus.innerText();
        await expect(licStatusValue.toLowerCase()).toBe(LicStatus.waitForCommission.toLowerCase());
    }
    /**
     * Fill in the fields "Comment" and "Decision on the document"
     */
    private async fillStatusAndComment (docsCount : number,reason : "generalInfo" | "criterias") : Promise<void> {
        let currentIndex : number = 0;
        for (let i = 0; i < docsCount; i++) {
            await this.reviewComment.nth(i).type(InputData.randomWord);
            await this.docStates.nth(i).click();
            await Elements.waitForVisible(this.docStatesList.last());
            const randomStateNumb = randomInt(0,await this.docStatesList.count());
            const selectedState : string = await this.docStatesList.nth(randomStateNumb).innerText();
            await this.docStatesList.nth(randomStateNumb).click();
            (reason == "generalInfo") ?
                await this.checkButton.nth(currentIndex).click() :
                await this.checkButton.nth(i).click();
            await this.closeNotifications("last");
            await this.waitForDisplayStatus(i);
            if(selectedState == DocStatus.notAccepted) currentIndex++;
        }
    }
    /**
     * Add comments and statuses for documents
     */
    public async addExpertInfo() : Promise<void> {
        let docsCount : number = await this.checkButton.count();
        await this.fillStatusAndComment(docsCount,"generalInfo");
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
            await this.fillStatusAndComment(docsCount,"criterias");
            await this.fillExpertSolution();
            await expect(this.expertReportFile).toBeVisible();
        }
        const licStatusValue : string = await this.currentLicStatus.innerText();
        await expect(licStatusValue.toLowerCase()).toBe(LicStatus.readyForReport.toLowerCase());
    }
    /**
     * Fill the fields "Conclusion of the RFS manager", "Recommendations on sanctions", "RPL criterias"
     */
    public async addConclusions() : Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await Elements.waitForVisible(this.conclusion);
        await this.conclusion.type(InputData.randomWord);
        await this.recommendation.type(InputData.randomWord);
        await this.rplCriterias.type(InputData.randomWord);
        await this.saveButton.click();
        await Elements.waitForVisible(this.saveButton);
        const conclusionText : string | null = await this.conclusion.textContent();
        const recommendationText : string | null = await this.recommendation.textContent();
        const rplCriteriasText : string | null = await this.rplCriterias.textContent();
        await expect(conclusionText && recommendationText && rplCriteriasText).not.toBeNull();
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
            await this.plusButton.first().click();
            await Elements.waitForVisible(this.addButton);
            await this.fillDocsAndComment();
            await this.checkCommentValue(c);
            await expect(this.attachedFile.nth(c)).toBeVisible();
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
    /**
     * Select a club from the dropdown list of values
     */
    public async chooseClub() : Promise<void> {
        await Elements.waitForVisible(this.selectClub);
        await this.selectClub.click();
        await Elements.waitForVisible(this.selectClubList.first());
        await this.selectClubList.first().click();
    }
    /**
     * Create a prolicense with filled criteria groups and criterias
     */
    public async createTestProlicense() : Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.openConstructor();
        await constructor.createProlicense();
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        this.prolicenseName = await constructor.createdProlicName.innerText();
        await constructor.publishProlicense("lic");
        await Elements.waitForVisible(constructor.createProlicButton);
    }
    /**
     * Create a request in the status "Draft"
     */
    public async createDraft() : Promise<void> {
        await this.arrow.click();
        await this.goToRequest.click();
        await expect(this.licTitle).toBeVisible();
    }
    /**
     * Publish a license
     */
    public async publishLic(): Promise<void> {
        await Elements.waitForVisible(this.publishReqButton);
        await this.publishReqButton.click();
        await expect(this.notification(Notifications.requestAdded)).toBeVisible();
    }
    /**
     * Add files and comments for license documents
     */
    protected async fillDocsAndComment() : Promise<void> {
        await Input.uploadFiles(this.templates.first(),"all");
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.comment.type(InputData.randomWord);
        try {
            await this.addButton.click();
        }
        catch (err) {
            await this.addButton.click();
        }
        await this.closeNotifications("last");
    }
    /**
     * Add commission decision for created license
     */
    public async addCommissionDecision() : Promise<void> {
        await this.page.goto(Pages.commissionPage);
        await this.createMeeting();
        await this.addRequestsToMeeting();
        await this.addRequestDecision();
    }
}