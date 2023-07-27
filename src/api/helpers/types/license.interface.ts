import {TemplatesInterface} from "./prolicense.interface";
import {ClubWorkersInterface, OfiInterface, OrganizationInterface} from "./catalogs.interface";

export interface CreateLicenseInterface {
    proLicId: number,
    clubId: number
}

export interface LicenseInterface {
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
        files : TemplatesInterface[]
    }[],
    criteriaGroups : CriteriaGroupsInterface[],
    conclusion: string,
    recommendation: string,
    rplCriterias: string
}

export interface ExpertReportInterface {
    groupId: number,
    recommendation: string
}

export interface CriteriasInterface {
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
    external : {user: ClubWorkersInterface,ofi: ClubWorkersInterface},
    externalId: number,
    comment: string,
    percent: number,
    stateId: number,
    state: string,
    documents: DocumentsInterface[]
}

export interface CriteriaGroupsInterface {
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
        experts: ClubWorkersInterface[],
        rfuExpertChoice: ClubWorkersInterface[],
        rfuExpert: ClubWorkersInterface
    }
    criterias: CriteriasInterface[]
}

export interface DocumentsInterface {
    id?: number,
    proDocId: number,
    name: string,
    docTypeId: number,
    comment: string,
    reviewComment: string,
    externalIds : number[],
    externals : OfiInterface[] | OrganizationInterface[],
    stateId: number,
    state: string,
    templates: {
        id: number,
        name: string,
        storageId: string
    }[],
    files: TemplatesInterface[]
}

export interface RfuExpertInterface {
    rfuExpert: number
}

export interface ExternalInterface {
    externalId: number
}

export interface AddDocStatusInterface {
    stateId: number,
    comment: string
}

export interface ConclusionInterface {
    conclusion: string,
    recommendation: string,
    rplCriterias: string
}

export interface ChangeLicStatusInterface {
    stateId: number,
    notActualGroupIds: number[]
}