import superagent from "superagent";
import {Api} from "./api";
import {LicStatus} from "./enums/license-status";
import {Authorization} from "./authorization";
import {FileReader} from "./file-reader";
import {TClubWorkers, TCommissionType, TCommissionTypeMember, TCriteriaGroups, TCriteriaTypes,
    TDocTypes, TLicAndDocStatus, TLicTypes, TOfi, TOrganization,
    TRankCriteria, TRights, TRoles, TSeasons, commissionDecision, TFiles} from "./types/catalogs.type";

export class Catalogs extends Authorization {
    /**
     * files - uploaded files
     * seasons - catalog 'Seasons'
     * criteriaGroups - catalog 'Criteria Groups'
     * licTypes - catalog 'License types'
     * docTypes - catalog 'Documents types'
     * rankCriteria - catalog 'Criteria ranks'
     * criteriaTypes - catalog 'Criteria types'
     * licStatus - catalog 'License status'
     * docStatus - catalog 'Documents status'
     * critGrpExperts - catalog 'Criteria groups experts'
     * clubWorkers - catalog 'Club workers'
     * ofi - catalog 'OFI'
     * organization - catalog 'Organizations'
     * roles - catalog 'User roles'
     * rights - catalog 'User rights'
     * commissionType - catalog 'Commission types'
     * commissionSolution - catalog 'Commission solutions'
     * commissionMembers - catalog 'Commission members'
     */
    constructor(
        public files : TFiles[] = [],
        public  seasons: TSeasons[] = [],
        public  criteriaGroups: TCriteriaGroups[] = [],
        public  licTypes: TLicTypes[] = [],
        public  docTypes: TDocTypes[] = [],
        public  rankCriteria : TRankCriteria[] = [],
        public  criteriaTypes : TCriteriaTypes[] = [],
        public  licStatus : TLicAndDocStatus[] = [],
        public  docStatus : TLicAndDocStatus[] = [],
        public  critGrpExperts : TClubWorkers[] = [],
        public  clubWorkers : TClubWorkers[] = [],
        public  ofi : TOfi[] = [],
        public organization : TOrganization[] = [],
        public roles : TRoles[] = [],
        public rights : TRights[] = [],
        public commissionTypes : TCommissionType[] = [],
        public commissionDecision : commissionDecision[] = [],
        public commissionTypeMembers : TCommissionTypeMember[] = []
    ) {
        super()
    }
    /**
     * ids of "Club workers" catalog elements
     */
    public get clubWorkersId () : number[] {
        return this.clubWorkers.map(value => value.id);
    }
    /**
     * ids of "Criteria groups" catalog elements
     */
    public get criteriaGrpId() : number[] {
        return this.criteriaGroups.map(value => value.id);
    }
    /**
     * ids of "Criteria groups experts" catalog elements
     */
    public get critGrpExpertsId () : number[] {
        return this.critGrpExperts.map(value => value.id);
    }
    /**
     * ids of "OFI" catalog elements
     */
    public get ofiId () : number[] {
        return this.ofi.map(value => value.id);
    }
    /**
     * ids of "Organization" catalog elements
     */
    public get orgId () : number[] {
        return this.organization.map(value => value.id);
    }
    /**
     * Get "License status" by enum
     */
    public licStatusByEnum (statusValue : LicStatus) : TLicAndDocStatus {
        return this.licStatus.find(value => value.name == statusValue)!;
    }
    /**
     * ids of "User roles" catalog elements
     */
    public get rolesId() : number[] {
        return this.roles.map(value => value.id);
    }
    /**
     * ids of "Commission types" catalog elements
     */
    public get commissionTypesId() : number[] {
        return this.commissionTypes.map(value => value.id);
    }
    /**
     * ids of "Commission types members" catalog elements
     */
    public get commissionTypeMembersId() : number[] {
        return this.commissionTypeMembers.map(value => value.id);
    }
    /**
     * ids of "License types" catalog elements
     */
    public get licTypeIds() : number[] {
        return this.licTypes.map(value => value.id);
    }
    /**
     * ids of "User rights" catalog elements
     */
    public get rightsId() : string[] {
        const rightsId : string[] =[];
        this.rights.forEach(right => {
            right.children.forEach(child => {
                rightsId.push(child.id);
            })
        })
        return rightsId;
    }
    /**
     * Upload files to the server
     */
    public async uploadFiles() : Promise<void> {
        if (this.files.length == FileReader.fileNames.length) return;
        const api = new Api();
        for (const fileName of FileReader.fileNames) {
            const files = await superagent.post(api.basicUrl + api.upload.upload).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            set("cookie", `${this.cookie}`).
            attach("file", FileReader.fileDir + fileName);
            this.addDataToFiles(fileName,files.body.data);
        }
    }
    /**
     * Add data to the 'files' array
     */
    private addDataToFiles (name : string, id: string) : void {
        this.files.push({name : name, storageId : id})
    }
    /**
     * Get catalogs data by api
     */
    public async fillCatalogsData () : Promise<void> {
        const api = new Api();
        const seasons = await superagent.get(api.basicUrl + api.constructors.seasons).
        set("cookie", `${this.cookie}`);
        this.seasons = seasons.body.data;

        const groupCriterias = await superagent.get(api.basicUrl + api.constructors.critGroups).
        set("cookie", `${this.cookie}`);
        this.criteriaGroups = groupCriterias.body.data;

        const licenseType = await superagent.get(api.basicUrl + api.constructors.licTypes).
        set("cookie", `${this.cookie}`);
        this.licTypes = licenseType.body.data;

        const docTypes = await superagent.get(api.basicUrl + api.constructors.docTypes).
        set("cookie", `${this.cookie}`);
        this.docTypes = docTypes.body.data;

        const criteriaRanks = await superagent.get(api.basicUrl + api.constructors.rankCriterias).
        set("cookie", `${this.cookie}`);
        this.rankCriteria = criteriaRanks.body.data;

        const criteriaTypes = await superagent.get(api.basicUrl + api.constructors.criteriaTypes).
        set("cookie", `${this.cookie}`);
        this.criteriaTypes = criteriaTypes.body.data;

        const requestStatus = await superagent.get(api.basicUrl + api.request.requestStatus).
        set("cookie", `${this.cookie}`);
        this.licStatus = requestStatus.body.data;

        const docStatus = await superagent.get(api.basicUrl + api.request.docStatus).
        set("cookie", `${this.cookie}`);
        this.docStatus = docStatus.body.data;

        const clubWorkers = await superagent.get(api.basicUrl+api.user.clubWorkers).
        query({pageNum : 2, pageSize : 10}).
        set("cookie", `${this.cookie}`);
        this.clubWorkers = clubWorkers.body.data;

        const critGrpExperts = await superagent.get(api.basicUrl+api.user.critGrpExperts).
        query({rights : "request.checkExpert"}).
        set("cookie", `${this.cookie}`);
        this.critGrpExperts = critGrpExperts.body.data;

        const ofi = await superagent.get(api.basicUrl + api.infraObject.ofi).
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`);
        this.ofi = ofi.body.data;

        const organization = await superagent.get(api.basicUrl + api.user.organization).
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`);
        this.organization = organization.body.data;

        const roles = await superagent.get(api.basicUrl + api.admin.roles).
        set("cookie", `${this.cookie}`);
        this.roles = roles.body.data;

        const rights = await superagent.get(api.basicUrl + api.admin.rights).
        set("cookie", `${this.cookie}`);
        this.rights = rights.body.data;

        const commission = await superagent.get(api.basicUrl + api.commissions.commissionTypes).
        set("cookie", `${this.cookie}`);
        this.commissionTypes = commission.body.data;

        const commissionDecision = await superagent.get(api.basicUrl + api.commissions.commissionDecisions).
        set("cookie", `${this.cookie}`);
        this.commissionDecision = commissionDecision.body.data;

        const commissionTypeMembers = await superagent.get(api.basicUrl + api.admin.addUser).
        query({pageNum : 0, pageSize : 10, rights : "commission.member"}).
        set("cookie", `${this.cookie}`);
        this.commissionTypeMembers = commissionTypeMembers.body.data;
    }
}