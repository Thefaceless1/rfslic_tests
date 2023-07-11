import {Templates} from "./prolicense.type";
import {TClubWorkers, TOfi, TOrganization} from "./catalogs.type";

export type TCreateLicense = {
    proLicId: number,
    clubId: number
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
    external : {user: TClubWorkers,ofi: TClubWorkers},
    externalId: number,
    comment: string,
    percent: number,
    stateId: number,
    state: string,
    documents: TDocuments[]
}
export type TCriteriaGroups = {
    groupId: number,
    name: string,
    percent: number,
    stateId: number,
    state: string,
    conclusion: string,
    recommendation: string,
    reportName: string,
    reportStorageId: string,
    experts: number[],
    rfuExpertChoice: number[],
    rfuExpert: number,
    details: {
        experts: TClubWorkers[],
        rfuExpertChoice: TClubWorkers[],
        rfuExpert: TClubWorkers
    }
    criterias: TCriterias[]
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
    files: Templates[]
}
export type TRfuExpert = {
    rfuExpert: number
}
export type TExternal = {
    externalId: number
}
export type TAddDocStatus = {
    stateId: number,
    comment: string
}
export type TConclusion = {
    conclusion: string,
    recommendation: string,
    rplCriterias: string
}
export type TChangeLicStatus = {
    stateId: number,
    notActualGroupIds: number[]
}