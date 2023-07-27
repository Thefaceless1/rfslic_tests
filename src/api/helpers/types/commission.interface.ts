import {TemplatesInterface} from "./prolicense.interface";
import {ClubExpertInterface} from "./catalogs.interface";

export interface CommissionInterface {
    id?: number,
    typeId: number,
    type?: string,
    name: string,
    workDate: string,
    protocolName?: string,
    protocolStorageId?: string,
    licenses?: LicensesInterface[],
    files?: TemplatesInterface[],
    members?: ClubExpertInterface[]
}

export interface LicensesInterface {
    licId: number,
    clubId: number,
    clubName: string,
    licType: string,
    licTypeId: number,
    season: string,
    licName: string,
    controlDate: string,
    comment: string,
    beginStateId: number,
    beginState: string,
    endStateId: number,
    endState: string
}

export interface DecisionInterface {
    licStateId: number,
    controlDate: string,
    comment: string
}

export interface MembersInterface {
    userIds: number[]
}

export interface RequestsInterface {
    licIds: number[]
}

export interface FormLicenseInterface {
    licId: number
}

export interface LicTypeReportInterface {
    licIds: number[],
    licType: number
}

export interface ClubReportInterface {
    licIds: number[],
    clubId: number
}

export interface LicTypeTextInterface {
    licType: number,
    text: string
}