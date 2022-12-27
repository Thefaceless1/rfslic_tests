import {Catalogs, TClubWorkers, TLicAndDocStatus} from "./catalogs";
import {TestData} from "./test-data";
import {Prolicense, TProlicense} from "./prolicense";
import {randomInt} from "crypto";

export class License {
    public static license : TLicense[] =[];
    public static createLicense (prolicense : TProlicense[]) : TCreateLicense {
        return {
            proLicId : Prolicense.getProlicense(prolicense,0).id as number,
            clubId : 0
        }
    }
    public static addResponseToLicense (index : number,response : TLicense) : void {
        this.license[index] = response;
    }
    public static addCommentsAndDocuments () : TLicense {
        this.license[0].documents.forEach((value, index) => {
            value.comment = TestData.commentValue;
            value.files = TestData.files;
        })
        return this.license[0];
    }
    public static publishLicense () : TLicense {
        this.license[0].stateId = 1;
        this.license[0].state = "Новая";
        return this.license[0];
    }
    public static getLicStatusById(stateId : number, licStatus : TLicAndDocStatus[]) : string | null {
        if (!stateId) return null;
        else {
            const result  = licStatus.find(value => value.id == stateId);
            return (result) ? result.name : "Статус по id не найден";
        }
    }
    public static getDocStatusById(docStateId : number, docStatus : TLicAndDocStatus[]) : string {
        const result = docStatus.find(value => value.id == docStateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    public static addClubWorkersToCritGrp (clubWorkers : TClubWorkers[],criGrpExperts : TClubWorkers[]) : TLicense {
        this.license[0].criteriaGroups.forEach((value, index) => {
            value.experts = Catalogs.getClubWorkersId(clubWorkers);
            value.rfuExpert = criGrpExperts[0].id;
        })
        return this.license[0];
    }
    public static addDocAndComToCritDoc () {
        this.license[0].criteriaGroups.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.documents.forEach((value2, index2) => {
                    value2.comment = TestData.commentValue;
                    value2.files = TestData.files
                })
            })
        })
        return this.license[0];
    }
    public static addStatusToDocuments (docStatus : TLicAndDocStatus[]) : TLicense {
        this.license[0].criteriaGroups.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.documents.forEach((value2, index2) => {
                    value2.reviewComment = TestData.commentValue;
                    value2.stateId = docStatus[randomInt(0,5)].id;
                })
            })
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
        files : {
            id?: number,
            name: string,
            storageId: string
        }[]
    }[],
    criteriaGroups : {
        groupId : number,
        name : string,
        percent : number,
        stateId : number,
        state : string,
        experts : number[],
        rfuExpertChoice : number[],
        rfuExpert : number,
        details : {
            experts :TClubWorkers[],
            rfuExpertChoice : TClubWorkers[],
            rfuExpert : TClubWorkers
        }
        criterias : {
            id: number,
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
            externalId: number,
            comment: string,
            percent: number,
            stateId: number,
            state: string,
            documents: {
                id: number,
                proDocId: number,
                name: string,
                docTypeId: number,
                comment: string,
                reviewComment: string,
                externalId : number,
                stateId: number,
                state: string,
                templates: {
                    id: number,
                    name: string,
                    storageId: string
                }[],
                files : {
                    id?: number,
                    name: string,
                    storageId: string
                }[]
            }[]
        }[]
    }[]
}

