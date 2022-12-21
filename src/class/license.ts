import {Catalogs} from "./catalogs";
import {TestData} from "./test-data";
import {Prolicense} from "./prolicense";

export class License {
    public static license : TLicense[] =[];
    public static createLicense () : TCreateLicense {
        return {
            proLicId : Prolicense.getProlicense(0).id as number,
            clubId : 0
        }
    }
    public static getLicStatusById(stateId : number) : string {
        const result  = Catalogs.licStatus.find(value => value.id == stateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    public static getDocStatusById(docStateId : number) : string {
        const result = Catalogs.docStatus.find(value => value.id == docStateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    public static addClubWorkersToCritGrp () {
        License.license[0].criteriaGroups.forEach((value, index) => {
            value.experts = [0,1,2];
        })
        return License.license[0].criteriaGroups;
    }
    public static addDocAndComToCritDoc () {
        License.license[0].criteriaGroups.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.documents.forEach((value2, index2) => {
                    value2.comment = TestData.commentValue;
                    value2.files = [
                        {
                            name: TestData.fileInfo[0][0],
                            storageId: TestData.fileInfo[0][1]
                        },
                        {
                            name: TestData.fileInfo[1][0],
                            storageId: TestData.fileInfo[1][1]
                        },
                        {
                            name: TestData.fileInfo[2][0],
                            storageId: TestData.fileInfo[2][1]
                        }
                    ]
                })
            })
        })
        return License.license[0];
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
            id: number,
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

