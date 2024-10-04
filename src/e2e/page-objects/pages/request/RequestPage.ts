import {expect, Locator, Page} from "@playwright/test";
import {RequestSections} from "../../helpers/enums/RequestSections.js";
import {Elements} from "../../../framework/elements/Elements.js";
import {SearchModalPage} from "../SearchModalPage.js";
import {InputData} from "../../helpers/InputData.js";
import {randomInt} from "crypto";
import {LicStates} from "../../helpers/enums/LicStates.js";
import {CriteriaType} from "../../helpers/enums/CriteriaType.js";
import {DocStatus} from "../../helpers/enums/DocStatus.js";
import {Input} from "../../../framework/elements/Input.js";
import {Notifications} from "../../helpers/enums/Notifications.js";
import {Pages} from "../../helpers/enums/Pages.js";
import {CommissionPage} from "../commissions/CommissionPage.js";
import * as Process from "process";
import {ProlicType} from "../../helpers/types/ProlicType";
import {Date} from "../../../framework/elements/Dates.js";
import {DbHelper} from "../../../../db/db-helper.js";
import {TableColumn} from "../../helpers/enums/TableColumn.js";
import {SubmitRequestOptions} from "../../helpers/enums/SubmitRequestOptions.js";
import {ValidityTypes} from "../../helpers/enums/ValidityTypes.js";

