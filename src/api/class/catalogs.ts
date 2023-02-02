import superagent from "superagent";
import {Api} from "../helpers/api";

export class Catalogs {
    /**
     * seasons - Сезоны
     * criteriaGroups - Группы критериев
     * licTypes - Типы лицензий
     * docTypes - Типы документов
     * rankCriteria - Разряды критериев
     * criteriaTypes - Типы критериев
     * licStatus - Статусы заявки
     * docStatus - Типы документов
     * critGrpExperts - Эксперты группы критериев
     * clubWorkers - Сотрудники клубов
     * ofi - ОФИ
     * organization - Организации
     * roles - Роли
     * rights - Права
     */
    public  seasons: TSeasons[]
    public  criteriaGroups: TCriteriaGroups[]
    public  licTypes: TLicTypes[]
    public  docTypes: TDocTypes[]
    public  rankCriteria : TRankCriteria[]
    public  criteriaTypes : TCriteriaTypes[]
    public  licStatus : TLicAndDocStatus[]
    public  docStatus : TLicAndDocStatus[]
    public  critGrpExperts : TClubWorkers[]
    public  clubWorkers : TClubWorkers[]
    public  ofi : TOfi[]
    public organization : TOrganization[]
    public roles : TRoles[]
    public rights : TRights[]
    constructor() {
        this.seasons =[]
        this.criteriaGroups =[]
        this.licTypes =[]
        this.docTypes =[]
        this.rankCriteria =[]
        this.criteriaTypes =[]
        this.licStatus =[]
        this.docStatus =[]
        this.critGrpExperts =[]
        this.clubWorkers =[]
        this.ofi =[]
        this.organization =[]
        this.roles =[]
        this.rights=[]
    }
    /**
     * ids of dictionary elements "Club workers"
     */
    public get clubWorkersId () : number[] {
        return this.clubWorkers.map(value => value.id);
    }
    /**
     * ids of dictionary elements "Criteria groups"
     */
    public get criteriaGrpId() : number[] {
        return this.criteriaGroups.map(value => value.id);
    }
    /**
     * ids of dictionary elements "Criteria groups experts"
     */
    public get critGrpExpertsId () : number[] {
        return this.critGrpExperts.map(value => value.id);
    }
    /**
     * id всех записей свойства ofi
     */
    public get ofiId () : number[] {
        return this.ofi.map(value => value.id);
    }
    /**
     * id всех записей свойства organization
     */
    public get orgId () : number[] {
        return this.organization.map(value => value.id);
    }
    /**
     * Получение объекта со статусом заявки "Выдана"
     */
    public get issuedLicStatus () : TLicAndDocStatus {
        return this.licStatus.find(value => value.name == 'Выдана')!;
    }
    /**
     * ids of dictionary elements "Roles"
     */
    public get rolesId() : number[] {
        return this.roles.map(value => value.id);
    }
    /**
     * ids of dictionary elements "Rights"
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
     * Получить id всех возможных типов документов в зависимости от типа критерия
     */
    public docTypesForCrit (criteriaType : TCriteriaTypes) : TDocTypes[] {
        switch (criteriaType.name) {
            case "Документы" : return this.docTypes.filter(value => (value.id != 3 && value.id != 4 && value.id != 7 && value.id != 10));
            case "Участник" : return this.docTypes.filter(value => (value.id <= 3));
            default : return this.docTypes.filter(value => (value.id <= 2 || value.id == 10));
        }
    }
    /**
     * Получаем данные из справочников и записываем их в свойства объектов класса
     */
    public async fillCatalogsData () : Promise<void> {
        const api = new Api();
        const seasons = await superagent.get(api.basicUrl + api.constructors.seasons);
        this.seasons = seasons.body.data;
        const groupCriterias = await superagent.get(api.basicUrl + api.constructors.critGroups);
        this.criteriaGroups = groupCriterias.body.data;
        const licenseType = await superagent.get(api.basicUrl + api.constructors.licTypes);
        this.licTypes = licenseType.body.data;
        const docTypes = await superagent.get(api.basicUrl + api.constructors.docTypes);
        this.docTypes = docTypes.body.data;
        const criteriaRanks = await superagent.get(api.basicUrl + api.constructors.rankCriterias);
        this.rankCriteria = criteriaRanks.body.data;
        const criteriaTypes = await superagent.get(api.basicUrl + api.constructors.criteriaTypes);
        this.criteriaTypes = criteriaTypes.body.data;
        const requestStatus = await superagent.get(api.basicUrl + api.request.requestStatus);
        this.licStatus = requestStatus.body.data
        const docStatus = await superagent.get(api.basicUrl + api.request.docStatus);
        this.docStatus = docStatus.body.data;
        const clubWorkers = await superagent.get(api.basicUrl+api.user.clubWorkers).
        query({pageNum : 2, pageSize : 10});
        this.clubWorkers = clubWorkers.body.data;
        const critGrpExperts = await superagent.get(api.basicUrl+api.user.critGrpExperts).
        query({rights : "request.checkExpert"});
        this.critGrpExperts = critGrpExperts.body.data;
        const ofi = await superagent.get(api.basicUrl + api.infraObject.ofi).
        query({pageNum : 0, pageSize : 10});
        this.ofi = ofi.body.data;
        const organization = await superagent.get(api.basicUrl + api.user.organization).
        query({pageNum : 0, pageSize : 10});
        this.organization = organization.body.data;
        const roles = await superagent.get(api.basicUrl + api.admin.roles);
        this.roles = roles.body.data;
        const rights = await superagent.get(api.basicUrl + api.admin.rights);
        this.rights = rights.body.data;
    }
}

