import {TestData} from "../helpers/test-data";
import {Catalogs, TSeasons, TDocTypes, TLicTypes} from "./catalogs";
import superagent from "superagent";
import {Api} from "../helpers/api";

export class Prolicense {
    public  prolicense : TProlicense[];
    public catalogs = new Catalogs();
    constructor() {
        this.prolicense =[]
    }
    /**
     * Создание пролицензии
     */
    public createProlicense() : void {
        const docArray : TDocuments[] = [...Array(5)].fill(
            {
            name: TestData.randomWord,
            docTypeId: this.catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
        this.prolicense.push(
            {
            name: TestData.randomWord,
            season: this.catalogs.seasons[0].name,
            type: this.catalogs.licTypes[0].name,
            requestBegin: TestData.todayDate,
            requestEnd: TestData.futureDate,
            dueDate: TestData.futureDate,
            docSubmitDate: TestData.futureDate,
            reviewDate: TestData.futureDate,
            decisionDate: TestData.futureDate,
            begin: TestData.todayDate,
            end: TestData.futureDate,
            documents: docArray
        }
        )
    }
    /**
     * Изменение пролицензии:
     * 1. Наименование
     * 2. Тип
     * 3. Сезон
     * 4. Добавление документа
     */
    public changeProlicense () {
        this.prolicense[0].name = TestData.randomWord;
        this.prolicense[0].type = this.catalogs.licTypes[this.catalogs.licTypes.length-1].name;
        this.prolicense[0].season = this.catalogs.seasons[this.catalogs.seasons.length-1].name;
        this.prolicense[0].documents.push(
            {
            name: TestData.randomWord,
            docTypeId: this.catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
    }
    /**
     * Создание пролицензии по образцу
     */
    public createSampleProlicense () : TSampleLicense {
        return {
            type : this.catalogs.licTypes[0].name,
            season : this.catalogs.seasons[0].name,
            name : TestData.randomWord
        }
    }
    /**
     * Получение пролицензии по индексу массива свойста prolicense
     */
    public getProlicense (index : number) : TProlicense {
        return this.prolicense[index];
    }
    /**
     * Добавление тела ответа в массив свойства prolicense
     */
    public addRespToProlic (index : number,response : TProlicense) : void {
        this.prolicense[index] = response;
    }
    /**
     * Создание тестовой пролицензии для сценария license.test.ts
     */
    public async createTestProlicense () : Promise<void> {
        const api = new Api();
        this.createProlicense();
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(this.getProlicense(0));
        this.addRespToProlic(0,response.body.data);
    }
}

export type TProlicense = {
    id?: number
    type: string
    season: string
    name: string
    begin: string
    end: string
    requestBegin: string
    requestEnd: string
    docSubmitDate: string
    dueDate: string
    reviewDate: string
    decisionDate: string
    stateId? : number
    documents :  TDocuments[]
}

export type TDocuments = {
    id?: number
    name: string,
    docTypeId: number,
    templates: {
        id?: number,
        name: string,
        storageId: string
    }[]
}
export type TSampleLicense = {
    type : string,
    season : string,
    name : string
}