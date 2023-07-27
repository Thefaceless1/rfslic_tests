import {ClubWorkersInterface} from "./catalogs.interface";

export interface ProlicenseInterface {
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
    documents:  DocumentsInterface[]
}

export interface DocumentsInterface {
    id?: number
    name: string,
    description: string
    docTypeId: number,
    templates: TemplatesInterface[]
}

export interface SampleProlicInterface {
    type: number,
    season: number,
    name: string
}

export interface TemplatesInterface {
    id?: number,
    name: string,
    storageId: string
}

export interface DocAndCommentInterface {
    files: TemplatesInterface[],
    comment: string
}

export interface CriteriaGroupInterface {
    id: number,
    name: string,
    experts: number[],
    details: {
        experts: ClubWorkersInterface[]
    }
    criterias: CriteriaInterface[]
}

export interface CriteriaInterface {
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
    documents: DocumentsInterface[]
}