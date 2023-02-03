import {TestData} from "../helpers/test-data";
import {Catalogs} from "./catalogs";
import superagent, {Response} from "superagent";
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
            description : TestData.descValue,
            docTypeId: this.catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
        this.prolicense.push(
            {
            name: TestData.randomWord,
            season: this.catalogs.seasons[0].name,
            type: this.catalogs.licTypes[0].name,
            requestBegin: TestData.currentDate,
            requestEnd: TestData.futureDate,
            dueDate: TestData.futureDate,
            docSubmitDate: TestData.futureDate,
            reviewDate: TestData.futureDate,
            decisionDate: TestData.futureDate,
            begin: TestData.currentDate,
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
            description : TestData.descValue,
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
    public fillProlicense (index : number,response : Response) : void {
        this.prolicense[index] = response.body.data;
    }
    /**
     * Создание тестовой пролицензии для сценария license.test.ts
     */
    public async createTestProlicense () : Promise<void> {
        const api = new Api();
        this.createProlicense();
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(this.getProlicense(0));
        this.fillProlicense(0,response);
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
    description : string
    docTypeId: number,
    templates: Templates[]
}
export type TSampleLicense = {
    type : string,
    season : string,
    name : string
}
export type Templates = {
    id?: number,
    name: string,
    storageId: string
}