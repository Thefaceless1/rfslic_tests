import {Catalogs, TClubWorkers, TOfi, TOrganization} from "./catalogs";
import {TestData} from "./test-data";
import {Templates, TProlicense} from "./prolicense";
import {Response} from "superagent";

export class License {
    public license : TLicense[]
    public catalogs = new Catalogs()
    constructor() {
        this.license = []
    }
    /**
     * Add a license request
     */
    public createLicense (prolicense : TProlicense[]) : TCreateLicense {
        const firstClubId : number = this.catalogs.organization[0].id;
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
            document.files = TestData.files;
        })
        return this.license[0];
    }
    /**
     * Publish a license request
     */
    public publishLicense () : TLicense {
        this.license[0].stateId = 1;
        this.license[0].state = "Новая";
        return this.license[0];
    }
    /**
     * Get license status by 'License status' catalog id
     */
    public licStatusById(stateId : number) : string | null {
        if (!stateId) return null;
        else {
            const result  = this.catalogs.licStatus.find(value => value.id == stateId);
            return (result) ? result.name : "Статус по id не найден";
        }
    }
    /**
     * Get document status by 'Document status' catalog id
     */
    public docStatusById(docStateId : number) : string {
        const result = this.catalogs.docStatus.find(value => value.id == docStateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    /**
     * Add criteria groups experts and club workers for a criteria group
     */
    public addClubWorkersToCritGrp () : TLicense {
        const checkedClubWorkers : number[] = this.catalogs.clubWorkersId.
        filter(workerId => workerId != this.catalogs.critGrpExperts[0].id);
        this.license[0].criteriaGroups.forEach((value) => {
            value.experts = checkedClubWorkers;
            value.rfuExpert = this.catalogs.critGrpExperts[0].id;
        })
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
                        case 5 : documents.externalIds = this.catalogs.clubWorkersId; break;
                        case 6 : documents.externalIds = this.catalogs.ofiId; break;
                        case 9 : documents.externalIds = this.catalogs.orgId; break;
                        default : documents.files = TestData.files;
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
        this.license[0].documents.forEach((document) => {
            document.reviewComment = TestData.commentValue;
            document.stateId = this.catalogs.docStatus[TestData.randomIntForDocStat(this.catalogs.docStatus)].id;
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    document.reviewComment = TestData.commentValue;
                    document.stateId = this.catalogs.docStatus[TestData.randomIntForDocStat(this.catalogs.docStatus)].id;
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
            if (document.state == this.docStatusById(3) ||
                document.state == this.docStatusById(4) ||
                document.state == this.docStatusById(5))
                checkedDocsCount++;
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    allDocsCount++;
                    if (document.state == this.docStatusById(3) ||
                        document.state == this.docStatusById(4) ||
                        document.state == this.docStatusById(5))
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
     * Set the status "Issued" for a license
     */
    public addSolutionToLicense () : TLicense {
        this.license[0].stateId = this.catalogs.issuedLicStatus.id;
        this.license[0].state = this.catalogs.issuedLicStatus.name;
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
            conclusion : TestData.commentValue,
            recommendation : TestData.commentValue
        }
    }
    /**
     * Add participants and OFI for criteria with types Participant and OFI
     */
    public addOfiAndUsers() : TLicense {
        this.license[0].criteriaGroups.forEach(critGrp => {
            critGrp.criterias[1].externalId = this.catalogs.clubWorkersId[0];
            critGrp.criterias[2].externalId = this.catalogs.ofiId[0];
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
                newUser.externalId = this.catalogs.clubWorkersId[i];
                newOfi.externalId = this.catalogs.ofiId[i];
                critGrp.criterias[i+1] = newUser;
                critGrp.criterias.push(newOfi);
            }
        })
        return this.license[0];
    }
}

export type TCreateLicense = {
    proLicId : number,
    clubId : number
}
export type TLicense = {
    id: number,
    proLicId: number,
    type: string,
    season: string,
    name: string,
    begin: string,
    end: string,
    clubId: number,
    requestBegin: string,
    requestEnd: string,
    docSubmitDate: string,
    dueDate: string,
    reviewDate: string,
    decisionDate: string,
    percent: number,
    stateId: number,
    state: string,
    docStateId: number,
    docState: string,
    documents: {
        id: number,
        proDocId: number,
        name: string,
        docTypeId: number,
        comment: string,
        reviewComment: string,
        stateId: number,
        state: string,
        templates: {
            id: number,
            name: string,
            storageId: string
        }[],
        files : Templates[]
    }[],
    criteriaGroups : TCriteriaGroups[],
    conclusion: string,
    recommendation: string,
    rplCriterias: string
}
export type TExpertReport = {
    groupId: number,
    conclusion: string,
    recommendation: string
}
export type TCriterias = {
    id?: number,
    proCritId: number,
    number: string,
    categoryId: number,
    name: string,
    description: string,
    isMulti: number,
    typeId: number,
    orderNum: number,
    docSubmitDate: string,
    reviewDate: string,
    external : string,
    externalId: number,
    comment: string,
    percent: number,
    stateId: number,
    state: string,
    documents: TDocuments[]
}
export type TCriteriaGroups = {
    groupId : number,
    name : string,
    percent : number,
    stateId : number,
    state : string,
    conclusion : string,
    recommendation : string,
    reportName : string,
    reportStorageId : string,
    experts : number[],
    rfuExpertChoice : number[],
    rfuExpert : number,
    details : {
        experts :TClubWorkers[],
        rfuExpertChoice : TClubWorkers[],
        rfuExpert : TClubWorkers
    }
    criterias : TCriterias[]
}
export type TDocuments = {
    id?: number,
    proDocId: number,
    name: string,
    docTypeId: number,
    comment: string,
    reviewComment: string,
    externalIds : number[],
    externals : TOfi[] | TOrganization[],
    stateId: number,
    state: string,
    templates: {
        id: number,
        name: string,
        storageId: string
    }[],
    files : Templates[]
}