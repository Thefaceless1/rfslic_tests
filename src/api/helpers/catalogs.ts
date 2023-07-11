import superagent from "superagent";
import {LicStatus} from "./enums/license-status";
import {Authorization} from "./authorization";
import {FileReader} from "./file-reader";
import {
    TClubWorkers, TCommissionType, TCommissionTypeMember, TCriteriaGroups, TCriteriaTypes,
    TDocTypes, TLicAndDocStatus, TLicTypes, TOfi, TOrganization,
    TRankCriteria, TRights, TRoles, TSeasons, commissionDecision, TFiles
} from "./types/catalogs.type";
import {RequestApi} from "./api/request.api";
import {UserApi} from "./api/user.api";
import {DictionaryApi} from "./api/dictionary.api";
import {UploadApi} from "./api/upload.api";
import {InfraObjectsApi} from "./api/infraobjects.api";
import {AdminApi} from "./api/admin.api";
import {CommissionApi} from "./api/commission.api";

export class Catalogs extends Authorization {
    constructor(
        public files: TFiles[] = [],
        public  seasons: TSeasons[] = [],
        public  criteriaGroups: TCriteriaGroups[] = [],
        public  licTypes: TLicTypes[] = [],
        public  docTypes: TDocTypes[] = [],
        public  rankCriteria: TRankCriteria[] = [],
        public  criteriaTypes: TCriteriaTypes[] = [],
        public  licStatus: TLicAndDocStatus[] = [],
        public  docStatus: TLicAndDocStatus[] = [],
        public  critGrpExperts: TClubWorkers[] = [],
        public  persons: TClubWorkers[] = [],
        public  ofi: TOfi[] = [],
        public organization: TOrganization[] = [],
        public roles: TRoles[] = [],
        public rights: TRights[] = [],
        public commissionTypes: TCommissionType[] = [],
        public commissionDecision: commissionDecision[] = [],
        public commissionTypeMembers: TCommissionTypeMember[] = [],
    ) {
        super()
    }
    /**
     * ids of "Club workers" catalog elements
     */
    public get personsId(): number[] {
        return this.persons.map(value => value.id);
    }
    /**
     * ids of "Criteria groups" catalog elements
     */
    public get criteriaGrpId(): number[] {
        return this.criteriaGroups.map(value => value.id);
    }
    /**
     * ids of "Criteria groups experts" catalog elements
     */
    public get critGrpExpertsId(): number[] {
        return this.critGrpExperts.map(value => value.id);
    }
    /**
     * ids of "OFI" catalog elements
     */
    public get ofiId(): number[] {
        return this.ofi.map(value => value.id);
    }
    /**
     * ids of "Organization" catalog elements
     */
    public get orgId(): number[] {
        return this.organization.map(value => value.id);
    }
    /**
     * Get "License status" by enum
     */
    public licStatusByEnum(statusValue : LicStatus): TLicAndDocStatus {
        return this.licStatus.find(value => value.name == statusValue)!;
    }
    /**
     * ids of "User roles" catalog elements
     */
    public get rolesId(): number[] {
        return this.roles.map(value => value.id);
    }
    /**
     * ids of "Commission types" catalog elements
     */
    public get commissionTypesId(): number[] {
        return this.commissionTypes.map(value => value.id);
    }
    /**
     * ids of "Commission types members" catalog elements
     */
    public get commissionTypeMembersId(): number[] {
        return this.commissionTypeMembers.map(value => value.id);
    }
    /**
     * ids of "License types" catalog elements
     */
    public get licTypeIds(): number[] {
        return this.licTypes.map(value => value.id);
    }
    /**
     * ids of "User rights" catalog elements
     */
    public get rightsId(): string[] {
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
    public async uploadFiles(): Promise<void> {
        if (this.files.length == FileReader.fileNames.length) return;
        for (const fileName of FileReader.fileNames) {
            const files = await superagent.post(UploadApi.uploadFiles).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token).
            attach("file", FileReader.fileDir + fileName);
            this.addDataToFiles(fileName,files.body.data);
        }
    }
    /**
     * Add data to the 'files' array
     */
    private addDataToFiles(name: string, id: string): void {
        this.files.push({name : name, storageId : id})
    }
    /**
     * Get catalogs data by api
     */
    public async fillCatalogsData(): Promise<void> {
        const seasons = await superagent.get(DictionaryApi.seasons).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.seasons = seasons.body.data;

        const groupCriterias = await superagent.get(DictionaryApi.criteriaGroups).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.criteriaGroups = groupCriterias.body.data;

        const licenseType = await superagent.get(DictionaryApi.licTypes).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.licTypes = licenseType.body.data;

        const docTypes = await superagent.get(DictionaryApi.docTypes).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.docTypes = docTypes.body.data;

        const criteriaRanks = await superagent.get(DictionaryApi.criteriaRanks).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.rankCriteria = criteriaRanks.body.data;

        const criteriaTypes = await superagent.get(DictionaryApi.criteriaTypes).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.criteriaTypes = criteriaTypes.body.data;

        const requestStatus = await superagent.get(RequestApi.possibleRequestStates).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.licStatus = requestStatus.body.data;

        const docStatus = await superagent.get(RequestApi.possibleDocStates).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.docStatus = docStatus.body.data;

        const persons = await superagent.get(UserApi.findPerson).
        query({pageNum : 2, pageSize : 10}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.persons = persons.body.data;

        const critGrpExperts = await superagent.get(UserApi.clubExperts).
        query({rights : "request.checkExpert"}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.critGrpExperts = critGrpExperts.body.data;

        const ofi = await superagent.get(InfraObjectsApi.findInfraObjects).
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.ofi = ofi.body.data;

        const organization = await superagent.get(UserApi.findOrganizations).
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.organization = organization.body.data;

        const roles = await superagent.get(AdminApi.addOrGetRoles).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.roles = roles.body.data;

        const rights = await superagent.get(AdminApi.rights).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.rights = rights.body.data;

        const commission = await superagent.get(CommissionApi.commissionTypes).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.commissionTypes = commission.body.data;

        const commissionDecision = await superagent.get(CommissionApi.commissionDecisions).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.commissionDecision = commissionDecision.body.data;

        const commissionTypeMembers = await superagent.get(AdminApi.addUser).
        query({pageNum : 0, pageSize : 10, rights : "commission.member"}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.commissionTypeMembers = commissionTypeMembers.body.data;
    }
}