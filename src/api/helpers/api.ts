import {TProlicense} from "../class/prolicense";

export class Api {
    public readonly basicUrl : string = "https://rfs-lic-test-01.fors.ru";
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
    public request : TRequest = {
        requestStatus : "/api/rest/licenses/states",
        docStatus : "/api/rest/licenses/docstates",
        createLicense : "/api/rest/licenses"
    }
    public upload : TUpload = {
        upload : "/api/rest/uploadFile"
    }
    public user : TUser = {
        clubWorkers : "/api/rest/persons/findbyparams",
        critGrpExperts : "/api/rest/persons/withRights"
    }
    public infraObject : TInfraObject  = {
        ofi : "/api/rest/objects/findbyparams"
    }
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
    public fillLicenseApi (licenseId : number) : void {
            this.request.changeLicense = `/api/rest/licenses/${licenseId}`;
            this.request.publishLicense = `${this.request.changeLicense}/publish`;
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
    changeLicense? : string,
    publishLicense? : string
}
export type TUser = {
    clubWorkers : string,
    critGrpExperts : string
}
export type TInfraObject = {
    ofi : string
}

