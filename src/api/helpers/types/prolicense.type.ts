import {TClubWorkers} from "./catalogs.type";

export type TProlicense = {
    id?: number
    type: number
    season: string | number
    seasonId?: number
    name: string
    proLicType: number
    begin: string | null
    end: string | null
    requestBegin: string
    requestEnd: string
    docSubmitDate: string
    dueDate: string | null
    reviewDate: string
    decisionDate: string
    stateId? : number
    documents:  TDocuments[]
}

export type TDocuments = {
    id?: number
    name: string,
    description: string
    docTypeId: number,
    templates: Templates[]
}
export type TSampleProlicense = {
    type: number,
    season: number,
    name: string
}
export type Templates = {
    id?: number,
    name: string,
    storageId: string
}
export type TDocumentsAndComments = {
    files: Templates[],
    comment: string
}
export type TCriteriaGroup = {
    id: number,
    name: string,
    experts: number[],
    details: {
        experts: TClubWorkers[]
    }
    criterias: TCriteria[]
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