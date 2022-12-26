import {TestData} from "./test-data";
import superagent from "superagent";
import {RequestProp} from "./request-prop";
import {expect} from "@jest/globals";

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
        const clubWorkersId = clubWorkers.map(value => value.id);
        return clubWorkersId;
    }
    public static  getCritGrpExpertsId (critGrpExperts : TClubWorkers[]) : number[] {
        const critGrpExpertsId = critGrpExperts.map(value => value.id);
        return critGrpExpertsId;
    }
    public async fillCatalogsData () : Promise<void> {
        //Загрузка файлов на сервер
        for (const i of TestData.fileNames) {
            const files = await superagent.post(RequestProp.basicUrl + "/api/rest/uploadFile").
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", RequestProp.fileDir + i);
            TestData.addDataToFiles(i,files.body.data);
        }
        //Справочник сезонов
        const seasons = await superagent.get(RequestProp.basicUrl + "/api/rest/seasons");
        //Записываем полученные значения текущего сезона и последнего сезона справочника в свойство seasons
        this.seasons = seasons.body.data.filter((value: TCurrentSeason, index: number, arr: TCurrentSeason[]) => (value.current || index == arr.length - 1));
        //Справочник групп критериев
        const groupCriterias = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/criterias/groups");
        this.criteriaGroups = groupCriterias.body.data;
        //Справочник Типы лицензий
        const licenseType = await superagent.get(RequestProp.basicUrl + "/api/rest/lictypes");
        this.licTypes = licenseType.body.data;
        //Справочник Типы документов
        const docTypes = await superagent.get(RequestProp.basicUrl + "/api/rest/doctypes");
        this.docTypes = docTypes.body.data;
        //Справочник Разряды для критериев
        const criteriaRanks = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/categories");
        this.rankCriteria = criteriaRanks.body.data;
        //Типы критериев
        const criteriaTypes = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/types");
        this.criteriaTypes = criteriaTypes.body.data;
        //Статусы заявки
        const requestStatus = await superagent.get(RequestProp.basicUrl+"/api/rest/licenses/states");
        this.licStatus = requestStatus.body.data
        //Статусы документов
        const docStatus = await superagent.get(RequestProp.basicUrl+"/api/rest/licenses/docstates");
        this.docStatus = docStatus.body.data;
        //Сотрудники клуба
        const clubWorkers = await superagent.get(RequestProp.basicUrl+"/api/rest/persons/findbyparams").
        query(
            {
                pageNum : 0,
                pageSize : 10
            }
        )
        this.clubWorkers = clubWorkers.body.data;
        //Эксперты групп критериев
        const critGrpExperts = await superagent.get(RequestProp.basicUrl+"/api/rest/persons/withRights").
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