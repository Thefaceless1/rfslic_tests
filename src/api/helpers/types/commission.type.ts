import {Templates} from "./prolicense.type";
import {TClubWorkers} from "./catalogs.type";

export type TCommission = {
    id?: number,
    typeId: number,
    type?: string,
    name: string,
    workDate: string,
    protocolName?: string,
    protocolStorageId?: string,
    licenses?: TLicenses[],
    files?: Templates[],
    members?: TClubWorkers[]
}
export type TLicenses = {
    licId: number,
    clubId: number,
    clubName: string,
    licType: string,
    season: string,
    licName: string,
    controlDate: string,
    comment: string,
    beginStateId: number,
    beginState: string,
    endStateId: number,
    endState: string
}
export type TDecision = {
    licStateId: number,
    controlDate: string,
    comment: string
}
export type TMembers = {
    userIds : number[]
}
export type TRequests = {
    licIds : number[]
}
export type TLicTypeReport = {
    licIds : number[],
    licType : string
}
export type TClubReport = {
    licIds : number[],
    clubId : number
}
export type TLicTypeText = {
    licType : number,
    text : string
}