export class RequestPage extends CommissionPage {
    private manualSanctionCount: number = 3
    private deletedMemberFio: string
    private addedOfiName: string
    private parentLicOfiCount: number
    private parentLicMemberCount: number
    private parentLicDocsCount: number
    constructor(page : Page) {
        super(page);
    }
    /**
     * Tabs with criteria groups
     */
    private criteriaGroupsTab: Locator = Elements.getElement(this.page,"//button[contains(text(),'критерии')]")
    /**
     * Document name field
     */
    private docNameField: Locator = Elements.getElement(this.page,`//span[contains(text(),'${InputData.testName("document")}')]`)
    /**
     * Member criteria information field
     */
    private memberCriteriaInfo: Locator = Elements.getElement(this.page,"//a//preceding-sibling::span[text()='ФИО Участника:']")
    /**
     * OFI criteria information field
     */
    private ofiCriteriaInfo: Locator = Elements.getElement(this.page,"//a//preceding-sibling::span[text()='Наименование ОФИ:']")
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
     * Selected status near document name or missing member/ofi
     */
    private entityState: Locator = Elements.getElement(this.page,"//div[contains(@class,'missing') or contains(@class,'DocumentInfo') or contains(@class,'CriteriaExternal-module_isDeleted')]//div[contains(@class,'Badge_status')]")
    /**
     * Expert comment
     */
    private reviewComment: Locator = Elements.getElement(this.page,"//textarea[@name='reviewComment']")
    /**
     * Selected status near document name
     */
    private documentState: Locator = Elements.getElement(this.page,"//div[contains(@class,'DocumentInfo')]//div[contains(@class,'Badge_status')]")
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
     * Member fio
     */
    private memberFio: Locator = Elements.getElement(this.page,"//span[text()='ФИО Участника:']//following-sibling::a//div")
    /**
     * Ofi name
     */
    private ofiName: Locator = Elements.getElement(this.page,"//span[text()='Наименование ОФИ:']//following-sibling::a//div")
    /**
     * Field "Club worker comment"
     */
    private clubWorkerComment: Locator = Elements.getElement(this.page,"//div[text()='Комментарий представителя футбольного клуба:']/following-sibling::div[1][not(contains(text(),'-'))]")
    /**
     * Button "Send a document for review"
     */
    private sendReviewButton: Locator = Elements.getElement(this.page,"//div[contains(@class,'DocumentInfo')]//button//span[text()='Отправить']")
    /**
     * Button "Send a document for review for missing member or ofi"
     */
    private sendMissingEntityReviewButton: Locator = Elements.getElement(this.page,"//*[@class='mr-1']//button[not(@disabled)]//span[text()='Отправить']")
    /**
     * Button "Edit OFI"
     */
    private editOfiButton: Locator = Elements.getElement(this.page,"//button[@name='editButtonOfi' and not(@disabled)]")
    /**
     * Button "Add Member"
     */
    private addMember: Locator = Elements.getElement(this.page,"//span[text()='Добавить Участника']")
    /**
     * Button "Add Ofi"
     */
    private addOfi: Locator = Elements.getElement(this.page,"//span[text()='Добавить ОФИ']")
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
    private editMemberButton: Locator = Elements.getElement(this.page,"//button[@name='editButtonMember' and not(@disabled)]")
    /**
     * Button "->" in the left corner of the table
     */
    private arrow: Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]")
    /**
     * Checkbox for documents on the screen form for selecting replacement documents
     */
    private documentCheckbox: Locator = Elements.getElement(this.page,"//td//label//span//input[@type='checkbox']")
    /**
     * Button "Go to request"
     */
    private goToRequest: Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']")
    /**
     * Checkbox "Member or Ofi is missing"
     */
    private isMissingCheckbox: Locator = Elements.getElement(this.page,"//input[@name='isMissing']")
    /**
     * Button "Publish a request"
     */
    private submitRequestButton: Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']")
    /**
     * Field "Select a club"
     */
    private selectClub: Locator = Elements.getElement(this.page,"//*[contains(@class,'club__control')]")
    /**
     * Field "Comment on absence"
     */
    private absenceComment: Locator = Elements.getElement(this.page,"//textarea[@name='missingComment']")
    /**
     * Values of the drop-down list of the field "Select a club"
     */
    private selectClubList: Locator = Elements.getElement(this.page,"//*[contains(@class,'club__option')]")
    /**
     * Documents of criteria with type "Documents"
     */
    private documentsCriteriaTypeDocs: Locator = Elements.getElement(this.page,"//div[text()='Документы']//..//..//following-sibling::*[contains(@class,'DocumentInfo')]")
    /**
     * Request license title
     */
    private requestLicTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на лицензирование клуба']")
    /**
     * Criteria group expansion icon
     */
    private criteriaGroupExpansionIcon: Locator = Elements.getElement(this.page,"//span[contains(text(),'критерии')]//..//preceding-sibling::span")
    /**
     * Request finance control title
     */
    private requestFinTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на финансовый контроль']")
    /**
     * Change comment from football club
     */
    private clubChangeComment: Locator = Elements.getElement(this.page,"//div[text()='Комментарий-основание замены от представителя футбольного клуба:']/following-sibling::div[1][not(contains(text(),'-'))]")
    /**
     * Field 'contains actual information'
     */
    private containsActualInformation: Locator = Elements.getElement(this.page,"//*[text()='Содержит актуальные сведения']")
    /**
     * Checkbox 'Show only documents with expiring dates'
     */
    private isOnlyExpiringDatesCheckbox: Locator = Elements.getElement(this.page,"//input[@name='isOnlyExpiringDates']//..")
    /**
     * Change document from football club field title
     */
    private clubChangeDocumentTitle: Locator = Elements.getElement(this.page,"//div[text()='Документ-основание замены']")
    /**
     * Change document from football club
     */
    private clubChangeDocument: Locator = Elements.getElement(this.page,"//div[text()='Документ-основание замены']/following-sibling::div[1][contains(@class,'DocumentInfo-module_file_wrapper')]")
    /**
     * Title 'Request for change'
     */
    private requestForChangeTitle: Locator = Elements.getElement(this.page,"//div[text()='Заявка на изменение']")
    /**
     * Button 'Delete a member'
     */
    private deleteMemberButton: Locator = Elements.getElement(this.page,"//button[@data-tooltip-content='Удалить Участника']")
    /**
     * Request certification title
     */
    private requestCertificationTitle: Locator = Elements.getElement(this.page,"//*[text()='Заявка на аттестацию клуба']")
    /**
     * Field 'Comment for replacement'
     */
    private replacementComment: Locator = Elements.getElement(this.page,"//textarea[@name='changeComment']")
    /**
     * Field 'Documents for replacement'
     */
    private replacementDocument: Locator = Elements.getElement(this.page,"//button[@name='changeDocFiles']//..//preceding-sibling::input[@type='file']")
    /**
     * Orange frame of the remote member/ofi
     */
    private removedEntityFrame: Locator = Elements.getElement(this.page,"//div[contains(@class,'CriteriaExternal-module_isDeleted')]")
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
     * Checkbox for member or ofi criterias on the screen form for selecting replacement documents
     */
    private memberOrOfiCriteriaCheckbox: Locator = Elements.getElement(this.page,"//span[contains(@class,'IconAdd')]//..//following-sibling::div//label//span//input[@type='checkbox']")
    /**
     * Checkbox for member or ofi on the screen form for selecting replacement documents
     */
    private memberOrOfiCheckbox: Locator = Elements.getElement(this.page,"//span[contains(@class,'IconTrash')]//..//following-sibling::div//label//span//input[@type='checkbox']")
    /**
     * Currently displayed license status
     */
    private currentLicStatus: Locator = Elements.getElement(this.page,"//*[contains(@class,'requestStateBadgeWrapper')]//*[contains(@class,'Badge_view_filled')]")
    /**
     * Club document
     */
    private clubDocument: Locator = Elements.getElement(this.page,"//div[text()='Прикрепленные документы:']/following-sibling::div[1][contains(@class,'DocumentInfo-module_file_wrapper')]")
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
     * Field 'validity type'
     */
    private validityType: Locator = Elements.getElement(this.page,"//*[contains(@class,'validType__dropdown-indicator')]")
    /**
     * Button 'Add request for change'
     */
    private addRequestForChangeButton: Locator = Elements.getElement(this.page,"//button[text()='Подать заявку на изменение']")
    /**
     * Field 'Calendar'
     */
    private calendar: Locator = Elements.getElement(this.page,"//input[@name='validDate']")
    /**
     * Title 'Specify groups for revision'
     */
    private specifyGroupForRevision: Locator = Elements.getElement(this.page,"//*[text()='Укажите группы для доработки']")
    /**
     * Imported sanction text
     */
    private importedSanctionText: Locator = Elements.getElement(this.page,"//td[contains(text(),'Импортировано из заявки')]")
    /**
     * Missing entity state
     */
    private missingEntityState: Locator = Elements.getElement(this.page,"//div[text()='Участник отсутствует' or text()='ОФИ отсутствует']//..//following-sibling::div[contains(@class,'missing')]//div")
    /**
     * Field 'Select violation'
     */
    private selectViolation: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__dropdown-indicator')]")
    /**
     * 'Select violation' field dropdown values
     */
    private violationValues: Locator = Elements.getElement(this.page,"//*[contains(@class,'violation__option')]")
    /**
     * Added sanction
     */
    private addedSanction: Locator = Elements.getElement(this.page,"//td[contains(@class,'RequestSanctions-module_violationName')]/following-sibling::td[3][not(contains(text(),'Импортировано из заявки'))]")
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
     * Field 'validity type' selected dropdown value
     */
    private validityTypeValue(validityType: ValidityTypes): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'validType__option') and text()='${validityType}']`);
    }
    /**
     * Get tabs by enum
     */
    private sectionByEnum(section: RequestSections): Locator {
        return Elements.getElement(this.page,`//button[text()='${section}']`);
    }
    /**
     * Display absence of Ofi or member for criteria
     */
    private missingEntity(entity: CriteriaType): Locator {
        return (entity == CriteriaType.member) ?
            Elements.getElement(this.page,`//*[text()='Участник отсутствует']`) :
            Elements.getElement(this.page,`//*[text()='ОФИ отсутствует']`);
    }
    /**
     * Dropdown values in the field 'Submit request options'
     */
    private submitRequestOptionsValues(optionName: SubmitRequestOptions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'usePrevSeasons__option') and text()='${optionName}']`);
    }
    /**
     * Get member or ofi by his name
     */
    private getEntityByName(entityType: CriteriaType,name: string): Locator {
        return (entityType == CriteriaType.member) ?
            Elements.getElement(this.page,`//span[text()='ФИО Участника:']//following-sibling::a//div[contains(text(),'${name}')]`) :
            Elements.getElement(this.page,`//span[text()='Наименование ОФИ:']//following-sibling::a//div[contains(text(),'${name}')]`);
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
        const groupsCount = await this.criteriaGroupsTab.count();
        for(let i = 0; i<groupsCount; i++) {
            if(i != 0) await this.criteriaGroupsTab.nth(i).click();
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
    private async addMemberOrOfi(entityType: CriteriaType,isChangeRequest?: boolean): Promise<void> {
        (entityType == CriteriaType.member) ?
            await this.editMemberButton.nth(1).click() :
            (isChangeRequest) ?
                await this.editOfiButton.click() :
                await this.editOfiButton.nth(1).click();
        const searchModal = new SearchModalPage(this.page);
        await this.searchDataButton.click();
        await searchModal.findButton.click();
        await Elements.waitForHidden(searchModal.loadIndicator);
        (isChangeRequest) ? await searchModal.radio.last().click() : await searchModal.radio.first().click();
        const addedEntityName: string = (isChangeRequest) ?
            await searchModal.entityNameTableCell.last().innerText() :
            await searchModal.entityNameTableCell.first().innerText();
        await searchModal.selectButton.click();
        await this.saveButton.click();
        await this.closeNotifications("last");
        try {
            await expect(this.getEntityByName(entityType,addedEntityName)).toBeVisible();
        }
        catch (err) {
            await this.saveButton.click();
            await expect(this.getEntityByName(entityType,addedEntityName)).toBeVisible();
        }
    }
    /**
     * Add ofi and participants to criterias and fill criteria documents
     */
    public async fillRequestEntities(prolicType: ProlicType, isChangeRequest: boolean): Promise<void> {
        if(isChangeRequest) await this.sectionByEnum(RequestSections.criterias).click();
        const groupsCount: number = await this.criteriaGroupsTab.count();
        for(let i = groupsCount-1; i >= 0; i--) {
            await this.criteriaGroupsTab.nth(i).click();
            const currentCriteriaGroupName: string = await this.criteriaGroupsTab.nth(i).innerText();
            await Elements.waitForVisible(this.criteriaInfo.first());
            const criteriaCount: number = await this.criteriaInfo.count();
            for(let m = 0; m < criteriaCount;m++) {
                await this.criteriaInfo.nth(m).click();
                await Elements.waitForVisible(this.critTypeValue.nth(m));
                const criteriaType: string = await this.critTypeValue.nth(m).innerText();
                switch (criteriaType) {
                    case CriteriaType.member:
                        if(isChangeRequest) {
                            await this.deleteMemberButton.click();
                            await this.deleteButton.click();
                            await Elements.waitForVisible(this.removedEntityFrame);
                            await this.sendMissingEntityReviewButton.click();
                            await this.performButton.click();
                            this.deletedMemberFio = await this.memberFio.innerText();
                        }
                        else {
                            await this.addMissingMemberOrOfi(CriteriaType.member);
                            await this.addMemberOrOfi(CriteriaType.member);
                        }
                        break;
                    case CriteriaType.ofi:
                        if(isChangeRequest) {
                            await this.addMemberOrOfi(CriteriaType.ofi,true);
                            this.addedOfiName = await this.ofiName.last().innerText();
                        }
                        else {
                            await this.addMissingMemberOrOfi(CriteriaType.ofi);
                            await this.addMemberOrOfi(CriteriaType.ofi);
                        }
                }
            }
            if(!isChangeRequest) await this.calculateParentLicEntities();
            const docsCount: number = await this.addDocument.count();
            for (let m = 0; m < docsCount; m++) {
                await this.sendForVerification(m,prolicType,isChangeRequest,currentCriteriaGroupName);
            }
            if(!isChangeRequest) {
                const missingEntitiesCount: number = await this.sendMissingEntityReviewButton.count();
                for (let m = 0; m < missingEntitiesCount; m++) {
                    await this.sendForVerificationMessingEntity(m);
                }
            }
        }
        if(!isChangeRequest) await this.addGeneralDocInfo(prolicType);
    }
    /**
     * Calculation docs count, ofi count and members count in parent license
     */
    private async calculateParentLicEntities(): Promise<void> {
        this.parentLicMemberCount = await this.memberCriteriaInfo.count() + await this.missingEntity(CriteriaType.member).count();
        this.parentLicOfiCount = await this.ofiCriteriaInfo.count() + await this.missingEntity(CriteriaType.ofi).count();
        this.parentLicDocsCount = await this.documentsCriteriaTypeDocs.count();
    }
    /**
     * Add missing member or ofi
     */
    private async addMissingMemberOrOfi(entity: CriteriaType): Promise<void> {
        (entity == CriteriaType.member) ? await this.addMember.click() : await this.addOfi.click();
        (entity == CriteriaType.member) ? await this.editMemberButton.click() : await this.editOfiButton.click();
        await this.isMissingCheckbox.click();
        await this.absenceComment.fill(InputData.randomWord);
        await this.saveButton.click();
        (entity == CriteriaType.member) ?
            await expect(this.missingEntity(CriteriaType.member)).toBeVisible() :
            await expect(this.missingEntity(CriteriaType.ofi)).toBeVisible();
    }
    /**
     * Fill criteria documents in general info
     */
    private async addGeneralDocInfo(prolicType: ProlicType): Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await Elements.waitForVisible(this.addDocument.last());
        const docsCount : number = await this.addDocument.count();
        for (let i = 0; i < docsCount; i++) {
            await this.sendForVerification(i,prolicType,false);
        }
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
            const randomStateNumb: number = randomInt(0,await this.docStatesList.count());
            const selectedState: string = await this.docStatesList.nth(randomStateNumb).innerText();
            await this.docStatesList.nth(randomStateNumb).click();
            (reason == "generalInfo") ?
                await this.checkButton.nth(currentIndex).click() :
                await this.checkButton.nth(i).click();
            await expect(this.entityState.nth(i)).toHaveText(selectedState);
            await this.closeNotifications("last");
            if(selectedState == DocStatus.notAccepted) currentIndex++;
        }
    }
    /**
     * Add comments and statuses for documents
     */
    public async addExpertSolution(prolicType: ProlicType, isChangeRequest: boolean): Promise<void> {
        if(!isChangeRequest) {
            const docsCount: number = await this.checkButton.count();
            await this.fillStatusAndComment(docsCount,"generalInfo");
            await this.sectionByEnum(RequestSections.criterias).click();
        }
        const groupsCount: number = await this.criteriaGroupsTab.count();
        for(let i = 0; i<groupsCount; i++) {
            await this.criteriaGroupsTab.nth(i).click();
            let criteriaCount: number;
            do {
               criteriaCount = await this.criteriaInfo.count();
            } while (criteriaCount < Object.keys(CriteriaType).length)
            if(!isChangeRequest) {
                for(let c = 0; c<criteriaCount; c++) {
                    await this.criteriaInfo.nth(c).click();
                    const criteriaType : string = await this.critTypeValue.nth(c).innerText();
                    if(criteriaType == CriteriaType.member) await this.memberCriteriaInfo.click();
                    else if(criteriaType == CriteriaType.ofi) await this.ofiCriteriaInfo.click();
                }
            }
            const docsCount: number = await this.checkButton.count();
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
        const criteriaStates: string[] = await this.criteriaStatus.allInnerTexts();
        const docsStates: string[] = await this.docStates.allInnerTexts();
        const docsCountPerCriteria: number = docsCount/criteriaCount;
        let startIndexForDocsArray: number = 0;
        criteriaStates.forEach(criteriaState => {
            const docsArrayForCurrentCriteria: string[] = docsStates.slice(startIndexForDocsArray, docsCountPerCriteria + startIndexForDocsArray);
            if(docsArrayForCurrentCriteria.includes(DocStatus.form)) {
                expect(criteriaState.toLowerCase()).toBe(DocStatus.form.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.notAccepted)) {
                expect(criteriaState.toLowerCase()).toBe(DocStatus.notAccepted.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.underReview)) {
                expect(criteriaState.toLowerCase()).toBe(DocStatus.underReview.toLowerCase());
            }
            else if(docsArrayForCurrentCriteria.includes(DocStatus.acceptedWithCondition)) {
                expect(criteriaState.toLowerCase()).toBe(DocStatus.acceptedWithCondition.toLowerCase());
            }
            else {
                expect(criteriaState.toLowerCase()).toBe(DocStatus.accepted.toLowerCase());
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
     * Filling and sending documents and missing members/ofi for verification
     */
    private async sendForVerification(currentDocIndex: number,prolicType: ProlicType,isChangeRequest: boolean, critGroupName?: string): Promise<void> {
        (isChangeRequest) ? await this.expandChangeRequestEntity(currentDocIndex) : await this.docTooltip.nth(currentDocIndex).click();
        await this.addDocument.nth(currentDocIndex).click();
        await Elements.waitForVisible(this.saveButton);
        await this.fillDocsAndComment(prolicType,isChangeRequest,critGroupName);
        if(isChangeRequest) {
            await expect(this.clubChangeComment.nth(currentDocIndex)).toBeVisible();
            await expect(this.clubChangeDocument.nth(currentDocIndex)).toBeVisible();
        }
        else {
            await expect(this.clubWorkerComment.nth(currentDocIndex)).toBeVisible();
            await expect(this.clubDocument.nth(currentDocIndex)).toBeVisible();
        }
        await this.sendReviewButton.nth(currentDocIndex).click();
        await this.closeNotifications("last");
    }
    /**
     * Send missing member or ofi for verification
     */
    private async sendForVerificationMessingEntity(missingEntityCurrentIndex: number): Promise<void> {
        await this.sendMissingEntityReviewButton.first().click();
        await this.submitButton.click();
        let missingEntityState: string;
        do {
            missingEntityState = await this.missingEntityState.nth(missingEntityCurrentIndex).innerText().then(text => text.toLowerCase());
        }
        while (missingEntityState != DocStatus.underReview.toLowerCase())
    }
    /**
     * Expand entity in request for change
     */
    private async expandChangeRequestEntity(docIndex: number): Promise<void> {
        const currentDocumentState: string = await this.documentState.nth(docIndex).innerText();
        if(currentDocumentState.toLowerCase() == DocStatus.form.toLowerCase()) {
            (docIndex == 0) ? await this.reviewComment.nth(docIndex).click() : await this.reviewComment.nth(docIndex+1).click()
            await this.page.waitForTimeout(500);
            if(!await this.clubChangeDocumentTitle.nth(docIndex).isVisible()) await this.expandChangeRequestEntity(docIndex);
        }
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
        await this.createRuleForProlicense();
        await this.createProlicense(prolicType);
        await this.addRuleVersionForProlicense();
        await this.addExpertsInProlicense();
        await this.addMinimumCount();
        await this.publishProlicense("lic");
        await Elements.waitForVisible(this.createProlicButton);
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
    public async submitLicenseRequest(prolicType: ProlicType): Promise<void> {
        await Elements.waitForVisible(this.submitRequestButton);
        await this.submitRequestButton.click();
        if(prolicType != "fin") {
            await this.submitRequestOptions.click();
            await this.submitRequestOptionsValues(SubmitRequestOptions.submitEmptyRequest).click();
            await this.nextButton.click();
            await this.performButton.click();
        }
        await expect(this.notification(Notifications.requestAdded)).toBeVisible();
    }
    /**
     * Add files and comments for license documents
     */
    protected async fillDocsAndComment(prolicType: ProlicType,isChangeRequest: boolean, critGroupName?: string): Promise<void> {
        const criGroupWithoutExpirationDate: string = "Финансовые критерии";
        if(prolicType != "fin" && critGroupName && critGroupName != criGroupWithoutExpirationDate) {
            const validityTypesValues: ValidityTypes[] = Object.values(ValidityTypes)
            const randomValidityType: ValidityTypes = validityTypesValues[randomInt(0,validityTypesValues.length)];
            await this.validityType.click();
            await this.validityTypeValue(randomValidityType).click();
            if(randomValidityType == ValidityTypes.untilSpecificDate) await Date.fillDateInput(this.calendar,InputData.currentDate);
        }
        await Input.uploadFiles(this.templates.first(),"all");
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.comment.fill(InputData.randomWord);
        if(isChangeRequest) {
            await Input.uploadFiles(this.replacementDocument.first(),"all");
            await this.replacementComment.fill(InputData.randomWord);
        }
        await this.saveButton.click();
        await Elements.waitForHidden(this.saveButton);
        await this.closeNotifications("last");
    }
    /**
     * Add commission decision for created license
     */
    public async addCommissionDecision(prolicType: ProlicType,isChangeRequest: boolean): Promise<void> {
        await this.page.goto(Pages.commissionPage);
        await this.createMeeting(prolicType,isChangeRequest);
        await this.addRequestToMeeting();
        await this.addRequestDecision(prolicType,isChangeRequest);
        if(prolicType == "lic") {
            (isChangeRequest) ?
                await this.viewApprovedSanctions(true) :
                await this.viewApprovedSanctions(false);
        }
        if(prolicType != "fin") {
            (isChangeRequest) ?
                await this.checkRequestAttributes(true) :
                await this.checkRequestAttributes(false);
        }
        if(isChangeRequest) {
            await this.checkRemovedAndAddedEntities();
            await this.checkImportedEntities();
            await this.checkChangedEntitiesColors();
        }
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
        await Elements.waitForVisible(this.addedSanction.first());
        expect(await this.addedSanction.count()).toBe(this.manualSanctionCount);
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
    private async viewApprovedSanctions(isAfterAcceptChangeRequest: boolean): Promise<void> {
        (isAfterAcceptChangeRequest) ?
            await this.acceptedDecisionByName(LicStates.accepted).click({clickCount: 2}) :
            await this.acceptedDecisionByName(LicStates.issued).click({clickCount: 2});
        await this.sectionByEnum(RequestSections.commissions).click();
        await Elements.waitForVisible(this.addedSanction.first());
        (isAfterAcceptChangeRequest) ?
            expect(await this.addedSanction.count()).toBe(this.manualSanctionCount*2) :
            expect(await this.addedSanction.count()).toBe(this.manualSanctionCount);
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
    /**
     * Adding a request for change
     */
    public async addRequestForChange(): Promise<void> {
        await this.sectionByEnum(RequestSections.generalInfo).click();
        await this.addRequestForChangeButton.click();
        await this.isOnlyExpiringDatesCheckbox.click();
        await this.criteriaGroupExpansionIcon.click();
        const criteriaCount: number = await this.criteriaInfo.count();
        const docsCount: number = await this.documentCheckbox.count();
        const docsInOneCriteria: number = docsCount/criteriaCount;
        let currentDocIndex: number = 0;
        let isOfiOrMemberCriteriaPassed: boolean = false;
        for(let i = 0; i < criteriaCount; i++) {
            await this.criteriaInfo.nth(i).click();
            const criteriaType: string = await this.critTypeValue.nth(i).innerText();
            switch (criteriaType) {
                case CriteriaType.ofi:
                    (isOfiOrMemberCriteriaPassed) ?
                        await this.memberOrOfiCriteriaCheckbox.last().click() :
                        await this.memberOrOfiCriteriaCheckbox.first().click();
                    break;
                case CriteriaType.documents:
                    await this.documentCheckbox.nth(currentDocIndex).click();
                    break;
                default:
                    (isOfiOrMemberCriteriaPassed) ?
                        await this.memberOrOfiCheckbox.last().click() :
                        await this.memberOrOfiCheckbox.nth(1).click();

            }
            currentDocIndex+=docsInOneCriteria;
            if(criteriaType == CriteriaType.ofi || criteriaType == CriteriaType.member) isOfiOrMemberCriteriaPassed = true;
        }
        await this.addRequestForChangeButton.last().click();
        await this.submitButton.click();
        await expect(this.requestForChangeTitle).toBeVisible();
    }
    /**
     * Check imported sanctions
     */
    public async checkImportedSanctions(): Promise<void> {
        await Elements.waitForVisible(this.importedSanctionText.first());
        expect(await this.importedSanctionText.count()).toBe(this.manualSanctionCount);
        await this.sectionByEnum(RequestSections.commissions).click();
        await Elements.waitForVisible(this.importedSanctionText.first());
        expect(await this.importedSanctionText.count()).toBe(this.manualSanctionCount);
    }
    /**
     * Checking attributes of request
     */
    private async checkRequestAttributes(isAfterAcceptChangeRequest: boolean): Promise<void> {
        await expect(this.containsActualInformation).toBeVisible();
        if(isAfterAcceptChangeRequest) await expect(this.requestForChangeTitle).not.toBeVisible();
    }
    /**
     * Check for the presence of an added OFI and the absence of a removed member
     */
    private async checkRemovedAndAddedEntities(): Promise<void> {
        await this.sectionByEnum(RequestSections.criterias).click();
        await Elements.waitForVisible(this.criteriaInfo.first());
        const criteriaCount: number = await this.criteriaInfo.count();
        for(let i = 0; i < criteriaCount;i++) {
            await this.criteriaInfo.nth(i).click();
            await Elements.waitForVisible(this.critTypeValue.nth(i));
        }
        await expect(this.getEntityByName(CriteriaType.ofi, this.addedOfiName)).toBeVisible();
        await expect(this.getEntityByName(CriteriaType.member, this.deletedMemberFio)).not.toBeVisible();
    }
    /**
     * Checking for the presence of imported entities from the actual request
     */
    private async checkImportedEntities(): Promise<void> {
        const ofiCountInChangeRequest: number = 3;
        const documentsCriteriaTypeDocsCount: number = await this.documentsCriteriaTypeDocs.count();
        const membersCount: number = await this.memberCriteriaInfo.count() + await this.missingEntity(CriteriaType.member).count();
        const ofiCount: number = await this.ofiCriteriaInfo.count() + await this.missingEntity(CriteriaType.ofi).count();
        expect(documentsCriteriaTypeDocsCount).toBe(this.parentLicDocsCount);
        expect(membersCount).toBe(this.parentLicMemberCount-1);
        if(this.minCountValue < ofiCountInChangeRequest) {
            expect(ofiCount).toBe(this.parentLicOfiCount);
            await expect(this.missingEntity(CriteriaType.ofi)).not.toBeVisible();
        }
        else expect(ofiCount).toBe(this.parentLicOfiCount+1);
    }
    /**
     * Checking colors of added ofi and changed documents
     */
    private async checkChangedEntitiesColors(): Promise<void> {
        const blueRgbColor: string = "0, 120, 210";
        const rgbValueRegExp: RegExp = /(?<=\().+(?=\))/;
        const critGroupColorStyle: string = await this.criteriaGroupsTab.getAttribute('style');
        const addedOfiColorStyle: string = await this.ofiName.last().evaluate((element) => window.getComputedStyle(element).color);
        const changedDocColorStyle: string = await this.docNameField.first().evaluate((element) => window.getComputedStyle(element).color);
        const criteriaGroupRgbColor: string = rgbValueRegExp.exec(critGroupColorStyle)[0];
        const ofiRgbColor: string = rgbValueRegExp.exec(addedOfiColorStyle)[0];
        const docRgbColor: string = rgbValueRegExp.exec(changedDocColorStyle)[0];
        expect(ofiRgbColor, docRgbColor).toBe(blueRgbColor);
        expect(criteriaGroupRgbColor).toBe(blueRgbColor);
    }
}