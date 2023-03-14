import {TClubWorkers} from "./catalogs.type";

export type TProlicense = {
    id?: number
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
    stateId? : number
    documents :  TDocuments[]
}

export type TDocuments = {
    id?: number
    name: string,
    description : string
    docTypeId: number,
    templates: Templates[]
}
export type TSampleLicense = {
    type : string,
    season : string,
    name : string
}
export type Templates = {
    id?: number,
    name: string,
    storageId: string
}
export type TCriterias = {
    id: number,
    name : string,
    experts : number[],
    details : {
        experts : TClubWorkers[]
    }
    criterias : TCriteria[]
}
export type TCriteria = {
    id?: number,
    groupId: number,
    number: string,
    categoryId: number,
    name: string,
    description?: string,
    docSubmitDate: string,
    reviewDate: string,
    isMulti: number | null,
    typeId: number,
    documents: TDocuments[]
}