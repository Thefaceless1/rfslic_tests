import {TProlicense} from "./prolicense";
import {Admin} from "./admin";
import {Commission} from "./commission";

export class Api {
    public readonly basicUrl : string = "https://rfs-lic-test-01.fors.ru";
    /**
     * Api constructor-controller
     */
    public constructors : TConstructor = {
        seasons : "/api/rest/seasons",
        critGroups : "/api/rest/prolicenses/criterias/groups",
        licTypes : "/api/rest/lictypes",
        docTypes : "/api/rest/doctypes",
        rankCriterias : "/api/rest/prolicenses/criterias/categories",
        criteriaTypes : "/api/rest/prolicenses/criterias/types",
        createProlicense : "/api/rest/prolicenses",
        changeCriterias : `/api/rest/prolicenses/criterias/`,
        fillApi (prolicense : TProlicense[]) : void {
            if (prolicense.length == 1) {
                this.changeProlicense = `/api/rest/prolicenses/${prolicense[0].id}`;
                this.createCriteriaGrp = `${this.changeProlicense}/criterias/groupExperts`;
                this.createCriterias = `${this.changeProlicense}/criterias`;
                this.cloneProlicense = `/api/rest/prolicenses/clone/${prolicense[0].id}`;
                this.publishProlicense = `/api/rest/prolicenses/${prolicense[0].id}/publish`;
                this.unpublishProlicense = `/api/rest/prolicenses/${prolicense[0].id}/unpublish`
                this.deleteCriteriasGrp = `/api/rest/prolicenses/${prolicense[0].id}/criterias/groups/`;
            }
            else  {
                this.deleteProlicense = `/api/rest/prolicenses/${prolicense[1].id}`
            }
        }
    }
    /**
     * Api request-controller
     */
    public request : TRequest = {
        requestStatus : "/api/rest/licenses/states",
        docStatus : "/api/rest/licenses/docstates",
        createLicense : "/api/rest/licenses",
        requestsList : "/api/rest/licenses/find",
        fillApi (licenseId : number) : void {
            this.changeLicense = `/api/rest/licenses/${licenseId}`;
            this.publishLicense = `${this.changeLicense}/publish`;
            this.createExpertReport = `${this.changeLicense}/groupReport/generate`;
        }
    }
    /**
     * Api upload-controller
     */
    public upload : TUpload = {
        upload : "/api/rest/uploadFile"
    }
    /**
     * Api user-controller
     */
    public user : TUser = {
        clubWorkers : "/api/rest/persons/findbyparams",
        critGrpExperts : "/api/rest/persons/withRights",
        organization : "/api/rest/organizations/find"
    }
    /**
     * Api infra-object-controller
     */
    public infraObject : TInfraObject  = {
        ofi : "/api/rest/objects/findbyparams"
    }
    /**
     * Api admin-controller
     */
    public admin : TAdmin = {
        addUser : "/api/rest/admin/users",
        roles : "/api/rest/admin/roles",
        addRole : "/api/rest/admin/roles",
        rights : "/api/rest/admin/rights",
        fillApi(admin : Admin) : void {
            this.changeUserRole = `/api/rest/admin/users/${admin.user[0].id}/newRole`;
            this.changeUser = `/api/rest/admin/users/${admin.user[0].id}`;
            if(admin.role.length == 1) this.deleteRole = `/api/rest/admin/roles/${admin.role[0].id}`;
        }
    }
    /**
     * Api commission-controller
     */
    public commissions : TCommissions = {
        commissionTypes : "/api/rest/commissions/types",
        commissionDecisions : "/api/rest/commissions/decisions",
        createCommission : "/api/rest/commissions",
        addLicenseText : "/api/rest/commissions/licenseText",
        formLicense : "/api/rest/commissions/formLicense",
        changeCommissionRequest(commission : Commission, licId : number) : string {
            return `${this.createCommission}/${commission.commission[0].id}/licenses/${licId}`;
        },
        fillApi(commission : Commission) : void {
            this.addRequests = `${this.createCommission}/${commission.commission[0].id}/licenses`;
            this.getCommission = `${this.createCommission}/${commission.commission[0].id}`;
            this.commissionTypeMembers = `${this.createCommission}/types/${commission.catalogs.commissionTypesId[0]}/members`;
            this.commissionMembers = `${this.createCommission}/${commission.commission[0].id}/members`;
            this.addProtocol = `${this.createCommission}/${commission.commission[0].id}/protocol`;
            this.addReportByType = `${this.createCommission}/${commission.commission[0].id}/files/byType`;
            this.addReportByClub = `${this.createCommission}/${commission.commission[0].id}/files/byClub`;
            if(commission.commission[0].licenses && commission.commission[0].licenses.length > 0) {
                this.deleteRequest = `${this.addRequests}/${commission.commission[0].licenses[0].licId}`;
            }
        }
    }
}
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
    changeLicense? : string,
    publishLicense? : string,
    createExpertReport? : string,
    fillApi (licenseId : number) : void
}
export type TUser = {
    clubWorkers : string,
    critGrpExperts : string,
    organization : string
}
export type TInfraObject = {
    ofi : string
}
export type TAdmin = {
    addUser : string,
    roles : string,
    addRole : string,
    rights : string
    changeUserRole? : string,
    changeUser? : string,
    deleteRole? : string,
    fillApi(admin : Admin) : void
}
export type TCommissions = {
    commissionTypes : string,
    commissionDecisions : string,
    createCommission : string,
    addLicenseText : string,
    formLicense : string,
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

