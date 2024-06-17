import {expect, Locator, Page} from "@playwright/test";
import {RequestSections} from "../../helpers/enums/RequestSections.js";
import {Elements} from "../../../framework/elements/Elements.js";
import {SearchModalPage} from "../SearchModalPage.js";
import {InputData} from "../../helpers/InputData.js";
import {randomInt} from "crypto";
import {LicStates} from "../../helpers/enums/LicStates.js";
import {CriteriaType} from "../../helpers/enums/CriteriaType.js";
import {DocStatus} from "../../helpers/enums/DocStatus.js";
import {ConstructorNewPage} from "../constructor/ConstructorNewPage.js";
import {Input} from "../../../framework/elements/Input.js";
import {Notifications} from "../../helpers/enums/Notifications.js";
import {Pages} from "../../helpers/enums/Pages.js";
import {CommissionPage} from "../commissions/CommissionPage.js";
import * as Process from "process";
import {ProlicType} from "../../helpers/types/prolic.type.js";
import {Date} from "../../../framework/elements/Dates.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {TableColumn} from "../../helpers/enums/TableColumn.js";
import {SubmitRequestOptions} from "../../helpers/enums/SubmitRequestOptions.js";

export class RequestPage extends CommissionPage {
    private manualSanctionCount: number = 3
    constructor(page : Page) {
        super(page);
    }
    /**
     * Tabs with criteria groups
     */
    private criteriaGroups: Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]")
    /**
     * Criteria information field
     */
    private criteriaInfo: Locator = Elements.getElement(this.page,"//span[contains(@class,'CriteriasInfoItem-module_collapse_title')]")
    /**
     * Member criteria information field
     */
    private memberCriteriaInfo: Locator = Elements.getElement(this.page,"//*[text()='ФИО Участника:']")
    /**
     * OFI criteria information field
     */
    private ofiCriteriaInfo: Locator = Elements.getElement(this.page,"//*[text()='Наименование ОФИ:']")
    /**
     * Document status confirmation button
     */
    private checkButton: Locator = Elements.getElement(this.page,"//button[.//span[contains(@class,'IconCheck')]]")
    /**
     * Document status selection field
     */
    private docStates: Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__control')]")
    /**
     * Drop-down list values in the "Document Decision" field
     */
    private docStatesList: Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__option')]")
    /**
     * Selected status near the document name
     */
    private statusNearDoc: Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo')]//*[contains(@class,'Badge_view')]")
    /**
     * Selected status in the "Document Decision" field
     */
    private selectedStatus: Locator = Elements.getElement(this.page,"//*[contains(@class,'docState__single-value') or contains(@class,'docState__placeholder')]")
    /**
     * Expert comment
     */
    private reviewComment: Locator = Elements.getElement(this.page,"//textarea[@name='reviewComment']")
    /**
     * Field "License decision"
     */
    private selectLicStatus : Locator = Elements.getElement(this.page,"//*[contains(@class,'requestState__control')]")
    /**
     * Field "Conclusion"
     */
    private conclusion: Locator = Elements.getElement(this.page,"//textarea[@name='conclusion']")
    /**
     * Field "Recommendation"
     */
    private recommendation: Locator = Elements.getElement(this.page,"//textarea[@name='recommendation']")
    /**
     * Field "RPS criterias"
     */
    private rplCriterias: Locator = Elements.getElement(this.page,"//textarea[@name='rplCriterias']")
    /**
     * Button "Create an expert report"
     */
    private createExpertReport: Locator = Elements.getElement(this.page,"//button[text()='Сформировать отчет эксперта']")
    /**
     * Button "Create a working group member report"
     */
    private createWorkingGrpMemberReport: Locator = Elements.getElement(this.page,"//button[text()='Сформировать отчет члена рабочей группы']")
    /**
     * Button "Edit license status"
     */
    private licEditButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'iconEditReqStatus')]")
    /**
     * "Criteria type" field value
     */
    private critTypeValue: Locator = Elements.getElement(this.page,"//*[text()='Тип критерия:']//following-sibling::*")
    /**
     * Field "Club worker comment"
     */
    private clubWorkerComment: Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo') and contains(@class,'hyphens')]")
    /**
     * Button "submit a document for review"
     */
    private submitReviewButton: Locator = Elements.getElement(this.page,"//span[contains(@class,'IconSendMessage')]")
    /**
     * Button "Edit OFI"
     */
    private editOfiButton: Locator = Elements.getElement(this.page,"//button[@name='editButtonOfi']")
    /**
     * Button "Perform"
     */
    private performButton: Locator = Elements.getElement(this.page,"//button[text()='Подтвердить']")
    /**
     * Document tooltip
     */
    private docTooltip: Locator = Elements.getElement(this.page,"//span[contains(@class,'DocumentInfo-module')]")
    /**
     * Button "Edit Member"
     */
    private editMemberButton: Locator = Elements.getElement(this.page,"//button[@name='editButtonMember']")
    /**
     * Button "->" in the left corner of the table
     */
    private arrow: Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]")

    /**
     * Button "Go to request"
     */
    private goToRequest: Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']")
    /**
     * Button "Publish a request"
     */
    private submitRequestButton: Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']")
    /**
     * Field "Select a club"
     */
    private selectClub: Locator = Elements.getElement(this.page,"//*[contains(@class,'club__control')]")
    /**
     * Values of the drop-down list of the field "Select a club"
     */
    private selectClubList: Locator = Elements.getElement(this.page,"//*[contains(@class,'club__option')]")
    /**
     * Request license title
     */
    private requestLicTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на лицензирование клуба']")
    /**
     * Request finance control title
     */
    private requestFinTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на финансовый контроль']")
    /**
     * Request certification title
     */
    private requestCertificationTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на аттестацию клуба']")
    /**
     * Name of an expert report file
     */
    private expertReportFile: Locator = Elements.getElement(this.page,"//span[contains(text(),'Отчет эксперта')]")
    /**
     * Value of deadline for submission of documents
     */
    private submissionDocDateValue: Locator = Elements.getElement(this.page,"//*[contains(text(),'Срок подачи документов по графику:')]//following-sibling::*")
    /**
     * Value of deadline for review of documents
     */
    private reviewDocDateValue: Locator = Elements.getElement(this.page,"//*[contains(text(),'Последний день приема документов:')]//following-sibling::*")
    /**
     * Name of a working group member report file
     */
    private workingMemberReportFile: Locator = Elements.getElement(this.page,"//span[contains(text(),'Отчет члена рабочей группы')]")
    /**
     * Currently displayed license status
     */
    private currentLicStatus: Locator = Elements.getElement(this.page,"//*[contains(@class,'requestStateBadgeWrapper')]//*[contains(@class,'Badge_view_filled')]")
    /**
     * File attached to the document
     */
    private attachedFile: Locator = Elements.getElement(this.page,"//*[contains(@class,'DocumentInfo-module_file_wrapper')][1]")
    /**
     * Button "Add" (+)
     */
    protected addDocument: Locator = Elements.getElement(this.page,"//button[@data-tooltip-content='Прикрепить документ']")
    /**
     * Title of the modal window "Change ticket status"
     */
    private changeLicStatusTitle: Locator = Elements.getElement(this.page,"//*[contains(@class,'ChangeRequestStatusModal-module_modal_titleWrapper')]")
    /**
     * Field 'number of appointed experts'
     */
    private appointedExpertsCount: Locator = Elements.getElement(this.page,"//span[contains(@class,'NExpertsSpan')]")
    /**
     * Criteria status value
     */
    private criteriaStatus: Locator = Elements.getElement(this.page,"//div[contains(@class,'CriteriasInfoItem_badgeWrapper')]")
    /**
     * Title 'Specify groups for revision'
     */
    private specifyGroupForRevision: Locator = Elements.getElement(this.page,"//*[text()='Укажите группы для доработки']")
    /**
     * Field 'Select violation'
     */
    private selectViolation: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__dropdown-indicator')]")
    /**
     * 'Select violation' field dropdown values
     */
    private violationValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__option')]")
    /**
     * Violation name
     */
    private violationName: Locator = Elements.getElement(this.page,"//td[contains(@class,'RequestSanctions-module_violationName')]")
    /**
     * Message 'Obligatory field'
     */
    private obligatoryField: Locator = Elements.getElement(this.page,"//*[text()='Обязательное поле']")
    /**
     * Field 'Type of sanction'
     */
    private sanctionType: Locator = Elements.getElement(this.page,"//*[contains(@class,'sanction__control') and not(contains(@class,'disabled'))]")
    /**
     * 'Type of sanction' field dropdown values
     */
    private sanctionValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'sanction__option')]")
    /**
     * Field 'Submit request options'
     */
    private submitRequestOptions: Locator = Elements.getElement(this.page,"//*[contains(@class,'usePrevSeasons__indicators')]")
    /**
     * Icon 'Delete sanction'
     */
    private deleteSanctionIcon: Locator = Elements.getElement(this.page,"//*[contains(@class,'RequestSanctions-module_deleteWrapper')]")
    /**
     * 'Save sanction' button
     */
    private saveSanctionButton: Locator = Elements.getElement(this.page,"//*[contains(@class,'RequestSanctions')]//button[text()='Сохранить']")
    /**
     * Field value "Number of documents sent for verification"
     */
    private verificationDocsCount: Locator = Elements.getElement(this.page,"(//*[contains(@class,'numChecksWrapper')]//*)[1]")
    /**
     * Field for editing the number of documents sent for verification
     */
    private verificationDocsCountEditField: Locator = Elements.getElement(this.page,"//input[@name='maxCheck']")
    /**
     * Get the drop-down list value of the 'License decision' field by enum
     */
    private selectLicStatusByEnum(statusValue: LicStates ): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'requestState__option') and text()='${statusValue}']`);
    }
    /**
     * Get tabs by enum
     */
    private sectionByEnum(section: RequestSections): Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Dropdown values in the field 'Submit request options'
     */
    private submitRequestOptionsValues(optionName: SubmitRequestOptions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'usePrevSeasons__option') and text()='${optionName}']`);
    }
    /**
     * Expert Report Sanction
     */
    private async expertReportSanction(): Promise<Locator> {
        return Elements.getElement(this.page,`//td[contains(@class,'RequestSanctions-module_violationName') and text()='${await this.returnRfuViolationName()}']`);
    }
    /**
     * Fill in experts and club workers for criteria groups
     */
    public async addExperts(): Promise<void> {
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
            const regExp: RegExp = /\d/;
            const appointedExpertCount = await this.appointedExpertsCount.innerText().then(value => value.match(regExp));
            const filledExpertsCount = i + 1;
            if(appointedExpertCount) expect(+appointedExpertCount[0]).toBe(filledExpertsCount);
        }
    }
    /**
     * Add experts to a criteria group
     */
    private async fillExperts(): Promise<void> {
        await this.experts.click();
        await Elements.waitForVisible(this.expertsValues.first());
        await this.expertsValues.first().click();
        await this.saveButton.click();
        await this.closeNotifications("last");
        await Elements.waitForHidden(this.saveButton);
    }
    /**
     * Add data from the modal search window for club workers, organizations, ofi
     */
    private async fillSearchModalData(): Promise<void> {
        const searchModal = new SearchModalPage(this.page);
        await this.searchDataButton.click();
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator);
        await searchModal.radio.first().click();
        await searchModal.selectButton.click();
        await this.saveButton.click();
        await this.closeNotifications("last");
        try {
            await Elements.waitForHidden(this.saveButton);
        }
        catch (err) {
            await this.saveButton.click();
            await Elements.waitForHidden(this.saveButton);
        }
    }
    /**
     * Add ofi and participants to criterias and fill criteria documents
     */
    public async addDocInfo(): Promise<void> {
        const groupsCount = await this.criteriaGroups.count();
        for(let i = groupsCount-1; i >= 0; i--) {
            await this.criteriaGroups.nth(i).click();
            await Elements.waitForVisible(this.criteriaInfo.first())
            const criteriaCount: number = await this.criteriaInfo.count();
            for(let m = 0; m < criteriaCount;m++) {
                await this.criteriaInfo.nth(m).click();
                await Elements.waitForVisible(this.critTypeValue.nth(m));
            }
            let currMaxDocNumb: number = await this.submitReviewButton.count()/criteriaCount;
            const step: number = currMaxDocNumb;
            let currDocNumb: number = 0;
            for (let x = 0; x < criteriaCount; x++) {
                const critTypeName : string = await this.critTypeValue.nth(x).innerText();
                switch (critTypeName) {
                    case CriteriaType.documents : {
                        await this.sendForVerification(currDocNumb,currMaxDocNumb);
                        currDocNumb+=step;
                        currMaxDocNumb+=step;
                        break;
                    }
                    default : {
                        (critTypeName == CriteriaType.member) ? await this.editMemberButton.click() : await this.editOfiButton.click();
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
    private async addGeneralDocInfo(): Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await Elements.waitForVisible(this.addDocument.last());
        const docsCount : number = await this.addDocument.count();
        await this.sendForVerification(0,docsCount);
    }
    /**
     * Edit license status by enum
     */
    public async editLicStatus(statusValue: LicStates): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState();
        await this.licEditButton.click();
        await this.selectLicStatus.click();
        await Elements.waitForVisible(this.selectLicStatusByEnum(statusValue));
        await this.selectLicStatusByEnum(statusValue).click();
        await this.saveButton.last().click();
        if(statusValue == LicStates.inWork) {
            await Elements.waitForVisible(this.specifyGroupForRevision);
            await this.checkbox.nth(1).click();
            await Elements.waitForVisible(this.dates.first());
            await this.saveButton.last().click();
        }
        await Elements.waitForHidden(this.changeLicStatusTitle);
        if(statusValue == LicStates.waitForCommission) {
            const licStatusValue: string = await this.currentLicStatus.innerText();
            expect(licStatusValue.toLowerCase()).toBe(LicStates.waitForCommission.toLowerCase());
        }
    }
    /**
     * Fill in the fields "Comment" and "Decision on the document"
     */
    private async fillStatusAndComment(docsCount: number,reason: "generalInfo" | "criterias"): Promise<void> {
        let currentIndex: number = 0;
        for (let i = 0; i < docsCount; i++) {
            await this.reviewComment.nth(i).type(InputData.randomWord);
            await this.docStates.nth(i).click();
            await Elements.waitForVisible(this.docStatesList.last());
            const randomStateNumb = randomInt(0,await this.docStatesList.count());
            const selectedState: string = await this.docStatesList.nth(randomStateNumb).innerText();
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
    public async addExpertInfo(prolicType: ProlicType): Promise<void> {
        let docsCount: number = await this.checkButton.count();
        await this.fillStatusAndComment(docsCount,"generalInfo");
        await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount: number = await this.criteriaGroups.count();
        for(let i = 0; i<groupsCount; i++) {
            await this.criteriaGroups.nth(i).click();
            const criteriaCount: number = await this.criteriaInfo.count();
            for(let c = 0; c<criteriaCount; c++) {
                await this.criteriaInfo.nth(c).click();
                const criteriaType : string = await this.critTypeValue.nth(c).innerText();
                if(criteriaType == CriteriaType.member) await this.memberCriteriaInfo.click();
                else if(criteriaType == CriteriaType.ofi) await this.ofiCriteriaInfo.click();
            }
            docsCount = await this.checkButton.count();
            await this.fillStatusAndComment(docsCount,"criterias");
            await this.checkCriteriaStates(docsCount,criteriaCount);
            await this.fillExpertSolution(prolicType);
            (prolicType == "lic" || prolicType == "cert") ?
                await expect(this.expertReportFile).toBeVisible() :
                await expect(this.workingMemberReportFile).toBeVisible();
        }
        const licStatusValue: string = await this.currentLicStatus.innerText();
        expect(licStatusValue.toLowerCase()).toBe(LicStates.readyForReport.toLowerCase());
    }
    /**
     * Checking criteria statuses based on child documents
     */
    private async checkCriteriaStates(docsCount: number, criteriaCount: number): Promise<void> {
        const criteriaStatuses: string[] = await this.criteriaStatus.allInnerTexts();
        const docsStatuses: string[] = await this.docStates.allInnerTexts();
        const docsCountPerCriteria: number = docsCount/criteriaCount;
        let startIndexForDocsArray: number = 0;
        criteriaStatuses.forEach(criteriaStatus => {
            const docsArrayForCurrentCriteria: string[] = docsStatuses.slice(startIndexForDocsArray, docsCountPerCriteria + startIndexForDocsArray);
            if(docsArrayForCurrentCriteria.includes(DocStatus.form)) {
                expect(criteriaStatus.toLowerCase()).toBe(DocStatus.form.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.notAccepted)) {
                expect(criteriaStatus.toLowerCase()).toBe(DocStatus.notAccepted.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.underReview)) {
                expect(criteriaStatus.toLowerCase()).toBe(DocStatus.underReview.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.acceptedWithCondition)) {
                expect(criteriaStatus.toLowerCase()).toBe(DocStatus.acceptedWithCondition.toLowerCase());
            }
            else {
                expect(criteriaStatus.toLowerCase()).toBe(DocStatus.accepted.toLowerCase());
            }
            startIndexForDocsArray += docsCountPerCriteria;
        })
    }
    /**
     * Fill the fields "Conclusion of the RFS manager", "Recommendations on sanctions", "RPL criterias"
     */
    public async addConclusions(prolicType: ProlicType): Promise<void> {
        if(prolicType != "lic") await this.sectionByEnum(RequestSections.generalInfo).click();
        await Elements.waitForVisible(this.conclusion);
        await this.conclusion.type(InputData.randomWord);
        if(prolicType == "lic" || prolicType == "cert") await this.rplCriterias.type(InputData.randomWord);
        await this.saveButton.click();
        await Elements.waitForVisible(this.saveButton);
        const conclusionText: string | null = await this.conclusion.textContent();
        if(prolicType == "lic" || prolicType == "cert") {
            const rplCriteriasText: string | null = await this.rplCriterias.textContent();
            expect(conclusionText && rplCriteriasText).not.toBeNull();
        }
        else expect(conclusionText).not.toBeNull();
    }
    /**
     * Waiting for a status update near the document name in accordance with the selected status
     */
    private async waitForDisplayStatus(statusNumb: number): Promise<void> {
        const selectedStatusText: string = await this.selectedStatus.nth(statusNumb).innerText();
        const nearDocStatusText: string = await this.statusNearDoc.nth(statusNumb).innerText();
        if ((selectedStatusText == DocStatus.selectSolution && nearDocStatusText.toLowerCase() != DocStatus.underReview.toLowerCase()) ||
            (selectedStatusText.toLowerCase() != nearDocStatusText.toLowerCase() && selectedStatusText != DocStatus.selectSolution)) {
            await this.waitForDisplayStatus(statusNumb);
        }
    }
    /**
     * Add an expert report
     */
    private async fillExpertSolution(prolicType: ProlicType): Promise<void> {
        await this.recommendation.type(InputData.randomWord);
        if(prolicType == "lic" || prolicType == "cert") {
            await this.createExpertReport.click();
            await Elements.waitForVisible(this.createExpertReport);
        }
        else {
            await this.createWorkingGrpMemberReport.click();
            await Elements.waitForVisible(this.createWorkingGrpMemberReport);
        }
    }
    /**
     * Send documents for verification
     */
    private async sendForVerification(currDocNumb: number,currMaxDocNumb: number): Promise<void> {
        for(let c = currDocNumb;c < currMaxDocNumb; c++) {
            await this.docTooltip.nth(c).click();
            await this.addDocument.nth(c).click();
            await Elements.waitForVisible(this.saveButton);
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
    private async checkCommentValue(commentNumber: number): Promise<void> {
        const currentComment: string = await this.clubWorkerComment.nth(commentNumber).innerText();
        if(currentComment == "-") await this.checkCommentValue(commentNumber);
    }
    /**
     * Select a club from the dropdown list of values
     */
    public async chooseClub(): Promise<void> {
        await Elements.waitForVisible(this.selectClub);
        await this.selectClub.click();
        await Elements.waitForVisible(this.selectClubList.first());
        await this.selectClubList.first().click();
    }
    /**
     * Create a prolicense for testing licenses
     */
    public async createTestProlicense(prolicType: ProlicType): Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.createRuleForProlicense();
        await constructor.createProlicense(prolicType);
        await constructor.addRuleVersionForProlicense();
        await constructor.addExperts();
        await constructor.addMinimumCount();
        await constructor.publishProlicense("lic");
        await Elements.waitForVisible(constructor.createProlicButton);
        this.prolicName = constructor.prolicName;
    }
    /**
     * Create a request in the status "Draft"
     */
    public async createRequestDraft(prolicType: ProlicType): Promise<void> {
        await this.page.goto(Pages.requestNewPage);
        await this.chooseClub();
        await this.filterByColumn(this.filterButtonByEnum(TableColumn.licName),this.prolicName);
        await this.arrow.click();
        await this.goToRequest.click();
        switch (prolicType) {
            case "lic": {
                await expect(this.requestLicTitle).toBeVisible()
                break;
            }
            case "fin": {
                await expect(this.requestFinTitle).toBeVisible()
                break;
            }
            case "cert": {
                await expect(this.requestCertificationTitle).toBeVisible()
                break;
            }
        }
    }
    /**
     * Submit a license request
     */
    public async submitLicenseRequest(): Promise<void> {
        await Elements.waitForVisible(this.submitRequestButton);
        await this.submitRequestButton.click();
        await this.submitRequestOptions.click();
        await this.submitRequestOptionsValues(SubmitRequestOptions.submitEmptyRequest).click();
        await this.nextButton.click();
        await this.performButton.click();
        await expect(this.notification(Notifications.requestAdded)).toBeVisible();
    }
    /**
     * Add files and comments for license documents
     */
    protected async fillDocsAndComment(): Promise<void> {
        await Input.uploadFiles(this.templates.first(),"all");
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.comment.fill(InputData.randomWord);
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
        await this.closeNotifications("last");
    }
    /**
     * Add commission decision for created license
     */
    public async addCommissionDecision(prolicType: ProlicType): Promise<void> {
        await this.page.goto(Pages.commissionPage);
        await this.createMeeting(prolicType);
        await this.addRequestToMeeting();
        await this.addRequestDecision(prolicType);
    }
    /**
     * Change the deadlines for submission and review of documentation
     */
    public async updateDeadlineOfDates(prolicType: ProlicType): Promise<void> {
        if(prolicType == "fin") {
            await Elements.waitForVisible(this.sectionByEnum(RequestSections.generalInfo));
            await this.sectionByEnum(RequestSections.generalInfo).click();
        }
        await this.clickOnDateValue(this.submissionDocDateValue);
        await Date.fillDateInput(this.dates,InputData.futureDate);
        await this.checkButton.first().click();
        await Elements.waitForHidden(this.dates);
        await this.clickOnDateValue(this.reviewDocDateValue);
        await Date.fillDateInput(this.dates,InputData.futureDate);
        await this.checkButton.first().click();
        await Elements.waitForHidden(this.dates);
        await this.page.reload({waitUntil: "load"});
        expect(await this.submissionDocDateValue.innerText()).toBe(InputData.futureDate);
        expect(await this.reviewDocDateValue.innerText()).toBe(InputData.futureDate);
    }
    /**
     * Clicking on the selected date value and checking the visibility of the element
     */
    private async clickOnDateValue(elementForClick: Locator): Promise<void> {
        await elementForClick.click({clickCount: 2});
        await this.page.waitForTimeout(1000);
        if(!await this.dates.isVisible()) await this.clickOnDateValue(elementForClick);
    }
    /**
     * Add sanctions
     */
    public async addSanction(): Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        for(let i=0; i<this.manualSanctionCount; i++) {
            await this.addButton.click();
            await this.selectViolation.click();
            await Elements.waitForVisible(this.violationValues.first());
            await this.violationValues.first().click();
            await this.saveSanctionButton.click();
            if(await this.obligatoryField.isVisible()) {
                await this.sanctionType.click();
                await Elements.waitForVisible(this.sanctionValues.first());
                await this.sanctionValues.first().click();
                await this.saveSanctionButton.click();
            }
        }
        await this.page.reload();
        await Elements.waitForVisible(this.violationName.first());
        expect(await this.violationName.count()).toBe(this.manualSanctionCount);
    }
    /**
     * Remove a sanction
     */
    public async deleteSanction(): Promise<void> {
        await this.deleteSanctionIcon.last().click();
        await this.deleteButton.click();
        await expect(this.notification(Notifications.sanctionRemoved)).toBeVisible();
    }
    /**
     * Formation of the sanction “Return of the RFU expert’s report for revision”
     */
    public async formExpertReportSanction(): Promise<void> {
        await this.editLicStatus(LicStates.inWork);
        await this.sectionByEnum(RequestSections.criterias).click();
        await this.createExpertReport.click();
        await Elements.waitForVisible(this.createExpertReport);
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await expect(await this.expertReportSanction()).toBeVisible();
    }
    /**
     * View approved sanctions
     */
    public async viewApprovedSanctions(): Promise<void> {
        await this.acceptedDecision.click();
        await this.sectionByEnum(RequestSections.commissions).click();
        await Elements.waitForVisible(this.violationName.first());
        expect(await this.violationName.count()).toBe(this.manualSanctionCount);
    }
    /**
     * Change the number of documents sent for verification
     */
    public async changeVerificationDocsCount(): Promise<void> {
        await this.verificationDocsCount.click({clickCount: 2});
        const newDocsCountValue: string = String(randomInt(1,99));
        await this.verificationDocsCountEditField.fill(newDocsCountValue);
        await this.checkButton.first().click();
        await Elements.waitForVisible(this.verificationDocsCount);
        await this.page.reload({waitUntil: "load"});
        expect(await this.verificationDocsCount.innerText()).toBe(newDocsCountValue);
    }
    /**
     * Getting the name of the violation "Return of the RFU expert's report for revision"
     */
    public async returnRfuViolationName(): Promise<string> {
        const dbHelper = new DbHelper();
        const returnRfuViolationName: string = await dbHelper.getReturnRfuViolationName();
        await dbHelper.closeConnect();
        return returnRfuViolationName;
    }
}