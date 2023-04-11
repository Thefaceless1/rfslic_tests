import {TestData} from "./test-data";
import {TProlicense} from "./types/prolicense.type";
import {Prolicense} from "./prolicense";
import superagent, {Response} from "superagent";
import {DocumentStatus} from "./enums/document-status";
import {LicStatus} from "./enums/license-status";
import {Api} from "./api";
import {TCreateLicense, TCriteriaGroups, TCriterias, TDocuments, TExpertReport, TLicense} from "./types/license.type";
import {randomInt} from "crypto";
import {TClubWorkers, TLicAndDocStatus} from "./types/catalogs.type";

export class License extends Prolicense {
    constructor(
        public license : TLicense[] = []
    ) {
        super();
    }
    /**
     * Add a license request
     */
    public createLicense (prolicense : TProlicense[]) : TCreateLicense {
        const firstClubId : number = this.organization[0].id;
        return {
            proLicId : prolicense[0].id as number,
            clubId : firstClubId
        }
    }
    /**
     * Add response body to the 'license' array
     */
    public fillLicense(index : number,response : Response) : void {
        this.license[index] = response.body.data;
    }
    /**
     * Add documents and comments for a license request
     */
    public addCommentsAndDocuments () : TLicense {
        this.license[0].documents.forEach((document) => {
            document.comment = TestData.commentValue;
            document.files = this.files;
        })
        return this.license[0];
    }
    /**
     * Publish a license request
     */
    public publishLicense () : TLicense {
        this.license[0].stateId = this.licStatusByEnum(LicStatus.new).id;
        this.license[0].state = this.licStatusByEnum(LicStatus.new).name;
        return this.license[0];
    }
    /**
     * Add criteria groups experts and club workers for a criteria group
     */
    public async addClubWorkersToCritGrp () : Promise<TLicense> {
        const api = new Api();
        for (const criteriaGroup of this.license[0].criteriaGroups) {
            api.request.fillApi(this.license[0],criteriaGroup.groupId);
            const response = await superagent.get(api.basicUrl + api.request.clubWorkers).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
            criteriaGroup.experts = response.body.data.map((clubWorker : TClubWorkers) => clubWorker.id);
            criteriaGroup.rfuExpert = this.critGrpExperts[0].id;
        }
        return this.license[0];
    }
    /**
     * Add for criteria documents :
     * 1. Comments
     * 2. If document type != List of participants, OFI, Organization - then add files
     * 3. If document type = List of participants - then add participants
     * 4. If document type = OFI - then add OFI
     * 5. If document type = Organization - then add organizations
     */
    public addDataToCritDoc () {
        this.license[0].criteriaGroups.forEach((critGrp) => {
            critGrp.criterias.forEach((criterias) => {
                criterias.documents.forEach((documents) => {
                    documents.comment = TestData.commentValue;
                    switch (documents.docTypeId) {
                        case 5 : documents.externalIds = this.personsId; break;
                        case 6 : documents.externalIds = this.ofiId; break;
                        case 9 : documents.externalIds = this.orgId; break;
                        default : documents.files = this.files;
                    }
                })
            })
        })
        return this.license[0];
    }
    /**
     * Add for criteria documents:
     * 1.Comments
     * 2.Random document status
     */
    public addStatusToDocuments () : TLicense {
        const statusIds : number[] = this.docStatus.filter(
            status => status.name == DocumentStatus.declined ||
            status.name == DocumentStatus.accepted ||
            status.name == DocumentStatus.acceptedWithCondition
        ).map(status => status.id);
        this.license[0].documents.forEach((document) => {
            const randomStatusId : number = randomInt(0,statusIds.length);
            document.reviewComment = TestData.commentValue;
            document.stateId = statusIds[randomStatusId];
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    const randomStatusId : number = randomInt(0,statusIds.length);
                    document.reviewComment = TestData.commentValue;
                    document.stateId = statusIds[randomStatusId];
                })
            })
        })
        return this.license[0];
    }
    /**
     * Calculation of license filling percentages after filling out decisions on documents
     */
    public get licPercent () : number {
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
    public criteriaPercent(criteriaGroup : TCriteriaGroups, criteria : TCriterias) : number {
        let critPercent : number;
        if(criteria.external == null)
            critPercent = criteria.documents.filter(value => value.stateId != 2 && value.stateId != 1).length*100/criteria.documents.length;
        else {
            const sameCriterias : TCriterias[] =[];
            const sameCritDocs : TDocuments[] =[];
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
    public criteriaDocuments(criteriaGroup : TCriteriaGroups,criteria : TCriterias) : TDocuments[] {
        if(criteria.external == null) return criteria.documents;
        else {
            const sameCriterias : TCriterias[] =[];
            const sameCritDocs : TDocuments[] =[];
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
    public addConclusions() : TLicense {
        this.license[0].recommendation = TestData.commentValue;
        this.license[0].conclusion = TestData.commentValue;
        this.license[0].rplCriterias = TestData.commentValue;
        return this.license[0];
    }
    /**
     * Add an expert report for criteria groups
     */
    public addExpertReport(grpId : number) : TExpertReport {
        return {
            groupId : grpId,
            recommendation : TestData.commentValue
        }
    }
    /**
     * Add participants and OFI for criteria with types Participant and OFI
     */
    public addOfiAndUsers() : TLicense {
        this.license[0].criteriaGroups.forEach(critGrp => {
            critGrp.criterias[1].externalId = this.personsId[0];
            critGrp.criterias[2].externalId = this.ofiId[0];
            const iterationCount : number = 5;
            critGrp.criterias[iterationCount+1] = critGrp.criterias[2];
            for(let i=1; i<iterationCount; i++) {
                let newUser = {...critGrp.criterias[1]};
                let newOfi = {...critGrp.criterias[iterationCount+1]};
                const docCount : number = newUser.documents.length;
                for(let i = 0; i<docCount; i++) {
                    delete newUser.documents[i].id;
                    delete newOfi.documents[i].id
                }
                delete newUser.id;
                delete newOfi.id;
                newUser.orderNum = i;
                newOfi.orderNum = i;
                newUser.externalId = this.personsId[i];
                newOfi.externalId = this.ofiId[i];
                critGrp.criterias[i+1] = newUser;
                critGrp.criterias.push(newOfi);
            }
        })
        return this.license[0];
    }
    /**
     * Get license by id
     */
    public async refreshLicense(api : Api) : Promise<void> {
        const response = await superagent.get(api.basicUrl + api.request.changeLicense).
        set("cookie", `${this.cookie}`);
        this.fillLicense(0,response);
    }
    /**
     * Set the license status to "Waiting for the commission's decision"
     */
    public changeLicStatus() : TLicense {
        const waitForCommissionState: TLicAndDocStatus = this.licStatusByEnum(LicStatus.waitForCommission);
        this.license[0].stateId = waitForCommissionState.id;
        return this.license[0];
    }
}