import {TestData} from "../helpers/test-data";
import superagent from "superagent";
import {RequestProp} from "../helpers/request-prop";

export class Catalogs {
    public  seasons: TSeasons[];
    public  criteriaGroups: TCriteriaGroups[];
    public  licTypes: TLicTypes[];
    public  docTypes: TDocTypes[];
    public  rankCriteria : TRankCriteria[];
    public  criteriaTypes : TCriteriaTypes[];
    public  licStatus : TLicAndDocStatus[];
    public  docStatus : TLicAndDocStatus[];
    public  critGrpExperts : TClubWorkers[];
    public  clubWorkers : TClubWorkers[];
    public  ofi : TOfi[];
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
    }
    /**
     * id всех записей свойства clubWorkers (сотрудники клубов)
     */
    public static getClubWorkersId (clubWorkers : TClubWorkers[]) : number[] {
        const clubWorkersId = clubWorkers.map(value => value.id);
        return clubWorkersId;
    }
    /**
     * id всех записей свойства critGrpExperts (Эксперты групп критерив)
     */
    public static getCritGrpExpertsId (critGrpExperts : TClubWorkers[]) : number[] {
        const critGrpExpertsId = critGrpExperts.map(value => value.id);
        return critGrpExpertsId;
    }
    /**
     * id всех возможных типов документов для типа критерия : Документы
     */
    public static getDocTypesForCrit (docTypes : TDocTypes[]) : TDocTypes[] {
        return docTypes.filter(value => (value.id != 3 && value.id != 4 && value.id != 7 && value.id != 10));
    }
    /**
     * id всех записей свойства ofi
     */
    public static getOfiId (ofi : TOfi[]) {
        return ofi.map(value => value.id);
    }
    /**
     * Получаем данные из справочников и записываем их в свойства
     */
    public async fillCatalogsData () : Promise<void> {
        const api = new RequestProp();
        for (const i of TestData.fileNames) {
            const files = await superagent.post(RequestProp.basicUrl + api.upload.upload).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", RequestProp.fileDir + i);
            TestData.addDataToFiles(i,files.body.data);
        }
        const seasons = await superagent.get(RequestProp.basicUrl + api.constructors.seasons);
        this.seasons = seasons.body.data;
        const groupCriterias = await superagent.get(RequestProp.basicUrl + api.constructors.critGroups);
        this.criteriaGroups = groupCriterias.body.data;
        const licenseType = await superagent.get(RequestProp.basicUrl + api.constructors.licTypes);
        this.licTypes = licenseType.body.data;
        const docTypes = await superagent.get(RequestProp.basicUrl + api.constructors.docTypes);
        this.docTypes = docTypes.body.data;
        const criteriaRanks = await superagent.get(RequestProp.basicUrl + api.constructors.rankCriterias);
        this.rankCriteria = criteriaRanks.body.data;
        const criteriaTypes = await superagent.get(RequestProp.basicUrl + api.constructors.criteriaTypes);
        this.criteriaTypes = criteriaTypes.body.data;
        const requestStatus = await superagent.get(RequestProp.basicUrl + api.request.requestStatus);
        this.licStatus = requestStatus.body.data
        const docStatus = await superagent.get(RequestProp.basicUrl + api.request.docStatus);
        this.docStatus = docStatus.body.data;
        const clubWorkers = await superagent.get(RequestProp.basicUrl+api.user.clubWorkers).
        query({pageNum : 0, pageSize : 10});
        this.clubWorkers = clubWorkers.body.data;
        const critGrpExperts = await superagent.get(RequestProp.basicUrl+api.user.critGrpExperts).
        query({rights : "request.checkExpert"});
        this.critGrpExperts = critGrpExperts.body.data;
        const ofi = await superagent.get(RequestProp.basicUrl + api.infraObject.ofi).
        query({pageNum : 0, pageSize : 10});
        this.ofi = ofi.body.data;
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
    id:number,
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