export type TSeasons = {
    id: number,
    current: boolean,
    dateStart: string,
    dateEnd: string,
    name: string
}
export type TCriteriaGroups = {
    id : number,
    name : string
}

export type TLicTypes = {
    id : number,
    name : string,
    sysName : string,
    description : string
}
export type TDocTypes = {
    id: number,
    name : string,
    description : string
}
export type TRankCriteria = {
    id : number,
    code : string,
    description : string
}
export type TCriteriaTypes = {
    id : number,
    name : string,
    description : string
}
export type TLicAndDocStatus = {
    id: number,
    name: string,
    description: string
}
export type TClubWorkers = {
    id: number,
    rfsId : number,
    fio : string,
    firstName : string,
    middleName : string,
    lastName : string,
    birthDate : string,
    orgName : string,
    position : string,
    sportRole : string
}
export type TOfi = {
    geo_lat: string,
    geo_lon: string,
    id: number,
    name: string,
    categoryName: string,
    typeName: string,
    typeSysName: string,
    favorite: boolean,
    address: string,
    logo: TLogo,
    status: {
        code: number,
        description: string
},
    timezone: string
}
export type TLogo = {
    id: number,
    fileName: string,
    contentType: string,
    size: number,
    dataLoad: string,
    hash: string,
    storageId: string
}
export type TOrganization = {
    geo_lat: string,
    geo_lon: string,
    id: number,
    shortName: string,
    fullName: string,
    namewithlegal: string,
    legalid: number,
    legalname: string,
    fullAddress: string,
    settlementWithType: string,
    city: string,
    cityOnLogin: string,
    district: string,
    discriminator: string,
    favorite: boolean,
    isDuplicate: boolean,
    logo: TLogo,
    parent: TParent,
    status: string,
    statusName: string,
    timezone: string,
    type: string
}
export type TParent = {
    id : number,
    fullName : string
}
export type TRoles = {
    id: number,
    name: string,
    description: string,
    isBase: boolean,
    isClub: boolean,
    rights: string[]
}
export type TRights = {
    id: string,
    name: string,
    description: string,
    children: TRights[]
}