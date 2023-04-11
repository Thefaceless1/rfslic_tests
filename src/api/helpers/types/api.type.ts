import {TProlicense} from "./prolicense.type";
import {TLicense} from "./license.type";
import {Admin} from "../admin";
import {Commission} from "../commission";

export type TConstructor = {
    seasons : string,
    critGroups : string,
    licTypes : string,
    docTypes : string,
    rankCriterias : string,
    criteriaTypes : string,
    createProlicense : string,
    changeCriterias : string,
    changeProlicense? : string,
    createCriteriaGrp? : string,
    createCriterias? : string,
    cloneProlicense? : string,
    deleteProlicense? : string,
    publishProlicense? : string,
    unpublishProlicense? : string,
    deleteCriteriasGrp? : string,
    fillApi (prolicense : TProlicense[]) : void
}
export type TUpload = {
    upload : string
}
export type TRequest = {
    requestStatus : string,
    docStatus : string,
    createLicense : string,
    requestsList : string,
    deleteReqFile : string,
    deleteDocFile : string,
    changeLicense? : string,
    publishLicense? : string,
    createExpertReport? : string,
    checkDocument? : string,
    clubWorkers? : string,
    fillApi (license : TLicense,groupId? : number) : void
}
export type TUser = {
    persons : string,
    critGrpExperts : string,
    organization : string,
    activeUsers : string,
    currentUser : string,
    setUser? : string,
    fillApi (userId : number) : void
}
export type TInfraObject = {
    ofi : string
}
export type TAdmin = {
    addUser : string,
    roles : string,
    addRole : string,
    rights : string
    changeCritGroup : string,
    changeCritRank : string,
    changeUserRole? : string,
    changeUser? : string,
    deleteRole? : string,
    deleteCriteriaGroup? : string,
    deleteCriteriaRank? : string,
    fillApi(admin : Admin) : void
}
export type TCommissions = {
    commissionTypes : string,
    commissionDecisions : string,
    createCommission : string,
    addLicenseText : string,
    formLicense : string,
    deleteFile : string,
    addRequests? : string,
    getCommission? : string,
    deleteRequest? : string,
    commissionTypeMembers? : string,
    commissionMembers? : string,
    addProtocol? : string,
    addReportByType? : string,
    addReportByClub? : string,
    changeCommissionRequest(commission : Commission, licId : number) : string,
    fillApi(commission : Commission) : void
}