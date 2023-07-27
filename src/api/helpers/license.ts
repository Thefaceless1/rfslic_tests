import {TestData} from "./test-data";
import {DocAndCommentInterface} from "./types/prolicense.interface";
import {Prolicense} from "./prolicense";
import superagent from "superagent";
import {DocumentStatus} from "./enums/document-status";
import {LicStatus} from "./enums/license-status";
import {
    AddDocStatusInterface,
    ChangeLicStatusInterface,
    ConclusionInterface,
    CreateLicenseInterface,
    CriteriaGroupsInterface,
    CriteriasInterface,
    DocumentsInterface,
    ExpertReportInterface,
    ExternalInterface,
    LicenseInterface,
    RfuExpertInterface
} from "./types/license.interface";
import {randomInt} from "crypto";
import {ClubExpertInterface, ClubWorkersInterface, LicDocStatusInterface} from "./types/catalogs.interface";
import {logger} from "../../logger/logger";
import {CriteriaTypes} from "./enums/criteria-types";
import {RequestApi} from "./api/request.api";
import {UserApi} from "./api/user.api";

export class License extends Prolicense {
    constructor(
        public license : LicenseInterface[] = [],
        public selectedRfuExpertId : number = 0,
        public selectedOfiId : number = 0,
        public selectedClubWorkerId : number = 0,
        public selectedLicenseClubId : number = 0,
        public removedFileId : number = 0
    ) {
        super();
    }
    /**
     * Create a license request in 'Draft' status
     */
    public async createLicense(): Promise<void> {
        this.selectedLicenseClubId = this.organization[0].id;
        const requestBody: CreateLicenseInterface = {
            proLicId : this.prolicense[0].id as number,
            clubId : this.selectedLicenseClubId
        }
        const response = await superagent.put(RequestApi.createRequest).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.license[0] = response.body.data;
    }
    /**
     * Add documents and comments for a license request
     */
    public async addCommentsAndDocuments(): Promise<void> {
        const requestBody: DocAndCommentInterface = {
            files: this.files,
            comment: TestData.commentValue
        };
        for(const document of this.license[0].documents) {
            await superagent.put(RequestApi.addGeneralInfoFiles(document.id)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshLicense();
    }
    /**
     * Publish a license request
     */
    public async publishLicense(): Promise<void>  {
        const response = await superagent.put(RequestApi.publishLicense(this.license[0].id)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.license[0] = response.body.data;
    }
    /**
     * Add club experts to criteria groups
     */
    public async addClubExperts() : Promise<void> {
        for(const group of this.license[0].criteriaGroups) {
            const requestBody: ClubExpertInterface = {experts: await this.selectClubExperts(group.groupId)};
            await superagent.put(RequestApi.changeClubExperts(this.license[0].id,group.groupId)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshLicense();
    }
    /**
     * Set club experts for each criteria group
     */
    private async selectClubExperts(grpId: number): Promise<number[]> {
        const response = await superagent.get(UserApi.clubExpertsByCriteriaGroup(this.license[0].id,grpId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        const clubExpertIds: number[] = response.body.data.map((clubExpert: ClubWorkersInterface) => clubExpert.id);
        if(clubExpertIds.length == 0) logger.info(`Отсутствуют сотрудники клуба для группы критериев ${grpId}`);
        return clubExpertIds
    }
    /**
     * Add rfu experts to criteria groups
     */
    public async addRfuExperts(): Promise<void> {
        this.selectedRfuExpertId = this.license[0].criteriaGroups[0].rfuExpertChoice[0];
        const requestBody: RfuExpertInterface = {rfuExpert: this.selectedRfuExpertId};
        for(const group of this.license[0].criteriaGroups) {
            await superagent.put(RequestApi.changeRfuExpert(this.license[0].id,group.groupId)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshLicense();
    }
    /**
     * Add files and comments for criteria documents
     */
    public async addDataToCritDoc(): Promise<void> {
        const requestBody: DocAndCommentInterface = {
            files: this.files,
            comment: TestData.commentValue
        };
        for(const group of this.license[0].criteriaGroups) {
            for(const criteria of group.criterias) {
                for(const document of criteria.documents) {
                    await superagent.put(RequestApi.addCritDocFiles(document.id!)).
                    send(requestBody).
                    set("cookie", `${this.cookie}`).
                    set("x-csrf-token",this.x_csrf_token);
                }
            }
        }
        await this.refreshLicense();
    }
    /**
     * Add for criteria documents and general info documents:
     * 1.Comments
     * 2.Random status
     */
    public async addStatusToDocuments(): Promise<void>  {
        const statusIds : number[] = this.docStatus.filter(
            status => status.name == DocumentStatus.declined ||
            status.name == DocumentStatus.accepted ||
            status.name == DocumentStatus.acceptedWithCondition
        ).map(status => status.id);
        for(const document of this.license[0].documents) {
            const requestBody: AddDocStatusInterface = {
                stateId: statusIds[randomInt(0,statusIds.length)],
                comment: TestData.commentValue
            };
            await superagent.put(RequestApi.changeGeneralInfoDocStatus(document.id)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        for(const group of this.license[0].criteriaGroups) {
            for(const criteria of group.criterias) {
                for(const document of criteria.documents) {
                    const requestBody: AddDocStatusInterface = {
                        stateId: statusIds[randomInt(0,statusIds.length)],
                        comment: TestData.commentValue
                    };
                    await superagent.put(RequestApi.changeCriteriaDocStatus(document.id!)).
                    send(requestBody).
                    set("cookie", `${this.cookie}`).
                    set("x-csrf-token",this.x_csrf_token);
                }
            }
        }
        await this.refreshLicense();
    }
    /**
     * Calculation of license filling percentages after filling out decisions on documents
     */
    public get licPercent() : number {
        let allDocsCount : number = 0;
        let checkedDocsCount : number = 0;
        this.license[0].documents.forEach((document) => {
            allDocsCount++;
            if (document.state == DocumentStatus.accepted ||
                document.state == DocumentStatus.acceptedWithCondition ||
                document.state == DocumentStatus.declined)
                checkedDocsCount++;
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    allDocsCount++;
                    if (document.state == DocumentStatus.accepted ||
                        document.state == DocumentStatus.acceptedWithCondition ||
                        document.state == DocumentStatus.declined)
                        checkedDocsCount++;
                })
            })
        })
        return Math.round((checkedDocsCount / allDocsCount) * 100);
    }
    /**
     * Calculation of percentages of each criterias
     */
    public criteriaPercent(criteriaGroup : CriteriaGroupsInterface, criteria : CriteriasInterface) : number {
        let critPercent : number;
        if(criteria.external == null)
            critPercent = criteria.documents.filter(value => value.stateId != 2 && value.stateId != 1).length*100/criteria.documents.length;
        else {
            const sameCriterias : CriteriasInterface[] =[];
            const sameCritDocs : DocumentsInterface[] =[];
            criteriaGroup.criterias.forEach((value) => {
                if(value.name == criteria.name) sameCriterias.push(value);
            })
            sameCriterias.forEach((value) => {
                value.documents.forEach((document) => {
                    sameCritDocs.push(document)
                })
            })
            critPercent = sameCritDocs.filter(value => value.stateId != 2 && value.stateId != 1).length*100/sameCritDocs.length;
        }
        return Math.round(critPercent)
    }
    /**
     * Get criteria documents
     */
    public criteriaDocuments(criteriaGroup : CriteriaGroupsInterface,criteria : CriteriasInterface): DocumentsInterface[] {
        if(criteria.external == null) return criteria.documents;
        else {
            const sameCriterias : CriteriasInterface[] =[];
            const sameCritDocs : DocumentsInterface[] =[];
            criteriaGroup.criterias.forEach((value) => {
                if(value.name == criteria.name) sameCriterias.push(value);
            })
            sameCriterias.forEach((value) => {
                value.documents.forEach((document) => {
                    sameCritDocs.push(document)
                })
            })
            return sameCritDocs;
        }
    }
    /**
     * Add conclusions for a license
     */
    public async addConclusions(): Promise<void> {
        const requestBody: ConclusionInterface = {
            conclusion: TestData.commentValue,
            recommendation: TestData.commentValue,
            rplCriterias: TestData.commentValue
        }
        await superagent.put(RequestApi.addDecision(this.license[0].id)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshLicense();
    }
    /**
     * Add an expert report for criteria groups
     */
    public async addExpertReport(): Promise<void> {
        for(const group of this.license[0].criteriaGroups) {
            const requestBody: ExpertReportInterface = {
                groupId : group.groupId,
                recommendation : TestData.commentValue
            }
            await superagent.post(RequestApi.createExpertReport(this.license[0].id)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshLicense();

    }
    /**
     * Add participants and OFI for criteria with types Participant and OFI
     */
    public async addOfiAndUsers() : Promise<void> {
        this.selectedOfiId = this.ofiId[0];
        this.selectedClubWorkerId = this.personsId[0];
        for(const group of this.license[0].criteriaGroups) {
            for(const criteria of group.criterias) {
                if(criteria.typeId == CriteriaTypes.file) continue;
                const requestBody: ExternalInterface = (criteria.typeId == CriteriaTypes.participant) ?
                    {externalId: this.selectedClubWorkerId} :
                    {externalId: this.selectedOfiId};
                await superagent.put(RequestApi.addExternal(criteria.id!)).
                send(requestBody).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
            }
        }
        await this.refreshLicense();
    }
    /**
     * Get license by id
     */
    public async refreshLicense(): Promise<void> {
        const response = await superagent.get(RequestApi.getLicenseById(this.license[0].id)).
        set("cookie", `${this.cookie}`);
        this.license[0] = response.body.data;
    }
    /**
     * Set the license status to "Waiting for the commission's decision"
     */
    public async changeLicStatus(): Promise<void> {
        const waitForCommissionState: LicDocStatusInterface = this.licStatusByEnum(LicStatus.waitForCommission);
        const requestBody: ChangeLicStatusInterface = {
            stateId: waitForCommissionState.id,
            notActualGroupIds: []
        }
        await superagent.put(RequestApi.changeLicStatus(this.license[0].id)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshLicense();
    }
    /**
     * Delete a general info document file
     */
    public async deleteGeneralInfoDocFile(): Promise<void> {
        this.removedFileId = this.license[0].documents[0].files[0].id!;
        await superagent.delete(RequestApi.deleteRequestFile(this.removedFileId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshLicense();
    }
    /**
     * Delete a criteria document file
     */
    public async deleteCriteriaDocFile(): Promise<boolean> {
        this.removedFileId = this.license[0].criteriaGroups[0].criterias[0].documents[0].files[0].id!;
        await superagent.delete(RequestApi.deleteCriteriaFile(this.removedFileId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshLicense();
        return this.license[0].criteriaGroups[0].criterias[0].documents[0].files.every(file => file.id != this.removedFileId);
    }
    /**
     * Send for verification all general info documents
     */
    public async checkGeneralInfoDocs(): Promise<void> {
        await superagent.put(RequestApi.sendGeneralInfoDocsForVerification(this.license[0].id)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshLicense();
    }
    /**
     * Send for verification all criteria documents
     */
    public async checkCriteriaDocs(): Promise<void> {
        for(const group of this.license[0].criteriaGroups) {
            await superagent.put(RequestApi.sendCriteriaDocsForVerification(this.license[0].id,group.groupId)).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshLicense();
    }
}