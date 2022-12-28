import {TestData} from "../helpers/test-data";
import superagent from "superagent";
import {RequestProp} from "../helpers/request-prop";

export class Catalogs {
    public  seasons: TCurrentSeason[];
    public  criteriaGroups: TCriteriaGroups[];
    public  licTypes: TLicTypes[] ;
    public  docTypes: TDocTypes[] ;
    public  rankCriteria : TRankCriteria[];
    public  criteriaTypes : TCriteriaTypes[];
    public  licStatus : TLicAndDocStatus[];
    public  docStatus : TLicAndDocStatus[];
    public  critGrpExperts : TClubWorkers[];
    public  clubWorkers : TClubWorkers[];
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
    }
    public static getClubWorkersId (clubWorkers : TClubWorkers[]) : number[] {
        /**
         * Получаем id всех записей свойства clubWorkers (сотрудники клубов)
         */
        const clubWorkersId = clubWorkers.map(value => value.id);
        return clubWorkersId;
    }
    public static getCritGrpExpertsId (critGrpExperts : TClubWorkers[]) : number[] {
        /**
         * Получаем id всех записей свойства critGrpExperts (Эксперты групп критерив)
         */
        const critGrpExpertsId = critGrpExperts.map(value => value.id);
        return critGrpExpertsId;
    }
    public async fillCatalogsData () : Promise<void> {
        /**
         * Получаем данные из справочников и записываем их в свойства класса
         */
        const api = new RequestProp();
        for (const i of TestData.fileNames) {
            const files = await superagent.post(RequestProp.basicUrl + api.upload.upload).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", RequestProp.fileDir + i);
            TestData.addDataToFiles(i,files.body.data);
        }
        const seasons = await superagent.get(RequestProp.basicUrl + api.constructors.seasons);
        this.seasons = seasons.body.data.filter((value: TCurrentSeason, index: number, arr: TCurrentSeason[]) => (value.current || index == arr.length - 1));
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
        query(
            {
                pageNum : 0,
                pageSize : 10
            }
        )
        this.clubWorkers = clubWorkers.body.data;
        const critGrpExperts = await superagent.get(RequestProp.basicUrl+api.user.critGrpExperts).
        query(
            {
                rights : "request.checkExpert"
            }
        )
        this.critGrpExperts = critGrpExperts.body.data;
    }
}

export type TCurrentSeason = {
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