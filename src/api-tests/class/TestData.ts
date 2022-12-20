import * as fs from "fs";
import {RequestProp} from "./RequestProp";
import {randomInt} from "crypto";


export class TestData {
    public static fileInfo: [string, string][] = [];
    public static readonly fileNames = fs.readdirSync(RequestProp.fileDir);
    public static readonly dateNow: string = new Date().toLocaleDateString().split(".").reverse().join("-");
    public static readonly dateFuture: string = new Date(Date.now() + 5000000000).toLocaleDateString().split(".").reverse().join("-");
    public static readonly commentValue : string = "Тестовый комментарий";
    public static readonly descValue : string = "Тестовое описание";
    public static seasons: TCurrentSeason[] = [];
    public static criteriaGroups: TCriteriaGroups[] = [];
    public static licTypes: TLicTypes[] = [];
    public static docTypes: TDocTypes[] = [];
    public static rankCriteria : TRankCriteria[] =[];
    public static criteriaTypes : TCriteriaTypes[] =[];
    public static licStatus : TLicAndDocStatus[] =[];
    public static docStatus : TLicAndDocStatus[] =[];
    public static criteriasFullInfo : TCriteriaFullInfo[] =[];
    public static prolicense : TProlicense[] = [];
    public static license : TLicense[] =[];

    public static getRandomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
    public static getLicStatusById(stateId : number) : string {
        const result  = TestData.licStatus.find(value => value.id == stateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    public static getDocStatusById(docStateId : number) : string {
        const result = TestData.docStatus.find(value => value.id == docStateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    public static addClubWorkersToCritGrp () {
        TestData.license[0].criteriaGroups.forEach((value, index) => {
            value.experts = [0,1,2];
        })
        return TestData.license[0].criteriaGroups;
    }
    public static addDocAndComToCritDoc () {
        TestData.license[0].criteriaGroups.forEach((value, index) => {
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
        return TestData.license[0];
    }

}
export type TCurrentSeason = {
    id: number,
    current: boolean,
    dateStart: string,
    dateEnd: string,
    name: string
}
export type TCriteriaGroups = {
    id:number,
    name : string
}

export type TLicTypes = {
    id : number,
    name : string,
    sysName : string,
    description : string
}
export type TDocTypes = {
    id: number,
    name : string,
    description : string
}
export type TRankCriteria = {
    id : number,
    code : string,
    description : string
}
export type TCriteriaTypes = {
    id : number,
    name : string,
    description : string
}
export type TLicAndDocStatus = {
    id: number,
    name: string,
    description: string
}

export type TProlicense = {
    id : number
    type: string
    season: string
    name: string
    begin: string
    end: string
    requestBegin: string
    requestEnd: string
    docSubmitDate: string
    dueDate: string
    reviewDate: string
    decisionDate: string
    stateId : number
    documents :  TDocuments[]
}

export type TDocuments = {
    id: number
    name: string,
    docTypeId: number,
    templates: {
        id: number,
        name: string,
        storageId: string
    }[]
}

export type TCriteriaFullInfo = {
    id: number,
    name : string,
    experts : number[],
    criterias : {
        id: number,
        groupId: number,
        number: string,
        categoryId: number,
        name: string,
        description?: string,
        docSubmitDate: string,
        reviewDate: string,
        isMulti: number,
        typeId: number,
        documents: TDocuments[]
    }[]
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