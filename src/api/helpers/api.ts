import {TProlicense} from "../class/prolicense";
import {Admin} from "../class/admin";
import {Commission} from "../class/commission";

export class Api {
    public readonly basicUrl : string = "https://rfs-lic-test-01.fors.ru";
    /**
     * Апи constructor-controller
     */
    public constructors : TConstructor = {
        seasons : "/api/rest/seasons",
        critGroups : "/api/rest/prolicenses/criterias/groups",
        licTypes : "/api/rest/lictypes",
        docTypes : "/api/rest/doctypes",
        rankCriterias : "/api/rest/prolicenses/criterias/categories",
        criteriaTypes : "/api/rest/prolicenses/criterias/types",
        createProlicense : "/api/rest/prolicenses",
        changeCriterias : `/api/rest/prolicenses/criterias/`
    }
    /**
     * Апи request-controller
     */
    public request : TRequest = {
        requestStatus : "/api/rest/licenses/states",
        docStatus : "/api/rest/licenses/docstates",
        createLicense : "/api/rest/licenses",
        requestsList : "/api/rest/licenses/find"
    }
    /**
     * Апи upload-controller
     */
    public upload : TUpload = {
        upload : "/api/rest/uploadFile"
    }
    /**
     * Апи user-controller
     */
    public user : TUser = {
        clubWorkers : "/api/rest/persons/findbyparams",
        critGrpExperts : "/api/rest/persons/withRights",
        organization : "/api/rest/organizations/find"
    }
    /**
     * Апи infra-object-controller
     */
    public infraObject : TInfraObject  = {
        ofi : "/api/rest/objects/findbyparams"
    }
    /**
     * Апи admin-controller
     */
    public admin : TAdmin = {
        addUser : "/api/rest/admin/users",
        roles : "/api/rest/admin/roles",
        addRole : "/api/rest/admin/roles",
        rights : "/api/rest/admin/rights"
    }
    public commissions : TCommissions = {
        commissionTypes : "/api/rest/commissions/types",
        commissionDecisions : "/api/rest/commissions/decisions",
        createCommission : "/api/rest/commissions",
        changeCommissionRequest(commission : Commission, licId : number) : string {
            return `/api/rest/commissions/${commission.commission[0].id}/licenses/${licId}`;
        }
    }
    /**
     * Заполнение свойств объекта constructors , которые требуют наличия id пролицензии
     */
    public fillProlicenseApi (prolicense : TProlicense[]) : void {
        if (prolicense.length == 1) {
            this.constructors.changeProlicense = `/api/rest/prolicenses/${prolicense[0].id}`;
            this.constructors.createCriteriaGrp = `${this.constructors.changeProlicense}/criterias/groupExperts`;
            this.constructors.createCriterias = `${this.constructors.changeProlicense}/criterias`;
            this.constructors.cloneProlicense = `/api/rest/prolicenses/clone/${prolicense[0].id}`;
            this.constructors.publishProlicense = `/api/rest/prolicenses/${prolicense[0].id}/publish`;
            this.constructors.unpublishProlicense = `/api/rest/prolicenses/${prolicense[0].id}/unpublish`
            this.constructors.deleteCriteriasGrp = `/api/rest/prolicenses/${prolicense[0].id}/criterias/groups/`;
        }
            else  {
            this.constructors.deleteProlicense = `/api/rest/prolicenses/${prolicense[1].id}`
        }
    }
    /**
     * Заполнение свойств объекта request , которые требуют наличия id заявки
     */
    public fillLicenseApi (licenseId : number) : void {
            this.request.changeLicense = `/api/rest/licenses/${licenseId}`;
            this.request.publishLicense = `${this.request.changeLicense}/publish`;
            this.request.createExpertReport = `${this.request.changeLicense}/groupReport/generate`;
    }
    public fillAdminApi(admin : Admin) : void {
        this.admin.changeUserRole = `/api/rest/admin/users/${admin.user[0].id}/newRole`;
        this.admin.changeUser = `/api/rest/admin/users/${admin.user[0].id}`;
        if(admin.role.length == 1) this.admin.deleteRole = `/api/rest/admin/roles/${admin.role[0].id}`;
    }
    public fillCommissionApi(commission : Commission) : void {
        this.commissions.addRequests = `/api/rest/commissions/${commission.commission[0].id}/licenses`;
        this.commissions.getCommission = `/api/rest/commissions/${commission.commission[0].id}`;
        if(commission.commission[0].licenses && commission.commission[0].licenses.length > 0) {
            this.commissions.deleteRequest = `${this.commissions.addRequests}/${commission.commission[0].licenses[0].licId}`;
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
    createProlicense : string
    changeCriterias : string
    changeProlicense? : string
    createCriteriaGrp? : string
    createCriterias? : string
    cloneProlicense? : string
    deleteProlicense? : string
    publishProlicense? : string
    unpublishProlicense? : string
    deleteCriteriasGrp? : string
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
    createExpertReport? : string
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
    deleteRole? : string
}
export type TCommissions = {
    commissionTypes : string,
    commissionDecisions : string,
    createCommission : string,
    changeCommissionRequest(commission : Commission, licId : number) : string,
    addRequests? : string,
    getCommission? : string,
    deleteRequest? : string
}

